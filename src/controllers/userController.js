const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function signUp(req, res) {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({
        status: false,
        message: "both userName and password are required",
      });
    }
    const existing = await User.findOne({ userName });
    if (existing) {
      return res.status(409).json({
        status: false,
        message: "an user with userName already exists",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({ userName, password: hashedPass });

    const userData = {
      userId: user._id,
      userName,
      password,
    };

    return res.status(201).json({ status: true, userData });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
}

async function login(req, res) {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({
        status: false,
        message: "both userName and password are required",
      });
    }
    const existing = await User.findOne({ userName }).lean();
    if (!existing) {
      return res.status(401).json({
        status: false,
        message: "there is no user with userName",
      });
    }

    const passwordMatches = await bcrypt.compare(password, existing.password);

    if (!passwordMatches) {
      return res
        .status(401)
        .json({ status: false, message: "incorrect password" });
    }

    existing.password = password;

    const token = jwt.sign(
      { userName },
      process.env.JWT_SECRET || "mysecretkey"
    );

    res.setHeader("x-api-key", token);

    return res.status(201).json({ status: true, existing, token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
}

async function userDetails(req, res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .send({ status: false, message: "user not logged in" });
    }

    const newToken = token.replace("Bearer ","")

    let user;

    try{
        user = jwt.verify(newToken, (process.env.JWT_SECRET || "mysecretkey"),);
    }catch(err){
        console.log(err.message);
        return res.status(401).send({status:false, message:'invalid token'})
    }

    const userData = await User.findOne({userName:user.userName}).lean();

    delete userData.password

    return res.status(200).send({status:true,userData})

  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
}

module.exports = {
  signUp,
  login,
  userDetails,
};
