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

    getSystemBlog(pageNum: number, cid: number) {
        return this.http.get('https://www.wanandroid.com/article/list/' + pageNum + '/json?cid=' + cid);
    }

    getNavList() {
        return this.http.get('https://www.wanandroid.com/navi/json');
    }

    getLatestProject(pageNum: number) {
        return this.http.get('https://wanandroid.com/article/listproject/' + pageNum + '/json');
    }
}
