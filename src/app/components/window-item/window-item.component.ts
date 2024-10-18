import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Styles} from "../../shared/styles";
import {Color, Style, SubStyle} from "../../shared/types";
import {ActivatedRoute} from "@angular/router";
import {RepositoryService} from "../../services/repository.service";

@Component({
  selector: 'app-window-item',
  templateUrl: './window-item.component.html',
  styleUrls: ['./window-item.component.less']
})
export class WindowItemComponent {
  styles = Styles;
  currentStyle?: Style;
  currentSubStyle?: SubStyle;

  dimXControl = new FormControl("", [Validators.required]);
  dimYControl = new FormControl("", [Validators.required]);
  dimZControl = new FormControl("");

  @ViewChild('scrollTo')
  scrollTo?: ElementRef;

  // quoteID: number;
  // itemID: number;
  constructor(private route: ActivatedRoute,
              private repoService: RepositoryService) {}

  ngOnInit(): void {
    console.log('quoteID', this.route.snapshot.paramMap.get('quoteID'));
    console.log('itemID', this.route.snapshot.paramMap.get('itemID'));

    console.log('quotes', this.repoService.getQuotes());
  }

  styleClick(style: Style) {
    this.currentStyle = style;
    this.currentSubStyle = undefined;
    this.resetDimensions();
  }

  getStyleClass(style: Style): string {
    if (this.currentStyle !== undefined && this.currentStyle.name === style.name) {
      return 'selected';
    }

    return '';
  }

  subStyleClick(subStyle: SubStyle) {
    const isScroll = this.currentSubStyle === undefined;
    this.currentSubStyle = subStyle;

    if (isScroll) {
      setTimeout(() => {
        this.scrollTo?.nativeElement.scrollIntoView({behavior: 'smooth'});
      }, 100)
    }

    this.resetDimensions();
    console.log(subStyle.extraDimension);
    if (subStyle.extraDimension === undefined) {
      this.dimZControl.clearValidators();
    } else {
      this.dimZControl.setValidators([Validators.required]);
    }
    this.dimZControl.updateValueAndValidity();
  }

  getSubStyleClass(subStyle: SubStyle): string {
    if (this.currentSubStyle!== undefined && this.currentSubStyle.name === subStyle.name) {
      return 'selected';
    }

    return '';
  }

  resetDimensions() {
    // this.dimXControl.setValue("");
    // this.dimYControl.setValue("");
    // this.dimZControl.setValue("");

    this.dimXControl.markAsUntouched();
    this.dimYControl.markAsUntouched();
    this.dimZControl.markAsUntouched();

    this.dimXControl.markAsPristine();
    this.dimYControl.markAsPristine();
    this.dimZControl.markAsPristine();

    this.dimXControl.updateValueAndValidity();
    this.dimYControl.updateValueAndValidity();
    this.dimZControl.updateValueAndValidity();
  }

  onNext() {
    const isFormValid = this.dimXControl.valid && this.dimYControl.valid && this.dimZControl.valid;

    if (!isFormValid) {
      this.dimXControl.markAsTouched();
      this.dimYControl.markAsTouched();
      this.dimZControl.markAsTouched();
      return;
    }

    this.repoService.createQuote(
      this.currentStyle!,
      this.currentSubStyle!,
      [1, 2, 3],
      Color.White,
      1,
    );
  }

  isRequiredError(formControl: FormControl) {
    return formControl!.invalid && (formControl!.dirty || formControl!.touched) && formControl?.hasError('required');
  }
}
