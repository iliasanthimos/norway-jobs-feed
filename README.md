# NORWAY-JOBS-FEED

![Last Commit](https://img.shields.io/github/last-commit/iliasanthimos/norway-jobs-feed?style=flat&logo=git&logoColor=white&color=0080ff)
![Top Language](https://img.shields.io/github/languages/top/iliasanthimos/norway-jobs-feed?style=flat&color=0080ff)
![Languages Count](https://img.shields.io/github/languages/count/iliasanthimos/norway-jobs-feed?style=flat&color=0080ff)

## Built with the tools and technologies:

![Angular](https://img.shields.io/badge/Angular-v19-DD0031?style=flat&logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white)
![Autoprefixer](https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=flat&logo=Autoprefixer&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat&logo=Prettier&logoColor=black)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white)
![Lodash](https://img.shields.io/badge/Lodash-3492FF.svg?style=flat&logo=Lodash&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white)


---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Acknowledgments](#acknowledgments)

---

## Overview

**Norway-Jobs-Feed** is a job listing application built with Angular v19. It fetches job data from the [NAVIKT Stilling Feed API](https://navikt.github.io/pam-stilling-feed/) and displays them with advanced features such as:

- Virtual pagination.
- Filtering and searching.
- Favorites management.

The app is designed with modular components and services to ensure scalability and maintainability.

---

## Features

- Fetch and display active job listings.
- Real-time search by job title.
- Filtering by If-Modified-Since
- Virtual pagination for efficient data handling.
- Favorites management stored locally.
- Refresh functionality to fetch the latest data.
- Modern UI built with TailwindCSS and Angular
- Light / Dark theme.

---

## Project Structure

```sh

└── norway-jobs-feed/
    ├── README.md
    ├── angular.json
    ├── eslint.config.js
    ├── package-lock.json
    ├── package.json
    ├── proxy.conf.json
    ├── public
    │   └── favicon.ico
    ├── src
    │   ├── app
    │   │   ├── app.component.scss
    │   │   ├── app.component.spec.ts
    │   │   ├── app.component.ts
    │   │   ├── app.config.ts
    │   │   ├── app.routes.ts
    │   │   ├── core
    │   │   │   ├── interceptors
    │   │   │   │   └── caching.interceptor.ts
    │   │   │   ├── models
    │   │   │   │   ├── feed-entry.model.ts
    │   │   │   │   ├── feed-meta-data.model.ts
    │   │   │   │   ├── feed-page.model.ts
    │   │   │   │   └── index.ts
    │   │   │   └── services
    │   │   │       ├── favorites.service.ts
    │   │   │       ├── index.ts
    │   │   │       ├── job-api.service.ts
    │   │   │       ├── local-storage.service.ts
    │   │   │       └── theme.service.ts
    │   │   ├── features
    │   │   │   ├── favorites
    │   │   │   │   ├── favorites.component.html
    │   │   │   │   └── favorites.component.ts
    │   │   │   ├── home
    │   │   │   │   ├── home.component.html
    │   │   │   │   └── home.component.ts
    │   │   │   ├── index.ts
    │   │   │   └── job-listing-details
    │   │   │       ├── job-listing-details.component.html
    │   │   │       └── job-listing-details.component.ts
    │   │   └── shared
    │   │       └── ui
    │   │           ├── favorite-toggle
    │   │           ├── footer
    │   │           ├── header
    │   │           ├── index.ts
    │   │           ├── job-listing-card
    │   │           ├── job-listing-card-skeleton
    │   │           └── job-listing-details-skeleton
    │   ├── environments
    │   │   ├── environment.development.ts
    │   │   └── environment.ts
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.scss
    ├── tailwind.config.js
    ├── tsconfig.app.json
    ├── tsconfig.eslint.json
    ├── tsconfig.json
    └── tsconfig.spec.json
```

## Getting Started

### Prerequisites

Before getting started with norway-jobs-feed, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm
- **Node Version:** "^22.0.0"

### Installation

Install norway-jobs-feed using one of the following methods:

**Build from source:**

1. Clone the norway-jobs-feed repository:

```sh
❯ git clone https://github.com/iliasanthimos/norway-jobs-feed
```

2. Navigate to the project directory:

```sh
❯ cd norway-jobs-feed
```

3. Install the project dependencies:

**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```

### Usage

Run norway-jobs-feed using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

### Fetching Jobs

- The app fetches job data from the [NAVIKT Stilling Feed API](https://navikt.github.io/pam-stilling-feed/) and displays jobs with the following capabilities:

- Filtering: Apply filters like If-Modified-Since for the latest updates.
- Search: Search by job title in the fetched job list.
- Favorites: Save and view favorite jobs, stored locally.
- Virtual Pagination
- The app divides job feeds into manageable chunks using a feedId mapping with metadata. Each page is dynamically rendered and refreshed as needed.

Refresh Feature

- Check for new updates on the current page by refreshing the content.

### Endpoints

- `GET /feed`: Fetches job listings.Flag for requesting the last page `?last=true`.
- `GET /feed/{nextId}`: Fetches the next page of job listings using `nextId` from the previous response.
- `GET /feedetry/{entryId}`: Fetches the entry page of job listings using `entryId` from the previous response.

### Headers

- **Authorization**: Include your token using `Authorization: Bearer {authToken}`.
- **If-Modified-Since**: Fetch data modified after the provided timestamp.
- **If-None-Match**: ETag header is to cache resources that are unchanged.

## Environment Configuration

Update the `environment.ts` file with your specific details:

Update the `environment.development.ts` file with your specific details while development and run app via `npm start`:

```typescript
export const environment = {
  production: true, // or false for local dev
  apiUrl: '/api', // Proxy configuration
  apiVersion: 'v1', // API versioning
  authToken: 'YOUR_AUTH_TOKEN', // Replace with your actual auth token
  defaultPageSize: 30, // Pagination size
};
```

### API Configuration

In proxy.config.ts, the app uses a proxy to handle CORS issues:

```json
{
  "/api": {
    "target": "https://pam-stilling-feed.nav.no",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### Code Standards

Linting: Use eslint for code quality checks.
Formatting: Use prettier for consistent code formatting.
To check and format code:

```bash
npm run lint
npm run format:check
npm run format:write
```

## Acknowledgments

- [NAVIKT Stilling Feed API](https://navikt.github.io/pam-stilling-feed/)
- Open-source libraries: Angular, Lodash, and TailwindCSS.

---
