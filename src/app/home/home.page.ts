import {Component, OnInit} from '@angular/core';
import {SelfHttpService} from '../service/HttpService';
import {JsonRoot} from '../data/JsonRoot';
import {Banner} from '../data/Banner';
import {Platform} from '@ionic/angular';
import {NativeHttpService} from '../service/NativeHttpService';
import {NavBody} from '../data/NavBody';
import {System} from '../data/System';

@Component({
    selector: 'app-tab-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        effect: 'cube',
        autoplay: true,
    };
    banners: Banner[];
    navList: NavBody[];
    chatList: System[];

    colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

    constructor(private httpService: SelfHttpService, public plt: Platform,
                private nativeHttpService: NativeHttpService) {
    }

    ngOnInit(): void {
        this.showBanner();
        this.showChatList();
        this.showNavList();
    }

    showBanner() {
        if (this.plt.is('mobile')) {
            this.nativeHttpService.getBanner().then((res) => {
                console.log(res.data);
                const result: JsonRoot<Banner[]> = JSON.parse(res.data);
                this.banners = result.data;
            });
        } else {
            this.httpService.getBanner().subscribe((res: JsonRoot<Banner[]>) => {
                console.log(res);
                this.banners = res.data;
            });
        }
    }

    showNavList() {
        if (this.plt.is('mobile')) {
            this.nativeHttpService.getNavList().then((res) => {
                console.log(res.data);
                const result: JsonRoot<NavBody[]> = JSON.parse(res.data);
                this.navList = result.data;
            });
        } else {
            this.httpService.getNavList().subscribe((res: JsonRoot<NavBody[]>) => {
                console.log(res);
                this.navList = res.data;
            });
        }
    }

    showChatList() {
        if (this.plt.is('mobile')) {
            this.nativeHttpService.getWeChatList().then((res) => {
                console.log(res.data);
                const result: JsonRoot<System[]> = JSON.parse(res.data);
                this.chatList = result.data;
            });
        } else {
            this.httpService.getWeChatList().subscribe((res: JsonRoot<System[]>) => {
                console.log(res);
                this.chatList = res.data;
            });
        }
    }


    randomColor(index): string {
        return this.colors[index % 9];
    }
}
