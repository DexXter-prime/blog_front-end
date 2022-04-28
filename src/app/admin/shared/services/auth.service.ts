import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, debounceTime, delay, Observable, of, Subject, Subscriber, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { urlAuthLink } from "src/environments/url";
import { ICurrentUser, IOriginMethod, IResponseTokens, IUser, IUserData } from "../interfaces";

@Injectable({providedIn: 'root'})
export class AuthService {
        // 1 add guard for UNauth
        // 2 validation for reg
    currentUser!: ICurrentUser;

    constructor(private http: HttpClient) {}

    getUsers(): Observable<any> {
      return this.http.get(`${urlAuthLink}/users`, { withCredentials: true });
    }

    getNewTokens(): Observable<IResponseTokens> {
      return this.http.get<IResponseTokens>(`${urlAuthLink}/refresh`, {withCredentials: true}).pipe(tap((res) => this.setToken(res)))
    }

    checkUsernameExists(value: string): Observable<any> {
      return this.http.post(`${urlAuthLink}/checkEmailExistens`, {email: value}, {withCredentials: true}); //add debounce
    }

    originReq(originMethod: string, url: string, body?: any): Observable<any> {
      switch(originMethod) {
        case 'GET':
          return this.http.get(`${url}`, {withCredentials: true})
        case 'POST':
          return this.http.post(`${url}`, body, {withCredentials: true})
        case 'DELETE':
          return this.http.delete(`${url}`, {withCredentials: true})
        case 'PUT':
          return this.http.put(`${url}`, body, {withCredentials: true})
      }
      return new Observable(subscriber => {
        subscriber.next({})
      }) // fix
    }

    registration(user: IUser): Observable<IResponseTokens> {
      return this.http.post<IResponseTokens>(`${urlAuthLink}/registration`, user, {withCredentials: true}).pipe(
        tap((res) => {
          this.setToken(res)
        }),
        tap((res) => {
          const currentUserData = {id: res.user?.id, name: res.user!.name, email: res.user!.email}
          this.currentUser = currentUserData;
        })
      )
    }

    login(user: IUserData): Observable<IResponseTokens> {
        return this.http.post<IResponseTokens>(`${urlAuthLink}/login`, user, {withCredentials: true})
        .pipe(
          tap((res) => this.setToken(res)),
          tap((res) => {
            const currentUserData = {id: res.user?.id, name: res.user!.name, email: res.user!.email}
            this.currentUser = currentUserData;
          })
          // catchError(this.handleError.bind(this))
        )
    }

    logout(): Observable<any> {
      return this.http.post<any>(`${urlAuthLink}/logout`, 'word', {withCredentials: true}).pipe(tap(() => {
        this.setToken(null);
      }));
    }

    getCurrentUser(): Observable<any> {
      return this.http.get<any>(`${urlAuthLink}/currentUser`, {withCredentials: true}).pipe(tap((res) => {
        this.currentUser = res;
      }));

    }

    get token(): string | null {
      return localStorage.getItem('access-token');
    }

    get isAuthenticated(): boolean {
      return !!this.token;
    }

    private setToken(response: IResponseTokens | null | undefined) {
      if(response) {
        const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
        localStorage.setItem('access-token', response.accessToken);
        localStorage.setItem('access-token-exp', expDate.toString());
      } else {
        localStorage.clear();
      }
    }
}
