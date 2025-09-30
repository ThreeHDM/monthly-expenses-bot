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
let restartAttempts = 0;
const MAX_RESTART_ATTEMPTS = 5;
const restartBot = async () => {
  try {
    console.log("Intentando reiniciar el bot...");
    if (bot.botInfo) {
      await bot.stop();
    }
    await bot.launch();
    console.log("Bot reiniciado con éxito.");
    restartAttempts = 0; // Reset counter on success
  } catch (error) {
    console.error("Error al reiniciar el bot:", error);
    restartAttempts++;

    // Check for rate limiting or network issues
    if (error.response?.error_code === 429 || error.code === 'ECONNRESET' ||
        error.response?.error_code === 504 || error.response?.error_code === 502) {
      console.log(`Detected network/rate limit issue. Waiting longer before retry...`);
      const waitTime = Math.min(30000 + (restartAttempts * 10000), 300000); // Max 5 minutes
      setTimeout(restartBot, waitTime);
    } else if (restartAttempts < MAX_RESTART_ATTEMPTS) {
      setTimeout(restartBot, 5000 * restartAttempts); // Exponential backoff
    } else {
      console.error("Max restart attempts reached. Stopping restart loop.");
    }
  }
};

// Capturar errores globales para evitar que Docker lo cierre
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Only restart for non-network related errors
  if (!err.code || (err.code !== 'ECONNRESET' && err.code !== 'ENOTFOUND')) {
    restartBot();
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  // Only restart for non-rate-limit related errors
  if (!reason.response || reason.response.error_code !== 429) {
    restartBot();
  }
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