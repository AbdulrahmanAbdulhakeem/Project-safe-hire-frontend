# SafeHire — Frontend

SafeHire is a recruitment platform designed to help people identify legitimate employers and reduce exposure to fraudulent job postings. Companies are onboarded by an administrator, and the public site provides job listings, company verification, and a geographic risk heatmap.

**Live frontend:** https://project-safe-hire.netlify.app  
**Backend API:** https://project-safe-hire.onrender.com

> Demo credentials are included below for project evaluation. They are shared demo credentials, not secure production accounts. Do not reuse these passwords for personal accounts or leave these credentials enabled in a public production deployment.

## Contents

- [Features by user role](#features-by-user-role)
- [Demo accounts](#demo-accounts)
- [Frontend technology](#frontend-technology)
- [Run locally](#run-locally)
- [Environment variables](#environment-variables)
- [Deploying the frontend](#deploying-the-frontend)
- [Troubleshooting](#troubleshooting)
- [Related backend](#related-backend)

## Features by user role

### Public visitors / job seekers

No applicant account is currently required for the public-facing features. Visitors can:

- Browse active job postings.
- View public company information.
- Check a company registration/CAC-RC number through the company-verification feature.
- Explore the geographic risk heatmap for reported/high-risk interview areas.
- Send a message through the contact form.

The current frontend does **not** provide a job-application workflow, CV upload, or applicant dashboard.

### Administrator

The administrator can:

- View the platform overview and dashboard statistics.
- View the list of registered companies.
- Onboard a company by providing its name, CAC/RC number, email, password, and optional address.
- Review, edit, or remove company records using the available dashboard controls.

Company onboarding creates a company login and marks the company as approved/verified in the current backend implementation. The admin account must already exist in the backend database; the frontend does not create the first admin account.

### Company account

A company account can:

- Sign in to its company dashboard.
- View its own job postings and basic job counts.
- Create a job posting with its title, description, location, interview address, and optional salary range.
- Edit or delete its own job postings using the available job-list controls.

The backend restricts company job-management endpoints to authenticated company accounts with an approved, verified company profile.

## Demo accounts

Use these credentials on the **Sign In** page. They work only if the corresponding accounts have been created in the deployed backend database and their passwords have not changed.

| Role | Email | Password |
|---|---|---|
| Administrator | `developer@example.com` | `SuperSecurePassword123!` |
| Company | `unknown@gmail.com` | `1234567890` |

**Security note:** These credentials are intentionally documented for demonstration/evaluation. Change them or disable the accounts before treating the deployment as a real service. Never commit real production credentials to a public repository.

## Frontend technology

- React + TypeScript
- Vite
- React Router
- Tailwind CSS and shadcn/ui-style components
- Zustand for client state
- Axios for API requests
- Google Maps React integration for the risk heatmap
- Sonner for toast notifications

## Run locally

### Requirements

- Node.js (an active LTS version is recommended)
- npm
- Access to a running SafeHire backend and its PostgreSQL database for API-backed features

### 1. Install dependencies

Clone or download this frontend repository, then open a terminal in the frontend project directory (the directory containing `package.json`):

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the frontend project root. See [Environment variables](#environment-variables) below.

### 3. Start the development server

```bash
npm run dev
```

Vite prints the local URL in the terminal, normally `http://localhost:5173`.

### 4. Build and preview the production bundle

```bash
npm run build
npm run preview
```

The generated static site is written to `dist/`.

## Environment variables

Vite exposes only variables prefixed with `VITE_` to browser code. Never put database URLs, Better Auth secrets, email-provider keys, or other server-only secrets in this frontend `.env` file.

| Variable | Required | Purpose | Example |
|---|---|---|---|
| `VITE_API_URL` | Recommended | Backend origin used by the frontend API client. The frontend appends paths such as `/api/public` and `/api/auth/sign-in/email`. | `https://project-safe-hire.onrender.com` |
| `VITE_GOOGLE_MAPS_API_KEY` | For the heatmap | Google Maps JavaScript API key used by the risk heatmap. Restrict this key to the required APIs and your frontend domains in Google Cloud. | `your_google_maps_browser_key` |

Example `.env`:

```dotenv
VITE_API_URL=https://project-safe-hire.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_browser_key
```

The API client currently defaults to `http://localhost:8000` if `VITE_API_URL` is omitted. Set it explicitly for production builds. After changing environment variables, restart the Vite server; for deployments, trigger a new build/redeploy.

### Backend configuration required for local or hosted use

The backend must be configured separately. At minimum, confirm that its environment contains the correct database connection and Better Auth configuration, and that `FRONTEND_URL` matches the exact frontend origin. The backend's CORS allowlist and Better Auth `trustedOrigins` must also include that origin. For local development, the frontend origin is normally `http://localhost:5173`.

Because the frontend and backend are hosted on different domains, authentication depends on correctly configured cross-origin credentials/cookies. The frontend Axios client uses `withCredentials: true`; that alone cannot fix a backend CORS or Better Auth origin/cookie configuration mismatch.

## Deploying the frontend

This project is configured as a Vite static frontend and includes Netlify deployment files. It can also be deployed to Vercel or another static hosting provider.

1. Import the frontend repository into your hosting provider.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add `VITE_API_URL` and (if using the map) `VITE_GOOGLE_MAPS_API_KEY` in the hosting provider's environment-variable settings.
5. Redeploy after adding or changing variables.
6. Configure SPA fallback/rewrite rules so routes such as `/login` and `/dashboard/admin` serve `index.html` on refresh.
7. Add the exact deployed frontend origin to the backend CORS allowlist and Better Auth trusted origins, and set the backend `FRONTEND_URL` accordingly.

Do not assume a deployment is correctly configured just because the frontend loads. Test sign-in and an authenticated API request as well.

## Troubleshooting

### `401 Unauthorized` or `Valid session required`

- Confirm that the login request succeeds and that the browser receives/sends the Better Auth session cookie.
- Confirm the frontend origin is included in backend CORS and Better Auth trusted origins.
- Confirm CORS allows credentials and the frontend API client has `withCredentials: true`.
- Confirm the demo account exists in the same backend database that the deployed API is using.

### CORS or cookie errors

- Use HTTPS for deployed frontend and backend URLs.
- Ensure `FRONTEND_URL` is the exact frontend origin (scheme and hostname; no path).
- Update the backend's CORS allowlist and Better Auth `trustedOrigins` whenever the deployed domain changes.
- Rebuild/redeploy after changing frontend environment variables.

### Jobs or company records do not load

- Check the browser developer tools' Network tab for the failing request and response status.
- Confirm `VITE_API_URL` points to the backend origin, without adding `/api` because request paths already include `/api`.
- Confirm the Render service is running and its database connection is healthy.

### Google Maps shows “API Key is missing”

Set `VITE_GOOGLE_MAPS_API_KEY` in the frontend environment and redeploy/restart the frontend.

## Related backend

The companion backend is a Node.js, Express, TypeScript, Prisma, PostgreSQL, and Better Auth application. It exposes public endpoints for jobs, company verification, company details, heatmap data, and contact messages, alongside protected administrator and company endpoints.

Backend repository/archive: `Project-safe-hire-main` (maintain and deploy separately from this frontend).

## Project status and limitations

SafeHire's current scope focuses on verified company onboarding, public job discovery, and fraud-risk awareness. Features such as applicant accounts, job applications, CV uploads, and a complete report-review/moderation workflow are not currently exposed in this frontend.
