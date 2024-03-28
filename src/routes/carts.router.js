// Importaciones
const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json")

// Creamos un nuevo cart

router.post("/carts", async (req,res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito()
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

// Listar producto que pertenezcan al carrito con parametro cid proporcionados

router.get("/carts/:cid", async (req,res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito.products);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });   
    }
})

// Agregar productos a distintos carritos.

router.post("/carts/:cid/products/:pid", async (req,res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;  // Operador || O
    try {
        // Actualizamos el carrito seleccionado, con un producto nuevo, y su respectiva cantidad. Con producto nos referimos a los producots del products.router, en la url vamos a pasar los parametros indicados para agregar en x cart, x producto del product router.
        const updateCart = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });   
    }
})


module.exports = router;    