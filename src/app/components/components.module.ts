import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {BlogItemComponent} from './blog-item/blog-item.component';
import {NavListComponent} from './nav-list/nav-list.component';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        BlogItemComponent,
        NavListComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule,
    ],
    providers: [],
    entryComponents: [],
    exports: [
        BlogItemComponent,
        NavListComponent
    ]
})
export class ComponentsModule {
}
