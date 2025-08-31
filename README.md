# Portfolio Management App

A web application for a portfolio management company. The app provides a simple interface with two main pages:

- **Home Page:** Displays a collection of blogs.
- **Portfolio Page:** Showcases portfolio statistics, including trading returns month-on-month for each year, and visualizes the equity curve and drawdown chart.

## Features

- **Blog Section:** Read and browse company blogs on the home page.
- **Portfolio Analytics:** View detailed statistics and charts based on historical data.
- **Data Visualization:** Interactive charts for equity curve and drawdown.
- **CSV Data Source:** Portfolio statistics are generated from the provided `historical_nav_report.csv` file.

## Project Structure

```
src/
  app/
    components/
      home/           # Home page components
      portfolio/      # Portfolio page components
    app.component.*   # Main app component files
    app.config.ts     # App configuration
    app.routes.ts     # Routing setup
  assets/
    data/
      historical_nav_report.csv  # Portfolio data source
  index.html
  main.ts
  styles.scss
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [Angular CLI](https://angular.io/cli) (if using Angular)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/portfolio-management-app.git
   cd portfolio-management-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App

Start the development server:

```sh
npm start
```

The app will be available at `http://localhost:4200/`.

### Building for Production

```sh
npm run build
```

## Data Source

- The app uses `src/assets/data/historical_nav_report.csv` as the data source for portfolio statistics and charts.

## License

This project is licensed under the MIT License.

---

*Developed for a portfolio management company to