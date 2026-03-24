# AuthFlow — Angular Auth App

A full-featured Angular 17 authentication app with:
- **Register** — Create a new account (stored in localStorage)
- **Login** — Sign in with email & password
- **Profile** — View & edit your user data
- Route guards (redirect logged-in users away from login/register)
- Reactive Forms with validation
- Standalone components (no NgModules)

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### 1. Install Angular CLI
```bash
npm install -g @angular/cli@17
```

### 2. Install Dependencies
```bash
cd angular-auth-app
npm install
```

### 3. Run the App
```bash
ng serve
```

Open your browser at **http://localhost:4200**

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/         # Top navigation bar
│   │   ├── register/       # Registration form
│   │   ├── login/          # Login form
│   │   └── profile/        # User profile & edit
│   ├── guards/
│   │   └── auth.guard.ts   # Route protection
│   ├── models/
│   │   └── user.model.ts   # TypeScript interfaces
│   ├── services/
│   │   └── auth.service.ts # Auth logic + localStorage
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── index.html
├── main.ts
└── styles.scss
```

---

## 🔐 How It Works

- **Data is stored in `localStorage`** (no backend needed — perfect for demo/learning)
- Passwords are base64-encoded (for demo; use proper hashing in production)
- JWT-like token stored in localStorage to maintain session
- Route guards protect `/profile` from unauthenticated access
- `guestGuard` redirects logged-in users away from `/login` and `/register`

---

## 🛣️ Routes

| Path        | Component | Guard       |
|-------------|-----------|-------------|
| `/`         | → `/login` | —          |
| `/register` | Register  | guestGuard  |
| `/login`    | Login     | guestGuard  |
| `/profile`  | Profile   | authGuard   |

---

## 🎨 Tech Stack

- **Angular 17** — Standalone components, lazy loading
- **Reactive Forms** — FormBuilder, validators
- **RxJS** — BehaviorSubject for reactive auth state
- **SCSS** — Component-level styles
- **localStorage** — Persistent user storage (no backend)
