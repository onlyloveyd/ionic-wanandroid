import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SelfHttpService {
    constructor(private http: HttpClient) {
    }

    getBanner() {
        return this.http.get('https://www.wanandroid.com/banner/json');
    }

    getSystem() {
        return this.http.get('https://www.wanandroid.com/tree/json');
    }
}
