export interface Subject {
  id: string;
  name: string;
  credits: number;
  correlatives: string[]; // List of required subject IDs, or special strings like 'CRED-100'
  isElective?: boolean;
}

export interface AcademicPeriod {
  id: string;
  title: string;
  subjects: Subject[];
}

const CBC_IDS = ['CBC-24', 'CBC-40', 'CBC-66', 'CBC-62', 'CBC-03', 'CBC-90'];

export const industrial2020: AcademicPeriod[] = [
  {
    id: 'CBC',
    title: 'Primer Ciclo (CBC)',
    subjects: [
      { id: 'CBC-24', name: 'Introducción al Conocimiento de la Sociedad y el Estado', credits: 4, correlatives: [] },
      { id: 'CBC-40', name: 'Introducción al Pensamiento Científico', credits: 4, correlatives: [] },
      { id: 'CBC-66', name: 'Análisis Matemático A', credits: 9, correlatives: [] },
      { id: 'CBC-62', name: 'Álgebra A', credits: 9, correlatives: [] },
      { id: 'CBC-03', name: 'Física', credits: 6, correlatives: [] },
      { id: 'CBC-90', name: 'Pensamiento Computacional', credits: 6, correlatives: [] },
    ],
  },
  {
    id: 'Q3',
    title: 'Tercer Cuatrimestre',
    subjects: [
      { id: 'AM2', name: 'Análisis Matemático II', credits: 8, correlatives: CBC_IDS },
      { id: 'FSP', name: 'Física de los Sistemas de Partículas', credits: 6, correlatives: CBC_IDS },
      { id: 'PII', name: 'Principios de Ingeniería Industrial', credits: 6, correlatives: CBC_IDS },
    ],
  },
  {
    id: 'Q4',
    title: 'Cuarto Cuatrimestre',
    subjects: [
      { id: 'AL', name: 'Álgebra Lineal', credits: 8, correlatives: CBC_IDS },
      { id: 'QB', name: 'Química Básica', credits: 6, correlatives: CBC_IDS },
      { id: 'ERM', name: 'Estática y Resistencia de Materiales', credits: 6, correlatives: ['AM2', 'FSP'] },
      { id: 'ODE', name: 'Organización y Dirección Empresaria', credits: 6, correlatives: ['PII'] },
    ],
  },
  {
    id: 'Q5',
    title: 'Quinto Cuatrimestre',
    subjects: [
      { id: 'PROB', name: 'Probabilidad', credits: 6, correlatives: ['AM2'] },
      { id: 'ECO', name: 'Economía', credits: 6, correlatives: ['AM2', 'PII'] },
      { id: 'MA1', name: 'Materiales y Aplicaciones I', credits: 6, correlatives: ['QB', 'ERM', 'PII'] },
      { id: 'TE', name: 'Transformación de la Energía', credits: 8, correlatives: ['AM2', 'FSP', 'QB'] },
    ],
  },
  {
    id: 'Q6',
    title: 'Sexto Cuatrimestre',
    subjects: [
      { id: 'EyM', name: 'Electricidad y Magnetismo', credits: 6, correlatives: ['AM2', 'FSP'] },
      { id: 'DE', name: 'Desarrollo Económico', credits: 4, correlatives: ['ECO'] },
      { id: 'EA', name: 'Estadística Aplicada', credits: 8, correlatives: ['PROB'] },
      { id: 'GICV', name: 'Gestión Integral de la Cadena de Valor', credits: 8, correlatives: ['ODE'] },
    ],
  },
  {
    id: 'Q7',
    title: 'Séptimo Cuatrimestre',
    subjects: [
      { id: 'EMIE', name: 'Electrotecnia, Máquinas e Instalaciones Eléctricas', credits: 6, correlatives: ['EyM'] },
      { id: 'IO', name: 'Investigación Operativa', credits: 8, correlatives: ['AL', 'PROB'] },
      { id: 'SCGC', name: 'Sistemas Contables y Gestión de Costos', credits: 4, correlatives: ['ECO', 'GICV'] },
      { id: 'ID', name: 'Industrias Digitales', credits: 4, correlatives: ['EA'] },
      { id: 'IASCP', name: 'Ingeniería Ambiental, Sustentabilidad y Cuidado del Planeta', credits: 4, correlatives: ['CRED-100'] },
    ],
  },
  {
    id: 'Q8',
    title: 'Octavo Cuatrimestre',
    subjects: [
      { id: 'IE', name: 'Ingeniería Económica', credits: 4, correlatives: ['DE', 'SCGC'] },
      { id: 'ESAI', name: 'Equipos y Sistemas para Automatización Industrial', credits: 6, correlatives: ['EMIE', 'MA1'] },
      { id: 'IQ', name: 'Industrias Químicas', credits: 4, correlatives: ['MA1', 'TE'] },
      { id: 'TM', name: 'Transformación de Materiales', credits: 8, correlatives: ['MA1'] },
      { id: 'HyS', name: 'Higiene y Seguridad', credits: 2, correlatives: ['CRED-100'] },
    ],
  },
  {
    id: 'Q9',
    title: 'Noveno Cuatrimestre',
    subjects: [
      { id: 'IExtr', name: 'Industrias Extractivas', credits: 4, correlatives: ['TE', 'MA1'] },
      { id: 'PI', name: 'Proyecto Industrial', credits: 8, correlatives: ['EMIE', 'MA1', 'TE', 'HyS', 'IASCP'] },
      // Electives pool is handled separately, but we represent the requirement here
      { id: 'ELEC1', name: 'Electivas / Optativas (8 Créditos)', credits: 8, correlatives: [] }
    ],
  },
  {
    id: 'Q10',
    title: 'Décimo Cuatrimestre',
    subjects: [
      { id: 'LEP', name: 'Legislación y Ejercicio Profesional', credits: 2, correlatives: ['CRED-100'] },
      { id: 'TP_TESIS', name: 'Trabajo Profesional / Tesis', credits: 12, correlatives: ['CRED-140'] },
      { id: 'ELEC2', name: 'Electivas / Optativas (16 Créditos)', credits: 16, correlatives: [] }
    ],
  }
];

export const electives2020: Subject[] = [
  { id: 'E-GFP', name: 'Gestión Financiera y Presupuestaria', credits: 4, correlatives: ['SCGC'], isElective: true },
  { id: 'E-AC', name: 'Análisis de Casos', credits: 4, correlatives: ['IO'], isElective: true },
  { id: 'E-CDTD', name: 'Ciencia de Datos para la Toma de Decisiones', credits: 4, correlatives: ['EA'], isElective: true },
  { id: 'E-EAS', name: 'Estadística Aplicada Superior', credits: 4, correlatives: ['EA'], isElective: true },
  { id: 'E-IOS', name: 'Investigación Operativa Superior', credits: 4, correlatives: ['IO'], isElective: true },
  { id: 'E-CHCO', name: 'Capital Humano y Comportamiento Organizacional', credits: 4, correlatives: ['ODE'], isElective: true },
  { id: 'E-CPS', name: 'Comercialización de Productos y Servicios', credits: 4, correlatives: ['GICV'], isElective: true },
  { id: 'E-GC', name: 'Gerenciamiento de la Calidad', credits: 4, correlatives: ['GICV'], isElective: true },
  { id: 'E-IGE', name: 'Informática para la Gestión de Empresas', credits: 4, correlatives: ['ID'], isElective: true },
  { id: 'E-LSC', name: 'Logística y Supply Chain', credits: 4, correlatives: ['GICV'], isElective: true },
  { id: 'E-IGP', name: 'Innovación y Gestión de Proyectos', credits: 4, correlatives: ['DE', 'GICV'], isElective: true },
  { id: 'E-EI', name: 'Emprendimientos en Ingeniería', credits: 4, correlatives: ['CRED-100'], isElective: true },
  { id: 'E-DP', name: 'Diseño de Producto', credits: 4, correlatives: ['GICV', 'MA1'], isElective: true },
  { id: 'E-DPD', name: 'Diseño de Producto Digital', credits: 4, correlatives: ['ID'], isElective: true },
  { id: 'E-IDEE', name: 'Ingeniería y Desarrollo de Envases y Embalajes', credits: 4, correlatives: ['CRED-100'], isElective: true },
  { id: 'E-AB', name: 'Agroindustria y Bioeconomía', credits: 4, correlatives: ['CRED-100'], isElective: true },
  { id: 'E-BIP', name: 'Biopolímeros e Industrias Plásticas', credits: 4, correlatives: ['IQ'], isElective: true },
  { id: 'E-IA', name: 'Industria Automotriz', credits: 4, correlatives: ['GICV'], isElective: true },
  { id: 'E-ICP', name: 'Industrias de Celulosa y Papel', credits: 4, correlatives: ['IQ'], isElective: true },
  { id: 'E-IAli', name: 'Industrias de la Alimentación', credits: 4, correlatives: ['IQ'], isElective: true },
  { id: 'E-IP', name: 'Industrias Petrolíferas', credits: 4, correlatives: ['IQ'], isElective: true },
  { id: 'E-IT', name: 'Industrias Textiles', credits: 4, correlatives: ['GICV'], isElective: true },
  { id: 'E-MIP', name: 'Mantenimiento e Ingeniería de Planta', credits: 4, correlatives: ['GICV'], isElective: true },
  { id: 'E-MA2', name: 'Materiales y Aplicaciones II', credits: 4, correlatives: ['MA1'], isElective: true },
  { id: 'E-ITE', name: 'Introducción a la Transición Energética', credits: 4, correlatives: ['CRED-120'], isElective: true },
  { id: 'E-ER', name: 'Energías Renovables', credits: 4, correlatives: ['CRED-120'], isElective: true },
  { id: 'E-UEE', name: 'Uso Eficiente de la Energía', credits: 4, correlatives: ['CRED-120'], isElective: true },
  { id: 'E-FCTE', name: 'Fuentes Convencionales en la Transición Energética', credits: 4, correlatives: ['CRED-120'], isElective: true },
  { id: 'E-TETE', name: 'Tecnologías Emergentes en la Transición Energética', credits: 4, correlatives: ['CRED-120'], isElective: true },
  { id: 'E-TM', name: 'Taller de Manufactura', credits: 3, correlatives: ['PII', 'MA1'], isElective: true },
];
