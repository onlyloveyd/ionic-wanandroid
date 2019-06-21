import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SystemPage} from './system.page';
import {AppModule} from '../app.module';

@NgModule({
    imports: [
        AppModule,
        RouterModule.forChild([{path: '', component: SystemPage}])
    ],
    declarations: [SystemPage]
})
export class SystemPageModule {
}
