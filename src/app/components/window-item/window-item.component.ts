import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Styles} from "../../shared/styles";
import {Color, DimensionValue, Style, SubStyle} from "../../shared/types";
import {ActivatedRoute, Router} from "@angular/router";
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

  dimXFractionControl = new FormControl("0");
  dimYFractionControl = new FormControl("0");
  dimZFractionControl = new FormControl("0");

  glassType = new FormControl("");
  glassOA = new FormControl("");
  glassThickness = new FormControl("");
  glassSpaceColor = new FormControl("");
  frameType = new FormControl("");
  gridType = new FormControl("");
  gridSize = new FormControl("");

  @ViewChild('scrollTo')
  scrollTo?: ElementRef;

  quoteID: number = 0;
  itemID: number = 0;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private repoService: RepositoryService) {}

  ngOnInit(): void {
    const quoteID = this.route.snapshot.paramMap.get('quoteID');
    const itemID = this.route.snapshot.paramMap.get('itemID');

    this.quoteID = Number(quoteID);
    this.itemID = Number(itemID);

    console.log('quoteID', this.quoteID);
    console.log('itemID', this.itemID);

    console.log('quotes', this.repoService.getQuotes());

    if (this.itemID !== 0) {
      const quote = this.repoService.getQuote(this.quoteID);

      if (quote === undefined) {
        console.log('Quote not found');
        this.router.navigate(['/']);
        return;
      }

      const filteredItems = quote.items.filter(item => item.id === this.itemID);
      console.log(filteredItems);
      if (filteredItems.length !== 1) {
        console.log('Item not found');
        // this.router.navigate(['/']);
        return;
      }

      const item = filteredItems[0];

      this.currentStyle = item.style;
      this.currentSubStyle = item.subStyle;

      this.dimXControl.setValue(String(item.dimensions[0].base));
      this.dimXFractionControl.setValue(String(item.dimensions[0].fraction));
      this.dimYControl.setValue(String(item.dimensions[1].base));
      this.dimYFractionControl.setValue(String(item.dimensions[1].fraction));

      if (item.dimensions.length == 3) {
        this.dimZControl.setValue(String(item.dimensions[2].base));
        this.dimZFractionControl.setValue(String(item.dimensions[2].fraction));
      }

      console.log(item.glassType);
      this.glassType.setValue(item.glassType);
      this.glassOA.setValue(item.glassOA);
      this.glassThickness.setValue(item.glassThickness);
      this.glassSpaceColor.setValue(item.glassSpaceColor);
      this.frameType.setValue(item.frameType);
      this.gridType.setValue(item.gridType);
      this.gridSize.setValue(item.gridSize);
    }
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
    if (this.currentSubStyle !== undefined && this.currentSubStyle.name === subStyle.name) {
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

  frameClick(value: string) {
    this.frameType.setValue(value);
  }

  getFrameClass(value: string) {
    if (this.frameType.getRawValue() === value) {
      return 'selected';
    }

    return '';
  }

  gridClick(value: string) {
    this.gridType.setValue(value);
  }

  getGridClass(value: string) {
    if (this.gridType.getRawValue() === value) {
      return 'selected';
    }

    return '';
  }

  onNext() {
    console.log(this.glassType.getRawValue());
    console.log(this.glassOA.getRawValue());
    console.log(this.glassThickness.getRawValue());
    console.log(this.glassSpaceColor.getRawValue());
    console.log(this.frameType.getRawValue());
    console.log(this.gridType.getRawValue());
    console.log(this.gridSize.getRawValue());

    const isFormValid = this.dimXControl.valid && this.dimYControl.valid && this.dimZControl.valid;

    if (!isFormValid) {
      this.dimXControl.markAsTouched();
      this.dimYControl.markAsTouched();
      this.dimZControl.markAsTouched();
      return;
    }

    const dimensions: DimensionValue[] = [
      {
        base: this.dimXControl.value!,
        fraction: this.dimXFractionControl.value!,
      },
      {
        base: this.dimYControl.value!,
        fraction: this.dimYFractionControl.value!,
      },
    ];

    if (this.currentSubStyle!.extraDimension !== undefined) {
      dimensions.push({
        base: this.dimZControl.value!,
        fraction: this.dimZFractionControl.value!,
      });
    }

    // Create new quote
    if (this.quoteID === 0) {
      const quote = this.repoService.createQuote(
        this.currentStyle!,
        this.currentSubStyle!,
        dimensions,
        Color.White,
        1,
        this.glassType.getRawValue()!,
        this.glassOA.getRawValue()!,
        this.glassThickness.getRawValue()!,
        this.glassSpaceColor.getRawValue()!,
        this.frameType.getRawValue()!,
        this.gridType.getRawValue()!,
        this.gridSize.getRawValue()!,
      );

      this.router.navigate(['/quote', quote.id]);

      return;
    }

    // Create new item in existing quote
    if (this.itemID === 0) {
      this.repoService.addItemToQuote(
        this.quoteID,
        this.currentStyle!,
        this.currentSubStyle!,
        dimensions,
        Color.White,
        1,
        this.glassType.getRawValue()!,
        this.glassOA.getRawValue()!,
        this.glassThickness.getRawValue()!,
        this.glassSpaceColor.getRawValue()!,
        this.frameType.getRawValue()!,
        this.gridType.getRawValue()!,
        this.gridSize.getRawValue()!,
      );
      this.router.navigate(['/quote', this.quoteID]);
      return;
    }

    this.repoService.updateItemRaw(
      this.quoteID,
      this.itemID,
      this.currentStyle!,
      this.currentSubStyle!,
      dimensions,
      Color.White,
      1,
      this.glassType.getRawValue()!,
      this.glassOA.getRawValue()!,
      this.glassThickness.getRawValue()!,
      this.glassSpaceColor.getRawValue()!,
      this.frameType.getRawValue()!,
      this.gridType.getRawValue()!,
      this.gridSize.getRawValue()!,
    )
    this.router.navigate(['/quote', this.quoteID]);

  }

  isRequiredError(formControl: FormControl) {
    return formControl!.invalid && (formControl!.dirty || formControl!.touched) && formControl?.hasError('required');
  }
}
