import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { Lote } from '@app/models/Lote';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  enviroment = 'https://localhost:5001/api/lotes';

  constructor(public http: HttpClient) {}

  public getLotesByEventoId(eventoId: number): Observable<Lote[]>{
    return this.http.get<Lote[]>(`${this.enviroment}/${eventoId}`)
    .pipe(take(1));
  }

  public put(eventoId: number, lotes: Lote[]): Observable<Lote[]>{
    return this.http.put<Lote[]>(`${this.enviroment}/${eventoId}`, lotes)
    .pipe(take(1));
  }

  public deleteLote(eventoId: number, loteId: number): Observable<any>{
    return this.http.delete(`${this.enviroment}/${eventoId}/${loteId}`)
    .pipe(take(1));
  }
}
