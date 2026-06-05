# BigQuery Dashboard

This dashboard is designed to be deployed once per customer. Each customer
hosts their own copy, connects it to their own BigQuery project, and pays for
their own query jobs.

🚀 **Live Demo:** https://dash-vercel-testing.vercel.app/


---

# Features

- Self-hosted per customer
- Connect to a customer-owned Google BigQuery project
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
- A Google Cloud Platform account owned by the customer
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

Create a `.env` file in the dashboard deployment for that customer.

```env
GCP_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

For a ready-to-edit template, see `dashboard_v2/.env.example`. For step-by-step
local setup and troubleshooting, see `LOCAL_SETUP.md` at the repository root.

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
customer-owned table to read. The service account must belong to that
customer's environment and have permission to run jobs in the selected
project and read from the selected table.

If you want to avoid being involved with access management, do not host a
shared dashboard instance. Instead, give each customer their own deployment
and their own service account or Google auth flow.

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

`npm run dev` now serves `/api` locally, so the dashboard can load data in
plain Vite development. Use `npx vercel dev` when you want the Vercel runtime
path specifically.

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

For a self-hosted-per-customer setup, create one Vercel project per customer
or template the repo so each customer deploys their own copy with their own
BigQuery credentials.

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
ID, and Table ID in the command bar for that customer's deployment. If it
returns a BigQuery permissions error, confirm the customer's service account
can run query jobs in `GCP_PROJECT_ID` and read the selected table.

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
