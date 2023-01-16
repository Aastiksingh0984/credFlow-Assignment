const express = require("express");
const {db} = require('./db/db')
const router = require('./routes/route')

db().then(()=>{
    console.log('connected to mognoDb')
}).catch((err)=>{
    console.log(err.message);
})

const app = express();

app.use(express.json());
app.use('/', router);


app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on port " + (process.env.PORT || 3000));
});
