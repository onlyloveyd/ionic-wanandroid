import {Component, OnInit} from '@angular/core';
import {SelfHttpService} from '../service/HttpService';
import {JsonRoot} from '../data/JsonRoot';
import {System} from '../data/System';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

    activeIndex = 0;
    systems: System[];

    constructor(private httpService: SelfHttpService) {
    }

    ngOnInit(): void {
        this.showSystem();
    }


    showSystem() {
        this.httpService.getSystem().subscribe((res: JsonRoot<System>) => {
            console.log(res.data);
            this.systems = res.data;
        });
    }
}
