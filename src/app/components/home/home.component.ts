import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CurrencyPipe} from "@angular/common";
import {RepositoryService} from "../../services/repository.service";
import {Quote} from "../../shared/types";
import { I18nPluralPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {

  quotes: Quote[] = [];
  currency: CurrencyPipe = new CurrencyPipe('en-US');
  datepipe: DatePipe = new DatePipe('en-US');

  constructor(private route: ActivatedRoute,
              private router: Router,
              private repoService: RepositoryService,
              private pluralPipe: I18nPluralPipe) {
    this.quotes = this.repoService.getQuotes();
  }

  transformItems(value: number) {
    const pluralMap = {
      '=0': 'No items',
      '=1': '1 item',
      'other': '# items'
    };
    return this.pluralPipe.transform(value, pluralMap);
  }

  formatPrice(price: number): string|null {
    return this.currency.transform(price, 'USD', 'symbol-narrow', '.0');
  }

  getQuoteTitle(quote: Quote): string {

    let title = '';

    if (quote.customerInfo.firstName != "") {
      title += quote.customerInfo.firstName;
    }

    if (quote.customerInfo.lastName != "") {
      title += ' ' + quote.customerInfo.lastName;
    }

    if (title != "") {
      title += ", "
    }

    title += `${this.getQuoteDate(quote)}`

    title += ` (${this.transformItems(quote.items.length)} - ${this.formatPrice(quote.total)})`

    return title;
  }

  deleteQuote(quoteID: number) {
    this.repoService.deleteQuote(quoteID);
    this.quotes = this.repoService.getQuotes();
  }

  getQuoteDate(quote: Quote): string|null {
    return this.datepipe.transform(quote.createdAt, 'dd MMMM, h:mm a');
  }

}
