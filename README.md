# Módulo de Facturación Electrónica para República Dominicana

Sistema web que simula la facturación electrónica tipo 31 y 32 según el estándar básico de la DGII (Dirección General de Impuestos Internos) para la República Dominicanda, permitiendo la generación y descarga del formato XML, y la visualización gráfica de productos y totales.

![FE XML](https://github.com/user-attachments/assets/8ef306d9-9fd1-4018-a7c1-60256bb91e05)


## Tabla de Contenidos

- [Tecnologías Usadas](#tecnologías-usadas)
- [Funcionalidades](#funcionalidades)
- [Capturas de Pantalla y Videos](#capturas-de-pantalla-y-videos)
- [Instrucciones para Ejecutar](#instrucciones-para-ejecutar)
- [Desafíos Enfrentados](#desafíos-enfrentados)
- [Referencias](#referencias)
- [Contacto](#contacto)


## Tecnologías Usadas

- **HTML5 / CSS3**: Estructura, estilos y layout del sistema web.
- **JavaScript**: Lógica de negocio, generación de XML, manejo de eventos y representación SVG.
- **SVG**: Gráficos de barras para visualización de cantidades y costos de productos.
- **VS Code**: Entorno de desarrollo.


## Funcionalidades

- Selección de tipo de comprobante (31/32) con reglas de validación reales de la DGII.
  - Para las factura tipo 31, es necesario indicar el RNC y Razón social del comprador.
- Registro, visualización y eliminación de productos en la factura.
- Cálculo automático de ITBIS, subtotal y total.
- Generación y descarga del comprobante en formato **XML**.
- Visualización gráfica automática (**SVG**) de cantidades y montos de productos.
- Bitácora (log) de operaciones.


## Capturas de Pantalla y Videos

### Pantalla Principal
![pnatalla-principal](https://github.com/user-attachments/assets/e02c0fd4-b624-4fc9-8fba-a1bc9d8d6c4a)

### Operación y Generación de XML
https://github.com/user-attachments/assets/63d40367-d8bb-44a2-8df0-8aa141ffd422


## Instrucciones para Ejecutar

1. **Clone o descarge este repositorio:**

    ```bash
    git clone https://github.com/dianaybellom/facturacion-electronica-xml.git
    ```

2. **Abra la carpeta en su IDE preferido (VS Code fue el que yo utilicé).**

3. **Abra el archivo `index.html` en un navegador web.**

4. **¡Listo!**: No requiere servidor ni instalación. Todo funciona de manera local y offline.


## Desafíos Enfrentados

- **Validación de campos:** Implementación de lógica condicional según el tipo de comprobante (31/32) y sus requisitos para los datos del comprador.
- **Visualización SVG:** Ajuste del gráfico para que represente correctamente cantidades y costos, asegurando legibilidad en distintos tamaños y cantidades de productos.
- **Simulación de lógica DGII:** Adaptación de la lógica y los campos a los estándares y normativas de la DGII, de forma simplificada.

## Referencias
📄 [Portal de información sobre Facturación Electrónica en República Dominicana](https://dgii.gov.do/cicloContribuyente/facturacion/comprobantesFiscalesElectronicosE-CF/Paginas/default.aspx)

## Contacto
✉️ dianabellomejia_@hotmail.com

