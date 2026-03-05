export function getUserInputData() {
    const inputData = document.getElementById('dataInput').value;
    if (!inputData.trim()) return [];
    const dataArray = inputData.split(/[,\s]+/)
        .map(num => parseFloat(num.trim()))
        .filter(num => !isNaN(num));
    return dataArray;
}

export function generateRandomData(size = 20, min = 1, max = 100) {
    const randomData = [];
    for (let i = 0; i < size; i++) {
        randomData.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return randomData;
}

export function displayProcessedData(dataArray, onDeleteCallback) {
    const dataDisplay = document.getElementById('dataDisplay');
    if (dataArray.length > 0) {
        dataDisplay.innerHTML = `
            <div class="data-header-label">
                <span class="source-icon">📂</span> Muestra de Datos Originales (${dataArray.length})
            </div>
            <div class="data-container"></div>
        `;
        const container = dataDisplay.querySelector('.data-container');
        
        dataArray.forEach((num, index) => {
            const chip = document.createElement('span');
            chip.className = 'data-chip';
            chip.style.animationDelay = `${index * 0.02}s`;
            
            chip.innerHTML = `
                ${num}
                <span class="delete-icon" title="Eliminar este dato">×</span>
            `;
            
            const deleteBtn = chip.querySelector('.delete-icon');
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                onDeleteCallback(index);
            };
            
            container.appendChild(chip);
        });
    } else {
        dataDisplay.innerHTML = '';
    }
}