import { Component, OnInit, Input } from '@angular/core';
/*Importamos el servicio*/
import { GraficotestService } from '../../servicios/graficotest.service';
import { Chart } from 'chart.js';
import { AuthService } from '../../servicios/auth.service';
import { LoginComponent } from '../../sesiones/login/login.component';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {


  /*declaramos la propiedad*/
  data: any = [];
  ciudad: any;
  nameUser: string;
  emailUser: string;
  photoUser: string;

  constructor(private graficosService: GraficotestService,
              private authService: AuthService) { }

  ngOnInit() {
    this.nameUser = this.authService.currentUserName();
    this.emailUser = this.authService.currentUserEmail();
    this.photoUser = this.authService.currentUserPhoto();

    this.data = this.graficosService.temperaturasAPI()
    .subscribe(res => {
      this.ciudad = res['city'].name;

      const TEMP_MAX = res['list'].map(response => response.main.temp_max);
      const TEMP_MIN = res['list'].map(response => response.main.temp_min);
      const allDays = res['list'].map(response => response.dt);
      const climaDias = [];

      allDays.forEach(el => {
         const jsDate = new Date(el * 1000);
         const options = {
           weekday: 'long',
           month: 'short',
           day: 'numeric'
         };

         climaDias.push(jsDate.toLocaleTimeString('es', options));

         this.data = new Chart('canvas', {
           type: 'line',
           data: {
             labels: climaDias,
             datasets: [
               {
                 data: TEMP_MAX,
                 backgroundColor: [
                   'red',
                   'red',
                   'red',
                   'red',
                   'red',
                   'red'
                 ],
                 fill: false
               },
               {
                data: TEMP_MIN,
                backgroundColor: [
                  '#00ffff',
                  '#00ffff',
                  '#00ffff',
                  '#00ffff',
                  '#00ffff',
                  '#00ffff'
                ],
                fill: false
              }
             ]
           },
           options: {
             legend: {
               display: false
             },
             scales: {
               xAxes: [{
                  display: true
               }],
               yAxes: [
                 {
                  display: true
                 }
               ]
             }
           }
         });
      });
    });
  }



}
