# FinTrack Pro

A personal finance tracking application built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Real-time overview of monthly income/expenses.
- **Transactions**: Add, edit, delete, and filter transactions.
- **Categories**: Custom categorization with color coding.
- **Reports**: Interactive charts using Recharts.
- **Mobile Friendly**: Fully responsive design.

## Quick Start (Demo Mode)

This project includes a **built-in mock service** (`services/api.ts`) that simulates a backend using browser `localStorage`. You can run the frontend immediately without a backend server.

1.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn
    ```

2.  **Run Development Server**:
    ```bash
    npm start
    # or
    yarn start
    ```

3.  **Open Browser**:
    Navigate to `http://localhost:3000` (or the port shown in your terminal).

4.  **Login**:
    - Click "Try Demo" on the landing page.
    - Or use any email/password (e.g., `user@example.com` / `password`).

## File Structure

- `src/index.tsx`: Entry point.
- `src/App.tsx`: Routing configuration.
- `src/services/api.ts`: Mock backend logic (CRUD with LocalStorage).
- `src/pages/`: Page components (Dashboard, Transactions, etc.).
- `src/components/`: Reusable UI components.
- `src/types.ts`: TypeScript interfaces.

## Backend (Optional)

A reference Express server implementation is provided in `server/index.ts`. To switch to a real backend:
1. Set up a MongoDB or SQLite database.
2. Update `services/api.ts` to use `fetch()` calls to your API endpoints instead of localStorage logic.
