// charts.js
let histogramInstance = null;
let frequencyPolygonInstance = null;
let ogiveInstance = null;
let paretoInstance = null;

// Configuración de colores pastel mejorada
const colors = {
    purple: 'rgba(149, 117, 205, 0.5)',
    purpleHover: 'rgba(149, 117, 205, 0.8)',
    purpleBorder: '#9575cd',
    pink: 'rgba(248, 200, 220, 0.5)',
    pinkHover: 'rgba(248, 200, 220, 0.8)',
    pinkBorder: '#f8c8dc',
    lavender: 'rgba(209, 196, 233, 0.6)',
    lavenderHover: 'rgba(209, 196, 233, 0.9)',
    deepPurple: '#673ab7',
    softText: '#5a4a6e'
};

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 2000,
        easing: 'easeOutQuart',
        delay: (context) => context.dataIndex * 50
    },
    plugins: {
        legend: {
            display: true,
            labels: { font: { family: 'Poppins', size: 12 }, color: colors.softText, usePointStyle: true }
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: colors.deepPurple,
            bodyColor: colors.softText,
            borderColor: colors.purpleBorder,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10
        }
    },
    scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(243, 229, 245, 0.5)' }, ticks: { font: { family: 'Poppins' }, color: colors.softText } },
        x: { grid: { display: false }, ticks: { font: { family: 'Poppins' }, color: colors.softText } }
    }
};

export function updateCharts(frequencyTableData) {
    drawHistogram(frequencyTableData);
    drawFrequencyPolygon(frequencyTableData);
    drawOgive(frequencyTableData);
    drawPareto(frequencyTableData);
}

function drawHistogram(tableData) {
    const ctx = document.getElementById('histogramChart').getContext('2d');
    if (histogramInstance) histogramInstance.destroy();
    histogramInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: tableData.map(d => d.val),
            datasets: [{
                label: 'Histograma',
                data: tableData.map(d => d.absolute),
                backgroundColor: colors.purple,
                borderColor: colors.purpleBorder,
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: colors.purpleHover
            }]
        },
        options: commonOptions
    });
}

function drawFrequencyPolygon(tableData) {
    const ctx = document.getElementById('frequencyPolygonChart').getContext('2d');
    if (frequencyPolygonInstance) frequencyPolygonInstance.destroy();
    frequencyPolygonInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tableData.map(d => d.val),
            datasets: [{
                label: 'Polígono de Frecuencias',
                data: tableData.map(d => d.absolute),
                borderColor: colors.deepPurple,
                backgroundColor: 'rgba(103, 58, 183, 0.1)',
                borderWidth: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: colors.deepPurple,
                pointRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: commonOptions
    });
}

function drawOgive(tableData) {
    const ctx = document.getElementById('ogiveChart').getContext('2d');
    if (ogiveInstance) ogiveInstance.destroy();
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(248, 200, 220, 0.6)');
    gradient.addColorStop(1, 'rgba(248, 200, 220, 0)');
    ogiveInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tableData.map(d => d.val),
            datasets: [{
                label: 'Ojiva (Frecuencia Acumulada)',
                data: tableData.map(d => d.cumulativeAbsolute),
                borderColor: colors.pinkBorder,
                backgroundColor: gradient,
                borderWidth: 4,
                fill: true,
                tension: 0.3,
                pointRadius: 6,
                pointBackgroundColor: '#fff'
            }]
        },
        options: commonOptions
    });
}

function drawPareto(tableData) {
    const ctx = document.getElementById('paretoChart').getContext('2d');
    const sortedData = [...tableData].sort((a, b) => b.absolute - a.absolute);
    const absolute = sortedData.map(d => d.absolute);
    const total = absolute.reduce((a, b) => a + b, 0);
    let cumulative = 0;
    const cumulativePercent = absolute.map(val => {
        cumulative += val;
        return (cumulative / total * 100).toFixed(2);
    });

    if (paretoInstance) paretoInstance.destroy();
    paretoInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(d => d.val),
            datasets: [
                { label: 'Frecuencia', data: absolute, backgroundColor: colors.lavender, borderRadius: 5, order: 2 },
                { label: '% Acumulado', data: cumulativePercent, type: 'line', borderColor: colors.pinkBorder, borderWidth: 3, yAxisID: 'y1', order: 1 }
            ]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y1: { beginAtZero: true, max: 100, position: 'right', grid: { drawOnChartArea: false }, ticks: { font: { family: 'Poppins' }, color: colors.pinkBorder, callback: v => v + '%' } }
            }
        }
    });
}