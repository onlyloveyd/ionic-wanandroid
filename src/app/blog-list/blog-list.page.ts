import {Component, OnInit} from '@angular/core';
import {System} from '../data/System';
import {ActivatedRoute} from '@angular/router';
import {SelfHttpService} from '../service/HttpService';

@Component({
    selector: 'app-blog-list',
    templateUrl: './blog-list.page.html',
    styleUrls: ['./blog-list.page.scss'],
})
export class BlogListPage implements OnInit {
    parent: System;
    header: System[];
    activeIndex = 0;

    constructor(private activeRouter: ActivatedRoute, private httpService: SelfHttpService) {
        this.parent = JSON.parse(this.activeRouter.snapshot.queryParams.parent);
        console.log('yidong -- parent = ' + this.parent);
        this.header = this.parent.children;
        console.log(this.header);
    }


    refreshData(event) {

    }

    loadMore(event) {

    }

    onTabClick(event) {

    }

    onChange(event) {
    }

    ngOnInit(): void {
    }

    getSystemBlog(pageNum: number, cid: number) {
        this.httpService.getSystemBlogs(pageNum, cid).subscribe((res) => {
            console.log(res);
        });
    }
}
