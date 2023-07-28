import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(ChartDataLabels);

const DailyChart = ({ value, maxValue, title, label }) => {
    const chartRef = useRef(null);

    const [chartColor, setChartColor] = useState("");

    console.log(value);



    useEffect(() => {
        const mediaQuery = window.matchMedia('screen and (max-resolution: 96dpi)');
        const handleResize = () => {
            if (mediaQuery.matches) {
                // Update the chart only when the zoom level is normal (100%)
                // chartRef.current.chartInstance.resize();
            }
        };

        window.addEventListener('resize', handleResize);


        return () => {
            window.removeEventListener('resize', handleResize);

            if (value >= 80 && value < 90) {
                setChartColor("yellow");
            }
            else if (value >= 90) {
                setChartColor("green");
            }
            if (value >= 0 && value < 80) {
                setChartColor("red");
            }
        };
    }, []);

    const data = {
        labels: [label, "Total"],
        datasets: [
            {
                data: [value.toFixed(2), (maxValue - value).toFixed(2)],
                backgroundColor: [chartColor, 'rgba(0, 0, 0, 0)'],
                borderColor: [
                    // 'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    // 'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const options = {

        rotation: 270,

        circumference: 180,

        cutoutPercentage: 50,
        legend: {
            display: false,
        },
        tooltips: {
            enabled: false,
        },

        plugins: {

            datalabels: {
                // color: "#ff2122",
                color: "#ffffff",
                formatter: (value) => value,
                labels: {
                    title: {
                        font: {
                            weight: 'bold',
                            size: 29
                        }
                    },

                },
            },

        },
        layout: {
            padding: {
                top: -10,
            },
        },



    };

    return (
        <div className=' p-2'>
            <h2 className="text-center text-2xl font-bold mb-4 text-red-500">{title}</h2>
            <div className="w-96 h-96 " >
                <Doughnut ref={chartRef} data={data} options={options} title={`${title} Chart`} plugins={ChartDataLabels} >

                </Doughnut>

            </div >
        </div>
    );
};

export default DailyChart;
