import { Component, inject } from '@angular/core';

import { ToastService } from './toast.service';
import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
