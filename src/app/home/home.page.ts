import {Component, OnInit} from '@angular/core';
import {SelfHttpService} from '../service/HttpService';
import {JsonRoot} from '../data/JsonRoot';
import {Banner} from '../data/Banner';
import {LoadingController, ToastController} from '@ionic/angular';
import {NativeHttpService} from '../service/NativeHttpService';
import {NavBody} from '../data/NavBody';
import {System} from '../data/System';
import {environment} from '../../environments/environment';
import {BasePage} from '../BasePage';

@Component({
    selector: 'app-tab-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage extends BasePage implements OnInit {
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        effect: 'cube',
        autoplay: true,
    };
    banners: Banner[];
    navList: NavBody[];
    chatList: System[];
    requestCount = 3;

    colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

    constructor(private httpService: SelfHttpService,
                private nativeHttpService: NativeHttpService,
                private loading: LoadingController,
                private toast: ToastController) {
        super(loading, toast);
    }

    ngOnInit(): void {
        this.showLoading().then();
        this.showBanner();
        this.showChatList();
        this.showNavList();
    }

    showBanner() {
        if (environment.isMobile) {
            this.nativeHttpService.getBanner().then((res) => {
                console.log(res.data);
                const result: JsonRoot<Banner[]> = JSON.parse(res.data);
                this.banners = result.data;
                this.requestCount--;
                if (this.requestCount === 0) {
                    this.dismissLoading();
                }
            }).catch(res => {
                console.log(res);
                this.showToast(res.toString()).then();
            });
        } else {
            this.httpService.getBanner().subscribe((res: JsonRoot<Banner[]>) => {
                console.log(res);
                this.banners = res.data;
                this.requestCount--;
                if (this.requestCount === 0) {
                    this.dismissLoading();
                }
            }, (res) => {
                console.log(res);
                this.showToast(res.toString()).then();
            });
        }

    }

    showNavList() {
        if (environment.isMobile) {
            this.nativeHttpService.getNavList().then((res) => {
                console.log(res.data);
                const result: JsonRoot<NavBody[]> = JSON.parse(res.data);
                this.navList = result.data;
                this.requestCount--;
                if (this.requestCount === 0) {
                    this.dismissLoading();
                }
            }).catch(res => {
                console.log(res);
                this.showToast(res.toString()).then();
            });
        } else {
            this.httpService.getNavList().subscribe((res: JsonRoot<NavBody[]>) => {
                console.log(res);
                this.navList = res.data;
                this.requestCount--;
                if (this.requestCount === 0) {
                    this.dismissLoading();
                }
            }, (res) => {
                console.log(res);
                this.showToast(res.toString()).then();
            });
        }

    }

    showChatList() {
        if (environment.isMobile) {
            this.nativeHttpService.getWeChatList().then((res) => {
                console.log(res.data);
                const result: JsonRoot<System[]> = JSON.parse(res.data);
                this.chatList = result.data;
                this.requestCount--;
                if (this.requestCount === 0) {
                    this.dismissLoading();
                }
            }).catch(res => {
                console.log(res);
                this.showToast(res.toString()).then();
            });
        } else {
            this.httpService.getWeChatList().subscribe((res: JsonRoot<System[]>) => {
                console.log(res);
                this.chatList = res.data;
                this.requestCount--;
                if (this.requestCount === 0) {
                    this.dismissLoading();
                }
            }, (res) => {
                console.log(res);
                this.showToast(res.toString()).then();
            });
        }
    }
}

