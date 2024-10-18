import { NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppMaterialModule } from "./shared/app-material.module";

import { SiteComponent } from "./site.component";
import { AppRoutingModule } from './app-routing.module';
import { WindowItemComponent } from "./components/window-item/window-item.component";
import { QuoteComponent } from './components/quote/quote.component';

@NgModule({
  declarations: [
    SiteComponent,
    WindowItemComponent,
    QuoteComponent,
  ],
  imports: [
    AppMaterialModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
  ],
  providers: [],
  bootstrap: [SiteComponent]
})
export class SiteModule { }
