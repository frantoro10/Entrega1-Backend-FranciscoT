// Importamos express
const express = require("express");
const app = express();
// Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// Open server
app.listen(8080, () => {
    console.log(`Escuchandoo en el http://localhost:${8080}`);
})

// Routes: - con Middleware
app.use("/api", require('./routes/products.router'));
app.use("/api", require('./routes/carts.router'));


// const clientes = [
//     {
//         id:1,
//         nombre: "perro"
//     },
//     {
//         id:2,
//         nombre: "sapo"
//     },
//     {
//         id:3,
//         nombre: "gato"
//     }
// ]


// // Rutas:

// app.get('/', (req, res) => {
//     res.send("Hello world!")
// })

// app.get('/clientes', (req,res) => {
//     res.send(clientes);
// })

// app.get("/conlimite/:limit", (req,res) => {
//     // let limit = req.params.limit;
//     let {limit} = req.params;
//     // slice, metodo de array, que recorta. | Toda informacion de params , llega como string. Por eso usamos parseInt
//     const arrayConLimites = clientes.slice(0, parseInt(limit))
//     res.send(arrayConLimites);
//  })

// //  Retornar cliente por id:

// app.get("/clientes/:id", (req,res) => {
//     let {id} = req.params;
//     const find = clientes.find(element => element.id == id);

//     if(find) {
//         res.send(find);
//     }else {
//         res.send("Ningun cliente encontrado");
//     }
// })

// // Post:
// app.post("/", (req,res) => {
//     const clienteNuevo = req.body;
//     // Una vez que tenemos los datos, pusheamos al array.
//     clientes.push(clienteNuevo);
//     console.log(clientes);
//     // Codigos de estados, al crear con exito un cliente desde post.
//     res.status(201).send({message: "Cliente nuevo creado con exito"});
// })

// app.put("/:id", (req, res) => {
//     const {id} = req.params;
//     const {nombre} = req.body; 
//     // Encontramos cliente
//     const clienteIndex = clientes.findIndex(cliente => cliente.id == id); 

//     if (clienteIndex !== -1) {
//         // Actualizamos datos, si el cliente existe.
//         clientes[clienteIndex].nombre = nombre;
//         console.log(clientes);
//         res.status(201).send({message: "Cliente actualizado"});
//     }else {
//         // Si no se encuentra, tiramos diferente status y mensaje.
//         res.status(404).send({message: "Cliente no encontrado."})
//     }
// })

// // Usamos .delete para borrar un recurso:
// app.delete("/:id", (req,res) => {
//     let id = req.params.id; 
//     // Buscamos id
//     const clienteEncontrado = clientes.findIndex(cliente => cliente.id == id);
//     if(clienteEncontrado !== -1) {
//         // Si lo encontramos, lo elimianmos.
//         // Usamos metodo de array .splice, recibe como parametro, el objeto a eliminar, y luego como segundo, las veces.
//         clientes.splice(clienteEncontrado, 1);
//         console.log(clientes);
//         res.status(201).send({message:"Cliente eliminado"})
//     }else {
//         res.status(404).send({message: "Cliente no encontrado."})
//     }

// })



