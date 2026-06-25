const express=require('express')
const jwt=require('jsonwebtoken')
const JWT_SECRET="dekha_jayega"
const app=express();

app.use(express.json());
const users=[]
function logger(req,res,next){
    console.log(`${req.method} request came`);
    next();
}

app.post("/signup",logger,function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    if (users.find((user) => user.username === username)) {
      res.json({
        message: "user already exist",
      });
      return ;
    }

    users.push({
        username : username,
        password : password,
    })
    res.json({
        message :"you are signed up"
    })
   
})

app.post("/signin",logger,function(req,res){
    const username=req.body.username;
    const password=req.body.password;


    const user=users.find((user)=>user.username===username && user.password===password)
    if(user){
        const token=jwt.sign(
            {
                username : username
            },
            JWT_SECRET,
        )
        res.send({
            token : token,
        })
        console.log(users);
    }
    else{
        res.status(403).send({
            message : "unauthorised"
        })
    }
})

function auth(req, res, next) {
  const token = req.headers.token;
  const decodedinfo = jwt.verify(token, JWT_SECRET);

  if (decodedinfo.username) {
    req.username=decodedinfo.username   //we are sending the username of currenct user to next function
   next()
  } else {
    res.json({
        message: "you are not logged in"
    })
  }
}

app.get("/me",logger,auth,function(req,res){
    if(users.find((user)=>user.username===req.username)){
        res.json({
            username : req.username,
            password : req.password
        })
    }
})


const PORT=8080;


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})