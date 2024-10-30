// for i in `seq 1 40`; do node -e "process.stdout.write('$hello world\n'.repeat(1e7))" >> big.file; done

import { promises, createReadStream, statSync } from "node:fs";

const filename = "./big.file";

try {
  const file = await promises.readFile(filename, "utf-8");
  console.log("file size", file.byteLength / 1e9, "GB", "\n");
  console.log("filebuffer", file);
} catch (error) {
  console.error("max 2GB reached", error.message);
}

let chunkConsumed = 0;
const stream = createReadStream(filename)
  .once("data", (message) => {
    console.log("on data length", message.toString().length);
  })
  .once("readable", (_) => {
    console.log("read 11 chunk bytes", stream.read(11).toString());
    chunkConsumed += 11;
  })
  .on("readable", (_) => {
    let chunk;
    // stream.read() reads max 65kb
    while (null !== (chunk = stream.read())) {
      chunkConsumed += chunk.length;
    }
  })
  .on("end", (_) => {
    console.info(`Read ${chunkConsumed / 1e9} gigabytes of data`);
  });
