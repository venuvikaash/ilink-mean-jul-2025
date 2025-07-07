import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ItemComponent } from './item/item.component';
import { LoadingComponent } from 'app/common/loading/loading.component';
import { PaginationComponent } from 'app/common/pagination/pagination.component';

import { SessionsService } from 'app/workshops/sessions.service';
import { ToastService } from 'app/common/toast/toast.service';
import { useFilterableData } from 'app/signals/filter.signal';

import ISession, { VoteType } from 'app/workshops/models/ISession';

@Component({
  selector: 'app-sessions-list',
  standalone: true,
  imports: [ItemComponent, LoadingComponent, PaginationComponent],
  templateUrl: './sessions-list.component.html',
  styleUrl: './sessions-list.component.css',
})
export class SessionsListComponent implements OnInit {
  loading = true;
  error: Error | null = null;
  page = 1;
  id!: number;

  isOpen = true;

  filterable: ReturnType<typeof useFilterableData<ISession>>;

  getSessionsForWorkshop() {
    this.loading = true;

    // https://rxjs.dev/deprecations/subscribe-arguments
    this.sessionsService.getSessionsForWorkshop(this.id, this.page).subscribe({
      next: (fetchedSessions) => {
        this.filterable.array.set(fetchedSessions);
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sessionsService: SessionsService,
    private toastService: ToastService
  ) {
    this.filterable = useFilterableData<ISession>();

    this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        const idStr = paramMap.get('id');

        if (idStr) {
          this.id = +idStr;
          this.getSessionsForWorkshop();
        }
      },
    });

    this.activatedRoute.queryParamMap.subscribe({
      next: (queryParamMap) => {
        const pageStr = queryParamMap.get('page');

        if (pageStr) {
          this.page = +pageStr;
          this.getSessionsForWorkshop();
        }
      },
    });
  }

  ngOnInit(): void {
    this.getSessionsForWorkshop();
  }

  onPageChange(page: number) {
    this.router.navigate(['/workshops', this.id], {
      queryParams: {
        page: page,
      },
    });
  }

  onFilter(event: Event) {
    this.filterable.filterKey.set((event?.target as HTMLInputElement).value);
  }

  onVote(session: ISession, voteType: VoteType) {
    // alert( 'in parent : ' + voteType + ' for ' + session.name );
    this.sessionsService.voteForSession(session.id, voteType).subscribe({
      next: (updatedSession: ISession) => {
        session.upvoteCount = updatedSession.upvoteCount;

        this.toastService.show({
          templateOrMessage: `Your vote for session - "${session.name}" has been captured`,
          classname: 'bg-success text-light',
          delay: 2000,
        });
      },
      error: (error) => {
        this.toastService.show({
          templateOrMessage: `Your vote for session - "${session.name}" could not be captured - ${error.message}`,
          classname: 'bg-danger text-light',
          delay: 2000,
        });
      },
    });
  }
}

export default SessionsListComponent;
