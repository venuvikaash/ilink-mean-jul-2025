import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent], // Import the standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have title as "Workshops App"', () => {
    expect(component.title).toBe('Workshops App');
  });

  it('should display the title in an h1 tag', () => {
    const h1Element = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(h1Element.textContent).toBe('Workshops App');
  });

  it('should display a greeting paragraph', () => {
    const greetingParagraph = fixture.debugElement.query(
      By.css('p')
    ).nativeElement;
    expect(greetingParagraph.textContent).toContain('Welcome to Workshops App');
  });

  it('should contain the introduction paragraphs', () => {
    const paragraphs = fixture.debugElement.queryAll(By.css('p'));
    expect(paragraphs.length).toBe(3); // Expecting three <p> elements

    expect(paragraphs[1].nativeElement.textContent).toContain(
      'The app serves details of (fictitious) technical workshops happening in various cities.'
    );
    expect(paragraphs[2].nativeElement.textContent).toContain(
      'You can view a list of workshops, details of every workshop, add a workshop, view the list of sessions in a workshop, and also add a new session for a workshop.'
    );
  });
});
