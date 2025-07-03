import { Component, inject } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { Toast as ToastService } from '../toast';

@Component({
  selector: 'app-toast',
  imports: [
    NgbToastModule
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast {
    // Angular 17 Introduced this way on service injection
    public toastService = inject(ToastService); // makes it possible for function to get service instances

    // constructor(private toastService: ToastService) {
    // }
}
