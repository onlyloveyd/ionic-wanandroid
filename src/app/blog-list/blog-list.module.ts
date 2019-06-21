import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BlogListPage} from './blog-list.page';
import {BlogItemComponent} from '../components/blog-item/blog-item.component';
import {AppModule} from '../app.module';

const routes: Routes = [
    {
        path: '',
        component: BlogListPage
    }
];

@NgModule({
    imports: [
        AppModule,
        RouterModule.forChild(routes),
    ],
    declarations: [BlogListPage, BlogItemComponent]
})
export class BlogListPageModule {
}
