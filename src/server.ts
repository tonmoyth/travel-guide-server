import app from "./app";
import { envVeriables } from "./config/env";

async function main() {
  try {
    app.listen(envVeriables.PORT, () => {
      console.log(`Example app listening on port ${envVeriables.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
