import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AccountService } from '@app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService,
  ){}

  canActivate(): boolean {
    this.accountService.updateLoggedIn();

    if(localStorage.getItem('user') !== null)
      return true;

    this.toastr.info('Usuário não autenticado!');
    this.router.navigate(['user/login']);
    return false;
  }

}
