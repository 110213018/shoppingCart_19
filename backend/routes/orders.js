import Router from "@koa/router";

import auth from "../middleware/auth.js";

const router = new Router();

router.post("/", auth, async (ctx) => {
  const { sid, products, status, review } = ctx.request.body;
  const bid = ctx.state.user.id;
  const { orders } = ctx.models;
  const order = await orders.create({
    bid,
    sid,
    products,
    status,
    review,
  });
  for (const product of products) {
    await ctx.models.products.updateStock({
      id: product.id,
      stock: product.quantity,
    });
  }
  ctx.status = 201;
  ctx.body = {
    data: order,
  };
});

router.get("/", auth, async (ctx) => { // 找屬於誰的訂單
  const role = ctx.state.user.role;
  const { orders } = ctx.models;
  let data;
  if (role === 1) {
    data = await orders.getByBId(ctx.state.user.id);
  } else if (role === 2) {
    data = await orders.getBySId(ctx.state.user.id);
  } else if (role === 3) {
    data = await orders.getByLogistic();
  }
  ctx.body = {
    data,
  };
});

router.patch("/:id/review", auth, async (ctx) => {
  const { id } = ctx.params;
  const { review } = ctx.request.body;
  const { orders } = ctx.models;
  await orders.updateReview(id, review);
  ctx.status = 204;
});

router.patch("/:id/status", auth, async (ctx) => {
  const { id } = ctx.params;
  const { status } = ctx.request.body;
  const { orders } = ctx.models;
  await orders.updateStatus(id, status);
  ctx.status = 204;
});

export default router;
