import type { CmsConfig, Field } from '@sveltia/cms';
import { SITE_BASE, SITE_HOSTNAME } from './site-config';

/**
 * Manual CMS init config (no config.yml). Live /admin/ → GitHub OAuth via
 * https://auth.rednaw.nl. Local: Local Repository.
 *
 * Do not enable Sveltia i18n — YAML is per-field `{ it, en }` (see src/content/).
 */
const publicOrigin = `https://${SITE_HOSTNAME}${SITE_BASE}`;

const itEnString: Field[] = [
  { name: 'it', label: 'Italiano', widget: 'string' },
  { name: 'en', label: 'English', widget: 'string' }
];

const itEnText: Field[] = [
  { name: 'it', label: 'Italiano', widget: 'text' },
  { name: 'en', label: 'English', widget: 'text' }
];

const itEnStringObject = (name: string, label: string): Field => ({
  name,
  label,
  widget: 'object',
  collapsed: true,
  fields: itEnString
});

const itEnTextObject = (name: string, label: string): Field => ({
  name,
  label,
  widget: 'object',
  collapsed: true,
  fields: itEnText
});

const houseFields: Field[] = [
  { name: 'name', label: 'Nome', widget: 'string' },
  { name: 'image', label: 'Foto copertina', widget: 'image' },
  itEnStringObject('tagline', 'Tagline'),
  itEnTextObject('summary', 'Sommario'),
  itEnStringObject('guests', 'Ospiti'),
  itEnStringObject('bedrooms', 'Camere'),
  itEnStringObject('bathrooms', 'Bagni'),
  {
    name: 'paragraphs',
    label: 'Testo',
    widget: 'object',
    hint: 'Riga vuota = nuovo paragrafo.',
    fields: itEnText
  },
  {
    name: 'highlights',
    label: 'In evidenza',
    widget: 'list',
    summary: '{{it}}',
    fields: itEnString
  },
  { name: 'gallery', label: 'Galleria', widget: 'image', multiple: true },
  { name: 'slug', widget: 'hidden' },
  { name: 'size', widget: 'hidden' },
  {
    name: 'capacity',
    label: 'Capacità',
    widget: 'object',
    collapsed: true,
    hint: 'Non cambiare — allineata a Lodgify.',
    fields: [
      { name: 'guestMin', label: 'Ospiti min', widget: 'number', value_type: 'int' },
      { name: 'guestMax', label: 'Ospiti max', widget: 'number', value_type: 'int' },
      { name: 'bedroomCount', label: 'Camere', widget: 'number', value_type: 'int' },
      { name: 'bathroomCount', label: 'Bagni', widget: 'number', value_type: 'int' },
      { name: 'floorAreaSqm', label: 'Mq', widget: 'number', value_type: 'int' }
    ]
  }
];

function casaFile(n: 1 | 2 | 3 | 4) {
  return {
    name: `casa-${n}`,
    label: `Casa ${n}`,
    file: `src/content/houses/casa-${n}.yml`,
    format: 'yaml' as const,
    media_folder: `/static/images/houses/casa-${n}`,
    public_folder: `/images/houses/casa-${n}`,
    fields: houseFields
  };
}

export const cmsConfig = {
  backend: {
    name: 'github',
    repo: 'rednaw/anticobagliosiciliano',
    branch: 'main',
    skip_ci: false,
    base_url: 'https://auth.rednaw.nl',
    auth_methods: ['oauth']
  },
  site_url: publicOrigin,
  display_url: publicOrigin,
  output: {
    omit_empty_optional_fields: true
  },
  media_folder: 'static/images',
  public_folder: '/images',
  collections: [
    {
      name: 'pages',
      label: 'Pagine',
      editor: { preview: false },
      files: [
        {
          name: 'home',
          label: 'Home',
          file: 'src/content/pages/home.yml',
          format: 'yaml',
          media_folder: '/static/images/ambiance',
          public_folder: '/images/ambiance',
          fields: [
            itEnStringObject('title', 'Titolo'),
            {
              name: 'brand',
              label: 'Marchio',
              widget: 'object',
              fields: [
                { name: 'name', label: 'Nome', widget: 'string' },
                { name: 'tagline', label: 'Tagline (resta in italiano)', widget: 'string' },
                {
                  name: 'description',
                  label: 'Descrizione (SEO)',
                  widget: 'object',
                  collapsed: true,
                  fields: itEnText
                }
              ]
            },
            {
              name: 'portone',
              label: 'Portone',
              widget: 'object',
              fields: [
                itEnTextObject('lead', 'Sottotitolo'),
                { name: 'wide', label: 'Largo', widget: 'image' },
                { name: 'tall', label: 'Alto', widget: 'image' },
                itEnStringObject('alt', 'Testo alternativo')
              ]
            },
            {
              name: 'video',
              label: 'Video',
              widget: 'object',
              collapsed: true,
              fields: [itEnStringObject('alt', 'Testo alternativo')]
            },
            {
              name: 'chiSiamo',
              label: 'Chi siamo',
              widget: 'object',
              fields: [
                itEnStringObject('title', 'Titolo'),
                itEnTextObject('body', 'Testo')
              ]
            },
            {
              name: 'houses',
              label: 'Case (blocco)',
              widget: 'object',
              fields: [
                itEnStringObject('eyebrow', 'Sopratitolo'),
                itEnStringObject('title', 'Titolo'),
                itEnTextObject('lead', 'Intro'),
                itEnStringObject('more', 'Link')
              ]
            },
            {
              name: 'cortile',
              label: 'Cortile',
              widget: 'object',
              fields: [
                { name: 'image', label: 'Foto', widget: 'image' },
                itEnStringObject('alt', 'Testo alternativo'),
                itEnStringObject('eyebrow', 'Sopratitolo'),
                itEnStringObject('title', 'Titolo'),
                itEnTextObject('lead', 'Intro'),
                itEnTextObject('body', 'Testo')
              ]
            },
            {
              name: 'giardino',
              label: 'Giardino',
              widget: 'object',
              fields: [
                { name: 'image', label: 'Foto giardino', widget: 'image' },
                itEnStringObject('alt', 'Testo alternativo giardino'),
                { name: 'agrumeto', label: 'Foto agrumeto', widget: 'image' },
                itEnStringObject('agrumetoAlt', 'Testo alternativo agrumeto'),
                itEnStringObject('eyebrow', 'Sopratitolo'),
                itEnStringObject('title', 'Titolo'),
                {
                  name: 'paragraphs',
                  label: 'Testo',
                  widget: 'object',
                  hint: 'Riga vuota = nuovo paragrafo.',
                  fields: itEnText
                }
              ]
            },
            {
              name: 'places',
              label: 'Imperdibili (blocco)',
              widget: 'object',
              fields: [
                itEnStringObject('title', 'Titolo'),
                itEnTextObject('lead', 'Intro')
              ]
            },
            {
              name: 'cta',
              label: 'Invito',
              widget: 'object',
              fields: [
                itEnStringObject('title', 'Titolo'),
                itEnTextObject('body', 'Testo')
              ]
            }
          ]
        },
        {
          name: 'amenities',
          label: 'Servizi',
          file: 'src/content/pages/amenities.yml',
          format: 'yaml',
          fields: [
            itEnStringObject('eyebrow', 'Sopratitolo'),
            itEnStringObject('title', 'Titolo'),
            {
              name: 'items',
              label: 'Servizi',
              widget: 'list',
              summary: '{{title.it}}',
              fields: [
                itEnStringObject('title', 'Titolo'),
                itEnStringObject('detail', 'Dettaglio')
              ]
            }
          ]
        },
        {
          name: 'awards',
          label: 'Premi',
          file: 'src/content/pages/awards.yml',
          format: 'yaml',
          media_folder: '/static/images/awards',
          public_folder: '/images/awards',
          fields: [
            itEnStringObject('eyebrow', 'Sopratitolo'),
            itEnStringObject('title', 'Titolo'),
            {
              name: 'items',
              label: 'Premi',
              widget: 'list',
              summary: '{{title.it}}',
              fields: [
                itEnStringObject('title', 'Titolo'),
                itEnTextObject('text', 'Testo'),
                {
                  name: 'proof',
                  label: 'Link prova',
                  widget: 'object',
                  required: false,
                  collapsed: true,
                  fields: [
                    { name: 'href', label: 'URL', widget: 'string' },
                    itEnStringObject('label', 'Etichetta')
                  ]
                },
                { name: 'image', label: 'Logo', widget: 'image' }
              ]
            }
          ]
        },
        {
          name: 'contact',
          label: 'Contatti',
          file: 'src/content/pages/contact.yml',
          format: 'yaml',
          fields: [
            { name: 'inbox', label: 'Inbox', widget: 'string' },
            itEnStringObject('title', 'Titolo'),
            itEnTextObject('metaDescription', 'Descrizione (SEO)'),
            itEnStringObject('eyebrow', 'Sopratitolo'),
            itEnTextObject('lead', 'Intro'),
            itEnStringObject('direct', 'Scrivi direttamente'),
            itEnTextObject('hint', 'Nota invio'),
            itEnStringObject('submit', 'Pulsante'),
            itEnStringObject('name', 'Nome'),
            itEnStringObject('email', 'Email'),
            itEnStringObject('checkIn', 'Check-in'),
            itEnStringObject('checkOut', 'Check-out'),
            itEnStringObject('datePlaceholder', 'Segnaposto data'),
            itEnStringObject('datePrevMonth', 'Mese precedente'),
            itEnStringObject('dateNextMonth', 'Mese successivo'),
            itEnStringObject('dateCalendar', 'Calendario'),
            itEnStringObject('dateMinStayHint', 'Soggiorno minimo'),
            itEnStringObject('dateUnavailable', 'Occupata'),
            itEnTextObject('occupancyBlocked', 'Date occupate'),
            itEnStringObject('housesFreeHint', 'Case libere'),
            itEnStringObject('fieldRequired', 'Campo obbligatorio'),
            itEnStringObject('emailInvalid', 'Email non valida'),
            itEnStringObject('adults', 'Adulti'),
            itEnStringObject('children', 'Bambini'),
            itEnStringObject('house', 'Alloggio'),
            itEnStringObject('houseAny', 'Nessuna preferenza'),
            itEnStringObject('message', 'Messaggio'),
            itEnStringObject('messagePlaceholder', 'Segnaposto messaggio'),
            itEnStringObject('messageTooLong', 'Messaggio troppo lungo'),
            itEnStringObject('messageUnsafe', 'Messaggio non valido'),
            itEnStringObject('mailName', 'Mailto nome'),
            itEnStringObject('mailEmail', 'Mailto email'),
            itEnStringObject('mailHouse', 'Mailto alloggio'),
            itEnStringObject('mailNoHouse', 'Mailto nessuna casa'),
            itEnStringObject('mailNoMessage', 'Mailto nessun messaggio'),
            itEnStringObject('mailGuest', 'Mailto ospite')
          ]
        },
        {
          name: 'arrive',
          label: 'Come arrivare',
          file: 'src/content/pages/arrive.yml',
          format: 'yaml',
          media_folder: '/static/images/arrive',
          public_folder: '/images/arrive',
          fields: [
            itEnStringObject('title', 'Titolo'),
            itEnTextObject('metaDescription', 'Descrizione (SEO)'),
            itEnStringObject('location', 'Località'),
            itEnTextObject('lead', 'Intro'),
            itEnTextObject('mapAlt', 'Alt mappa'),
            itEnStringObject('airTitle', 'Titolo aereo'),
            itEnTextObject('air', 'In aereo'),
            itEnStringObject('roadTitle', 'Titolo auto'),
            itEnTextObject('road', 'In auto'),
            itEnStringObject('directionsOriginLabel', 'Origine indicazioni'),
            {
              name: 'maps',
              label: 'Link mappe',
              widget: 'object',
              fields: [
                itEnStringObject('google', 'Google Maps'),
                itEnStringObject('osm', 'OpenStreetMap')
              ]
            },
            itEnStringObject('mapCredit', 'Credito OSM'),
            {
              name: 'weather',
              label: 'Meteo',
              widget: 'object',
              collapsed: true,
              fields: [
                itEnStringObject('place', 'Luogo'),
                { name: 'line', widget: 'hidden' },
                { name: 'aria', widget: 'hidden' },
                itEnStringObject('credit', 'Credito'),
                itEnStringObject('clear', 'Sereno'),
                itEnStringObject('cloudy', 'Nuvoloso'),
                itEnStringObject('fog', 'Nebbia'),
                itEnStringObject('rain', 'Pioggia'),
                itEnStringObject('snow', 'Neve'),
                itEnStringObject('storm', 'Temporale')
              ]
            }
          ]
        },
        {
          name: 'imperdibili',
          label: 'Imperdibili',
          file: 'src/content/pages/imperdibili.yml',
          format: 'yaml',
          fields: [
            itEnStringObject('title', 'Titolo'),
            itEnTextObject('meta', 'Descrizione (SEO)'),
            itEnTextObject('lead', 'Intro'),
            {
              name: 'directions',
              label: 'Indicazioni (luoghi)',
              widget: 'object',
              collapsed: true,
              fields: [
                itEnStringObject('routeTitle', 'Come arrivare'),
                itEnStringObject('moreInfoTitle', 'Ulteriori informazioni'),
                itEnStringObject('googleLabel', 'Google Maps'),
                itEnStringObject('osmLabel', 'OpenStreetMap')
              ]
            },
            {
              name: 'photoCredits',
              label: 'Crediti foto',
              widget: 'object',
              fields: [
                itEnStringObject('title', 'Titolo'),
                itEnStringObject('photo', 'Prefisso foto'),
                itEnTextObject('metaDescription', 'Descrizione (SEO)'),
                itEnTextObject('lead', 'Intro')
              ]
            }
          ]
        },
        {
          name: 'privacy',
          label: 'Privacy',
          file: 'src/content/pages/privacy.yml',
          format: 'yaml',
          fields: [
            itEnStringObject('title', 'Titolo'),
            itEnTextObject('metaDescription', 'Descrizione (SEO)'),
            itEnTextObject('lead', 'Intro'),
            itEnStringObject('groupContact', 'Gruppo contatto'),
            itEnStringObject('groupBrowse', 'Gruppo visita'),
            itEnStringObject('controllerTitle', 'Titolo titolare'),
            itEnTextObject('controller', 'Titolare'),
            itEnTextObject('contact', 'Quando ci scrivi'),
            itEnStringObject('analyticsTitle', 'Titolo statistiche'),
            itEnTextObject('analytics', 'Statistiche'),
            itEnStringObject('analyticsPolicy', 'Link statistiche'),
            itEnStringObject('cookiesTitle', 'Titolo cookie'),
            itEnTextObject('cookies', 'Cookie'),
            itEnStringObject('hostingTitle', 'Titolo hosting'),
            itEnTextObject('hosting', 'Hosting'),
            itEnStringObject('hostingPolicy', 'Link hosting'),
            itEnStringObject('mapsTitle', 'Titolo mappa'),
            itEnTextObject('maps', 'Mappa'),
            itEnStringObject('mapsPolicy', 'Link mappa'),
            itEnStringObject('weatherTitle', 'Titolo meteo'),
            itEnTextObject('weather', 'Meteo'),
            itEnStringObject('weatherPolicy', 'Link meteo'),
            itEnStringObject('rightsTitle', 'Titolo diritti'),
            itEnTextObject('rights', 'Diritti')
          ]
        },
        {
          name: 'chrome',
          label: 'Chrome',
          file: 'src/content/pages/chrome.yml',
          format: 'yaml',
          fields: [
            itEnStringObject('skipToContent', 'Salta al contenuto'),
            itEnStringObject('mainNav', 'Nav principale'),
            itEnStringObject('language', 'Lingua'),
            itEnStringObject('menu', 'Menu'),
            itEnStringObject('closeMenu', 'Chiudi menu'),
            itEnStringObject('videoPlay', 'Riproduci video'),
            itEnStringObject('videoReplay', 'Rivedi video'),
            itEnTextObject('videoUnsupported', 'Video non supportato'),
            itEnStringObject('pageNotFoundTitle', 'Pagina non trovata'),
            itEnTextObject('pageNotFoundBody', 'Pagina non trovata (testo)'),
            itEnStringObject('pageErrorTitle', 'Errore'),
            itEnTextObject('pageErrorBody', 'Errore (testo)')
          ]
        }
      ]
    },
    {
      name: 'houses',
      label: 'Case',
      label_singular: 'Casa',
      create: false,
      delete: false,
      editor: { preview: false },
      files: [
        casaFile(1),
        casaFile(2),
        casaFile(3),
        casaFile(4),
        {
          name: 'chrome',
          label: 'Chrome',
          file: 'src/content/houses/chrome.yml',
          format: 'yaml',
          fields: [
            itEnStringObject('single', 'Singolare'),
            itEnStringObject('plural', 'Plurale'),
            itEnStringObject('highlights', 'In evidenza'),
            itEnStringObject('otherHouses', 'Altre case'),
            itEnStringObject('keepExploring', 'Continua a esplorare'),
            itEnStringObject('notFound', 'Casa non trovata'),
            itEnStringObject('gallery', 'Galleria'),
            itEnStringObject('previousPhoto', 'Foto precedente'),
            itEnStringObject('nextPhoto', 'Foto successiva'),
            itEnStringObject('thumbnails', 'Anteprime'),
            itEnStringObject('goToPhoto', 'Vai alla foto')
          ]
        }
      ]
    },
    {
      name: 'places',
      label: 'Luoghi',
      label_singular: 'Luogo',
      folder: 'src/content/places',
      create: false,
      delete: false,
      extension: 'yml',
      format: 'yaml',
      identifier_field: 'slug',
      thumbnail: false,
      media_folder: '/static/images/places',
      public_folder: '/images/places',
      editor: { preview: false },
      fields: [
        { name: 'image', label: 'Foto', widget: 'image' },
        itEnStringObject('name', 'Nome'),
        { name: 'time', label: 'Tempo di viaggio', widget: 'string' },
        itEnTextObject('text', 'Testo'),
        itEnStringObject('directionsLabel', 'Etichetta indicazioni'),
        {
          name: 'website',
          label: 'Sito ufficiale',
          widget: 'object',
          required: false,
          fields: [
            itEnStringObject('href', 'URL'),
            itEnStringObject('label', 'Etichetta')
          ]
        },
        { name: 'slug', widget: 'hidden' },
        {
          name: 'location',
          label: 'Coordinate',
          widget: 'object',
          collapsed: true,
          required: false,
          fields: [
            { name: 'lat', label: 'Lat', widget: 'number', value_type: 'float' },
            { name: 'lon', label: 'Lon', widget: 'number', value_type: 'float' }
          ]
        },
        {
          name: 'imageCredit',
          label: 'Credito foto',
          widget: 'object',
          collapsed: true,
          required: false,
          fields: [
            { name: 'author', label: 'Autore', widget: 'string' },
            { name: 'sourceUrl', label: 'Fonte', widget: 'string' },
            { name: 'licenseUrl', label: 'Licenza URL', widget: 'string' },
            { name: 'license', label: 'Licenza', widget: 'string' }
          ]
        }
      ]
    }
  ],
  asset_collections: [
    {
      name: 'home-photos',
      label: 'Home',
      media_folder: '/static/images/ambiance',
      public_folder: '/images/ambiance'
    },
    {
      name: 'awards-photos',
      label: 'Premi',
      media_folder: '/static/images/awards',
      public_folder: '/images/awards'
    },
    {
      name: 'arrive-photos',
      label: 'Come arrivare',
      media_folder: '/static/images/arrive',
      public_folder: '/images/arrive'
    },
    {
      name: 'casa-1-photos',
      label: 'Casa 1',
      media_folder: '/static/images/houses/casa-1',
      public_folder: '/images/houses/casa-1'
    },
    {
      name: 'casa-2-photos',
      label: 'Casa 2',
      media_folder: '/static/images/houses/casa-2',
      public_folder: '/images/houses/casa-2'
    },
    {
      name: 'casa-3-photos',
      label: 'Casa 3',
      media_folder: '/static/images/houses/casa-3',
      public_folder: '/images/houses/casa-3'
    },
    {
      name: 'casa-4-photos',
      label: 'Casa 4',
      media_folder: '/static/images/houses/casa-4',
      public_folder: '/images/houses/casa-4'
    },
    {
      name: 'luoghi-photos',
      label: 'Luoghi',
      media_folder: '/static/images/places',
      public_folder: '/images/places'
    }
  ]
} as CmsConfig;
