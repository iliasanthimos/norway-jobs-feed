## Description

A job listing application that fetches job data from an API, processes it, and displays it with pagination and search/filter capabilities. It uses Angular for the front end, along with \`rxjs\` for reactive programming, \`prettier\` for code formatting, and \`eslint\` for linting. Tailwind CSS is used for styling the components.

This app is built with Angular v19 and is ready for deployment with the following key features:

- Job listing with pagination and search.
- Fetches job data from the [NAVIKT Stilling Feed API](https://navikt.github.io/pam-stilling-feed/).
- Displays jobs based on the 'ACTIVE' status.
- Allows filtering and searching for jobs.
- Supports dynamic loading of job pages based on the data available.

## Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started, clone the repository and install the dependencies.

\`\`\`bash
git clone https://github.com/your-username/job-listing-app.git
cd job-listing-app
npm install
\`\`\`

## Development

To start the development server, use the following command:

\`\`\`bash
npm start
\`\`\`

This will run the app at \`http://localhost:4200/\` with live reloading.

You can also run the app with the following commands:

- \`npm build\` — Builds the app for production.
- \`npm watch\` — Builds the app with watch mode for continuous changes.
- \`npm test\` — Run tests with Jasmine and Karma.

## Usage

Once the app is running, you can access the job listings. The app will fetch jobs from the API and display them with pagination. You can filter and search through the jobs using the provided search bar.

### Search and Filter Jobs

You can search for jobs by title, and filter them based on different criteria. Filters are applied in real-time to the displayed results.

### Pagination

The app automatically paginates the job results. If there are fewer results than the page size, pagination will not be enabled.

## API

The app uses the following API for fetching job listings:  
[**NAVIKT Stilling Feed API**](https://navikt.github.io/pam-stilling-feed/)

Endpoints used:
- \`GET /feed\` — Fetches job listings.
- \`GET /feed/{nextId}\` — Fetches the next page of job listings based on the \`nextId\` from the previous response.

### Headers

- \`Authorization: Bearer {token}\` — Required for authentication.
- \`If-Modified-Since\` — Optional header for fetching data since the last modification.

## Contributing

We welcome contributions! If you'd like to contribute, please fork the repository and submit a pull request with your changes.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

Please ensure your code adheres to the project's coding standards. We use \`eslint\` for linting and \`prettier\` for code formatting.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
