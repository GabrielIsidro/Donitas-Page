/*
 * CATÁLOGO DE PRODUCTOS
 * ---------------------------------------------------------------
 * Para agregar un producto: sumá un objeto a la lista y subí sus fotos a
 *   assets/img/productos/<slug>/paquete.png  -> tarjeta del carrusel
 *   assets/img/productos/<slug>/entero.png   -> imagen del detalle (modal)
 *   assets/img/productos/<slug>/mitad.png    -> aparece al pasar el mouse en el modal
 *
 * Si una foto todavía no existe, se muestra un placeholder de color
 * (campo "color") y la imagen "mitad" simplemente no aparece.
 *
 * Campos:
 *   slug      nombre de la carpeta (minúsculas, sin espacios ni tildes)
 *   nombre    título corto del modal
 *   titulo    título que se ve en la tarjeta del carrusel
 *   categoria texto de la etiqueta (Clásico / Especial)
 *   desc      descripción del modal
 *   color     color hex (sin #) del placeholder
 *   textoColor color hex (sin #) del texto del placeholder
 */
const RUTA_PRODUCTOS = 'assets/img/productos';
const EXT_IMAGENES = 'webp';

const productos = [
    // CLÁSICOS
    {
        slug: 'blanco', nombre: 'Chocolate Blanco', categoria: 'Clásico',
        titulo: 'Dulce de leche con chocolate blanco',
        desc: 'Dulce de leche artesanal bañado en el más suave chocolate blanco premium.',
        color: 'E5F5EF', textoColor: '173C38'
    },
    {
        slug: 'negro', nombre: 'Chocolate Negro', categoria: 'Clásico',
        titulo: 'Dulce de leche con chocolate negro',
        desc: 'El clásico inigualable. Dulce de leche bañado en chocolate negro semiamargo.',
        color: '173C38', textoColor: 'FFFFFF'
    },

    // ESPECIALES
    {
        slug: 'oreo', nombre: 'Oreo', categoria: 'Especial',
        titulo: 'Dulce de leche y Oreo',
        desc: 'Relleno de dulce de leche con trozos de galletita Oreo.',
        color: '343B39', textoColor: 'FFFFFF'
    },
    {
        slug: 'nuez', nombre: 'Nuez', categoria: 'Especial',
        titulo: 'Dulce de leche y nuez',
        desc: 'Combinación perfecta de dulce de leche y nueces seleccionadas.',
        color: 'D99B79', textoColor: 'FFFFFF'
    },
    {
        slug: 'pistacho', nombre: 'Pistacho', categoria: 'Especial',
        titulo: 'Dulce de leche y pistacho',
        desc: 'Un toque gourmet: dulce de leche con auténtico pistacho.',
        color: '8B9A46', textoColor: 'FFFFFF'
    },
    {
        slug: 'block', nombre: 'Block', categoria: 'Especial',
        titulo: 'Dulce de leche y chocolate Block',
        desc: 'Relleno de dulce de leche con trozos del clásico chocolate Block.',
        color: '4A2511', textoColor: 'FFFFFF'
    },
    {
        slug: 'mantecol', nombre: 'Mantecol', categoria: 'Especial',
        titulo: 'Dulce de leche y Mantecol',
        desc: 'La fusión soñada: dulce de leche y trocitos de Mantecol.',
        color: 'E8C396', textoColor: '173C38'
    },
    {
        slug: 'frutos-rojos', nombre: 'Frutos Rojos', categoria: 'Especial',
        titulo: 'Dulce de leche y frutos rojos',
        desc: 'Dulce de leche entrelazado con una ácida y dulce mermelada de frutos rojos.',
        color: '9E2A2B', textoColor: 'FFFFFF'
    },
    {
        slug: 'limon', nombre: 'Limón', categoria: 'Especial',
        titulo: 'Crema de limón',
        desc: 'Suave crema de limón artesanal, refrescante y deliciosa.',
        color: 'F4D35E', textoColor: '173C38'
    },
    {
        slug: 'cafe', nombre: 'Café', categoria: 'Especial',
        titulo: 'Crema de café',
        desc: 'Intenso sabor a café tostado en una crema suave e irresistible.',
        color: '5C4033', textoColor: 'FFFFFF'
    },
    {
        slug: 'choco-frutos', nombre: 'Choco y Frutos', categoria: 'Especial',
        titulo: 'Chocolate con frutos rojos',
        desc: 'Chocolate negro relleno con confitura de frutos rojos patagónicos.',
        color: '5E1914', textoColor: 'FFFFFF'
    },
    {
        slug: 'choco-oreo', nombre: 'Choco y Oreo', categoria: 'Especial',
        titulo: 'Chocolate con Oreo',
        desc: 'Una bomba de chocolate negro relleno con crema y galletitas Oreo.',
        color: '111111', textoColor: 'FFFFFF'
    }
];
