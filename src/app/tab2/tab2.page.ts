import {Component, OnInit} from '@angular/core';
import {SelfHttpService} from '../service/HttpService';
import {JsonRoot} from '../data/JsonRoot';
import {Banner} from '../data/Banner';
import {Platform} from '@ionic/angular';
import {NativeHttpService} from '../service/NativeHttpService';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        effect: 'cube',
        autoplay: true,
    };
    banners: Banner[];

    constructor(private httpService: SelfHttpService, public plt: Platform,
                private nativeHttpService: NativeHttpService) {
    }

    ngOnInit(): void {
        this.showBanner();
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
}
