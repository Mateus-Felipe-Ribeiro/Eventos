import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/validatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  form: any;

  get f(): any{
    return this.form.controls;
  }

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.validation();
  }

  public validation(): void{

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha', 'confirmaSenha')
    };

    this.form = this.fb.group({
      titulo: ['', Validators.required],
      primeiroNome: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      funcao: ['', Validators.required],
      username: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', Validators.required],
    }, formOptions);
  }

  onSubmit(): void{
    if(this.form.invalid){
      return;
    }
  }

  public resetForm(): void{
    event?.preventDefault();
    this.form.reset();
  }

}
