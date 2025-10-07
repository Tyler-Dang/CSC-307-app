// backend.js
import express from "express";
import cors from "cors";

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  
  if (name !== undefined && job !== undefined) {
    // Filter by both name and job
    let result = users["users_list"].filter(
      (user) => user["name"] === name && user["job"] === job
    );
    res.send({ users_list: result });
  } else if (name !== undefined) {
    // Filter by name only
    let result = users["users_list"].filter(
      (user) => user["name"] === name
    );
    res.send({ users_list: result });
  } else if (job !== undefined) {
    // Filter by job only  
    let result = users["users_list"].filter(
      (user) => user["job"] === job
    );
    res.send({ users_list: result });
  } else {
    // No filters, return all users
    res.send(users);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const generateId = () => {
  return Math.random()
}

const addUser = (user) => {
  const userWithId = { ...user, id: generateId() };
  users["users_list"].push(userWithId);
  return userWithId;
};

const deleteUser = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index !== -1) {
    const deletedUser = users["users_list"].splice(index, 1)[0];
    return deletedUser;
  }
  return undefined;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const newUser = addUser(userToAdd);
  res.status(201).send(newUser);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const deletedUser = deleteUser(id);
  if (deletedUser === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
})