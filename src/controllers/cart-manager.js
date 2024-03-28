const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultId = 0;

        // Cargamois los carritos almacenados, en el archivo. (Write FS)
        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            // Verificar si hay por lo menos un cart creado
            if (this.carts.length > 0) {
                // Capturamos el maximo id que tenga un carrito, para eso usamos Math.max que retorna el valor maximo, y en este caso, en base al map del array carts, que me va a retornar un nuevo array con todos los ids, (solo los valores del id, por ende seria un array de valores numericos), y ahi es donde Math.max actua, retornando el valor maximo.
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al crear un nuevo carrito", error);
            // Si no existe el archivo, lo vamos a crear.
            await this.guardarCarritos();
        }
    }

    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async crearCarrito() {
        const newCart = {
            id: ++this.ultId,
            products: []
        }
        this.carts.push(newCart);
        // Guardamos el array en el archivo (File System)
        await this.guardarCarritos()
        return newCart;
    }

    async getCarritoById(cartId) {
        try {
            const cart = this.carts.find(cart => cart.id === cartId);
            if(!cart) {
                console.log("No hay carrito con ese Id");
                // Paramos la funcion con return
                return;
            }
            return cart;
        } catch (error) {
            console.log("Error al obtener carrito por id", error);
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1 ) {
        const carrito = await this.getCarritoById(carritoId);
        const existeProducto = carrito.products.find(p => p.product === productoId);
        if(existeProducto) {
            existeProducto.quantity += quantity;
        }else {
            carrito.products.push({product: productoId, quantity});
        }
        await this.guardarCarritos();
        return carrito;
    }
}

module.exports = CartManager;