import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SelfHttpService} from '../service/HttpService';
import {Blog} from '../data/Blog';
import {JsonRoot} from '../data/JsonRoot';
import {BlogBody} from '../data/BlogBody';
import {NativeHttpService} from '../service/NativeHttpService';
import {Platform} from '@ionic/angular';

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

    constructor(private activeRouter: ActivatedRoute,
                private nativeHttpService: NativeHttpService,
                private httpService: SelfHttpService,
                private plt: Platform) {
        this.cid = this.activeRouter.snapshot.queryParams.cid;
        this.title = this.activeRouter.snapshot.queryParams.title;
        this.getBlog(this.pageNum, this.cid, null);
    }


    refreshData(event) {
        this.pageNum = 0;
        if (this.plt.is('mobile')) {
            this.nativeHttpService.getSystemBlog(this.pageNum, this.cid).then((res) => {
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
            this.httpService.getSystemBlog(this.pageNum, this.cid).subscribe((res: JsonRoot<BlogBody>) => {
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
        if (this.plt.is('mobile')) {
            this.nativeHttpService.getSystemBlog(this.pageNum, this.cid).then((res) => {
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
            this.httpService.getSystemBlog(this.pageNum, this.cid).subscribe((res: JsonRoot<BlogBody>) => {
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

    getBlog(pageNum: number, cid: number, event) {
        if (this.plt.is('mobile')) {
            this.nativeHttpService.getSystemBlog(this.pageNum, this.cid).then((res) => {
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
            this.httpService.getSystemBlog(pageNum, cid).subscribe((res: JsonRoot<BlogBody>) => {
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
}
