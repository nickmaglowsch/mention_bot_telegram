import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import { TelegramFactory } from "./factory";
import { isCommand, isUserAllowedToUseCommand } from "./utils";
import pino from "pino";
import dotenv from "dotenv";
import commands from "./commands";

// register commands
commands.forEach(command => command.registryCommand(command.commandName));

dotenv.config();
const logger = pino();
const token = process.env.TOKEN || "";
const uri = process.env.DATABASE_URL || "";

mongoose
    .connect(uri)
    .then(() => logger.info("Connected to database"))
    .catch((err) => {
        logger.info("Failed to connect to database");
        logger.info(err);
    });

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg: TelegramBot.Message) => {
    if (!msg.text) return;
    const text = msg.text;
    logger.info(msg);
    if (
        !(await isUserAllowedToUseCommand(msg.from?.id, bot, msg.chat.id, text))
    ) {
        await bot.sendMessage(msg.chat.id, "admin only command", {
            reply_to_message_id: msg.message_id
        });
        return;
    }
    if (!isCommand(text)) return;

    const factory = new TelegramFactory(
        text,
        msg?.entities,
        msg.chat.id,
        msg.from?.username || msg.from?.id || ""
    );
    try {
        const command = factory.build();
        const message = await command.exec();
        if (message)
            await bot.sendMessage(msg.chat.id, message, {
                reply_to_message_id: msg.message_id,
                parse_mode: "HTML"
            });
    } catch (e) {
        logger.error(e);
    }
});
