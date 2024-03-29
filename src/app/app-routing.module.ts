import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', loadChildren: './tabs/tabs.module#TabsPageModule'},
    {path: 'blog-list', loadChildren: './blog-list/blog-list.module#BlogListPageModule'},
    {path: 'login', loadChildren: './login/login.module#LoginPageModule'},
    {path: 'search', loadChildren: './search/search.module#SearchPageModule'},
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
