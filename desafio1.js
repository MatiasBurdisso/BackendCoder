class ProductManager {
    constructor() {
      this.products = [];
    }
  
    agregarProducto(title, description, price, thumbnail, code, stock) {
      const producto = {
        id: this.products.length + 1,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      if (
        title === undefined ||
        description === undefined ||
        price === undefined ||
        thumbnail === undefined ||
        code === undefined ||
        stock === undefined
      ) {
        return console.log("Son obligatorios todos los campos");
      }
  
      let condition = this.products.find((producto) => producto.code === code);
      if (condition) {
        return console.log("Ya existe el producto");
      } else {
        this.products.push(producto);
      }
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      let myID = parseInt(id);
      let miPRoducto = null;
      this.products.forEach((producto) => {
        if (producto.id === myID) {
          miPRoducto = producto;
        }
      });
      if (miPRoducto === null) {
        return console.log("No se encontro el producto");
      } else {
        return miPRoducto;
      }
    }
  }
  
  const productManager = new ProductManager();
  productManager.agregarProducto(
    "Remera",
    "Remera de algodon cuello redondo manga cortas",
    6750,
    "https://6d618348b8.clvaw-cdnwnd.com/3e1a72bc92a2de2f50f86d72732a9c79/200000163-7817278b85/REMERA%20WEB-0.png?ph=6d618348b8",
    "0017",
    9
  );
  productManager.agregarProducto(
    "Remera",
    "Remera de algodon cuello redondo manga cortas",
    6750,
    "https://6d618348b8.clvaw-cdnwnd.com/3e1a72bc92a2de2f50f86d72732a9c79/200000163-7817278b85/REMERA%20WEB-0.png?ph=6d618348b8",
    "0017",
    9
  );
  productManager.agregarProducto(
    "camisa sin cuello",
    12000,
    "https://s03.s3c.es/imag/_v0/770x420/6/8/9/Camisa-sin-cuello-770.jpg",
    "0120",
    20
  );
  
  console.log(productManager.getProducts());
  
  console.log("busqueda de producto", productManager.getProductById(1));