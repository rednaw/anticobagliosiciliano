import { baglioLocation } from '$lib/data/content';

export const OPEN_METEO_ORIGIN = 'https://api.open-meteo.com';
export const WEATHER_FETCH_MS = 3_500;

export type WeatherBucket = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';

export type WeatherReading = {
  temperatureC: number;
  bucket: WeatherBucket;
  /** Open-Meteo `is_day` (1/0); defaults true when absent. */
  isDay: boolean;
};

/** WMO weather interpretation codes → coarse UI buckets (Open-Meteo). */
export function weatherBucketFromCode(code: number): WeatherBucket | null {
  if (!Number.isFinite(code) || code < 0) return null;
  if (code === 0) return 'clear';
  if (code <= 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95 && code <= 99) return 'storm';
  return null;
}

/** Meteocons monochrome stem under `/images/weather/{stem}.svg` (vendored MIT). */
export function weatherIconStem(bucket: WeatherBucket, isDay = true): string {
  if (bucket === 'clear') return isDay ? 'clear-day' : 'clear-night';
  if (bucket === 'storm') return 'thunderstorms';
  return bucket;
}

export function parseOpenMeteoCurrent(payload: unknown): WeatherReading | null {
  if (!payload || typeof payload !== 'object') return null;
  const current = (payload as { current?: unknown }).current;
  if (!current || typeof current !== 'object') return null;
  const rec = current as {
    temperature_2m?: unknown;
    weather_code?: unknown;
    is_day?: unknown;
  };
  const temperatureC = Number(rec.temperature_2m);
  const code = Number(rec.weather_code);
  if (!Number.isFinite(temperatureC)) return null;
  const bucket = weatherBucketFromCode(code);
  if (!bucket) return null;
  const isDay = rec.is_day === undefined || rec.is_day === null ? true : Number(rec.is_day) === 1;
  return { temperatureC: Math.round(temperatureC), bucket, isDay };
}

export function openMeteoForecastUrl(
  lat = baglioLocation.lat,
  lon = baglioLocation.lon
): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,weather_code,is_day',
    timezone: 'Europe/Rome'
  });
  return `${OPEN_METEO_ORIGIN}/v1/forecast?${params}`;
}

/**
 * Fetch current conditions. Soft-fails to `null` on timeout, HTTP, or parse errors.
 * Does not throw.
 */
export async function fetchBaglioWeather(
  options: {
    lat?: number;
    lon?: number;
    fetchImpl?: typeof fetch;
    timeoutMs?: number;
    signal?: AbortSignal;
  } = {}
): Promise<WeatherReading | null> {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  if (typeof fetchImpl !== 'function') return null;

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? WEATHER_FETCH_MS;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onOuterAbort = () => controller.abort();
  options.signal?.addEventListener('abort', onOuterAbort, { once: true });

  try {
    const response = await fetchImpl(openMeteoForecastUrl(options.lat, options.lon), {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) return null;
    return parseOpenMeteoCurrent(await response.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', onOuterAbort);
  }
}
