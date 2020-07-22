// import * as toHex from 'colornames';
import * as Discord from 'discord.js';
import {data, formatTime} from './data';
// eslint-disable-next-line node/no-unpublished-import
import * as env from 'dotenv';
import * as bson from 'bson';
import 'colors';
import {readFileSync, writeFileSync} from 'fs';

export function log(e: string) {
  if (!exit) console.info(e);
  const test = readFileSync('logs.bson').toString();
  let logs: string[];
  if (!test) {
    logs = [];
  } else {
    const a = readFileSync('logs.bson');
    const b = bson.deserialize(a);
    logs = b.logs;
  }
  logs.push(e);
  writeFileSync('logs.bson', bson.serialize({logs}));
}

let exit = false;
process.stdin.resume();
const beforeExit = () => {
  if (exit) return;
  exit = true;
  const test = readFileSync('logs.bson').toString();
  let logs: string[];
  if (!test) {
    logs = [];
  } else {
    const a = readFileSync('logs.bson');
    const b = bson.deserialize(a);
    logs = b.logs;
  }
  logs.push(`${'exit'.red} at ${formatTime()} quitting, adios.`);
  writeFileSync('logs.bson', bson.serialize({logs}));
  client.destroy();
  // eslint-disable-next-line no-process-exit
  process.exit(0);
};
process.on('SIGINT', beforeExit.bind(null));
process.on('exit', beforeExit.bind(null));
process.on('SIGUSR1', beforeExit.bind(null));
process.on('SIGUSR2', beforeExit.bind(null));

const getArguments = function (x: Discord.Message) {
  const w = x.content.split(' ');
  w.shift();
  return w;
};
env.config();

const client = new Discord.Client();
const prefix = data.prefix;
const commands = data.commands;
const hiddencommands = data.hiddencommands;
const token = process.env.TOKEN;
client.on('ready', () => {
  log(
    `${'connect'.green} at ${formatTime()} connected as ${
      client.user?.username.blue
    }!`
  );
});
client.on('message', msg => {
  if (msg.channel.type === 'dm') {
    if (msg.author.id === client.user!.id) return;
    log(
      `${'message'.green} at ${formatTime()} from ${msg.author.username.blue}:`
    );
    log(msg.content.yellow);
    return;
  }
  const args = getArguments(msg);
  let k: string;
  for (k in commands) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const v = commands[k];
    if (msg.content.split(' ')[0].toLowerCase() === prefix + k) {
      v.run(msg, args, client).catch(e => {
        log(`${'error'.red} at ${formatTime()} ${e}`);
        log(encodeURIComponent(e));
      });
    }
  }
  const results = [];
  for (k in hiddencommands) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const v = hiddencommands[k];
    if (msg.content.split(' ')[0].toLowerCase() === k) {
      results.push(
        v.run(msg, args, client).catch(e => {
          log(`${'error'.red} at ${formatTime()} ${e}`);
          log(encodeURIComponent(e));
        })
      );
    } else {
      results.push(void 0);
    }
  }
  return results;
});

client.login(token);
