import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';

interface PortfolioData {
  name: string;
  ytd: string;
  oneD: string;
  oneW: string;
  oneM: string;
  threeM: string;
  sixM: string;
  oneY: string;
  threeY: string;
  si: string;
  dd: string;
  maxdd: string;
}

interface NavData {
  date: string;
  value: number;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | undefined;
  private allChartData: NavData[] = [];
  private filteredChartData: NavData[] = [];
  private drawdownData: number[] = [];

  fromDate: string = '2019-01-01';
  toDate: string = '2024-04-24';
  isLoading = true;
  error: string | null = null;

  portfolioData: PortfolioData[] = [
    {
      name: 'Focused',
      ytd: '-1.7%',
      oneD: '0.1%',
      oneW: '2.9%',
      oneM: '7.6%',
      threeM: '2.2%',
      sixM: '10.1%',
      oneY: '43.5%',
      threeY: '23.9%',
      si: '22.5%',
      dd: '-2.8%',
      maxdd: '-40.3%',
    },
    {
      name: 'NIFTY50',
      ytd: '3.1%',
      oneD: '0.1%',
      oneW: '1.1%',
      oneM: '1.4%',
      threeM: '4.4%',
      sixM: '16.2%',
      oneY: '26.2%',
      threeY: '16.0%',
      si: '14.5%',
      dd: '-1.5%',
      maxdd: '-38.4%',
    },
  ];

  ngOnInit() {
    Chart.register(...registerables);
    this.loadCsvData();
  }

  onDateChange() {
    this.filterDataAndUpdateChart();
  }

  private loadCsvData() {
    fetch('assets/data/historical_nav_report.csv')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(csvText => {
        const lines = csvText.split('\n');
        this.allChartData = lines
          .slice(1)
          .map(line => {
            const [dateStr, navStr] = line.split(',');
            if (!dateStr || !navStr) return null;
            const [day, month, year] = dateStr.split('-');
            const formattedDate = `${year}-${month}-${day}`;
            return {
              date: formattedDate,
              value: parseFloat(navStr.replace(/[^\d.-]/g, ''))
            };
          })
          .filter((data): data is NavData => data !== null)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        this.isLoading = false;
        setTimeout(() => this.filterDataAndUpdateChart(), 0); // Ensure canvas is available
      })
      .catch((error) => {
        console.error('Error loading CSV data:', error);
        this.error = error.message;
        this.isLoading = false;
      });
  }

  private filterDataAndUpdateChart() {
    this.filteredChartData = this.allChartData.filter(item => {
      const itemDate = new Date(item.date).getTime();
      const fromTimestamp = new Date(this.fromDate).getTime();
      const toTimestamp = new Date(this.toDate).getTime();
      return itemDate >= fromTimestamp && itemDate <= toTimestamp;
    });

    this.calculateDrawdown();
    this.initChart();
  }

  private calculateDrawdown() {
    let peak = -Infinity;
    this.drawdownData = this.filteredChartData.map(point => {
      peak = Math.max(peak, point.value);
      return ((point.value - peak) / peak) * 100;
    });
  }

  private initChart() {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx || !this.filteredChartData.length) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.filteredChartData.map(d => d.date);
    const values = this.filteredChartData.map(d => d.value);
    const niftyValues = values.map(v => v * 0.82);

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Drawdown',
            data: this.drawdownData,
            borderColor: '#f87171',
            backgroundColor: 'rgba(248, 113, 113, 0.3)',
            borderWidth: 1,
            fill: true,
            tension: 0.1,
            pointRadius: 0,
            yAxisID: 'y1',
            order: 3,
          },
          {
            label: 'Focused',
            data: values,
            borderColor: '#00B386',
            backgroundColor: 'rgba(0, 179, 134, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            yAxisID: 'y',
            order: 1,
          },
          {
            label: 'NIFTY50',
            data: niftyValues,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            yAxisID: 'y',
            order: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#374151',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            display: true,
            grid: { display: false },
            ticks: {
              maxTicksLimit: 6,
              color: '#6b7280',
              font: { size: 11 },
            },
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: '#f3f4f6' },
            ticks: {
              color: '#6b7280',
              font: { size: 11 },
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'left',
            min: -50,
            max: 0,
            grid: { drawOnChartArea: false },
            ticks: {
              color: '#d3380dff',
              font: { size: 11 },
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  getRowClass(name: string): string {
    return name === 'Focused' ? 'focused-row' : '';
  }

  getValueClass(value: string): string {
    if (value.startsWith('-')) {
      return 'negative';
    } else if (value === '0.0%' || value === '0%') {
      return 'neutral';
    } else {
      return 'positive';
    }
  }
}
