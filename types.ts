
export interface PaverModel {
  id: string;
  name: string;
  dimensions: string;
  consumption: number; // pieces per m2
  image: string;
}

export interface CalculationResult {
  id: string;
  date: string;
  modelName: string;
  area: number;
  lossPercent: number;
  pricePerPiece: number;
  totalPieces: number;
  totalValue: number;
}

export enum Tab {
  CALCULATOR = 'calculator',
  HISTORY = 'history'
}
