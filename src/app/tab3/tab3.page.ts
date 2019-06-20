import {Component, OnInit} from '@angular/core';
import {SelfHttpService} from '../service/HttpService';
import {JsonRoot} from '../data/JsonRoot';
import {System} from '../data/System';
import {Platform} from '@ionic/angular';
import {NativeHttpService} from '../service/NativeHttpService';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

    curParent: System;
    systems: System[];

    constructor(private nativeHttpService: NativeHttpService,
                private httpService: SelfHttpService,
                private plt: Platform) {
    }

    ngOnInit(): void {
        this.showSystem();
    }

    showSystem() {
        if (this.plt.is('mobile')) {
            this.nativeHttpService.getSystem().then((res) => {
                const result: JsonRoot<System[]> = JSON.parse(res.data);
                this.systems = result.data;
                if (this.systems.length > 0) {
                    this.curParent = this.systems[0];
                }
            });
        } else {
            this.httpService.getSystem().subscribe((res: JsonRoot<System[]>) => {
                console.log(res.data);
                this.systems = res.data;
                if (this.systems.length > 0) {
                    this.curParent = this.systems[0];
                }
            });
        }
    }

    onParentClicked(item: System) {
        this.curParent = item;
    }

}
