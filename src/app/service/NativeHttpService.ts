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

    getNavList() {
        return this.http.get('https://www.wanandroid.com/navi/json', {}, {});
    }

    getLatestProject(pageNum: number) {
        return this.http.get('https://wanandroid.com/article/listproject/' + pageNum + '/json', {}, {});
    }

    getWeChatList() {
        return this.http.get('https://wanandroid.com/wxarticle/chapters/json', {}, {});
    }

    getWeChatBlogList(cid, pageNum) {
        return this.http.get('https://wanandroid.com/wxarticle/list/' + cid + '/' + pageNum + '/json', {}, {});
    }

    login(username, password) {
        const body = {
            username,
            password,
        };
        return this.http.post('https://www.wanandroid.com/user/login', body, null);
    }
}
