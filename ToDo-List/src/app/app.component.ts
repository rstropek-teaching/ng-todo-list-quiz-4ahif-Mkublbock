import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

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

  displayedColumns = ['id', 'description', 'assignedTo'];

  constructor(private httpClient: HttpClient) {
    this.people = httpClient.get<IPerson[]>('http://localhost:8080/api/people');
    this.todos = httpClient.get<ITodo[]>('http://localhost:8080/api/todos');
  }
}
