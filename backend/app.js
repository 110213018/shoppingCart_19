import Koa from "koa";
import logger from "koa-logger";
import cors from "@koa/cors";
import bodyParser from "@koa/bodyparser";

import config from "./config.js";
import { conn } from "./lib/db.js";
import errorHandler from "./middleware/error.js";
import UsersModel from "./models/users.js";
import ProductsModel from "./models/products.js";
import CartsModel from "./models/carts.js";
import OrdersModel from "./models/orders.js";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import ordersRouter from "./routes/orders.js";

const app = new Koa();

const session = await conn(config.mongo.uri, config.mongo.dbName);
app.context.models = {
  users: new UsersModel(session),
  products: new ProductsModel(session),
  carts: new CartsModel(session),
  orders: new OrdersModel(session),
};

app.use(errorHandler);
app.use(logger());
app.use(cors());
app.use(bodyParser());

app.use(usersRouter.prefix("/users").routes());
app.use(productsRouter.prefix("/products").routes());
app.use(cartsRouter.prefix("/carts").routes());
app.use(ordersRouter.prefix("/orders").routes());

app.listen(config.port);
