import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SelfHttpService} from '../service/HttpService';
import {Blog} from '../data/Blog';
import {JsonRoot} from '../data/JsonRoot';
import {BlogBody} from '../data/BlogBody';
import {NativeHttpService} from '../service/NativeHttpService';
import {environment} from '../../environments/environment';
import {HTTPResponse} from '@ionic-native/http/ngx';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-blog-list',
    templateUrl: './blog-list.page.html',
    styleUrls: ['./blog-list.page.scss'],
})
export class BlogListPage implements OnInit {
    cid: number;
    title: string;
    blog: Blog[];

    pageNum = 0;
    pageTotal: number;
    isEnd = false;

    isSearch = false;
    keyWord = '';

    constructor(private activeRouter: ActivatedRoute,
                private nativeHttpService: NativeHttpService,
                private httpService: SelfHttpService) {
        this.cid = this.activeRouter.snapshot.queryParams.cid;
        this.title = this.activeRouter.snapshot.queryParams.title;
        this.isSearch = this.activeRouter.snapshot.queryParams.isSearch;
        this.keyWord = this.activeRouter.snapshot.queryParams.keyWord;
        this.refreshData(null);
    }


    refreshData(event) {
        this.pageNum = 0;
        if (environment.isMobile) {
            let request: Promise<HTTPResponse>;
            if (this.isSearch) {
                request = this.nativeHttpService.getSearchList(this.keyWord, this.pageNum);
            } else {
                request = this.nativeHttpService.getSystemBlog(this.pageNum, this.cid);
            }
            request.then((res) => {
                const result: JsonRoot<BlogBody> = JSON.parse(res.data);
                if (event != null) {
                    event.target.complete();
                }
                if (result.errorCode === 0) {
                    this.pageTotal = result.data.pageCount;
                    this.isEnd = this.pageNum + 1 === this.pageTotal;
                    this.blog = result.data.datas;
                }
            });
        } else {
            // tslint:disable-next-line:ban-types
            let request: Observable<Object>;
            if (this.isSearch) {
                request = this.httpService.getSearchList(this.keyWord, this.pageNum);
            } else {
                request = this.httpService.getSystemBlog(this.pageNum, this.cid);
            }
            request.subscribe((res: JsonRoot<BlogBody>) => {
                if (event != null) {
                    event.target.complete();
                }
                if (res.errorCode === 0) {
                    this.pageTotal = res.data.pageCount;
                    this.isEnd = this.pageNum + 1 === this.pageTotal;
                    this.blog = res.data.datas;
                }
            });
        }
    }

    loadMore(event) {
        this.pageNum++;
        if (environment.isMobile) {
            let request: Promise<HTTPResponse>;
            if (this.isSearch) {
                request = this.nativeHttpService.getSearchList(this.keyWord, this.pageNum);
            } else {
                request = this.nativeHttpService.getSystemBlog(this.pageNum, this.cid);
            }
            request.then((res) => {
                const result: JsonRoot<BlogBody> = JSON.parse(res.data);
                if (event != null) {
                    event.target.complete();
                }
                if (result.errorCode === 0) {
                    this.pageTotal = result.data.pageCount;
                    this.isEnd = this.pageNum + 1 === this.pageTotal;
                    this.blog = this.blog.concat(result.data.datas);
                }
            });
        } else {
            // tslint:disable-next-line:ban-types
            let request: Observable<Object>;
            if (this.isSearch) {
                request = this.httpService.getSearchList(this.keyWord, this.pageNum);
            } else {
                request = this.httpService.getSystemBlog(this.pageNum, this.cid);
            }
            request.subscribe((res: JsonRoot<BlogBody>) => {
                if (event != null) {
                    event.target.complete();
                }
                if (res.errorCode === 0) {
                    this.pageTotal = res.data.pageCount;
                    this.isEnd = this.pageNum + 1 === this.pageTotal;
                    this.blog = this.blog.concat(res.data.datas);
                }
            });
        }
    }

    ngOnInit(): void {
    }

}
