// Estado de productos (array en memoria)
let productos = [];

// Elementos del DOM
const productoForm = document.getElementById('producto-form');
const listaProductos = document.getElementById('lista-productos');
const logOperaciones = document.getElementById('log-operaciones');
const tipoFacturaSelect = document.getElementById('tipo-factura');
const rncInput = document.getElementById('rnc-comprador');
const nombreInput = document.getElementById('nombre-comprador');

// Habilita/deshabilita campos según tipo de factura
function actualizarCamposComprador() {
    if (tipoFacturaSelect.value === '32') {
        rncInput.value = '';
        nombreInput.value = '';
        rncInput.disabled = true;
        nombreInput.disabled = true;
    } else {
        rncInput.disabled = false;
        nombreInput.disabled = false;
    }
}
actualizarCamposComprador();
tipoFacturaSelect.addEventListener('change', actualizarCamposComprador);

// Acortar descripción de productos en gráfico SVG
function dividirEnLineas(texto, maxCharPorLinea = 10, maxLineas = 2) {
    let palabras = texto.split(' ');
    let lineas = [];
    let actual = '';
    for (let palabra of palabras) {
        if ((actual + ' ' + palabra).trim().length <= maxCharPorLinea) {
            actual = (actual + ' ' + palabra).trim();
        } else {
            lineas.push(actual);
            actual = palabra;
            if (lineas.length === maxLineas - 1) break;
        }
    }
    if (lineas.length < maxLineas) {
        lineas.push(actual);
    }
    // Si hay palabras sin incluir, añadir puntos suspensivos
    if (palabras.join(' ').length > lineas.join('').length) {
        lineas[lineas.length - 1] = lineas[lineas.length - 1].replace(/\s+$/, '') + '...';
    }
    return lineas;
}


// Función para mostrar productos en la lista (oculta la lista)
function mostrarProductos() {
    listaProductos.innerHTML = '';
    mostrarDetalleFactura();
}

// Función para agregar producto
productoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('prod-nombre').value.trim();
    const cantidad = parseInt(document.getElementById('prod-cantidad').value);
    const precio = parseFloat(document.getElementById('prod-precio').value);

    if (!nombre || cantidad <= 0 || precio < 0) {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    productos.push({ nombre, cantidad, precio });
    mostrarProductos();
    agregarALog(`Producto agregado: ${nombre} (Cant: ${cantidad}, Precio: RD$ ${precio.toFixed(2)})`);
    productoForm.reset();
});

// Función para eliminar producto
window.eliminarProducto = function (idx) {
    agregarALog(`Producto eliminado: ${productos[idx].nombre}`);
    productos.splice(idx, 1);
    mostrarProductos();
};

// Bitácora de operaciones
function agregarALog(msg) {
    const fecha = new Date().toLocaleString();
    const li = document.createElement('li');
    li.textContent = `[${fecha}] ${msg}`;
    logOperaciones.prepend(li);
}

// Mostrar detalle de la factura en pantalla
function mostrarDetalleFactura() {
    const detalleDiv = document.getElementById('factura-detalle');

    if (productos.length === 0) {
        detalleDiv.innerHTML = '<em>No hay productos agregados.</em>';
        renderizarSVG();
        return;
    }

    let filas = '';
    productos.forEach((prod, idx) => {
        const itbis = +(prod.precio * prod.cantidad * 0.18);
        const subtotal = +(prod.precio * prod.cantidad);
        filas += `
        <tr>
            <td>${idx + 1}</td>
            <td>${prod.nombre}</td>
            <td style="text-align:right">${prod.cantidad}</td>
            <td style="text-align:right">RD$ ${prod.precio.toFixed(2)}</td>
            <td style="text-align:right">RD$ ${itbis.toFixed(2)}</td>
            <td style="text-align:right">RD$ ${subtotal.toFixed(2)}</td>
            <td style="text-align:center">
                <button onclick="eliminarProducto(${idx})" style="background:#C62828;color:#fff;border:none;padding:4px 12px;border-radius:5px;font-weight:bold;cursor:pointer;">Eliminar</button>
            </td>
        </tr>
        `;
    });

    const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const totalITBIS = productos.reduce((acc, p) => acc + p.precio * p.cantidad * 0.18, 0);

    detalleDiv.innerHTML = `
        <table style="width:100%;border-collapse:collapse">
            <thead>
                <tr style="background:#95C23D;">
                    <th>#</th>
                    <th>Descripción</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>ITBIS (18%)</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
            <tfoot>
                <tr style="background:#CEDC39;font-weight:bold">
                    <td colspan="4" style="text-align:right">Totales:</td>
                    <td style="text-align:right">RD$ ${totalITBIS.toFixed(2)}</td>
                    <td style="text-align:right">RD$ ${subtotal.toFixed(2)}</td>
                    <td></td>
                </tr>
                <tr>
                    <td colspan="5" style="text-align:right"><strong>Monto Total:</strong></td>
                    <td style="text-align:right"><strong>RD$ ${(subtotal + totalITBIS).toFixed(2)}</strong></td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
    `;
    renderizarSVG();
}

// Gráfico SVG
function renderizarSVG() {
    const svgDiv = document.getElementById('svg-output');
    if (!productos.length) {
        svgDiv.innerHTML = '';
        return;
    }

    const width = 700;
    const height = 320;
    const barWidth = 24;
    const spacing = 30;
    const margin = 70;
    const maxCantidad = Math.max(...productos.map(p => p.cantidad));
    const maxCosto = Math.max(...productos.map(p => p.precio * p.cantidad));
    const maxBar = Math.max(maxCantidad, maxCosto);

    let svgBars = '';
    productos.forEach((prod, i) => {
        const xCantidad = margin + i * (barWidth*2 + spacing);
        const xCosto = xCantidad + barWidth;
        const hCantidad = (prod.cantidad / maxBar) * (height - margin - 60);
        const hCosto = ((prod.precio * prod.cantidad) / maxBar) * (height - margin - 60);

        // Barra de cantidad
        svgBars += `
        <rect x="${xCantidad}" y="${height - hCantidad - margin}" width="${barWidth}" height="${hCantidad}"
            fill="#4BB543" rx="4"/>
        <text x="${xCantidad + barWidth/2}" y="${height - hCantidad - margin - 10}" text-anchor="middle" font-size="12" fill="#222">${prod.cantidad}</text>
        `;

        // Barra de costo
        svgBars += `
        <rect x="${xCosto}" y="${height - hCosto - margin}" width="${barWidth}" height="${hCosto}"
            fill="#CEDC39" rx="4"/>
        <text x="${xCosto + barWidth/2}" y="${height - hCosto - margin - 10}" text-anchor="middle" font-size="12" fill="#555">RD$${(prod.precio * prod.cantidad).toFixed(0)}</text>
        `;

        // Etiqueta de producto
        let lineas = dividirEnLineas(prod.nombre, 10, 2);
        lineas.forEach((linea, j) => {
            svgBars += `<text x="${xCantidad + barWidth}" y="${height - margin + 22 + j*15}" text-anchor="middle" font-size="13" fill="#222">${linea}</text>`;
        });
    });

    // Eje Y
    let ejeY = '';
    for (let i = 0; i <= maxBar; i += Math.ceil(maxBar/5) || 1) {
        const y = height - margin - (i / maxBar) * (height - margin - 60);
        ejeY += `<text x="40" y="${y + 5}" font-size="12" fill="#666">${i}</text>
                 <line x1="55" y1="${y}" x2="${700 - 20}" y2="${y}" stroke="#eee"/>`;
    }

    // Leyenda
    const leyenda = `
      <rect x="80" y="8" width="22" height="12" fill="#4BB543"/><text x="110" y="18" font-size="12" fill="#222">Cantidad</text>
      <rect x="180" y="8" width="22" height="12" fill="#CEDC39"/><text x="210" y="18" font-size="12" fill="#222">Costo</text>
    `;

    const svg = `
    <svg width="${width}" height="${height}" style="border:1px solid #ddd;background:#f8f9f7">
        ${leyenda}
        ${ejeY}
        ${svgBars}
        <line x1="55" y1="${height - margin}" x2="${width - 20}" y2="${height - margin}" stroke="#bbb" stroke-width="2"/>
    </svg>
    `;

    svgDiv.innerHTML = svg;
}

// Botón y lógica para generar el XML
document.getElementById('generar-xml').addEventListener('click', function() {
    if (productos.length === 0) {
        alert('Debe agregar al menos un producto para generar la factura.');
        return;
    }
    const tipoFactura = tipoFacturaSelect.value;
    const rncComprador = rncInput.value.trim();
    const nombreComprador = nombreInput.value.trim();

    // Si es tipo 31, los campos son obligatorios
    if (tipoFactura === '31') {
        if (!rncComprador || !nombreComprador) {
            alert('Para factura Crédito Fiscal (31) debe completar RNC/Cédula y Razón Social del Comprador.');
            if (!rncComprador) rncInput.focus();
            else if (!nombreComprador) nombreInput.focus();
            return;
        }
    }

    let xml =
`<FacturaElectronica>
    <Tipo>${tipoFactura}</Tipo>
    <RNCComprador>${rncComprador || ''}</RNCComprador>
    <NombreComprador>${nombreComprador || ''}</NombreComprador>
    <Detalle>`;
    productos.forEach((prod, idx) => {
        xml += `
        <Producto>
            <Linea>${idx + 1}</Linea>
            <Descripcion>${prod.nombre}</Descripcion>
            <Cantidad>${prod.cantidad}</Cantidad>
            <PrecioUnitario>${prod.precio.toFixed(2)}</PrecioUnitario>
            <ITBIS>${(prod.precio * prod.cantidad * 0.18).toFixed(2)}</ITBIS>
            <Subtotal>${(prod.precio * prod.cantidad).toFixed(2)}</Subtotal>
        </Producto>`;
    });
    // Totales
    const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const totalITBIS = productos.reduce((acc, p) => acc + p.precio * p.cantidad * 0.18, 0);
    const montoTotal = subtotal + totalITBIS;

    xml += `
    </Detalle>
    <Totales>
        <Subtotal>${subtotal.toFixed(2)}</Subtotal>
        <TotalITBIS>${totalITBIS.toFixed(2)}</TotalITBIS>
        <MontoTotal>${montoTotal.toFixed(2)}</MontoTotal>
    </Totales>
</FacturaElectronica>`;

    // Mostrar en modal
    document.getElementById('xml-output').textContent = xml;
    document.getElementById('modal-xml').style.display = 'flex';
    agregarALog('Factura electrónica generada en formato XML.');
});

// Cerrar modal XML
function cerrarModalXML() {
    document.getElementById('modal-xml').style.display = 'none';
}

// Descargar XML
function descargarXML() {
    const xmlContent = document.getElementById('xml-output').textContent;
    const blob = new Blob([xmlContent], {type: "application/xml"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "factura-electronica.xml";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// Botón Cancelar general
document.getElementById('cancelar-todo').addEventListener('click', function() {
    if (confirm('¿Está seguro que desea descartar todos los datos y limpiar la pantalla?')) {
        tipoFacturaSelect.selectedIndex = 1;
        actualizarCamposComprador();
        rncInput.value = '';
        nombreInput.value = '';
        productos = [];
        mostrarProductos();
        mostrarDetalleFactura();
        document.getElementById('log-operaciones').innerHTML = '';
        agregarALog('Se canceló la factura y se limpió el formulario.');
    }
});

// Inicializar pantalla al cargar
mostrarProductos();
mostrarDetalleFactura();