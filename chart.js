// chart.js - JavaScript for displaying chart
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('chartCanvas').getContext('2d');

    // Sample data for tax performance (this can be dynamically fetched)
    const taxData = [1000, 1500, 900, 1300, 1700]; // Example tax amounts from different transactions
    const taxLabels = ['Booth 1', 'Booth 2', 'Booth 3', 'Booth 4', 'Booth 5'];

    const chart = new Chart(ctx, {
        type: 'bar', // Chart type (bar chart in this case)
        data: {
            labels: taxLabels,
            datasets: [{
                label: 'Tax Obligations (16%)',
                data: taxData,
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Transaction Tax Performance Across Booths'
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return 'Tax: ' + tooltipItem.raw + ' Kwacha';
                        }
                    }
                }
            }
        }
    });
});
