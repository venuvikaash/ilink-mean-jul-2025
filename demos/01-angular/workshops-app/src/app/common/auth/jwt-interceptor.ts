import { HttpInterceptorFn } from '@angular/common/http';

localStorage.setItem('auth-token', 'dummy-jwt-token'); // This is added here just for testing purpose. This will be obtained from the backend on successful login.

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('auth-token');

    console.log( req.method );

    if( req.method !== 'GET' ) {
        const cloned = req.clone({
            setHeaders: { Authorization: token ? `Bearer ${token}` : '' }
        });
        return next(cloned);
    }

    return next(req);
};
