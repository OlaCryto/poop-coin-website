// tokenomics-chart.js
// External Chart.js initialization for tokenomics page

document.addEventListener('DOMContentLoaded', function () {
    var ctx = document.getElementById('tokenChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Liquidity', 'Marketing', 'Team', 'Rewards', 'Burn'],
            datasets: [{
                data: [40, 20, 15, 15, 10],
                backgroundColor: [
                    '#36A2EB',
                    '#FF6384',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Tokenomics Distribution'
                }
            }
        }
    });
});
