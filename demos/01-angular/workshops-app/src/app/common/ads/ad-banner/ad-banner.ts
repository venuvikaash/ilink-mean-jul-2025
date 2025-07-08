import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ad-banner',
  template: `
    <div style="border: 2px solid #007bff; padding: 10px; background: #e7f1ff; text-align: center;">
      <img
        [src]="imageSrc"
        alt="Banner Ad"
        style="max-width: 100%; height: auto;"
      />
      <p style="margin-top: 8px; font-weight: bold;">Sponsored by {{ company }}</p>
    </div>
  `
})
export class AdBanner {
  @Input() imageSrc!: string;
  @Input() company!: string;
}