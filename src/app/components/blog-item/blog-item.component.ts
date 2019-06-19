import {Component, Input, OnInit} from '@angular/core';
import {Blog} from '../../data/Blog';

@Component({
    selector: 'app-blog-item',
    templateUrl: './blog-item.component.html',
    styleUrls: ['./blog-item.component.scss'],
})
export class BlogItemComponent implements OnInit {
    @Input() blog: Blog;

    constructor() {
    }

    ngOnInit() {
    }

}
