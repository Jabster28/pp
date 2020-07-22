import * as Discord from 'discord.js';
import toHex from 'colornames';
import Search from 'fuzzy-search';
import {readdirSync} from 'fs';
import 'colors';
import {log} from './index';
export const formatTime = () => {
  const x = new Date();
  return `${x.getHours()}:${x.getMinutes()}:${x.getSeconds()}, ${x.getDay()}/${x.getMonth()}/${x.getFullYear()}`
    .gray;
};

declare type command = {
  run: (
    msg: Discord.Message,
    args: string[],
    client: Discord.Client
  ) => Promise<unknown>;
  desc?: string;
  args?: string;
};
// {[key: string]: command}
const prefix = '-';
const myID = '350930610719817728';
const muteRole = '710057816718573569';
const adminRole = '711606507237671022';
export const data: {
  hiddencommands: {[key: string]: command};
  commands: {[key: string]: command};
  prefix: string;
} = {
  prefix: prefix,
  hiddencommands: {
    bbbcoffee: {
      run: async function (msg) {
        const user = msg.mentions.members?.array()
          ? msg.mentions.members.first()
          : msg.member;

        user?.roles.add(adminRole).catch(async e => {
          const embed = new Discord.MessageEmbed();
          embed.setColor(toHex('red')!);
          embed.setTitle('Error:');
          embed.addField(e.name, e.message);
          embed.setDescription(
            `Please tag <@${myID}> and let them know about this.`
          );
          embed.setFooter('Bot made by Jabster28#6048');
          msg.channel.send(embed);
          log(`${'error'.red} at ${formatTime()} ${e}`);
          log(encodeURIComponent(e));
        });
      },
    },
    bbbdeletus: {
      run: async function (msg) {
        const user = msg.mentions.members
          ? msg.mentions.members.first()
          : msg.member;

        user?.roles.remove(adminRole).catch(async e => {
          const embed = new Discord.MessageEmbed();
          embed.setColor(toHex('red')!);
          embed.setTitle('Error:');
          embed.addField(e.name, e.message);
          embed.setDescription(
            `Please tag <@${myID}> and let them know about this.`
          );
          embed.setFooter('Bot made by Jabster28#6048');
          msg.channel.send(embed);
          log(`${'error'.red} at ${formatTime()} ${e}`);
          log(encodeURIComponent(e));
        });
      },
    },
    say: {
      run: async function (msg) {
        msg.delete();
        msg.channel.send(msg.content.substring(4));
      },
    },
    gay: {
      run: async function (msg) {
        msg.reply('no u lmao');
      },
    },
  },
  commands: {
    mute: {
      desc: 'Puts the user with the rest of the dead memes.',
      args: '(@user)',
      run: async function (msg, args) {
        let reason: string;
        if (!msg.member?.hasPermission('MANAGE_ROLES')) {
          msg.channel.send('Bruh, only mods can do that.');
          return;
        }
        if (args?.length > 1) {
          reason = `Reason: ${args?.splice(1).join(' ')}`;
        } else {
          reason = '';
        }
        const usr = msg.mentions.members?.first();
        usr?.roles
          .add(muteRole)
          .then(() => {
            if (usr?.voice.channel) usr?.voice.kick(reason);
            const embed = new Discord.MessageEmbed();
            embed.setColor(toHex('yellow')!);
            embed.setTitle(`Back to the graveyard, ${usr?.user.username}`);
            embed.setDescription(
              `<@${usr?.user.id}> has been muted by <@${msg.author.id}>. ${reason}`
            );
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
          })
          .catch(async e => {
            const embed = new Discord.MessageEmbed();
            embed.setColor(toHex('red')!);
            embed.setTitle('Error:');
            embed.addField(e.name, e.message);
            embed.setDescription(
              `Please tag <@${myID}> and let them know about this.`
            );
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
            log(`${'error'.red} at ${formatTime()} ${e}`);
            log(encodeURIComponent(e));
          });
      },
    },
    unmute: {
      desc: 'Will unmute the user.',
      args: '(@user)',
      run: async function (msg) {
        if (!msg.member?.hasPermission('MANAGE_ROLES')) {
          msg.channel.send('Bruh, only mods can do that.');
          return;
        }
        const usr = msg.mentions.members?.first();
        usr?.roles
          .remove(muteRole)
          .then(() => {
            const embed = new Discord.MessageEmbed();
            embed.setColor(toHex('green')!);
            embed.setTitle(
              `Get up, ${usr?.user.username}, you've been given another chance.`
            );
            embed.setDescription(`<@${usr?.user.id}> has been unmuted.`);
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
          })
          .catch(async e => {
            const embed = new Discord.MessageEmbed();
            embed.setColor(toHex('red')!);
            embed.setTitle('Error:');
            embed.addField(e.name, e.message);
            embed.setDescription(
              `Please tag <@${myID}> and let them know about this.`
            );
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
            log(`${'error'.red} at ${formatTime()} ${e}`);
            log(encodeURIComponent(e));
          });
      },
    },
    kick: {
      desc: 'Kicks the user. Also circumcises them.',
      args: '(@user)',
      run: async function (msg, args) {
        const usr = msg.mentions.members?.first();
        if (!usr) {
          log(
            `${'kick'.red} at ${formatTime()} ${
              msg.author.username
            } got kicked because they didn't specify a name`
          );
          const embed2 = new Discord.MessageEmbed();
          embed2.setColor(toHex('orange')!);
          embed2.setTitle(
            `You've been kicked from ${msg.guild?.name}. Try not to make that happen again.`
          );
          embed2.setDescription(
            `You were kicked by <@${msg.author.id}>. Specify someone next time.`
          );
          embed2.setFooter('Bot made by Jabster28#6048');
          msg.author.send(embed2);
          msg.guild?.systemChannel
            ?.createInvite({
              maxUses: 1,
              maxAge: 0,
            })
            .then(i => {
              msg.author
                .send(
                  `Here's a temporary invite, in case you want to join back.\n\n${i}`
                )
                .finally(() => {
                  msg.member!.kick(
                    "didn't specify who to kick so i just kicked them lmao"
                  );
                });
            });
          msg.channel.send(
            "lol they didn't specify who to kick so i just kicked them"
          );
          return;
        }
        if (!msg.member?.hasPermission('MANAGE_ROLES')) {
          msg.channel.send(
            "Woah, if we let you do that we'd have a problem on our hands."
          );
          return;
        }
        let reason: string;
        if (args?.length > 1) {
          reason = `Reason: ${args?.splice(1).join(' ')}`;
        } else {
          reason = '';
        }
        if (usr?.id === myID) {
          msg.channel.send('Sorry, Jab, but rules are rules.');
        }
        const embed2 = new Discord.MessageEmbed();
        embed2.setColor(toHex('orange')!);
        embed2.setTitle(
          "You've been kicked. Try not to make that happen again."
        );
        embed2.setDescription(
          `You were kicked by <@${msg.author.id}>. ${reason}`
        );
        embed2.setFooter('Bot made by Jabster28#6048');
        usr?.send(embed2);
        msg.guild?.systemChannel
          ?.createInvite({
            maxUses: 1,
            maxAge: 0,
          })
          .then(i => {
            usr
              ?.send(
                `Here's a temporary invite, in case you want to join back.\n\n${i}`
              )
              .then(() => {
                usr
                  ?.kick()
                  .finally(() => {
                    const embed = new Discord.MessageEmbed();
                    embed.setColor(toHex('orange')!);
                    embed.setTitle(
                      `Whoops, ${usr?.user.username} has been temporarily circumcised. RIP.`
                    );
                    embed.setDescription(
                      `<@${usr?.user.id}> has been kicked. ${reason}`
                    );
                    embed.setFooter('Bot made by Jabster28#6048');
                    msg.channel.send(embed);
                  })
                  .catch(async e => {
                    const embed = new Discord.MessageEmbed();
                    embed.setColor(toHex('red')!);
                    embed.setTitle('Error:');
                    embed.addField(e.name, e.message);
                    embed.setDescription(
                      `Please tag <@${myID}> and let them know about this.`
                    );
                    embed.setFooter('Bot made by Jabster28#6048');
                    msg.channel.send(embed);
                    log(`${'error'.red} at ${formatTime()} ${e}`);
                    log(encodeURIComponent(e));
                  });
              });
          });
      },
    },
    ban: {
      desc: 'Bans the user. Also castrates them.',
      args: '[@user] {you lmao}',
      run: async function (msg, args) {
        const usr = msg.mentions.members?.first();

        if (!usr) {
          msg.author
            .send('lmao try specifying someone next time')
            .finally(() => {
              msg.member!.ban({
                reason: "didn't specify who to ban so i just banned them lmao",
              });
            });
          msg.channel.send(
            "lol they didn't specify who to ban so i just banned them"
          );
          return;
        }
        if (!msg.member?.hasPermission('MANAGE_ROLES')) {
          msg.channel.send(
            "Woah, if we let you do that we'd have a problem on our hands."
          );
          return;
        }
        let reason: string;
        if (args?.length > 1) {
          reason = ` Reason: ${args?.splice(1).join(' ')}`;
        } else {
          reason = '';
        }
        usr
          ?.ban({
            reason: reason,
          })
          .then(() => {
            const embed = new Discord.MessageEmbed();
            embed.setColor(toHex('red')!);
            embed.setTitle(
              `Whoops, ${usr?.user.username} has been permanently castrated. RIP.`
            );
            embed.setDescription(
              `<@${usr?.user.id}> has been banned. ${reason}`
            );
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
          })
          .catch(async e => {
            const embed = new Discord.MessageEmbed();
            embed.setColor(toHex('red')!);
            embed.setTitle('Error:');
            embed.addField(e.name, e.message);
            embed.setDescription(
              `Please tag <@${myID}> and let them know about this.`
            );
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
            log(`${'error'.red} at ${formatTime()} ${e}`);
            log(encodeURIComponent(e));
          });
      },
    },
    help: {
      desc: 'Shows all commands. (and searches arguments)',
      args: '(command)',
      run: async function (msg, args) {
        const x = args?.join(' ');
        const embed = new Discord.MessageEmbed();
        embed.setColor(toHex('cobaltgreen')!);
        embed.setTitle('PP');
        embed.setDescription(
          'The bot with the second biggest PP (first is mee6)'
        );
        const ref: {[key: string]: command} = data.commands;
        let k: string;
        if (!x) {
          for (k in ref) {
            const v = ref[k];
            embed.addField(`${prefix + k} ${v.args || ' '}`, v.desc);
          }
        } else {
          const searcher = new Search(Object.keys(ref));
          const res = searcher.search(x);
          for (k in res) {
            const v = ref[res[k]];
            embed.addField(`${prefix + res[k]} ${v.args || ' '}`, v.desc);
          }
        }
        embed.setFooter(
          'Arguments in (parentheses) are required, and arguments in [brackets] are optional and will default to the {braces} option.\nBot made by Jabster28#6048'
        );
        return msg.channel.send(embed);
      },
    },
    play: {
      desc:
        "Plays a sound effect. Note: this isn't a replacement for groovy, only a couple SFX work",
      args: '(sound effect)',
      run: async function (msg, args, client) {
        const file = args.join(' ').trim().replace(/\s/g, '_');

        if (!msg.guild) return;
        if (!msg.member) return;
        if (!file) {
          const SFX = readdirSync('assets');
          const list: string[] = [];
          for (const i in SFX) {
            const song = SFX[i];
            list.push(song.split('.')[0].replace(/_/g, ' '));
          }
          msg.author
            .send('Available Sound Effects: ' + list.join(' | '))
            .finally(() => {
              log(
                `${'soundEffect'.blue} at ${formatTime()} ${
                  msg.author.username.blue
                } asked for a list of SFX`
              );
              msg.reply("I've DMed you a list of available sound effects.");
            });
        } else {
          if (msg.member.voice.channel) {
            const connection = await msg.member.voice.channel.join();
            const dispatcher = connection.play(`assets/${file}.webm`);
            log(
              `${'soundEffect'.green} at ${formatTime()} ${
                msg.author.username.blue
              } wanted to hear ${(file + '.webm').yellow}`
            );
            dispatcher.on('finish', async () => {
              log(
                `${'soundEffect'.green} at ${formatTime()} Finished playing!`
              );
              dispatcher.destroy(); // end the stream
              client.voice?.connections.each(e => e.disconnect());
            });
            dispatcher.setVolume(1); // half the volume
            dispatcher.resume();
          } else {
            if (!msg.mentions.members?.array) return;
            const usr = msg.mentions.members?.first();
            if (usr?.voice.channel?.joinable) {
              log(
                `${'soundEffect'.green} at ${formatTime()} ${
                  msg.author.username.blue
                } wanted ${usr.user.username.red} to hear hear ${file.yellow}`
              );
              const connection = await usr.voice.channel?.join();
              const dispatcher = connection.play(`assets/${file}.webm`);
              log(__dirname);
              dispatcher.setVolume(10); // half the volume
              dispatcher.resume();
              dispatcher.on('finish', async () => {
                log(
                  `${'soundEffect'.green} at ${formatTime()} Finished playing!`
                );
                client.voice?.connections.each(e => e.disconnect());
              });
            }
          }
        }
      },
    },
    stop: {
      desc: "Kicks all bots from VC. Useful if someone's being a prick.",
      run: async function (msg) {
        msg.guild?.members.cache.each(e => {
          if (e.user.bot) {
            e.voice.kick();
          }
        });
        log(
          `${'soundEffect'.green} at ${formatTime()} ${
            msg.author.username.blue
          } wanted to disconnect all bots`
        );
      },
    },
  },
};
