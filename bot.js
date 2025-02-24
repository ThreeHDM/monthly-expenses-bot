const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN, {
  handlerTimeout: 20000
});

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

// Captura errores de Telegraf para evitar que el bot se detenga
bot.catch((err) => {
  console.error("Error en el bot:", err);
});

// Función para intentar reiniciar el bot si hay un problema de conexión
const restartBot = async () => {
  try {
    console.log("Intentando reiniciar el bot...");
    await bot.stop();
    await bot.launch();
    console.log("Bot reiniciado con éxito.");
  } catch (error) {
    console.error("Error al reiniciar el bot:", error);
    setTimeout(restartBot, 5000); // Intenta nuevamente en 5 segundos
  }
};

// Capturar errores globales para evitar que Docker lo cierre
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  restartBot();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  restartBot();
});

// Manejar señales de terminación para detener el bot correctamente en Docker
process.on("SIGINT", async () => {
  console.log("Deteniendo el bot...");
  await bot.stop();
  process.exit();
});

process.on("SIGTERM", async () => {
  console.log("Deteniendo el bot...");
  await bot.stop();
  process.exit();
});

// Iniciar el bot con un intento de recuperación
bot.launch().catch((err) => {
  console.error("Error al lanzar el bot:", err);
  restartBot();
});
