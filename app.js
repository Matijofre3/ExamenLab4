const fs = require('fs/promises');
const readline = require('readline');
const yargs = require('yargs');


const argv = yargs(process.argv.slice(2))
  .option('file', {
    alias: 'f',
    type: 'string',
    default: 'productos.json',
    describe: 'Nombre del archivo JSON para guardar los productos'
  })
  .argv;


 async function solicitarDatos() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const producto = await new Promise(resolve => {
    rl.question('Producto: ', resolve);
  });

  const precio = await new Promise(resolve => {
    rl.question('Precio: ', resolve);
  });

  const cantidad = await new Promise(resolve => {
    rl.question('Cantidad: ', resolve);
  });

  rl.close();

  return {
    nombre: producto,
    precio: parseFloat(precio),
    cantidad: parseInt(cantidad)
  };
}

async function guardarProducto(producto, archivo) {
  let productos = [];

  try {
    const contenido = await fs.readFile(archivo, 'utf-8');
    productos = JSON.parse(contenido);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  productos.push(producto);
  await fs.writeFile(archivo, JSON.stringify(productos, null, 2));
  console.log(`Producto guardado en ${archivo}`);
}


async function mostrarContenido(archivo) {
  try {
    const contenido = await fs.readFile(archivo, 'utf-8');
    console.log('Contenido del archivo:');
    console.log(contenido);
  } catch (err) {
    console.error('Error al leer el archivo:', err.message);
  }
}


async function main() {
  try {
    const producto = await solicitarDatos();
    await guardarProducto(producto, argv.file);
    await mostrarContenido(argv.file);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();