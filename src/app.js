const API_URL = 'http://localhost:3000';
let peliculas = [];

// Obtener las peliculas desde el servidor
async function cargarPeliculas() {
    try {
        const res = await fetch(`${API_URL}/taquillera`);
        peliculas = await res.json();

        MostrarPeliculas(peliculas);

    } catch (error) {
        console.error('Error al cargar las películas:', error);
    }
}

// Renderizar las peliculas
function MostrarPeliculas(lista) {
    const contenedor = document.getElementById('listaPeliculas');
    contenedor.innerHTML = '';

    lista.forEach(p => {
        const card = document.createElement('div')
        card.className = 'bg-white rounded-2xl shadow-lg p-4';
        card.innerHTML = `
            <h3 class="text-lg font-bold text-blue-600">${p.pelicula}</h3>
            <p class="text-sm text-gray-600 mb-2">ID: ${p.id || '----'}</p>
            <p class="text-gray-600">${p.recaudacion}</p>
            `;
        contenedor.appendChild(card);
    });
}

function renderizarPelicula(pelicula) {
    const contenedor = document.getElementById('listaPeliculas');
    const card = document.createElement('div')
    card.className = 'bg-white rounded-2xl shadow-lg p-4';
    card.innerHTML = `
            <h3 class="text-lg font-bold text-blue-600">${pelicula.pelicula}</h3>
            <p class="text-sm text-gray-600 mb-2">ID: ${pelicula.id || '----'}</p>
            <p class="text-gray-600">${pelicula.recaudacion}</p>
            `;
    contenedor.appendChild(card);
}

function mostrarNotificacion(mensaje, tipo = "exito") {
    const notif = document.getElementById("notificacion");
    notif.textContent = mensaje;
    notif.className = "p-4 rounded-lg shadow-md text-white font-medium mb-4 " +
        (tipo === "error" ? "bg-red-500" : "bg-green-500");
    notif.classList.remove("hidden");

    setTimeout(() => notif.classList.add("hidden"), 3000)
}

document.getElementById('formPelicula').addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value;
    const pelicula = document.getElementById("pelicula").value;
    const recaudacion = document.getElementById("recaudacion").value;

    if (!id) {
        mostrarNotificacion("El campo ID, esta vacio.", "error");
        return;
    }

    try {
        await fetch(`${API_URL}/taquillera`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ id, pelicula, recaudacion })
        });

        const obj_peli = {
            id,
            pelicula,
            recaudacion
        }

        mostrarNotificacion("Pelicula taquillera agregada correctamente");
        //e.target.reset();
        renderizarPelicula(obj_peli);
    } catch (error) {
        mostrarNotificacion("Error al agregar la pelicula taquillera", "error");
    }
})

// Generar id
const generarID = () => {
    const useIds = new Set();

    return function () {
        let id;
        do {
            id = Math.floor(Math.random() * 1000000) + 1;
        } while (useIds.has(id))
        useIds.add(id);
        return id;
    }
}

// Agregar el id generado, al precionar el boton
document.getElementById('btn-generate').addEventListener("click", (e) => {
    e.preventDefault();
    const idFiled = document.getElementById("id");
    const newID = generarID()();
    idFiled.value = newID;
})

cargarPeliculas();