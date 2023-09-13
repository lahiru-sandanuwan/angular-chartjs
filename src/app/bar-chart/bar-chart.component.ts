import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  public chart: any;

  ngOnInit(): void {
    let actualData = [24893, 65345, 8329];
    let maxDataValue = 100000; // Determine the maximum value in the dataset
    let fillerData = actualData.map((value) => maxDataValue - value); // Calculate the filler values

    let chart = new Chart('barChart1', {
      type: 'bar',
      data: {
        labels: ['Machine Annotated', 'Human Annotated', 'Raw Data'],

        datasets: [
          {
            // label: 'Actual Data',
            data: actualData,
            backgroundColor: ['#29A9C4', '#6EA402', '#948CFB'],
            borderColor: ['#29A9C4', '#6EA402', '#948CFB'],
            borderWidth: 1,
            barPercentage: 1,
            categoryPercentage: 0.8,
            borderRadius: {
              topLeft: 4,
              topRight: 4,
              bottomLeft: 0,
              bottomRight: 0,
            },
            stack: 'combined',
          },
          {
            label: 'Filler Data',
            data: fillerData,
            backgroundColor: '#F7F7FE', // Filler color
            borderColor: '#F7F7FE', // Filler color
            hoverBackgroundColor: '#F7F7FE', // Ensure no hover color change
            hoverBorderColor: '#F7F7FE', // Ensure no hover color change
            borderWidth: 1,
            barPercentage: 1,
            categoryPercentage: 0.8,
            borderRadius: {
              topLeft: 4,
              topRight: 4,
              bottomLeft: 4,
              bottomRight: 4,
            },
            stack: 'combined',
          },
        ],
      },
      options: {
        aspectRatio: 0.75,
        plugins: {
          legend: {
            display: false, // Hide legend
          },

          tooltip: {
            filter: function (item) {
              return (
                item.chart.data.datasets[item.datasetIndex].label !==
                'Filler Data'
              );
            },
            displayColors: false,
            caretSize: 0,
          },
        },
        scales: {
          x: {
            grid: {
              display: false, // Remove horizontal grid lines
            },

            ticks: {
              display: false, // Remove x-axis labels
            },
          },
          y: {
            stacked: true,
            display: false, // Remove the left side scale
            beginAtZero: true,
          },
        },
      },
    });

    let actualData2 = [
      5893, 4224, 3990, 3729, 3132, 2593, 1793, 1321, 1123, 989, 583, 303,
    ];
    let maxDataValue2 = 8000; // Determine the maximum value in the dataset
    let fillerData2 = actualData2.map((value) => maxDataValue2 - value);
    let chart2 = new Chart('barChart2', {
      type: 'bar',
      data: {
        labels: [
          'Car',
          'Truck',
          'Human',
          'Traffic Light',
          'Zebra Crossings',
          'Policeman',
          'Name Boards',
          'Signage',
          'Towers',
          'Road Signs',
          'Trees',
          'Fire Truck',
        ],
        datasets: [
          {
            data: [
              5893, 4224, 3990, 3729, 3132, 2593, 1793, 1321, 1123, 989, 583,
              303,
            ],
            backgroundColor: Array(12).fill('#7166F9'),
            borderColor: Array(12).fill('#7166F9'),
            hoverBackgroundColor: '#7166F9',
            hoverBorderColor: '#7166F9',
            borderWidth: 1,
            borderRadius: {
              topLeft: 0,
              topRight: 4,
              bottomLeft: 0,
              bottomRight: 4,
            },
            stack: 'combined',
          },
          {
            label: 'Filler Data',
            data: fillerData2,
            backgroundColor: '#fff', // Filler color
            borderColor: '#fff', // Filler color
            hoverBackgroundColor: '#F7F7FE', // Ensure no hover color change
            hoverBorderColor: '#F7F7FE', // Ensure no hover color change
            borderWidth: 1,
            barPercentage: 1,
            categoryPercentage: 0.8,
            borderRadius: {
              topLeft: 0,
              topRight: 4,
              bottomLeft: 0,
              bottomRight: 4,
            },
            stack: 'combined',
          },
        ],
      },
      options: {
        aspectRatio: 1.2,
        indexAxis: 'y',
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              callback: function (value) {
                if (typeof value === 'number') {
                  let kValue = value / 1000; // Convert to 'k' format

                  // Check if kValue is even
                  if (kValue % 2 === 0) {
                    return kValue + 'k';
                  }
                }
                return null; // If not even or not a number, don't show the tick
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            caretSize: 0,
            filter: function (tooltipItem, data) {
              // Hide tooltip for the 'Filler Data' dataset
              if (tooltipItem.datasetIndex === 1) {
                return false;
              }
              return true;
            },
            callbacks: {
              title: () => '',
              label: function (tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.formattedValue}`;
              },
            },
          },
        },
      },
    });
  }
}
