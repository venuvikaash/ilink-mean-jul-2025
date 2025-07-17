import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ad-text',
  template: `
    <div style="border: 2px dashed #28a745; padding: 15px; background: #f4fff4;">
      <h4 style="margin: 0 0 8px 0; color: #155724;">🔥 Limited Time Offer!</h4>
      <p style="margin: 0 0 8px 0;">
        Get <strong>50% OFF</strong> your first purchase at <em>GreenCart</em> — your go-to store for eco-friendly essentials.
      </p>
      <p style="margin: 0 0 8px 0;">
        Use code <code>GREEN50</code> at checkout.
      </p>
      <button
        style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;"
        (click)="onClick()"
      >
        Shop Now
      </button>
    </div>
  `
})
export class AdText {
  onClick() {
    window.open('https://example.com', '_blank');
  }
}
