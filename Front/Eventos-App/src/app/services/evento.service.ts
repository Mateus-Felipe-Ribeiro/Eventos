import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()
export class EventoService {
  enviroment = 'https://localhost:5001/api/eventos';

  constructor(public http: HttpClient) {}

  public getEventos(): Observable<Evento[]>{
    return this.http.get<Evento[]>(this.enviroment);
  }

  public getEventosByTema(tema: string): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.enviroment}/${tema}/tema`);
  }

  public getEventoById(id: number): Observable<Evento>{
    return this.http.get<Evento>(`${this.enviroment}/${id}`);
  }
}
