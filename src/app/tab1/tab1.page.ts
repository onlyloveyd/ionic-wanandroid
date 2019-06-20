import {Component, OnInit} from '@angular/core';
import {HTTP} from '@ionic-native/http/ngx';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

    constructor(private http: HTTP) {

    }

    ngOnInit(): void {
        console.log('start');
        this.http.get('https://www.wanandroid.com/banner/json', {}, {})
            .then(data => {
                console.log('yidong');
                console.log(data);

            })
            .catch(error => {
                console.log(error);
            });
    }

}
