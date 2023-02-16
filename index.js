const { request, response } = require("express");
const express = require("express");
const uuid = require("uuid");
const cors = require("cors");

const app = express();
app.use(express.json());
const port = 3001;
app.use(cors());

const ordersAll = [];

const checkClientId = (request, response, next) => {
  const { id } = request.params;

  const index = ordersAll.findIndex((user) => user.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "User not found" });
  }

  request.userIndex = index;
  request.userId = id;

  next();
};

const methodUrl = (request, response, next) => {
  console.log(request.method);
  console.log(request.url);

  next();
};

app.get("/order", methodUrl, (request, response) => {
  return response.json(ordersAll);
});

app.post("/order", methodUrl, (request, response) => {
  const { order, clientName, price } = request.body;

  const orderCreated = {
    id: uuid.v4(),
    order,
    clientName,
    price,
    status: "Em preparação",
  };

  ordersAll.push(orderCreated);

  return response.status(201).json(orderCreated);
});

app.put("/order/:id", methodUrl, checkClientId, (request, response) => {
  const { order, clientName, price } = request.body;
  const index = request.userIndex;
  const id = request.userId;

  const updatedOrder = {
    id,
    order,
    clientName,
    price,
    status: "Em preparação",
  };

  ordersAll[index] = updatedOrder;

  return response.json(updatedOrder);
});

app.delete("/order/:id", methodUrl, checkClientId, (request, response) => {
  const index = request.userIndex;

  ordersAll.splice(index, 1);

  return response.status(204).json();
});

app.get("/order/:id", methodUrl, checkClientId, (request, response) => {
  const index = request.userIndex;

  return response.json(ordersAll[index]);
});

app.patch("/order/:id", methodUrl, checkClientId, (request, response) => {
  const index = request.userIndex;
  const id = request.userId;

  const { clientName, order, price } = ordersAll[index];

  let status = ordersAll[index].status;

  status = "Pronto";

  const finishedOrder = { id, clientName, order, price, status };

  ordersAll[index] = finishedOrder;

  return response.json(finishedOrder);
});

app.listen(port, () => {
  console.log(`🚀Server started on port ${port} 🚀`);
});
