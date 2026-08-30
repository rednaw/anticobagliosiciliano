import { describe, expect, it } from 'vitest';
import {
  googleDirectionsUrl,
  googleMapsLinkWithLocale,
  osmDirectionsUrl
} from './place-directions';

const baglioOrigin = {
  lat: 38.026081,
  lon: 13.017571,
  label: 'Antico Baglio Siciliano, Balestrate PA, Italy'
};
const segestaParking = {
  lat: 37.9478139,
  lon: 12.827791,
  label: 'Segesta car park, Calatafimi Segesta'
};

describe('place directions', () => {
  it('builds Google Maps directions URL with place labels and UI language', () => {
    expect(googleDirectionsUrl(baglioOrigin, segestaParking, 'it')).toBe(
      'https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=Antico+Baglio+Siciliano%2C+Balestrate+PA%2C+Italy&destination=Segesta+car+park%2C+Calatafimi+Segesta&hl=it'
    );
    expect(googleDirectionsUrl(baglioOrigin, segestaParking, 'en')).toContain('&hl=en');
  });

  it('adds Google Maps UI language to a click-out link', () => {
    expect(
      googleMapsLinkWithLocale('https://maps.app.goo.gl/NA1BwasQVcFzn1qHA', 'it')
    ).toBe('https://maps.app.goo.gl/NA1BwasQVcFzn1qHA?hl=it');
  });

  it('builds OpenStreetMap directions URL from public-road coordinates', () => {
    expect(osmDirectionsUrl(baglioOrigin, segestaParking)).toBe(
      'https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=38.026081,13.017571;37.9478139,12.827791'
    );
  });
});
