import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

import { VoteType } from 'app/workshops/models/ISession';

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.scss',
})
export class VotingComponent implements OnChanges {
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;

  @Input()
  votes!: number;

  @Output()
  vote: EventEmitter<VoteType> = new EventEmitter<VoteType>();

  ngOnChanges(changes: SimpleChanges) {
    // NOTE: Uncomment to see changes as they are received from the parent
    // console.log('VotingComponent::ngOnChanges');
    // console.log('changes = ', changes);
  }

  onVote(voteType: VoteType) {
    this.vote.emit(voteType);
  }
}
