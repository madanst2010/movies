import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowplaylistComponent } from './showplaylist.component';

describe('ShowplaylistComponent', () => {
  let component: ShowplaylistComponent;
  let fixture: ComponentFixture<ShowplaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowplaylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowplaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
