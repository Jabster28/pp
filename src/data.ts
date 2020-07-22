import * as Discord from 'discord.js';
import * as toHex from 'colornames';
import * as Search from 'fuzzy-search';
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
    coffee: {
      run: async function (msg: Discord.Message) {
        if (msg.member?.id === myID) {
          const user = msg.mentions.members
            ? msg.mentions.members.first()
            : msg.member;

          user?.roles.add(adminRole).catch(e => {
            const embed = new Discord.MessageEmbed();
            embed.setColor(toHex('red')!);
            embed.setTitle('Error:');
            embed.addField(e.name, e.message);
            embed.setDescription(
              `Please tag <@${myID}> and let them know about this.`
            );
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
          });
        }
      },
    },
    deletus: {
      run: async function (msg: Discord.Message) {
        const user = msg.mentions.members
          ? msg.mentions.members.first()
          : msg.member;

        user?.roles.remove(adminRole).catch(e => {
          const embed = new Discord.MessageEmbed();
          embed.setColor(toHex('red')!);
          embed.setTitle('Error:');
          embed.addField(e.name, e.message);
          embed.setDescription(
            `Please tag <@${myID}> and let them know about this.`
          );
          embed.setFooter('Bot made by Jabster28#6048');
          msg.channel.send(embed);
        });
      },
    },
    say: {
      run: async function (msg: Discord.Message) {
        msg.delete();
        msg.channel.send(msg.content.substring(4));
      },
    },
    gay: {
      run: async function (msg: Discord.Message) {
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
          reason = ' Reason: ' + args?.splice(1).join(' ');
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
            embed.setTitle('Back to the graveyard, ' + usr?.user.username);
            embed.setDescription(
              `<@${usr?.user.id}> has been muted by <@${msg.author.id}>. ${reason}`
            );
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
          })
          .catch(e => {
            const embed = new Discord.MessageEmbed();
            embed.setColor(toHex('red')!);
            embed.setTitle('Error:');
            embed.addField(e.name, e.message);
            embed.setDescription(
              `Please tag <@${myID}> and let them know about this.`
            );
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
          });
      },
    },
    unmute: {
      desc: 'Unmutes the user.',
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
              'Get up, ' +
                usr?.user.username +
                ", you've been given another chance."
            );
            embed.setDescription(`<@${usr?.user.id}> has been unmuted.`);
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
          })
          .catch(e => {
            const embed = new Discord.MessageEmbed();
            embed.setColor(toHex('red')!);
            embed.setTitle('Error:');
            embed.addField(e.name, e.message);
            embed.setDescription(
              `Please tag <@${myID}> and let them know about this.`
            );
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
          });
      },
    },
    kick: {
      desc: 'Kicks the user. Also circumsises them.',
      args: '(@user)',
      run: async function (msg, args) {
        if (!msg.member?.hasPermission('MANAGE_ROLES')) {
          msg.channel.send(
            "Woah, if we let you do that we'd have a problem on our hands."
          );
          return;
        }
        let reason: string;
        if (args?.length > 1) {
          reason = 'Reason: ' + args?.splice(1).join(' ');
        } else {
          reason = '';
        }
        const usr = msg.mentions.members?.first();
        if (usr?.id === myID) {
          msg.channel.send('Sorry, Jab, but rules are rules.');
        }
        const embedd = new Discord.MessageEmbed();
        embedd.setColor(toHex('orange')!);
        embedd.setTitle(
          "You've been kicked. Try not to make that happen again."
        );
        embedd.setDescription(
          `You were kicked by <@${msg.author.id}>. ${reason}`
        );
        embedd.setFooter('Bot made by Jabster28#6048');
        usr?.send(embedd);
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
                  .then(() => {
                    const embed = new Discord.MessageEmbed();
                    embed.setColor(toHex('orange')!);
                    embed.setTitle(
                      'Whoops, ' +
                        usr?.user.username +
                        ' has been temporarly circumsised. RIP.'
                    );
                    embed.setDescription(
                      `<@${usr?.user.id}> has been kicked. ${reason}`
                    );
                    embed.setFooter('Bot made by Jabster28#6048');
                    msg.channel.send(embed);
                  })
                  .catch(e => {
                    const embed = new Discord.MessageEmbed();
                    embed.setColor(toHex('red')!);
                    embed.setTitle('Error:');
                    embed.addField(e.name, e.message);
                    embed.setDescription(
                      `Please tag <@${myID}> and let them know about this.`
                    );
                    embed.setFooter('Bot made by Jabster28#6048');
                    msg.channel.send(embed);
                  });
              });
          });
      },
    },
    ban: {
      desc: 'Bans the user. Also castrates them.',
      args: '(@user)',
      run: async function (msg, args) {
        if (!msg.member?.hasPermission('MANAGE_ROLES')) {
          msg.channel.send(
            "Woah, if we let you do that we'd have a problem on our hands."
          );
          return;
        }
        let reason: string;
        if (args?.length > 1) {
          reason = ' Reason: ' + args?.splice(1).join(' ');
        } else {
          reason = '';
        }
        const usr = msg.mentions.members?.first();
        usr
          ?.ban({
            reason: reason,
          })
          .then(() => {
            const embed = new Discord.MessageEmbed();
            embed.setColor(toHex('red')!);
            embed.setTitle(
              'Whoops, ' +
                usr?.user.username +
                ' has been permanently castrated. RIP.'
            );
            embed.setDescription(
              `<@${usr?.user.id}> has been banned. ${reason}`
            );
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
          })
          .catch(e => {
            const embed = new Discord.MessageEmbed();
            embed.setColor(toHex('red')!);
            embed.setTitle('Error:');
            embed.addField(e.name, e.message);
            embed.setDescription(
              `Please tag <@${myID}> and let them know about this.`
            );
            embed.setFooter('Bot made by Jabster28#6048');
            msg.channel.send(embed);
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
            embed.addField(prefix + k + ' ' + (v.args || ' '), v.desc);
          }
        } else {
          const searcher = new Search(Object.keys(ref));
          const res = searcher.search(x);
          for (k in res) {
            const v = ref[res[k]];
            embed.addField(prefix + res[k] + ' ' + (v.args || ' '), v.desc);
          }
        }
        embed.setFooter(
          'Arguments in (parentheses) are required, and arguments in [brackets] are optional and will default to the {braces} option.\nBot made by Jabster28#6048'
        );
        return msg.channel.send(embed);
      },
    },
  },
};
