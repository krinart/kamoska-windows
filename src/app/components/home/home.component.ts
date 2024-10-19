import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RepositoryService} from "../../services/repository.service";
import {Quote} from "../../shared/types";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {

  quotes: Quote[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private repoService: RepositoryService) {
    this.quotes = this.repoService.getQuotes();
  }

  deleteQuote(quoteID: number) {
    this.repoService.deleteQuote(quoteID);
    this.quotes = this.repoService.getQuotes();
  }

  getQuoteDate(quote: Quote): string|null {
    const datepipe: DatePipe = new DatePipe('en-US')
    return datepipe.transform(quote.createdAt, 'dd MMMM, h:mm a');
  }

}
