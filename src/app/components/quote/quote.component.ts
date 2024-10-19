import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RepositoryService} from "../../services/repository.service";
import {Quote, QuoteItem} from "../../shared/types";
import {DatePipe} from "@angular/common";
import {AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators} from "@angular/forms";

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.less']
})
export class QuoteComponent {

  quote?: Quote;
  itemPriceControls: { [key: number]: FormControl } = {};

  constructor(private route: ActivatedRoute,
              private router: Router,
              private repoService: RepositoryService,
              private fb: FormBuilder) {}

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

  itemInc(item: QuoteItem) {
    item.quantity += 1;
    this.repoService.updateItem(this.quote!.id, item);
  }

  itemDec(item: QuoteItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.repoService.updateItem(this.quote!.id, item);
    }
  }

  startEditItemPrice(item: QuoteItem) {
    this.itemPriceControls[item.id] = this.fb.control(
      item.price,
      [Validators.required, Validators.min(0), this.numberValidator()]);
  }

  saveItemPrice(item: QuoteItem) {
    const control = this.itemPriceControls[item.id];
    if (control && control.valid) {
      item.price = control.value;
      this.repoService.updateItem(this.quote!.id, item);
      this.cancelEditItemPrice(item);
    }
  }

  cancelEditItemPrice(item: QuoteItem) {
    delete this.itemPriceControls[item.id];
  }

  numberValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;  // let required validator handle empty values
      }
      // Use a regular expression to check if the value is a valid number
      // This regex allows integers, decimals, and negative numbers
      const isValid = /^-?\d*\.?\d+$/.test(value);
      return isValid ? null : { 'notANumber': true };
    };
  }

  getErrorMessage(item: QuoteItem): string {
    const control = this.itemPriceControls[item.id];
    if (!control) return '';
    if (control.hasError('required')) return 'Price is required';
    if (control.hasError('min')) return 'Price must be 0 or greater';
    if (control.hasError('notANumber')) return 'Please enter a valid number';
    return '';
  }

}
