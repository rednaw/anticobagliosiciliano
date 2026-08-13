export const site = {
	name: 'Antico Baglio Siciliano',
	tagline: 'Case vacanze in Sicilia',
	location: 'Balestrate, Sicilia occidentale',
	email: 'info@anticobagliosiciliano.it',
	description:
		'Nel cuore della Sicilia occidentale, un’esperienza vera di relax e cultura in un antico baglio immerso tra agrumeto e uliveto.'
};

export type House = {
	slug: string;
	name: string;
	tagline: string;
	summary: string;
	guests: string;
	size: string;
	bedrooms: string;
	bathrooms: string;
	image: string;
	gallery: string[];
	paragraphs: string[];
	highlights: string[];
};

export const houses: House[] = [
	{
		slug: 'casa-1',
		name: 'Casa 1',
		tagline: 'Spaziosa, luminosa, con soppalco e terrazza sui tetti',
		summary:
			'Oltre 100 mq su due livelli, ideale per famiglie o due/tre coppie. Soggiorno ampio, due camere, soppalco e terrazza privata.',
		guests: '4–6 ospiti',
		size: '100 m²',
		bedrooms: '2 camere + soppalco',
		bathrooms: '2 bagni',
		image: '/images/houses/casa-1/00-img_6532.jpg',
		gallery: [
			'/images/houses/casa-1/01-img_6807.jpg',
			'/images/houses/casa-1/02-img_6513.jpg',
			'/images/houses/casa-1/03-img_6514.jpg',
			'/images/houses/casa-1/04-img_6511.jpg',
			'/images/houses/casa-1/05-img_6494.jpg'
		],
		paragraphs: [
			'Disposta su due livelli, per un totale di oltre 100 mq, la casa si apre su un ampio soggiorno con due divani, un comodo tavolo da pranzo e una bella cucina che, benché aperta da un lato, ha uno spazio autonomo, comodo e organizzato. Due sono le stanze da letto, entrambe spaziose e luminose ed entrambe affacciate su un magnifico uliveto. La più grande ha un letto matrimoniale (160 x 200), la seconda due letti singoli eventualmente affiancabili. In entrambe c’è lo spazio per un lettino per bambini.',
			'Una scala in muratura porta dal soggiorno all’ampio soppalco, dove si apre un’altra zona soggiorno eventualmente utilizzabile come terza camera da letto per 2/3 persone. Vi è infatti un divano letto (140x 200) e lo spazio per un eventuale letto supplementare. Da qui si accede a un bel terrazzo (15 mq) sui tetti del Baglio dove si può fare colazione col primo sole del mattino, prendere il sole in totale privacy o godersi il fresco della sera.',
			'La casa ha due bagni spaziosi ed eleganti, entrambi con doccia, uno a piano terra e uno nella zona soppalco.',
			'L’ingresso della casa si affaccia sul cortile del Baglio e nello spazio riservato antistante è possibile rilassarsi su una sdraio o cenare a lume di candela.',
			'La casa è frutto di un recente restauro: l’utilizzo di materiali di recupero, come antiche pietre e ringhiere, e la scelta di utilizzare cotto fatto a mano per i pavimenti e travi grezze di castagno per i soffitti, danno all’ambiente uno charme particolare. La casa ha un impianto di riscaldamento che la rende confortevole anche per un soggiorno invernale.',
			'Sistemazione ideale per una famiglia di 4/6 persone, per due/tre coppie di amici, per due famiglie.'
		],
		highlights: ['Terrazza sui tetti 15 mq', 'Vista uliveto', 'Cucina attrezzata', 'Riscaldamento']
	},
	{
		slug: 'casa-2',
		name: 'Casa 2',
		tagline: 'Intima e raffinata, perfetta per coppie o piccole famiglie',
		summary:
			'Circa 65 mq su due livelli con camera al piano terra, soppalco e terrazza. Ideale per una coppia o 3–4 persone.',
		guests: '2–4 ospiti',
		size: '65 m²',
		bedrooms: '1 camera + soppalco',
		bathrooms: '1 bagno',
		image: '/images/houses/casa-2/00-img_6783.jpg',
		gallery: [
			'/images/houses/casa-2/01-img_65581.jpg',
			'/images/houses/casa-2/02-img_65771.jpg',
			'/images/houses/casa-2/03-img_6645.jpg',
			'/images/houses/casa-2/04-img_6643.jpg',
			'/images/houses/casa-2/05-img_6776.jpg',
			'/images/houses/casa-2/06-img_6609.jpg'
		],
		paragraphs: [
			'La casa è disposta su due livelli per un totale di circa 65 mq. L’ingresso dà su un’ampia zona pranzo con una bella cucina a vista, comoda e organizzata. Sempre al piano terra si trova la stanza da letto, spaziosa e luminosa, con due grandi finestre affacciate su un magnifico uliveto. Il letto matrimoniale (160 x 200) lascia spazio ad un eventuale terzo letto o a un lettino per bambini (entrambi su richiesta). Accanto alla camera si trova un bagno con doccia, spazioso ed elegante.',
			'Una scala in muratura porta al soppalco dove si apre la zona soggiorno, eventualmente utilizzabile come seconda camera da letto per 2/3 persone. Vi si trova infatti un divano letto (140x 200) e vi è spazio per un eventuale letto supplementare.',
			'Da qui si accede a un bel terrazzo (15 mq) sui tetti del Baglio dove potrete fare colazione col primo sole del mattino, prendere il sole in totale privacy o godervi il fresco della sera.',
			'La casa si affaccia sul cortile del Baglio e nello spazio riservato antistante è possibile rilassarsi su una sdraio o cenare a lume di candela.',
			'La casa è frutto di un recente restauro: l’utilizzo di materiali di recupero, come antiche pietre e ringhiere, e la scelta di utilizzare cotto fatto a mano per i pavimenti e travi grezze di castagno per i soffitti, danno all’ambiente uno charme particolare. La casa ha un impianto di riscaldamento che la rende confortevole anche per un soggiorno invernale.',
			'Sistemazione ideale per una coppia, per una famiglia di 3/4 persone, per due coppie di amici.'
		],
		highlights: ['Terrazza 15 mq', 'Vista uliveto', 'Ideale per coppie', 'Riscaldamento']
	},
	{
		slug: 'casa-3',
		name: 'Casa 3',
		tagline: 'La più grande: tre camere e terrazza sull’uliveto',
		summary:
			'Oltre 110 m², tre camere e due soggiorni. Ideale per famiglie numerose o gruppi di amici.',
		guests: '4–8 ospiti',
		size: '110+ m²',
		bedrooms: '3 camere',
		bathrooms: '2 bagni',
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
			'/images/houses/casa-3/10-terrazzo.jpg',
			'/images/houses/casa-3/11-ingresso-sul-cortile.jpg'
		],
		paragraphs: [
			'Casa di campagna su due piani, oltre 110 m²: ideale per 4–8 persone, due/tre coppie o due famiglie. Al piano terra un ampio soggiorno-ingresso conduce all’area notte con tre camere luminose (due matrimoniali e una doppia o twin su richiesta). Due camere guardano l’uliveto, la terza il cortile. Il divano letto in soggiorno ospita altre due persone.',
			'Una scala in pietra lavica e ferro porta al primo piano: secondo soggiorno e zona cucina/pranzo con forno. Dalla zona living si accede a una terrazza di 15 m² sull’uliveto, per cene serali o relax in privacy.',
			'Ingresso sul cortile con spazio esclusivo. Restauro con cotto artigianale, pietra lavica e travi rustiche; riscaldamento per l’inverno.'
		],
		highlights: ['3 camere da letto', 'Terrazza sull’uliveto', 'Cucina con forno', 'Fino a 8 ospiti']
	},
	{
		slug: 'casa-4',
		name: 'Casa 4',
		tagline: 'La più elegante, con patio interno e vista sul Golfo',
		summary:
			'Oltre 110 m², patio privato e terrazza con tramonti sul Golfo di Castellammare.',
		guests: '4–7 ospiti',
		size: '110+ m²',
		bedrooms: '2 camere',
		bathrooms: '2 bagni',
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
		paragraphs: [
			'La casa più elegante del baglio: due livelli, oltre 110 m², ideale per 4–7 persone o due/tre coppie. Al piano terra un ampio soggiorno con due divani (uno trasformabile in letto doppio), cucina elegante, camera matrimoniale e bagno con doccia. Cucina, soggiorno e camera si aprono su un patio interno riservato per colazioni, pranzi e relax.',
			'Dal soggiorno una scala in mattoni porta al piano superiore: camera spaziosa con angolo lettura, letto matrimoniale separabile in due singoli e, su richiesta, letto aggiuntivo. Bagno en-suite con doccia. Dal balcone sul patio si accede a una terrazza con vista sul cortile e sui tetti del baglio — tramonti sul Golfo di Castellammare.',
			'Restauro con materiali di recupero, balcone antico in ferro, pavimenti in pietra e travi rustiche; riscaldamento per soggiorni invernali.'
		],
		highlights: ['Patio interno privato', 'Vista Golfo di Castellammare', '2 bagni', 'Atmosfera elegante']
	}
];

export const amenities = [
	{ title: 'Wi‑Fi gratuito', detail: 'Connessione in tutte le case' },
	{ title: 'Parcheggio interno', detail: 'Ampio spazio auto nel baglio' },
	{ title: 'Agrumeto e uliveto', detail: 'Relax tra alberi e profumi di Sicilia' },
	{ title: 'Area barbecue', detail: 'Cene all’aperto sotto la tettoia' },
	{ title: 'Pulizia all’arrivo', detail: 'Servizio professionale incluso' },
	{ title: 'Biancheria inclusa', detail: 'Lenzuola e asciugamani forniti' },
	{ title: 'Check-in flessibile', detail: 'Arrivi e partenze secondo i tuoi orari' }
];

export const awards = [
	{
		title: 'Superhost Airbnb',
		text: 'Ricevuto da Airbnb per l’eccellenza nell’ospitalità, garantendo esperienze di alta qualità e recensioni eccellenti da parte degli ospiti.',
		image: '/images/awards/superhost.png'
	},
	{
		title: 'Amato dagli ospiti Airbnb',
		text: 'Un riconoscimento speciale per l’attenzione e la cura verso gli ospiti, che ci ha permesso di costruire un rapporto di fiducia e calore.',
		image: '/images/awards/guest-favorite.png'
	},
	{
		title: 'Traveller Review Awards',
		text: 'Premio annuale assegnato da Booking.com basato sulle recensioni positive ricevute, a testimonianza della soddisfazione dei nostri clienti.',
		image: '/images/awards/traveller-review.png'
	}
];

export const testimonials = [
	{
		name: 'Carmine',
		source: 'Airbnb · 5 stelle',
		quote:
			'Bellissimo baglio e gentilissima ospitalità. Ritorniamo volentieri. Grazie tante a Marilena ed Elena.'
	},
	{
		name: 'Varvara',
		source: 'Airbnb · 5 stelle',
		quote:
			'Elena’s house was an oasis of style, beauty and tranquility. We were a bit worried of staying on Sicily in winter, but the house was very warm and cosy! We enjoyed staying there a lot!'
	}
];

export type Place = {
	slug: string;
	name: string;
	time: string;
	text: string;
	image: string;
};

/** Italian originals from Lodgify Imperdibili (archive/lodgify-com/text/imperdibili.md). */
export const places: Place[] = [
	{
		slug: 'tonnara-di-scopello',
		name: 'Tonnara di Scopello',
		time: '20 min',
		text: 'La Tonnara è un piccolo gioiello architettonico incastonato all’interno di un contesto paesaggistico di particolare bellezza. Ai piedi del borgo di Scopello, con i suoi splendidi faraglioni ed i ricchi fondali, assolutamente da non perdere un tuffo nelle sue acque. Nel suo territorio sorgeva la mitica città di Cetaria (terra dei tonni), citata nelle opere di Tolomeo e di Plinio per l’eccezionale abbondanza di tonni presenti nel suo mare. L’ultima stagione di pesca è stata nel 1984.',
		image: '/images/places/scopello.jpg'
	},
	{
		slug: 'segesta',
		name: 'Segesta',
		time: '20 min',
		text: 'Sito archeologico di rara bellezza. Si visita il tempio, posto su un poggio alle cui spalle si sviluppa un canyon, e il Teatro in cima al monte Barbaro da cui si gode un bellissimo panorama sul golfo.',
		image: '/images/places/segesta.jpg'
	},
	{
		slug: 'riserva-dello-zingaro',
		name: 'Riserva dello Zingaro',
		time: '30 min',
		text: 'Zona di costa protetta. Calette di ciotoli con acqua cristallina. Divieto alle imbarcazioni e alla pesca. Nella stagione meno calda è affascinante percorre il sentiero che congiunge i due ingressi della riserva. Panorami mozzafiato e profumi della macchia mediterranea.',
		image: '/images/places/zingaro.jpg'
	},
	{
		slug: 'duomo-di-monreale',
		name: 'Duomo di Monreale',
		time: '40 min',
		text: 'Visita immancabile. Uno dei gioielli più rari del patrimonio artistico italiano, sorprendente riuscita dell’incontro degli universi culturali islamico, bizantino, romanico: il Duomo normanno coi mosaici siculo-veneziani e il chiostro benedettino. Dal Belvedere vista sulla valle dell’Oreto e sulla Conca d’Oro.',
		image: '/images/places/monreale.jpg'
	},
	{
		slug: 'cappella-palatina',
		name: 'Cappella Palatina, Palermo',
		time: '40 min',
		text: 'Capolavoro dell’Arte Normanna. La Cappella Palatina di Palermo è l’esempio più elevato, dal punto di vista storico-artistico, della convivenza tra culture, religioni e modi di pensare apparentemente inconciliabili. Nella sua costruzione furono coinvolte maestranze bizantine, latine e musulmane, queste ultime eseguirono il soffitto a muqarnas, pregevole ed unico esempio al mondo di decorazioni pittoriche islamiche con rappresentazioni di figure umane all’interno di un luogo di culto.',
		image: '/images/places/cappella-palatina.jpg'
	},
	{
		slug: 'selinunte',
		name: 'Selinunte',
		time: '45 min',
		text: 'Uno dei maggiori centri archeologici siciliani. L’area da visitare è molto vasta. Comprende vari templi, resti di mura, strade ed edifici monumentali testimoni della grande ricchezza raggiunta da Selinunte. L’acropoli domina la splendida spiaggia, dove nel 650 a.C., sbarcarono i coloni di Megara Hyblaea, città greca della Sicilia orientale, i quali fondarono l’avamposto ellenico più a occidente di tutta l’isola.',
		image: '/images/places/selinunte.jpg'
	},
	{
		slug: 'erice',
		name: 'Erice',
		time: '50 min',
		text: 'Suggestivo borgo fondato dagli Elimi, posto in cima al monte Sant’Angelo a circa 800 metri, da cui è possibile ammirare panorami sulle isole Egadi, sulle saline e sulla città di Trapani. L’affascinante atmosfera dei tortuosi vicoli lastricati, delle chiese e dei cortiletti fioriti è resa ancora più unica dall’irreale momentanea nebbia, creata da nuvole di passaggio, che spesso ammanta la città.',
		image: '/images/places/erice.jpg'
	}
];

export function getHouse(slug: string): House | undefined {
	return houses.find((h) => h.slug === slug);
}
