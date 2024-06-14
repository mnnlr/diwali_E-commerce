import express from "express";
import cors from "cors";
import db from "./database/db.js";

// importing routes
import autheticateRoute from "./routes/authenticateRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import registereRoute from "./routes/registereRoute.js";
import loginRoute from "./routes/loginRoute.js";
import saveOrderRoute from "./routes/saveOrderRoute.js";
import saveWishlistRoute  from "./routes/saveWishlistRoute.js";
import addtoCartRoute from "./routes/addtoCartRoute.js";
import girlsDataRoute from"./routes/girlsDataRoute.js";

const app = express();
const PORT = 3002;
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    withCredentials: true,
    credentials: true,
  })
);

db();

app.use('/girls', girlsDataRoute);
app.use("/register", registereRoute);
app.use("/login", loginRoute);
app.use("/authenticate", autheticateRoute);
app.use("/checkout", paymentRoute);
app.use("/save-order", saveOrderRoute);
app.use("/wishlist", saveWishlistRoute);
app.use("/addtocart", addtoCartRoute);

app.listen(`${PORT}`, () => {
  console.log(`Server listening on port ${PORT}`);
});
