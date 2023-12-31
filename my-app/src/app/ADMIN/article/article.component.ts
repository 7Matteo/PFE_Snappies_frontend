import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Article } from './article.model';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environement/environement';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
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

export class ArticleComponent implements OnInit {
  articleForm: FormGroup;
  articles: Article[] = []; 
  state = 'hidden';

  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: ToastrService, private tokenService : TokenService) {
    this.articleForm = this.fb.group({
      nom: ['', Validators.required],
      type: ['', Validators.required],
      nbr_articles: [0, Validators.required], // Ajoutez ce champ
    });

  this.articleForm.get('type')?.valueChanges.subscribe(value => {
    if (value === 'U') {
      this.articleForm.patchValue({ nbr_articles: 0 });
    } else if (value === 'C') {
      this.articleForm.patchValue({ nbr_articles: this.articleForm.get('quantity')?.value });
    }
  });
}

ngOnInit() {
  this.fetchArticles();
  this.state = 'visible';
}

onSubmit() {
  this.state = 'hidden';
    if (this.articleForm.valid) {
      const newArticle: Article = this.articleForm.value;
      console.log("ici", newArticle);
      
      const token = this.tokenService.getToken();
      console.log(token);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      });

    this.http.post(`${environment.apiUrl}/articles/create_article`, newArticle, { headers }).subscribe(
      response => {
        this.toastr.success('Article créé avec succès', 'Succès', {
          positionClass: 'md-toast-top-full-width',
          progressBar: true,
          closeButton: true,
          timeOut: 2000,
          extendedTimeOut: 1000,
          easeTime: 500,

        });
        this.fetchArticles(); // Rechargez la liste des articles après la création
        this.state = 'visible'; // Ajoutez cette ligne
      },
      error => {
        this.toastr.error("Erreur lors de la création de l' article", 'Erreur', {
          positionClass: 'md-toast-top-full-width',
          progressBar: true,
          closeButton: true,
          timeOut: 2000,
          extendedTimeOut: 1000,
          easeTime: 500,
        });
      }
    );

    this.articleForm.reset();
  }
}

confirmAdd() {
  let result = confirm("Voulez-vous vraiment ajouter cet article à votre inventaire ?");
  if (result) {
    this.onSubmit();
  }
}

  fetchArticles() {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    this.http.get<Article[]>(`${environment.apiUrl}/articles/get_all_articles`, { headers }).subscribe(
      (data: Article[]) => {
        this.articles = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des articles:', error);
      }
    );
  }


  deleteArticle(id: number) {
    const url = `${environment.apiUrl}/articles/delete_article/` + id;
    const token = this.tokenService.getToken();
    const options = { headers: new HttpHeaders({ 'Authorization': `Token ${token}` }) };
    this.http.delete(url, options).subscribe(response => {
      let articleToDelete: any = this.articles.find(a => a.article == id); // Utilisez la syntaxe correcte pour la fonction fléchée
      // Mettez à jour le tableau articles en filtrant l'élément supprimé
      this.articles = this.articles.filter(a => a !== articleToDelete);
      
    });
  }

  confirmDelete(article: any) {
    let result = confirm("Êtes-vous sûr de vouloir supprimer " + article.nom + " de votre inventaire ?");
    if (result) {
      this.deleteArticle(article.article);
    }
  }

}