// node -e "process.stdout.write("hello world\n".repeat(1e7))" > big.file
import { createServer, get } from "node:http";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { setTimeout } from "node:timers/promises";
import { PassThrough } from "node:stream";
import { CallTracker, deepStrictEqual } from "node:assert";
const file = createReadStream("./big.file");
const file2 = createReadStream("./big.file");
createServer((req, res) => {
  console.log("connection received from api 01");
  // pipe can consume partially stream
  file.pipe(res);
}).listen(3000, () => console.log("Server started on http://localhost:3000"));

createServer(async (req, res) => {
  console.log("connection received from api 02");
  // pipe can consume partially stream
  // ERR_STREAM_PREMATURE_CLOSE: Premature close if you dont consume the whole stream
  await pipeline(file2, res);
}).listen(3001, () => console.log("Server started on http://localhost:3001"));

await setTimeout(500);

const getHttpStream = (url) =>
  new Promise((resolve) => {
    get(url, (res) => resolve(res)); // consume the stream
  });

const pass = () => PassThrough();
const streamPipe = await getHttpStream("http://localhost:3000");
streamPipe.pipe(pass());

const streamPipeline = await getHttpStream("http://localhost:3001");
streamPipeline.pipe(pass());

streamPipe.destroy();
streamPipeline.destroy();

const tracker = new CallTracker();

const fn = tracker.calls((msg) => {
  console.log("stream.pipline rejects if you dont fully consume the stream");
  deepStrictEqual(msg.message, "Premature close");
  process.exit();
});

process.on("uncaughtException", fn);
await setTimeout(10);
tracker.verify();
