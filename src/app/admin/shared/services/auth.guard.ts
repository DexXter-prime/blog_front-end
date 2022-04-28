import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'}) // root
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private auth: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.auth.isAuthenticated){
      return true;
    }
    else {
      this.router.navigate(['/admin', 'login'], {
        queryParams: {
          login: true
        }
      })
      return false;
    }
  }
}
