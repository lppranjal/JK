// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <header class="app-header">
      <div class="app-logo">JK</div>
      <nav class="app-nav">
        <button routerLink="/signup" class="btn-signup">Sign Up</button>
        <button routerLink="/login" class="btn-login">Login</button>
      </nav>
    </header>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #ddd;
    }
    .app-logo {
      font-size: 24px;
      font-weight: bold;
    }
    .app-nav button {
      margin-left: 10px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }
    .btn-signup {
      background-color: #28a745;
      color: white;
    }
    .btn-signup:hover {
      background-color: #218838;
    }
    .btn-login {
      background-color: #007bff;
      color: white;
    }
    .btn-login:hover {
      background-color: #0069d9;
    }
  `]
})
export class AppComponent {}
