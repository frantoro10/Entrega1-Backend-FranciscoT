const fs = require("fs").promises;

class ProductManager {
  // Es un productIdCounter, para darle un id unico a cada objeto.
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
    try {
      // Almacenamos el array que se encuentra en el json productManager, logica del metodo leerArchivo.,
      const arrayProductos = await this.leerArchivo();

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return;
      }
      if (arrayProductos.some(item => item.code === code)) {
        console.log("El código debe ser único por producto.");
        return;
      }
      // Generamos el objeto, con los parametros del metodo.
      const newProduct = {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || []
      };

      // Condicional, utizando metodo .reduce de array, y metodo .max para encontrar el id mas grande del array de products, y almacenar ese valor numerico a la variable static ultId, y de esta manera seguir generando un id por cada producto. 
      if (arrayProductos.length > 0) {
        ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
      }
      // Al nuevo objeto, le asignamos el valor de la variable static ultId, y ademas sumamos +1 al ultId, siguiendo la secuencia de dar un id unico por producto.
      newProduct.id = ++ProductManager.ultId; 
      // Pusheamos el nuevo objeto, y utilizamos metodo guardarArchivo, para enviar los datos (write - FS) al JSON (nuestro archivo).
      arrayProductos.push(newProduct);
      await this.guardarArchivo(arrayProductos);
    } catch (error) {
      console.log("Error al agregar producto", error);
      throw error; 
    }
  }
  async getProducts() {
    try {
      const arrayProductos = await this.leerArchivo();
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find(item => item.id === id);

      if (!buscado) {
        console.log("Producto no encontrado");
        return null;
      } else {
        console.log("Producto encontrado");
        return buscado;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }
// Metodo para almacenar y retornar, array de productos que se encontraba en el json. Leemos el archivo con readfile (file system) y luego, lo almacenamos y parseamos en la constante arrayproducts, para luego retornarlo. Este metodo lo pasamos como call back a la funcion addProducts.
  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer un archivo", error);
      throw error;
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
      throw error;
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProductos[index] = { ...arrayProductos[index], ...productoActualizado };
        await this.guardarArchivo(arrayProductos);
        console.log("Producto actualizado");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
        console.log("Producto eliminado");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
      throw error;
    }
  }
}

module.exports = ProductManager;



// PRODUCT MANAGER A MI MANERA ANTERIOR.
// class ProductManager {


//     constructor(filePath) {
//         this.path = filePath;
//         this.products = [];
//         // Contador para los productos del array.
//         this.productIdCounter = 1;
//         this.loadProductsFromFile();
//     }

//     loadProductsFromFile() {
//         try {
//             const data = fs.readFileSync(this.path, 'utf8');
//             if (data) {
//                 this.products = JSON.parse(data);
//                 const lastProduct = this.products[this.products.length - 1];
//                 this.productIdCounter = lastProduct ? lastProduct.id + 1 : 1;
//             }
//         } catch (err) {
//             console.error('Error reading file:', err);
//         }
//     }

//     saveProductsToFile() {
//         try {
//             fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2)); // Parametros null y 2 para que se guarde en json de forma ordenada.
//         } catch (err) {
//             console.error('Error writing file:', err);
//         }
//     }

//     addProduct(product) {
//         // No importa que el id del objeto sea un string ya que el valor numerico de productIdCounter, se asigna a la propiedad id del objeto, luego una vez hecho esto, productIdCounter por usar el operador de incremento ++, se aumenta en 1, por lo que pasa a valer 2, entonces al crear un nuevo product, su id sera 2, y asi consecutivamente por cada producto. 
//         // this.productIdCounter++ incrementa el valor de this.productIdCounter en 1 después de usar su valor actual(Asignar). Si se usara productIdCounter + 1, esto sumaria el valor de productIdCounter en esa operacion, y el primer product.id valdria 2, y tambien todos los demas, valdrian 2, lo que no es deseado.
//         product.id = this.productIdCounter++;
//         this.products.push(product);
//         this.saveProductsToFile();

//     }

//     getProducts() {
//         return this.products;
//     }

//     getProductById(id) {
//         return this.products.find(product => product.id === parseInt(id));
//     }

//     updateProduct(id, updatedFields) {
//         const productIndex = this.products.findIndex(product => product.id === id);
//         if (productIndex !== -1) {
//             this.products[productIndex] = { ...this.products[productIndex], ...updatedFields }; //Spread | Copiamos todos los valores del objeto encontrado, y añadimos todos los valores del segundo parametro de la funcion.
//             this.saveProductsToFile(); //Actualizamos con metodo declarado anteriormente para guardar los archivos en json. (write)
//             return true;
//         }
//         return false;
//     }

//     deleteProduct(id) {
//         const initialLength = this.products.length; // Capturamos el length (La cantidad de datos en el array) antes de filtrar
//         this.products = this.products.filter(product => product.id !== id); // Cambiamos this.product asignandole el valor de filter, que seria todos los datos excepto el id de la funcion
//         if (this.products.length < initialLength) {  // Condicional, si ahora this.products es menor que el length inicial capturado, entonces que me guarde los productos con el metodo anteriormente declarado. Por ende, queda excluido el id declarado en la funcion como parametro.
//             this.saveProductsToFile();
//             return true;
//         }
//         return false;
//     }
// }




// Uso
// const productManager = new ProductManager('../models/products.json');


// productManager.addProduct({
//     title: 'Producto de ejemplo',
//     description: 'Descripción de prueba',
//     price: 999,
//     thumbnail: 'thumbnail.ejemplo.png',
//     code: 'EJEMPLO123',
//     stock: 20
// });

// console.log(productManager.getProducts());
// console.log(productManager.getProductById(1));
// productManager.updateProduct(1, { price: 1299 });
// console.log(productManager.getProducts());
// // productManager.deleteProduct(1);
// console.log(productManager.getProducts());