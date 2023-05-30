import { Router } from "express";
import ManagerMongoDb from "../dao/ManagerMongoDB.js";
import {v4 as uuidv4} from 'uuid';
import { ticketsModel } from "../models/ticket.model.js";

const router = Router();
const cartManager = new ManagerMongoDb.CartManager();

router.get("/", async (req, res) => {
  try {
    const cart = await cartManager.getCart();
    res.send(cart);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await cartManager.createCart([]);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid } = req.params;
  const { pid } = req.params;
  let { quantity } = req.body;
  try {
    const response = await cartManager.addProductToCart(cid, pid, quantity);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid } = req.params;
  const { pid } = req.params;

  try {
    const response = await cartManager.removeProductFromCart(cid, pid);
    res.send({
      message: "Product deleted successfully",
      id: pid,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartManager.deleteAllProductCart(cid);
    res.send({
      message: "Cart deleted successfully",
      id: cid,
    });
  } catch (err) {
    req.status(500).send(err.message);
  }
});

router.post("/:cid/purchase",async(req,res)=>{
  try {
      const cartId = req.params.cid;
      const cart = await CartModel.findById(cartId);
      if(cart){
          if(!cart.products.length){
              return res.send("es necesario que agrege productos antes de realizar la compra")
          }
          const ticketProducts = [];
          const rejectedProducts = [];
          for(let i=0; i<cart.products.length;i++){
              const cartProduct = cart.products[i];
              const productDB = await ProductModel.findById(cartProduct.id);
              //comparar la cantidad de ese producto en el carrito con el stock del producto
              if(cartProduct.quantity<=productDB.stock){
                  ticketProducts.push(cartProduct);
              } else {
                  rejectedProducts.push(cartProduct);
              }
          }
          console.log("ticketProducts",ticketProducts)
          console.log("rejectedProducts",rejectedProducts)
          const newTicket = {
              code:uuidv4(),
              purchase_datetime: new Date().toLocaleString(),
              amount:500,
              purchaser:req.user.email
          }
          const ticketCreated = await ticketsModel.create(newTicket);
          res.send(ticketCreated)
      } else {
          res.send("el carrito no existe")
      }
  } catch (error) {
      res.send(error.message)
  }
});


export default router;