/* ==========================================================================
   EVI-Cap IIoT Telemetry & Simulation Engine
   ========================================================================== */

const ctx = document.getElementById('trafficChart').getContext('2d');
let timeLabels = Array(30).fill('');
let speedData = Array(30).fill(0);
let carsCount = 1248;

// Gradiente estético para el área de relleno del gráfico (Modo Normal)
let gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

// Inicialización del objeto Chart.js
const trafficChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Velocidad (km/h)',
            data: speedData,
            borderColor: '#f59e0b',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 }, // Desactivado para simular refresco de flujo de datos Edge real
        scales: {
            y: { 
                min: 0, 
                max: 150, 
                grid: { color: '#1e293b' }, 
                ticks: { color: '#64748b', stepSize: 30 } 
            },
            x: { 
                grid: { display: false } 
            }
        },
        plugins: { 
            legend: { display: false } 
        }
    }
});

/**
 * Bucle cíclico en background. Simula lecturas del ADC del microcontrolador
 * adquiriendo ráfagas de frecuencia del pin IF del Radar Doppler.
 */
setInterval(() => {
    let currentStatus = document.getElementById('status-panel').classList.contains('alerta-activa');
    let nextSpeed;

    if (currentStatus) {
        // Simulación de auto perdiendo el control hacia la berma (Frecuencia Doppler alta)
        nextSpeed = Math.floor(Math.random() * (135 - 110) + 110);
    } else {
        // Simulación de autopista normal
        nextSpeed = Math.random() > 0.8 ? Math.floor(Math.random() * (100 - 70) + 70) : Math.floor(Math.random() * 20);
        
        // Si el vehículo pasa rápido por las pistas centrales, incrementa el contador de flujo global
        if (nextSpeed > 70) {
            carsCount++;
            document.getElementById('car-count').innerText = carsCount.toLocaleString();
        }
    }

    speedData.shift();
    speedData.push(nextSpeed);
    trafficChart.update();
}, 300);

/**
 * Disparador asíncrono para emular una interrupción de hardware externa
 * por invasión crítica y el broadcast automático inmediato vía protocolo ESP-NOW.
 */
function triggerSimulatedInvasion() {
    const panel = document.getElementById('status-panel');
    const text = document.getElementById('status-text');
    const chartDataset = trafficChart.data.datasets[0];

    // Transición de la interfaz a modo de Alerta Inminente
    panel.classList.remove('bg-emerald-500', 'text-slate-950');
    panel.classList.add('alerta-activa', 'text-white');
    text.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> ¡ALERTA HÁPTICA ENVIADA!';
    
    // Mutación dinámica del gráfico a color de peligro (Rojo)
    chartDataset.borderColor = '#ef4444';
    let redGradient = ctx.createLinearGradient(0, 0, 0, 400);
    redGradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
    redGradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
    chartDataset.backgroundColor = redGradient;

    // Temporizador para restaurar la vigilancia automática estable en ruta
    setTimeout(() => {
        panel.classList.remove('alerta-activa', 'text-white');
        panel.classList.add('bg-emerald-500', 'text-slate-950');
        text.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Operación Segura';
        
        chartDataset.borderColor = '#f59e0b';
        chartDataset.backgroundColor = gradient;
    }, 3500);
}