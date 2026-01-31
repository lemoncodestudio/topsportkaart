// Topsport data voor Nederland
// Bronnen: Eredivisie.nl, KNHB, KNVB, NOC*NSF, Wikipedia

export interface SportEntry {
  id: string;
  name: string;
  type: 'team' | 'individual';
  sport: string;
  category: SportCategory;
  level: SportLevel;
  location: string; // Gemeente naam
  province: string;
  corop: string;
  points: number;
}

export type SportCategory =
  | 'voetbal'
  | 'hockey'
  | 'basketbal'
  | 'volleybal'
  | 'handbal'
  | 'wielrennen'
  | 'schaatsen'
  | 'zwemmen'
  | 'atletiek'
  | 'overig';

export type SportLevel =
  | 'eredivisie'
  | 'eerste_divisie'
  | 'hoofdklasse'
  | 'olympisch'
  | 'topsportcentrum'
  | 'ntc'
  | 'talentschool';

// Puntensysteem
export const POINTS = {
  eredivisie_voetbal: 10,
  eredivisie_overig: 5,
  eerste_divisie: 3,
  hoofdklasse: 5,
  olympisch: 2,
  topsportcentrum: 5, // TeamNL centra
  ntc: 4, // Nationale Trainingscentra
  talentschool: 2, // Topsport Talentscholen
};

// Mapping van steden naar provincies en COROP-gebieden
export const locationMapping: Record<string, { province: string; corop: string }> = {
  // Noord-Holland
  'Amsterdam': { province: 'Noord-Holland', corop: 'Groot-Amsterdam' },
  'Alkmaar': { province: 'Noord-Holland', corop: 'Alkmaar en omgeving' },
  'Haarlem': { province: 'Noord-Holland', corop: 'Agglomeratie Haarlem' },
  'Zaandam': { province: 'Noord-Holland', corop: 'Zaanstreek' },
  'Hilversum': { province: 'Noord-Holland', corop: 'Het Gooi en Vechtstreek' },
  'Heemstede': { province: 'Noord-Holland', corop: 'Agglomeratie Haarlem' },
  'Bloemendaal': { province: 'Noord-Holland', corop: 'Agglomeratie Haarlem' },
  'Huizen': { province: 'Noord-Holland', corop: 'Het Gooi en Vechtstreek' },
  'Den Helder': { province: 'Noord-Holland', corop: 'Kop van Noord-Holland' },
  'Volendam': { province: 'Noord-Holland', corop: 'Zaanstreek' },
  'Purmerend': { province: 'Noord-Holland', corop: 'Zaanstreek' },
  'IJmuiden': { province: 'Noord-Holland', corop: 'IJmond' },

  // Zuid-Holland
  'Rotterdam': { province: 'Zuid-Holland', corop: 'Groot-Rijnmond' },
  'Den Haag': { province: 'Zuid-Holland', corop: 'Agglomeratie \'s-Gravenhage' },
  "'s-Gravenhage": { province: 'Zuid-Holland', corop: "Agglomeratie 's-Gravenhage" },
  'Leiden': { province: 'Zuid-Holland', corop: 'Agglomeratie Leiden en Bollenstreek' },
  'Dordrecht': { province: 'Zuid-Holland', corop: 'Zuidoost-Zuid-Holland' },
  'Zoetermeer': { province: 'Zuid-Holland', corop: 'Agglomeratie \'s-Gravenhage' },
  'Delft': { province: 'Zuid-Holland', corop: 'Delft en Westland' },
  'Wassenaar': { province: 'Zuid-Holland', corop: "Agglomeratie 's-Gravenhage" },
  'Voorburg': { province: 'Zuid-Holland', corop: "Agglomeratie 's-Gravenhage" },
  'Sliedrecht': { province: 'Zuid-Holland', corop: 'Zuidoost-Zuid-Holland' },
  'Capelle aan den IJssel': { province: 'Zuid-Holland', corop: 'Groot-Rijnmond' },

  // Noord-Brabant
  'Eindhoven': { province: 'Noord-Brabant', corop: 'Zuidoost-Noord-Brabant' },
  'Tilburg': { province: 'Noord-Brabant', corop: 'Midden-Noord-Brabant' },
  'Breda': { province: 'Noord-Brabant', corop: 'West-Noord-Brabant' },
  "'s-Hertogenbosch": { province: 'Noord-Brabant', corop: 'Noordoost-Noord-Brabant' },
  'Den Bosch': { province: 'Noord-Brabant', corop: 'Noordoost-Noord-Brabant' },
  'Helmond': { province: 'Noord-Brabant', corop: 'Zuidoost-Noord-Brabant' },
  'Oss': { province: 'Noord-Brabant', corop: 'Noordoost-Noord-Brabant' },
  'Waalwijk': { province: 'Noord-Brabant', corop: 'Midden-Noord-Brabant' },
  'Roosendaal': { province: 'Noord-Brabant', corop: 'West-Noord-Brabant' },

  // Gelderland
  'Arnhem': { province: 'Gelderland', corop: 'Arnhem/Nijmegen' },
  'Nijmegen': { province: 'Gelderland', corop: 'Arnhem/Nijmegen' },
  'Apeldoorn': { province: 'Gelderland', corop: 'Veluwe' },
  'Ede': { province: 'Gelderland', corop: 'Veluwe' },
  'Doetinchem': { province: 'Gelderland', corop: 'Achterhoek' },
  'Deventer': { province: 'Overijssel', corop: 'Zuidwest-Overijssel' },
  'Zutphen': { province: 'Gelderland', corop: 'Achterhoek' },

  // Utrecht
  'Utrecht': { province: 'Utrecht', corop: 'Utrecht' },
  'Amersfoort': { province: 'Utrecht', corop: 'Utrecht' },
  'Bilthoven': { province: 'Utrecht', corop: 'Utrecht' },
  'Zeist': { province: 'Utrecht', corop: 'Utrecht' },

  // Overijssel
  'Enschede': { province: 'Overijssel', corop: 'Twente' },
  'Zwolle': { province: 'Overijssel', corop: 'Noord-Overijssel' },
  'Almelo': { province: 'Overijssel', corop: 'Twente' },
  'Hengelo': { province: 'Overijssel', corop: 'Twente' },

  // Groningen
  'Groningen': { province: 'Groningen', corop: 'Overig Groningen' },

  // Friesland
  'Leeuwarden': { province: 'Friesland', corop: 'Noord-Friesland' },
  'Heerenveen': { province: 'Friesland', corop: 'Zuidoost-Friesland' },
  'Sneek': { province: 'Friesland', corop: 'Zuidwest-Friesland' },

  // Drenthe
  'Emmen': { province: 'Drenthe', corop: 'Zuidoost-Drenthe' },
  'Assen': { province: 'Drenthe', corop: 'Noord-Drenthe' },
  'Hoogeveen': { province: 'Drenthe', corop: 'Zuidwest-Drenthe' },

  // Flevoland
  'Almere': { province: 'Flevoland', corop: 'Flevoland' },
  'Lelystad': { province: 'Flevoland', corop: 'Flevoland' },

  // Limburg
  'Maastricht': { province: 'Limburg', corop: 'Zuid-Limburg' },
  'Venlo': { province: 'Limburg', corop: 'Noord-Limburg' },
  'Sittard': { province: 'Limburg', corop: 'Zuid-Limburg' },
  'Kerkrade': { province: 'Limburg', corop: 'Zuid-Limburg' },
  'Weert': { province: 'Limburg', corop: 'Midden-Limburg' },
  'Roermond': { province: 'Limburg', corop: 'Midden-Limburg' },

  // Zeeland
  'Middelburg': { province: 'Zeeland', corop: 'Overig Zeeland' },
  'Vlissingen': { province: 'Zeeland', corop: 'Overig Zeeland' },
  'Goes': { province: 'Zeeland', corop: 'Overig Zeeland' },
  'Terneuzen': { province: 'Zeeland', corop: 'Zeeuwsch-Vlaanderen' },

  // Extra locaties voor Talentscholen
  'Hoofddorp': { province: 'Noord-Holland', corop: 'Agglomeratie Haarlem' },
  'Nijverdal': { province: 'Overijssel', corop: 'Twente' },
};

function getLocation(city: string): { province: string; corop: string } {
  return locationMapping[city] || { province: 'Onbekend', corop: 'Onbekend' };
}

// Eredivisie Voetbal 2024/2025
const eredivisieVoetbal: SportEntry[] = [
  { id: 'psv', name: 'PSV', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Eindhoven', ...getLocation('Eindhoven'), points: POINTS.eredivisie_voetbal },
  { id: 'ajax', name: 'Ajax', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Amsterdam', ...getLocation('Amsterdam'), points: POINTS.eredivisie_voetbal },
  { id: 'feyenoord', name: 'Feyenoord', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Rotterdam', ...getLocation('Rotterdam'), points: POINTS.eredivisie_voetbal },
  { id: 'az', name: 'AZ', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Alkmaar', ...getLocation('Alkmaar'), points: POINTS.eredivisie_voetbal },
  { id: 'fcutrecht', name: 'FC Utrecht', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Utrecht', ...getLocation('Utrecht'), points: POINTS.eredivisie_voetbal },
  { id: 'twente', name: 'FC Twente', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Enschede', ...getLocation('Enschede'), points: POINTS.eredivisie_voetbal },
  { id: 'nec', name: 'NEC', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Nijmegen', ...getLocation('Nijmegen'), points: POINTS.eredivisie_voetbal },
  { id: 'heerenveen', name: 'SC Heerenveen', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Heerenveen', ...getLocation('Heerenveen'), points: POINTS.eredivisie_voetbal },
  { id: 'gae', name: 'Go Ahead Eagles', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Deventer', ...getLocation('Deventer'), points: POINTS.eredivisie_voetbal },
  { id: 'fcgroningen', name: 'FC Groningen', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Groningen', ...getLocation('Groningen'), points: POINTS.eredivisie_voetbal },
  { id: 'sparta', name: 'Sparta Rotterdam', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Rotterdam', ...getLocation('Rotterdam'), points: POINTS.eredivisie_voetbal },
  { id: 'peczwolle', name: 'PEC Zwolle', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Zwolle', ...getLocation('Zwolle'), points: POINTS.eredivisie_voetbal },
  { id: 'fortunasittard', name: 'Fortuna Sittard', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Sittard', ...getLocation('Sittard'), points: POINTS.eredivisie_voetbal },
  { id: 'nac', name: 'NAC Breda', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Breda', ...getLocation('Breda'), points: POINTS.eredivisie_voetbal },
  { id: 'heracles', name: 'Heracles Almelo', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Almelo', ...getLocation('Almelo'), points: POINTS.eredivisie_voetbal },
  { id: 'willemii', name: 'Willem II', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Tilburg', ...getLocation('Tilburg'), points: POINTS.eredivisie_voetbal },
  { id: 'almere', name: 'Almere City FC', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Almere', ...getLocation('Almere'), points: POINTS.eredivisie_voetbal },
  { id: 'rkc', name: 'RKC Waalwijk', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eredivisie', location: 'Waalwijk', ...getLocation('Waalwijk'), points: POINTS.eredivisie_voetbal },
];

// Keuken Kampioen Divisie 2024/2025
const eerstedivisieVoetbal: SportEntry[] = [
  { id: 'fcvolendam', name: 'FC Volendam', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Volendam', ...getLocation('Volendam'), points: POINTS.eerste_divisie },
  { id: 'excelsior', name: 'Excelsior', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Rotterdam', ...getLocation('Rotterdam'), points: POINTS.eerste_divisie },
  { id: 'cambuur', name: 'SC Cambuur', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Leeuwarden', ...getLocation('Leeuwarden'), points: POINTS.eerste_divisie },
  { id: 'adodenhaag', name: 'ADO Den Haag', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Den Haag', ...getLocation('Den Haag'), points: POINTS.eerste_divisie },
  { id: 'fcdordrecht', name: 'FC Dordrecht', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Dordrecht', ...getLocation('Dordrecht'), points: POINTS.eerste_divisie },
  { id: 'degraafschap', name: 'De Graafschap', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Doetinchem', ...getLocation('Doetinchem'), points: POINTS.eerste_divisie },
  { id: 'fceindhoven', name: 'FC Eindhoven', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Eindhoven', ...getLocation('Eindhoven'), points: POINTS.eerste_divisie },
  { id: 'fcdenbosch', name: 'FC Den Bosch', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Den Bosch', ...getLocation('Den Bosch'), points: POINTS.eerste_divisie },
  { id: 'fcemmen', name: 'FC Emmen', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Emmen', ...getLocation('Emmen'), points: POINTS.eerste_divisie },
  { id: 'helmondsport', name: 'Helmond Sport', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Helmond', ...getLocation('Helmond'), points: POINTS.eerste_divisie },
  { id: 'mvv', name: 'MVV', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Maastricht', ...getLocation('Maastricht'), points: POINTS.eerste_divisie },
  { id: 'toposs', name: 'TOP Oss', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Oss', ...getLocation('Oss'), points: POINTS.eerste_divisie },
  { id: 'vitesse', name: 'Vitesse', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Arnhem', ...getLocation('Arnhem'), points: POINTS.eerste_divisie },
  { id: 'telstar', name: 'Telstar', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'IJmuiden', ...getLocation('IJmuiden'), points: POINTS.eerste_divisie },
  { id: 'vvvvenlo', name: 'VVV-Venlo', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Venlo', ...getLocation('Venlo'), points: POINTS.eerste_divisie },
  { id: 'rodajc', name: 'Roda JC', type: 'team', sport: 'Voetbal', category: 'voetbal', level: 'eerste_divisie', location: 'Kerkrade', ...getLocation('Kerkrade'), points: POINTS.eerste_divisie },
];

// Hoofdklasse Hockey Heren 2024/2025
const hoofdklasseHockey: SportEntry[] = [
  { id: 'ahbc', name: 'Amsterdamsche H&BC', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Amsterdam', ...getLocation('Amsterdam'), points: POINTS.hoofdklasse },
  { id: 'bloemendaal', name: 'HC Bloemendaal', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Bloemendaal', ...getLocation('Bloemendaal'), points: POINTS.hoofdklasse },
  { id: 'denbosch_hockey', name: "HC 's-Hertogenbosch", type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Den Bosch', ...getLocation('Den Bosch'), points: POINTS.hoofdklasse },
  { id: 'kampong', name: 'SV Kampong', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Utrecht', ...getLocation('Utrecht'), points: POINTS.hoofdklasse },
  { id: 'hcrotterdam', name: 'HC Rotterdam', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Rotterdam', ...getLocation('Rotterdam'), points: POINTS.hoofdklasse },
  { id: 'pinoke', name: 'HC Pinoké', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Amsterdam', ...getLocation('Amsterdam'), points: POINTS.hoofdklasse },
  { id: 'oranjerood', name: 'HC Oranje-Rood', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Eindhoven', ...getLocation('Eindhoven'), points: POINTS.hoofdklasse },
  { id: 'hurley', name: 'THC Hurley', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Amsterdam', ...getLocation('Amsterdam'), points: POINTS.hoofdklasse },
  { id: 'hdm', name: 'HV HDM', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Den Haag', ...getLocation('Den Haag'), points: POINTS.hoofdklasse },
  { id: 'hgc', name: 'HGC', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Wassenaar', ...getLocation('Wassenaar'), points: POINTS.hoofdklasse },
  { id: 'tilburg_hockey', name: 'HC Tilburg', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Tilburg', ...getLocation('Tilburg'), points: POINTS.hoofdklasse },
  { id: 'schc', name: 'SCHC', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Bilthoven', ...getLocation('Bilthoven'), points: POINTS.hoofdklasse },
  { id: 'kleinzwitserland', name: 'Klein Zwitserland', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Den Haag', ...getLocation('Den Haag'), points: POINTS.hoofdklasse },
  { id: 'nijmegen_hockey', name: 'HC Nijmegen', type: 'team', sport: 'Hockey', category: 'hockey', level: 'hoofdklasse', location: 'Nijmegen', ...getLocation('Nijmegen'), points: POINTS.hoofdklasse },
];

// Dutch Basketball League 2024/2025
const basketbalTeams: SportEntry[] = [
  { id: 'heroes', name: 'Heroes Den Bosch', type: 'team', sport: 'Basketbal', category: 'basketbal', level: 'eredivisie', location: 'Den Bosch', ...getLocation('Den Bosch'), points: POINTS.eredivisie_overig },
  { id: 'donar', name: 'Donar Groningen', type: 'team', sport: 'Basketbal', category: 'basketbal', level: 'eredivisie', location: 'Groningen', ...getLocation('Groningen'), points: POINTS.eredivisie_overig },
  { id: 'zzleiden', name: 'ZZ Leiden', type: 'team', sport: 'Basketbal', category: 'basketbal', level: 'eredivisie', location: 'Leiden', ...getLocation('Leiden'), points: POINTS.eredivisie_overig },
  { id: 'landstede', name: 'Landstede Hammers', type: 'team', sport: 'Basketbal', category: 'basketbal', level: 'eredivisie', location: 'Zwolle', ...getLocation('Zwolle'), points: POINTS.eredivisie_overig },
  { id: 'apollo', name: 'Apollo Amsterdam', type: 'team', sport: 'Basketbal', category: 'basketbal', level: 'eredivisie', location: 'Amsterdam', ...getLocation('Amsterdam'), points: POINTS.eredivisie_overig },
  { id: 'denheldersuns', name: 'Den Helder Suns', type: 'team', sport: 'Basketbal', category: 'basketbal', level: 'eredivisie', location: 'Den Helder', ...getLocation('Den Helder'), points: POINTS.eredivisie_overig },
  { id: 'balweert', name: 'BAL Weert', type: 'team', sport: 'Basketbal', category: 'basketbal', level: 'eredivisie', location: 'Weert', ...getLocation('Weert'), points: POINTS.eredivisie_overig },
  { id: 'rotterdamcity', name: 'Rotterdam City Basketball', type: 'team', sport: 'Basketbal', category: 'basketbal', level: 'eredivisie', location: 'Rotterdam', ...getLocation('Rotterdam'), points: POINTS.eredivisie_overig },
  { id: 'lwd', name: 'LWD Basket', type: 'team', sport: 'Basketbal', category: 'basketbal', level: 'eredivisie', location: 'Leeuwarden', ...getLocation('Leeuwarden'), points: POINTS.eredivisie_overig },
];

// Eredivisie Volleybal 2024/2025
const volleybalTeams: SportEntry[] = [
  { id: 'vcsneek', name: 'VC Sneek', type: 'team', sport: 'Volleybal', category: 'volleybal', level: 'eredivisie', location: 'Sneek', ...getLocation('Sneek'), points: POINTS.eredivisie_overig },
  { id: 'vvutrecht', name: 'VV Utrecht', type: 'team', sport: 'Volleybal', category: 'volleybal', level: 'eredivisie', location: 'Utrecht', ...getLocation('Utrecht'), points: POINTS.eredivisie_overig },
  { id: 'apollo8', name: 'Apollo 8', type: 'team', sport: 'Volleybal', category: 'volleybal', level: 'eredivisie', location: 'Borne', ...getLocation('Enschede'), points: POINTS.eredivisie_overig },
  { id: 'vczwolle', name: 'VC Zwolle', type: 'team', sport: 'Volleybal', category: 'volleybal', level: 'eredivisie', location: 'Zwolle', ...getLocation('Zwolle'), points: POINTS.eredivisie_overig },
  { id: 'sliedrechtsport', name: 'Sliedrecht Sport', type: 'team', sport: 'Volleybal', category: 'volleybal', level: 'eredivisie', location: 'Sliedrecht', ...getLocation('Sliedrecht'), points: POINTS.eredivisie_overig },
  { id: 'dynamo', name: 'SV Dynamo', type: 'team', sport: 'Volleybal', category: 'volleybal', level: 'eredivisie', location: 'Apeldoorn', ...getLocation('Apeldoorn'), points: POINTS.eredivisie_overig },
  { id: 'talentteam', name: 'Talentteam Papendal', type: 'team', sport: 'Volleybal', category: 'volleybal', level: 'eredivisie', location: 'Arnhem', ...getLocation('Arnhem'), points: POINTS.eredivisie_overig },
];

// Olympische/Individuele Topsporters (selectie van bekende Nederlandse topsporters)
const individueleSporters: SportEntry[] = [
  // Wielrennen
  { id: 'lavreysen', name: 'Harrie Lavreysen', type: 'individual', sport: 'Baanwielrennen', category: 'wielrennen', level: 'olympisch', location: 'Eindhoven', ...getLocation('Eindhoven'), points: POINTS.olympisch },
  { id: 'vanderpoel', name: 'Mathieu van der Poel', type: 'individual', sport: 'Wielrennen', category: 'wielrennen', level: 'olympisch', location: 'Kapellen', ...getLocation('Breda'), points: POINTS.olympisch },
  { id: 'hoogland', name: 'Jeffrey Hoogland', type: 'individual', sport: 'Baanwielrennen', category: 'wielrennen', level: 'olympisch', location: 'Nijverdal', ...getLocation('Almelo'), points: POINTS.olympisch },

  // Atletiek
  { id: 'hassan', name: 'Sifan Hassan', type: 'individual', sport: 'Atletiek', category: 'atletiek', level: 'olympisch', location: 'Eindhoven', ...getLocation('Eindhoven'), points: POINTS.olympisch },
  { id: 'bol', name: 'Femke Bol', type: 'individual', sport: 'Atletiek', category: 'atletiek', level: 'olympisch', location: 'Amersfoort', ...getLocation('Amersfoort'), points: POINTS.olympisch },
  { id: 'nageeye', name: 'Abdi Nageeye', type: 'individual', sport: 'Atletiek', category: 'atletiek', level: 'olympisch', location: 'Amsterdam', ...getLocation('Amsterdam'), points: POINTS.olympisch },
  { id: 'klaver', name: 'Lieke Klaver', type: 'individual', sport: 'Atletiek', category: 'atletiek', level: 'olympisch', location: 'Leiden', ...getLocation('Leiden'), points: POINTS.olympisch },

  // Schaatsen
  { id: 'leerdam', name: 'Jutta Leerdam', type: 'individual', sport: 'Schaatsen', category: 'schaatsen', level: 'olympisch', location: 'Den Haag', ...getLocation('Den Haag'), points: POINTS.olympisch },
  { id: 'roest', name: 'Patrick Roest', type: 'individual', sport: 'Schaatsen', category: 'schaatsen', level: 'olympisch', location: 'Lekkerkerk', ...getLocation('Rotterdam'), points: POINTS.olympisch },
  { id: 'nuis', name: 'Kjeld Nuis', type: 'individual', sport: 'Schaatsen', category: 'schaatsen', level: 'olympisch', location: 'Leiden', ...getLocation('Leiden'), points: POINTS.olympisch },
  { id: 'schouten', name: 'Irene Schouten', type: 'individual', sport: 'Schaatsen', category: 'schaatsen', level: 'olympisch', location: 'Andijk', ...getLocation('Alkmaar'), points: POINTS.olympisch },

  // Zwemmen
  { id: 'vanrouwendaal', name: 'Sharon van Rouwendaal', type: 'individual', sport: 'Zwemmen', category: 'zwemmen', level: 'olympisch', location: 'Eindhoven', ...getLocation('Eindhoven'), points: POINTS.olympisch },
  { id: 'corbeau', name: 'Caspar Corbeau', type: 'individual', sport: 'Zwemmen', category: 'zwemmen', level: 'olympisch', location: 'Eindhoven', ...getLocation('Eindhoven'), points: POINTS.olympisch },
  { id: 'kromowidjojo', name: 'Ranomi Kromowidjojo', type: 'individual', sport: 'Zwemmen', category: 'zwemmen', level: 'olympisch', location: 'Eindhoven', ...getLocation('Eindhoven'), points: POINTS.olympisch },
];

// TeamNL Centra (5 officiële centra)
const teamNLCentra: SportEntry[] = [
  { id: 'papendal', name: 'TeamNL Centrum Papendal', type: 'team', sport: 'TeamNL Centrum', category: 'overig', level: 'topsportcentrum', location: 'Arnhem', ...getLocation('Arnhem'), points: POINTS.topsportcentrum },
  { id: 'heerenveen_topsport', name: 'TeamNL Centrum Thialf', type: 'team', sport: 'TeamNL Centrum', category: 'schaatsen', level: 'topsportcentrum', location: 'Heerenveen', ...getLocation('Heerenveen'), points: POINTS.topsportcentrum },
  { id: 'eindhoven_topsport', name: 'TeamNL Centrum Eindhoven', type: 'team', sport: 'TeamNL Centrum', category: 'zwemmen', level: 'topsportcentrum', location: 'Eindhoven', ...getLocation('Eindhoven'), points: POINTS.topsportcentrum },
  { id: 'amsterdam_teamnl', name: 'TeamNL Centrum Amsterdam', type: 'team', sport: 'TeamNL Centrum', category: 'overig', level: 'topsportcentrum', location: 'Amsterdam', ...getLocation('Amsterdam'), points: POINTS.topsportcentrum },
  { id: 'denhaag_teamnl', name: 'TeamNL Centrum Den Haag', type: 'team', sport: 'TeamNL Centrum', category: 'overig', level: 'topsportcentrum', location: 'Den Haag', ...getLocation('Den Haag'), points: POINTS.topsportcentrum },
];

// Nationale Trainingscentra (NTC)
const nationaleTCentra: SportEntry[] = [
  { id: 'ntc_utrecht', name: 'NTC Utrecht', type: 'team', sport: 'Nationaal Trainingscentrum', category: 'overig', level: 'ntc', location: 'Utrecht', ...getLocation('Utrecht'), points: POINTS.ntc },
  { id: 'ntc_sittard', name: 'NTC Sittard', type: 'team', sport: 'Nationaal Trainingscentrum', category: 'overig', level: 'ntc', location: 'Sittard', ...getLocation('Sittard'), points: POINTS.ntc },
];

// Topsport Talentscholen (31 scholen - bron: NOC*NSF/EVOT)
const talentscholen: SportEntry[] = [
  // Noord
  { id: 'ts_groningen', name: 'Fivelcollege Groningen', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Groningen', ...getLocation('Groningen'), points: POINTS.talentschool },
  { id: 'ts_leeuwarden', name: 'Piter Jelles! Leeuwarden', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Leeuwarden', ...getLocation('Leeuwarden'), points: POINTS.talentschool },
  { id: 'ts_assen', name: 'Dr. Nassau College Assen', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Assen', ...getLocation('Assen'), points: POINTS.talentschool },
  { id: 'ts_emmen', name: 'Hondsrug College Emmen', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Emmen', ...getLocation('Emmen'), points: POINTS.talentschool },
  { id: 'ts_heerenveen', name: 'CSG Bogerman Heerenveen', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Heerenveen', ...getLocation('Heerenveen'), points: POINTS.talentschool },

  // Oost
  { id: 'ts_zwolle', name: 'Greijdanus Zwolle', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Zwolle', ...getLocation('Zwolle'), points: POINTS.talentschool },
  { id: 'ts_hengelo', name: 'Twickel College Hengelo', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Hengelo', ...getLocation('Hengelo'), points: POINTS.talentschool },
  { id: 'ts_apeldoorn', name: 'Veluws College Apeldoorn', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Apeldoorn', ...getLocation('Apeldoorn'), points: POINTS.talentschool },
  { id: 'ts_arnhem', name: 'Olympus College Arnhem', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Arnhem', ...getLocation('Arnhem'), points: POINTS.talentschool },
  { id: 'ts_nijmegen', name: 'Kandinsky College Nijmegen', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Nijmegen', ...getLocation('Nijmegen'), points: POINTS.talentschool },

  // Midden
  { id: 'ts_lelystad', name: 'Aeres VMBO & MBO Lelystad', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Lelystad', ...getLocation('Lelystad'), points: POINTS.talentschool },
  { id: 'ts_almere', name: 'Baken Park Lyceum Almere', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Almere', ...getLocation('Almere'), points: POINTS.talentschool },
  { id: 'ts_amersfoort', name: 'SG. Amersfoort', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Amersfoort', ...getLocation('Amersfoort'), points: POINTS.talentschool },
  { id: 'ts_utrecht', name: 'Leidsche Rijn College Utrecht', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Utrecht', ...getLocation('Utrecht'), points: POINTS.talentschool },

  // Noord-Holland
  { id: 'ts_alkmaar', name: 'Jac P. Thijsse College Alkmaar', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Alkmaar', ...getLocation('Alkmaar'), points: POINTS.talentschool },
  { id: 'ts_amsterdam1', name: 'Montessori Lyceum Amsterdam', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Amsterdam', ...getLocation('Amsterdam'), points: POINTS.talentschool },
  { id: 'ts_amsterdam2', name: 'IJburg College Amsterdam', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Amsterdam', ...getLocation('Amsterdam'), points: POINTS.talentschool },
  { id: 'ts_haarlem', name: 'Schoter Haarlem', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Haarlem', ...getLocation('Haarlem'), points: POINTS.talentschool },
  { id: 'ts_hoofddorp', name: 'De Meergronden Hoofddorp', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Hoofddorp', ...getLocation('Hoofddorp'), points: POINTS.talentschool },
  { id: 'ts_hilversum', name: 'Comenius Lyceum Hilversum', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Hilversum', ...getLocation('Hilversum'), points: POINTS.talentschool },

  // Zuid-Holland
  { id: 'ts_leiden', name: 'DaVinci College Leiden', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Leiden', ...getLocation('Leiden'), points: POINTS.talentschool },
  { id: 'ts_denhaag', name: 'Johan de Witt Scholengroep Den Haag', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Den Haag', ...getLocation('Den Haag'), points: POINTS.talentschool },
  { id: 'ts_rotterdam', name: 'Montessori ZMML Rotterdam', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Rotterdam', ...getLocation('Rotterdam'), points: POINTS.talentschool },
  { id: 'ts_dordrecht', name: 'DevelsteinCollege Dordrecht', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Dordrecht', ...getLocation('Dordrecht'), points: POINTS.talentschool },

  // Noord-Brabant
  { id: 'ts_breda', name: 'Mencia de Mendoza Lyceum Breda', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Breda', ...getLocation('Breda'), points: POINTS.talentschool },
  { id: 'ts_tilburg', name: 'ROC Tilburg', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Tilburg', ...getLocation('Tilburg'), points: POINTS.talentschool },
  { id: 'ts_denbosch', name: 'Jeroen Bosch College Den Bosch', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Den Bosch', ...getLocation('Den Bosch'), points: POINTS.talentschool },
  { id: 'ts_eindhoven', name: 'Van Maerlantlyceum Eindhoven', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Eindhoven', ...getLocation('Eindhoven'), points: POINTS.talentschool },

  // Limburg
  { id: 'ts_sittard', name: 'Trevianum Sittard', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Sittard', ...getLocation('Sittard'), points: POINTS.talentschool },
  { id: 'ts_roermond', name: 'Bischoppelijk College Roermond', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Roermond', ...getLocation('Roermond'), points: POINTS.talentschool },
  { id: 'ts_maastricht', name: 'VISTA College Maastricht', type: 'team', sport: 'Topsport Talentschool', category: 'overig', level: 'talentschool', location: 'Maastricht', ...getLocation('Maastricht'), points: POINTS.talentschool },
];

// Alle sportdata gecombineerd
export const allSportsData: SportEntry[] = [
  ...eredivisieVoetbal,
  ...eerstedivisieVoetbal,
  ...hoofdklasseHockey,
  ...basketbalTeams,
  ...volleybalTeams,
  ...individueleSporters,
  ...teamNLCentra,
  ...nationaleTCentra,
  ...talentscholen,
];

// Helper functies
export function calculateRegionScore(
  data: SportEntry[],
  regionType: 'province' | 'corop' | 'gemeente',
  regionName: string
): number {
  return data
    .filter(entry => {
      if (regionType === 'province') return entry.province === regionName;
      if (regionType === 'corop') return entry.corop === regionName;
      return entry.location === regionName;
    })
    .reduce((sum, entry) => sum + entry.points, 0);
}

export function getEntriesForRegion(
  data: SportEntry[],
  regionType: 'province' | 'corop' | 'gemeente',
  regionName: string
): SportEntry[] {
  return data.filter(entry => {
    if (regionType === 'province') return entry.province === regionName;
    if (regionType === 'corop') return entry.corop === regionName;
    return entry.location === regionName;
  });
}

// Inwoneraantallen per regio (voor normalisatie)
export const populationData: Record<string, number> = {
  // Provincies (2024 schattingen)
  'Noord-Holland': 2950000,
  'Zuid-Holland': 3750000,
  'Noord-Brabant': 2600000,
  'Gelderland': 2110000,
  'Utrecht': 1380000,
  'Overijssel': 1170000,
  'Limburg': 1115000,
  'Friesland': 660000,
  'Groningen': 590000,
  'Drenthe': 500000,
  'Flevoland': 440000,
  'Zeeland': 390000,

  // COROP-gebieden (2024 schattingen)
  'Groot-Amsterdam': 1400000,
  'Groot-Rijnmond': 1250000,
  "Agglomeratie 's-Gravenhage": 800000,
  'Zuidoost-Noord-Brabant': 780000,
  'Arnhem/Nijmegen': 750000,
  'Twente': 630000,
  'Midden-Noord-Brabant': 500000,
  'West-Noord-Brabant': 450000,
  'Noordoost-Noord-Brabant': 400000,
  'Agglomeratie Leiden en Bollenstreek': 420000,
  'Agglomeratie Haarlem': 300000,
  'Veluwe': 350000,
  'Noord-Overijssel': 350000,
  'Zuidwest-Overijssel': 120000,
  'Achterhoek': 310000,
  'Zuid-Limburg': 600000,
  'Noord-Limburg': 280000,
  'Midden-Limburg': 240000,
  'Alkmaar en omgeving': 290000,
  'Het Gooi en Vechtstreek': 260000,
  'Zaanstreek': 160000,
  'IJmond': 170000,
  'Kop van Noord-Holland': 130000,
  'Noord-Friesland': 320000,
  'Zuidwest-Friesland': 110000,
  'Zuidoost-Friesland': 130000,
  'Overig Groningen': 490000,
  'Oost-Groningen': 110000,
  'Delfzijl en omgeving': 45000,
  'Noord-Drenthe': 185000,
  'Zuidoost-Drenthe': 135000,
  'Zuidwest-Drenthe': 110000,
  'Delft en Westland': 200000,
  'Zuidoost-Zuid-Holland': 290000,
  'Oost-Zuid-Holland': 280000,
  'Overig Zeeland': 265000,
  'Zeeuwsch-Vlaanderen': 105000,
  'Zuidwest-Gelderland': 230000,
};

export function normalizeByPopulation(score: number, region: string): number {
  const population = populationData[region];
  if (!population) return score;
  // Score per 100.000 inwoners
  return (score / population) * 100000;
}
