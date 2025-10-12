// backend.js
import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

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
  
  userServices.getUsers(name, job)
    .then((users) => {
      res.send({ users_list: users });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred in the server.");
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  userServices.findUserById(id)
    .then((user) => {
      if (user === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred in the server.");
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userServices.addUser(userToAdd)
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred in the server.");
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  userServices.deleteUser(id)
    .then((deletedUser) => {
      if (deletedUser === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred in the server.");
    });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
})