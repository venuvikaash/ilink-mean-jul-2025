import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSessionComponent } from './add-session.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('AddSessionComponent', () => {
  let component: AddSessionComponent;
  let fixture: ComponentFixture<AddSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSessionComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
