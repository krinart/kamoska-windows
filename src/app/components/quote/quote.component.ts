import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RepositoryService} from "../../services/repository.service";
import {DimensionValue, Quote, QuoteItem} from "../../shared/types";
import {DatePipe} from "@angular/common";
import {CurrencyPipe} from "@angular/common";
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
  quoteIDFormControl?: FormControl;

  datepipe: DatePipe = new DatePipe('en-US');
  currency: CurrencyPipe = new CurrencyPipe('en-US');

  customerEditing = false;
  customerFirstNameFormControl = new FormControl("");
  customerLastNameFormControl = new FormControl("");
  customerAddressFormControl = new FormControl("");
  customerPhoneFormControl = new FormControl("");
  customerEmailFormControl = new FormControl("");

  commentFormControl?: FormControl;

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
  }

  startCommentEdit() {
    this.commentFormControl = this.fb.control(this.quote!.comment);
  }

  cancelCommentEdit() {
    this.commentFormControl = undefined;
  }

  saveComment() {
    this.quote!.comment = this.commentFormControl!.value!;
    this.repoService.updateQuoteComment(this.quote!.id, this.commentFormControl!.value!);
    this.cancelCommentEdit();
  }

  startCustomerEditing() {
    this.customerEditing = true;
    this.customerFirstNameFormControl.setValue(this.quote!.customerInfo.firstName);
    this.customerLastNameFormControl.setValue(this.quote!.customerInfo.lastName);
    this.customerAddressFormControl.setValue(this.quote!.customerInfo.address);
    this.customerPhoneFormControl.setValue(this.quote!.customerInfo.phone);
    this.customerEmailFormControl.setValue(this.quote!.customerInfo.email);
  }

  cancelCustomerEditing() {
    this.customerEditing = false;
  }

  saveCustomerInfo() {
    console.log(this.customerFirstNameFormControl.valid &&
        this.customerLastNameFormControl.valid &&
        this.customerAddressFormControl.valid &&
        this.customerPhoneFormControl.valid &&
        this.customerEmailFormControl.valid);
    if (this.customerFirstNameFormControl.valid &&
        this.customerLastNameFormControl.valid &&
        this.customerAddressFormControl.valid &&
        this.customerPhoneFormControl.valid &&
        this.customerEmailFormControl.valid) {
      this.repoService.updateQuoteCustomerInfo(this.quote!.id, 
        this.customerFirstNameFormControl.value!,
        this.customerLastNameFormControl.value!,
        this.customerAddressFormControl.value!,
        this.customerPhoneFormControl.value!,
        this.customerEmailFormControl.value!);

      this.quote!.customerInfo.firstName = this.customerFirstNameFormControl.value!;
      this.quote!.customerInfo.lastName = this.customerLastNameFormControl.value!;
      this.quote!.customerInfo.address = this.customerAddressFormControl.value!;
      this.quote!.customerInfo.phone = this.customerPhoneFormControl.value!;
      this.quote!.customerInfo.email = this.customerEmailFormControl.value!;

      this.cancelCustomerEditing();
    }
  }

  startEditQuoteID() {
    this.quoteIDFormControl = this.fb.control(
      this.quote!.customID,
      [Validators.required],
    );
  }

  cancelQuoteID() {
    this.quoteIDFormControl = undefined;
  }

  saveQuoteID() {
    if (this.quoteIDFormControl && this.quoteIDFormControl.valid) {
      this.quote!.customID = this.quoteIDFormControl.value;
      this.repoService.updateQuoteCustomID(this.quote!.id, this.quoteIDFormControl.value);
      this.cancelQuoteID();
    }
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
      item.price = Number(control.value);
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

  getDimensionString(dimesion: DimensionValue): string {
    return dimesion.base + " " + dimesion.fraction;
  }

  async generatePDF() {
    if (!this.quote) return;

    const pdf = new jsPDF();
    let yOffset = 20;

    // Header
    pdf.setFontSize(12);
    pdf.text('Kamoska Company LLC', 14, yOffset);
    pdf.text('19428 66th, Ave S, suite Q101', 14, yOffset + 5);
    pdf.text('Kent, WA, 98032', 14, yOffset + 10);
    pdf.text('(253) 364-9526', 14, yOffset + 15);
    pdf.text('Kamoskacompany@gmail.com', 14, yOffset + 20);
    pdf.text('www.greenview-windows.com', 14, yOffset + 25);

    try {
      const imgData = await this.getBase64Image('assets/images/Green-View-Logo.png');
      pdf.addImage(imgData, 'PNG', 144, yOffset-18, 50, 50);
    } catch (error) {
      console.error('Error loading image:', error);
    }

    yOffset += 40;

    // Quote details
    pdf.setFontSize(10);

    pdf.text(`Quote ID: ${this.quote.customID}`, 14, yOffset);
    pdf.text(`Created Date: ${this.datepipe.transform(this.quote.createdAt, 'dd MMMM, yyyy')}`, 14, yOffset+5);

    yOffset += 25;

    // Items
    for (let i = 0; i < this.quote.items.length; i++) {
      yOffset = await this.addItemToPDF(pdf, this.quote.items[i], i + 1, yOffset);
    }

    // Customer Info
    pdf.setFontSize(12);
    pdf.text(`Customer Info:`, 14, yOffset);
    yOffset += 7;

    if (this.quote.customerInfo.firstName !== "") {
        pdf.text(`First Name: ${this.quote.customerInfo.firstName}`, 14, yOffset);
        yOffset += 7;
    }
    if (this.quote.customerInfo.lastName !== "") {
        pdf.text(`First Name: ${this.quote.customerInfo.lastName}`, 14, yOffset);
        yOffset += 7;
    }
    if (this.quote.customerInfo.address !== "") {
        pdf.text(`Address: ${this.quote.customerInfo.address}`, 14, yOffset);
        yOffset += 7;
    }
    if (this.quote.customerInfo.phone !== "") {
        pdf.text(`Phone: ${this.quote.customerInfo.phone}`, 14, yOffset);
        yOffset += 7;
    }
    if (this.quote.customerInfo.email !== "") {
        pdf.text(`Email: ${this.quote.customerInfo.email}`, 14, yOffset);
        yOffset += 7;
    }
    
    // Footer
    pdf.setFontSize(12);
    yOffset += 20;
    pdf.text(`Subtotal: ${this.formatPrice(this.quote.subtotal)}`, 14, yOffset);
    pdf.text(`Discount: ${this.formatPrice(this.quote.discount)}`, 14, yOffset+7);
    pdf.text(`Tax: ${this.formatPrice(this.quote.taxAmount)} (${this.quote.tax}%)`, 14, yOffset+14);
    pdf.text(`Total: ${this.formatPrice(this.quote.total)}`, 14, yOffset+21);

    pdf.save(`Quote_${this.quote.customID}.pdf`);
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
    pdf.text(`Price Per Unit: ${this.formatPrice(item.price)}`, 55, yOffset);
    pdf.text(`Quantity: ${item.quantity}`, 120, yOffset);
    pdf.text(`Subtotal: ${this.formatPrice(item.quantity * item.price)}`, 165, yOffset);

    yOffset += 10;

    // Add image
    try {
      const imgData = await this.getBase64Image(item.subStyle.imageURL);
      pdf.addImage(imgData, 'PNG', 14, yOffset, 40, 40);
    } catch (error) {
      console.error('Error loading image:', error);
    }

    pdf.setFontSize(12);
    pdf.text(`${item.style.name}, ${item.subStyle.name}`, 60, yOffset + 5);

    yOffset += 12;

    pdf.setFontSize(10);

    let RO = `${item.dimensions[0].base} ${item.dimensions[0].fraction}" x ${item.dimensions[1].base} ${item.dimensions[1].fraction}"`;

    if (item.subStyle.extraDimension !== undefined) {
      RO += ` x ${item.dimensions[2].base} ${item.dimensions[2].fraction}"`
    }

    const itemDetails = [
      `Rough Opening: ${RO}`,
      `Frame: ${item.frameType}`,
      `Glass Type: ${item.glassType}`,
      `Glass OA: ${item.glassOA}"`,
      `Glass Thickness: ${item.glassThickness}"`,
      `Glass Spacer Color: ${item.glassSpaceColor}`,
      `Grid Type: ${item.gridType}`,
    ];

    if (item.gridType != 'None') {
      itemDetails.push(`Grid Size: ${item.gridSize}"`)
    }

    pdf.setFontSize(10);
    itemDetails.forEach((detail, index) => {
      pdf.text(detail, 60, yOffset + 5 + (index * 5));
    });

    yOffset += Math.max(30, itemDetails.length * 5 + 5);

    // Draw rectangle around the item
    pdf.rect(10, startY - 5, 190, yOffset - startY + 10);

    yOffset += 20;  // Add some space after the rectangle

    return yOffset;
  }

  formatPrice(price: number): string|null {
    return this.currency.transform(price, 'USD', 'symbol-narrow', '.0');
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
