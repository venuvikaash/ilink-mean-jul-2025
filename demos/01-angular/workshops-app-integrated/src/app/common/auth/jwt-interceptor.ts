import { HttpInterceptorFn } from '@angular/common/http';

// token of role: 'admin' | email:john.doe@example.com | password: Password123#
localStorage.setItem('auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzUyNDc1MTA0fQ.Gaod9LBwKAh_KrauhxWt9CvPavuwne4vmcdD5y28n5U'); // This is added here just for testing purpose. This will be obtained from the backend on successful login.

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
