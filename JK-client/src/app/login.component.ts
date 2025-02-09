// src/app/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="submit()">
        <div>
          <label>Email:</label>
          <input type="email" formControlName="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" formControlName="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  `,
  styles: [`
    .login-container { max-width: 300px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; }
    form div { margin-bottom: 10px; }
    label { display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 8px; }
    button { width: 100%; padding: 8px; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    // Initialize the form in the constructor.
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  submit() {
    // Safely extract values from the form controls.
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    if (email && password) {
      this.auth.login(email, password).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Login failed', err)
      });
    } else {
      console.error("Email or password missing");
    }
  }
}
