import {Component} from '@angular/core';

import {NavController, Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Subscription} from 'rxjs';
import {AppMinimize} from '@ionic-native/app-minimize/ngx';
import {NavigationEnd, Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    backButtonPressed = false;
    customBackActionSubscription: Subscription;
    url;
    toast;

    constructor(
        private router: Router,
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private navCtrl: NavController,
        private toastCtrl: ToastController,
        private appMinimize: AppMinimize,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.registerBackButtonAction();
        });
        this.initRouterListen();
    }


    initRouterListen() {
        this.router.events.subscribe(event => { // 需要放到最后一个执行
            if (event instanceof NavigationEnd) {
                this.url = event.url;
            }
        });
    }

    registerBackButtonAction() {
        this.customBackActionSubscription = this.platform.backButton.subscribe(() => {
            if (this.url === '/tabs/home') {
                if (this.backButtonPressed) {
                    this.appMinimize.minimize().then();
                    this.backButtonPressed = false;
                } else {
                    this.presentToast('再按一次退出').then();
                    this.backButtonPressed = true;
                    setTimeout(() => this.backButtonPressed = false, 2000);
                }
            } else {
                this.navCtrl.back();
            }
        });
    }

    async presentToast(tipMessage: string = '') {
        this.toast = await this.toastCtrl.create({
            message: tipMessage,
            duration: 1000,
            position: 'bottom'
        });
        this.toast.present();
    }
}
