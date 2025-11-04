// Datos del sistema
const sitiosData = [
    {
        id: 1,
        nombre: "Teatro Colón",
        descripcion: "Una de las salas de ópera más prestigiosas del mundo, símbolo máximo de la cultura argentina.",
        imagen: "https://www.theatre-architecture.eu/res/archive/337/045900.jpg?seek=1535029599",
        atractivos: [
            { 
                nombre: "Visita guiada por el Teatro", 
                descripcion: "Recorrido por los principales espacios históricos del teatro.", 
                detalle: "Incluye el Foyer, Salón Dorado, Galería de Bustos y Platea; guías especializados cuentan historia, arquitectura y curiosidades." 
            },
            { 
                nombre: "Exhibiciones culturales", 
                descripcion: "Muestras relacionadas a la historia del teatro y la ópera.", 
                detalle: "Vestuarios, afiches, maquetas, piezas históricas y archivos fotográficos." 
            },
            { 
                nombre: "Tienda y espacios gastronómicos", 
                descripcion: "Souvenirs y servicios complementarios.", 
                detalle: "Libros, recuerdos del teatro, cafetería para visitantes." 
            },
        ]
    },
    {
        id: 2,
        nombre: "Puente de la Mujer",
        descripcion: "Icono moderno de Buenos Aires, símbolo de innovación y arquitectura contemporánea.",
        imagen: "https://cdn-media.italiani.it/site-buenosaires/2019/03/Puente-de-la-Mujer-Luces-de-noche-e1552009688826.jpeg",
        atractivos: [
            {
                nombre: "Puente giratorio",
                descripcion: "Estructura que puede rotar para permitir el paso de embarcaciones.",
                detalle: "Movimiento hidráulico (no siempre en uso, pero es parte de su atractivo técnico)."
            },
            { 
                nombre: "Vista panorámica", 
                descripcion: "Vista abierta a la ciudad de Puerto Madero.", 
                detalle: "Ideal para fotos, atardeceres y vistas nocturnas con reflejos sobre el agua." 
            },
            { 
                nombre: "Paseo ribereño", 
                descripcion: "Senderos peatonales frente al río.", 
                detalle: "Rodeado de restaurantes, parques, docks históricos y áreas verdes." 
            }
        ]
    },
    {
        id: 3,
        nombre: "Palacio Barolo",
        descripcion: "Obra arquitectónica única inspirada en la Divina Comedia, símbolo de la historia y la literatura en la ciudad.",
        imagen: "https://upload.wikimedia.org/wikipedia/commons/0/07/Palacio_Barolo.JPG",
        atractivos: [
            { 
                nombre: "Recorrido guiado", 
                descripcion: "Tour por el interior del edificio y sus niveles temáticos.", 
                detalle: "Inspirado en la Divina Comedia de Dante Alighieri; recorrido por Infierno, Purgatorio y Paraíso." 
            },
            { 
                nombre: "Mirador 360° y cúpula", 
                descripcion: "Vista panorámica única de la ciudad desde la cima.", 
                detalle: "Incluye acceso al faro —especialmente hermoso al atardecer y de noche—." 
            },
            { 
                nombre: "Pasajes internos", 
                descripcion: "Pasillos comerciales y oficinas históricas.", 
                detalle: "Espacios que conservan la estética original del edificio." 
            }
        ]
    }
];

const eventosData = [
    {
        tipo: "Teatro",
        titulo: "Obra: Sueños de la Pampa",
        artista: "Compañía Teatro Local",
        descripcion: "Obra teatral sobre las tradiciones gauchas",
        lugar: "Plaza Central",
        fecha: "2025-11-05",
        horario: "20:00 hs"
    },
    {
        tipo: "Cine",
        titulo: "Película: Historia de la Ciudad",
        artista: "Cine Ambulante Regional",
        descripcion: "Documental sobre los 200 años de historia local",
        lugar: "Parque Natural",
        fecha: "2025-11-08",
        horario: "19:30 hs"
    },
    {
        tipo: "Música",
        titulo: "Concierto: Folklore Regional",
        artista: "Conjunto Los Aromos",
        descripcion: "Música folklórica tradicional en vivo",
        lugar: "Museo de Arte",
        fecha: "2025-11-10",
        horario: "21:00 hs"
    },
    {
        tipo: "Teatro",
        titulo: "Obra: Comedias del Pueblo",
        artista: "Grupo Juvenil de Teatro",
        descripcion: "Comedia sobre las costumbres locales",
        lugar: "Plaza Central",
        fecha: "2025-11-12",
        horario: "20:30 hs"
    }
];

let centrosData = [];
let incidentsData = [];
let map = null;
let markersLayer = null;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    renderSitios();
    renderEventos();
    loadIncidents();
    updateCenters();
    
    // Configurar fecha máxima como hoy
    document.getElementById('incident-date').max = new Date().toISOString().split('T')[0];
    
    // Form handler
    document.getElementById('incident-form').addEventListener('submit', handleIncidentSubmit);
    
    // Cerrar modal al hacer click fuera
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
});

function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    // Mostrar sección seleccionada
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
    
    // Inicializar mapa si se selecciona centros
    if (sectionId === 'centros' && !map) {
        initMap();
    }
}

function renderSitios() {
    const grid = document.getElementById('sitios-grid');
    grid.innerHTML = sitiosData.map(sitio => `
        <div class="card" onclick="showSitioDetail(${sitio.id})">
            <img src="${sitio.imagen}" alt="${sitio.nombre}">
            <h3>${sitio.nombre}</h3>
            <p>${sitio.descripcion}</p>
            <button class="btn">Ver Atractivos</button>
        </div>
    `).join('');
}

function showSitioDetail(sitioId) {
    const sitio = sitiosData.find(s => s.id === sitioId);
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <img src="${sitio.imagen}" style="width: 100%; height: 350px; border-radius: 8px; margin-bottom: 20px;">
        <h2>${sitio.nombre}</h2>
        <p style="margin-bottom: 25px; color: #666;">${sitio.descripcion}</p>
        <h3 style="margin-bottom: 15px; color: var(--primary);">Atractivos:</h3>
        ${sitio.atractivos.map(a => `
            <div style="background: var(--light); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h4 style="color: var(--secondary); margin-bottom: 8px;">${a.nombre}</h4>
                <p style="margin-bottom: 10px;"><strong>Resumen:</strong> ${a.descripcion}</p>
                <p style="color: #555;"><strong>Detalle:</strong> ${a.detalle}</p>
            </div>
        `).join('')}
    `;
    
    document.getElementById('modal').classList.add('active');
}

function renderEventos() {
    const container = document.getElementById('eventos-container');
    container.innerHTML = eventosData.map(evento => `
        <div class="event-item">
            <h4>🎭 ${evento.titulo}</h4>
            <p><strong>Artista/Grupo:</strong> ${evento.artista}</p>
            <p>${evento.descripcion}</p>
            <div class="event-info">
                <span>📍 ${evento.lugar}</span>
                <span>📅 ${new Date(evento.fecha).toLocaleDateString('es-AR')}</span>
                <span>🕐 ${evento.horario}</span>
                <span>🎬 ${evento.tipo}</span>
            </div>
        </div>
    `).join('');
}

function initMap() {
    // Inicializar mapa centrado en una ubicación
    map = L.map('map').setView([-34.6037, -58.3816], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    markersLayer = L.layerGroup().addTo(map);
    
    renderCentrosOnMap();
}

function renderCentrosOnMap() {
    if (!map || !markersLayer) return;
    
    markersLayer.clearLayers();
    
    centrosData.forEach(centro => {
        const icon = L.divIcon({
            className: 'custom-icon',
            html: `<div style="background: ${centro.tipo === 'fijo' ? '#00c0db' : 'var(--success)'}; 
                   color: white; width: 40px; height: 40px; border-radius: 50%; 
                   display: flex; align-items: center; justify-content: center; 
                   font-weight: bold; font-size: 18px; border: 3px solid white;
                   box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                   ${centro.tipo === 'fijo' ? 'C' : 'M'}
                   </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        
        const marker = L.marker([centro.lat, centro.lng], { icon: icon }).addTo(markersLayer);
        
        marker.bindPopup(`
            <strong>${centro.nombre}</strong><br>
            Tipo: ${centro.tipo === 'fijo' ? 'Centro Fijo' : 'Móvil'}<br>
            Horario: ${centro.horario}<br>
            ${centro.servicios ? 'Servicios: ' + centro.servicios : ''}<br>
            <a href="https://www.google.com/maps/search/?api=1&query=${centro.direccion}" target="_blank">${centro.direccion ? 'Dirección: ' + centro.direccion : ''}</a>
        `);
    });
    
    renderCentrosInfo();
}

function renderCentrosInfo() {
    const container = document.getElementById('centros-info');
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">
            ${centrosData.map(centro => `
                <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid ${centro.tipo === 'fijo' ? '#00c0db' : 'var(--success)'};">
                    <h4 style="margin-bottom: 8px;">${centro.nombre}</h4>
                    <p style="font-size: 13px; color: #666;">
                        <strong>Tipo:</strong> ${centro.tipo === 'fijo' ? 'Centro Fijo' : 'Móvil'}<br>
                        <strong>Horario:</strong> ${centro.horario}<br>
                        ${centro.servicios ? '<strong>Servicios:</strong> ' + centro.servicios : ''}<br>
                        ${centro.direccion ? '<strong>Dirección:</strong> ' + centro.direccion : ''}
                    </p>
                </div>
            `).join('')}
        </div>
    `;
}

async function updateCenters() {
    try {
        // Simular llamada a sistema externo de posicionamiento
        document.getElementById('update-status').textContent = 'Actualizando...';
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular datos obtenidos del sistema externo
        centrosData = [
            { nombre: "Centro Médico Monserrat", tipo: "fijo", lat: -34.6092, lng: -58.3834, horario: "De lunes a viernes de 07:00 - 20:00 hs", servicios: "Info, Primeros Auxilios", direccion: "Av. Hipólito Yrigoyen 1210, Cdad. Autónoma de Buenos Aires" },
            { nombre: "Centro Medico Arenales", tipo: "fijo", lat: -34.5942, lng: -58.3904, horario: "De lunes a viernes de 08:00 - 20:00 hs", servicios: "Info, Asistencia", direccion: "Arenales 1611, Cdad. Autónoma de Buenos Aires" },
            { nombre: "Unidad Sanitaria Móvil 1", tipo: "movil", lat: -34.6137, lng: -58.3716, horario: "11:00 - 17:00", servicios: "Info General", direccion: "Monasterio 480, Cdad. Autónoma de Buenos Aires"},
            { nombre: "Unidad Sanitaria Móvil 2", tipo: "movil", lat: -34.6037, lng: -58.4016, horario: "09:00 - 15:00", servicios: "Info, Primeros Auxilios", direccion: "Av. Cnel. Díaz 2444, Cdad. Autónoma de Buenos Aires"},
            { nombre: "Hospital Británico", tipo: "fijo", lat: -34.6334, lng: -58.3878, horario: "Abierto las 24 hs", servicios: "Info, Asistencia, Primeros Auxilios", direccion: "Perdriel 74, Cdad. Autónoma de Buenos Aires"}
        ];
        
        const now = new Date();
        document.getElementById('last-update').textContent = now.toLocaleString('es-AR');
        document.getElementById('update-status').textContent = 'OK';
        document.getElementById('update-status').style.color = 'var(--success)';
        
        if (map) {
            renderCentrosOnMap();
        }
        
        //alert('✅ Centros actualizados correctamente');
        
    } catch (error) {
        document.getElementById('update-status').textContent = 'ERROR';
        document.getElementById('update-status').style.color = 'var(--accent)';
        
        // Simular envío de email de error
        console.error('Error al actualizar centros:', error);
        alert('Error al actualizar centros. Se ha enviado un correo a coordinación.');
    }
}

function handleIncidentSubmit(e) {
    e.preventDefault();
    
    const incident = {
        id: Date.now(),
        place: document.getElementById('incident-place').value,
        date: document.getElementById('incident-date').value,
        description: document.getElementById('incident-description').value,
        name: document.getElementById('incident-name').value || 'Anónimo',
        email: document.getElementById('incident-email').value,
        status: 'pending',
        reportDate: new Date().toISOString()
    };
    
    incidentsData.push(incident);
    saveIncidents();
    
    document.getElementById('form-message').innerHTML = `
        <div class="alert alert-success">
            ✅ Incidente reportado correctamente. ${incident.email ? 'Recibirás notificaciones en tu email.' : ''}
        </div>
    `;
    
    document.getElementById('incident-form').reset();
    
    setTimeout(() => {
        document.getElementById('form-message').innerHTML = '';
    }, 5000);
}

function saveIncidents() {
    localStorage.setItem('incidents', JSON.stringify(incidentsData));
}

function loadIncidents() {
    const saved = localStorage.getItem('incidents');
    if (saved) {
        incidentsData = JSON.parse(saved);
    }
    renderIncidentsList();
}

function renderIncidentsList() {
    const container = document.getElementById('incidents-list');
    
    if (incidentsData.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No hay incidentes reportados.</p>';
        return;
    }
    
    container.innerHTML = incidentsData.map(incident => `
        <div class="incident-card">
            <div class="incident-header">
                <div>
                    <h4 style="color: var(--primary); margin-bottom: 5px;">📍 ${incident.place}</h4>
                    <small style="color: #666;">Reportado: ${new Date(incident.reportDate).toLocaleString('es-AR')}</small>
                </div>
                <span class="incident-status status-${incident.status}">
                    ${incident.status === 'pending' ? 'Pendiente' : incident.status === 'resolved' ? 'Resuelto' : 'Desestimado'}
                </span>
            </div>
            
            <p><strong>Fecha del incidente:</strong> ${new Date(incident.date).toLocaleDateString('es-AR')}</p>
            <p><strong>Descripción:</strong> ${incident.description}</p>
            <p><strong>Reportado por:</strong> ${incident.name} ${incident.email ? `(${incident.email})` : ''}</p>
            
            ${incident.resolution ? `
                <div style="background: var(--light); padding: 10px; border-radius: 6px; margin-top: 10px;">
                    <strong>Resolución:</strong> ${incident.resolution}
                </div>
            ` : ''}
            
            <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                ${incident.status === 'pending' ? `
                    <button class="btn btn-success" onclick="resolveIncident(${incident.id})">Resolver</button>
                    <button class="btn btn-danger" onclick="dismissIncident(${incident.id})">Desestimar</button>
                ` : ''}
                <button class="btn btn-delete" onclick="deleteIncident(${incident.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function resolveIncident(id) {
    const resolution = prompt('Ingresa el detalle de la resolución:');
    
    if (!resolution) return;
    
    const incident = incidentsData.find(i => i.id === id);
    if (incident) {
        incident.status = 'resolved';
        incident.resolution = resolution;
        incident.resolvedDate = new Date().toISOString();
        
        saveIncidents();
        renderIncidentsList();
        
        // Simular envío de email
        if (incident.email) {
            console.log(`Email enviado a ${incident.email} con la resolución`);
            alert(`Incidente resuelto. Se ha enviado un email a ${incident.email}`);
        } else {
            alert('Incidente resuelto correctamente.');
        }
    }
}

function dismissIncident(id) {
    if (!confirm('¿Estás seguro de desestimar este incidente?')) return;
    
    const incident = incidentsData.find(i => i.id === id);
    if (incident) {
        incident.status = 'dismissed';
        incident.dismissedDate = new Date().toISOString();
        
        saveIncidents();
        renderIncidentsList();
        
        alert('Incidente desestimado.');
    }
}

function deleteIncident(id) {
    if (!confirm('¿Estás seguro de eliminar permanentemente este incidente?')) return;
    
    incidentsData = incidentsData.filter(i => i.id !== id);
    saveIncidents();
    renderIncidentsList();
    
    alert('Incidente eliminado correctamente.');
}

function refreshIncidents() {
    loadIncidents();
    alert('Lista de incidentes actualizada.');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}