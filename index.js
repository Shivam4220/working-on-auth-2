const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "mtkrlala";
const app = express();

app.use(express.json());
const users = [];

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (users.find((u) => u.username === username)) {
    res.json({
      message: "you are already registered ",
    });
    return;
  }
  users.push({
    username: username,
    password: password,
  });
  res.json({
    message: "you are signed up",
  });
});



app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find((user) => user.username === username && user.password===password);
  if (user) {
    const token = jwt.sign(
      {
        username: username,
      },
      JWT_SECRET,
    ); //convert the name into a token with the help of JWT_SECRET

    res.send({
      token: token,
    });
    console.log(users);
  } else {
    res.status(403).send({
      message: "Invalid username or password",
    });
  }
});

app.get("/me", function (req, res) {
  const token = req.headers.token;
  const decodedinfo = jwt.verify(token, JWT_SECRET);
  const username = decodedinfo.username;

  const user = users.find((user) => user.username === username);
  if (user) {
    res.json({
      username: user.username,
      password: user.password,
    });
  } else {
    res.json({
      message: "invalid/unauthorised",
    });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`the server is listening on the port ${PORT}`);
});
