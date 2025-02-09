// src/app/search.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface ServiceProvider {
  id: number;
  name: string;
  serviceType: string;
  // Add other properties as needed.
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="search-container">
      <input
        type="text"
        [formControl]="searchControl"
        placeholder="Search for Shops, Schools, or Tuition Centres" />
      <ul *ngIf="results$ | async as results" class="suggestions">
        <li *ngFor="let item of results" (click)="selectItem(item)">
          {{ item.name }} ({{ item.serviceType }})
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .search-container { position: relative; width: 300px; margin: 20px auto; }
    input { width: 100%; padding: 8px; }
    .suggestions {
      list-style: none;
      margin: 0;
      padding: 0;
      position: absolute;
      width: 100%;
      background: white;
      border: 1px solid #ccc;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
    }
    .suggestions li {
      padding: 8px;
      cursor: pointer;
    }
    .suggestions li:hover {
      background: #f0f0f0;
    }
  `]
})
export class SearchComponent {
  searchControl = new FormControl('');
  results$: Observable<ServiceProvider[]>;

  constructor(private http: HttpClient, private router: Router) {
    this.results$ = this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => this.search(query || ''))
      );
  }

  search(query: string): Observable<ServiceProvider[]> {
    if (!query) {
      return new Observable<ServiceProvider[]>(subscriber => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
    // Replace with your actual search API endpoint
    return this.http.get<ServiceProvider[]>(`http://localhost:5229/api/search?query=${encodeURIComponent(query)}`);
  }

  selectItem(item: ServiceProvider) {
    // Navigate to the dynamic route for the selected host/service.
    // For example: /service/123 (where 123 is the provider id)
    this.router.navigate(['/service', item.id]);
  }
}
