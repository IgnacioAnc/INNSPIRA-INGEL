/* ==========================================================================
   MÓDULO 3: GRÁFICO ESTADÍSTICO DE VALIDACIÓN DE IMPACTO (Chart.js Engine)
   ========================================================================== */
let trafficChart;
let currentView = 'reaction'; // Controla el estado del botón de métricas

document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('trafficChart').getContext('2d');

    // Configuración inicial: Metros recorridos a ciegas por velocidad
    const speedLabels = ['80 km/h', '100 km/h', '120 km/h (Límite Máx)'];
    
    // Datos calculados: Distancia de reacción humana (1.5s) vs Tiempo ganado por EVI-Cap
    const humanReactionDistance = [33, 42, 50]; // metros recorridos antes de frenar
    const eviCapSafetyMargin = [28, 37, 45];     // metros de advertencia anticipada salvados

    trafficChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: speedLabels,
            datasets: [
                {
                    label: 'Distancia de Reacción Humana (Metros a ciegas)',
                    data: humanReactionDistance,
                    backgroundColor: 'rgba(255, 69, 58, 0.25)', // Rojo Apple sutil
                    borderColor: '#ff453a', // Rojo Apple sólido
                    borderWidth: 1.5,
                    borderRadius: 8,
                    barPercentage: 0.6
                },
                {
                    label: 'Margen de Evacuación Salvado por EVI-Cap (Metros)',
                    data: eviCapSafetyMargin,
                    backgroundColor: 'rgba(41, 151, 255, 0.25)', // Azul Apple sutil
                    borderColor: '#2997ff', // Azul Apple sólido
                    borderWidth: 1.5,
                    borderRadius: 8,
                    barPercentage: 0.6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#86868b',
                        font: { family: 'Inter', size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${context.raw} metros`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { 
                        color: '#86868b',
                        font: { family: 'Inter', size: 11 },
                        callback: function(value) { return value + ' m'; }
                    },
                    title: {
                        display: true,
                        text: 'Distancia Crítica en Carretera',
                        color: '#86868b',
                        font: { family: 'Inter', size: 11 }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { 
                        color: '#ffffff',
                        font: { family: 'Inter', size: 12, weight: 'bold' }
                    }
                }
            }
        }
    });
});

// Función interactiva para cambiar el set de datos y sorprender al jurado en vivo
window.toggleMetricView = function() {
    const btn = document.getElementById('btn-metric');
    
    if (currentView === 'reaction') {
        // Cambiar a vista alternativa: Distribución de Causas de Accidentes en Obras según CONASET
        trafficChart.data.labels = ['Exceso de Velocidad', 'Condición Climática / Niebla', 'Distracción al Volante'];
        trafficChart.data.datasets[0].label = '% Incidencia en Siniestros Fatales';
        trafficChart.data.datasets[0].data = [45, 35, 20]; // Porcentajes promedio ponderados
        trafficChart.data.datasets[0].borderColor = '#ff9500'; // Ámbar Precaución
        trafficChart.data.datasets[0].backgroundColor = 'rgba(255, 149, 0, 0.2)';
        
        // Ocultar el segundo dataset temporalmente para esta métrica
        trafficChart.data.datasets[1].data = [];
        
        trafficChart.options.scales.y.ticks.callback = function(value) { return value + '%'; };
        trafficChart.options.scales.y.title.text = 'Porcentaje de Siniestralidad Vial';
        
        btn.innerText = 'Ver Distancias de Frenado';
        currentView = 'stats';
    } else {
        // Volver a la vista de metros de reacción inicial
        trafficChart.data.labels = ['80 km/h', '100 km/h', '120 km/h (Límite Máx)'];
        trafficChart.data.datasets[0].label = 'Distancia de Reacción Humana (Metros a ciegas)';
        trafficChart.data.datasets[0].data = [33, 42, 50];
        trafficChart.data.datasets[0].borderColor = '#ff453a';
        trafficChart.data.datasets[0].backgroundColor = 'rgba(255, 69, 58, 0.25)';
        
        trafficChart.data.datasets[1].label = 'Margen de Evacuación Salvado por EVI-Cap (Metros)';
        trafficChart.data.datasets[1].data = [28, 37, 45];
        
        trafficChart.options.scales.y.ticks.callback = function(value) { return value + ' m'; };
        trafficChart.options.scales.y.title.text = 'Distancia Crítica en Carretera';
        
        btn.innerText = 'Ver Datos de Causas de Accidentes';
        currentView = 'reaction';
    }
    
    trafficChart.update();
};
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
/* ==========================================================================
   Inicialización de Red Mesh (Nodos con Forma de Conos de Tránsito)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Vector SVG de cono estilizado en cian de alta definición mapeado para Particles.js
    const coneSvgUri = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='38,22 62,22 82,80 18,80' stroke='%2300f3ff' stroke-width='6' fill='none' stroke-linejoin='round'/><line x1='10' y1='87' x2='90' y2='87' stroke='%2300f3ff' stroke-width='9' stroke-linecap='round'/><line x1='32' y1='44' x2='68' y2='44' stroke='%2300f3ff' stroke-width='5'/><line x1='25' y1='63' x2='75' y2='63' stroke='%2300f3ff' stroke-width='5'/></svg>";

    if (document.getElementById('particles-mesh')) {
        particlesJS("particles-mesh", {
            "particles": {
                "number": {
                    "value": 30, // Reducimos ligeramente la cantidad para que la pantalla no se sature de conos
                    "density": {
                        "enable": true,
                        "value_area": 900
                    }
                },
                "color": {
                    "value": "#00f3ff"
                },
                /* CAMBIO CLAVE: Transformamos los nodos en imágenes vectoriales (Conos) */
                "shape": {
                    "type": "image",
                    "image": {
                        "src": coneSvgUri,
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.9,
                    "random": false
                },
                /* Escalamos el tamaño para que la silueta del cono sea perfectamente legible */
                "size": {
                    "value": 22, 
                    "random": true, // Mantiene conos de diferentes tamaños emulando profundidad en la carretera
                    "anim": {
                        "enable": false // Desactivado para que los conos no se deformen al parpadear
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 180, // Distancia extendida para que las líneas crucen limpiamente entre los conos
                    "color": "#00f3ff",
                    "opacity": 0.5,
                    "width": 1.5
                },
                "move": {
                    "enable": true,
                    "speed": 1.0, // Flotación lenta y tecnológica estilo radar vial
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab" // El entramado láser se amarra a tu cursor al pasar el mouse
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push" // Despliega un cono extra al hacer clic
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 220,
                        "line_linked": {
                            "opacity": 0.95
                        }
                    }
                }
            },
            "retina_detect": true
        });
    }
});