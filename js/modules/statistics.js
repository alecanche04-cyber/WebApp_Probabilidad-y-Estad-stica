// statistics.js

export function calculateStats(data) {
    if (data.length === 0) return null;

    const sortedData = [...data].sort((a, b) => a - b);
    const n = data.length;

    // Mean
    const mean = data.reduce((acc, val) => acc + val, 0) / n;

    // Median
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sortedData[mid] : (sortedData[mid - 1] + sortedData[mid]) / 2;

    // Mode
    const frequencyMap = {};
    data.forEach(val => frequencyMap[val] = (frequencyMap[val] || 0) + 1);
    let maxFreq = 0;
    let modes = [];
    for (const val in frequencyMap) {
        if (frequencyMap[val] > maxFreq) {
            maxFreq = frequencyMap[val];
            modes = [parseFloat(val)];
        } else if (frequencyMap[val] === maxFreq) {
            modes.push(parseFloat(val));
        }
    }
    const mode = modes.length === n ? 'No hay moda' : modes.join(', ');

    // Min, Max, Range
    const min = sortedData[0];
    const max = sortedData[n - 1];
    const range = max - min;

    return {
        mean: mean.toFixed(2),
        median: median.toFixed(2),
        mode,
        min,
        max,
        range
    };
}

export function calculateFrequencyTable(data) {
    if (data.length === 0) return [];

    const n = data.length;
    const frequencyMap = {};
    data.forEach(val => frequencyMap[val] = (frequencyMap[val] || 0) + 1);

    const uniqueValues = Object.keys(frequencyMap).map(Number).sort((a, b) => a - b);
    
    let cumulativeAbsolute = 0;
    const table = uniqueValues.map(val => {
        const absolute = frequencyMap[val];
        cumulativeAbsolute += absolute;
        
        const relative = (absolute / n) * 100; // Convertir a porcentaje
        const cumulativeRelative = (cumulativeAbsolute / n) * 100; // Convertir a porcentaje

        return {
            val,
            absolute,
            cumulativeAbsolute,
            relative: relative.toFixed(2) + '%',
            cumulativeRelative: cumulativeRelative.toFixed(2) + '%'
        };
    });

    return table;
}