import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SelfHttpService} from '../service/HttpService';
import {Blog} from '../data/Blog';
import {JsonRoot} from '../data/JsonRoot';
import {BlogBody} from '../data/BlogBody';

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

    constructor(private activeRouter: ActivatedRoute, private httpService: SelfHttpService) {
        this.cid = this.activeRouter.snapshot.queryParams.cid;
        this.title = this.activeRouter.snapshot.queryParams.title;
        this.getBlog(this.pageNum, this.cid, null);
    }


    refreshData(event) {
        this.pageNum = 0;
        this.httpService.getSystemBlogs(this.pageNum, this.cid).subscribe((res: JsonRoot<BlogBody>) => {
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

    loadMore(event) {
        this.pageNum++;
        this.httpService.getSystemBlogs(this.pageNum, this.cid).subscribe((res: JsonRoot<BlogBody>) => {
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

    ngOnInit(): void {
    }

    getBlog(pageNum: number, cid: number, event) {
        this.httpService.getSystemBlogs(pageNum, cid).subscribe((res: JsonRoot<BlogBody>) => {
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
