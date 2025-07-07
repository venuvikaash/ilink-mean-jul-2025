import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VotingComponent } from 'app/common/voting/voting.component';
import ISession, { VoteType } from 'app/workshops/models/ISession';

@Component({
  selector: 'app-session-item',
  standalone: true,
  imports: [VotingComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export class ItemComponent {
  @Input()
  session!: ISession;

  @Output()
  vote: EventEmitter<VoteType> = new EventEmitter<VoteType>();

  getBadgeClass() {
    return {
      'bg-success': this.session.level === 'Basic',
      'bg-warning': this.session.level === 'Intermediate',
      'bg-danger': this.session.level === 'Advanced',
    };
  }

  onVote(voteType: VoteType) {
    this.vote.emit(voteType);
  }
}
