import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">◈</span>
        <span class="brand-name">AuthFlow</span>
      </div>
      <div class="nav-links">
        <ng-container *ngIf="!isLoggedIn">
          <a routerLink="/login" routerLinkActive="active" class="nav-link">Sign In</a>
          <a routerLink="/register" routerLinkActive="active" class="nav-link nav-link--cta">Get Started</a>
        </ng-container>
        <ng-container *ngIf="isLoggedIn">
          <a routerLink="/profile" routerLinkActive="active" class="nav-link">
            <img [src]="currentUser?.avatar" [alt]="currentUser?.firstName" class="nav-avatar">
            {{ currentUser?.firstName }}
          </a>
          <button (click)="logout()" class="nav-link nav-link--logout">Sign Out</button>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 70px;
      background: rgba(10, 10, 15, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(139, 92, 246, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      cursor: pointer;
    }
    .brand-icon {
      font-size: 1.5rem;
      color: #8b5cf6;
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .brand-name {
      font-family: 'Space Mono', monospace;
      font-size: 1.2rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 2px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      color: rgba(255,255,255,0.7);
      transition: all 0.2s;
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
      &:hover, &.active {
        color: #fff;
        background: rgba(139, 92, 246, 0.15);
      }
    }
    .nav-link--cta {
      background: #8b5cf6;
      color: #fff !important;
      &:hover { background: #7c3aed; }
    }
    .nav-link--logout {
      color: rgba(255,255,255,0.5);
      &:hover { color: #f87171; background: rgba(248, 113, 113, 0.1); }
    }
    .nav-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid #8b5cf6;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
