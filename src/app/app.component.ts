import {Component, ElementRef, ViewChild} from '@angular/core';
import {Styles} from "./shared/styles";
import {Style, SubStyle} from "./shared/types";
// import {setTimeout} from "timers";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  styles = Styles;
  currentStyle?: Style;
  currentSubStyle?: SubStyle;

  @ViewChild('scrollTo')
  scrollTo?: ElementRef;

  styleClick(style: Style) {
    this.currentStyle = style;
    this.currentSubStyle = undefined;
  }

  getStyleClass(style: Style): string {
    if (this.currentStyle !== undefined && this.currentStyle.name === style.name) {
      return 'selected';
    }

    return '';
  }

  getSubStyleClass(subStyle: SubStyle): string {
    if (this.currentSubStyle!== undefined && this.currentSubStyle.name === subStyle.name) {
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
  }
}
