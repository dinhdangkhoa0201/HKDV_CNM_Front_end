import {Injectable} from '@angular/core';
import {TokenStorageService} from './token-storage.service';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivateChild {
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
  constructor(private router: Router, private tokenStorage: TokenStorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('is login ', !this.tokenStorage.getUser());
    if (!this.tokenStorage.getUser()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
