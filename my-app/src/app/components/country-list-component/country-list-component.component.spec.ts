import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryListComponentComponent } from './country-list-component.component';

describe('CountryListComponentComponent', () => {
  let component: CountryListComponentComponent;
  let fixture: ComponentFixture<CountryListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryListComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
