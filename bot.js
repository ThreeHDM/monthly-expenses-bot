const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const processExpense = require("./processExpense.js");

const commands = ["ver", "car", "super", "far", "ropa", "otro", "auto", "sal", "viat", "mant"];

bot.command(commands, (ctx) => {
  processExpense(ctx);
});

bot.launch();
