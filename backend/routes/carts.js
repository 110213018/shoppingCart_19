import Router from "@koa/router";

import auth from "../middleware/auth.js";

const router = new Router();

router.post("/", auth, async (ctx) => {
  const { pid, quantity } = ctx.request.body;
  const { carts } = ctx.models;
  const cart = await carts.create({
    bid: ctx.state.user.id,
    pid,
    quantity,
  });
  ctx.status = 201;
  ctx.body = {
    data: cart,
  };
});

router.get("/", auth, async (ctx) => {
  const { carts } = ctx.models;
  const cart = await carts.getByBId(ctx.state.user.id);
  ctx.body = {
    data: cart,
  };
});

router.del("/:id", auth, async (ctx) => {
  const { carts } = ctx.models;
  await carts.del(ctx.params.id);
  ctx.status = 204;
});

router.del("/", auth, async (ctx) => { //清空屬於你的購物車
  const { carts } = ctx.models;
  await carts.cleanByBId(ctx.state.user.id);
  ctx.status = 204;
});

export default router;
