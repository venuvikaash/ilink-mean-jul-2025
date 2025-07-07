import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemComponent } from './item.component';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;

    // Set input properties
    component.session = {
      id: 1,
      workshopId: 1,
      sequenceId: 1,
      name: 'Introduction to Angular JS',
      speaker: 'John Doe',
      duration: 1,
      level: 'Basic',
      abstract: 'In this session you will learn about the basics of Angular JS',
      upvoteCount: 19,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
