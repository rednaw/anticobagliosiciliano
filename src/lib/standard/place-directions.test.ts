import { describe, expect, it } from 'vitest';
import { googleDirectionsUrl, osmDirectionsUrl } from './place-directions';

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
  it('builds Google Maps directions URL with place labels', () => {
    expect(googleDirectionsUrl(baglioOrigin, segestaParking)).toBe(
      'https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=Antico+Baglio+Siciliano%2C+Balestrate+PA%2C+Italy&destination=Segesta+car+park%2C+Calatafimi+Segesta'
    );
  });

  it('builds OpenStreetMap directions URL from public-road coordinates', () => {
    expect(osmDirectionsUrl(baglioOrigin, segestaParking)).toBe(
      'https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=38.026081,13.017571;37.9478139,12.827791'
    );
  });
});
