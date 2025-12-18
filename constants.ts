
import { PaverModel } from './types';

export const PAVER_MODELS: PaverModel[] = [
  {
    id: '16-faces',
    name: 'Paver 16 Faces',
    dimensions: '24 × 10 × 6 cm',
    consumption: 42,
    image: 'https://picsum.photos/seed/paver16/400/300'
  },
  {
    id: 'tijolinho',
    name: 'Paver Tijolinho',
    dimensions: '20 × 10 × 6 cm',
    consumption: 50,
    image: 'https://picsum.photos/seed/tijolinho/400/300'
  }
];

export const LOSS_OPTIONS = [0, 5, 10];
export const DEFAULT_PRICE = 1.10;
export const LOCAL_STORAGE_KEY = 'concre7_history';
