const express=require('express')
const {Router}= express
const app= express()
//creo los routers de productos y carrito
const routerProductos= Router()
const routerCarrito= Router()
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
//creo la clase para manejar los datos
class contenedor{
    constructor(){
        this.productos=[]
        this.id=1
        this.timestamp=new Date().toLocaleString()
    }
    save(object){
        //traer el contenido del archivo y preguntar si tiene algo,si no se pone objet id en 1
        //si hay contenido se recorre y se guarda el id del ultimo y se le suma uno y al objeto.id se le asigna lo guardad
        let idReturn= this.id
        object.timestamp=this.timestamp    
        object.id=this.id
        this.productos.push(object)
        this.id++
        return idReturn
        
    }
    getbyid(number){
        let resultado=null
              let bandera=0
              for(let i = 0;i <this.productos.length;i++){
              if (info[i].id==number){
                resultado = this.productos[i]
                bandera=1
                }} 
              if (bandera===0){
                resultado=null      
              }
              
           return resultado
    }//funciona
    getAll(){
      return this.productos
    }//funciona
    deleteById(number){
         let bandera=-1
        for(let i = 0;i <this.productos.length;i++){
             if (this.productos[i].id===number){
                this.productos.splice(i,1)
                bandera=1
                }
         }if (bandera===-1){
            console.log("el elemento no se encuentra en el array")
            }
    }//funciona
    deleteAll(){
    this.productos=[]
    }//funciona

}
//creo una variable booleana para saber si el usuario es administrador o no
let administrador= true

const apiClass= new contenedor
const carrito= new contenedor
apiClass.save({
    title: "Xbox Series x",
    price: 500,
    link: "url1",
    stock:10  
})
apiClass.save({
    title: "Playstation 5",
    price: 550,
    link: "url2",
    stock:5
})
// creamos las rutas para los productos
routerProductos.get('/',function(req,res){
    const produc=apiClass.getAll()
    res.status(200).json(produc)   
})
routerProductos.get('/:id?',function(req,res){
    const id= req.params.id
    let productos=apiClass.getAll()
    let prodFind = productos.find(item => item.id == id) 
            if(prodFind){
               res.status(200).json(prodFind)
                return 
            }else res.status(404).json({error:-2,descripcion:`ruta/${id} metodo get no implementada`})
       
})
routerProductos.post('/',function(req,res){
    if (administrador){
    const productoAgregar=req.body
    let productos=apiClass.getAll()
    let indice=productos.length-1//se busca la longitud del array de productos
    let ids=productos[indice].id//se busca el id del ultimo producto en el array
    productoAgregar["id"]=ids+1 //se inserta el id correspondiente al poructo a agregar
    apiClass.save(productoAgregar)
    res.status(200).json(productoAgregar)
    }else res.status(403).json({error:-1,descripcion:"ruta:/api/pruductos metodo post no autorizada"})
})
routerProductos.put('/:id',function(req,res){
    if(administrador){
    const id= req.params.id
    const productoModificar=req.body
    let productos=apiClass.getAll()
    let prodFind = productos.find(item => item.id == id) //se busca si el producto existe
            if(prodFind){
                productoModificar["id"]=prodFind.id//se le inserta el id del producto a la producto que esta en el body
                indice=productos.indexOf(prodFind)//busca el indice del producto a modificar
                productos[indice]=productoModificar//se inserta el producto del body en la base de datos
                res.status(200).json(productos)
                return 
            }else res.status(404).json({error:-2,descripcion:`ruta/${id} metodo put no implementada`})
    }else res.status(403).json({error:-1,descripcion:`ruta:/api/pruductos/${id} metodo put no autorizada`})  
})
routerProductos.delete('/:id',function(req,res){
    if(administrador){
    const id=req.params.id
    let productos=apiClass.getAll()
    let objFind = productos.find(item => item.id == id) 
            if(objFind){
                indice=productos.indexOf(objFind)
               //borrar el producto
               productos.splice(indice,1)
                res.status(200).json(productos)
                return 
            }else res.status(404).json({error:-2,descripcion:`ruta/${id} metodo delete no implementada`})
    }else res.status(403).json({error:-1,descripcion:`ruta:/api/pruductos/${id} metodo delete no autorizada"`}) 
})
//creamos las rutas para el carrito
routerCarrito.post('/',function(req,res){
    //se crea el carro apartir de lo que este en el body de postman
    const carritoAgregar=req.body
    let cart=carrito.save(carritoAgregar)
    res.status(200).json(cart)
})
routerCarrito.delete('/:id',function(req,res){
    
    const id=req.params.id
    let cart=carrito.getAll()
    let cartFind = cart.find(item => item.id == id) 
            if(cartFind){
                indice=cart.indexOf(objFind)
               //borrar el carro pedido
               cart.splice(indice,1)
                res.status(200).json(cart)
                return         
        }else res.status(403).json({error:-2,descripcion:`ruta:/api/carrito/${id} metodo delete no implementada`}) 
})
routerCarrito.get('/:id/productos',function(req,res){
    //se muesrtan los id de los productos dentro del carro
    const id=req.params.id
    const cart=carrito.getAll()
    productosCarrito = cart.find(item => item.id == id)
    res.status(200).json(productosCarrito.productos)   
})
routerCarrito.post('/:id/productos/:id_prod',function(req,res){
    const idCarrito=req.params.id
    const idProducto=req.params.id_prod
    const cart=carrito.getAll()
    let productos=apiClass.getAll()
    let prodFind = productos.find(item => item.id == idProducto)//se busca si el producto existe
    let carro = cart.find(item => item.id == idCarrito)//se verifica si el carro existe
    if(prodFind && carro){//si existen los 2 se ingresa el id del producto dentro del carro
    carro.productos.push(prodFind.id)
    res.status(200).json(carro)
    }else res.status(404).json({error:-2,descripcion:`ruta/${idCarrito}/productos/${idProducto} metodo post no implementada`})
})
routerCarrito.delete('/:id/productos/:id_prod',function(req,res){
    const idCarrito=req.params.id
    const idProducto=req.params.id_prod
    const cart=carrito.getAll()
    let carro = cart.find(item => item.id == idCarrito)//se busca si el carro existe
    let productos=carro.productos//se guardan todos los productos que tenga el carro en una variable
    
    let prodFind = productos.find(item => item == idProducto)//se verifica que el carro tenga el producto
    
    if(prodFind && carro){//si existe el carro y el producto esta dentro del carro,se borra el producto pedido
        indice=productos.indexOf(prodFind)
        carro.productos.splice(indice,1)
        res.status(200).json(carro)
    }else res.status(404).json({error:-2,descripcion:`ruta/${idCarrito}/productos/${idProducto} metodo delete no implementada`})
})
app.use('/api/productos',routerProductos)
app.use('/api/carrito',routerCarrito)
app.listen(8080)