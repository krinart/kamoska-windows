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

export interface StyleSection {
    style: Style,
    subStyle: SubStyle,
    dimensions: number[],
    extraDimensionName: string|null,
}

export interface OtherSection {
    color: Color,
}

export interface QuoteItem {
    styleSection: StyleSection,
    otherSection: OtherSection,
    quantity: number,

}

export interface Cart {
    items: QuoteItem[],
    tax: number,
    discount: number,
    total: number,
}
