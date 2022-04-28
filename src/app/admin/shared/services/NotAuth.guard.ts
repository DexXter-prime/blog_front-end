import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'}) // root
export class NotAuthGuard implements CanActivate {

  constructor(private router: Router, private auth: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.auth.isAuthenticated){
      this.router.navigate(['/posts']);
      return false;
    }
    else {
      return true;
    }
  }
}
