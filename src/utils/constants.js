import { 
  Diamond, Skull, Alien, Crown, Heart, Star, 
  Lightning, Rocket, Anchor, Camera, Fire, Moon 
} from '@phosphor-icons/react';

// ==========================================
// IMPORTAMOS LAS IMÁGENES DE LOS MODELOS
// ==========================================
import proMaxBase from '../assets/models/iphone-promax_base.png';
import proMaxTextura from '../assets/models/iphone-promax_textura.png';
import proBase from '../assets/models/iphone-pro_base.png';
import proTextura from '../assets/models/iphone-pro_textura.png';

// DICCIONARIO DE MODELOS DE CELULAR
export const phoneModels = [
  {
    id: 'iphone-promax',
    name: 'iPhone 13 / 14 Pro Max',
    baseImage: proMaxBase,
    textureImage: proMaxTextura
  },
  {
    id: 'iphone-pro',
    name: 'iPhone 13 / 14 Pro',
    baseImage: proBase,
    textureImage: proTextura
  }
];

// Paleta de colores para el forro base
export const caseColors = [
  { name: 'Azul Real', hex: '#1D4ED8' },
  { name: 'Marrón Clásico', hex: '#8B4513' },
  { name: 'Verde Bosque', hex: '#166534' },
  { name: 'Negro Profundo', hex: '#1A1A1A' },
  { name: 'Gris Claro', hex: '#E5E7EB' },
  { name: 'Rojo Carmesí', hex: '#DC2626' },
  { name: 'Naranja Vivo', hex: '#EA580C' },
  { name: 'Lavanda', hex: '#A78BFA' },
  { name: 'Celeste', hex: '#7DD3FC' },
  { name: 'Crema', hex: '#FEF3C7' },
  { name: 'Rosa Pastel', hex: '#F9A8D4' },
  { name: 'Vino', hex: '#7F1D1D' }
];

// Paleta de colores FIJOS para los detalles (Letras e Ícono)
export const detailColorsList = [
  { name: 'Dorado', hex: '#D4AF37' },
  { name: 'Plata', hex: '#C0C0C0' },
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Negro', hex: '#1A1A1A' },
  { name: 'Vino', hex: '#7F1D1D' },
  { name: 'Rojo Clásico', hex: '#DC2626' },
  { name: 'Turquesa', hex: '#40E0D0' },
  { name: 'Azul Rey', hex: '#1D4ED8' },
  { name: 'Amarillo', hex: '#EAB308' },
  { name: 'Verde Esmeralda', hex: '#059669' },
  { name: 'Rosa Fuerte', hex: '#DB2777' },
  { name: 'Morado', hex: '#9333EA' }
];

// Lista de Iconos
export const iconsList = [
  { id: 'Diamond', component: Diamond },
  { id: 'Skull', component: Skull },
  { id: 'Alien', component: Alien },
  { id: 'Crown', component: Crown },
  { id: 'Heart', component: Heart },
  { id: 'Star', component: Star },
  { id: 'Lightning', component: Lightning },
  { id: 'Rocket', component: Rocket },
  { id: 'Anchor', component: Anchor },
  { id: 'Camera', component: Camera },
  { id: 'Fire', component: Fire },
  { id: 'Moon', component: Moon }
];