// Importaciones
const express = require("express");
const router = express.Router();
// Importamos Product Manager.
const ProductManager = require('../controllers/product-manager')

// Crear una instancia de ProductManager con la ruta al archivo JSON
const productManager = new ProductManager('./src/models/products.json');


// Solicitudes HTTP utilizando clase constructora, (product manager js)

// Obtenemos los datos.
router.get('/products', async (req, res) => {
    // Gracias al file system, y al product manager, al reiniciar el servidor, no perdemos ningun dato, ya que estos se encuentran declarados en el products.json.
    try {
        const data = await productManager.getProducts();
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

// Obtener producto por ID.
router.get("/products/:id", (req, res) => {
    const id = req.params.id;
    const foundProduct = productManager.getProductById(id);
    res.status(200).send(foundProduct);
    // El metodo  con el find esta declarado en el productManager
    // getProductById(id) {
    //     return this.products.find(product => product.id === id);
    // }

})

// Obtener cantidad de productos a eleccion (LIMITE DE PRODUCTOS)
// Usamos funcion asincronica.

router.get('/products', async (req, res) => {
    const limit = req.query.limit;
    try {
        const products = await productManager.getProducts();
        if (limit) {
            res.json(products.slice(0, limit))
        } else {
            res.json(products);
        }
    } catch (err) {
        console.log("Error al obtener los productos limitados", err)
        res.status(500).json({ error: "Error intento en el servidor" });
    }
})


// Agregar un nuevo producto, post request.
router.post('/products', async (req, res) => {
    // Capturamos el objeto (nuevo producto) enviado desde el request.
    const newProduct = req.body;
    try {
        await productManager.addProduct(newProduct);
        res.status(200).json({ message: "Producto creado exitosamente" });
    }
    catch (err) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

// Update al producto seleccionado.
router.put('/products/:id', async (req, res) => {
    // Caputramos id seleccionado
    const id = req.params.id;
    // Capturamos las propiedades que seran actualizadas, desde el body del request.
    const updateFields = req.body;
    // Tanto el id, como el updateFields, van a ser pasados como parametros del metodo lllamado updateProducts que se encuentra en el ProductManager.
    try {
       await productManager.updateProduct(parseInt(id), updateFields);
        res.status(200).json({ message: "Producto actualizado con exito!" });
    } catch (error) {
         res.status(500).json({error: "Error en el servidor!"});    
    }
})

// Borrar producto.

router.delete('/products/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await productManager.deleteProduct(parseInt(id));
        res.status(200).json({ message: "Producto eliminado exitosamente." });
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor."});
    }
})

// Detalle: Se utilizan funciones asincronicas por el motivo de que hay que consultar si se cargo un archivo, con esto evitamos posibles errores.

module.exports = router;

// Peticiones HTTP SIN USAR PRODUCT MANAGER. CODIGO ANTERIOR MIO

// // Importaciones
// const express = require("express");
// const productsRouter = express.Router();
// // Importamos Product Manager.
// const ProductManager = require('../controllers/product-manager')

// // Datos
// const products = [];

// // Router

// productsRouter.get("/api/products", (req,res) => {
//     res.send(products);
// })

// productsRouter.get("/api/products/limit/:limit", (req,res) => {
//     const limit = req.params.limit
//     const productsLimited = products.slice(0, parseInt(limit))
//     res.send(productsLimited);
// })

// productsRouter.get("/api/products/:id", (req,res) => {
//     const id = req.params.id;
//     let foundId = products.find(product => product.id == id);
//     res.send(foundId);
// })

// // Manejo de productos, agregar.
// productsRouter.post("/api/products", (req,res) => {
//     let newProduct = req.body;
//     products.push(newProduct);
//     res.send({message: "Producto creado correctamente"});
// })

// // Actualizar productos.
// productsRouter.put("/api/products/:id", (req, res) => {
//     // Capturamos valores del request
//     // const {id} = req.params;
//     // const {price} = req.body;
//     const id = req.params.id;
//     const price = req.body.price
//     // Capturamos producto que coincida con el parametro.
//     const foundId = products.findIndex(product => product.id === id);
//     // Estructura condicional para actualizar el producto en caso de que exista..
//     if (foundId !== -1) {
//         products[foundId].price = price;
//         res.status(200).send({message: "Producto actualizado con exito"});
//     }else {
//         res.status(404).send({message:"Producto no encontrado"});
//     }
// })

// // Borrar product

// productsRouter.delete("/api/products/:id", (req,res) => {
//     // Capturamos datos del request
//     const id = req.params.id;
//     const foundId = products.findIndex(product => product.id === id);
//     // Usamos metodo de array .splice para eliminar el objeto.
//     if(foundId !== -1) {
//         products.splice(foundId, 1);
//         res.status(200).send({message: "Producto eliminado correctamente"});
//     }else {
//         res.status(404).semd({message: "El producto no fue eliminado. (No encontrado)"});
//     }
// })

// // Common js, importaciones - exportaciones.
// module.exports = productsRouter;