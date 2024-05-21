let animeselec = '';

let animes = '';
let recientes = '';

//obteniendo los parametros de la url
const parametro = new URLSearchParams(window.location.search);
const nide = parametro.get('id');

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

//llenar anime seleccionado
function llenarcontenido() {
    animes = localStorage.getItem("listaanimes");

    let ltsanimes = JSON.parse(animes);

    let animeseleccionado = [];

    //buscar anime seleccionado
    for (let i = 0; i < ltsanimes.length; i++) {
        let fld_id = ltsanimes[i].c[2].v;
        if (fld_id == nide) {
            animeseleccionado.push(ltsanimes[i].c[2].v);
            animeseleccionado.push(ltsanimes[i].c[1].v);
            animeseleccionado.push(ltsanimes[i].c[0].v);
            break;
        }
    }

    //agregando al html
    animeselec += '';

    document.getElementById("imganime").innerHTML = '<img src="' + animeseleccionado[1] + '" alt="" class="imagensel"><h2 class="titulo-pag" id="titulosel">' + animeseleccionado[2] + '</h2>';

    /*
        //agregando al html
        for (let i = 0; i < ani.length; i = i + 3) {
            animessubt += '<a class="itemanime" href="detalle.html?id=' + ani[i] + '"><div class="item"><img loading="lazy" src="' + ani[i + 1] + '" alt="" class="item-img"><div class="item-txt"><h3>' + ani[i + 2] + '</h3></div></div></a>';
        }

        document.getElementById("element").innerHTML = animessubt;*/

    cargarcapitulos(animeseleccionado[0]);

    actualizar();

}

//Para ordenar
function sortCodes(a, b) {
    const [codeA, codeB] = [a.split('@')[0], b.split('@')[0]];
    const [numA, numB] = [parseInt(codeA.split('.')[0].slice(1)), parseInt(codeB.split('.')[0].slice(1))];
    const [decimalA, decimalB] = [parseFloat(codeA.split('.')[1] || '0'), parseFloat(codeB.split('.')[1] || '0')];

    if (numA < numB) {
        return -1;
    } else if (numA > numB) {
        return 1;
    } else if (decimalA < decimalB) {
        return -1;
    } else if (decimalA > decimalB) {
        return 1;
    } else {
        return 0;
    }
}

const llenarcapitulos = document.querySelector(".capitulos");
let caplist = '';
let vector = [];

const cargarcapitulos = async (animeseleccionado) => {
    try {

        const ncapitulos = await axios.get('https://filemoonapi.com/api/file/list?key=54340gjpnv8a0abxcv6s4&fld_id=' + animeseleccionado + '');
        let listacapitulos = ncapitulos.data.result.files;

        let epi = [];
        //uniendo para ordenar
        for (let i = 0; i < listacapitulos.length; i++) {
            epi.push(listacapitulos[i].title + "@" + listacapitulos[i].file_code + "@filemoon.sx" );
        }
        epi.sort(sortCodes);

        let veccap = [];

        //separando los capitulos
        for (let i = 0; i < epi.length; i++) {
            let valor = epi[i].split("@");
            if (valor[0].charAt(0) == 'O') {
                veccap.push("Ova " + valor[0].slice(1));
            } else if (valor[0].charAt(0) == 'E') {
                veccap.push("Especial " + valor[0].slice(1));
            } else {
                veccap.push("Capitulo " + valor[0].slice(1));
            }
            veccap.push(valor[1]);
            veccap.push(valor[2]);
        }

        //agregando al html
        for (let i = 0; i < veccap.length; i = i + 3) {
            vector.push(veccap[i]);
            vector.push(veccap[i + 1]);
            vector.push(veccap[i + 2]);
            let variables = 'mostrar(' + i + ')';
            caplist += '<div class="list"><div id="liscap" onclick=' + variables + '><p><span>' + veccap[i] + '</span></p></div><div id="desc"><a href="' + 'https://' + veccap[i + 2] + '/d/' + veccap[i + 1] + '.html' + '" class="btndes" target="_blank"><i class="icono-down"></i></a></div></div>';
        }

        llenarcapitulos.innerHTML = caplist;


    } catch (e) {
        console.log(e);
    }
}

let video = document.querySelector('.video-container');
let closeBtn = document.querySelector('.close-video');

function mostrar(i) {
    //agregamos el div de visualizacion del anime
    let agregar = '';
    agregar += '<div class="cabe"><h2 class="titulo-cap">' + vector[i] + '</h2><h2 class="close-video" onclick="borrar()">X</h2></div><div class="video-box"><iframe id="myVideo" src="https://' + vector[i + 2] + '/e/' + vector[i + 1] + '.html?autoplay=1" frameborder=0 scrolling=no allowfullscreen></iframe></div>';
    video.innerHTML = agregar;
    video.classList.add('show-video');
}

function borrar() {
    var padre = document.getElementById("padre");
    var cabe = document.querySelector(".cabe");
    var vid = document.querySelector(".video-box");
    padre.removeChild(cabe);
    padre.removeChild(vid);
    video.classList.remove('show-video');
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