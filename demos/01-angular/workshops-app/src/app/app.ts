import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { Menu } from './menu/menu';
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  imports: [NgbAlert, CommonModule, Menu, Home],
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
