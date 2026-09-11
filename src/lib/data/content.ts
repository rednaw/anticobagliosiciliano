import type { Locale, LocalizedString } from '$lib/locale';
import { localize } from '$lib/locale';
import amenitiesYaml from '../../content/amenities.yml';
import arriveYaml from '../../content/arrive.yml';
import awardsYaml from '../../content/awards.yml';
import contactYaml from '../../content/contact.yml';
import homeYaml from '../../content/home.yml';
import casa1 from '../../content/houses/casa-1.yml';
import casa2 from '../../content/houses/casa-2.yml';
import casa3 from '../../content/houses/casa-3.yml';
import casa4 from '../../content/houses/casa-4.yml';
import imperdibiliYaml from '../../content/imperdibili.yml';
import cappellaPalatina from '../../content/places/cappella-palatina.yml';
import duomoDiMonreale from '../../content/places/duomo-di-monreale.yml';
import erice from '../../content/places/erice.yml';
import riservaDelloZingaro from '../../content/places/riserva-dello-zingaro.yml';
import ruderiDiGibellina from '../../content/places/ruderi-di-gibellina.yml';
import salineDiTrapani from '../../content/places/saline-di-trapani.yml';
import segesta from '../../content/places/segesta.yml';
import selinunte from '../../content/places/selinunte.yml';
import privacyYaml from '../../content/privacy.yml';
import accommodationYaml from '../../content/accommodation.yml';
import siteYaml from '../../content/site.yml';

/** Marketing copy. Tagline stays Italian in both languages. Inbox is `contact.yml`. */

type AccommodationCopy = {
  single: LocalizedString;
  plural: LocalizedString;
  highlights: LocalizedString;
  otherHouses: LocalizedString;
  keepExploring: LocalizedString;
  notFound: LocalizedString;
  gallery: LocalizedString;
  previousPhoto: LocalizedString;
  nextPhoto: LocalizedString;
  thumbnails: LocalizedString;
  goToPhoto: LocalizedString;
};

type SiteCopy = {
  name: string;
  tagline: string;
  location: LocalizedString;
  description: LocalizedString;
  skipToContent: LocalizedString;
  mainNav: LocalizedString;
  language: LocalizedString;
  menu: LocalizedString;
  closeMenu: LocalizedString;
  videoPlay: LocalizedString;
  videoReplay: LocalizedString;
  videoUnsupported: LocalizedString;
  pageNotFoundTitle: LocalizedString;
  pageNotFoundBody: LocalizedString;
  pageErrorTitle: LocalizedString;
  pageErrorBody: LocalizedString;
};

type HouseCapacity = {
  guestMin: number;
  guestMax: number;
  bedroomCount: number;
  bathroomCount: number;
  floorAreaSqm: number;
};

type HouseSource = {
  slug: string;
  name: string;
  tagline: LocalizedString;
  summary: LocalizedString;
  guests: LocalizedString;
  size: string;
  bedrooms: LocalizedString;
  bathrooms: LocalizedString;
  capacity: HouseCapacity;
  image: string;
  gallery: string[];
  paragraphs: LocalizedString;
  highlights: LocalizedString[];
};

export const housesSource: HouseSource[] = [casa1, casa2, casa3, casa4] as HouseSource[];

export function houses(locale: Locale = 'it') {
  return localize(housesSource, locale);
}

export function getHouse(slug: string, locale: Locale = 'it') {
  const source = housesSource.find((h) => h.slug === slug);
  return source ? localize(source, locale) : undefined;
}

type AmenitySource = { title: LocalizedString; detail: LocalizedString };

type AwardSource = {
  title: LocalizedString;
  text: LocalizedString;
  image: string;
  proof?: { href: string; label: LocalizedString };
};

type HomeCopy = {
  title: LocalizedString;
  portone: {
    lead: LocalizedString;
    wide: string;
    tall: string;
    alt: LocalizedString;
  };
  video: {
    alt: LocalizedString;
  };
  chiSiamo: { title: LocalizedString; body: LocalizedString };
  houses: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    lead: LocalizedString;
    more: LocalizedString;
  };
  cortile: {
    image: string;
    alt: LocalizedString;
    eyebrow: LocalizedString;
    title: LocalizedString;
    lead: LocalizedString;
    body: LocalizedString;
  };
  giardino: {
    image: string;
    alt: LocalizedString;
    agrumeto: string;
    agrumetoAlt: LocalizedString;
    eyebrow: LocalizedString;
    title: LocalizedString;
    paragraphs: LocalizedString;
  };
  places: { title: LocalizedString; lead: LocalizedString };
  cta: { title: LocalizedString; body: LocalizedString };
};

type AmenitiesCopy = {
  eyebrow: LocalizedString;
  title: LocalizedString;
  items: AmenitySource[];
};

type AwardsCopy = {
  eyebrow: LocalizedString;
  title: LocalizedString;
  items: AwardSource[];
};

export const amenitiesCopy = amenitiesYaml as AmenitiesCopy;

export function amenities(locale: Locale = 'it') {
  return localize(amenitiesCopy, locale);
}

export const awardsCopy = awardsYaml as AwardsCopy;

export function awards(locale: Locale = 'it') {
  return localize(awardsCopy, locale);
}

export const homeCopy = homeYaml as HomeCopy;

type PlaceImageCredit = {
  author: string;
  sourceUrl: string;
  licenseUrl: string;
  license: string;
};

type PlaceSource = {
  slug: string;
  name: LocalizedString;
  time: string;
  text: LocalizedString;
  image: string;
  imageCredit?: PlaceImageCredit;
  location?: { lat: number; lon: number };
  directionsLabel?: LocalizedString;
  website?: { href: LocalizedString; label: LocalizedString };
};

export const placesSource: PlaceSource[] = [
  segesta,
  riservaDelloZingaro,
  duomoDiMonreale,
  cappellaPalatina,
  selinunte,
  salineDiTrapani,
  erice,
  ruderiDiGibellina
] as PlaceSource[];

export function places(locale: Locale = 'it') {
  return localize(placesSource, locale);
}

type ImperdibiliYaml = {
  title: LocalizedString;
  meta: LocalizedString;
  lead: LocalizedString;
  directions: {
    routeTitle: LocalizedString;
    moreInfoTitle: LocalizedString;
    googleLabel: LocalizedString;
    osmLabel: LocalizedString;
  };
  photoCredits: {
    title: LocalizedString;
    photo: LocalizedString;
    metaDescription: LocalizedString;
    lead: LocalizedString;
  };
};

const imperdibili = imperdibiliYaml as ImperdibiliYaml;

export const imperdibiliTitle = imperdibili.title;

export const imperdibiliMeta = imperdibili.meta;

export const imperdibiliLead = imperdibili.lead;

export const imperdibiliRouteCopy = imperdibili.directions;

export const imperdibiliPhotoCreditsCopy = imperdibili.photoCredits;

type WeatherCopy = {
  place: LocalizedString;
  line: LocalizedString;
  aria: LocalizedString;
  credit: LocalizedString;
  creditTitle: LocalizedString;
  clear: LocalizedString;
  cloudy: LocalizedString;
  fog: LocalizedString;
  rain: LocalizedString;
  snow: LocalizedString;
  storm: LocalizedString;
};

type ArriveYaml = {
  title: LocalizedString;
  metaDescription: LocalizedString;
  lead: LocalizedString;
  mapAlt: LocalizedString;
  airTitle: LocalizedString;
  air: LocalizedString;
  roadTitle: LocalizedString;
  road: LocalizedString;
  directionsOriginLabel: LocalizedString;
  maps: { google: LocalizedString; osm: LocalizedString };
  mapCredit: LocalizedString;
  mapCreditTitle: LocalizedString;
  weather: WeatherCopy;
};

const {
  directionsOriginLabel,
  maps: arriveMapLabels,
  weather: weatherYaml,
  ...arriveRest
} = arriveYaml as ArriveYaml;

export const weatherCopy = weatherYaml;

export const arriveCopy = arriveRest as Record<string, LocalizedString>;

const MAP_LINKS = [
  {
    id: 'google',
    href: 'https://maps.app.goo.gl/NA1BwasQVcFzn1qHA'
  },
  {
    id: 'osm',
    href: 'https://www.openstreetmap.org/?mlat=38.0250627&mlon=13.0150391#map=16/38.0250627/13.0150391'
  }
] as const;

export const baglioLocation = {
  lat: 38.0250627,
  lon: 13.0150391,
  /** Public-road point for driving directions (not the courtyard pin). */
  directionsOrigin: {
    lat: 38.026081,
    lon: 13.017571
  },
  directionsOriginLabel,
  map: '/images/ambiance/mappa.jpg',
  links: MAP_LINKS.map((link) => ({
    ...link,
    label: arriveMapLabels[link.id]
  }))
};

const { inbox, ...contactRest } = contactYaml as { inbox: string } & Record<string, LocalizedString>;

export { inbox };

export const contactCopy = contactRest;

export const accommodationCopy = accommodationYaml as AccommodationCopy;

export const site = siteYaml as SiteCopy;

export const privacyCopy = privacyYaml as Record<string, LocalizedString>;
