import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {HomePage} from './home.page';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from '../components/components.module';
import {IonicModule} from '@ionic/angular';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ComponentsModule,
        RouterModule.forChild([{path: '', component: HomePage}])
    ],
    declarations: [HomePage],
})
export class HomePageModule {
}
