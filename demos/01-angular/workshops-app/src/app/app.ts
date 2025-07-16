import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { Menu } from './menu/menu';
import { Home } from './home/home';
import { Toast } from './common/toast/toast';

@Component({
  selector: 'app-root',
  imports: [NgbAlert, CommonModule, Menu/*, Home*/, RouterOutlet, Toast],
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
