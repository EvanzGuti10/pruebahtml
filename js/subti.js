let animessubt = '';

let animes = '';
let recientes = '';

//filtrar los animes
const formulario = document.querySelector('#buscartexto');
const llenarbusqueda = document.querySelector('#element1');
formulario.addEventListener('keyup', filtrar);

function filtrar() {
    let datos = '';
    llenarbusqueda.innerHTML = '';
    const texto = formulario.value.toLowerCase();

    let ltsanimes = JSON.parse(animes);

    if (texto.length > 2) {
        document.getElementById('contenido1').style.display = 'none';
        document.getElementById('buscador').style.display = '';
    } else {
        document.getElementById('buscador').style.display = 'none';
        document.getElementById('contenido1').style.display = '';
    }

    for (let i = 0; i < ltsanimes.length; i++) {
        let nombre = ltsanimes[i].c[0].v.toLowerCase();

        if (nombre.indexOf(texto) != -1) {
            datos += '<a class="itemanime" href="detalle.html?id=' + ltsanimes[i].c[2].v + '"><div class="item"><img loading="lazy" src="' + ltsanimes[i].c[1].v + '" alt="" class="item-img"><div class="item-txt"><h3>' + ltsanimes[i].c[0].v + '</h3></div></div></a>';
        }
    }

    llenarbusqueda.innerHTML += datos;

}

//llenar los animes recientes
function llenarcontenido() {
    animes = localStorage.getItem("listaanimes");
    recientes = localStorage.getItem("listarecientes");

    let ltsanimes = JSON.parse(animes);

    //vector con los animes subtitulados
    let ani = [];

    //agregando todos los animes subtitulados con sus imagenes
    for (let i = 0; i < ltsanimes.length; i++) {
        let nomb = ltsanimes[i].c[0].v;
        let partes = nomb.split(" ");
        if (partes[partes.length - 1] != "Latino") {
            ani.push(ltsanimes[i].c[2].v);
            ani.push(ltsanimes[i].c[1].v);
            ani.push(ltsanimes[i].c[0].v);
        }
    }

    //agregando al html
    for (let i = 0; i < ani.length; i = i + 3) {
        animessubt += '<a class="itemanime" href="detalle.html?id=' + ani[i] + '"><div class="item"><img loading="lazy" src="' + ani[i + 1] + '" alt="" class="item-img"><div class="item-txt"><h3>' + ani[i + 2] + '</h3></div></div></a>';
    }

    document.getElementById("element").innerHTML = animessubt;
    actualizar();

}

const actualizar = async () => {
    try {

        //consumiendo api de recientes
        const nrecientes = await axios.get('https://filemoonapi.com/api/file/list?key=54340gjpnv8a0abxcv6s4');
        let listrecie = nrecientes.data.result;

        //verificando si se subio reciente
        if (JSON.stringify(listrecie) != recientes) {
            // Consumiendo las APIs
            const response = await axios.get('https://docs.google.com/spreadsheets/d/1Ofhoa9d0CDoWcMK1CDhdTXTb_9h5_7J35pIiYmsMXdo/gviz/tq?tqx=out:json&gid=0');
            const data = response.data;
            // Eliminar los primeros 47 caracteres
            let trimmedString = data.slice(47);
            // Eliminar los últimos 2 caracteres
            let animes = JSON.parse(trimmedString.slice(0, -2));
            let ltsanimes = animes.table.rows;

            localStorage.setItem("listarecientes", JSON.stringify(listrecie));
            localStorage.setItem("listaanimes", JSON.stringify(ltsanimes));

        }

        actualizar();

    } catch (e) {
        console.log(e);
    }

}

llenarcontenido();