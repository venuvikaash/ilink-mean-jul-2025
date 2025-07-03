import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingWidget } from './voting-widget';

describe('VotingWidget', () => {
  let component: VotingWidget;
  let fixture: ComponentFixture<VotingWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotingWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
