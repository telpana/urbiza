export type ZonaSlug =
  | 'santo-domingo' | 'punta-cana' | 'santiago' | 'las-terrenas' | 'samana'
  | 'bavaro' | 'cap-cana' | 'la-romana' | 'sosua' | 'cabarete'
  | 'naco' | 'piantini' | 'bella-vista'

export const zonasMeta: Record<string, { nombre: string; texto: string }> = {
  'santo-domingo': {
    nombre: 'Santo Domingo',
    texto: 'Santo Domingo es la capital y ciudad más grande de República Dominicana. Ofrece una gran variedad de propiedades desde apartamentos modernos en Piantini y Naco hasta casas en Arroyo Hondo y La Esperilla. Es el centro financiero y cultural del país.',
  },
  'punta-cana': {
    nombre: 'Punta Cana',
    texto: 'Punta Cana es el destino turístico más reconocido del Caribe. Sus playas de arena blanca y aguas turquesas hacen de esta zona un lugar ideal para inversión inmobiliaria. Encuentra villas, condominios frente al mar y residencias de lujo.',
  },
  'santiago': {
    nombre: 'Santiago de los Caballeros',
    texto: 'Santiago es la segunda ciudad más importante de República Dominicana. Con una economía sólida y crecimiento constante, ofrece excelentes oportunidades en bienes raíces, desde apartamentos céntricos hasta casas en urbanizaciones residenciales.',
  },
  'las-terrenas': {
    nombre: 'Las Terrenas',
    texto: 'Las Terrenas, en la Península de Samaná, es uno de los destinos más exclusivos de RD. Con playas vírgenes y un ambiente cosmopolita, atrae inversores internacionales que buscan villas, casas de playa y apartamentos en entornos naturales privilegiados.',
  },
  'samana': {
    nombre: 'Samaná',
    texto: 'La Península de Samaná es uno de los rincones más espectaculares del Caribe. Con municipios como Las Terrenas, Las Galeras y Santa Bárbara de Samaná, ofrece una naturaleza exuberante, playas de ensueño y una creciente comunidad internacional. Ideal para villas, casas de playa y proyectos de ecoturismo.',
  },
  'bavaro': {
    nombre: 'Bávaro',
    texto: 'Bávaro es el corazón turístico de Punta Cana, conocido por sus hoteles de clase mundial y playas de ensueño. Es una zona de alta demanda para inversión inmobiliaria, con condominios, villas y apartamentos cerca de la playa.',
  },
  'cap-cana': {
    nombre: 'Cap Cana',
    texto: 'Cap Cana es la comunidad privada más exclusiva del Caribe. Con marina, campos de golf y residencias de lujo, ofrece el más alto estándar de vida en República Dominicana. Ideal para inversores que buscan propiedades premium.',
  },
  'la-romana': {
    nombre: 'La Romana',
    texto: 'La Romana combina historia, cultura y naturaleza. Hogar de Casa de Campo, uno de los resorts más exclusivos del mundo, ofrece propiedades únicas entre la costa y el campo dominicano.',
  },
  'sosua': {
    nombre: 'Sosúa',
    texto: 'Sosúa es una pintoresca ciudad costera en la costa norte de República Dominicana. Con playas de aguas cristalinas y una comunidad internacional vibrante, es perfecta para quienes buscan propiedades cerca del mar a precios accesibles.',
  },
  'cabarete': {
    nombre: 'Cabarete',
    texto: 'Cabarete es la capital mundial del kitesurf y el windsurf. Este pueblo costero en Puerto Plata atrae a viajeros y residentes de todo el mundo, con propiedades frente al mar, villas y apartamentos en un ambiente bohemio y relajado.',
  },
  'naco': {
    nombre: 'Naco',
    texto: 'Naco es uno de los sectores más codiciados de Santo Domingo, con acceso privilegiado a restaurantes, centros comerciales y oficinas. Ofrece apartamentos modernos y casas en un entorno urbano de primer nivel.',
  },
  'piantini': {
    nombre: 'Piantini',
    texto: 'Piantini es el barrio más exclusivo de Santo Domingo. Con una arquitectura moderna y una oferta residencial de lujo, es el destino preferido de ejecutivos y familias que buscan calidad de vida en la capital dominicana.',
  },
  'bella-vista': {
    nombre: 'Bella Vista',
    texto: 'Bella Vista es un sector residencial y comercial de Santo Domingo que combina tranquilidad y accesibilidad. Ofrece apartamentos, casas y locales comerciales en una zona estratégica de la ciudad.',
  },
}

export const slugToZona: Record<string, string> = {
  'santo-domingo': 'Santo Domingo',
  'punta-cana': 'Punta Cana',
  'santiago': 'Santiago',
  'las-terrenas': 'Las Terrenas',
  'samana': 'Samaná',
  'bavaro': 'Bávaro',
  'cap-cana': 'Cap Cana',
  'la-romana': 'La Romana',
  'sosua': 'Sosúa',
  'cabarete': 'Cabarete',
  'naco': 'Naco',
  'piantini': 'Piantini',
  'bella-vista': 'Bella Vista',
}

export const slugs = Object.keys(zonasMeta)

// Sub-zonas que se incluyen al buscar por una zona principal
export const zonaGrupos: Record<string, string[]> = {
  'punta-cana':    ['Punta Cana', 'Bávaro', 'Pueblo Bávaro', 'Downtown Punta Cana', 'Cap Cana', 'Bávaro Hills', 'Los Corales', 'Cabeza de Toro', 'Uvero Alto', 'Macao', 'Cortecito', 'Verón', 'Arena Gorda', 'Bayahibe', 'Dominicus'],
  'bavaro':        ['Bávaro', 'Pueblo Bávaro', 'Cortecito', 'Los Corales', 'Cabeza de Toro', 'Arena Gorda', 'Bávaro Hills'],
  'santo-domingo': ['Santo Domingo', 'Piantini', 'Naco', 'Serrallés', 'Bella Vista', 'Arroyo Hondo', 'Evaristo Morales', 'Los Cacicazgos', 'Gazcue', 'Ciudad Colonial', 'La Esperilla', 'Distrito Nacional', 'Santo Domingo Este', 'Santo Domingo Norte', 'Santo Domingo Oeste'],
  'santiago':      ['Santiago', 'Los Jardines', 'Cerros de Gurabo', 'Reparto Conuco', 'Villa Olga', 'Pontificia', 'Nibaje'],
  'las-terrenas':  ['Las Terrenas', 'El Portillo', 'Cosón'],
  'samana':        ['Samaná', 'Las Terrenas', 'Las Galeras', 'Sánchez', 'El Portillo', 'Cosón', 'El Limón', 'Santa Bárbara de Samaná'],
  'la-romana':     ['La Romana', 'Casa de Campo'],
  'sosua':         ['Sosúa', 'Costámbar', 'Cofresí'],
  'cabarete':      ['Cabarete', 'Playa Dorada', 'Puerto Plata'],
}
