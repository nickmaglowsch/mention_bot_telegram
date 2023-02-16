import { IUser } from './models/user';
import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import Group, { IGroup } from "./models/group";
import _ from "lodash";
require('dotenv').config()

const token = process.env.TOKEN || '';

const uri = process.env.DATABASE_URL || '';

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Failed to connect to database");
    console.log(err);
  });

const bot = new TelegramBot(token, { polling: true });

const commands = {
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

  if (text.includes(commands.MENTION)) {

    const name = text.split("@")[1].trim();

    const group = await Group.findOne({ groupId: msg.chat.id, name: name });

    if (!group || !group.users || group.users.length === 0) return;

    const mentions = group.users.reduce((acc: string, user: IUser) => {
      acc += `[${user.first_name}](tg://user?id=${user.id}) `;
      return acc;
    }, "")

    bot.sendMessage(msg.chat.id, mentions, {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown",
    });
  }

  if (text.startsWith(commands.CREATE)) {
    const name = text.split(commands.CREATE)[1]?.trim();
    if (!name) {
      bot.sendMessage(msg.chat.id, `por favor mande um nome para o grupo`, {
        reply_to_message_id: msg.message_id,
      });
    }
    try {
      await Group.create({
        groupId: msg.chat.id,
        name: name,
        users: [],
      });
      bot.sendMessage(msg.chat.id, `created!`, {
        reply_to_message_id: msg.message_id,
      });
    } catch (error) {
      bot.sendMessage(msg.chat.id, `${error}`, {
        reply_to_message_id: msg.message_id,
      });
    }
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
      const users = msg?.entities?.map(e => {
        if (!e.user) return
        const { id, first_name } = e.user
        return { id, first_name }
      })

      if (!group || !users) {
        throw "group_not_found_or_users_not_found"
      }

      group.users = _.merge(group.users, users)

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
});
