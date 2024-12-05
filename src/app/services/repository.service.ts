import { Injectable } from '@angular/core';
import {Color, DimensionValue, Quote, QuoteItem, Style, SubStyle} from "../shared/types";

const DEFAULT_SALES_TAX = 10;

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private storage: Storage;
  private readonly QUOTES_KEY = 'quotes';

  constructor() {
    this.storage = window.localStorage;
  }

  private saveQuotes(quotes: Quote[]): void {
    this.storage.setItem(this.QUOTES_KEY, JSON.stringify(quotes));
  }

  private applyFixes(quote: Quote): Quote {
    if (quote.customerInfo === undefined) {
        quote.customerInfo = {
            firstName: "", 
            lastName: "", 
            address: "", 
            phone: "", 
            email: "",
        }
    }

    if (quote.customID === undefined) {
      quote.customID = String(quote.id);
    }

    for (const item of quote.items) {
      if (item.title === undefined) {
        item.title = item.subStyle.name;
      }

      if (item.glassSpaceColor == "White") {
        item.glassSpaceColor = "Silver";
      }
    }

    return quote;
  }

  private getStoredQuotes(): Quote[] {
    const quotesString = this.storage.getItem(this.QUOTES_KEY);
    const quotes = quotesString ? JSON.parse(quotesString) : [];
    return quotes.map(this.applyFixes);
  }

  private updateQuoteTotal(quote: Quote) {
    const itemsTotal = quote.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const subtotal = itemsTotal - quote.discount;
    const tax = (subtotal * quote.tax) / 100;
    const total = subtotal + tax;

    quote.subtotal = Number(itemsTotal.toFixed(2));
    quote.taxAmount = Number(tax.toFixed(2));
    quote.total = Number(total.toFixed(2));
    // return Number(total.toFixed(2)); // Round to 2 decimal places
  }

  createQuote(style: Style, subStyle: SubStyle, dimensions: DimensionValue[], color: Color, quantity: number, glassType: string, glassOA: string, glassThickness: string, glassSpaceColor: string, frameType: string, gridType: string, gridSize: string, frameExteriorColor: string,frameInteriorColor: string,
              glassClearObscure: string, frameExteriorTrim: string, frameInteriorTrim: string
  ): Quote {
    const quotes = this.getStoredQuotes();
    const id = Number(new Date());
    const newQuote: Quote = {
      id: id,
      customID: String(id),
      createdAt: new Date(),
      customerInfo: {
        firstName: "", 
        lastName: "", 
        address: "", 
        phone: "", 
        email: ""
      },
      comment: "",
      items: [{
        id: Date.now(),
        price: 1,
        style,
        subStyle,
        dimensions,
        color,
        quantity,
        glassType,
        glassOA,
        glassThickness,
        glassSpaceColor,
        glassClearObscure,
        frameType,
        frameExteriorColor,
        frameInteriorColor,
        frameExteriorTrim,
        frameInteriorTrim,
        gridType,
        gridSize,
        title: subStyle.name,
        
      }],
      tax: DEFAULT_SALES_TAX,
      taxAmount: 0,
      subtotal: 0,
      discount: 0,
      total: 0
    };
    this.updateQuoteTotal(newQuote);
    quotes.push(newQuote);
    this.saveQuotes(quotes);
    return newQuote;
  }

  getQuotes(): Quote[] {
    return this.getStoredQuotes();
  }

  getQuote(quoteID: number): Quote | undefined {
    return this.getStoredQuotes().find(quote => quote.id === quoteID);
  }

  deleteQuote(quoteID: number): void {
    const quotes = this.getStoredQuotes().filter(quote => quote.id !== quoteID);
    this.saveQuotes(quotes);
  }

  addItemToQuote(quoteID: number, style: Style, subStyle: SubStyle, dimensions: DimensionValue[], color: Color, quantity: number, glassType: string, glassOA: string, glassThickness: string, glassSpaceColor: string, frameType: string, gridType: string, gridSize: string, frameExteriorColor: string,frameInteriorColor: string,
                 glassClearObscure: string, frameExteriorTrim: string, frameInteriorTrim: string
  ): Quote {
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    const newItem: QuoteItem = {
      id: Date.now(),
      price: 1,
      style,
      subStyle,
      dimensions,
      color,
      quantity,
      glassType,
      glassOA,
      glassThickness,
      glassSpaceColor,
      glassClearObscure,
      frameType,
      frameExteriorColor,
      frameInteriorColor,
      frameExteriorTrim,
      frameInteriorTrim,
      gridType,
      gridSize,
      title: subStyle.name,
    };
    quotes[quoteIndex].items.push(newItem);
    this.updateQuoteTotal(quotes[quoteIndex]);
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }

  updateItemRaw(quoteID: number, itemID: number, style: Style, subStyle: SubStyle, dimensions: DimensionValue[], color: Color, quantity: number, glassType: string, glassOA: string, glassThickness: string, glassSpaceColor: string, frameType: string, gridType: string, gridSize: string, frameExteriorColor: string,frameInteriorColor: string,
                glassClearObscure: string, frameExteriorTrim: string, frameInteriorTrim: string
  ): Quote {
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    const itemIndex = quotes[quoteIndex].items.findIndex(i => i.id === itemID);
    if (itemIndex === -1) throw new Error('Item not found');

    quotes[quoteIndex].items[itemIndex] = {
      ...quotes[quoteIndex].items[itemIndex],
      style,
      subStyle,
      dimensions,
      color,
      quantity,
      glassType,
      glassOA,
      glassThickness,
      glassSpaceColor,
      glassClearObscure,
      frameType,
      frameExteriorColor,
      frameInteriorColor,
      gridType,
      gridSize,
      frameExteriorTrim,
      frameInteriorTrim,
    };
    this.updateQuoteTotal(quotes[quoteIndex]);
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }

  updateItem(quoteID: number, item: QuoteItem): Quote {
    console.log(item);
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    const itemIndex = quotes[quoteIndex].items.findIndex(i => i.id === item.id);
    if (itemIndex === -1) throw new Error('Item not found');

    quotes[quoteIndex].items[itemIndex] = item;
    this.updateQuoteTotal(quotes[quoteIndex]);
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }

  deleteItem(quoteID: number, itemID: number): Quote {
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    quotes[quoteIndex].items = quotes[quoteIndex].items.filter(item => item.id !== itemID);
    this.updateQuoteTotal(quotes[quoteIndex]);
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }

  updateQuoteTax(quoteID: number, tax: number): Quote {
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    quotes[quoteIndex].tax = Number(tax);
    this.updateQuoteTotal(quotes[quoteIndex]);
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }

  updateQuoteDiscount(quoteID: number, discount: number): Quote {
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    quotes[quoteIndex].discount = Number(discount);
    this.updateQuoteTotal(quotes[quoteIndex]);
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }

  updateQuoteCustomID(quoteID: number, customID: string): Quote {
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    quotes[quoteIndex].customID = customID;
    this.updateQuoteTotal(quotes[quoteIndex]);
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }

  updateQuoteCustomerInfo(quoteID: number, firstName: string, lastName: string, address: string, phone: string, email: string): Quote {
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    quotes[quoteIndex].customerInfo = {firstName, lastName, address, phone, email};
    this.updateQuoteTotal(quotes[quoteIndex]);
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }

  updateQuoteComment(quoteID: number, comment: string): Quote {
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    quotes[quoteIndex].comment = comment;
    this.updateQuoteTotal(quotes[quoteIndex]);
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }
}
