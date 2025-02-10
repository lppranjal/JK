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
      <div class="search-bar">
        <input
          type="text"
          [formControl]="searchControl"
          placeholder="Search for Shops, Schools, or Tuition Centres"
          class="search-input"
        />
        <button class="search-button" (click)="performSearch()">Search</button>
      </div>
      <!-- Use an ng-container to unwrap the async pipe and then conditionally display the list -->
      <ng-container *ngIf="results$ | async as results">
        <ul *ngIf="results.length > 0" class="suggestions">
          <li *ngFor="let item of results" (click)="selectItem(item)">
            <div class="suggestion-content">
              <span class="suggestion-name">{{ item.name }}</span>
              <span class="suggestion-type">({{ item.serviceType }})</span>
            </div>
          </li>
        </ul>
      </ng-container>
    </div>
  `,
  styles: [`
    /* Container centers the search area and adds padding */
    .search-container {
      margin: 20px auto;
      max-width: 600px;
      padding: 0 15px;
      box-sizing: border-box;
    }

    /* Search bar styling: flex layout for input and button */
    .search-bar {
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .search-input {
      flex: 1;
      padding: 12px 16px;
      border: none;
      outline: none;
      font-size: 16px;
    }
    .search-button {
      padding: 12px 16px;
      border: none;
      background-color: #007bff;
      color: #fff;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
    .search-button:hover {
      background-color: #0056b3;
    }

    /* Suggestions list styling */
    .suggestions {
      list-style: none;
      margin: 0;
      padding: 0;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 4px 4px;
      max-height: 300px;
      overflow-y: auto;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .suggestions li {
      padding: 10px 16px;
      cursor: pointer;
      transition: background 0.3s;
    }
    .suggestions li:hover {
      background: #f8f9fa;
    }
    .suggestion-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .suggestion-name {
      font-weight: 500;
      font-size: 16px;
      color: #333;
    }
    .suggestion-type {
      font-size: 14px;
      color: #777;
    }

    /* Responsive adjustments for smaller screens */
    @media (max-width: 768px) {
      .search-input {
        font-size: 14px;
        padding: 10px 14px;
      }
      .search-button {
        font-size: 14px;
        padding: 10px 14px;
      }
      .suggestion-name {
        font-size: 14px;
      }
      .suggestion-type {
        font-size: 12px;
      }
    }
  `]
})
export class SearchComponent {
  searchControl = new FormControl('');
  results$: Observable<ServiceProvider[]>;

  constructor(private http: HttpClient, private router: Router) {
    // Listen for value changes on the search input and perform a debounced search.
    this.results$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.search(query || ''))
    );
  }

  // Call the API to search for providers by name or description.
  search(query: string): Observable<ServiceProvider[]> {
    if (!query) {
      return new Observable<ServiceProvider[]>(subscriber => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
    return this.http.get<ServiceProvider[]>(
      `http://localhost:5229/api/search?query=${encodeURIComponent(query)}`
    );
  }

  // Navigate to a detailed view for the selected provider.
  selectItem(item: ServiceProvider) {
    this.router.navigate(['/service', item.id]);
  }

  // Optional: Trigger search manually (if needed).
  performSearch() {
    // This method can be used to trigger search on button click if required.
  }
}
