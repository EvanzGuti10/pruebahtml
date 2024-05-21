let animesrecientes = '';

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
    let ltsrecientes = JSON.parse(recientes).files;

    //vector con los animes recientes
    let reci = [];

    console.log(ltsrecientes);
    //agregando todos los nuevos capitulos con sus imagenes
    for (let i = 0; i < ltsrecientes.length; i++) {
        for (let j = 0; j < ltsanimes.length; j++) {
            if (ltsrecientes[i].fld_id == ltsanimes[j].c[2].v) {
                reci.push(ltsanimes[j].c[2].v);
                reci.push(ltsanimes[j].c[1].v);
                reci.push(ltsanimes[j].c[0].v);
                //reci.push(ltsrecientes[i].title);
                const capi = ltsrecientes[i].title;
                if (capi.charAt(0) == 'O') {
                    reci.push("Ova " + capi.slice(1));
                } else if (capi.charAt(0) == 'E') {
                    reci.push("Especial " + capi.slice(1));
                } else {
                    reci.push("Capitulo " + capi.slice(1));
                }
                break;
            }
        }
    }

    //agregando al html
    for (let i = 0; i < reci.length; i = i + 4) {
        animesrecientes += '<a class="itemanime" href="detalle.html?id=' + reci[i] + '"><div class="item"><img loading="lazy" src="' + reci[i + 1] + '" alt="" class="item-img"><div class="item-txt"><h3>' + reci[i + 2] + '</h3><p>' + reci[i + 3] + '</p></div></div></a>';
    }

    document.getElementById("element").innerHTML = animesrecientes;
    actualizar();

}

const actualizar = async () => {
    try {
        //consumiendo api de recientes
        const nrecientes = await axios.get('https://filemoonapi.com/api/file/list?key=54340gjpnv8a0abxcv6s4');
        let listrecie = nrecientes.data.result;
        console.log(listrecie);

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