export async function addProduct(token, name, intro, stock, price) {
  const response = await fetch("http://localhost:4000/products/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, intro, stock, price }),
  });
  const data = await response.json();
  console.log(data);
  return data.data;
}

export async function getProducts() {
  const response = await fetch("http://localhost:4000/products/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
  for (const p of data.data) {
    const seller = await getUser(p.sid);
    p.seller = seller.username;
  }
  return data.data;
}

export async function getProductsBySId(sid) {
  const response = await fetch(`http://localhost:4000/products/?sid=${sid}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
  for (const p of data.data) {
    const seller = await getUser(p.sid);
    p.seller = seller.username;
  }
  return data.data;
}

export async function getProduct(id) {
  const response = await fetch(`http://localhost:4000/products/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
  return data.data;
}

export async function updateProduct(token, id, name, intro, stock, price) {
  const response = await fetch(`http://localhost:4000/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, intro, stock, price }),
  });
  const data = await response.json();
  console.log(data);
  return data.data;
}

export async function deleteProduct(token, id) {
  await fetch(`http://localhost:4000/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function addToCart(token, pid, quantity) {
  const response = await fetch("http://localhost:4000/carts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pid, quantity }),
  });
  const data = await response.json();
  console.log(data);
  return data.data;
}

export async function getCart(token) {
  const response = await fetch("http://localhost:4000/carts/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data.data;
}

export async function deleteFromCart(token, id) {
  await fetch(`http://localhost:4000/carts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function cleanCart(token) {
  await fetch(`http://localhost:4000/carts/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createOrders(token, products) {
  const orders = [];
  for (const p of products) {
    const product = await getProduct(p.pid);
    const sid = product.sid;
    const order = orders.find((o) => o.sid === sid);
    if (order) {
      order.products.push({ quantity: p.quantity, id: p.pid });
    } else {
      orders.push({
        bid: p.bid,
        sid,
        products: [{ quantity: p.quantity, id: p.pid }],
        status: 0,
        review: 0,
      });
    }
  }
  for (const order of orders) {
    const response = await fetch("http://localhost:4000/orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });
    const data = await response.json();
    console.log(data);
  }
}

export async function getOrders(token) {
  const response = await fetch("http://localhost:4000/orders/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  console.log(data);
  for (const order of data.data) {
    for (const p of order.products) {
      const product = await getProduct(p.id);
      p.name = product.name;
    }
    const buyer = await getUser(order.bid);
    order.buyer = buyer.username;
    const seller = await getUser(order.sid);
    order.seller = seller.username;
  }
  return data.data;
}

export async function updateOrderReview(token, id, review) {
  await fetch(`http://localhost:4000/orders/${id}/review`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ review }),
  });
}

export async function updateOrderStatus(token, id, status) {
  await fetch(`http://localhost:4000/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
}

export async function getUser(id) {
  const response = await fetch(`http://localhost:4000/users/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
  return data.data;
}
