import { Injectable } from '@angular/core';
import {Color, Quote, QuoteItem, Style, SubStyle} from "../shared/types";

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

  private getStoredQuotes(): Quote[] {
    const quotesString = this.storage.getItem(this.QUOTES_KEY);
    return quotesString ? JSON.parse(quotesString) : [];
  }

  createQuote(style: Style, subStyle: SubStyle, dimensions: number[], color: Color, quantity: number): Quote {
    const quotes = this.getStoredQuotes();
    const newQuote: Quote = {
      id: Date.now(),
      createdAt: new Date(),
      items: [{
        id: Date.now(),
        price: 1,
        style,
        subStyle,
        dimensions,
        color,
        quantity
      }],
      tax: 0,
      discount: 0,
      total: 0 // You might want to calculate this based on your business logic
    };
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

  addItemToQuote(quoteID: number, style: Style, subStyle: SubStyle, dimensions: number[], color: Color, quantity: number): Quote {
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
      quantity
    };
    quotes[quoteIndex].items.push(newItem);
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }

  updateItemRaw(quoteID: number, itemID: number, style: Style, subStyle: SubStyle, dimensions: number[], color: Color, quantity: number): Quote {
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    const itemIndex = quotes[quoteIndex].items.findIndex(item => item.id === itemID);
    if (itemIndex === -1) throw new Error('Item not found');

    quotes[quoteIndex].items[itemIndex] = {
      ...quotes[quoteIndex].items[itemIndex],
      style,
      subStyle,
      dimensions,
      color,
      quantity
    };
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }

  updateItem(quoteID: number, item: QuoteItem): Quote {
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    const itemIndex = quotes[quoteIndex].items.findIndex(i => i.id === item.id);
    if (itemIndex === -1) throw new Error('Item not found');

    quotes[quoteIndex].items[itemIndex] = item;
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }

  deleteItem(quoteID: number, itemID: number): Quote {
    const quotes = this.getStoredQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteID);
    if (quoteIndex === -1) throw new Error('Quote not found');

    quotes[quoteIndex].items = quotes[quoteIndex].items.filter(item => item.id !== itemID);
    this.saveQuotes(quotes);
    return quotes[quoteIndex];
  }
}
