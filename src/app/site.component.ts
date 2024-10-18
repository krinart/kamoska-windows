import { Component } from '@angular/core';
import { Router } from "@angular/router";
// import { environment } from "../environments/environment";


@Component({
  selector: 'site-root',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.less']
})
export class SiteComponent {

  constructor(private router: Router,) {}

  ngOnInit() {
    // console.log(`App version: ${environment.appVersion}`);

    // if (localStorage.getItem(JWT_TOKEN_KEY) == null) {
    //   console.log('SiteComponent.ngOnInit - redirect');
    //   this.router.navigate(['/login']);
    // }
  }
}
