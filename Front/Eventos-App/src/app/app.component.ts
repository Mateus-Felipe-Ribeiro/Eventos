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
    this.tourService.initialize([{
      anchorId: 'some.anchor.id',
      content: 'Some content conteudo longo tem que ser testado se não não funciona',
      title: 'First',
      enableBackdrop: true,
      placement: 'bottom-right',
    }, {
      anchorId: 'another.anchor.id',
      content: 'Other content conteudo longo tem que ser testado se não não funciona',
      title: 'Second',
      enableBackdrop: true,
      placement: 'bottom'
    },{
      anchorId: 'terceiro',
      content: 'apenas teste',
      title: '',
      enableBackdrop: true,
      placement: 'bottom-left'
    }
    ]);
    this.tourService.start()
  }

}
