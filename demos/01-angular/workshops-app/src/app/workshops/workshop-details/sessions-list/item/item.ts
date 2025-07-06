import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, SimpleChanges, ElementRef } from '@angular/core';
import ISession from '../../../models/ISession';
import { VotingWidget } from '../../../../common/voting-widget/voting-widget';

@Component({
  selector: 'app-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VotingWidget],
  templateUrl: './item.html',
  styleUrl: './item.scss',
})
export class Item {
  numNgOnChangesRuns = 0;
  numNgDoCheckRuns = 0;

  @Input()
  session!: ISession;

  @Output('updateVote')
  updateVote = new EventEmitter<number>();

  logRender() {
    console.log( 'rendering session list item :', this.session );
  }

  // Best for verifying input change-based re-renders - This is just to check which session is re-rendered on change - ngOnChanges() is called only when an @Input() changes (here, session) — which is exactly what OnPush checks for.
  ngOnChanges(changes: SimpleChanges): void {
    ++this.numNgOnChangesRuns;

    // console.log( '*** Executing **ngOnChanges ***' );
    // console.log(`Item component re-rendered for session: ${this.session.name}`);
    // console.log('Changes:', changes);

    console.log( 'numNgOnChangesRuns  = ' + this.numNgOnChangesRuns );
  }

  // ngDoCheck() runs on every CD cycle (even for OnPush components), but only if Angular believes there might be changes. For OnPush, it only triggers when @Input() references change or local events occur
  ngDoCheck(): void {
    ++this.numNgDoCheckRuns;

    // console.log( '*** Executing **ngDoCheck ***' );
    // console.log(`Checked: ${this.session.name}`);

    console.log( 'numNgDoCheckRuns = ' + this.numNgDoCheckRuns );
  }

  updateSessionVote($event: number) {
    this.updateVote.emit($event);
  }
}
