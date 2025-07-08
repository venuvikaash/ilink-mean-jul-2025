import {
  Component,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-call-to-action',
  imports: [
    CommonModule
  ],
  templateUrl: './call-to-action.html',
  styleUrl: './call-to-action.scss'
})
export class CallToAction {
  @ContentChild('cta')
  ctaTemplate!: TemplateRef<any>;
}
