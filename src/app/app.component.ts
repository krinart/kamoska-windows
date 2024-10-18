import {Component, ElementRef, ViewChild} from '@angular/core';
import {Styles} from "./shared/styles";
import {Style, SubStyle} from "./shared/types";
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  styles = Styles;
  currentStyle?: Style;
  currentSubStyle?: SubStyle;

  dimXControl = new FormControl("", [Validators.required]);
  dimYControl = new FormControl("", [Validators.required]);
  dimZControl = new FormControl("");

  @ViewChild('scrollTo')
  scrollTo?: ElementRef;

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
    const isFormFalid = this.dimXControl.valid && this.dimYControl.valid && this.dimZControl.valid;

    if (isFormFalid) {
      alert('Success')
    } else {
      this.dimXControl.markAsTouched();
      this.dimYControl.markAsTouched();
      this.dimZControl.markAsTouched();
    }
  }

  isRequiredError(formControl: FormControl) {
    return formControl!.invalid && (formControl!.dirty || formControl!.touched) && formControl?.hasError('required');
  }
}
