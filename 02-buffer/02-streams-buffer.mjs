// for i in `seq 1 100`; do node -e "process.stdout.write('$i-hello world\n')" >> text.txt; done

import { readFile } from "fs/promises";

// if its a big file, it will crash or make your program slow
// gonna fix it in the next class with streams
const data = (await readFile("text.txt")).toString().split("\n");

const LINES_PER_ITERATION = 10;
const iteration = data.length / LINES_PER_ITERATION;
let page = 0;

for (let index = 1; index < iteration; index++) {
  const chunk = data.slice(page, (page += LINES_PER_ITERATION)).join("\n");

  // imagine this as the maximum 2GB buffer Node.js can handle per time
  const buffer = Buffer.from(chunk);
  const amountOfBytes = buffer.byteOffset;
  const bufferData = buffer.toString().split("\n");
  const amountOfLines = bufferData.length;

  // now the buffer data would be splitted into small pieces and processed individually, on-demand
  console.log({ amountOfBytes, amountOfLines });
}
