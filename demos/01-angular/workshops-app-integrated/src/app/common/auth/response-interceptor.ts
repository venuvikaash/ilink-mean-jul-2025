import { HttpInterceptorFn } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

export const responseDataInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        const transformed = (body as any)?.data ?? body;
        return event.clone({ body: transformed });
      }
      return event;
    })
  );
};