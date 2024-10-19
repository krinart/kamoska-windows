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
  discountControl?: FormControl;
  taxControl?: FormControl;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private repoService: RepositoryService,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    const quoteID = Number(this.route.snapshot.paramMap.get('quoteID'));
    const quote = this.repoService.getQuote(quoteID);

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
    return datepipe.transform(quote.createdAt, 'dd MMMM, h:mm a');
  }

  itemInc(item: QuoteItem) {
    item.quantity += 1;
    this.updateQuoteItem(item);
  }

  itemDec(item: QuoteItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.updateQuoteItem(item);
    }
  }

  startEditItemPrice(item: QuoteItem) {
    this.itemPriceControls[item.id] = this.createNumberControl(item.price);
  }

  saveItemPrice(item: QuoteItem) {
    const control = this.itemPriceControls[item.id];
    if (control && control.valid) {
      item.price = control.value;
      this.updateQuoteItem(item);
      this.cancelEditItemPrice(item);
    }
  }

  cancelEditItemPrice(item: QuoteItem) {
    delete this.itemPriceControls[item.id];
  }

  startEditDiscount() {
    this.discountControl = this.createNumberControl(this.quote!.discount);
  }

  saveDiscount() {
    if (this.discountControl && this.discountControl.valid) {
      this.quote!.discount = this.discountControl.value;
      this.repoService.updateQuoteDiscount(this.quote!.id, this.discountControl.value);
      this.refreshQuote();
      this.cancelEditDiscount();
    }
  }

  cancelEditDiscount() {
    this.discountControl = undefined;
  }

  startEditTax() {
    this.taxControl = this.createNumberControl(this.quote!.tax, true);
  }

  saveTax() {
    if (this.taxControl && this.taxControl.valid) {
      this.quote!.tax = this.taxControl.value;
      this.repoService.updateQuoteTax(this.quote!.id, this.taxControl.value);
      this.refreshQuote();
      this.cancelEditTax();
    }
  }

  cancelEditTax() {
    this.taxControl = undefined;
  }

  private updateQuoteItem(item: QuoteItem) {
    this.repoService.updateItem(this.quote!.id, item);
    this.refreshQuote();
  }

  private refreshQuote() {
    this.quote = this.repoService.getQuote(this.quote!.id);
  }

  private createNumberControl(value: number, isPercentage: boolean = false): FormControl {
    return this.fb.control(
      value,
      [Validators.required, Validators.min(0), this.numberValidator(isPercentage)]
    );
  }

  numberValidator(isPercentage: boolean = false): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;  // let required validator handle empty values
      }
      // Use a regular expression to check if the value is a valid number
      // This regex allows integers, decimals, and negative numbers
      const isValid = /^-?\d*\.?\d+$/.test(value);
      if (!isValid) {
        return { 'notANumber': true };
      }
      if (isPercentage && (value < 0 || value > 100)) {
        return { 'percentageRange': true };
      }
      return null;
    };
  }

  getErrorMessage(control: FormControl): string {
    if (!control) return '';
    if (control.hasError('required')) return 'Value is required';
    if (control.hasError('min')) return 'Value must be 0 or greater';
    if (control.hasError('notANumber')) return 'Please enter a valid number';
    if (control.hasError('percentageRange')) return 'Percentage must be between 0 and 100';
    return '';
  }
}
