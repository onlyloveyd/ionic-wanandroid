import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SearchPage} from './search.page';
import {NgZorroAntdMobileModule, SearchBarModule} from 'ng-zorro-antd-mobile';

const routes: Routes = [
  {
    path: '',
    component: SearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SearchBarModule,
    NgZorroAntdMobileModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {
}
