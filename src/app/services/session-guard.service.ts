import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { SessionService } from './session.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class SessionGuardService implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    if (!this.sessionService.session) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
