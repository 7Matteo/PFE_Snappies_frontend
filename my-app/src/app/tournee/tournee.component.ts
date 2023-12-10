// tournee.component.ts
import { Component, OnInit } from '@angular/core';
import { LivreurService } from '../services/livreurService/livreur.service';
import { TourneeService } from '../services/tourneeService/tournee.service';

@Component({
  selector: 'app-tournee',
  templateUrl: './tournee.component.html',
  styleUrls: ['./tournee.component.css']
})
export class TourneeComponent implements OnInit {
  livreurs: any[] = [];
  tourneesData: any[] = [];
  selectedTourneeId: number | null = null;
  commandesData: { [tourneeId: number]: any[] } = {};  // Utilisation d'un objet pour stocker les commandes par id_tournee
  selectedLivreurId: { [tourneeId: number]: number } = {};  // Utilisation d'un objet pour stocker les livreurs par id_tournee
  userIsAdmin: boolean = true; 


  constructor( private tourneeService: TourneeService ,private livreurService: LivreurService) { }

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

  loadCommandes(tourneeId: number): void {
    // Chargez les commandes de la tournée spécifique
    this.tourneeService.getCommandesFromTournee(tourneeId).subscribe(
      (commandesData: any) => {
        this.commandesData[tourneeId] = commandesData;  // Stockez les commandes dans la variable
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

  assignerTournee(tourneeId: number): void {
    const livreurId = this.selectedLivreurId[tourneeId];
    console.log(livreurId);
    // Vérifiez si un livreur est sélectionné
    if (livreurId) {
      console.log('Assigner la tournée:', tourneeId, 'à livreur:', livreurId);

      this.tourneeService.assignerTournee(tourneeId, livreurId).subscribe(
        (response: any) => {
          console.log(response);
          // Mettez à jour les données après l'assignation
          this.loadTournees();
          console.log(response);
        },
        (error) => {

          console.error('Erreur lors de l\'assignation de la tournée', error);
        }
      );
    }
  }
  
}
