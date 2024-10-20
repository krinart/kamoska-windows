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
  // extraDimensionName: string|null,
  color: Color,
  quantity: number,
  price: number,
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
