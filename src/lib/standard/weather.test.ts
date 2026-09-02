import { describe, expect, it, vi } from 'vitest';
import {
  fetchBaglioWeather,
  openMeteoForecastUrl,
  parseOpenMeteoCurrent,
  weatherBucketFromCode,
  weatherIconStem
} from './weather';

describe('weatherBucketFromCode', () => {
  it('maps WMO codes into coarse buckets', () => {
    expect(weatherBucketFromCode(0)).toBe('clear');
    expect(weatherBucketFromCode(1)).toBe('cloudy');
    expect(weatherBucketFromCode(2)).toBe('cloudy');
    expect(weatherBucketFromCode(3)).toBe('cloudy');
    expect(weatherBucketFromCode(45)).toBe('fog');
    expect(weatherBucketFromCode(48)).toBe('fog');
    expect(weatherBucketFromCode(51)).toBe('rain');
    expect(weatherBucketFromCode(55)).toBe('rain');
    expect(weatherBucketFromCode(56)).toBe('rain');
    expect(weatherBucketFromCode(61)).toBe('rain');
    expect(weatherBucketFromCode(67)).toBe('rain');
    expect(weatherBucketFromCode(71)).toBe('snow');
    expect(weatherBucketFromCode(77)).toBe('snow');
    expect(weatherBucketFromCode(80)).toBe('rain');
    expect(weatherBucketFromCode(82)).toBe('rain');
    expect(weatherBucketFromCode(85)).toBe('snow');
    expect(weatherBucketFromCode(86)).toBe('snow');
    expect(weatherBucketFromCode(95)).toBe('storm');
    expect(weatherBucketFromCode(96)).toBe('storm');
    expect(weatherBucketFromCode(99)).toBe('storm');
  });

  it('rejects unknown codes', () => {
    expect(weatherBucketFromCode(-1)).toBeNull();
    expect(weatherBucketFromCode(40)).toBeNull();
    expect(weatherBucketFromCode(50)).toBeNull();
    expect(weatherBucketFromCode(70)).toBeNull();
    expect(weatherBucketFromCode(83)).toBeNull();
    expect(weatherBucketFromCode(94)).toBeNull();
    expect(weatherBucketFromCode(100)).toBeNull();
    expect(weatherBucketFromCode(Number.NaN)).toBeNull();
  });
});

describe('parseOpenMeteoCurrent', () => {
  it('reads temperature and weather_code from current', () => {
    expect(
      parseOpenMeteoCurrent({
        current: { temperature_2m: 24.4, weather_code: 0, is_day: 1 }
      })
    ).toEqual({ temperatureC: 24, bucket: 'clear', isDay: true });
  });

  it('treats is_day 0 as night', () => {
    expect(
      parseOpenMeteoCurrent({
        current: { temperature_2m: 18, weather_code: 0, is_day: 0 }
      })
    ).toEqual({ temperatureC: 18, bucket: 'clear', isDay: false });
  });

  it('defaults is_day to true when absent', () => {
    expect(
      parseOpenMeteoCurrent({
        current: { temperature_2m: 20, weather_code: 0 }
      })
    ).toEqual({ temperatureC: 20, bucket: 'clear', isDay: true });
  });

  it('rounds negative temperatures toward nearest integer', () => {
    expect(
      parseOpenMeteoCurrent({
        current: { temperature_2m: -1.6, weather_code: 71, is_day: 1 }
      })
    ).toEqual({ temperatureC: -2, bucket: 'snow', isDay: true });
  });

  it('soft-fails on missing or invalid payload', () => {
    expect(parseOpenMeteoCurrent(null)).toBeNull();
    expect(parseOpenMeteoCurrent({})).toBeNull();
    expect(parseOpenMeteoCurrent({ current: { temperature_2m: 'x', weather_code: 0 } })).toBeNull();
    expect(parseOpenMeteoCurrent({ current: { temperature_2m: 20 } })).toBeNull();
    expect(
      parseOpenMeteoCurrent({ current: { temperature_2m: 20, weather_code: 40 } })
    ).toBeNull();
  });
});

describe('weatherIconStem', () => {
  it('maps buckets to Meteocons monochrome stems', () => {
    expect(weatherIconStem('clear', true)).toBe('clear-day');
    expect(weatherIconStem('clear', false)).toBe('clear-night');
    expect(weatherIconStem('cloudy')).toBe('cloudy');
    expect(weatherIconStem('fog')).toBe('fog');
    expect(weatherIconStem('rain')).toBe('rain');
    expect(weatherIconStem('snow')).toBe('snow');
    expect(weatherIconStem('storm')).toBe('thunderstorms');
  });
});

describe('openMeteoForecastUrl', () => {
  it('points at api.open-meteo.com with baglio coords by default', () => {
    const url = openMeteoForecastUrl(38.0250627, 13.0150391);
    expect(url.startsWith('https://api.open-meteo.com/v1/forecast?')).toBe(true);
    expect(url).toContain('latitude=38.0250627');
    expect(url).toContain('longitude=13.0150391');
    expect(url).toContain('current=temperature_2m%2Cweather_code%2Cis_day');
    expect(url).toContain('timezone=Europe%2FRome');
  });
});

describe('fetchBaglioWeather', () => {
  it('returns a reading when fetch succeeds', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({ current: { temperature_2m: 21.2, weather_code: 3, is_day: 1 } })
    })) as unknown as typeof fetch;

    await expect(fetchBaglioWeather({ fetchImpl })).resolves.toEqual({
      temperatureC: 21,
      bucket: 'cloudy',
      isDay: true
    });
  });

  it('returns null on HTTP failure without throwing', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: false, json: async () => ({}) })) as unknown as typeof fetch;
    await expect(fetchBaglioWeather({ fetchImpl })).resolves.toBeNull();
  });

  it('returns null when json parsing throws', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => {
        throw new Error('bad json');
      }
    })) as unknown as typeof fetch;
    await expect(fetchBaglioWeather({ fetchImpl })).resolves.toBeNull();
  });

  it('returns null when fetchImpl is not a function', async () => {
    await expect(
      fetchBaglioWeather({ fetchImpl: false as unknown as typeof fetch })
    ).resolves.toBeNull();
  });

  it('returns null when aborted / timed out', async () => {
    const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
      const err = new Error('aborted');
      err.name = 'AbortError';
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(err));
      });
    }) as unknown as typeof fetch;

    await expect(fetchBaglioWeather({ fetchImpl, timeoutMs: 5 })).resolves.toBeNull();
  });
});
