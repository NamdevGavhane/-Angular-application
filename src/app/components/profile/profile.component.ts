import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-page">
      <div class="profile-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
      </div>

      <div class="profile-layout" *ngIf="user">

        <!-- Sidebar -->
        <aside class="profile-sidebar">
          <div class="avatar-section">
            <div class="avatar-ring">
              <img [src]="user.avatar" [alt]="user.firstName" class="avatar-img">
              <div class="avatar-status"></div>
            </div>
            <h2>{{ user.firstName }} {{ user.lastName }}</h2>
            <span class="username-tag">&#64;{{ user.username }}</span>
            <p class="user-bio" *ngIf="user.bio">{{ user.bio }}</p>
          </div>

          <div class="info-cards">
            <div class="info-card">
              <span class="info-label">✉ Email</span>
              <span class="info-value">{{ user.email }}</span>
            </div>
            <div class="info-card" *ngIf="user.phone">
              <span class="info-label">📱 Phone</span>
              <span class="info-value">{{ user.phone }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">📅 Member Since</span>
              <span class="info-value">{{ user.createdAt | date:'mediumDate' }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">🆔 User ID</span>
              <span class="info-value id-value">{{ user.id }}</span>
            </div>
          </div>

          <button class="btn-logout" (click)="logout()">
            Sign Out
          </button>
        </aside>

        <!-- Main -->
        <main class="profile-main">
          <div class="section-header">
            <h3>Edit Profile</h3>
            <p>Update your personal information</p>
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="onUpdate()" class="profile-form" novalidate>

            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <div class="input-wrap">
                  <input type="text" formControlName="firstName"
                    [class.error]="isInvalid('firstName')">
                </div>
                <span class="error-msg" *ngIf="isInvalid('firstName')">Required</span>
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <div class="input-wrap">
                  <input type="text" formControlName="lastName"
                    [class.error]="isInvalid('lastName')">
                </div>
                <span class="error-msg" *ngIf="isInvalid('lastName')">Required</span>
              </div>
            </div>

            <div class="form-group">
              <label>Username</label>
              <div class="input-wrap prefix-wrap">
                <span class="prefix">&#64;</span>
                <input type="text" formControlName="username"
                  [class.error]="isInvalid('username')">
              </div>
              <span class="error-msg" *ngIf="isInvalid('username')">Required (min 3 chars)</span>
            </div>

            <div class="form-group">
              <label>Email Address</label>
              <div class="input-wrap">
                <input type="email" formControlName="email"
                  [class.error]="isInvalid('email')">
              </div>
              <span class="error-msg" *ngIf="isInvalid('email')">Valid email required</span>
            </div>

            <div class="form-group">
              <label>Phone <span class="optional">(optional)</span></label>
              <input type="tel" formControlName="phone">
            </div>

            <div class="form-group">
              <label>Bio <span class="optional">(optional)</span></label>
              <textarea formControlName="bio" rows="3" placeholder="Write something about yourself…"></textarea>
            </div>

            <div class="alert alert--error" *ngIf="errorMessage">
              <span>⚠</span> {{ errorMessage }}
            </div>
            <div class="alert alert--success" *ngIf="successMessage">
              <span>✓</span> {{ successMessage }}
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" (click)="resetForm()">Reset</button>
              <button type="submit" class="btn-save" [disabled]="loading || profileForm.pristine">
                <span class="btn-spinner" *ngIf="loading"></span>
                <span *ngIf="!loading">Save Changes</span>
                <span *ngIf="loading">Saving…</span>
              </button>
            </div>
          </form>

          <!-- Stats Row -->
          <div class="stats-row">
            <div class="stat-card">
              <span class="stat-icon">🎯</span>
              <span class="stat-number">1</span>
              <span class="stat-label">Active Session</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">🔐</span>
              <span class="stat-number">Secure</span>
              <span class="stat-label">Account Status</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">✅</span>
              <span class="stat-number">Verified</span>
              <span class="stat-label">Email Status</span>
            </div>
          </div>
        </main>

      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    .profile-page {
      min-height: calc(100vh - 70px);
      background: #0a0a0f;
      padding: 2rem;
      position: relative; overflow: hidden;
      font-family: 'DM Sans', sans-serif;
    }
    .profile-bg { position: absolute; inset: 0; pointer-events: none; }
    .orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.1; }
    .orb-1 { width: 500px; height: 500px; background: #7c3aed; top: 0; right: 0; }
    .orb-2 { width: 400px; height: 400px; background: #0891b2; bottom: 0; left: 0; }

    .profile-layout {
      max-width: 1100px; margin: 0 auto;
      display: grid; grid-template-columns: 300px 1fr; gap: 2rem;
      position: relative; z-index: 1;
      animation: fadeIn 0.5s ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

    /* Sidebar */
    .profile-sidebar {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 20px; padding: 2rem;
      display: flex; flex-direction: column; gap: 1.5rem;
      height: fit-content;
    }
    .avatar-section { text-align: center; }
    .avatar-ring {
      position: relative; width: 100px; height: 100px; margin: 0 auto 1rem;
    }
    .avatar-img {
      width: 100%; height: 100%; border-radius: 50%;
      border: 3px solid #8b5cf6;
      object-fit: cover;
    }
    .avatar-status {
      position: absolute; bottom: 4px; right: 4px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #34d399; border: 3px solid #0a0a0f;
    }
    h2 {
      font-family: 'Space Mono', monospace;
      font-size: 1.2rem; color: #fff; margin: 0 0 0.3rem;
    }
    .username-tag {
      display: inline-block; padding: 0.2rem 0.6rem;
      background: rgba(139,92,246,0.2); color: #a78bfa;
      border-radius: 20px; font-size: 0.78rem; font-weight: 600;
    }
    .user-bio {
      margin: 0.8rem 0 0; color: rgba(255,255,255,0.4);
      font-size: 0.85rem; line-height: 1.5;
    }

    .info-cards { display: flex; flex-direction: column; gap: 0.6rem; }
    .info-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px; padding: 0.7rem 0.9rem;
      display: flex; flex-direction: column; gap: 0.15rem;
    }
    .info-label { font-size: 0.72rem; color: rgba(255,255,255,0.35); font-weight: 600; letter-spacing: 0.3px; }
    .info-value { font-size: 0.85rem; color: rgba(255,255,255,0.8); word-break: break-all; }
    .id-value { font-family: 'Space Mono', monospace; font-size: 0.72rem; color: rgba(139,92,246,0.8); }

    .btn-logout {
      width: 100%; padding: 0.7rem;
      background: rgba(248,113,113,0.1);
      border: 1px solid rgba(248,113,113,0.2);
      border-radius: 10px; color: #f87171;
      font-size: 0.9rem; font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer; transition: all 0.2s;
      &:hover { background: rgba(248,113,113,0.2); }
    }

    /* Main */
    .profile-main {
      display: flex; flex-direction: column; gap: 1.5rem;
    }
    .section-header { margin-bottom: 0.5rem; }
    .section-header h3 {
      font-family: 'Space Mono', monospace;
      font-size: 1.4rem; color: #fff; margin: 0 0 0.3rem;
    }
    .section-header p { color: rgba(255,255,255,0.35); font-size: 0.87rem; margin: 0; }

    .profile-form {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(139,92,246,0.15);
      border-radius: 20px; padding: 2rem;
      display: flex; flex-direction: column; gap: 1.2rem;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    label { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.6); }
    .optional { color: rgba(255,255,255,0.25); font-weight: 400; }

    .input-wrap { position: relative; }
    .prefix-wrap { display: flex; align-items: center; }
    .prefix {
      position: absolute; left: 12px;
      color: rgba(139,92,246,0.7); font-weight: 700; font-size: 1rem;
    }
    input, textarea {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 0.75rem 0.9rem;
      color: #fff; font-size: 0.9rem;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s; outline: none; box-sizing: border-box;
      &::placeholder { color: rgba(255,255,255,0.2); }
      &:focus {
        border-color: #8b5cf6;
        background: rgba(139,92,246,0.08);
        box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
      }
      &.error { border-color: #f87171; }
    }
    .prefix-wrap input { padding-left: 1.8rem; }
    textarea { resize: none; }
    .error-msg { color: #f87171; font-size: 0.76rem; }

    .alert {
      padding: 0.7rem 1rem; border-radius: 10px;
      font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;
    }
    .alert--error { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
    .alert--success { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2); }

    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .btn-cancel {
      padding: 0.7rem 1.5rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; color: rgba(255,255,255,0.6);
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
      cursor: pointer; transition: all 0.2s;
      &:hover { background: rgba(255,255,255,0.1); color: #fff; }
    }
    .btn-save {
      padding: 0.7rem 1.8rem;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      border: none; border-radius: 10px;
      color: #fff; font-size: 0.9rem; font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; gap: 0.5rem;
      &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(139,92,246,0.4); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
    .btn-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Stats */
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .stat-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(139,92,246,0.15);
      border-radius: 14px; padding: 1.2rem;
      display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
      text-align: center; transition: all 0.2s;
      &:hover { border-color: rgba(139,92,246,0.4); background: rgba(139,92,246,0.05); }
    }
    .stat-icon { font-size: 1.5rem; }
    .stat-number {
      font-family: 'Space Mono', monospace;
      font-size: 1rem; font-weight: 700; color: #fff;
    }
    .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.35); }

    @media (max-width: 768px) {
      .profile-layout { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
      .stats-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  profileForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) this.initForm(user);
    });
  }

  initForm(user: any) {
    this.profileForm = this.fb.group({
      firstName: [user.firstName, [Validators.required, Validators.minLength(2)]],
      lastName:  [user.lastName,  [Validators.required, Validators.minLength(2)]],
      username:  [user.username,  [Validators.required, Validators.minLength(3)]],
      email:     [user.email,     [Validators.required, Validators.email]],
      phone:     [user.phone || ''],
      bio:       [user.bio || '']
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.profileForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  resetForm() {
    if (this.user) this.initForm(this.user);
  }

  onUpdate() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateProfile(this.profileForm.value).subscribe(res => {
      this.loading = false;
      if (res.success) {
        this.successMessage = res.message;
        this.profileForm.markAsPristine();
        setTimeout(() => this.successMessage = '', 3000);
      } else {
        this.errorMessage = res.message;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
