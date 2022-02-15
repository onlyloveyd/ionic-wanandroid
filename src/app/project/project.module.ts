import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ProjectPage} from './project.page';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from '../components/components.module';
import {IonicModule} from '@ionic/angular';

const routes: Routes = [
    {
        path: '',
        component: ProjectPage
    }
];

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ComponentsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ProjectPage]
})
export class ProjectPageModule {
}
