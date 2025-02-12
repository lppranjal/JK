// src/app/signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="signup-container">
      <h2>Sign Up</h2>
      <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
        <!-- Account Type Section -->
        <div class="form-group">
          <label>Account Type:</label>
          <div class="radio-group">
            <label>
              <input type="radio" formControlName="accountType" value="User" /> User
            </label>
            <label>
              <input type="radio" formControlName="accountType" value="Host/Service" /> Host/Service
            </label>
          </div>
          <div class="error" *ngIf="signupForm.get('accountType')?.touched && signupForm.get('accountType')?.invalid">
            Please select an account type.
          </div>
        </div>

        <!-- Conditional Fields for User Account -->
        <div *ngIf="isUserSelected">
          <div class="form-group">
            <label for="fullName">Full Name:</label>
            <input
              id="fullName"
              type="text"
              formControlName="fullName"
              placeholder="Enter your full name" />
            <div class="error" *ngIf="signupForm.get('fullName')?.touched && signupForm.get('fullName')?.hasError('required')">
              Full Name is required.
            </div>
          </div>          
        </div>

        <!-- Conditional Fields for Host/Service Account -->
        <div *ngIf="isHostSelected">
          <div class="form-group">
            <label>Service Type:</label>
            <div class="radio-group">
              <label>
                <input type="radio" formControlName="serviceType" value="Shop" /> Shop
              </label>
              <label>
                <input type="radio" formControlName="serviceType" value="School/Tuition" /> School/Tuition
              </label>
            </div>
            <div class="error" *ngIf="signupForm.get('serviceType')?.touched && signupForm.get('serviceType')?.invalid">
              Please select a service type.
            </div>
          </div>
          <div class="form-group">
            <label for="serviceName">Service Name:</label>
            <input
              id="serviceName"
              type="text"
              formControlName="serviceName"
              placeholder="Enter your service name" />
            <div class="error" *ngIf="signupForm.get('serviceName')?.touched && signupForm.get('serviceName')?.hasError('required')">
              Service Name is required.
            </div>
          </div>
        </div>

        <!-- Common Fields -->
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            placeholder="Enter your email" required />
          <div class="error" *ngIf="signupForm.get('email')?.touched && signupForm.get('email')?.invalid">
            <div *ngIf="signupForm.get('email')?.hasError('required')">Email is required.</div>
            <div *ngIf="signupForm.get('email')?.hasError('email')">Invalid email address.</div>
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="Enter your password" required />
          <div class="error" *ngIf="signupForm.get('password')?.touched && signupForm.get('password')?.invalid">
            <div *ngIf="signupForm.get('password')?.hasError('required')">Password is required.</div>
            <div *ngIf="signupForm.get('password')?.hasError('minlength')">
              Password must be at least 6 characters long.
            </div>
          </div>
        </div>

        <button type="submit" [disabled]="signupForm.invalid">Sign Up</button>
      </form>
    </div>
  `,
  styles: [`
    .signup-container {
      max-width: 500px;
      margin: 40px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      background-color: #fff;
    }
    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    .radio-group {
      display: flex;
      gap: 15px;
    }
    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    input[type="radio"] {
      margin-right: 5px;
    }
    .error {
      color: red;
      font-size: 12px;
      margin-top: 5px;
    }
    button {
      width: 100%;
      padding: 10px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    button:disabled {
      background-color: #ccc;
    }
    button:hover:not(:disabled) {
      background-color: #218838;
    }
  `]
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Initialize the form with all controls
    this.signupForm = this.fb.group({
      accountType: ['', Validators.required],
      // Fields for User account
      fullName: [''],
      // Fields for Host/Service account
      serviceType: [''],
      serviceName: [''],
      // Common fields
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Set conditional validators based on the selected account type.
    this.signupForm.get('accountType')?.valueChanges.subscribe(value => {
      if (value === 'User') {
        // Require user fields
        this.signupForm.get('fullName')?.setValidators([Validators.required]);
        // Clear host/service validators
        this.signupForm.get('serviceType')?.clearValidators();
        this.signupForm.get('serviceName')?.clearValidators();
      } else if (value === 'Host/Service') {
        // Require host/service fields
        this.signupForm.get('serviceType')?.setValidators([Validators.required]);
        this.signupForm.get('serviceName')?.setValidators([Validators.required]);
        // Clear user validators
        this.signupForm.get('fullName')?.clearValidators();
      }
      // Update validity after changing validators.
      this.signupForm.get('fullName')?.updateValueAndValidity();
      this.signupForm.get('serviceType')?.updateValueAndValidity();
      this.signupForm.get('serviceName')?.updateValueAndValidity();
    });
  }

  // Helper getters for dynamic form sections.
  get isUserSelected() {
    return this.signupForm.get('accountType')?.value === 'User';
  }

  get isHostSelected() {
    return this.signupForm.get('accountType')?.value === 'Host/Service';
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.http.post('http://localhost:5000/api/account/register', this.signupForm.value)
        .subscribe({
          next: () => {
            alert('Registration successful!');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error(err);
            alert('Registration failed. Please try again.');
          }
        });
    }
  }
}
