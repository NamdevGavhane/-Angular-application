import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
  } else {
    if (confirmPassword?.errors?.['passwordMismatch']) {
      confirmPassword.setErrors(null);
    }
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <div class="auth-card">
        <div class="card-header">
          <div class="step-indicator">
            <span class="step-badge">New Account</span>
          </div>
          <h1>Create Account</h1>
          <p>Join thousands of users today</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form" novalidate>

          <div class="form-row">
            <div class="form-group">
              <label>First Name</label>
              <div class="input-wrap">
                <span class="input-icon">👤</span>
                <input type="text" formControlName="firstName" placeholder="John"
                  [class.error]="isInvalid('firstName')">
              </div>
              <span class="error-msg" *ngIf="isInvalid('firstName')">First name is required</span>
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <div class="input-wrap">
                <span class="input-icon">👤</span>
                <input type="text" formControlName="lastName" placeholder="Doe"
                  [class.error]="isInvalid('lastName')">
              </div>
              <span class="error-msg" *ngIf="isInvalid('lastName')">Last name is required</span>
            </div>
          </div>

          <div class="form-group">
            <label>Username</label>
            <div class="input-wrap">
              <span class="input-icon">&#64;</span>
              <input type="text" formControlName="username" placeholder="johndoe"
                [class.error]="isInvalid('username')">
            </div>
            <span class="error-msg" *ngIf="isInvalid('username')">
              Username required (min 3 characters)
            </span>
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrap">
              <span class="input-icon">✉</span>
              <input type="email" formControlName="email" placeholder="john@example.com"
                [class.error]="isInvalid('email')">
            </div>
            <span class="error-msg" *ngIf="isInvalid('email')">Valid email is required</span>
          </div>

          <div class="form-group">
            <label>Phone <span class="optional">(optional)</span></label>
            <div class="input-wrap">
              <span class="input-icon">📱</span>
              <input type="tel" formControlName="phone" placeholder="+1 234 567 8900">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Password</label>
              <div class="input-wrap">
                <span class="input-icon">🔒</span>
                <input [type]="showPassword ? 'text' : 'password'" formControlName="password"
                  placeholder="Min 6 characters" [class.error]="isInvalid('password')">
                <button type="button" class="toggle-pw" (click)="showPassword = !showPassword">
                  {{ showPassword ? '🙈' : '👁' }}
                </button>
              </div>
              <span class="error-msg" *ngIf="isInvalid('password')">Password must be at least 6 characters</span>
            </div>
            <div class="form-group">
              <label>Confirm Password</label>
              <div class="input-wrap">
                <span class="input-icon">🔒</span>
                <input [type]="showPassword ? 'text' : 'password'" formControlName="confirmPassword"
                  placeholder="Repeat password" [class.error]="isInvalid('confirmPassword')">
              </div>
              <span class="error-msg" *ngIf="isInvalid('confirmPassword')">Passwords do not match</span>
            </div>
          </div>

          <div class="form-group">
            <label>Bio <span class="optional">(optional)</span></label>
            <div class="input-wrap textarea-wrap">
              <span class="input-icon">📝</span>
              <textarea formControlName="bio" placeholder="Tell us a bit about yourself..." rows="2"></textarea>
            </div>
          </div>

          <div class="alert alert--error" *ngIf="errorMessage">
            <span>⚠</span> {{ errorMessage }}
          </div>
          <div class="alert alert--success" *ngIf="successMessage">
            <span>✓</span> {{ successMessage }}
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading">
            <span class="btn-spinner" *ngIf="loading"></span>
            <span *ngIf="!loading">Create Account →</span>
            <span *ngIf="loading">Creating account…</span>
          </button>

          <p class="auth-redirect">
            Already have an account? <a routerLink="/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    .auth-page {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0f;
      padding: 2rem 1rem;
      position: relative;
      overflow: hidden;
      font-family: 'DM Sans', sans-serif;
    }
    .auth-bg {
      position: absolute; inset: 0; pointer-events: none;
    }
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.15;
    }
    .orb-1 { width: 500px; height: 500px; background: #8b5cf6; top: -100px; right: -100px; }
    .orb-2 { width: 400px; height: 400px; background: #06b6d4; bottom: -100px; left: -100px; }
    .orb-3 { width: 300px; height: 300px; background: #ec4899; top: 50%; left: 40%; }

    .auth-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 20px;
      padding: 2.5rem;
      width: 100%;
      max-width: 580px;
      backdrop-filter: blur(20px);
      position: relative;
      z-index: 1;
      animation: slideUp 0.5s ease;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card-header { text-align: center; margin-bottom: 2rem; }
    .step-badge {
      background: rgba(139,92,246,0.2);
      color: #a78bfa;
      padding: 0.2rem 0.8rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    h1 {
      font-family: 'Space Mono', monospace;
      font-size: 1.8rem;
      font-weight: 700;
      color: #fff;
      margin: 0.8rem 0 0.3rem;
    }
    p { color: rgba(255,255,255,0.4); font-size: 0.9rem; margin: 0; }

    .auth-form { display: flex; flex-direction: column; gap: 1rem; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    label {
      font-size: 0.82rem;
      font-weight: 600;
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.5px;
    }
    .optional { color: rgba(255,255,255,0.25); font-weight: 400; }

    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 12px;
      font-size: 0.9rem;
      opacity: 0.5;
      pointer-events: none;
    }
    input, textarea {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 0.7rem 0.75rem 0.7rem 2.5rem;
      color: #fff;
      font-size: 0.9rem;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
      outline: none;
      box-sizing: border-box;
      &::placeholder { color: rgba(255,255,255,0.2); }
      &:focus {
        border-color: #8b5cf6;
        background: rgba(139,92,246,0.08);
        box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
      }
      &.error { border-color: #f87171; }
    }
    .textarea-wrap { align-items: flex-start; }
    .textarea-wrap .input-icon { top: 12px; }
    textarea { resize: none; padding-top: 0.7rem; }

    .toggle-pw {
      position: absolute; right: 10px;
      background: none; border: none; cursor: pointer;
      font-size: 0.9rem; padding: 4px;
    }

    .error-msg { color: #f87171; font-size: 0.76rem; }

    .alert {
      padding: 0.7rem 1rem;
      border-radius: 10px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .alert--error { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
    .alert--success { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2); }

    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(139,92,246,0.4); }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }
    .btn-spinner {
      width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .auth-redirect {
      text-align: center;
      color: rgba(255,255,255,0.4);
      font-size: 0.87rem;
      margin: 0;
      a { color: #a78bfa; text-decoration: none; font-weight: 600; &:hover { text-decoration: underline; } }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName:  ['', [Validators.required, Validators.minLength(2)]],
      username:  ['', [Validators.required, Validators.minLength(3)]],
      email:     ['', [Validators.required, Validators.email]],
      phone:     [''],
      password:  ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      bio: ['']
    }, { validators: passwordMatchValidator });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.registerForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerForm.value).subscribe(res => {
      this.loading = false;
      if (res.success) {
        this.successMessage = res.message;
        setTimeout(() => this.router.navigate(['/profile']), 1000);
      } else {
        this.errorMessage = res.message;
      }
    });
  }
}
