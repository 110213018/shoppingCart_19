import Router from "@koa/router";

import auth from "../middleware/auth.js";

const router = new Router();

router.post("/", auth, async (ctx) => {
  const { name, intro, stock, price } = ctx.request.body;
  const { products } = ctx.models;
  const product = await products.create({
    sid: ctx.state.user.id,
    name,
    intro,
    stock,
    price,
  });
  ctx.status = 201;
  ctx.body = {
    data: product,
  };
});

router.get("/", async (ctx) => {
  const { sid } = ctx.query;
  const { products } = ctx.models;
  if (sid) {
    ctx.body = {
      data: await products.getBySId(sid),
    };
  } else {
    ctx.body = {
      data: await products.getAll(),
    };
  }
});

router.get("/:id", async (ctx) => {
  const { id } = ctx.params;
  const { products } = ctx.models;
  ctx.body = {
    data: await products.get(id),
  };
});

router.put("/:id", auth, async (ctx) => {
  const { id } = ctx.params;
  const { name, intro, stock, price } = ctx.request.body;
  const { products } = ctx.models;
  ctx.body = {
    data: await products.update({ id, name, intro, stock, price }),
  };
});

router.del("/:id", auth, async (ctx) => {
  const { id } = ctx.params;
  const { products } = ctx.models;
  await products.del(id);
  ctx.status = 204;
});

export default router;
