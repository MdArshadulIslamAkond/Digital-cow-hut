import mongoose from "mongoose";
import app from "./app";
import config from "./config/index";

async function boostrap() {
  try {
    await mongoose.connect(config.datrabase_url as string);
    console.log("Connected to MongoDB successfully");
    app.listen(config.port, () => {
      console.log(`Application listening on port ${config.port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

boostrap();
