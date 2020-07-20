import { Component, OnInit } from '@angular/core';
import {CinemaService} from '../services/cinema.service';
@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public cinemas;
  public salles: any;
  public currentVille;
  public currentCinema;
  public currentProjection: any;
  public selectedTickets;


  constructor(public cinemaService:CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
    .subscribe(data=>{
        this.villes=data;
    },err=>{
        console.log(err);
    })
  }

  public onGetCinemas(v){
    this.currentVille=v;
    this.salles=undefined;
    this.currentProjection=undefined;
    this.cinemaService.getCinemas(v)
    .subscribe(data=>{²
        this.cinemas=data;
    },err=>{
        console.log(err);
      })
  }

  public onGetSalles(c){
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
    .subscribe(data=>{
        this.salles=data;
    this.salles._embedded.salles.forEach(salle=>{
      this.cinemaService.getProjections(salle)
      .subscribe(data=>{
        salle.projections=data;
    },err=>{
        console.log(err);
      })
  })
    },err=>{
        console.log(err);
      })
  }

  public onGetTicketsPlaces(p){
    this.currentProjection = p;
    this.cinemaService.getTicketsPlaces(p)
  .subscribe(data=>{
        this.currentProjection.tickets=data;
        this.selectedTickets=[];
    },err=>{
        console.log(err);
      })
  }

  public getTicketClass(t){
      let mot ="btn ";
      if (t.reserve==true){
          mot+="bt-danger ";
      }
      else if(t.selected){
        mot+="btn-warning"
      }
      else{
          mot+="btn-success"
      }
      return mot;
}

public onSelectTicket(t){

  if(!t.selected){
    t.selected= true;
    this.selectedTickets.push(t);
  }else{
    t.selected=false;
    this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
  }
  console.log(this.selectedTickets);
}

  public onPayTickets(dataForm){

    let tickets=[];
    this.selectedTickets.forEach(t=>{
      tickets.push(t.id);
    });
    dataForm.tickets=tickets;
    console.log(dataForm);
    this.cinemaService.payetTickets(dataForm)
    .subscribe(data=>{
        alert("Tickets Reserves avec succés!");
        this.onGetTicketsPlaces(this.currentProjection);
    },err=>{
        console.log(err);
      })
  }

}
