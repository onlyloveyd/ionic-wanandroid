import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ProjectPage} from './project.page';
import {BlogItemComponent} from '../components/blog-item/blog-item.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ProjectPage, BlogItemComponent]
})
export class ProjectPageModule {
}
