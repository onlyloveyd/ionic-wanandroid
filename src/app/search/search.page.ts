import {Component, OnInit} from '@angular/core';
import {HotKey} from '../data/HotKey';
import {BasePage} from '../BasePage';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {SelfHttpService} from '../service/HttpService';
import {NativeHttpService} from '../service/NativeHttpService';
import {environment} from '../../environments/environment';
import {JsonRoot} from '../data/JsonRoot';
import {Storage} from '@ionic/storage';
import {Queue} from './Queue';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage extends BasePage implements OnInit {
    historyLimit = 8;

    hotKeys: HotKey[];
    history: Queue<string> = new Queue();
    colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];
    keyWord: any;

    constructor(private loading: LoadingController,
                private toast: ToastController,
                private httpService: SelfHttpService,
                private nativeHttpService: NativeHttpService,
                private storage: Storage,
                private navCtrl: NavController) {
        super(loading, toast);
    }

    ngOnInit() {
        this.getHotKey();
        this.getHistory();
    }

    randomColor(index): string {
        return this.colors[index % 9];
    }

    getHotKey() {
        if (environment.isMobile) {
            this.nativeHttpService.getHotKey().then(res => {
                const result: JsonRoot<HotKey[]> = JSON.parse(res.data);
                this.hotKeys = result.data;
            });
        } else {
            this.httpService.getHotKey().subscribe((res: JsonRoot<HotKey[]>) => {
                this.hotKeys = res.data;
            });
        }

    }

    clearHistory() {
        this.history.clear();
        this.storage.set('history', this.history.getItems()).then();
    }

    doSearch() {
        if (this.keyWord !== '') {
            console.log(this.history);
            if (this.history.size() === this.historyLimit) {
                this.history.dequeue();
            }
            this.history.enqueue(this.keyWord);
            this.addHistory();
        }
        this.navCtrl.navigateForward('/blog-list', {
            queryParams: {
                isSearch: true,
                keyWord: this.keyWord,
                title: this.keyWord + '搜索结果'
            }
        }).then();

    }

    addHistory() {
        this.storage.set('history', this.history.getItems()).then();
    }

    getHistory() {
        this.storage.get('history').then(res => {
            if (history != null && history instanceof Array) {
                this.history.setItems(res);
            }
        });
    }

    search() {

    }

}
