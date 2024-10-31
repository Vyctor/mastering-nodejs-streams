import { read, write } from "node:fs";
import { Duplex, Transform } from "node:stream";

const server = Duplex({
  objectMode: true,
  write(chunk, enc, callback) {
    console.log(`[writable] saving`, chunk);
    callback();
  },
  read() {
    const everySecond = (intervalContext) => {
      this.counter = this.counter ?? 0;
      if (this.counter++ <= 5) {
        this.push(`[readable] ${this.counter}\n`);
        return;
      }
      clearInterval(intervalContext);
      this.push(null);
    };

    setInterval(function () {
      everySecond(this);
    });
  },
});

/**
 * To prove that they are different channels write triggers the writable stream from our duplex stream
 */
server.write("[duplex] key is a writable\n");

// on data -> our server.on("data") is triggered every time we call the push method
server.push("[duplex] key is also a readable\n");
const transformToUpperCase = Transform({
  objectMode: true,
  transform(chunk, enc, callback) {
    callback(null, chunk.toUpperCase());
  },
});

transformToUpperCase.write(`[transform] hello from writter`);
// the push method will ignore what you have in the transform function
transformToUpperCase.push(`[transform] hello from reader`);

server
  .pipe(transformToUpperCase)
  // it will redirect all data to the duplex writable channel
  .pipe(server);
