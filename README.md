# Noviindus2026

A Next.js online exam application with OTP-based onboarding, profile completion, timed test experience, and result tracking.

## Tech Stack

- Next.js `15.3.1` (App Router)
- React `19`
- TypeScript
- Redux Toolkit + React Redux
- Axios
- Tailwind CSS
- Sonner (toast notifications)

## Features

- OTP login flow:
  - Send OTP
  - Verify OTP
  - Profile creation (with image upload)
- Exam flow:
  - Instructions page
  - Timed question navigation
  - Mark for review / attended / not-attended states
  - Test submission
  - Result page
- Auth session handling:
  - Access + refresh token persistence
  - Axios interceptor with token refresh retry on `401`
- Standardized error handling:
  - `400` invalid request
  - `401` unauthorized
  - `500` server error
  - API `message` preferred when available
- Toast-based UI feedback (replaced `alert`)

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  instructions/page.tsx
  test/page.tsx
  result/page.tsx
  providers.tsx

components/
  getStarted.tsx
  OtpLogin.tsx
  Details.tsx
  SubmitTestModal.tsx
  ComprehensiveModal.tsx
  layout/Header.tsx

features/auth/
  auth-api.ts
  auth-slice.ts

store/
  index.ts
  hooks.ts

utils/
  api.ts
  api-error.ts
  auth-storage.ts
  logout.ts
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-base-url
NEXT_PUBLIC_AUTH_REFRESH_PATH=/auth/refresh
NEXT_PUBLIC_REFRESH_TOKEN_FIELD=refresh_token
```

3. Run development server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Build and Run

```bash
npm run build
npm run start
```

## API Contracts Used

### Auth

- `POST /auth/send-otp`
- `POST /auth/verify-otp`
- `POST /auth/create-profile`
- `POST /auth/refresh`
- `POST /auth/logout`

### Exam

- `GET /question/list`
- `POST /answers/submit`

## Error Handling Policy

Centralized in `utils/api-error.ts`:

- If backend returns JSON `message`, show it.
- Else fallback by status:
  - `400`: "Invalid request. Please check your input and try again."
  - `401`: "Unauthorized access. Please login again."
  - `500`: "Server error. Please try again later."
  - default: generic fallback

## Toast Notifications

`sonner` is configured in `app/layout.tsx` via:

- `<Toaster richColors position="top-right" />`

All previous blocking alerts were replaced with non-blocking toast messages.