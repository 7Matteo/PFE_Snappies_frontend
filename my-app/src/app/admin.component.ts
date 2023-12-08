import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './services/token.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  allCommandes: any[] = [];

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  ngOnInit() {
    console.log("tu es sur le admin page");
    this.getAllCommandes();
  }

  getAllCommandes() {
    const token = this.tokenService.getToken();

    this.http.get<any[]>('http://localhost:8000/commande/getAll', {
      headers: {
        'Authorization': 'Token ' + token 
      }
    })
    .subscribe(
      data => {
        this.allCommandes = data;
        console.log('Réponse du serveur pour get all commandes:', data);
      },
      error => {
        console.error('Erreur lors de la récupération des commandes:', error);
      }
    );
  }
}
