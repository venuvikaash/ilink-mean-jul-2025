import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-root',
  imports: [NgbAlert, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title : string = 'Hello Angular v20!';
  count : number = 0;
  isOpen = true;

  increment() {
    this.count = this.count + 1;
  }

  toggle() {
    // alert( 'closed' );
    this.isOpen = false;
  }
}
