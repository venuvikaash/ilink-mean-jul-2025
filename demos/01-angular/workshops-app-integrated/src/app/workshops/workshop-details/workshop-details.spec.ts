import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopDetails } from './workshop-details';

describe('WorkshopDetails', () => {
  let component: WorkshopDetails;
  let fixture: ComponentFixture<WorkshopDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
