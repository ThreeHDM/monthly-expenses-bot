# Monthly Expenses Recording Discord Bot

I created this expenses recording BOT to record my personal monthly expenses so that I have more control over the money I and my family spend.

**Note:** This bot was migrated from Telegram to Discord for better reliability on self-hosted setups.

## How does it work

The BOT has a series of commands which represent different stores/monthly-expenses.

When you type a command like `/ver 100,50` in your Discord server, the bot:
1. Logs the expense to your Google Spreadsheet with the date and category
2. Retrieves the current month's total from the spreadsheet
3. Replies with confirmation and the updated monthly total

### Available Commands

- `/ver <amount>` - Verdulería (grocery store)
- `/car <amount>` - Carnicería (butcher shop)
- `/super <amount>` - Supermercado (supermarket)
- `/far <amount>` - Farmacia (pharmacy)
- `/ropa <amount>` - Ropa (clothing)
- `/otro <amount>` - Otros (other)
- `/auto <amount>` - Gastos auto (car expenses)
- `/sal <amount>` - Salidas (outings)
- `/viat <amount>` - Viáticos (allowances)
- `/mant <amount>` - Mantenimiento (maintenance)

**Examples:**
```
/ver 100,50
/super 250 compra semanal
/car 180,75 asado
```

## Configuration for personal use

### 1 - Create a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "Economy Bot")
3. Go to the "Bot" section in the left sidebar
4. Click "Add Bot" and confirm
5. Under the bot's username, click "Reset Token" and copy the token
6. Enable **Privileged Gateway Intents**:
   - **Message Content Intent** (required to read message content)
7. Save changes
8. Go to "OAuth2" → "URL Generator"
9. Select scopes: `bot`
10. Select bot permissions: Send Messages, Read Messages/View Channels, Read Message History
11. Copy the generated URL, paste it in your browser, and invite the bot to your private Discord server

### 2 - Create Google Sheet API credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Go to "Credentials" → "Create Credentials" → "Service Account"
5. Fill in the service account details and create
6. Click on the created service account → "Keys" → "Add Key" → "Create new key"
7. Choose JSON format and download
8. Rename the downloaded file to `keys.json` and place it in the project root
9. Copy the service account email from the JSON file

### 3 - Copy this google sheet

1. Create a new Google Spreadsheet or use an existing one
2. Share the spreadsheet with the service account email (from step 2)
3. Give it "Editor" permissions
4. Copy the spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
5. Your spreadsheet should have two sheets:
   - **registro**: Where expenses are logged (columns: Date, Category, Amount, Comment)
   - **gastosMensuales**: Where monthly totals are calculated

### 4 - Customize it

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   DISCORD_BOT_TOKEN=your_discord_bot_token_here
   SPREADSHEET_ID=your_spreadsheet_id_here
   ```

3. Make sure `keys.json` is in the project root

4. (Optional) Customize the expense categories by editing the `commands` array in `bot.js` and the `stores` object in `processExpense.js`

### 5 - How to run it

#### Option A: Direct Node.js (for testing)

```bash
# Install dependencies
npm install

# Start the bot
npm start

# Development mode with auto-reload
npm run dev
```

#### Option B: Docker (recommended for production/Raspberry Pi)

```bash
# Build and start the bot
docker-compose up -d

# View logs
docker-compose logs -f discord-bot

# Stop the bot
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

The Docker setup includes automatic restart on failures, making it perfect for running 24/7 on a Raspberry Pi or home server.

## Why Discord instead of Telegram?

Discord offers:
- More reliable connections for self-hosted bots
- Better stability on home networks
- No rate limiting issues common with Telegram
- Same familiar slash command interface