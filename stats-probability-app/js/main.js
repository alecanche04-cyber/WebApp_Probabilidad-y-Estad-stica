// main.js
import { getUserInputData, generateRandomData, displayProcessedData } from './modules/dataHandler.js';
import { calculateStats, calculateFrequencyTable } from './modules/statistics.js';
import { updateCharts } from './modules/charts.js';
import { setOperations, permutations, combinations, multiplicativeRule, generateTreeHTML } from './modules/probability.js';

document.addEventListener('DOMContentLoaded', () => {
    const dataInput = document.getElementById('dataInput');
    const addDataBtn = document.getElementById('addDataBtn');
    const generateRandomBtn = document.getElementById('generateRandomBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');
    const goToMenuBtn = document.getElementById('goToMenuBtn');
    const menuNavContainer = document.getElementById('menuNavContainer');
    
    // Secciones principales
    const inputSection = document.getElementById('data-input-section');
    const analysisSummary = document.getElementById('analysis-summary');
    const statisticsSection = document.getElementById('statistics-section');
    const frequencySection = document.getElementById('frequency-section');
    const chartsSection = document.getElementById('charts-section');
    const probabilitySection = document.getElementById('probability-section');
    const dataDisplay = document.getElementById('dataDisplay');

    const sections = [statisticsSection, frequencySection, chartsSection, probabilitySection];

    // --- Gestión de Navegación del Menú ---
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Ocultar Menú
            analysisSummary.style.display = 'none';
            
            // Navegación individual
            if (targetId === 'data-input-section') {
                inputSection.style.display = 'block';
                hideAllAnalysis();
                
                // Mostrar muestra y botón de menú solo si hay datos procesados
                if (dataDisplay.innerHTML.trim() !== '') {
                    dataDisplay.style.display = 'block';
                    menuNavContainer.style.display = 'block';
                } else {
                    dataDisplay.style.display = 'none';
                    menuNavContainer.style.display = 'none';
                }
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                let sectionToShow;
                if (targetId === 'statistics-section') sectionToShow = statisticsSection;
                else if (targetId === 'frequency-section') sectionToShow = frequencySection;
                else if (targetId === 'charts-section') sectionToShow = chartsSection;
                else sectionToShow = probabilitySection;

                showSection(sectionToShow);
                
                // Ocultar muestra de datos en las secciones de análisis para mayor limpieza
                dataDisplay.style.display = 'none';
                menuNavContainer.style.display = 'none';
                
                // Si es una sub-sección de probabilidad, mostrar solo lo relevante
                if (sectionToShow === probabilitySection) {
                    const wrappers = probabilitySection.querySelectorAll('.chart-wrapper');
                    const mainTitle = document.getElementById('probability-main-title');
                    
                    // Ocultar todas las tarjetas inicialmente
                    wrappers.forEach(w => w.style.display = 'none');
                    
                    if (targetId === 'set-analysis-title') {
                        mainTitle.textContent = 'Operaciones con Conjuntos';
                        document.getElementById('set-analysis-title').closest('.chart-wrapper').style.display = 'block';
                    } else if (targetId === 'prob-analysis-title') {
                        mainTitle.textContent = 'Análisis de Probabilidad';
                        document.getElementById('prob-analysis-title').closest('.chart-wrapper').style.display = 'block';
                        // El diagrama de árbol también debe mostrarse con la regla multiplicativa
                        const treeWrapper = document.getElementById('treeDiagramArea').closest('.chart-wrapper');
                        if (treeWrapper) treeWrapper.style.display = 'block';
                    } else if (targetId === 'comb-analysis-title') {
                        mainTitle.textContent = 'Permutaciones y Combinaciones';
                        document.getElementById('comb-analysis-title').closest('.chart-wrapper').style.display = 'block';
                    }
                } else {
                    // Resetear el título para las secciones normales
                    if (targetId === 'statistics-section') document.querySelector('#statistics-section h2').textContent = 'Resultados Estadísticos';
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // --- Botones de Volver al Menú ---
    document.querySelectorAll('.btn-return').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllAnalysis();
            
            if (menuNavContainer) menuNavContainer.style.display = 'none';

            // Al volver, resetear la visibilidad de todas las tarjetas por si acaso
            if (probabilitySection) {
                probabilitySection.querySelectorAll('.chart-wrapper').forEach(w => w.style.display = 'block');
            }

            analysisSummary.style.display = 'block';
            dataDisplay.style.display = 'none'; // Ocultar muestra al volver al menú
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    function showSection(section) {
        hideAllAnalysis();
        section.style.display = 'block';
        dataDisplay.style.display = 'none'; // Por defecto oculto en secciones
    }

    function hideAllAnalysis() {
        sections.forEach(s => s.style.display = 'none');
    }

    // --- Procesamiento de Datos ---
    addDataBtn.addEventListener('click', () => processFullAnalysis());
    
    goToMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        inputSection.style.display = 'none';
        analysisSummary.style.display = 'block';
        dataDisplay.style.display = 'none'; // Ocultar muestra al entrar al menú
        menuNavContainer.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    generateRandomBtn.addEventListener('click', () => {
        const spinner = document.getElementById('spinner');
        const btnText = document.getElementById('btnText');
        spinner.style.display = 'block';
        btnText.style.display = 'none';
        generateRandomBtn.disabled = true;

        setTimeout(() => {
            const randomData = generateRandomData(20);
            dataInput.value = randomData.join(', ');
            processFullAnalysis();
            spinner.style.display = 'none';
            btnText.style.display = 'block';
            generateRandomBtn.disabled = false;
        }, 800);
    });

    clearDataBtn.addEventListener('click', () => {
        dataInput.value = '';
        dataDisplay.innerHTML = '';
        inputSection.style.display = 'block';
        analysisSummary.style.display = 'none';
        if (menuNavContainer) menuNavContainer.style.display = 'none';
        hideAllAnalysis();
    });

    function processFullAnalysis() {
        const data = getUserInputData();
        if (data.length === 0) {
            alert("Por favor ingresa datos válidos.");
            return;
        }

        // Mantener al usuario en la pantalla de ingreso
        inputSection.style.display = 'block';
        analysisSummary.style.display = 'none';
        dataDisplay.style.display = 'block';
        if (menuNavContainer) menuNavContainer.style.display = 'block';

        displayProcessedData(data, (index) => {
            const current = getUserInputData();
            current.splice(index, 1);
            dataInput.value = current.join(', ');
            if (current.length === 0) {
                clearDataBtn.click();
            } else {
                processFullAnalysis();
            }
        });

        const stats = calculateStats(data);
        displayStats(stats);
        const freqTable = calculateFrequencyTable(data);
        displayFrequencyTable(freqTable);
        updateCharts(freqTable);
        calculateAutoProbability(data, stats);
    }

    function calculateAutoProbability(data, stats) {
        const half = Math.ceil(data.length / 2);
        document.getElementById('setAInput').value = data.slice(0, half).join(', ');
        document.getElementById('setBInput').value = data.slice(half).join(', ');
        const n = data.length;
        const r = Math.floor(data.length / 4) || 1;
        document.getElementById('nValue').value = n;
        document.getElementById('rValue').value = r;

        // Calcular Combinatoria Automáticamente
        document.getElementById('combinatoriaResults').innerHTML = `
            <div style="font-size: 0.85rem; color: #666; margin-bottom: 10px;"><strong>Auto-calculado:</strong> Basado en el total de datos (n=${n}) y una muestra sugerida (r=${r}).</div>
            <p><strong>P(${n},${r}):</strong> ${permutations(n, r)}</p>
            <p><strong>C(${n},${r}):</strong> ${combinations(n, r)}</p>
        `;

        const median = parseFloat(stats.median);
        const evA = data.filter(n => n > median);
        const pA = (evA.length / data.length).toFixed(2);
        const evBgivenA = evA.filter(n => n % 2 === 0);
        const pBgivenA = evA.length > 0 ? (evBgivenA.length / evA.length).toFixed(2) : 0;
        document.getElementById('probA').value = pA;
        document.getElementById('probBgivenA').value = pBgivenA;
        document.getElementById('probResults').innerHTML = `<div style="font-size: 0.85rem; color: #666; margin-bottom: 10px;"><strong>Auto-calculado:</strong><br>A: Dato > Mediana (${median}) | B: Dato es Par</div><p><strong>P(A ∩ B):</strong> ${(pA * pBgivenA).toFixed(4)}</p>`;
        const results = multiplicativeRule(parseFloat(pA), parseFloat(pBgivenA));
        document.getElementById('treeDiagramArea').innerHTML = generateTreeHTML(results);
    }

    function displayStats(stats) {
        document.getElementById('meanResult').textContent = stats.mean;
        document.getElementById('medianResult').textContent = stats.median;
        document.getElementById('modeResult').textContent = stats.mode;
        document.getElementById('minResult').textContent = stats.min;
        document.getElementById('maxResult').textContent = stats.max;
        document.getElementById('rangeResult').textContent = stats.range;
    }

    function displayFrequencyTable(table) {
        const tbody = document.getElementById('frequencyTableBody');
        tbody.innerHTML = '';
        table.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.val}</td><td>${row.absolute}</td><td>${row.relative}</td><td>${row.cumulativeAbsolute}</td><td>${row.cumulativeRelative}</td>`;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('calculateSetsBtn').addEventListener('click', () => {
        const setA = new Set(document.getElementById('setAInput').value.split(',').map(s => s.trim()).filter(s => s));
        const setB = new Set(document.getElementById('setBInput').value.split(',').map(s => s.trim()).filter(s => s));
        const results = setOperations(setA, setB);
        document.getElementById('setResults').innerHTML = `<p><strong>Unión:</strong> {${results.union}}</p><p><strong>Intersección:</strong> {${results.intersection}}</p><p><strong>Diferencia:</strong> {${results.diffAB}}</p>`;
    });
    document.getElementById('calculateCombinatoriaBtn').addEventListener('click', () => {
        const n = parseInt(document.getElementById('nValue').value);
        const r = parseInt(document.getElementById('rValue').value);
        document.getElementById('combinatoriaResults').innerHTML = `<p><strong>P(${n},${r}):</strong> ${permutations(n, r)}</p><p><strong>C(${n},${r}):</strong> ${combinations(n, r)}</p>`;
    });
    document.getElementById('calculateProbBtn').addEventListener('click', () => {
        const pA = parseFloat(document.getElementById('probA').value);
        const pBgivenA = parseFloat(document.getElementById('probBgivenA').value);
        const results = multiplicativeRule(pA, pBgivenA);
        document.getElementById('probResults').innerHTML = `<p><strong>P(A ∩ B):</strong> ${results.result}</p>`;
        document.getElementById('treeDiagramArea').innerHTML = generateTreeHTML(results);
    });

    // --- Funcionalidad de Botones "Limpiar Resultados" ---
    document.getElementById('clearSetsResultsBtn').addEventListener('click', () => {
        document.getElementById('setAInput').value = '';
        document.getElementById('setBInput').value = '';
        document.getElementById('setResults').innerHTML = '';
    });
});