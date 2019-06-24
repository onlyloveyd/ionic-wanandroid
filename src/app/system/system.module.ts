import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SystemPage} from './system.page';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from '../components/components.module';
import {IonicModule} from '@ionic/angular';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ComponentsModule,
        RouterModule.forChild([{path: '', component: SystemPage}])
    ],
    declarations: [SystemPage]
})
export class SystemPageModule {
}
