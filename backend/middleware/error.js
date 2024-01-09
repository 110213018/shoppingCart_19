export default async function (ctx, next) {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.status = err.status || 500;
    ctx.body = new Response({
      err: err.name || "InternalServerError",
      msg:
        err.msg ||
        err.message ||
        "Unknown error occurred while processing the request",
    });
  }
}
//錯誤偵測