import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ProjectPage} from './project.page';
import {BlogItemComponent} from '../components/blog-item/blog-item.component';
import {AppModule} from '../app.module';

const routes: Routes = [
    {
        path: '',
        component: ProjectPage
    }
];

@NgModule({
    imports: [
        AppModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ProjectPage, BlogItemComponent]
})
export class ProjectPageModule {
}
