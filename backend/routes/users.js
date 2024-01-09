import Router from "@koa/router";

import { createToken } from "../lib/token.js";
import auth from "../middleware/auth.js";

const router = new Router();

router.post("/", async (ctx) => {
  const { username, password, role } = ctx.request.body;
  const { users } = ctx.models;
  const user = await users.create({ username, password, role });
  ctx.status = 201;
  ctx.body = {
    data: user,
  };
});

router.post("/login", async (ctx) => {
  const { username, password } = ctx.request.body;
  const { users } = ctx.models;
  const user = await users.login({ username, password });
  ctx.body = {
    data: {
      accessToken: createToken({
        id: user._id,
        username: user.username,
        role: user.role,
      }),
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    },
  };
});

router.get("/me", auth, async (ctx) => {
  const id = ctx.state.user.id;
  const { users } = ctx.models;
  const user = await users.get(id);
  ctx.body = {
    data: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  };
});

router.get("/:id", async (ctx) => {
  const id = ctx.params.id;
  const { users } = ctx.models;
  const user = await users.get(id);
  ctx.body = {
    data: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  };
});

export default router;
