import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
      </div>

      <div class="auth-card">
        <div class="card-header">
          <div class="logo-ring">
            <span>◈</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form" novalidate>

          <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrap">
              <span class="input-icon">✉</span>
              <input type="email" formControlName="email"
                placeholder="john@example.com"
                [class.error]="isInvalid('email')">
            </div>
            <span class="error-msg" *ngIf="isInvalid('email')">Please enter a valid email</span>
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="Your password"
                [class.error]="isInvalid('password')">
              <button type="button" class="toggle-pw" (click)="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁' }}
              </button>
            </div>
            <span class="error-msg" *ngIf="isInvalid('password')">Password is required</span>
          </div>

          <div class="alert alert--error" *ngIf="errorMessage">
            <span>⚠</span> {{ errorMessage }}
          </div>
          <div class="alert alert--success" *ngIf="successMessage">
            <span>✓</span> {{ successMessage }}
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading">
            <span class="btn-spinner" *ngIf="loading"></span>
            <span *ngIf="!loading">Sign In →</span>
            <span *ngIf="loading">Signing in…</span>
          </button>

          <div class="divider"><span>or</span></div>

          <p class="auth-redirect">
            Don't have an account? <a routerLink="/register">Create one</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    .auth-page {
      min-height: calc(100vh - 70px);
      display: flex; align-items: center; justify-content: center;
      background: #0a0a0f;
      padding: 2rem 1rem;
      position: relative; overflow: hidden;
      font-family: 'DM Sans', sans-serif;
    }
    .auth-bg { position: absolute; inset: 0; pointer-events: none; }
    .orb {
      position: absolute; border-radius: 50%;
      filter: blur(90px); opacity: 0.12;
    }
    .orb-1 { width: 600px; height: 600px; background: #8b5cf6; top: -200px; left: -100px; }
    .orb-2 { width: 400px; height: 400px; background: #06b6d4; bottom: -100px; right: -100px; }

    .auth-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 24px;
      padding: 3rem 2.5rem;
      width: 100%; max-width: 420px;
      backdrop-filter: blur(20px);
      position: relative; z-index: 1;
      animation: slideUp 0.5s ease;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card-header { text-align: center; margin-bottom: 2.5rem; }
    .logo-ring {
      width: 64px; height: 64px;
      border: 2px solid #8b5cf6;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.2rem;
      font-size: 1.5rem;
      background: rgba(139,92,246,0.1);
      animation: glow 2s ease-in-out infinite;
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 10px rgba(139,92,246,0.3); }
      50% { box-shadow: 0 0 25px rgba(139,92,246,0.6); }
    }
    h1 {
      font-family: 'Space Mono', monospace;
      font-size: 1.8rem; font-weight: 700;
      color: #fff; margin: 0 0 0.3rem;
    }
    p { color: rgba(255,255,255,0.4); font-size: 0.9rem; margin: 0; }

    .auth-form { display: flex; flex-direction: column; gap: 1.2rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    label {
      font-size: 0.82rem; font-weight: 600;
      color: rgba(255,255,255,0.6); letter-spacing: 0.5px;
    }
    .input-wrap { position: relative; display: flex; align-items: center; }
    .input-icon {
      position: absolute; left: 12px;
      font-size: 0.9rem; opacity: 0.5; pointer-events: none;
    }
    input {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 0.8rem 0.75rem 0.8rem 2.5rem;
      color: #fff; font-size: 0.9rem;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s; outline: none;
      box-sizing: border-box;
      &::placeholder { color: rgba(255,255,255,0.2); }
      &:focus {
        border-color: #8b5cf6;
        background: rgba(139,92,246,0.08);
        box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
      }
      &.error { border-color: #f87171; }
    }
    .toggle-pw {
      position: absolute; right: 10px;
      background: none; border: none; cursor: pointer;
      font-size: 0.9rem; padding: 4px;
    }
    .error-msg { color: #f87171; font-size: 0.76rem; }

    .alert {
      padding: 0.7rem 1rem; border-radius: 10px;
      font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;
    }
    .alert--error { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
    .alert--success { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2); }

    .btn-submit {
      width: 100%; padding: 0.9rem;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      border: none; border-radius: 10px;
      color: #fff; font-size: 1rem; font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(139,92,246,0.4); }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }
    .btn-spinner {
      width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .divider {
      display: flex; align-items: center; gap: 1rem;
      &::before, &::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
      span { color: rgba(255,255,255,0.3); font-size: 0.8rem; }
    }
    .auth-redirect {
      text-align: center; color: rgba(255,255,255,0.4); font-size: 0.87rem; margin: 0;
      a { color: #a78bfa; text-decoration: none; font-weight: 600; &:hover { text-decoration: underline; } }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginForm.value).subscribe(res => {
      this.loading = false;
      if (res.success) {
        this.successMessage = res.message;
        setTimeout(() => this.router.navigate(['/profile']), 800);
      } else {
        this.errorMessage = res.message;
      }
    });
  }
}
