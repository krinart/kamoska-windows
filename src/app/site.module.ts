import { NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppMaterialModule } from "./shared/app-material.module";
import { I18nPluralPipe } from '@angular/common';

import { SiteComponent } from "./site.component";
import { AppRoutingModule } from './app-routing.module';
import { WindowItemComponent } from "./components/window-item/window-item.component";
import { QuoteComponent } from './components/quote/quote.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    SiteComponent,
    WindowItemComponent,
    QuoteComponent,
    HomeComponent,
  ],
  imports: [
    AppMaterialModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
  ],
  providers: [
    I18nPluralPipe,
  ],
  bootstrap: [SiteComponent]
})
export class SiteModule { }
