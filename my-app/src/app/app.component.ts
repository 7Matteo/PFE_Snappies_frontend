import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from './services/token.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'my-app';
  helloWorldMessage: string = '';

  username: string='';
  password: string='';
  loginMessage: string = ''; 
  token: string='';
  isConnected: boolean = false; 
  userRole: string = ''; 
  isAdmin: boolean=false;
  loginMessage2: string = ''; 

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) {}

  ngOnInit() {

    this.token = localStorage.getItem('token') || '';
    this.checkConnectionStatus();
  
    if (this.isConnected) {
      this.loginMessage = "Vous etes connecte "
      }
     
      if (this.isAdmin) {
        this.router.navigate(['/admin_page']); 
      }

    if(this.isAdmin == true){
          this.loginMessage2 = "admin";
    }else {
        this.loginMessage2 = "livreur";
    }
  }

  onSubmit(){
    this.login();

  }

  

  private saveTokenToLocalStorage(token: string) {
    console.log("token saved")

    localStorage.setItem('token', token);
  }
  saveLoginMessageToLocalStorage() {
    const loginMessage = this.loginMessage;
    const username = this.username;
    localStorage.setItem('username', username);

    localStorage.setItem('loginMessage', loginMessage);
    
  }
  private checkConnectionStatus() {
    this.isConnected = !!localStorage.getItem('token');
  }
  private removeTokenFromLocalStorage() {
    console.log("logout user")
    localStorage.removeItem('token');
  }
  getAllCommandes() {
    this.http.get<any[]>('http://localhost:8000/commande/getAll', {
      headers: {
        'Authorization': 'Token ' + this.token 
      }
    })
    .subscribe(
      data => {
        console.log('Réponse du serveur pour get all commandes:', data);
      },
      error => {
        console.error('Erreur lors de la récupération des commandes:', error);
      }
    );
  }
  logout() {
        this.removeTokenFromLocalStorage();
        localStorage.clear();
        this.token='';
        this.isConnected = false;
        /* if (this.isAdmin) {
         
          this.router.navigate(['/']); 
        }
        */
  
  }


login() {
  const credentials = {
    username: this.username,
    password: this.password,
  };

  this.http.post<any>('http://localhost:8000/login/loginUser', credentials)
    .subscribe(
      data => {
        console.log(data.username);
        this.token=data.token;
        this.saveTokenToLocalStorage(this.token);
        this.loginMessage = `Bien connecté en tant que ${data.username} (${data.role}) avec le token ${data.token}`;

        this.userRole = data.role ; 
        this.tokenService.setToken(this.token);
        this.isConnected=true;
        this.saveLoginMessageToLocalStorage();
        this.username=data.username

        if(this.userRole=="admin"){
          this.isAdmin=true;
          this.router.navigate(['/admin_page']); 

        }

        
        console.log(this.token);

        console.log(data);

      },
      error => {
        this.loginMessage = `Erreur de connexion: ${error.error}`;
        console.error('Login Error: ', error.error);
      }
    );
}
}


 /*fetchHelloWorld() {
    this.http.get<any>('http://localhost:8000/commande/helloWorld')
      .subscribe(
        data => {
          console.log('Response from Django API:', data);
          this.helloWorldMessage = data.message; // Mettez la propriété correcte selon la réponse de votre API
        },
        error => {
          console.error('Error fetching data from Django API:', error);
        }
      );
  }
  */