import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BlogListPage} from './blog-list.page';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from '../components/components.module';
import {IonicModule} from '@ionic/angular';

const routes: Routes = [
    {
        path: '',
        component: BlogListPage
    }
];

@NgModule({
    imports: [
        IonicModule,
        ComponentsModule,
        CommonModule,
        RouterModule.forChild(routes),
    ],
    declarations: [BlogListPage]
})
export class BlogListPageModule {
}
