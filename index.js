import express from "express";
import cors from "cors";
import { createUser, getData, getToken } from "./controller.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const router = express.Router();

const PORT = 8000;

router.post("/signUp", createUser);
router.get("/logIn", getToken);
router.get("/retrieveData", getData);

app.use("/", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
});

app.listen(PORT, () => console.log(`Task C Service listening on port ${PORT}`));

export default app;
