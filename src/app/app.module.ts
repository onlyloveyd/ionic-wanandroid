import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdMobileModule} from 'ng-zorro-antd-mobile';
import {SelfHttpService} from './service/HttpService';
import {NativeHttpService} from './service/NativeHttpService';
import {HTTP} from '@ionic-native/http/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    exports: [
        IonicModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        NgZorroAntdMobileModule,
    ],
    imports: [
        IonicModule,
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        NgZorroAntdMobileModule],
    providers: [
        SelfHttpService,
        NativeHttpService,
        HTTP,
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
