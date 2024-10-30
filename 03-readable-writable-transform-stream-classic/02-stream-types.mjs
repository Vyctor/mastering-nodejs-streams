import { read } from "node:fs";
import { Readable, Writable, Transform } from "node:stream";
import { createWriteStream } from "node:fs";
import { randomUUID } from "node:crypto";

// datasource: file, database, website, anything you can consume on demand!
const readable = Readable({
  read() {
    // 1.000.000
    for (let i = 0; i < 1e6; i++) {
      const person = { id: randomUUID(), name: `Person ${i}` };
      const data = JSON.stringify(person);
      this.push(data);
    }
    this.push(null);
  },
});

const mapFields = Transform({
  transform(chunk, encoding, callback) {
    const data = JSON.parse(chunk);
    const result = `${data.id},${data.name.toUpperCase()}\n`;
    callback(null, result);
  },
});

const mapHeaders = Transform({
  transform(chunk, encoding, callback) {
    this.counter = this.counter ?? 0;
    if (this.counter !== 0) {
      return callback(null, chunk);
    }
    callback(null, "id,name\n".concat(chunk));
    this.counter++;
  },
});

// writable is always the output, the final destination
const pipeline = readable
  .pipe(mapFields)
  .pipe(mapHeaders)
  .pipe(createWriteStream("output.csv"));

pipeline.on("end", () => {
  console.info("Pipeline finished");
});
