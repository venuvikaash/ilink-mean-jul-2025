import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdText } from './ad-text';

describe('AdText', () => {
  let component: AdText;
  let fixture: ComponentFixture<AdText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
