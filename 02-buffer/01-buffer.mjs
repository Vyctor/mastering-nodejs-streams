const buffer = Buffer.alloc(5);
buffer.fill("hi", 0, 2);
buffer.fill(0x3a, 2, 3); // hexa decimal char code for :
buffer.fill(0x29, 4, 5); // hexa decimal char code for 0
// error, when it reachs max value it should be moved to another buffer
//buffer.fill("h", 5, 6); // hexa decimal char code for 0

const anotherBuffer = Buffer.alloc(6);
anotherBuffer.set(buffer, buffer.byteOffset);
anotherBuffer.fill("four", 5, 6);
console.log(anotherBuffer.toString()); // hi:00

// or with full data
const message = "hey there!";
const preAllocated = Buffer.alloc(message.length, message);

// same thing of buffer.from(message)
const withBufferFrom = Buffer.from(message);
console.log(preAllocated.toString(), preAllocated); // hey there!
console.log(withBufferFrom.toString(), withBufferFrom); // hey there!

const string = "Hello World!";
const charCodes = [];
const bytes = [];
for (const index in string) {
  const code = string.charCodeAt(index);
  const byteCode = "0x" + Math.abs(code).toString(16);
  charCodes.push(code);
  bytes.push(byteCode);
}

console.log({
  charCodes,
  bytes,
  contentFromCharCodes: Buffer.from(charCodes).toString(),
  contentFromHexaBytes: Buffer.from(bytes).toString(),
});
