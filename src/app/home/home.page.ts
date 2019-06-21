import {Component, OnInit} from '@angular/core';
import {SelfHttpService} from '../service/HttpService';
import {JsonRoot} from '../data/JsonRoot';
import {Banner} from '../data/Banner';
import {Platform} from '@ionic/angular';
import {NativeHttpService} from '../service/NativeHttpService';
import {NavBody} from '../data/NavBody';

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

    constructor(private httpService: SelfHttpService, public plt: Platform,
                private nativeHttpService: NativeHttpService) {
    }

    ngOnInit(): void {
        this.showBanner();
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
}
