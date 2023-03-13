import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/validatorField';
import { User } from '@app/models/identity/User';
import { AccountService } from '@app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit{

  user = {} as User;
  form: any;

  get f(): any{
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
    ){}

  ngOnInit(): void {
    this.validation();
  }

  public validation(): void{

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmaPassword')
    };

    this.form = this.fb.group({
      primeiroNome: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmaPassword: ['', Validators.required],
    }, formOptions);
  }

  register(): void{
    if(this.form.valid){
      this.user = {...this.form.value};
      this.accountService.register(this.user).subscribe(
        () => {
          this.router.navigateByUrl('/dashboard')
        },
        (error: any) => {
          this.toastr.error('Erro: '+error.error);
        }
      );
    }
  }

  public resetForm(): void{
    this.form.reset();
  }
}
