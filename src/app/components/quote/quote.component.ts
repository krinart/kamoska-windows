import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RepositoryService} from "../../services/repository.service";
import {Quote} from "../../shared/types";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.less']
})
export class QuoteComponent {

  quote?: Quote;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private repoService: RepositoryService) {}

  ngOnInit(): void {
    const quoteID = Number(this.route.snapshot.paramMap.get('quoteID'));
    const quote = this.repoService.getQuote(quoteID)

    if (quote === undefined) {
      this.router.navigate(['/']);
      return;
    }

    this.quote = quote;
    console.log('quote', this.quote);
  }

  deleteItem(itemID: number) {
    this.quote = this.repoService.deleteItem(this.quote!.id, itemID);
  }

  getQuoteDate(quote: Quote): string|null {
    const datepipe: DatePipe = new DatePipe('en-US')
    // return datepipe.transform(quote.createdAt, 'dd-MMM-YYYY HH:mm:ss');
    return datepipe.transform(quote.createdAt, 'dd MMMM, h:mm a');
  }

}
