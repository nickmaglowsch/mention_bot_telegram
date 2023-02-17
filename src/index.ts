import { IUser } from './models/user';
import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import Group from "./models/group";
import { Create } from "./commands/create";
require('dotenv').config()

const logger = require('pino')()

const token = process.env.TOKEN || '';

const uri = process.env.DATABASE_URL || '';

mongoose
  .connect(uri)
  .then(() => {
    logger.info("Connected to database");
  })
  .catch((err) => {
    logger.info("Failed to connect to database");
    logger.info(err);
  });

const bot = new TelegramBot(token, { polling: true });

export const commands = {
  MENTION: '@',
  ADD: 'mb add ',
  CREATE: 'mb create group '
}

const ADMIN_COMMANDS = [
  commands.ADD,
  commands.CREATE,
]

bot.on("message", async (msg: TelegramBot.Message) => {
  if (!msg.text) return;
  const text = msg.text;
  logger.info(msg)

  if (ADMIN_COMMANDS.some((word) => text.includes(word))) {
    const userId = msg.from?.id;
    if (!userId) return;

    const chatMember = await bot.getChatMember(msg.chat.id, `${userId}`);

    if (chatMember.status !== 'creator' && chatMember.status !== 'administrator') {
      bot.sendMessage(msg.chat.id, `admin command`, {
        reply_to_message_id: msg.message_id,
      });
    }
  }

  const factory = new Factory()

  factory.create()

  if (text.startsWith(commands.CREATE)) {
    const create = new Create({
      text,
      bot,
      msg
    })

    create.exec();
  }

  if (text.startsWith(commands.ADD)) {
    const name = text.split(commands.ADD)[1]?.split(" ")[0].trim();
    if (!name) {
      bot.sendMessage(msg.chat.id, `por favor mande um nome para o grupo`, {
        reply_to_message_id: msg.message_id,
      });
    }
    try {
      const group = await Group.findOne({ groupId: msg.chat.id, name: name });
      logger.info(msg?.entities)
      const users = msg?.entities?.map(e => {
        if (!e.user) return
        const { id, first_name } = e.user
        return { id, first_name } as IUser
      }).filter(e => !!e) as unknown as IUser[] || []

      // special case for users with custom username (aka @username)
      const regex = /@(\S+)(?=\s)/g;
      // add space in the end just in case
      const mentions = `${text} `.match(regex) || [];

      const customUsers = mentions.map(m => {
        return { id: -1, first_name: m } as IUser
      })

      const allUsers = [...users, ...customUsers]

      if (!group || !allUsers) {
        throw "group_not_found_or_users_not_found"
      }


      const mergedArray = group.users.concat(allUsers).map((item) => {
        const matchingItem = group.users.find((x) => x.id === item.id);
        if (matchingItem) {
          return { ...matchingItem, ...item };
        }
        return item;
      });

      group.users = [...mergedArray]
      logger.info("merge")
      logger.info(group.users)

      await group.save()

      bot.sendMessage(msg.chat.id, `added`, {
        reply_to_message_id: msg.message_id,
      });
    } catch (error) {
      bot.sendMessage(msg.chat.id, `${error}`, {
        reply_to_message_id: msg.message_id,
      });
    }
  }

  if (text.includes(commands.MENTION)) {

    const name = text.split("@")[1].trim();

    const group = await Group.findOne({ groupId: msg.chat.id, name: name });

    if (!group || !group.users || group.users.length === 0) return;

    const mentions = group.users.reduce((acc: string, user: IUser) => {
      if (user.id === -1) {
        acc += `${user.first_name} `
      } else {
        acc += `<a href="tg://user?id=${user.id}">${user.first_name}</a> `;
      }
      return acc;
    }, "")

    bot.sendMessage(msg.chat.id, mentions, {
      reply_to_message_id: msg.message_id,
      parse_mode: "HTML",
    });
  }
});
