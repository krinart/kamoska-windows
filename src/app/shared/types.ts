export interface SubStyle {
  name: string,
  imageURL: string,
  sizeImageURL: string,
  extraDimension?: string,
}

export interface Style {
  name: string,
  imageURL: string,
  subStyles: SubStyle[],
}

export enum Color {
  Black,
  White,
  Tan,
}

export interface QuoteItem {
  id: number;
  style: Style,
  subStyle: SubStyle,
  dimensions: number[],
  color: Color,
  quantity: number,
  price: number,

  glassType: string,
  glassOA: string,
  glassThickness: string,
  glassSpaceColor: string,
  frameType: string,
  gridType: string,
  gridSize: string,
}

export interface Quote {
  id: number,
  createdAt: Date,
  items: QuoteItem[],
  subtotal: number,
  tax: number,
  taxAmount: number,
  discount: number,
  total: number,
}
