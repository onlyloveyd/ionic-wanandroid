import {Component, Input, OnInit} from '@angular/core';
import {NavBody} from '../../data/NavBody';

@Component({
    selector: 'app-nav-list',
    templateUrl: './nav-list.component.html',
    styleUrls: ['./nav-list.component.scss'],
})
export class NavListComponent implements OnInit {
    @Input() navList: NavBody[];

    colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

    constructor() {
    }

    ngOnInit() {
    }

    refreshData($event: CustomEvent<any>) {

    }

    randomColor(index): string {
        return this.colors[index % 9];
    }
}
