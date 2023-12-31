// tournee.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LivreurService } from 'src/app/services/livreurService/livreur.service';
import { TourneeService } from 'src/app/services/tourneeService/tournee.service';

@Component({
  selector: 'app-tournee',
  templateUrl: './tournee.component.html',
  styleUrls: ['./tournee.component.css']
})
export class TourneeComponent implements OnInit {
  livreurs: any[] = [];
  tourneesData: any[] = [];
  selectedTourneeId: number | null = null;
  commandesData: { [tourneeId: number]: any[] } = {};  
  selectedLivreurId: { [tourneeId: number]: number } = {};  
  userIsAdmin: boolean = true; 


  constructor( private tourneeService: TourneeService ,private livreurService: LivreurService, private routerService : Router, private http: HttpClient, private toastr: ToastrService, private tokenService : TokenService) { }

  ngOnInit(): void {
    this.loadLivreurs();
    this.loadTournees();
  }

  loadTournees(): void {
    this.tourneeService.getAllTournees().subscribe(
      (data:any) => {
        this.tourneesData = data;
      },
      (error) => {
        console.error('Error loading tournees', error);
      }
    );
  }

  toggleDetails(tournee: any): void {
    tournee.showDetails = !tournee.showDetails;

    if (tournee.showDetails) {
      this.loadCommandes(tournee.id);
    }
  }

  deleteTourneeFromList(tourneeId: number): void {
    this.tourneesData = this.tourneesData.filter(tournee => tournee.id !== tourneeId);
  }

  deleteTourneeById(tourneeId: number): void {
  this.tourneeService.deleteTournee(tourneeId).subscribe(
    response => {
      console.log(response);
      this.deleteTourneeFromList(tourneeId); // Supprimer la tournée de la liste
    },
    error => {
      console.error(error);
    }
  );
}


  loadCommandes(tourneeId: number): void {
    this.tourneeService.getCommandesFromTournee(tourneeId).subscribe(
      (commandesData: any) => {
        this.commandesData[tourneeId] = commandesData;  
      },
      (error) => {
        console.error('Erreur lors du chargement des commandes de la tournée', error);
      }
    );
  }
  
  loadLivreurs(): void {
    this.livreurService.getAllLivreurs().subscribe(
      (data: any) => {
        this.livreurs = data;
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des livreurs', error);
      }
    );
  }

  restaurerLivraisons(): void {
    this.tourneeService.update_all_EstLivre().subscribe(
      (response) => {
        console.log('Réponse de l\'API:', response);
        console.log("les commandes ont ete restaure ");
        location.reload();
      },
      (error) => {
        console.error('Erreur lors de la restauration des livraisons : ', error);
      }
    );
  }

  assignerTournee(tourneeId: number): void {
    const livreurId = this.selectedLivreurId[tourneeId];
    console.log(livreurId);
    if (livreurId) {
      console.log('Assigner la tournée:', tourneeId, 'à livreur:', livreurId);

      this.tourneeService.assignerTournee(tourneeId, livreurId).subscribe(
        (response: any) => {
          console.log(response);
          this.loadTournees();
          console.log(response);
        },
        (error) => {

          console.error('Erreur lors de l\'assignation de la tournée', error);
        }
      );
    }
  }

 

  confirmDelete(tournee: any) {
    let result = confirm("Êtes-vous sûr de vouloir supprimer " + tournee.nom + " ?");
    if (result) {
      this.deleteTourneeById(tournee.id);
    }
  }

  confirmAssign(id: number){
    let result = confirm("Êtes-vous sûr de vouloir assigner la tournée à ce livreur ?");
    if (result) {
      this.assignerTournee(id);
    }
  }

  confirmRestore(){
    let result = confirm("Êtes-vous sûr de vouloir restaurer l'état de toutes les livraisons ?");
    if (result) {
      this.restaurerLivraisons();
    }
  }
  
}
