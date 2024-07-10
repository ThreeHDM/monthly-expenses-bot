const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN, {
	handlerTimeout: ms('5s')
})

const processExpense = require("./processExpense.js");

const commands = ["ver", "car", "super", "far", "ropa", "otro", "auto", "sal", "viat", "mant"];

bot.command(commands, async (ctx) => {
  try {
    await processExpense(ctx);
  } catch (error) {
    console.error("Error processing command:", error);
    ctx.reply("Ocurrió un error al procesar el comando. Por favor, intenta nuevamente.");
  }
});

bot.launch();
