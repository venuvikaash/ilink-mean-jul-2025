import { Component, Input } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-alert',
  imports: [
    NgbAlert
  ],
  templateUrl: './error-alert.html',
  styleUrl: './error-alert.scss'
})
export class ErrorAlert {
  @Input()
  error: Error | null = null;
}
