import {Component, OnInit} from '@angular/core';
import {SelfHttpService} from '../service/HttpService';
import {JsonRoot} from '../data/JsonRoot';
import {System} from '../data/System';
import {Platform} from '@ionic/angular';
import {NativeHttpService} from '../service/NativeHttpService';

@Component({
    selector: 'app-tab-system',
    templateUrl: 'system.page.html',
    styleUrls: ['system.page.scss']
})
export class SystemPage implements OnInit {

    curParent: System;
    systems: System[];

    colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

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

    randomColor(i: number) {
        return this.colors[i % 9];
    }
}
