import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SystemPage} from './system.page';

const routes: Routes = [
  {
    path: '',
    component: SystemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemPageRoutingModule {
}
