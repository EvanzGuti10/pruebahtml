const obtenerrecientes = async() => {
    try {
        // Consumiendo las APIs
        const response = await axios.get('https://docs.google.com/spreadsheets/d/1Ofhoa9d0CDoWcMK1CDhdTXTb_9h5_7J35pIiYmsMXdo/gviz/tq?tqx=out:json&gid=0');
        const data = response.data;
        // Eliminar los primeros 47 caracteres
        let trimmedString = data.slice(47);
        // Eliminar los últimos 2 caracteres
        let animes = JSON.parse(trimmedString.slice(0, -2));
        let ltsanimes = animes.table.rows;
        localStorage.setItem("listaanimes", JSON.stringify(ltsanimes));

        // Consumiendo las APIs
        const responses = await axios.get('https://filemoonapi.com/api/file/list?key=54340gjpnv8a0abxcv6s4');
        const datas = responses.data;
        // Eliminar los últimos 2 caracteres
        let recient = datas.result;
        let ltsreciente = recient;
        localStorage.setItem("listarecientes", JSON.stringify(ltsreciente));

        location.href = "inicio.html";
                
    } catch (e) {
        console.log(e);
    }
}

obtenerrecientes();