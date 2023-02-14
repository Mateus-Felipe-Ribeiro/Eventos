import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit{

  public enviroment = 'https://localhost:5001/api/eventos'
  public eventos: any;

  constructor(
    public http: HttpClient,
  ){}

  ngOnInit(): void {
    this.http.get(this.enviroment).subscribe((res)=>{
      this.eventos = res
    });
  }
}
