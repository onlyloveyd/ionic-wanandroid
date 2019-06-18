import {Component, OnInit} from '@angular/core';
import {SelfHttpService} from '../service/HttpService';
import {JsonRoot} from '../data/JsonRoot';
import {Banner} from '../data/Banner';

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

    constructor(private httpService: SelfHttpService) {
    }

    ngOnInit(): void {
        this.showBanner();
    }

    showBanner() {
        this.httpService.getBanner().subscribe((res: JsonRoot<Banner[]>) => {
            console.log(res);
            this.banners = res.data;
        });
    }
}
