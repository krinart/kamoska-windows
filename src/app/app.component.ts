import {Component, ElementRef, ViewChild} from '@angular/core';
import {Styles} from "./shared/styles";
import {Style, SubStyle} from "./shared/types";
import {FormControl} from '@angular/forms';
// import {setTimeout} from "timers";

const DEFAULT_DIM_VALUE = '';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  styles = Styles;
  currentStyle?: Style;
  currentSubStyle?: SubStyle;

  dimXControl = new FormControl(DEFAULT_DIM_VALUE);
  dimYControl = new FormControl(DEFAULT_DIM_VALUE);
  dimZControl = new FormControl(DEFAULT_DIM_VALUE);

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
    this.resetDimensions();

    if (isScroll) {
      setTimeout(() => {
        this.scrollTo?.nativeElement.scrollIntoView({behavior: 'smooth'});
      }, 100)
    }
  }

  getSubStyleClass(subStyle: SubStyle): string {
    if (this.currentSubStyle!== undefined && this.currentSubStyle.name === subStyle.name) {
      return 'selected';
    }

    return '';
  }

  resetDimensions() {
    this.dimXControl.setValue(DEFAULT_DIM_VALUE);
    this.dimYControl.setValue(DEFAULT_DIM_VALUE);
    this.dimZControl.setValue(DEFAULT_DIM_VALUE);
  }

  onNext() {
    console.log(this.dimXControl.value);
    console.log(this.dimYControl.value);
    console.log(this.dimZControl.value);
  }
}
