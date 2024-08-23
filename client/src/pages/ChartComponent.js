//import React, { useEffect, useRef } from 'react';
//import Chart from 'chart.js/auto';
//import { Icon } from 'semantic-ui-react';
//
//const ChartComponent = ({ config, onExpand }) => {
//  const chartRef = useRef(null);
//  const chartInstance = useRef(null);
//
//  useEffect(() => {
//    console.log(config);
//    const ctx = chartRef.current.getContext('2d');
//    if (chartInstance.current) {
//      chartInstance.current.destroy();
//    }
//
//    const scatterData = config.scatterData || [];
//    const lineData = config.lineData || [];
//    const equation = config.equation || '';
//
//    chartInstance.current = new Chart(ctx, {
//      type: 'scatter',
//      data: {
//        datasets: [
//          {
//            label: 'Scatter Data',
//            data: scatterData,
//            borderColor: 'rgba(75, 192, 192, 1)',
//            backgroundColor: 'rgba(75, 192, 192, 0.5)',
//            showLine: false,
//          },
//          {
//            label: `Line of Best Fit`,
//            data: lineData,
//            borderColor: 'rgba(192, 192, 192, 1)',
//            backgroundColor: 'rgba(192, 192, 192, 0.5)',
//            fill: false,
//            type: 'line',
//          },
//        ],
//      },
//      options: {
//        maintainAspectRatio: false,
//        plugins: {
//          tooltip: {
//            callbacks: {
//              label: function (context) {
//                const { x, y } = context.raw;
//                if (context.datasetIndex === 0) {
//                  return `${config.xAxisLabel}: ${x.toFixed(2)}, ${config.yAxisLabel}: ${y.toFixed(2)}`;
//                } else {
//                  return `Line of Best Fit: ${equation}`;
//                }
//              },
//            },
//          },
//          annotation: {
//            annotations: {
//              equation: lineData.length > 0 ? {
//                type: 'label',
//                xValue: lineData[Math.floor(lineData.length / 2)].x,
//                yValue: Math.max(...lineData.map(d => d.y)),
//                content: equation,
//                backgroundColor: 'rgba(0,0,0,0.5)',
//                font: {
//                  size: 14,
//                },
//                enabled: true,
//              } : undefined,
//            },
//          },
//        },
//        scales: {
//          x: {
//            title: { display: true, text: config.xAxisLabel },
//            beginAtZero: true,
//          },
//          y: {
//            title: { display: true, text: config.yAxisLabel },
//            beginAtZero: true,
//          },
//        },
//      },
//    });
//
//    return () => {
//      if (chartInstance.current) {
//        chartInstance.current.destroy();
//      }
//    };
//  }, [config]);
//
//  return (
//    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
//      <Icon
//        name="expand"
//        size="small"
//        style={{ position: 'absolute', top: 0, left: 0, cursor: 'pointer', zIndex: 1 }}
//        onClick={onExpand}
//      />
//      <canvas ref={chartRef} style={{ height: '100%', width: '100%' }}></canvas>
//    </div>
//  );
//};
//
//export default ChartComponent;

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Icon } from 'semantic-ui-react';

const ChartComponent = ({ config, onExpand }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    console.log(config);
    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const scatterData = config.scatterData || [];
    const lineData = config.lineData || [];
    const equation = config.equation || '';

    chartInstance.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Scatter Data',
            data: scatterData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            showLine: false,
          },
          {
            label: `Line of Best Fit`,
            data: lineData,
            borderColor: 'rgba(192, 192, 192, 1)',
            backgroundColor: 'rgba(192, 192, 192, 0.5)',
            fill: false,
            type: 'line',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const { x, y } = context.raw;
                if (context.datasetIndex === 0) {
                  return `${config.xAxisLabel}: ${x.toFixed(2)}, ${config.yAxisLabel}: ${y.toFixed(2)}`;
                } else {
                  return `Line of Best Fit: ${equation}`;
                }
              },
            },
          },
          annotation: {
            annotations: {
              equation: lineData.length > 0 ? {
                type: 'label',
                xValue: lineData[Math.floor(lineData.length / 2)].x,
                yValue: Math.max(...lineData.map(d => d.y)),
                content: equation,
                backgroundColor: 'rgba(0,0,0,0.5)',
                font: {
                  size: 14,
                },
                enabled: true,
              } : undefined,
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: config.xAxisLabel },
            beginAtZero: true,
          },
          y: {
            title: { display: true, text: config.yAxisLabel },
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [config]);

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <Icon
        name="expand"
        size="small"
        style={{ position: 'absolute', top: 0, left: 0, cursor: 'pointer', zIndex: 1 }}
        onClick={onExpand}
      />
      <canvas ref={chartRef} style={{ height: '100%', width: '100%' }}></canvas>
    </div>
  );
};

export default ChartComponent;