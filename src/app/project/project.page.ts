import {Component, OnInit} from '@angular/core';
import {Blog} from '../data/Blog';
import {JsonRoot} from '../data/JsonRoot';
import {BlogBody} from '../data/BlogBody';
import {ActivatedRoute} from '@angular/router';
import {NativeHttpService} from '../service/NativeHttpService';
import {SelfHttpService} from '../service/HttpService';
import {LoadingController, ToastController} from '@ionic/angular';
import {environment} from '../../environments/environment';
import {BasePage} from '../baseui';

@Component({
    selector: 'app-project',
    templateUrl: './project.page.html',
    styleUrls: ['./project.page.scss'],
})
export class ProjectPage extends BasePage implements OnInit {
    isEnd = false;
    blog: Blog[];

    pageNum = 0;
    pageTotal: number;

    constructor(private activeRouter: ActivatedRoute,
                private nativeHttpService: NativeHttpService,
                private httpService: SelfHttpService,
                private loading: LoadingController,
                private toast: ToastController
    ) {
        super(loading, toast);
    }

    ngOnInit() {
        this.getBlog(this.pageNum, null);
    }

    refreshData(event) {
        this.pageNum = 0;
        if (environment.isMobile) {
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
                this.dismissLoading();
            }).catch(res => {
                this.dismissLoading();
                console.log(res);
                this.showToast(res.toString()).then();
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
                this.dismissLoading();
            }, (res) => {
                this.dismissLoading();
                console.log(res);
                this.showToast(res.toString()).then();
            });

        }
    }

    loadMore(event) {
        this.pageNum++;
        if (environment.isMobile) {
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
                this.dismissLoading();
            }).catch(res => {
                this.dismissLoading();
                console.log(res);
                this.showToast(res.toString()).then();
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
                this.dismissLoading();
            }, (res) => {
                this.dismissLoading();
                console.log(res);
                this.showToast(res.toString()).then();
            });

        }
    }

    getBlog(pageNum: number, event) {
        this.showLoading().then();
        if (environment.isMobile) {
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
                this.dismissLoading();
            }).catch(res => {
                this.dismissLoading();
                console.log(res);
                this.showToast(res.toString()).then();
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
                this.dismissLoading();
            }, (res) => {
                this.dismissLoading();
                console.log(res);
                this.showToast(res.toString()).then();
            });
        }
    }
}
