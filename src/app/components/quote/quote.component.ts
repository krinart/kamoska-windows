import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RepositoryService} from "../../services/repository.service";
import {Quote} from "../../shared/types";

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

}
