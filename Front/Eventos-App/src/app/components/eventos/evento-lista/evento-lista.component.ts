import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from 'src/env/environment';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss'],
})
export class EventoListaComponent {
  public enviroment = 'https://localhost:5001/api/eventos';
  public eventos: Evento[] = [];
  public eventoId = 0;
  public pagination = {} as Pagination;
  public mostrarImagem = true;
  public modalRef?: BsModalRef;
  termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtrarEventos(evento: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.spinner.show();
      this.termoBuscaChanged
        .pipe(debounceTime(1500))
        .subscribe((filtrarPor) => {
          this.eventoService
            .getEventos(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            )
            .subscribe(
              (paginatedResult: PaginatedResult<Evento[]>) => {
                this.eventos = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              (error: any) => {
                console.log(error);
                this.toastr.error('Falha ao buscar evento', 'Erro!');
              }
            )
            .add(() => this.spinner.hide());
        });
    }
    this.termoBuscaChanged.next(evento.value);
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.pagination = {
      itemsPerPage: 5,
      totalItems: 1,
      currentPage: 1,
    } as Pagination;
    this.carregarElementos();
  }

  public carregarElementos(): void {
    this.spinner.show();
    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (paginatedResult: PaginatedResult<Evento[]>) => {
          this.eventos = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
          console.log(this.pagination)
        },
        (error: any) => {
          console.log(error);
          this.toastr.error('Erro ao carregar eventos', 'Erro!');
        }
      )
      .add(() => this.spinner.hide());
  }

  public mostrarImg(): void {
    this.mostrarImagem = !this.mostrarImagem;
  }

  public openModal(
    event: any,
    template: TemplateRef<any>,
    eventoId: number
  ): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public pageChanged(evento: any): void {
    this.pagination.currentPage = evento.page;
    this.carregarElementos();
  }

  public confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.eventoService
      .deleteEvento(this.eventoId)
      .subscribe(
        (result: any) => {
          this.toastr.success('Evento removido.', 'Sucesso!');
          this.carregarElementos();
        },
        (error: any) => {
          console.log(error);
          this.toastr.error(
            `Erro ao remover Evento código: ${this.eventoId}`,
            'Erro'
          );
        }
      )
      .add(() => this.spinner.hide());
  }

  public decline(): void {
    this.modalRef?.hide();
  }

  public detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  public mostraImagem(imagemURL: string): string {
    return imagemURL !== ''
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/images/semImagem.jpeg';
  }
}
