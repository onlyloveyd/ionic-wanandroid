import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {HomePage} from './home.page';
import {AppModule} from '../app.module';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        AppModule,
        CommonModule,
        RouterModule.forChild([{path: '', component: HomePage}])
    ],
    declarations: [HomePage],
})
export class HomePageModule {
}
