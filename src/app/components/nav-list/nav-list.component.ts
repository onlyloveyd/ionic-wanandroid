import {Component, Input, OnInit} from '@angular/core';
import {NavBody} from '../../data/NavBody';
import {System} from '../../data/System';

@Component({
    selector: 'app-nav-list',
    templateUrl: './nav-list.component.html',
    styleUrls: ['./nav-list.component.scss'],
})
export class NavListComponent implements OnInit {
    @Input() navList: NavBody[];
    @Input() chatList: System[];

    colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

    constructor() {
    }

    ngOnInit() {
    }

    randomColor(index): string {
        return this.colors[index % 9];
    }
}
