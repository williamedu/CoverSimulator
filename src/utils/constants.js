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

// NUEVO: Importamos las imágenes del modelo normal
import normalBase from '../assets/models/iphone-normal_base.png';
import normalTextura from '../assets/models/iphone-normal_textura.png';
import pro17Base from '../assets/models/iphone-17pro_base.png';
import pro17MaxTextura from '../assets/models/iphone-17promax_textura.png';

// DICCIONARIO DE MODELOS DE CELULAR
export const phoneModels = [
  {
    id: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    baseImage: pro17Base,        // Usamos la base del Pro
    textureImage: pro17MaxTextura // Reciclamos la textura del Pro Max
  },
  {
    id: 'iphone-17-pro-max',
    name: 'iPhone 17 Pro Max',
    baseImage: pro17Base,        // Reciclamos la base del Pro
    textureImage: pro17MaxTextura // Usamos la textura del Pro Max
  },
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
  },
  {
    id: 'iphone-normal',
    name: 'iPhone 13 / 14 Normal',
    baseImage: normalBase,
    textureImage: normalTextura
  }
];

// Paleta de colores simplificada para el forro base
export const caseColors = [
  { name: 'Verde', hex: '#166534' },
  { name: 'Rojo', hex: '#DC2626' },
  { name: 'Amarillo', hex: '#EAB308' },
  { name: 'Azul', hex: '#1D4ED8' },
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Crema', hex: '#131111' }
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