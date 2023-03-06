import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()
export class EventoService {
  enviroment = 'https://localhost:5001/api/eventos';

  constructor(public http: HttpClient) {}

  public getEventos(): Observable<Evento[]>{
    return this.http.get<Evento[]>(this.enviroment)
    .pipe(take(1));
  }

  public getEventosByTema(tema: string): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.enviroment}/${tema}/tema`)
    .pipe(take(1));
  }

  public getEventoById(id: number): Observable<Evento>{
    return this.http.get<Evento>(`${this.enviroment}/${id}`)
    .pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(this.enviroment, evento)
    .pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento>{
    return this.http.put<Evento>(`${this.enviroment}/${evento.id}`, evento)
    .pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any>{
    return this.http.delete(`${this.enviroment}/${id}`)
    .pipe(take(1));
  }
}
