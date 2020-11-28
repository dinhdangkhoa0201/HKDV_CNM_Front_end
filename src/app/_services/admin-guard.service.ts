import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {TokenStorageService} from './token-storage.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate, CanActivateChild {
  private admin: boolean;

  constructor(private router: Router, private tokenStorage: TokenStorageService) {
    this.admin = false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.tokenStorage.getUser();
    user.roles.forEach(role => {
      if (role.roleName === 'ROLE_ADMIN') {
        this.admin = true;
        return;
      }
    });
    return this.admin;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
