import { Component, OnInit  } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-create-command-form',
  templateUrl: './create-command-form.component.html',
  styleUrls: ['./create-command-form.component.css'],
})
export class CreateCommandFormComponent {
  isConnected: any;
  commandForm = new FormGroup({
    client: new FormControl('', Validators.required),
    tournee: new FormControl('', Validators.required),
  }) as FormGroup;
  public nbSelects : any[] = [{type : "select"}]
  public articles: any[] = [{name : "pas de données"}];
  public tournees: any[] = [{name : "pas de données"}];
  public clients: any[] = [{name : "pas de données"}];
  constructor(private http: HttpClient, private tokenService: TokenService) { }

  

  ajouter1SelectArticle(): void {
    this.commandForm.addControl(`article${this.nbSelects.length}`, new FormControl('', Validators.required));
    this.commandForm.addControl(`nbArticles${this.nbSelects.length}`, new FormControl('', Validators.required));
    this.nbSelects.push({type : "select"});
    
    console.log(this.nbSelects.length);
    
  }

  enlever1SelectArticle(): void {
    if(this.nbSelects.length>1){
      this.nbSelects.pop();
      this.commandForm.removeControl(`article${this.nbSelects.length}`)
      this.commandForm.removeControl(`nbArticles${this.nbSelects.length}`);
    }
    console.log(this.nbSelects.length);
    
  }
  ngOnInit(): void {
    this.commandForm.addControl(`article0`, new FormControl('', Validators.required));
    this.commandForm.addControl(`nbArticles0`, new FormControl('', Validators.required));
    this.getArticles();
    this.getClients();
    this.getTournees();
    this.tokenService.isConnected$.subscribe(newValue => {
      this.isConnected = newValue;
    });
  }

  getArticles(): void {
    const token = this.tokenService.getToken();
    const apiUrl = 'http://localhost:8000/articles/get_all_articles';

    this.http.get<any[]>(apiUrl, {
      headers: {
        'Authorization': 'Token ' + token 
      }
    })
      .subscribe(
        (data) => {
          this.articles = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des articles : ', error);
        }
      );
  }

  getTournees(): void {
    const token = this.tokenService.getToken();
    const apiUrl = 'http://localhost:8000/tournee/get_all_tournee';

    this.http.get<any[]>(apiUrl, {
      headers: {
        'Authorization': 'Token ' + token 
      }
    })
      .subscribe(
        (data) => {
          this.tournees = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des tournées : ', error);
        }
      );
  }

  getClients(): void {
    const token = this.tokenService.getToken();
    const apiUrl = 'http://localhost:8000/client/get_all_clients_free';

    this.http.get<any[]>(apiUrl, {
      headers: {
        'Authorization': 'Token ' + token 
      }
    })
      .subscribe(
        (data) => {
          this.clients = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des clients : ', error);
        }
      );
  }
  
  onSubmit() {
    const token = this.tokenService.getToken();
    
    if (true) {

      let tabArticles = [];

      for (let i = 0; i < this.nbSelects.length; i++) {
        const articleObj = JSON.parse(this.commandForm.value[`article${i}`]);
        if(articleObj.type == 'C'){
          tabArticles.push({id_article: articleObj.article, nbr_caisses: this.commandForm.value[`nbArticles${i}`], unite: 0});
        }else{
          tabArticles.push({id_article: articleObj.article, nbr_caisses: 0 , unite: this.commandForm.value[`nbArticles${i}`]});
        }
        
        
      }

      const formData = {
        id_client: this.commandForm.value.client,
        articles: tabArticles,
        id_tournee: this.commandForm.value.tournee,
      };

      console.log(formData);
      

      const apiUrl = 'http://localhost:8000/commande/create_commande';

      this.http.post(apiUrl, formData,{
        headers: {
          'Authorization': 'Token ' + token, 
          'Content-Type': 'application/json'
        }
        
      })
        .subscribe(
          (response) => {
            console.log('Réponse de l\'API:', response);
          },
          (error) => {
            console.error('Erreur lors de la soumission du formulaire : ', error);
          }
        );
    }else{
      
    }
    
  }
}
