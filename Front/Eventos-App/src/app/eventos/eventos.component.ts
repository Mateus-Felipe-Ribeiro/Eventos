import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit{

  public enviroment = 'https://localhost:5001/api/eventos'
  public eventos: any = [];
  public eventosFiltrados: any = [];
  mostrarImagem = true;
  private _filtroLista: string = '';

  public get filtroLista(): string{
    return this._filtroLista;
  }

  public set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  filtrarEventos(filtrarPor: string): any{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento : any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(
    public http: HttpClient,
  ){}

  ngOnInit(): void {
    this.http.get(this.enviroment).subscribe((res)=>{
      this.eventos = res
      this.eventosFiltrados = this.eventos
    });
  }

  mostrarImg(){
    this.mostrarImagem = !this.mostrarImagem;
  }
}
