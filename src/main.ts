import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { SiteModule } from './app/site.module';


platformBrowserDynamic().bootstrapModule(SiteModule)
  .catch(err => console.error(err));
