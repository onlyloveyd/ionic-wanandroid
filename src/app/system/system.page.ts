import {Component, OnInit} from '@angular/core';
import {SelfHttpService} from '../service/HttpService';
import {JsonRoot} from '../data/JsonRoot';
import {System} from '../data/System';
import {LoadingController, Platform, ToastController} from '@ionic/angular';
import {NativeHttpService} from '../service/NativeHttpService';
import {environment} from '../../environments/environment';
import {BasePage} from '../baseui';

@Component({
    selector: 'app-tab-system',
    templateUrl: 'system.page.html',
    styleUrls: ['system.page.scss']
})
export class SystemPage extends BasePage implements OnInit {

    curParent: System;
    systems: System[];

    colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

    constructor(private nativeHttpService: NativeHttpService,
                private httpService: SelfHttpService,
                private loading: LoadingController,
                private toast: ToastController) {
        super(loading, toast);
    }

    ngOnInit(): void {
        this.showSystem();
    }

    showSystem() {
        this.showLoading().then();
        if (environment.isMobile) {
            this.nativeHttpService.getSystem().then((res) => {
                const result: JsonRoot<System[]> = JSON.parse(res.data);
                this.systems = result.data;
                if (this.systems.length > 0) {
                    this.curParent = this.systems[0];
                }
                this.dismissLoading();
            }).catch(res => {
                this.dismissLoading();
                console.log(res);
                this.showToast(res.toString()).then();
            });
        } else {
            this.httpService.getSystem().subscribe((res: JsonRoot<System[]>) => {
                console.log(res.data);
                this.systems = res.data;
                if (this.systems.length > 0) {
                    this.curParent = this.systems[0];
                }
                this.dismissLoading();
            }, (res) => {
                this.dismissLoading();
                console.log(res);
                this.showToast(res.toString()).then();
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
