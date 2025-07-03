import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-voting-widget',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './voting-widget.html',
  styleUrl: './voting-widget.scss'
})
export class VotingWidget {
  @Input()
  votes!: number;

  @Output()
  vote = new EventEmitter<number>();

  icons = {
    faCaretUp,
    faCaretDown
  }

  emitVote(by: number) {
    this.vote.emit(by);
  }
}
