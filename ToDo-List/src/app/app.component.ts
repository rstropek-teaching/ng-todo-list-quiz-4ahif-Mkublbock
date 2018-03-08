import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';


interface IPerson {
  name: string;
}

interface ITodo {
  id: number;
  description: string;
  assignedTo?: string;
  done?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  displayedColumns = ['todoID', 'description', 'assignedTo', 'done', 'edit', 'delete'];
  public people: Observable<IPerson[]>;
  public todos: Observable<ITodo[]>;
  showUndone = false;
  showMine = false;
  public API_URL = 'http://localhost:8080/api';
  currentUser;
  showForm = false; showEditForm = false;
  description; assignedTo; id;

  constructor(private httpClient: HttpClient, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/delete.svg'));
    iconRegistry.addSvgIcon(
      'edit',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/edit.svg'));
    this.getItems();
    this.getPeople();
  }

  toggleItems() {
    console.log(this.currentUser + '\t' + this.showMine + '\t' + this.showUndone);
    if (this.showMine && this.showUndone === false) {
      this.todos = this.httpClient.get<ITodo[]>(this.API_URL + '/todos').
        map(todo => todo.filter(element => element.assignedTo === this.currentUser));
    } else if (this.showMine === false && this.showUndone) {
      this.todos = this.httpClient.get<ITodo[]>(this.API_URL + '/todos').
        map(todo => todo.filter(element => element.done === false || element.done == null));
    } else if (this.showMine && this.showUndone) {
      this.todos = this.httpClient.get<ITodo[]>(this.API_URL + '/todos').
        map(todo => todo.filter(element => element.done === false || element.done == null && element.assignedTo === this.currentUser));
    } else if (!this.showMine && !this.showUndone) {
      this.getItems();
    }

  }

  enableForm() {
    this.showForm = true;
  }

  enableEditForm(description, assignedTo, id) {
    this.showEditForm = true;
    this.description = description;
    this.assignedTo = assignedTo;
    this.id = id;
  }

  editItem(newDescription, newAssignedTo) {
    console.log('Edit-Button clicked' + '\t' + this.id + '\t' + newDescription + '\t' + newAssignedTo);
    this.httpClient.patch<ITodo>(this.API_URL + '/todos/' + this.id, {
      'description': newDescription,
      'assignedTo': newAssignedTo
    }).subscribe(
      (val) => {
        console.log('Edit successful');
        this.refreshList();
      });
    this.showEditForm = false;
  }

  getItems() {
    this.todos = this.httpClient.get<ITodo[]>(this.API_URL + '/todos');
  }
  getPeople() {
    this.people = this.httpClient.get<IPerson[]>(this.API_URL + '/people');
  }

  refreshList() {
    this.getItems(); this.getPeople();
    this.showMine = false;
    this.showUndone = false;
  }

  reset() {
    this.getItems(); this.getPeople();
    this.showMine = false;
    this.showUndone = false;
    this.currentUser = null;
  }

  addTodoItem(todoDescription, todoAssignedTo, id) {
    this.httpClient.post<ITodo>(this.API_URL + '/todos', {
      'description': todoDescription,
      'assignedTo': todoAssignedTo
    }).subscribe(
      (val) => {
        console.log('Post successful');
        this.refreshList();
      });
    this.showForm = false;
  }

  goToTop() {
    console.log('scrolled');
    window.scroll(0, 0);
  }

  toggleDone(checkbox, id) {
    if (checkbox.checked) {
      this.httpClient.patch(this.API_URL + '/todos/' + id, {
        'done': true,
      }).subscribe(
        (val) => {
          console.log('Patch call successful', val);
        },
        response => {
          console.log('Patch call error', response);
        },
      );

    } else if (!checkbox.checked) {
      this.httpClient.patch(this.API_URL + '/todos/' + id, {
        'done': false,
      }).subscribe(
        (val) => {
          console.log('Patch call successful', val);
        },
        response => {
          console.log('Patch call error', response);
        },
      );

    }
  }

  deleteItem(id) {
    console.log(id);
    this.httpClient.delete(this.API_URL + '/todos/' + id).subscribe((val) => {
      console.log('Delete succeeded', val);
      this.refreshList();
    });

  }


}
