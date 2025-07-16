import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sessions } from '../../sessions';
import ISession from '../../models/ISession';
import { Toast as ToastService } from '../../../common/toast';

import { LoadingSpinner } from '../../../common/loading-spinner/loading-spinner';
import { ErrorAlert } from '../../../common/error-alert/error-alert';
import { Item } from './item/item';

import { SessionsSocket } from '../../session-socket.service';

@Component({
    selector: 'app-sessions-list',
    standalone: true,
    imports: [
        LoadingSpinner,
        ErrorAlert,
        Item
    ],
    templateUrl: './sessions-list.html',
    styleUrl: './sessions-list.scss',
})
export class SessionsList implements OnInit {
    loading = true;
    error : Error | null = null;
    workshopId!: number | string;
    sessions!: ISession[];

    private toastService = inject(ToastService);

    constructor(
        private sessionsService: Sessions,
        private activatedRoute: ActivatedRoute,
        private socketService: SessionsSocket
    ) {}

    ngOnInit() {
        // this.activatedRoute.snapshot.paramMap is NOT an observable unlike this.activatedRoute.paramMap which is an observable
        const idStr = this.activatedRoute.snapshot.paramMap.get('id');
        this.workshopId = (idStr as string);

        this.loading = true;
        this.sessionsService.getSessionsForWorkshop(this.workshopId).subscribe({
            next: (sessions) => {
                this.sessions = sessions;
                this.loading = false;

                this.socketService.onSessionUpdated().subscribe((updatedSession) => {
                    console.log( this.sessions );
                    console.log( updatedSession );

                    // Only update session if it belongs to this workshop
                    if (updatedSession.workshopId === this.workshopId) {
                        this.sessions = this.sessions.map(s =>
                            (s as any)._id === (updatedSession as any)._id ? updatedSession : s
                        );
                    }
                });
            },
            error: (err) => {
                this.error = err;
                this.loading = false;
            }
        });
    }

    // updateVote(session: ISession, by: number) {
    // this.sessionsService
    //     .voteForSession(session.id, by === 1 ? 'upvote' : 'downvote')
    //     .subscribe({
    //         next: (updatedSession) => {
    //             // Instead of mutating the object directly, do so immutably (Note - this is crucial!)

    //             // we have updated a property on this session object
    //             // the session object is the same object in memory
    //             // the this.sessions array is the same in memory
    //             // But we have MUTATED the existing object, array
    //             // session.upvoteCount = updatedSession.upvoteCount;

    //             // a new object is present in the array for the session which has been updated. rest all session objects are the same as before (therefore they will not be checked for change)
    //             // With OnPush strategy this will trigger a Change Detection (CD), as `session` is an input for app-item component. Therefore the UI for app-item will be updated
    //             this.sessions = this.sessions.map(s =>
    //                 s.id === updatedSession.id ? updatedSession : s
    //             );

    //             this.toastService.add({
    //                 message: `Your vote for ${session.name} has been captured`,
    //                 duration: 3000,
    //                 className: 'bg-success text-light'
    //             });
    //         },
    //         error: (err) => {
    //             this.toastService.add({
    //                 message: `Your vote for ${session.name} could not be captured (${err.message}). Try again.`,
    //                 duration: 3000,
    //                 className: 'bg-danger text-light'
    //             })
    //         }
    //     });
    // }

    updateVote(session: ISession, by: number) {
        if (by === 1) {
            this.socketService.emitUpvote("" + (session as any)._id);
        } else {
            this.socketService.emitDownvote("" + (session as any)._id);
        }

        this.toastService.add({
            message: `Your vote for ${session.name} has been sent`,
            duration: 3000,
            className: 'bg-info text-light'
        });
    }
}