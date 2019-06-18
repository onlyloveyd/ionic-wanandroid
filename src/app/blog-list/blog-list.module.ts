import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {BlogListPage} from './blog-list.page';
import {NgZorroAntdMobileModule} from 'ng-zorro-antd-mobile';

const routes: Routes = [
    {
        path: '',
        component: BlogListPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        NgZorroAntdMobileModule,
    ],
    declarations: [BlogListPage]
})
export class BlogListPageModule {
}
