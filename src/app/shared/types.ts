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
  style: Style,
  subStyle: SubStyle,
  dimensions: number[],
  // extraDimensionName: string|null,
  color: Color,
  quantity: number,
}

export interface Quote {
  id: number;
  items: QuoteItem[],
  tax: number,
  discount: number,
  total: number,
}
