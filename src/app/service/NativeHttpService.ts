import {Injectable} from '@angular/core';
import {HTTP} from '@ionic-native/http/ngx';

@Injectable({
    providedIn: 'root'
})
export class NativeHttpService {
    constructor(private http: HTTP) {
    }

    getBanner() {
        return this.http.get('https://www.wanandroid.com/banner/json', {}, {});
    }

    getSystem() {
        return this.http.get('https://www.wanandroid.com/tree/json', {}, {});
    }

    getSystemBlog(pageNum: number, cid: number) {
        return this.http.get('https://www.wanandroid.com/article/list/' + pageNum + '/json?cid=' + cid, {}, {});
    }
}
