import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {WindowItemComponent} from "./components/window-item/window-item.component";

const routes: Routes = [
  // { path: '', component: AppComponent},
  { path: '', redirectTo: '/quote/new', pathMatch: 'full' },

  { path: 'quote/:quoteID/item/:itemID', component: WindowItemComponent },
  { path: 'quote/new', component: WindowItemComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
