import { TestBed } from '@angular/core/testing';
import { RootComponent } from './root.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('RootComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RootComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'workshops-app' title`, () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('workshops-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(RootComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Hello, workshops-app'
    );
  });
});
