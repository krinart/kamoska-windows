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

    // if (this.quotes.)
    this.maxQuoteID = Math.max(...Object.keys(this.quotes).map(Number));

    if (this.maxQuoteID === -Infinity) {
      this.maxQuoteID = 0;
    }
  }

  createQuote(style: Style, subStyle: SubStyle, dimensions: number[], color: Color, quantity: number): Quote {

    const quote: Quote = {
      id: this.maxQuoteID + 1,
      items: [{
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

  getQuote(quoteID: number): Quote|null {
    return this.quotes[quoteID];
  }

  deleteQuote(quoteID: number) {

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
