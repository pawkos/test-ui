import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

interface AuthResponse {
    email: string;
    access_token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private router: Router) { }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
            .pipe(
                tap((response: any) => {
                    localStorage.setItem('token', response.token);
                    this.router.navigate(['/']);
                }),
                catchError(this.handleError)
            );
    }

    register(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { email, password })
            .pipe(
                tap((response: any) => {
                    localStorage.setItem('token', response.token);
                    this.router.navigate(['/']);
                }),
                catchError(this.handleError)
            );
    }

    logout(): Observable<any> {
        /*return this.http.post(`${this.apiUrl}/auth/logout`, {})
            .pipe(
                catchError(this.handleError)
            );*/
        localStorage.removeItem('token');
        this.router.navigate(['/']);
        return of(undefined);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        throw error;
    }
}