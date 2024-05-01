import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogEditorComponent } from './blog-editor.component';

describe('BlogListComponent', () => {
  let component: BlogEditorComponent;
  let fixture: ComponentFixture<BlogEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
