import {Component, Input, OnInit} from '@angular/core';
import {Blog} from '../../data/Blog';

declare let window: any;

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

  openBlog(link: string) {
    window.open(link, '_system', 'location=yes');
  }
}
