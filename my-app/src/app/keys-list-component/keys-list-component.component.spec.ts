import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeysListComponentComponent } from './keys-list-component.component';

describe('KeysListComponentComponent', () => {
  let component: KeysListComponentComponent;
  let fixture: ComponentFixture<KeysListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeysListComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeysListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
