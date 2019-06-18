import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogListPage } from './blog-list.page';

describe('BlogListPage', () => {
  let component: BlogListPage;
  let fixture: ComponentFixture<BlogListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
