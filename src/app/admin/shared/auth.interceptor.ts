import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponseBase } from "@angular/common/http";
import { error } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, tap, throwError } from "rxjs";
import { PostPageComponent } from "src/app/post-page/post-page.component";
import { PostComponent } from "src/app/shared/components/post/post.component";
import { PostsService } from "src/app/shared/posts.service";
import { CreatePageComponent } from "../create-page/create-page.component";
import { AuthService } from "./services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private postsService: PostsService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated) {
      req = req.clone({
        setHeaders: {
          authorization: `Bearer ${this.auth.token}`,
        }
      })
    }

    return next.handle(req).pipe(tap(w => {
      // console.log(w, '[INTERCEPTOR]');
    }),
    catchError((error: HttpErrorResponse) => {
      // console.log('[Interceptor Error]', error);
      if (error.status === 401 && !this.auth.isAuthenticated) {
        // this.auth.logout().subscribe();
        this.router.navigate(['/admin', 'login'], {
          queryParams: {
            authFailedFIRST_REQ: true
          }
        });
      } else if (error.status === 401) {
        this.auth.getNewTokens().subscribe({
          next: (res) => {
            if(req.body) {
              this.auth.originReq(req.method, req.url, req.body).subscribe(res => {
                this.router.navigate(['/posts']);
              })
            } else {
              this.auth.originReq(req.method, req.url).subscribe({
                next: (res) => {
                  if(!this.auth.currentUser) {
                    this.auth.currentUser = res;
                  }

                  if(this.postsService.currentPost || !this.postsService.currentPost ) {
                    this.postsService.currentPost = res;
                    console.log(3333);
                    // this.router.navigate([`${req.url}`]);
                  }

                  if(res.postData) {
                    this.postsService.getAllPosts().subscribe(res => {
                      this.router.navigate(['/posts']);
                    });
                  }
                }
              })
            }
          },
          error: (err) => {
            console.log(req)
            this.auth.logout().subscribe()
          }
        })
      }
      return throwError(error)
    }));
  }

}
