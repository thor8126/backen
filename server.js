import { app } from "./app.js";
import { connectDB } from "./config/db.js";
const port = process.env.PORT || 8000;

// here i am starting the server
connectDB()
  .then(() => {
    app.listen(port, () =>
      console.log(`Server is listening on this port no. ${port}`)
    );
  })
  .catch((err) => console.log(err));
