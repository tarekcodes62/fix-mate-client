# FixMate – Smart Home & Device Repair Service Platform

FixMate is a web-based repair service platform that connects customers with
professional technicians. Customers can browse repair services, book
technicians, track repair requests, and make secure payments. Technicians can
manage their services and repair requests, while administrators manage the
entire platform.

## 🌐 Live Website

**Live URL:** https://fix-mate-client-pi.vercel.app

## 🔐 Admin Credentials

- **Email:** tarek@gmail.com
- **Password:** Tarek1122

## ✨ Key Features

### Public Features

- Responsive homepage with interactive hero slider.
- Browse all available repair services.
- Search and filter services.
- Sort services based on available options.
- View detailed service information.
- Responsive navigation and mobile menu.
- Light and dark theme support.

### Authentication

- Google OAuth authentication.
- Secure authentication with Better Auth.
- Role-based access control.
- Protected dashboard routes.

### Customer Dashboard

- View dashboard overview.
- Book repair services.
- Manage repair bookings.
- Track booking status.
- Cancel eligible bookings.
- View payment information.
- Make payments securely using Stripe.

### Technician Dashboard

- View dashboard overview.
- Add new repair services.
- View, edit, and delete services.
- Manage service availability.
- Accept or reject repair requests.
- Update repair progress.
- Complete repair requests and set final amounts.

### Admin Dashboard

- Manage platform users.
- Manage repair services.
- Manage bookings.
- Monitor transactions.
- Manage platform activities.

### Additional Features

- Stripe payment integration.
- Responsive dashboard layouts.
- Reusable UI components.
- Custom loading screens and skeleton loaders.
- Toast notifications.
- Custom 404 page.
- Shared footer with contact information and social links.

## 🛠️ Technology Stack

**Frontend:**

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

**Authentication:**

- Better Auth
- Google OAuth
- JWT

**Backend Integration:**

- Node.js
- Express.js
- MongoDB
- Stripe
- ImgBB

## 📦 NPM Packages Used

- `next`
- `react`
- `react-dom`
- `typescript`
- `better-auth`
- `lucide-react`
- `react-icons`
- `tailwindcss`
- `sonner`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `swiper`

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_FRONTEND_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd fixmate-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Variables

Create a `.env.local` file in the root directory.

```env
NEXT_PUBLIC_API_URL=your_backend_api_url

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=your_frontend_url

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Add other environment variables required by your project configuration.

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. Build for Production

```bash
npm run build
```

### 7. Start Production Server

```bash
npm run start
```

## 📁 Project Structure

```text
fixmate-client/
├── public/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── services/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── shared/
│   │   ├── ui/
│   │   └── ...
│   └── lib/
├── .env.local
├── package.json
└── README.md
```

## 👥 User Roles

| Role       | Permissions                                                   |
| ---------- | ------------------------------------------------------------- |
| Customer   | Browse services, book repairs, manage bookings, make payments |
| Technician | Manage services, availability, and repair requests            |
| Admin      | Manage users, services, bookings, and transactions            |

---

**FixMate – Making Home Repairs Simple, Reliable, and Hassle-Free.**
