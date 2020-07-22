const fs = require('fs');
const bson = require('bson');
let logs;
const x = fs.readFileSync('logs.bson');
const y = x.toString();
const z = y.length;
if (!z) {
  logs = [];
  fs.writeFileSync('logs.bson', bson.serialize({logs}));
} else {
  const a = fs.readFileSync('logs.bson');
  const b = bson.deserialize(a);
  logs = b.logs;
}

if (!logs) logs = [];

for (const i in logs) {
  console.log(logs[i]);
}
