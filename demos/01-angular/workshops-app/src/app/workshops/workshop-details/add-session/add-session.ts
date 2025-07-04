import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-session',
  imports: [
    RouterLink,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './add-session.html',
  styleUrl: './add-session.scss'
})
export class AddSession {

}
