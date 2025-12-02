# Discord Bot Setup Guide

## Step 1: Create a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "Economy Bot")
3. Go to the "Bot" section in the left sidebar
4. Click "Add Bot" and confirm
5. Under the bot's username, click "Reset Token" and copy the token (you'll need this later)
6. Enable these **Privileged Gateway Intents**:
   - Message Content Intent (required to read message content)
7. Save changes

## Step 2: Invite Bot to Your Server

1. Go to the "OAuth2" section, then "URL Generator"
2. Select these scopes:
   - `bot`
3. Select these bot permissions:
   - Send Messages
   - Read Messages/View Channels
   - Read Message History
4. Copy the generated URL at the bottom
5. Paste it in your browser and select your private server
6. Click "Authorize"

## Step 3: Configure Environment Variables

1. Open your `.env` file (or copy from `.env.example`)
2. Add the Discord bot token:

```env
DISCORD_BOT_TOKEN=your_bot_token_here
SPREADSHEET_ID=your_existing_spreadsheet_id
```

Keep your existing Google credentials (keys.json) in the project root.

## Step 4: Run the Discord Bot

### Option A: Direct Node.js (for testing)

To start the Discord bot:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### Option B: Docker (recommended for production)

Build and run with Docker Compose:

```bash
docker-compose up -d
```

View logs:

```bash
docker-compose logs -f discord-bot
```

Stop the bot:

```bash
docker-compose down
```

Rebuild after code changes:

```bash
docker-compose up -d --build
```

## Step 5: Usage

In your Discord server, use the same commands as before:

- `/ver 100,50` - Log expense to verduleria
- `/car 200` - Log expense to carniceria
- `/super 150,75 compra semanal` - Log expense with comment
- And all other commands: `/far`, `/ropa`, `/otro`, `/auto`, `/sal`, `/viat`, `/mant`

The bot will respond with confirmation and the monthly total.

## Notes

- This bot now runs exclusively on Discord (Telegram code has been removed)
- Uses the same Google Sheets backend as before
- Docker setup includes automatic restart on failure
- Discord is more reliable than Telegram for self-hosted bots on home networks
