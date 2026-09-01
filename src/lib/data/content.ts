import { liveCopy } from '$lib/copy-catalog';
import type { Locale, LocalizedString, LocalizedStrings } from '$lib/locale';
import { localize } from '$lib/locale';

/** Marketing copy. Tagline stays Italian in both languages. */

export const site = liveCopy('site', {
  name: 'Antico Baglio Siciliano',
  tagline: 'Case vacanze in Sicilia',
  location: {
    it: 'Balestrate, Sicilia occidentale',
    en: 'Balestrate, western Sicily'
  } satisfies LocalizedString,
  email: 'info@anticobagliosiciliano.it',
  description: {
    it: 'Nel cuore della Sicilia occidentale, un’esperienza vera di relax e cultura.',
    en: 'In the heart of western Sicily, a genuine experience of rest and culture.'
  } satisfies LocalizedString
});

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
  paragraphs: LocalizedStrings;
  highlights: LocalizedStrings;
};

/**
 * Room copy: Casa 1–2 IT from Lodgify; EN from the old WordPress rooms.
 * Casa 3–4 IT has no archive original (drafted from the English, owner-reviewed).
 */
export const housesSource: HouseSource[] = liveCopy('houses', [
  {
    slug: 'casa-1',
    name: 'Casa 1',
    tagline: {
      it: 'Spaziosa, luminosa, con soppalco e terrazza sui tetti',
      en: 'Spacious and bright, with a loft and a terrace on the roofs'
    },
    summary: {
      it: 'Oltre 100 mq su due livelli, ideale per famiglie o due/tre coppie. Soggiorno ampio, due camere, soppalco e terrazza privata.',
      en: 'Over 100 square meters on two levels, ideal for families or two/three couples. A large living room, two bedrooms, a loft and a private terrace.'
    },
    guests: { it: '4–6 ospiti', en: '4/6 persons' },
    size: '100 m²',
    bedrooms: { it: '2 camere + soppalco', en: '2 bedrooms + loft' },
    bathrooms: { it: '2 bagni', en: '2 bathrooms' },
    capacity: {
      guestMin: 4,
      guestMax: 6,
      bedroomCount: 2,
      bathroomCount: 2,
      floorAreaSqm: 100
    },
    image: '/images/houses/casa-1/00-img_6532.jpg',
    gallery: [
      '/images/houses/casa-1/01-img_6807.jpg',
      '/images/houses/casa-1/02-img_6513.jpg',
      '/images/houses/casa-1/03-img_6514.jpg',
      '/images/houses/casa-1/04-img_6511.jpg',
      '/images/houses/casa-1/05-img_6494.jpg',
      '/images/houses/casa-1/06-img_6493.jpg',
      '/images/houses/casa-1/07-img_6368.jpg',
      '/images/houses/casa-1/08-img_6383.jpg',
      '/images/houses/casa-1/09-img_6391.jpg',
      '/images/houses/casa-1/10-img_6501.jpg',
      '/images/houses/casa-1/11-img_6482.jpg',
      '/images/houses/casa-1/12-img_6419.jpg',
      '/images/houses/casa-1/13-img_6669.jpg',
      '/images/houses/casa-1/14-img_6653.jpg',
      '/images/houses/casa-1/15-img_6479.jpg',
      '/images/houses/casa-1/16-img_6470.jpg'
    ],
    paragraphs: {
      it: [
        'Disposta su due livelli, per un totale di oltre 100 mq, la casa si apre su un ampio soggiorno con due divani, un comodo tavolo da pranzo e una bella cucina che, benché aperta da un lato, ha uno spazio autonomo, comodo e organizzato. Due sono le stanze da letto, entrambe spaziose e luminose ed entrambe affacciate su un magnifico uliveto. La più grande ha un letto matrimoniale (160 x 200), la seconda due letti singoli eventualmente affiancabili. In entrambe c’è lo spazio per un lettino per bambini.',
        'Una scala in muratura porta dal soggiorno all’ampio soppalco, dove si apre un’altra zona soggiorno eventualmente utilizzabile come terza camera da letto per 2/3 persone. Vi è infatti un divano letto (140x 200) e lo spazio per un eventuale letto supplementare. Da qui si accede a un bel terrazzo (15 mq) sui tetti del Baglio dove si può fare colazione col primo sole del mattino, prendere il sole in totale privacy o godersi il fresco della sera.',
        'La casa ha due bagni spaziosi ed eleganti, entrambi con doccia, uno a piano terra e uno nella zona soppalco.',
        'L’ingresso della casa si affaccia sul cortile del Baglio e nello spazio riservato antistante è possibile rilassarsi su una sdraio o cenare a lume di candela.',
        'La casa è frutto di un recente restauro: l’utilizzo di materiali di recupero, come antiche pietre e ringhiere, e la scelta di utilizzare cotto fatto a mano per i pavimenti e travi grezze di castagno per i soffitti, danno all’ambiente uno charme particolare. La casa ha un impianto di riscaldamento che la rende confortevole anche per un soggiorno invernale.',
        'Sistemazione ideale per una famiglia di 4/6 persone, per due/tre coppie di amici, per due famiglie.'
      ],
      en: [
        'On two levels and covering 100 square meters, the house opens onto a large living room with two couches, a comfortable dining table and a beautiful kitchen that although open on one side, has an autonomous space, comfortable and organized. There are two bedrooms, both spacious and bright and both overlooking a magnificent olive grove. The largest has a double bed (160 x 200), the second two single beds that you can put side by side if you want. In both there is space for a cot.',
        'A stone staircase leads from the living room to the large loft, where you find another living area usable as a third bedroom for 2/3 people. Here there is a sofa bed (140x 200) and space for an extra bed. This area leads to a lovely terrace (15 sq m) on the roof of the baglio where you can have breakfast with the morning sun, sunbathe in privacy or enjoy the cool of the evening.',
        'The house has two large and elegant bathrooms, both with a shower, one on the ground floor and one in the loft area.',
        'The entrance of the house overlooks the courtyard of the baglio and in the space reserved in front of it you can relax on a sun lounger or dine by candlelight.',
        'The house is the result of a recent restoration using recycled materials such as ancient stones and railings, and the choice of handmade terracotta for the floors and chestnut beams for the ceilings, give the house a particular charm. The house has a heating system that makes it comfortable even for a winter stay.',
        'Ideal accommodation for a family of 4/6 persons, for two/three couples, or for two families.'
      ]
    },
    highlights: {
      it: [
        'Terrazza sull’uliveto (15 mq)',
        'Cucina attrezzata',
        'Riscaldamento e aria condizionata',
        'Wi‑Fi gratuito'
      ],
      en: [
        'Terrace overlooking the olive grove (15 sq m)',
        'Equipped kitchen',
        'Heating and air conditioning',
        'Free Wi‑Fi'
      ]
    }
  },
  {
    slug: 'casa-2',
    name: 'Casa 2',
    tagline: {
      it: 'Intima e raffinata, perfetta per coppie o piccole famiglie',
      en: 'Intimate and refined, perfect for couples or small families'
    },
    summary: {
      it: 'Circa 65 mq su due livelli con camera al piano terra, soppalco e terrazza. Ideale per una coppia o 3–4 persone.',
      en: 'About 65 square meters on two levels, with the bedroom on the ground floor, a loft and a terrace. Ideal for a couple or 3–4 people.'
    },
    guests: { it: '2–4 ospiti', en: '2/4 persons' },
    size: '65 m²',
    bedrooms: { it: '1 camera + soppalco', en: '1 bedroom + mezzanine' },
    bathrooms: { it: '1 bagno', en: '1 bathroom' },
    capacity: {
      guestMin: 2,
      guestMax: 4,
      bedroomCount: 1,
      bathroomCount: 1,
      floorAreaSqm: 65
    },
    image: '/images/houses/casa-2/00-img_6783.jpg',
    gallery: [
      '/images/houses/casa-2/01-img_65581.jpg',
      '/images/houses/casa-2/02-img_65771.jpg',
      '/images/houses/casa-2/03-img_6645.jpg',
      '/images/houses/casa-2/04-img_6643.jpg',
      '/images/houses/casa-2/05-img_6776.jpg',
      '/images/houses/casa-2/06-img_6609.jpg',
      '/images/houses/casa-2/07-img_5927.jpg',
      '/images/houses/casa-2/08-img_6628.jpg',
      '/images/houses/casa-2/09-img_5743.jpg',
      '/images/houses/casa-2/10-img_6589.jpg',
      '/images/houses/casa-2/11-img_6800.jpg',
      '/images/houses/casa-2/12-img_6580.jpg',
      '/images/houses/casa-2/13-img_5759.jpg',
      '/images/houses/casa-2/14-img_5756.jpg',
      '/images/houses/casa-2/15-img_6623.jpg',
      '/images/houses/casa-2/16-img_6769.jpg',
      '/images/houses/casa-2/17-img_5933.jpg'
    ],
    paragraphs: {
      it: [
        'La casa è disposta su due livelli per un totale di circa 65 mq. L’ingresso dà su un’ampia zona pranzo con una bella cucina a vista, comoda e organizzata. Sempre al piano terra si trova la stanza da letto, spaziosa e luminosa, con due grandi finestre affacciate su un magnifico uliveto. Il letto matrimoniale (160 x 200) lascia spazio ad un eventuale terzo letto o a un lettino per bambini (entrambi su richiesta). Accanto alla camera si trova un bagno con doccia, spazioso ed elegante.',
        'Una scala in muratura porta al soppalco dove si apre la zona soggiorno, eventualmente utilizzabile come seconda camera da letto per 2/3 persone. Vi si trova infatti un divano letto (140x 200) e vi è spazio per un eventuale letto supplementare.',
        'Da qui si accede a un bel terrazzo (15 mq) sui tetti del Baglio dove potrete fare colazione col primo sole del mattino, prendere il sole in totale privacy o godervi il fresco della sera.',
        'La casa si affaccia sul cortile del Baglio e nello spazio riservato antistante è possibile rilassarsi su una sdraio o cenare a lume di candela.',
        'La casa è frutto di un recente restauro: l’utilizzo di materiali di recupero, come antiche pietre e ringhiere, e la scelta di utilizzare cotto fatto a mano per i pavimenti e travi grezze di castagno per i soffitti, danno all’ambiente uno charme particolare. La casa ha un impianto di riscaldamento che la rende confortevole anche per un soggiorno invernale.',
        'Sistemazione ideale per una coppia, per una famiglia di 3/4 persone, per due coppie di amici.'
      ],
      en: [
        'The house is on two floors and covers about 65 square meters. The entrance opens onto a large dining area with a nice kitchen, comfortable and organized. Also on the ground floor is the bedroom, spacious and bright, with two large windows overlooking a magnificent olive grove. The double bed (160 x 200) allows for a third bed or cot (both on request). Next to the bedroom is a spacious and elegant bathroom with a shower.',
        'A stone staircase leads to the mezzanine where you find the living area, also usable as a second bedroom for 2/3 people. There is a sofa bed (140x 200) and enough space for an extra bed.',
        'This area leads to a lovely terrace (15 sq m) on the roofs of the baglio where you can have breakfast with the morning sun, sunbathe in privacy or enjoy the cool of the evening.',
        'The house overlooks the courtyard of the baglio and in the reserved space in front of it you can relax on a sun lounger or dine by candlelight.',
        'The house is the result of a recent restoration using recycled materials such as ancient stones and railings, and the choice of handmade terracotta for the floors and chestnut beams for the ceilings, give it a particular charm. The house has a heating system that makes it comfortable even for a winter stay.',
        'Perfect for a couple, for a family of 3/4 persons, or for two couples.'
      ]
    },
    highlights: {
      it: [
        'Terrazza sull’uliveto (15 mq)',
        'Cucina attrezzata',
        'Riscaldamento e aria condizionata',
        'Wi‑Fi gratuito'
      ],
      en: [
        'Terrace overlooking the olive grove (15 sq m)',
        'Equipped kitchen',
        'Heating and air conditioning',
        'Free Wi‑Fi'
      ]
    }
  },
  {
    slug: 'casa-3',
    name: 'Casa 3',
    tagline: {
      it: 'La più grande: tre camere e terrazza sull’uliveto',
      en: 'The largest: three bedrooms and a terrace overlooking the olive grove'
    },
    summary: {
      it: 'Oltre 110 m², tre camere e due soggiorni. Ideale per famiglie numerose o gruppi di amici.',
      en: 'Over 110 square meters, three bedrooms and two living rooms. Ideal for large families or groups of friends.'
    },
    guests: { it: '4–8 ospiti', en: '4/8 persons' },
    size: '110+ m²',
    bedrooms: { it: '3 camere', en: '3 bedrooms' },
    bathrooms: { it: '2 bagni', en: '2 bathrooms' },
    capacity: {
      guestMin: 4,
      guestMax: 8,
      bedroomCount: 3,
      bathroomCount: 2,
      floorAreaSqm: 110
    },
    image: '/images/houses/casa-3/00-soggiorno-2.jpg',
    gallery: [
      '/images/houses/casa-3/01-ingresso-soggiorno.jpg',
      '/images/houses/casa-3/02-letto-1.jpg',
      '/images/houses/casa-3/03-letto-3.jpg',
      '/images/houses/casa-3/04-letto-2.jpg',
      '/images/houses/casa-3/05-bagno-1.jpg',
      '/images/houses/casa-3/06-bagno-2.jpg',
      '/images/houses/casa-3/07-cucina-1.jpg',
      '/images/houses/casa-3/08-cucina-2.jpg',
      '/images/houses/casa-3/09-soggiorno-1.jpg',
      '/images/houses/casa-3/11-ingresso-sul-cortile.jpg'
    ],
    paragraphs: {
      it: [
        'Questa pittoresca casa di campagna è disposta su due piani, per un totale di oltre 110 mq. Al piano terra un ampio e confortevole soggiorno con zona ingresso dà accesso alla zona notte. Qui si trovano tre camere da letto, tutte spaziose e luminose: due con letto matrimoniale e una terza con due letti singoli. Due camere si affacciano su un magnifico uliveto, la terza sul cortile del Baglio. Il divano letto del soggiorno può inoltre ospitare due persone.',
        'Una suggestiva scala in pietra lavica e ferro porta al primo piano, dove si aprono un secondo soggiorno e la zona cucina/pranzo. La cucina, bella e comoda, è dotata di forno. Dalla zona giorno si accede a un delizioso terrazzo (15 mq) affacciato sull’uliveto, dove si può cenare la sera o rilassarsi su una sdraio in totale privacy.',
        'L’ingresso della casa si affaccia sul cortile del Baglio: nello spazio riservato antistante gli ospiti possono godersi la piacevole atmosfera del cortile.',
        'La casa è frutto di un recente e accurato restauro: l’utilizzo di materiali di recupero, la scelta di cotto fatto a mano per i pavimenti, di pietra lavica per la scala e per la cucina e di travi grezze di legno per i soffitti, danno all’ambiente uno charme particolare. La casa ha un impianto di riscaldamento che la rende confortevole anche per un soggiorno invernale.',
        'Sistemazione ideale per una famiglia di 4/8 persone, per due/tre coppie di amici, per due famiglie.'
      ],
      en: [
        'This picturesque country house is on two floors and covers a total of over 110 square meters making it ideal accommodation for a family of 4/8 persons, for two/three couples, or for two families. On the ground floor is a large and comfortable living room and hall space which gives access to the sleeping area of the house. Here there are three bedrooms, all bright and spacious: two with a double bed and a third with two single beds. Two of the bedrooms overlook a magnificent olive grove and the third looks out onto the courtyard of the Baglio. In addition, the sofa bed in the living room can accommodate two people.',
        'A striking lava rock and iron staircase leads to the first floor. Here there is a second living room and the kitchen/dining area. The kitchen is both stylish and comfortable, and is equipped with an oven. From the living/dining area you can access a charming terrace of 15 sqm overlooking the olive grove. Here you can dine in the evening or relax on a sun lounger in absolute privacy.',
        'The entrance of the house overlooks the courtyard of the Baglio. Guests can here use the space reserved for their exclusive use and enjoy the charming atmosphere of the courtyard.',
        'The house has recently benefitted from an extensive restoration which employed recycled materials and specially chosen, handmade terracotta tiles for the floors, lava stone for the staircase and kitchen, and rustic wooden beams for the ceilings. All of these features give the house a unique charm. In addition, the house has a heating system that makes it comfortable for even a winter stay.'
      ]
    },
    highlights: {
      it: [
        'Terrazza sull’uliveto (15 mq)',
        'Cucina attrezzata',
        'Riscaldamento e aria condizionata',
        'Wi‑Fi gratuito'
      ],
      en: [
        'Terrace overlooking the olive grove (15 sq m)',
        'Equipped kitchen',
        'Heating and air conditioning',
        'Free Wi‑Fi'
      ]
    }
  },
  {
    slug: 'casa-4',
    name: 'Casa 4',
    tagline: {
      it: 'La più elegante, con patio interno e vista sul Golfo',
      en: 'The most elegant, with an interior patio and a view over the Gulf'
    },
    summary: {
      it: 'Oltre 110 m², patio privato e terrazza con tramonti sul Golfo di Castellammare.',
      en: 'Over 110 square meters, with a private patio and a terrace for the sunsets over the Gulf of Castellammare.'
    },
    guests: { it: '4–7 ospiti', en: '4/7 persons' },
    size: '110+ m²',
    bedrooms: { it: '2 camere', en: '2 bedrooms' },
    bathrooms: { it: '2 bagni', en: '2 bathrooms' },
    capacity: {
      guestMin: 4,
      guestMax: 7,
      bedroomCount: 2,
      bathroomCount: 2,
      floorAreaSqm: 110
    },
    image: '/images/houses/casa-4/00-patio-3.jpg',
    gallery: [
      '/images/houses/casa-4/01-porta-sul-cortile.jpg',
      '/images/houses/casa-4/02-soggiorno-11.jpg',
      '/images/houses/casa-4/03-cucina-11.jpg',
      '/images/houses/casa-4/04-cucina-4.jpg',
      '/images/houses/casa-4/05-cucina-3.jpg',
      '/images/houses/casa-4/06-cucina-21.jpg',
      '/images/houses/casa-4/07-patio-2.jpg',
      '/images/houses/casa-4/08-letto-piano-terra.jpg',
      '/images/houses/casa-4/09-bagno-piano-terra-1.jpg',
      '/images/houses/casa-4/10-bagno-piano-terra-2.jpg',
      '/images/houses/casa-4/11-soggiorno-22.jpg',
      '/images/houses/casa-4/12-letto-primo-piano-1.jpg',
      '/images/houses/casa-4/13-letto-primo-piano-2.jpg',
      '/images/houses/casa-4/14-bagno-primo-piano-2.jpg',
      '/images/houses/casa-4/15-bagno-primo-piano-1.jpg',
      '/images/houses/casa-4/16-patio-1.jpg',
      '/images/houses/casa-4/17-terrazzo-2.jpg',
      '/images/houses/casa-4/18-terrazzo1.jpg'
    ],
    paragraphs: {
      it: [
        'È la casa più elegante del Baglio. Disposta su due livelli, per un totale di oltre 110 mq, si apre al piano terra su un ampio soggiorno con due divani, uno dei quali trasformabile in letto per due persone. Sempre al piano terra si trovano un’elegante cucina, una camera matrimoniale e un bagno con doccia.',
        'La cucina, il soggiorno e la camera si affacciano tutti su un delizioso patio interno, dove si può fare colazione, pranzare e cenare, oltre che rilassarsi su una chaise longue in totale privacy.',
        'Una scala in mattoni porta dal soggiorno al primo piano, dove si trova una spaziosa camera da letto con un angolo lettura e due poltrone. Il letto matrimoniale è eventualmente separabile in due letti singoli e, su richiesta, è possibile aggiungere un letto supplementare. La camera dispone di un bagno con doccia en suite.',
        'Da qui, attraverso un balcone affacciato sul patio, si accede a un bel terrazzo con una splendida vista sul cortile e sui tetti del Baglio, dove prendere il sole, sorseggiare un aperitivo davanti alla luce degli spettacolari tramonti sul Golfo di Castellammare e godersi il fresco della sera.',
        'La casa è frutto di un recente e accurato restauro: l’utilizzo di materiali di recupero, come un antico balcone con ringhiere in ferro lavorato, e la scelta di pavimenti in pietra e di travi grezze di legno per i soffitti, danno alla casa uno charme e un carattere particolari. La casa ha un impianto di riscaldamento che la rende confortevole anche per un soggiorno invernale.',
        'Sistemazione ideale per una famiglia di 4/7 persone, per due/tre coppie di amici.'
      ],
      en: [
        'This is the most elegant house in the Baglio. Covering two levels, it has a total of over 110 square meters making it ideal accommodation for a family of 4/7 persons or two/three couples. On the ground floor there is a large living room with two sofas, one of which can be converted into a bed for two people. There is also an elegant kitchen, a double bedroom and a bathroom with shower.',
        'The kitchen, the living room and the bedroom all open onto a charming interior patio where guests can have breakfast, lunch and dinner, as well as relax on a chaise longue in absolute privacy.',
        'A brick staircase leads from the living room to the first floor. Here there is a spacious bedroom which has a reading area with two armchairs and a double bed which can be separated into two single beds. On request, we can add an extra bed, too. The room has an en-suite bathroom with shower.',
        'From this room, through a balcony overlooking the patio, you can access a beautiful terrace with a stunning view over the courtyard and roofs of the Baglio. Here you can sunbathe, sip an aperitif contemplating the light of the spectacular sunsets over the Gulf of Castellammare, and enjoy the cool of the evening.',
        'The house is the result of a recent and extensive restoration. The use of recycled materials, such as an antique ornate balcony with iron railings, and the choice of stone floorings and rustic wooden beams for the ceilings, give the house a special charm and character. The house has a heating system which makes it comfortable even for a winter stay.'
      ]
    },
    highlights: {
      it: [
        'Patio interno privato',
        'Terrazza con vista sul Golfo di Castellammare',
        'Cucina attrezzata',
        'Riscaldamento e aria condizionata',
        'Wi‑Fi gratuito'
      ],
      en: [
        'Private interior patio',
        'Terrace with view over the Gulf of Castellammare',
        'Equipped kitchen',
        'Heating and air conditioning',
        'Free Wi‑Fi'
      ]
    }
  }
]);

export function houses(locale: Locale = 'it') {
  return localize(housesSource, locale);
}

export function getHouse(slug: string, locale: Locale = 'it') {
  const source = housesSource.find((h) => h.slug === slug);
  return source ? localize(source, locale) : undefined;
}

export const amenitiesSource = liveCopy('amenities', [
  {
    title: { it: 'Wi‑Fi gratuito', en: 'Free Wi‑Fi' },
    detail: { it: 'Connessione in tutte le case', en: 'A connection in every house' }
  },
  {
    title: { it: 'Parcheggio interno', en: 'Private parking' },
    detail: {
      it: 'Ampio spazio auto nel baglio',
      en: 'Plenty of space for cars inside the baglio'
    }
  },
  {
    title: { it: 'Agrumeto e uliveto', en: 'Citrus and olive groves' },
    detail: {
      it: 'Relax tra alberi e profumi di Sicilia',
      en: 'Rest among the trees and the scents of Sicily'
    }
  },
  {
    title: { it: 'Area barbecue', en: 'Barbecue area' },
    detail: { it: 'Cene all’aperto sotto la tettoia', en: 'Dinners outdoors under the canopy' }
  },
  {
    title: { it: 'Pulizia all’arrivo', en: 'Cleaned on arrival' },
    detail: { it: 'Servizio professionale incluso', en: 'A professional service, included' }
  },
  {
    title: { it: 'Biancheria inclusa', en: 'Linen included' },
    detail: { it: 'Lenzuola e asciugamani forniti', en: 'Sheets and towels provided' }
  },
  {
    title: { it: 'Check-in flessibile', en: 'Flexible check-in' },
    detail: {
      it: 'Arrivi e partenze secondo i tuoi orari',
      en: 'Arrivals and departures to suit your times'
    }
  }
] satisfies { title: LocalizedString; detail: LocalizedString }[]);

export function amenities(locale: Locale = 'it') {
  return localize(amenitiesSource, locale);
}

export const awardsSource = liveCopy('awards', [
  {
    title: { it: 'Superhost Airbnb', en: 'Airbnb Superhost' },
    text: {
      it: 'Ricevuto da Airbnb per l’eccellenza nell’ospitalità, garantendo esperienze di alta qualità e recensioni eccellenti da parte degli ospiti.',
      en: 'Awarded by Airbnb for excellence in hospitality, for stays of a consistently high standard and excellent guest reviews.'
    },
    proofUrl: {
      it: 'https://www.airbnb.it/users/show/26312991',
      en: 'https://www.airbnb.com/users/show/26312991'
    },
    proofLabel: { it: 'Profilo host su Airbnb', en: 'Airbnb host profile' },
    image: '/images/awards/superhost.png'
  },
  {
    title: { it: 'Amato dagli ospiti Airbnb', en: 'Airbnb Guest Favourite' },
    text: {
      it: 'Un riconoscimento speciale per l’attenzione e la cura verso gli ospiti, che ci ha permesso di costruire un rapporto di fiducia e calore.',
      en: 'A special recognition for the attention and care we give our guests, which has let us build a relationship of trust and warmth.'
    },
    image: '/images/awards/guest-favorite.png'
  },
  {
    title: { it: 'Traveller Review Awards', en: 'Traveller Review Awards' },
    text: {
      it: 'Premio annuale assegnato da Booking.com basato sulle recensioni positive ricevute, a testimonianza della soddisfazione dei nostri clienti.',
      en: 'An annual award from Booking.com based on the positive reviews we receive, a sign of how satisfied our guests are.'
    },
    image: '/images/awards/traveller-review.png'
  }
] satisfies {
  title: LocalizedString;
  text: LocalizedString;
  image: string;
  proofUrl?: LocalizedString;
  proofLabel?: LocalizedString;
}[]);

export function awards(locale: Locale = 'it') {
  return localize(awardsSource, locale);
}

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

/** Place texts: IT from Lodgify; EN rewritten from the old WordPress machine translation. */
export const placesSource: PlaceSource[] = liveCopy('places', [
  {
    slug: 'segesta',
    name: { it: 'Segesta', en: 'Segesta' },
    time: '20 min',
    location: { lat: 37.9478139, lon: 12.827791 },
    directionsLabel: {
      it: 'Parcheggio Segesta, Calatafimi Segesta',
      en: 'Segesta car park, Calatafimi Segesta'
    },
    website: {
      href: {
        it: 'https://www.parcodisegesta.com/home',
        en: 'https://www.parcodisegesta.com/home'
      },
      label: {
        it: 'Sito ufficiale del Parco Archeologico di Segesta',
        en: 'Official Segesta Archaeological Park website (Italian only)'
      }
    },
    text: {
      it: 'Sito archeologico di rara bellezza. Si visita il tempio, posto su un poggio alle cui spalle si sviluppa un canyon, e il Teatro in cima al monte Barbaro da cui si gode un bellissimo panorama sul golfo.',
      en: 'An archaeological site of rare beauty. You can visit the temple, which stands on a hill with a canyon opening up behind it, and the theatre at the top of Mount Barbaro, where you can enjoy a beautiful view over the gulf.'
    },
    image: '/images/places/segesta.jpg',
    imageCredit: {
      author: 'Paul Stephenson',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Temple_of_Segesta,_Sicily.jpg',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      license: 'CC BY 2.0'
    }
  },
  {
    slug: 'riserva-dello-zingaro',
    name: { it: 'Riserva dello Zingaro', en: 'Zingaro Nature Reserve' },
    time: '30 min',
    location: { lat: 38.0818609, lon: 12.8080923 },
    directionsLabel: {
      it: 'Ingresso sud Riserva dello Zingaro, Scopello',
      en: 'Zingaro Nature Reserve south entrance, Scopello'
    },
    website: {
      href: {
        it: 'https://www.riservazingaro.it/',
        en: 'https://www.riservazingaro.it/en/'
      },
      label: {
        it: 'Sito ufficiale della Riserva dello Zingaro',
        en: 'Official Zingaro Nature Reserve website'
      }
    },
    text: {
      it: 'Zona di costa protetta. Calette di ciotoli con acqua cristallina. Divieto alle imbarcazioni e alla pesca. Nella stagione meno calda è affascinante percorre il sentiero che congiunge i due ingressi della riserva. Panorami mozzafiato e profumi della macchia mediterranea.',
      en: 'A protected stretch of coastline, with pebble coves and crystal clear water. Boats and fishing are not allowed. Outside the hottest months, the path linking the two entrances of the reserve makes a wonderful walk, with breathtaking views and the scents of the Mediterranean scrub.'
    },
    image: '/images/places/zingaro.jpg',
    imageCredit: {
      author: 'Daniele Pugliesi',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Riserva_dello_Zingaro_18.jpg',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    slug: 'duomo-di-monreale',
    name: { it: 'Duomo di Monreale', en: 'Cathedral of Monreale' },
    time: '40 min',
    location: { lat: 38.0840913, lon: 13.2934427 },
    directionsLabel: {
      it: 'Parcheggio Duomo, Monreale',
      en: 'Parking Duomo, Monreale'
    },
    website: {
      href: {
        it: 'https://www.duomomonreale.com/duomo-di-monreale/',
        en: 'https://www.duomomonreale.com/en/duomo-di-monreale/'
      },
      label: {
        it: 'Sito ufficiale del Duomo di Monreale',
        en: 'Official Monreale Cathedral website (Italian only)'
      }
    },
    text: {
      it: 'Visita immancabile. Uno dei gioielli più rari del patrimonio artistico italiano, sorprendente riuscita dell’incontro degli universi culturali islamico, bizantino, romanico: il Duomo normanno coi mosaici siculo-veneziani e il chiostro benedettino. Dal Belvedere vista sulla valle dell’Oreto e sulla Conca d’Oro.',
      en: 'A must-see. One of the rarest jewels of Italy’s artistic heritage and a remarkable meeting of the Islamic, Byzantine and Romanesque worlds: the Norman cathedral with its Sicilian-Venetian mosaics, and the Benedictine cloister. From the Belvedere there is a view over the Oreto valley and the Conca d’Oro.'
    },
    image: '/images/places/monreale.jpg',
    imageCredit: {
      author: 'Berthold Werner',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Monreale_Cathedral_BW_2025-04-29_16-01-19_hdr.jpg',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    slug: 'cappella-palatina',
    name: { it: 'Cappella Palatina', en: 'Palatine Chapel' },
    time: '40 min',
    location: { lat: 38.1116821, lon: 13.3540374 },
    directionsLabel: {
      it: 'Palazzo Reale di Palermo',
      en: 'Royal Palace of Palermo'
    },
    website: {
      href: {
        it: 'https://www.federicosecondo.org/',
        en: 'https://www.federicosecondo.org/en/home-english/'
      },
      label: {
        it: 'Sito ufficiale del Palazzo Reale',
        en: 'Official Royal Palace website'
      }
    },
    text: {
      it: 'Capolavoro dell’Arte Normanna. La Cappella Palatina di Palermo è l’esempio più elevato, dal punto di vista storico-artistico, della convivenza tra culture, religioni e modi di pensare apparentemente inconciliabili. Nella sua costruzione furono coinvolte maestranze bizantine, latine e musulmane, queste ultime eseguirono il soffitto a muqarnas, pregevole ed unico esempio al mondo di decorazioni pittoriche islamiche con rappresentazioni di figure umane all’interno di un luogo di culto.',
      en: 'A masterpiece of Norman art. The Palatine Chapel in Palermo is the finest expression, historically and artistically, of coexistence between cultures, religions and ways of thinking that seemed irreconcilable. Byzantine, Latin and Muslim craftsmen all worked on it, and it was the last of these who created the muqarnas ceiling — a precious and, in the world, unique example of Islamic decorative painting depicting human figures inside a place of worship.'
    },
    image: '/images/places/cappella-palatina.jpg',
    imageCredit: {
      author: 'TeKappa',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Palermo_-_Cappella_Palatina_-_2025-09-24_14-49-26_001.jpg',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    slug: 'selinunte',
    name: { it: 'Selinunte', en: 'Selinunte' },
    time: '45 min',
    location: { lat: 37.5856685, lon: 12.8376692 },
    directionsLabel: {
      it: 'Parcheggio ingresso est, Parco Archeologico di Selinunte, Marinella di Selinunte',
      en: 'East entrance car park, Selinunte Archaeological Park, Marinella di Selinunte'
    },
    website: {
      href: {
        it: 'https://parchiarcheologici.regione.sicilia.it/selinunte-cave-cusa-pantelleria/',
        en: 'https://parchiarcheologici.regione.sicilia.it/selinunte-cave-cusa-pantelleria/'
      },
      label: {
        it: 'Sito ufficiale del Parco Archeologico di Selinunte',
        en: 'Official Selinunte Archaeological Park website (Italian only)'
      }
    },
    text: {
      it: 'Uno dei maggiori centri archeologici siciliani. L’area da visitare è molto vasta. Comprende vari templi, resti di mura, strade ed edifici monumentali testimoni della grande ricchezza raggiunta da Selinunte. L’acropoli domina la splendida spiaggia, dove nel 650 a.C., sbarcarono i coloni di Megara Hyblaea, città greca della Sicilia orientale, i quali fondarono l’avamposto ellenico più a occidente di tutta l’isola.',
      en: 'One of the major archaeological sites in Sicily, covering a very large area. It includes several temples along with the remains of walls, streets and monumental buildings that testify to the great wealth Selinunte once reached. The acropolis looks out over the beautiful beach where, in 650 BC, settlers from Megara Hyblaea — a Greek city in eastern Sicily — came ashore and founded the westernmost Greek outpost on the island.'
    },
    image: '/images/places/selinunte.jpg',
    imageCredit: {
      author: 'Evan Erickson',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Selinunte-Temple_E_04.JPG',
      licenseUrl: 'https://commons.wikimedia.org/wiki/Public_domain',
      license: 'Public domain'
    }
  },
  {
    slug: 'saline-di-trapani',
    name: { it: 'Saline di Trapani e Paceco', en: 'Trapani and Paceco salt pans' },
    time: '45 min',
    location: { lat: 37.996514, lon: 12.535508 },
    directionsLabel: {
      it: 'Centro visite Mulino Maria Stella, Saline di Trapani e Paceco',
      en: 'Mulino Maria Stella visitor centre, Trapani and Paceco salt pans'
    },
    website: {
      href: {
        it: 'https://wwfsalineditrapani.it/',
        en: 'https://wwfsalineditrapani.it/?lang=en'
      },
      label: {
        it: 'Sito ufficiale della Riserva Naturale Saline di Trapani e Paceco',
        en: 'Official Trapani and Paceco salt pans nature reserve website'
      }
    },
    text: {
      it: 'Riserva naturale gestita dal WWF: vasche di sale ancora attive, mulini a vento, fenicotteri e migrazioni d’autunno. I sentieri esterni si percorrono liberamente; visite guidate su prenotazione.',
      en: 'A WWF-managed nature reserve with still-working salt pans, windmills, flamingos and autumn migrations. Outdoor paths are free to walk; guided tours by booking.'
    },
    image: '/images/places/saline-di-trapani.jpg',
    imageCredit: {
      author: 'Renato Raimondo',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Saline_trapani_-_Mulino_a_vento.JPG',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      license: 'CC BY-SA 3.0'
    }
  },
  {
    slug: 'erice',
    name: { it: 'Erice', en: 'Erice' },
    time: '50 min',
    location: { lat: 38.0385483, lon: 12.5835615 },
    directionsLabel: {
      it: 'Parcheggio Porta Trapani, Erice',
      en: 'Porta Trapani car park, Erice'
    },
    website: {
      href: {
        it: 'https://www.fondazioneericearte.org/',
        en: 'https://www.fondazioneericearte.org/'
      },
      label: {
        it: 'Monumenti e Erice Card',
        en: 'Monuments and Erice Card (Italian only)'
      }
    },
    text: {
      it: 'Suggestivo borgo fondato dagli Elimi, posto in cima al monte Sant’Angelo a circa 800 metri, da cui è possibile ammirare panorami sulle isole Egadi, sulle saline e sulla città di Trapani. L’affascinante atmosfera dei tortuosi vicoli lastricati, delle chiese e dei cortiletti fioriti è resa ancora più unica dall’irreale momentanea nebbia, creata da nuvole di passaggio, che spesso ammanta la città.',
      en: 'A charming village founded by the Elymians, perched on top of Mount Sant’Angelo at about 800 metres, from which you can admire views of the Egadi Islands, the salt marshes and the city of Trapani. The atmosphere of its steep cobbled streets, churches and flower-filled courtyards is made even more singular by the fleeting, unreal mist that passing clouds often draw over the town.'
    },
    image: '/images/places/erice.jpg',
    imageCredit: {
      author: 'Krzysztof Popławski',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Streets_of_Erice,_Sicilia,_Italy_,_july_2023,_KP477.jpg',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      license: 'CC BY 4.0'
    }
  },
  {
    slug: 'ruderi-di-gibellina',
    name: { it: 'Ruderi di Gibellina', en: 'The Ruins of Gibellina' },
    time: '1 h',
    location: { lat: 37.7869315, lon: 12.974021 },
    directionsLabel: {
      it: 'Parcheggio Cretto di Burri, Gibellina Vecchia',
      en: 'Cretto di Burri car park, Gibellina Vecchia'
    },
    website: {
      href: {
        it: 'https://www.macgibellina.it/il-grande-cretto',
        en: 'https://www.macgibellina.it/il-grande-cretto'
      },
      label: {
        it: 'Il Grande Cretto — MAC Gibellina',
        en: 'Grande Cretto di Burri (Italian only)'
      }
    },
    text: {
      it: 'Nella notte fra il 14 e il 15 gennaio 1968 il terremoto del Belice rase al suolo Gibellina, ricostruita poi una ventina di chilometri più a ovest. Sulle macerie del vecchio paese Alberto Burri ha steso un immenso sudario di cemento bianco: blocchi alti quanto un uomo, separati da fenditure che ricalcano le strade di un tempo. Si cammina dentro la pianta di un paese scomparso, fra le colline coltivate del Belice, in una delle più grandi opere di arte ambientale al mondo.',
      en: 'On the night of 14 January 1968 the Belice earthquake razed Gibellina to the ground; the town was later rebuilt some twenty kilometres to the west. Over the rubble of the old town Alberto Burri laid an immense shroud of white concrete: blocks about the height of a person, separated by fissures that follow the streets as they once ran. You walk through the plan of a vanished town, among the cultivated hills of the Belice, within one of the largest works of environmental art in the world.'
    },
    image: '/images/places/ruderi-di-gibellina.jpg',
    imageCredit: {
      author: 'Boobax',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ruderi_di_Gibellina.jpg',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      license: 'CC BY-SA 3.0'
    }
  }
]);

export function places(locale: Locale = 'it') {
  return localize(placesSource, locale);
}

export const homeCopy = liveCopy('home', {
  metaDescription: {
    it: 'Quattro case vacanze in un antico baglio a Balestrate, Sicilia. Cortile, agrumeto e uliveto; a pochi minuti da Segesta e lo Zingaro.',
    en: 'Four holiday houses in a historic baglio in Balestrate, Sicily. Courtyard, citrus and olive groves; minutes from Segesta and the Zingaro.'
  },
  chiSiamo: {
    title: { it: 'Chi siamo', en: 'About us' },
    body: {
      it: 'Antico Baglio Siciliano è una struttura ricettiva immersa nella natura e nella storia della Sicilia occidentale. Offriamo un’accoglienza autentica, con ambienti confortevoli e un’atmosfera rilassante.',
      en: 'Antico Baglio Siciliano is a place to stay surrounded by the nature and the history of western Sicily. We offer a genuine welcome, with comfortable spaces and a restful atmosphere.'
    }
  },
  houses: {
    title: {
      it: 'Quattro case indipendenti, un solo cortile',
      en: 'Four independent houses, one courtyard'
    },
    lead: {
      it: 'Ogni casa ha il suo carattere. Tutte condividono il cuore del baglio e il giardino siciliano.',
      en: 'Each house has its own character. All of them share the heart of the baglio and the Sicilian garden.'
    },
    more: { it: 'Scopri la casa', en: 'See the house' }
  },
  cortile: {
    eyebrow: { it: 'Il cortile', en: 'The courtyard' },
    title: { it: 'Il cuore del nostro baglio', en: 'The heart of our baglio' },
    lead: {
      it: 'Lo spazio perfetto per momenti indimenticabili con famiglia e amici.',
      en: 'The perfect space for unforgettable moments with family and friends.'
    },
    body: {
      it: 'L’ampio cortile interno, affacciato da tutti gli appartamenti, offre un ambiente unico dove gruppi di famiglie e amici possono stare insieme senza rinunciare alla privacy. Pranzi all’aperto, giochi per i bambini, serate sotto le stelle — in un’atmosfera autentica siciliana.',
      en: 'The large inner courtyard, which all the houses overlook, is a space where groups of families and friends can be together without giving up their privacy. Lunches in the open air, games for the children, evenings under the stars — in a genuinely Sicilian atmosphere.'
    }
  },
  giardino: {
    eyebrow: { it: 'Il giardino', en: 'The garden' },
    title: { it: 'Vivi il nostro giardino siciliano', en: 'Enjoy our Sicilian garden' },
    p1: {
      it: 'Il cuore dell’Antico Baglio Siciliano è la natura che lo circonda: un autentico agrumeto e un uliveto secolare avvolgono la struttura, regalando profumi, ombra e silenzio.',
      en: 'The heart of Antico Baglio Siciliano is the nature around it: a real citrus grove and a centuries-old olive grove wrap around the houses, giving scent, shade and silence.'
    },
    p2: {
      it: 'Tra gli alberi si apre una zona relax sotto una grande tettoia antica, dove puoi leggere, riposare su una sdraio o condividere momenti speciali con chi ami.',
      en: 'Among the trees there is a quiet corner under a large old canopy, where you can read, rest on a sun lounger or share special moments with the people you love.'
    },
    p3: {
      it: 'A disposizione anche un’area barbecue perfetta per cene all’aperto, tra il verde e la pietra viva del nostro baglio.',
      en: 'There is also a barbecue area, perfect for dinners outdoors among the greenery and the bare stone of our baglio.'
    }
  },
  comfort: {
    eyebrow: { it: 'Comfort', en: 'Comfort' },
    title: { it: 'Accoglienza autentica, servizi chiari', en: 'A genuine welcome, clear amenities' }
  },
  awards: {
    title: { it: 'Ospitalità riconosciuta', en: 'Recognised hospitality' }
  },
  places: {
    title: {
      it: 'Un buon punto per esplorare',
      en: 'A good base for exploring'
    },
    lead: {
      it: 'Antichi templi, arte, riserve naturali, borghi medievali e la costa — tutto vicino.',
      en: 'Ancient temples, art, nature reserves, medieval towns and the coast — all close by.'
    }
  },
  cta: {
    title: { it: 'Pronto per la Sicilia?', en: 'Ready for Sicily?' },
    body: {
      it: 'Scrivici per disponibilità e preventivo. Ti rispondiamo con cura, come ai nostri ospiti.',
      en: 'Write to us for availability and a quote. We answer with the same care we give our guests.'
    }
  },
  alt: {
    hero: {
      it: 'Portone dell’Antico Baglio Siciliano immerso nel verde',
      en: 'The gate of Antico Baglio Siciliano surrounded by greenery'
    },
    cortile: { it: 'Cortile interno del baglio', en: 'The inner courtyard of the baglio' },
    giardino: {
      it: 'Tettoia e sdraio affacciate sul giardino del baglio',
      en: 'Canopy and sun loungers looking onto the baglio garden'
    },
    agrumeto: {
      it: 'Agrumeto del baglio con aranci in frutto',
      en: 'The baglio citrus grove with orange trees in fruit'
    },
    video: { it: 'Il Baglio ripreso dall’alto', en: 'The baglio seen from above' }
  }
});

export const imperdibiliMeta = liveCopy('imperdibili.meta', {
  it: 'Segesta, Zingaro, Monreale, Palermo, Selinunte, le Saline di Trapani ed Erice — a pochi minuti dall’Antico Baglio Siciliano.',
  en: 'Segesta, Zingaro, Monreale, Palermo, Selinunte, the Trapani salt pans and Erice — a few minutes from Antico Baglio Siciliano.'
} satisfies LocalizedString);

export const imperdibiliLead = liveCopy('imperdibili.lead', {
  it: 'Grazie alla sua ottima posizione, si possono raggiungere facilmente alcuni dei più bei luoghi di mare e d’arte della Sicilia Occidentale.',
  en: 'From the baglio you can easily reach some of the most beautiful stretches of coast and the finest art in western Sicily.'
} satisfies LocalizedString);

export const imperdibiliRouteCopy = liveCopy('imperdibili.route', {
  routeTitle: { it: 'Come arrivare', en: 'How to get there' },
  moreInfoTitle: { it: 'Ulteriori informazioni', en: 'More information' },
  googleLabel: { it: 'Indicazioni su Google Maps', en: 'Directions on Google Maps' },
  osmLabel: { it: 'Indicazioni su OpenStreetMap', en: 'Directions on OpenStreetMap' }
});

export const imperdibiliPhotoCreditsCopy = liveCopy('imperdibili.photoCredits', {
  metaDescription: {
    it: 'Attribuzione delle fotografie usate nella pagina Imperdibili.',
    en: 'Attribution for photographs used on the Nearby page.'
  },
  lead: {
    it: 'Le immagini della pagina Imperdibili provengono da Wikimedia Commons o sono di dominio pubblico; sono state ritagliate per adattarle al layout del sito. Di seguito l’attribuzione per ciascuna fotografia.',
    en: 'The images on the Nearby page come from Wikimedia Commons or are in the public domain; they were cropped to fit the site layout. Attribution for each photograph is listed below.'
  }
});

export const baglioLocation = {
  lat: 38.0250627,
  lon: 13.0150391,
  /** Public-road point for driving directions (not the courtyard pin). */
  directionsOrigin: {
    lat: 38.026081,
    lon: 13.017571
  },
  directionsOriginLabel: liveCopy('arrive.directionsOrigin', {
    it: 'Antico Baglio Siciliano, Balestrate PA, Italia',
    en: 'Antico Baglio Siciliano, Balestrate PA, Italy'
  }),
  map: '/images/ambiance/mappa.jpg',
  mapSm: '/images/ambiance/mappa-sm.jpg',
  links: liveCopy('arrive.maps', [
    {
      id: 'google',
      href: 'https://maps.app.goo.gl/NA1BwasQVcFzn1qHA',
      label: { it: 'Apri in Google Maps', en: 'Open in Google Maps' }
    },
    {
      id: 'osm',
      href: 'https://www.openstreetmap.org/?mlat=38.0250627&mlon=13.0150391#map=16/38.0250627/13.0150391',
      label: { it: 'Apri in OpenStreetMap', en: 'Open in OpenStreetMap' }
    }
  ])
};

export const arriveCopy = liveCopy('arrive', {
  metaDescription: {
    it: 'Come arrivare all’Antico Baglio Siciliano a Balestrate: aeroporti, autostrada e una mappa da aprire nella tua app di mappe.',
    en: 'How to get to Antico Baglio Siciliano in Balestrate: airports, the motorway, and a map to open in your maps app.'
  },
  lead: {
    it: 'Il baglio è nelle campagne di Balestrate, sul Golfo di Castellammare, tra Palermo e Trapani.',
    en: 'The baglio is in the countryside of Balestrate, on the Gulf of Castellammare, between Palermo and Trapani.'
  },
  mapAlt: {
    it: 'Mappa della campagna di Balestrate con l’Antico Baglio Siciliano segnalato a sud del paese, vicino all’uscita A29',
    en: 'Map of the Balestrate countryside with Antico Baglio Siciliano marked south of the town, near the A29 exit'
  },
  airTitle: { it: 'In aereo', en: 'By air' },
  air: {
    it: 'L’aeroporto di Palermo (Punta Raisi) è a circa 20 minuti di auto, quello di Trapani a 35. In entrambi potete noleggiare un’auto.',
    en: 'Palermo airport (Punta Raisi) is about 20 minutes by car, Trapani about 35. You can hire a car at either.'
  },
  roadTitle: { it: 'In auto e in traghetto', en: 'By car and ferry' },
  road: {
    it: 'Dall’autostrada A29, uscita Balestrate. Il porto di Palermo dista circa 45 minuti. Se venite con la vostra auto, considerate i traghetti da Genova, Civitavecchia, Napoli, Salerno e Cagliari.',
    en: 'From the A29 motorway, take the Balestrate exit. Palermo harbour is about 45 minutes away. If you are bringing your own car, there are ferries from Genoa, Civitavecchia, Naples, Salerno and Cagliari.'
  },
  attribution: {
    it: 'Mappa © collaboratori di OpenStreetMap.',
    en: 'Map © OpenStreetMap contributors.'
  }
} satisfies Record<string, LocalizedString>);

export const contactCopy = liveCopy('contact', {
  metaDescription: {
    it: 'Richiedi disponibilità per un soggiorno all’Antico Baglio Siciliano.',
    en: 'Request availability for a stay at the Antico Baglio Siciliano.'
  },
  lead: {
    it: 'Raccontaci quando vorresti venire: ti rispondiamo con disponibilità e dettagli per il tuo soggiorno.',
    en: 'Tell us when you would like to come, and we will write back with availability and details for your stay.'
  },
  direct: { it: 'Oppure scrivi direttamente a', en: 'Or write to us directly at' },
  name: { it: 'Il tuo nome', en: 'Your name' },
  email: { it: 'La tua email', en: 'Your email' },
  checkIn: { it: 'Check-in', en: 'Check-in' },
  checkOut: { it: 'Check-out', en: 'Check-out' },
  datePlaceholder: { it: 'Seleziona', en: 'Select' },
  datePrevMonth: { it: 'Mese precedente', en: 'Previous month' },
  dateNextMonth: { it: 'Mese successivo', en: 'Next month' },
  dateCalendar: { it: 'Calendario soggiorno', en: 'Stay calendar' },
  dateMinStayHint: {
    it: 'Soggiorno minimo: due notti',
    en: 'Minimum stay: two nights'
  },
  dateUnavailable: { it: 'occupata', en: 'unavailable' },
  occupancyBlocked: {
    it: 'Queste date sono occupate. Scegline altre per richiedere disponibilità.',
    en: 'These dates are unavailable. Choose another stay to request availability.'
  },
  housesFreeHint: {
    it: 'In queste date sono libere {houses}.',
    en: 'These dates are free for {houses}.'
  },
  fieldRequired: {
    it: 'Compila questo campo.',
    en: 'Please fill in this field.'
  },
  emailInvalid: {
    it: 'Inserisci un indirizzo email valido.',
    en: 'Please enter a valid email address.'
  },
  adults: { it: 'Adulti', en: 'Adults' },
  children: { it: 'Bambini', en: 'Children' },
  house: { it: 'Alloggio', en: 'Accommodation' },
  houseAny: { it: 'Nessuna preferenza', en: 'No preference' },
  message: { it: 'Messaggio (facoltativo)', en: 'Message (optional)' },
  messagePlaceholder: {
    it: 'Esigenze particolari, lettino, orari di arrivo…',
    en: 'Anything you need — a cot, arrival time…'
  },
  messageTooLong: {
    it: 'Il messaggio può avere al massimo 500 caratteri.',
    en: 'The message can be at most 500 characters.'
  },
  messageUnsafe: {
    it: 'Usa solo testo: niente HTML né caratteri speciali nascosti.',
    en: 'Please use plain text only — no HTML or hidden special characters.'
  },
  submit: { it: 'Apri in email', en: 'Open in email' },
  hint: {
    it: 'Si apre un messaggio già compilato nella tua app di posta: l’invio lo fai tu da lì. Se non si apre nulla, scrivi all’indirizzo qui accanto.',
    en: 'This opens a draft in your mail app; you send it from there. If nothing opens, write to the address next to the form.'
  },
  mailName: { it: 'Nome', en: 'Name' },
  mailEmail: { it: 'Email', en: 'Email' },
  mailHouse: { it: 'Alloggio', en: 'Accommodation' },
  mailNoHouse: { it: '(nessuna preferenza)', en: '(no preference)' },
  mailNoMessage: { it: '(nessun messaggio)', en: '(no message)' },
  mailGuest: { it: 'Ospite', en: 'Guest' }
} satisfies Record<string, LocalizedString>);

export const privacyCopy = liveCopy('privacy', {
  metaDescription: {
    it: 'Informativa privacy dell’Antico Baglio Siciliano: come trattiamo i dati di chi visita il sito o ci scrive.',
    en: 'Privacy notice for Antico Baglio Siciliano: how we handle data from people who visit the site or write to us.'
  },
  lead: {
    it: 'Questa pagina spiega in modo sintetico quali dati riguardano chi visita il sito o ci chiede disponibilità.',
    en: 'This page explains, in short, what data is involved when you visit the site or ask about availability.'
  },
  groupContact: {
    it: 'Quando ci scrivi',
    en: 'When you contact us'
  },
  groupBrowse: {
    it: 'Quando visiti il sito',
    en: 'When you browse the site'
  },
  controllerTitle: { it: 'Titolare', en: 'Controller' },
  controller: {
    it: 'Il titolare del trattamento è Antico Baglio Siciliano. Puoi scriverci a',
    en: 'The data controller is Antico Baglio Siciliano. You can write to us at'
  },
  contact: {
    it: 'Il modulo contatti non invia i dati a un server: apre il tuo programma di posta con un messaggio già compilato (nome, email, alloggio, date, numero di ospiti e l’eventuale testo). Riceviamo solo ciò che ci invii tu. Usiamo questi dati per rispondere e organizzare il soggiorno, e non li cediamo a terzi per marketing.',
    en: 'The contact form does not post data to a server: it opens your email program with a message already filled in (name, email, accommodation, dates, number of guests, and any note). We only receive what you send us. We use it to reply and arrange the stay, and we do not pass it to third parties for marketing.'
  },
  analyticsTitle: { it: 'Statistiche di visita', en: 'Visit statistics' },
  analytics: {
    it: 'Contiamo quante persone visitano il sito e quali pagine guardano, così capiamo se le informazioni sono chiare. Non sappiamo chi sei: niente nome, email o un identikit da pubblicità. Per questo usiamo Simple Analytics, che funziona senza cookie. ',
    en: 'We count how many people visit the site and which pages they look at, so we can tell whether the information is clear. We do not know who you are: no name, email, or advertising profile. That is why we use Simple Analytics, which works without cookies. '
  },
  analyticsPolicy: {
    it: 'Vedi quali dati vengono raccolti',
    en: 'See what data is collected'
  },
  cookiesTitle: { it: 'Cookie', en: 'Cookies' },
  cookies: {
    it: 'Non usiamo cookie di profilazione o di marketing.',
    en: 'We do not use profiling or marketing cookies.'
  },
  hostingTitle: { it: 'Ospitalità del sito', en: 'Site hosting' },
  hosting: {
    it: 'Il sito è pubblicato come pagine statiche su GitHub Pages. Eventuali log tecnici di accesso li tratta GitHub, non noi. Vedi la ',
    en: 'The site is published as static pages on GitHub Pages. Any technical access logs are processed by GitHub, not by us. See the '
  },
  hostingPolicy: {
    it: 'nota di GitHub Pages sulla raccolta dati',
    en: 'GitHub Pages note on data collection'
  },
  mapsTitle: { it: 'Mappa', en: 'Map' },
  maps: {
    it: 'Sulla pagina Come arrivare la mappa chiede le immagini a OpenStreetMap. Il browser si collega ai loro server; OpenStreetMap può vedere l’indirizzo IP di chi guarda quella pagina. Vedi l’',
    en: 'On the Getting here page the map loads images from OpenStreetMap. Your browser connects to their servers; OpenStreetMap may see the IP address of people who view that page. See the '
  },
  mapsPolicy: {
    it: 'informativa sulla privacy di OpenStreetMap',
    en: 'OpenStreetMap privacy policy'
  },
  rightsTitle: { it: 'I tuoi diritti', en: 'Your rights' },
  rights: {
    it: 'Per i messaggi che ci hai inviato puoi chiedere di leggerli, correggerli o cancellarli, scrivendo all’indirizzo sopra. Non possiamo accedere ai log di GitHub Pages né a visite individuali in Simple Analytics: per quelli valgono le informative dei fornitori. Puoi presentare reclamo al Garante per la protezione dei dati personali.',
    en: 'For messages you have sent us, you can ask us to read, correct, or delete them by writing to the address above. We cannot access GitHub Pages logs or individual Simple Analytics visits: those sit with the providers’ own policies. You can lodge a complaint with the Italian Data Protection Authority (Garante).'
  }
} satisfies Record<string, LocalizedString>);
