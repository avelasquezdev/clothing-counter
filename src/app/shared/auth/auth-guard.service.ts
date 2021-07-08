import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate() {
    return this.authService.isAuthenticated().pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigateByUrl('');
        }
        return isLoggedIn;
      }));
  }
}
