import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import * as pattern from 'patternomaly';

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

    function createDiagonalPattern(
      strokeColor = 'black',
      backgroundColor = 'white'
    ) {
      // create a 10x10 px canvas for the pattern's base shape
      let shape = document.createElement('canvas');
      shape.width = 5;
      shape.height = 5;
      // get the context for drawing
      let c = shape.getContext('2d');
      // draw background
      if (!c) return backgroundColor;
      c.fillStyle = backgroundColor;
      c.fillRect(0, 0, shape.width, shape.height);
      // draw 1st line of the shape
      c.strokeStyle = strokeColor;
      c.beginPath();
      c.moveTo(4, 5);
      c.lineTo(5, 4);
      c.stroke();
      // draw 2nd line of the shape
      c.beginPath();
      c.moveTo(0, 4);
      c.lineTo(4, 0);
      c.stroke();
      // create the pattern from the shape
      return c.createPattern(shape, 'repeat');
    }

    let actualData3 = [600, 300, 140];
    let maxDataValue3 = 1000; // Determine the maximum value in the dataset
    let fillerData3 = actualData3.map((value) => maxDataValue3 - value); // Calculate the filler values

    const mainLabels = [
      'Car',
      'Light Condition',
      'Location',
      'Tag',
      'Tag',
      '',
      'Truck',
      'Light Condition',
      'Location',
      'Tag',
      'Tag',
      '',
      'Human',
      'Light Condition',
      'Location',
      'Tag',
      'Tag',
    ];

    const percentages = [
      [60, 10, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0],
      [0, 25.5, 8, 0, 0, 0, 0, 19.5, 8, 0, 0, 0, 0, 19.5, 8, 0, 0],
      [0, 74.5, 11, 0, 0, 0, 0, 80.5, 11, 0, 0, 0, 0, 19.5, 11, 0, 0],
      [0, 0, 15, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 15, 0, 0],
      [0, 0, 35, 0, 0, 0, 0, 0, 35, 0, 0, 0, 0, 0, 35, 0, 0],
      [0, 0, 0, 15, 8, 0, 0, 0, 0, 7, 1.2, 0, 0, 0, 0, 3, 1.2],
    ];
    const percentageLabels = [
      ['Car', '', '', '', '', '', 'Truck', '', '', '', '', '', 'Human', '', ''],
      [
        '',
        'Night_time',
        'Los Angeles',
        '',
        '',
        '',
        '',
        'Night_time',
        'Los Angeles',
        '',
        '',
        '',
        '',
        'Night_time',
        'Los Angeles',
        '',
        '',
      ],
      [
        '',
        'Day_time',
        'New York',
        '',
        '',
        '',
        '',
        'Day_time',
        'New York',
        '',
        '',
        '',
        '',
        'Day_time',
        'New York',
        '',
        '',
      ],
      [
        '',
        '',
        'San Francisco',
        '',
        '',
        '',
        '',
        '',
        'San Francisco',
        '',
        '',
        '',
        '',
        '',
        'San Francisco',
        '',
        '',
      ],
      [
        '',
        '',
        'Winnipeg',
        '',
        '',
        '',
        '',
        '',
        'Winnipeg',
        '',
        '',
        '',
        '',
        '',
        'Winnipeg',
        '',
        '',
      ],
      [
        '',
        '',
        '',
        'Background',
        'Background',
        '',
        '',
        '',
        '',
        'Background',
        'Background',
        '',
        '',
        '',
        '',
        'Background',
        'Background',
      ],
    ];
    const boldLabels = ['Car', 'Truck', 'Human'];
    let chart3 = new Chart('barChart3', {
      type: 'bar',
      data: {
        labels: [
          'Car',
          'Light Condition',
          'Location',
          'Tag',
          'Tag',
          '',
          'Truck',
          'Light Condition',
          'Location',
          'Tag',
          'Tag',
          '',
          'Human',
          'Light Condition',
          'Location',
          'Tag',
          'Tag',
        ],
        datasets: [
          {
            label: 'Car',
            type: 'bar',
            backgroundColor: [
              createDiagonalPattern('#9992FB', '#655BE0') ?? '#655BE0',
            ],
            data: [789, 0, 0, 0, 0, 0, 245, 0, 0, 0, 0, 0, 101, 0, 0, 0, 0],
          },
          {
            label: 'Light Condition',
            type: 'bar',
            backgroundColor: '#8D84FA',
            hoverBackgroundColor:
              createDiagonalPattern('#2D2863', '#8D84FA') ?? '#8D84FA',
            data: [0, 144, 34, 0, 0, 0, 0, 49, 34, 0, 0, 0, 0, 20, 34, 0, 0],
          },
          {
            label: 'Light Condition',
            type: 'bar',
            backgroundColor: '#9B93FA',
            hoverBackgroundColor:
              createDiagonalPattern('#2D2863', '#9B93FA') ?? '#8D84FA',
            data: [0, 645, 35, 0, 0, 0, 0, 196, 35, 0, 0, 0, 0, 81, 35, 0, 0],
          },
          {
            label: 'Light Condition',
            type: 'bar',
            backgroundColor: '#A9A3FB',
            hoverBackgroundColor:
              createDiagonalPattern('#2D2863', '#A9A3FB') ?? '#8D84FA',
            data: [0, 0, 123, 0, 0, 0, 0, 0, 35, 0, 0, 0, 0, 0, 45, 0, 0],
          },
          {
            label: 'Light Condition',
            type: 'bar',
            backgroundColor: '#B8B2FC',
            hoverBackgroundColor:
              createDiagonalPattern('#2D2863', '#B8B2FC') ?? '#8D84FA',
            data: [0, 0, 40, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 40, 0, 0],
          },
          {
            label: 'Tag',
            type: 'bar',
            backgroundColor: '#D4D1FD',
            hoverBackgroundColor: '#E2E0FD',
            data: [0, 0, 0, 123, 45, 0, 0, 0, 0, 80, 10, 0, 0, 0, 0, 18, 10],
          },
        ],
      },
      options: {
        aspectRatio: 0.8,
        indexAxis: 'y',
        scales: {
          x: {
            display: false,
            grid: {
              display: false,
            },
            beginAtZero: true,
            stacked: true,
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              display: false, // Remove x-axis labels
            },
          },
          y: {
            grid: {
              display: false,
            },
            stacked: true,
            ticks: {
              font: {
                weight: (c) => {
                  if (boldLabels.includes(mainLabels[c.index])) {
                    return '600'; // at tick label with idx one set fontsize 20
                  } else {
                    return '400'; // for all other tick labels set fontsize 12
                  }
                },
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hide legend
          },
          tooltip: {
            displayColors: false,
            caretSize: 0,
            callbacks: {
              title: () => '',
              label: function (tooltipItem) {
                const lines = [];
                lines.push(
                  `${
                    percentageLabels[tooltipItem.datasetIndex][
                      tooltipItem.dataIndex
                    ]
                  } - ${tooltipItem.formattedValue}`
                );
                lines.push(
                  `Percentage - ${
                    percentages[tooltipItem.datasetIndex][tooltipItem.dataIndex]
                  }%`
                );
                return lines;
              },
            },
          },
        },
      },
    });
  }
}
