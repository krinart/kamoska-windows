import { Injectable } from '@angular/core';
import {Color, Quote, Style, SubStyle} from "../shared/types";

const QUOTES_KEY = 'QUOTES';

type QuoteMap = {[id: number]: Quote};

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  private quotes: QuoteMap = {};
  private maxQuoteID: number;

  constructor() {
    this.quotes = this._readQuotes();

    this.maxQuoteID = Math.max(...Object.keys(this.quotes).map(Number));

    if (this.maxQuoteID === -Infinity) {
      this.maxQuoteID = 0;
    }
  }

  createQuote(style: Style, subStyle: SubStyle, dimensions: number[], color: Color, quantity: number): Quote {

    const quote: Quote = {
      id: this.maxQuoteID + 1,
      createdAt: new Date(),
      items: [{
        id: 1,
        style,
        subStyle,
        dimensions,
        color,
        quantity,
      }],
      tax: 0,
      discount: 0,
      total: 0,
    };

    this._updateQuote(quote);
    this.maxQuoteID += 1;

    return quote;
  }

  getQuotes(): Quote[] {
    return Object.values(this.quotes);
  }

  getQuote(quoteID: number): Quote|undefined {
    return this.quotes[quoteID];
  }

  deleteQuote(quoteID: number) {
    delete this.quotes[quoteID];
    localStorage.setItem(QUOTES_KEY, JSON.stringify(this.quotes));
  }

  addItemToQuote(quoteID: number, style: Style, subStyle: SubStyle, dimensions: number[], color: Color, quantity: number): Quote {
    const quote = this.quotes[quoteID];

    const lastItemID = quote.items.length == 0 ? 1 : quote.items[quote.items.length-1].id;

    quote.items.push({
        id: lastItemID+1,
        style,
        subStyle,
        dimensions,
        color,
        quantity,
      });

    this._updateQuote(quote);
    return quote;
  }

  deleteItem(quoteID: number, itemID: number): Quote {
    const quote = this.quotes[quoteID];
    quote.items = quote.items.filter(item => item.id !== itemID);
    this._updateQuote(quote);

    return quote;
  }

  private _readQuotes(): QuoteMap {
    const rawQuotes = localStorage.getItem(QUOTES_KEY);

    if (rawQuotes === null) {
      return {};
    }

    return JSON.parse(rawQuotes);
  }

  private _updateQuote(quote: Quote) {
    this.quotes[quote.id] = quote;
    localStorage.setItem(QUOTES_KEY, JSON.stringify(this.quotes));
  }


}
