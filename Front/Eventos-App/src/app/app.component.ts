import { Component, OnInit } from '@angular/core';
import { TourService } from 'ngx-ui-tour-ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Eventos-App';

  constructor(
    public tourService: TourService
  ){

  }

  ngOnInit(): void {

  }

}
