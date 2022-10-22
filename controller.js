import mongoose from "mongoose";
import "dotenv/config";
import user from "./model/user.js";
import jwt from "jsonwebtoken";
import userToken from "./model/userToken.js";
import moment from "moment";
import userRole from "./model/userRole.js";
import rolePermissions from "./model/rolePermissions.js";

const { TokenExpiredError } = jwt;

mongoose.connect(process.env.DB_URL);

export async function getToken(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please include email and password" });
  }
  try {
    const existingUser = await user.findOne({
      email: email,
      password: password,
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Email and password is not registered" });
    }

    const existingToken = await userToken.findOne({ email: email });

    if (existingToken && moment() < moment(existingToken.expiryDate)) {
      return res.status(200).json({ token: existingToken.token });
    }

    var token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
      expiresIn: 3600,
    });

    const expiryDate = moment().add(3600, "seconds");
    if (!existingToken) {
      const newToken = await userToken({ email, token, expiryDate });
      await newToken.save();
    } else {
      console.log("Expired");
      await userToken.updateOne({ email: email }, { token, expiryDate });
    }
    return res.status(200).json({ token: token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please include email and password" });
  }

  try {
    const existingUser = await user.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const newUser = new user({ email, password });
    await newUser.save();

    return res.status(200).json();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getData(req, res) {
  const { email, token } = req.body;

  //Authentication
  if (!email) {
    return res.status(400).json({ message: "Please provide an email" });
  }

  if (!token) {
    return res.status(401).json({ message: "Please provide an token" });
  }

  const result = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err, decoded) => {
      if (err instanceof TokenExpiredError) {
        return {
          status: 401,
          message: "Access Token expired!",
        };
      }
      if (!!!decoded || email != decoded.email) {
        return {
          status: 401,
          message: "Unauthorized!",
        };
      }
      return {
        status: 200,
        message: "SUCCESS",
      };
    }
  );

  if (result.status == 401) {
    return res.status(401).send({ message: result.message });
  }

  //Authorization
  const roleResult = await userRole.findOne({ email: email });
  if (!roleResult) {
    return res.status(403).send({ message: "You do not have a role" });
  }

  const permissions = await rolePermissions.findOne({
    role: roleResult.role,
    type: "GET",
    route: "/retrieveData",
  });

  if (!permissions) {
    return res
      .status(403)
      .send({ message: "You do not have the permission for this request" });
  }

  return res.status(200).send({ message: "SUCCESS" });
}
