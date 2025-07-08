import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ad-video',
  template: `
    <div style="border: 2px solid #dc3545; padding: 10px; background: #fff3f3;" >
      <video width="100%" height="240" controls autoplay muted loop style="display: block; margin: 0 auto;">
        <source [src]="videoSrc" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p style="text-align: center; font-weight: bold; margin-top: 8px;">
        {{ captionText }}
      </p>
    </div>
  `
})
export class AdVideo {
  @Input() videoSrc!: string;
  @Input() captionText!: string;
}