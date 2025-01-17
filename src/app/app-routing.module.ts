import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WindowItemComponent} from "./components/window-item/window-item.component";
import {QuoteComponent} from "./components/quote/quote.component";
import {HomeComponent} from "./components/home/home.component";

const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'quote/new', component: WindowItemComponent },
  { path: 'quote/:quoteID/new', component: WindowItemComponent },
  { path: 'quote/:quoteID/item/:itemID', component: WindowItemComponent },

  { path: 'quote/:quoteID', component: QuoteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
