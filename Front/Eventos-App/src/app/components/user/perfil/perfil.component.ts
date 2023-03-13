import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  UserUpdate = {} as UserUpdate;
  form: any;

  get f(): any{
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    ){}

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
  }

  public validation(): void{

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmaPassword')
    };

    this.form = this.fb.group({
      titulo: ['NaoInformado', Validators.required],
      primeiroNome: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      funcao: ['NaoInformado', Validators.required],
      descricao: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', [Validators.nullValidator, Validators.minLength(6)]],
      confirmaPassword: ['', Validators.nullValidator],
    }, formOptions);
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate)=>{
        console.log(userRetorno);
        this.UserUpdate = userRetorno;
        this.form.patchValue(this.UserUpdate);
        this.toastr.success('Usuário carregado', 'Sucesso!');
      },
      (error: any)=>{
        console.log(error)
        this.toastr.error('Falha ao carregar usuário', 'Erro!');
        this.router.navigate(['/dashboard']);
      }
    ).add(() => this.spinner.hide());
  }

  onSubmit(): void{
    this.atualizarUsuario();
  }

  public atualizarUsuario(): void {
    this.UserUpdate = {...this.form.value};
    this.spinner.show();
    this.accountService.updateUser(this.UserUpdate).subscribe(
      () => {
        this.toastr.success('Usuário atualizado!');
      },
      (error: any) => {
        console.log(error);
        this.toastr.error('Falha ao atualizar');
      }
    ).add(() => this.spinner.hide());
  }
  public resetForm(): void{
    event?.preventDefault();
    this.form.reset();
  }

}
