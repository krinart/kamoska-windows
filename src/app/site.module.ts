import { NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppMaterialModule } from "./shared/app-material.module";

import { SiteComponent } from "./site.component";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    SiteComponent,
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
