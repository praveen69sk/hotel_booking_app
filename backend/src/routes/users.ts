import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isString(),
    check("password", "Password with 6 or More characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, resp: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      resp.status(400).json({ message: errors.array() });
      return;
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        resp.status(400).json({ message: "User already exists" });
        return;
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      resp.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      resp.sendStatus(200);
      return;
    } catch (error) {
      console.log(error);
      resp.status(500).send({ message: "Something went wrong" });
      return;
    }
  }
);

export default router;
