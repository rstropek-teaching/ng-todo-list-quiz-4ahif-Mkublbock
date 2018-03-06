import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

interface IPerson {
  name: string;
}

interface ITodo {
  id: number;
  description: string;
  assignedTo: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public people: Observable<IPerson[]>;
  public todos: Observable<ITodo[]>;
  public API_URL = 'http://localhost:8080/api';


  constructor(private httpClient: HttpClient) {
    this.getItems();
  }

  showUndone() {
    this.todos = this.httpClient.get<ITodo[]>(this.API_URL + '/todos').
    map(todo => todo.filter(element => element.done === false || element.done == null));
  }

  getItems() {
    this.todos = this.httpClient.get<ITodo[]>(this.API_URL + '/todos');
  }
}


