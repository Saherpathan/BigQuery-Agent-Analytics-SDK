# BigQuery Dashboard

🚀 **Live Demo:** https://dash-vercel-testing.vercel.app/


---

# Features

- Connect to Google BigQuery
- Enter:
  - Project ID
  - Dataset ID
  - Table ID
- Fetch and visualize analytics data
- Vercel-ready deployment
- Backend API support for secure queries

---

# Tech Stack

- React
- TypeScript
- Vite
- Node.js
- Google BigQuery
- Vercel

---

# Prerequisites

Before running the project, ensure you have:

- Node.js >= 18
- npm or pnpm
- Google Cloud Platform account
- BigQuery enabled
- Service Account credentials

---

# Installation

Clone the repository:

```bash
git clone https://github.com/Saherpathan/BigQuery-Agent-Analytics-SDK.git
cd BigQuery-Agent-Analytics-SDK/dashboard_v2
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
GCP_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

For Vercel deployment:

```env
GCP_PROJECT_ID=your-project-id
GCP_CLIENT_EMAIL=your-client-email
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

The API connector supports two authentication modes:

- Local development: Application Default Credentials or
  `GOOGLE_APPLICATION_CREDENTIALS`.
- Vercel: `GCP_PROJECT_ID`, `GCP_CLIENT_EMAIL`, and `GCP_PRIVATE_KEY`.

The Project / Dataset / Table fields in the dashboard identify the
`agent_events` table to read. The service account still needs permission to
run jobs in `GCP_PROJECT_ID` and read from the selected table.

---

# Google Cloud Setup

## 1. Enable BigQuery API

Go to:

https://console.cloud.google.com/

Enable:
- BigQuery API

---

## 2. Create a Service Account

Navigate to:

IAM & Admin → Service Accounts

Create a new service account.

Grant these roles:

- BigQuery Data Viewer
- BigQuery Job User

Download the JSON key.

Rename it:

```bash
service-account.json
```

Place it in the project root directory.

---

# Running Locally

Start the Vercel development server so the `/api` BigQuery connector runs
alongside the Vite app:

```bash
npx vercel dev
```

App will run on:

```bash
http://localhost:3000
```

`npm run dev` starts only Vite. Use it for UI-only work; BigQuery-backed
dashboard data requires `npx vercel dev` or a deployed Vercel environment.

---

# Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# Deploying to Vercel

Install Vercel CLI:

```bash
npm install -g vercel
```

Login:

```bash
vercel login
```

Deploy:

```bash
vercel
```

---

# Vercel Environment Variables

In Vercel Dashboard:

Project → Settings → Environment Variables

Add:

```env
GCP_PROJECT_ID=
GCP_CLIENT_EMAIL=
GCP_PRIVATE_KEY=
```

Important:

Replace actual line breaks in the private key with `\n`.

Example:

```env
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC123\n-----END PRIVATE KEY-----\n"
```

---

# Example BigQuery Query

```sql
SELECT *
FROM `project.dataset.table`
LIMIT 100
```

---

# Recommended Architecture

## Frontend
- React dashboard UI
- Forms for dataset configuration
- Charts/tables for analytics

## Backend (`/api`)
- Secure BigQuery access
- Query execution
- Authentication handling

Never expose service account credentials in frontend code.

---

# Common Issues

## CORS Errors

Do not call BigQuery directly from frontend.

Use backend API routes inside `/api`.

---

## BigQuery Permission Denied

Ensure the service account has:
- BigQuery Data Viewer
- BigQuery Job User

If the dashboard returns "Missing Configuration", fill in Project ID, Dataset
ID, and Table ID in the command bar. If it returns a BigQuery permissions
error, confirm the service account can run query jobs in `GCP_PROJECT_ID` and
read the selected table.

---

## Invalid Private Key

Ensure formatting is correct:

```env
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

# Available Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

# Folder Structure

## `/src/components`
Reusable UI components

## `/src/hooks`
Custom React hooks

## `/src/services`
API services and BigQuery logic

## `/src/lib`
Helper utilities

## `/api`
Server-side API routes for Vercel


---

# Security Notes

- Never commit `.env`
- Never commit service account keys
- Use backend APIs for BigQuery queries
- Keep credentials server-side only

---
