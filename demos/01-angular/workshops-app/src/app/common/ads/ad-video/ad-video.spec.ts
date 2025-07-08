import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdVideo } from './ad-video';

describe('AdVideo', () => {
  let component: AdVideo;
  let fixture: ComponentFixture<AdVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdVideo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdVideo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
