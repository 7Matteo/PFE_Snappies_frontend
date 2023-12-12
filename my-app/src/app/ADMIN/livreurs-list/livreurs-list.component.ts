import { Component } from '@angular/core';
import { Livreur } from './livreurs.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-livreurs-list',
  templateUrl: './livreurs-list.component.html',
  styleUrls: ['./livreurs-list.component.css'],
  animations: [
    trigger('visibility', [
      state('visible', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.5)'
      })),
      transition('visible => hidden', [
        animate('0.5s')
      ]),
      transition('hidden => visible', [
        animate('0.5s')
      ]),
    ]),
  ]
})
export class LivreursListComponent {
  livreurForm: FormGroup;
  livreurs: Livreur[] = []; 
  state = 'hidden';

  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: ToastrService) {
    this.livreurForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      is_admin: [false, Validators.required]
    });
}

ngOnInit() {
  this.fetchLivreurs();
  this.state = 'visible';
}

onSubmit() {
  this.state = 'hidden';
    if (this.livreurForm.valid) {
      const newLivreur: Livreur = this.livreurForm.value;
      console.log("ici2", newLivreur);

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Token 0aa1967b91c4c1232cf87c8c6373a035d08255d2'
      });

    this.http.post('http://localhost:8000/login/create', newLivreur, { headers }).subscribe(
      response => {
        this.toastr.success('Livreur créé avec succès');
        this.fetchLivreurs(); // Rechargez la liste des articles après la création
        this.state = 'visible'; // Ajoutez cette ligne
      },
      error => {
        this.toastr.error('Erreur lors de la création de l article');
      }
    );

    this.livreurForm.reset();
  }
}

  fetchLivreurs() {
    const headers = new HttpHeaders({
      'Authorization': 'Token 0aa1967b91c4c1232cf87c8c6373a035d08255d2'
    });

    this.http.get<Livreur[]>('http://localhost:8000/login/getAllLivreurs', { headers }).subscribe(
      (data: Livreur[]) => {
        this.livreurs = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des articles:', error);
      }
    );
  }


  deleteUser(id: number) {
    const url = 'http://localhost:8000/login/delete_user/' + id;
    const options = { headers: new HttpHeaders({ 'Authorization': 'Token 0aa1967b91c4c1232cf87c8c6373a035d08255d2' }) };
    this.http.delete(url, options).subscribe(response => {
      let userToDelete: any = this.livreurs.find((l) => l.id_user == id); 
      let index = this.livreurs.indexOf(userToDelete);
      this.livreurs.splice(index, 1);
      
    });
  }

  confirmDeleteUser(user: any) {
    let result = confirm("Êtes-vous sûr de vouloir supprimer " + user.username + " ?");
    if (result) {
      console.log(user.id_user);
      this.deleteUser(user.id_user);
    }
  }



}
