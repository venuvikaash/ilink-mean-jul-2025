import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sessions } from '../../sessions';
import ISession from '../../models/ISession';
import { Toast as ToastService } from '../../../common/toast';

import { VotingWidget } from '../../../common/voting-widget/voting-widget';

@Component({
    selector: 'app-sessions-list',
    standalone: true,
    imports: [
        VotingWidget
    ],
    templateUrl: './sessions-list.html',
    styleUrl: './sessions-list.scss',
})
export class SessionsList implements OnInit {
    workshopId!: number;
    sessions!: ISession[];

    private toastService = inject(ToastService);

    constructor(
        private sessionsService: Sessions,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        // this.activatedRoute.snapshot.paramMap is NOT an observable unlike this.activatedRoute.paramMap which is an observable
        const idStr = this.activatedRoute.snapshot.paramMap.get('id');
        this.workshopId = +(idStr as string);

        this.sessionsService.getSessionsForWorkshop(this.workshopId).subscribe({
            next: (sessions) => {
                this.sessions = sessions;
            },
        });
    }

    updateVote(session: ISession, by: number) {
    this.sessionsService
        .voteForSession(session.id, by === 1 ? 'upvote' : 'downvote')
        .subscribe({
            next: (updatedSession) => {
                session.upvoteCount = updatedSession.upvoteCount;
                this.toastService.add({
                    message: `Your vote for ${session.name} has been captured`,
                    duration: 3000,
                    className: 'bg-success text-light'
                });
            },
            error: (err) => {
                this.toastService.add({
                    message: `Your vote for ${session.name} could not be captured (${err.message}). Try again.`,
                    duration: 3000,
                    className: 'bg-danger text-light'
                })
            }
        });
    }
}