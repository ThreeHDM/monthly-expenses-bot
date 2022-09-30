const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const processExpense = require("./processExpense.js");


bot.command(["ver", "car", "super", "far", "ropa", "gaso", "otro"], (ctx) => {
  processExpense(ctx);
});

bot.launch();
