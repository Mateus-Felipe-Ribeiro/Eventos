import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { Lote } from '@app/models/Lote';
import { LoteService } from '@app/services/lote.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  modalRef?: BsModalRef;
  eventoId = 0;
  form: any;
  evento = {} as Evento;
  modoSalvar = 'post';
  loteAtual = {id: 0,nome: '', indice: 0};
  imagemURL = 'assets/images/cloud-upload.png';
  file: File | undefined;

  get modoEditar(): boolean{
    return this.modoSalvar == 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      dateInputFormat: 'DD/MM/YYYY hh:mm',
      isAnimated: true,
      adaptivePosition: true,
      showWeekNumbers: false,
    };
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public carregarEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id')!;

    if (this.eventoId != null && this.eventoId != 0) {
      this.spinner.show();

      this.modoSalvar = 'put';

      this.eventoService
        .getEventoById(this.eventoId)
        .subscribe(
          (evento: Evento) => {
            this.evento = { ...evento };
            this.form.patchValue(this.evento);
            this.evento.lotes.forEach(lote => {
              this.lotes.push(this.criarLote(lote));
            })
            if(this.evento.imagemURL !== ''){
              this.imagemURL = environment.apiURL+'resources/images/'+this.evento.imagemURL;
            }
            this.carregarLotes();
          },
          (error: any) => {
            console.log(error);
            this.toastr.error('Erro ao tentar carregar Evento.', 'Erro.');
          }
        )
        .add(() => {
          this.spinner.hide();
        });
    }
  }

  public carregarLotes(): void{
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotes: Lote[]) => {
        lotes.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        })
      },
      (error: any) => {
        console.log(error);
        this.toastr.error('Erro ao carregar lotes', 'Ops');
      }
    ).add(() => {
      this.spinner.hide();
    });
  }

  public validation(): void {
    this.form = this.fb.group({
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      qtdPessoas: [
        '',
        [Validators.required, Validators.max(120000), Validators.min(1)],
      ],
      imagemURL: [''],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([]),
    });
  }

  public adicionarLote(): void {
    (this.lotes).push(this.criarLote({id: 0} as Lote));
  }

  public criarLote(lote: Lote): FormGroup{
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio, Validators.required],
      dataFim: [lote.dataFim, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
    })
  }

  public retornaTituloLote(nome: string): string{
    return nome === null || nome === ""
      ? "Nome do lote"
      : nome;
  }

  public mudarValorData(value: Date, i: number, campo: string): void{
    this.lotes.value[i][campo] = value;
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {
      this.evento =
        this.modoSalvar == 'post'
          ? { ...this.form.value }
          : { id: this.evento.id, ...this.form.value };

      this.eventoService[this.modoSalvar](this.evento)
        .subscribe(
          (evento: Evento) => {
            this.toastr.success('Evento salvo com sucesso!', 'Sucesso');
            this.router.navigate([`eventos/detalhe/${evento.id}`])
          },
          (error: any) => {
            console.log(error);
            this.toastr.error('Erro ao salvar Evento', 'Erro');
          }
        )
        .add(() => {
          this.spinner.hide();
        });
    }
  }

  public salvarLote(): void{
    this.spinner.show();
    if(this.form.controls.lotes.valid){
      this.loteService.put(this.eventoId, this.form.value.lotes).subscribe(
        () => {
          this.toastr.success('Lotes salvos com sucesso', 'Sucesso!');
          //this.lotes.reset();
        },
        (error: any) => {
          console.log(error);
          this.toastr.error('Falha ao salvar Lotes', 'Erro!');
        }
      ).add(() => {this.spinner.hide()});
    }
  }

  public removerLote(template: TemplateRef<any>, i: number): void{
    const id = this.lotes.get(i+'.id');
    const nome = this.lotes.get(i+'.nome');
    if(id && nome){
      this.loteAtual.id = id.value;
      this.loteAtual.nome = nome.value;
      this.loteAtual.indice = i;
    }

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe(
      (result: any) => {
        this.lotes.removeAt(this.loteAtual.indice);
        this.toastr.success('lote removido.', 'Sucesso!');
      },
      (error: any) => {
        console.log(error)
        this.toastr.error(`Erro ao remover lote código: ${this.loteAtual.id}` , 'Erro');
      },
    ).add(() => this.spinner.hide());
  }

  public decline(): void {
    this.modalRef?.hide();
  }

  public onFileChange(event: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = event.target.files;
    reader.readAsDataURL(this.file![0]);

    this.uploadImagem();
  }

  public uploadImagem(): void {
    this.spinner.show();

    this.eventoService.postUpload(this.eventoId, this.file!).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success('Imagem atualizada', 'Sucesso!');
      },
      (error: any) => {
        console.log(error);
        this.toastr.error('Falha ao atualizar imagem', 'Erro!');
      }
    ).add(
      ()=>this.spinner.hide()
    );
  }
}
