const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const processExpense = require("./processExpense.js");

const commands = ["ver", "car", "super", "far", "ropa", "otro", "auto", "sal", "viat", "mant"];

const commandDescriptions = {
  ver: "Verdulería (grocery store)",
  car: "Carnicería (butcher shop)",
  super: "Supermercado (supermarket)",
  far: "Farmacia (pharmacy)",
  ropa: "Ropa (clothing)",
  otro: "Otros (other)",
  auto: "Gastos auto (car expenses)",
  sal: "Salidas (outings)",
  viat: "Viáticos (allowances)",
  mant: "Mantenimiento (maintenance)"
};

// Register slash commands
async function registerSlashCommands() {
  const slashCommands = commands.map(cmd =>
    new SlashCommandBuilder()
      .setName(cmd)
      .setDescription(commandDescriptions[cmd])
      .addStringOption(option =>
        option.setName('monto')
          .setDescription('Monto del gasto (usa coma para decimales, ej: 100,50)')
          .setRequired(true))
      .addStringOption(option =>
        option.setName('comentario')
          .setDescription('Comentario opcional')
          .setRequired(false))
      .toJSON()
  );

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

  try {
    console.log('Registrando comandos slash...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: slashCommands }
    );
    console.log('Comandos slash registrados exitosamente!');
  } catch (error) {
    console.error('Error registrando comandos slash:', error);
  }
}

client.on("ready", async () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  await registerSlashCommands();
});

// Handle slash command interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Restrict to specific channel if ALLOWED_CHANNEL_ID is set and not empty
  const allowedChannelId = process.env.ALLOWED_CHANNEL_ID?.trim();
  if (allowedChannelId && interaction.channel.id !== allowedChannelId) {
    return;
  }

  const commandName = interaction.commandName;

  // Check if it's one of our expense commands
  if (commands.includes(commandName)) {
    try {
      const amount = interaction.options.getString('monto');
      const comment = interaction.options.getString('comentario') || '';

      // Create a fake message object compatible with processExpense
      const fakeMessage = {
        content: `/${commandName} ${amount} ${comment}`.trim(),
        reply: async (content) => {
          await interaction.reply(content);
        },
        channel: interaction.channel,
        author: interaction.user
      };

      await processExpense(fakeMessage);
    } catch (error) {
      console.error("Error processing slash command:", error);
      await interaction.reply("Ocurrió un error al procesar el comando. Por favor, intenta nuevamente.");
    }
  }
});

// Handle text-based commands (backward compatibility)
client.on("messageCreate", async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Restrict to specific channel if ALLOWED_CHANNEL_ID is set and not empty
  const allowedChannelId = process.env.ALLOWED_CHANNEL_ID?.trim();
  if (allowedChannelId && message.channel.id !== allowedChannelId) {
    return;
  }

  // Check if message starts with a command
  const commandMatch = message.content.match(/^\/(\w+)/);
  if (!commandMatch) return;

  const command = commandMatch[1];

  // Check if it's one of our expense commands
  if (commands.includes(command)) {
    try {
      await processExpense(message);
    } catch (error) {
      console.error("Error processing command:", error);
      message.reply("Ocurrió un error al procesar el comando. Por favor, intenta nuevamente.");
    }
  }
});

// Error handling
client.on("error", (error) => {
  console.error("Error en el bot de Discord:", error);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Deteniendo el bot...");
  await client.destroy();
  process.exit();
});

process.on("SIGTERM", async () => {
  console.log("Deteniendo el bot...");
  await client.destroy();
  process.exit();
});

// Uncaught exception handling
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

// Login with bot token
client.login(process.env.DISCORD_BOT_TOKEN).catch((err) => {
  console.error("Error al iniciar sesión en Discord:", err);
  process.exit(1);
});
