import {Component, OnInit} from '@angular/core';
import {Blog} from '../data/Blog';
import {JsonRoot} from '../data/JsonRoot';
import {BlogBody} from '../data/BlogBody';
import {ActivatedRoute} from '@angular/router';
import {NativeHttpService} from '../service/NativeHttpService';
import {SelfHttpService} from '../service/HttpService';
import {Platform} from '@ionic/angular';

@Component({
    selector: 'app-project',
    templateUrl: './project.page.html',
    styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
    isEnd = false;
    blog: Blog[];

    pageNum = 0;
    pageTotal: number;

    constructor(private activeRouter: ActivatedRoute,
                private nativeHttpService: NativeHttpService,
                private httpService: SelfHttpService,
                private plt: Platform) {
        this.getBlog(this.pageNum, null);
    }

    ngOnInit() {
    }

    refreshData(event) {
        this.pageNum = 0;
        if (this.plt.is('mobile')) {
            this.nativeHttpService.getLatestProject(this.pageNum).then((res) => {
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
            this.httpService.getLatestProject(this.pageNum).subscribe((res: JsonRoot<BlogBody>) => {
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
            this.nativeHttpService.getLatestProject(this.pageNum).then((res) => {
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
            this.httpService.getLatestProject(this.pageNum).subscribe((res: JsonRoot<BlogBody>) => {
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

    getBlog(pageNum: number, event) {
        if (this.plt.is('mobile')) {
            this.nativeHttpService.getLatestProject(this.pageNum).then((res) => {
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
            this.httpService.getLatestProject(pageNum).subscribe((res: JsonRoot<BlogBody>) => {
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
