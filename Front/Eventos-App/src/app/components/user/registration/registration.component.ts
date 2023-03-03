import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/validatorField';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit{

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
      primeiroNome: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
    this.form.reset();
  }
}
