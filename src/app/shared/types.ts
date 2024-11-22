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

export interface DimensionValue {
  base: string,
  fraction: string,
}

export interface QuoteItem {
  id: number;
  style: Style,
  subStyle: SubStyle,
  dimensions: DimensionValue[],
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
  customID: string;
  createdAt: Date,
  items: QuoteItem[],
  subtotal: number,
  tax: number,
  taxAmount: number,
  discount: number,
  total: number,
  comment: string,
  customerInfo: {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
  }
}
