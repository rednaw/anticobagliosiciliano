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
		tagline: 'Spaziosa, luminosa, con loft e terrazza sui tetti',
		summary:
			'100 m² su due livelli, ideale per famiglie o due/tre coppie. Soggiorno ampio, due camere, loft e terrazza privata.',
		guests: '4–6 ospiti',
		size: '100 m²',
		bedrooms: '2 camere + loft',
		bathrooms: '2 bagni',
		image: '/images/houses/casa-1/01-img_6807.jpg',
		gallery: [
			'/images/houses/casa-1/02-img_6513.jpg',
			'/images/houses/casa-1/03-img_6514.jpg',
			'/images/houses/casa-1/04-img_6511.jpg',
			'/images/houses/casa-1/05-img_6494.jpg'
		],
		paragraphs: [
			'Su due livelli e circa 100 m², la casa si apre su un ampio soggiorno con due divani, un comodo tavolo da pranzo e una cucina bella e organizzata, aperta su un lato ma con spazio autonomo.',
			'Ci sono due camere spaziose e luminose, entrambe affacciate su un magnifico uliveto. La più grande ha un letto matrimoniale (160×200), la seconda due letti singoli che si possono affiancare. In entrambe c’è spazio per una culla.',
			'Dalla sala una scala in pietra conduce al grande loft, utilizzabile come terza camera per 2/3 persone, con divano letto (140×200) e spazio per un letto aggiuntivo. Da qui si accede a una terrazza di 15 m² sui tetti del baglio: ideale per colazione al sole, abbronzatura in privacy o fresco della sera.',
			'Due bagni eleganti con doccia, uno a piano terra e uno nel loft. L’ingresso dà sul cortile del baglio, con spazio riservato per sdraio o cene a lume di candela. Restaurata con pietre antiche, cotto artigianale e travi di castagno; riscaldamento per soggiorni anche invernali.'
		],
		highlights: ['Terrazza sui tetti 15 m²', 'Vista uliveto', 'Cucina attrezzata', 'Riscaldamento']
	},
	{
		slug: 'casa-2',
		name: 'Casa 2',
		tagline: 'Intima e raffinata, perfetta per coppie o piccole famiglie',
		summary:
			'65 m² su due piani con camera al piano terra, mezzanino e terrazza. Ideale per una coppia o 3–4 persone.',
		guests: '2–4 ospiti',
		size: '65 m²',
		bedrooms: '1 camera + mezzanino',
		bathrooms: '1 bagno',
		image: '/images/houses/casa-2/01-img_65581.jpg',
		gallery: [
			'/images/houses/casa-2/02-img_65771.jpg',
			'/images/houses/casa-2/03-img_6645.jpg',
			'/images/houses/casa-2/04-img_6643.jpg',
			'/images/houses/casa-2/05-img_6776.jpg',
			'/images/houses/casa-2/06-img_6609.jpg'
		],
		paragraphs: [
			'Su due piani e circa 65 m². L’ingresso apre su una zona pranzo ampia con cucina comoda e organizzata. Al piano terra la camera, luminosa, con grandi finestre sull’uliveto e letto matrimoniale (160×200); su richiesta terzo letto o culla. Accanto, bagno con doccia spaziosa.',
			'Una scala in pietra porta al mezzanino: zona living anche utilizzabile come seconda camera per 2/3 persone, con divano letto (140×200) e spazio per un letto extra. Da qui una terrazza di 15 m² sui tetti del baglio.',
			'Affaccio sul cortile con spazio riservato. Restauro con materiali di recupero, cotto artigianale e travi di castagno; riscaldamento per l’inverno. Perfetta per una coppia, una famiglia di 3/4 o due coppie.'
		],
		highlights: ['Terrazza 15 m²', 'Vista uliveto', 'Ideale per coppie', 'Riscaldamento']
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
		bathrooms: 'Bagni privati',
		image: '/images/houses/casa-3/01-ingresso-soggiorno.jpg',
		gallery: [
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
		image: '/images/houses/casa-4/01-porta-sul-cortile.jpg',
		gallery: [
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
		text: 'Riconoscimento per l’eccellenza nell’ospitalità e le recensioni eccellenti degli ospiti.',
		image: '/images/awards/superhost.png'
	},
	{
		title: 'Amato dagli ospiti Airbnb',
		text: 'Un premio speciale per attenzione e cura, e il rapporto di fiducia costruito nel tempo.',
		image: '/images/awards/guest-favorite.png'
	},
	{
		title: 'Traveller Review Awards',
		text: 'Premio annuale Booking.com basato sulle recensioni positive ricevute.',
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
	name: string;
	time: string;
	text: string;
	image: string;
};

export const places: Place[] = [
	{
		name: 'Faraglioni di Scopello',
		time: '20 min',
		text: 'Scogliere e acque cristalline ai piedi della Tonnara: un tuffo nel paesaggio più iconico della costa.',
		image: '/images/places/scopello.jpg'
	},
	{
		name: 'Tempio di Segesta',
		time: '20 min',
		text: 'Sito archeologico di rara bellezza: il tempio sulla collina e il teatro sul monte Barbaro con vista sul golfo.',
		image: '/images/places/segesta.jpg'
	},
	{
		name: 'Riserva dello Zingaro',
		time: '30 min',
		text: 'Costa protetta, calette di ciottoli e sentieri mediterranei tra scogliere e silenzio.',
		image: '/images/places/zingaro.jpg'
	},
	{
		name: 'Erice',
		time: '50 min',
		text: 'Borgo elimo a 800 m, vie acciottolate e viste sulle Egadi, le saline e Trapani.',
		image: '/images/places/erice.jpg'
	},
	{
		name: 'Selinunte',
		time: '45 min',
		text: 'Uno dei grandi siti greci di Sicilia: templi, acropoli e la spiaggia dove sbarcarono i coloni.',
		image: '/images/places/selinunte.jpg'
	},
	{
		name: 'Chiostro di Monreale',
		time: '40 min',
		text: 'Capolavoro norman-arabo-bizantino: mosaici e chiostro benedettino tra i gioielli d’Italia.',
		image: '/images/places/monreale.jpg'
	}
];

export function getHouse(slug: string): House | undefined {
	return houses.find((h) => h.slug === slug);
}
