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

  public postEvento(evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(this.enviroment, evento);
  }

  public putEvento(id: number, evento: Evento): Observable<Evento>{
    return this.http.put<Evento>(`${this.enviroment}/${id}`, evento);
  }

  public deleteEvento(id: number): Observable<any>{
    return this.http.delete(`${this.enviroment}/${id}`);
  }
}
