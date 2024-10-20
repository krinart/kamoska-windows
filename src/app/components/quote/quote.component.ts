import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RepositoryService} from "../../services/repository.service";
import {Quote, QuoteItem} from "../../shared/types";
import {DatePipe} from "@angular/common";
import {AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators} from "@angular/forms";

import { jsPDF } from "jspdf";



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

  datepipe: DatePipe = new DatePipe('en-US');

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
        return this.datepipe.transform(quote.createdAt, 'dd MMMM, h:mm a');
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

  async generatePDF() {
    if (!this.quote) return;

    const pdf = new jsPDF();
    let yOffset = 20;

    // Header
    pdf.setFontSize(12);
    pdf.text('Lake Wash Windows & Doors- Commercial', 14, yOffset);
    pdf.text('740 SW 34th St', 14, yOffset + 5);
    pdf.text('Renton, WA 98057-4814', 14, yOffset + 10);

    yOffset += 25;

    // Quote details
    pdf.setFontSize(10);

    pdf.text(`Created Date: ${this.datepipe.transform(this.quote.createdAt, 'dd MMMM, yyyy')}`, 14, yOffset);

    yOffset += 10;

    // Items
    for (let i = 0; i < this.quote.items.length; i++) {
      yOffset = await this.addItemToPDF(pdf, this.quote.items[i], i + 1, yOffset);
    }

    // Footer
    pdf.setFontSize(12);
    yOffset += 20;
    pdf.text(`Subtotal: $${this.quote.subtotal.toFixed(2)}`, 14, yOffset);
    pdf.text(`Discount: $${this.quote.discount.toFixed(2)}`, 14, yOffset+7);
    pdf.text(`Tax: $${this.quote.taxAmount.toFixed(2)} (${this.quote.tax}%)`, 14, yOffset+14);
    pdf.text(`Total: $${this.quote.total.toFixed(2)}`, 14, yOffset+21);

    pdf.save(`Quote_${this.quote.id}.pdf`);
  }

  private async addItemToPDF(pdf: jsPDF, item: QuoteItem, lineNumber: number, yOffset: number): Promise<number> {
    if (yOffset > 250) {
      pdf.addPage();
      yOffset = 20;
    }

    const startY = yOffset;

    pdf.setDrawColor(200);  // Light gray color for the rectangle

    pdf.setFontSize(11);
    pdf.text(`Line: ${lineNumber}`, 14, yOffset);
    pdf.text(`Quantity: ${item.quantity}`, 50, yOffset);

    yOffset += 10;

    pdf.setFontSize(10);

    // Add image
    try {
      const imgData = await this.getBase64Image(item.subStyle.imageURL);
      pdf.addImage(imgData, 'PNG', 14, yOffset, 40, 40);
    } catch (error) {
      console.error('Error loading image:', error);
    }

    const itemDetails = [
      `${item.style.name}, ${item.subStyle.name}`,
      `Size = Net Frame: ${item.dimensions[0]}" x ${item.dimensions[1]}"`,
      `Glass = SunCoat (Low-E)`,
      `Hardware = Standard`,
    ];

    itemDetails.forEach((detail, index) => {
      pdf.text(detail, 60, yOffset + 5 + (index * 5));
    });

    yOffset += Math.max(45, itemDetails.length * 5 + 5);

    // Draw rectangle around the item
    pdf.rect(10, startY - 5, 190, yOffset - startY + 10);

    yOffset += 20;  // Add some space after the rectangle

    return yOffset;
  }

  private getBase64Image(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });
  }


}
