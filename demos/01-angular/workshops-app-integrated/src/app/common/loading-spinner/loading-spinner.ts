import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme } from '../../models/utils';

@Component({
  selector: 'app-loading-spinner',
  imports: [
    CommonModule
  ],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss'
})
export class LoadingSpinner {
  @Input()
  variant: Theme = 'dark';
}
