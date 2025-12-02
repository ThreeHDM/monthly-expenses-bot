# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-12-02

### Migration: Telegram → Discord

#### Added
- Discord.js integration replacing Telegraf
- Official Discord slash commands with autocomplete
- Channel restriction feature via `ALLOWED_CHANNEL_ID` environment variable
- Support for both slash commands and text-based commands (backward compatibility)
- Interactive command parameters (monto, comentario) with descriptions
- Comprehensive setup documentation in [DISCORD_SETUP.md](DISCORD_SETUP.md)
- Environment variable template (`.env.example`)
- Docker support with auto-restart configuration

#### Changed
- **BREAKING**: Migrated from Telegram API to Discord API
- Bot now uses Discord's official slash command system
- Updated all documentation to reflect Discord setup
- Simplified error handling (removed Telegram-specific retry logic)
- Container name changed to `discord-economy-bot`
- Updated [README.md](README.md) with Discord-specific instructions

#### Removed
- Telegraf package and all Telegram-specific code
- Telegram bot restart/retry logic for rate limiting
- Complex connection recovery mechanisms (no longer needed with Discord)

#### Fixed
- Bot stability issues common with self-hosted Telegram bots
- Multiple bot instances responding to same command
- Empty `ALLOWED_CHANNEL_ID` being treated as a filter

### Technical Details

**Dependencies:**
- Added: `discord.js@^14.25.1`
- Removed: `telegraf@^4.8.1`

**Commands:**
All 10 expense tracking commands migrated:
- `/ver` - Verdulería (grocery store)
- `/car` - Carnicería (butcher shop)
- `/super` - Supermercado (supermarket)
- `/far` - Farmacia (pharmacy)
- `/ropa` - Ropa (clothing)
- `/otro` - Otros (other)
- `/auto` - Gastos auto (car expenses)
- `/sal` - Salidas (outings)
- `/viat` - Viáticos (allowances)
- `/mant` - Mantenimiento (maintenance)

**Environment Variables:**
- `BOT_TOKEN` → `DISCORD_BOT_TOKEN`
- `SPREADSHEET_ID` (unchanged)
- `ALLOWED_CHANNEL_ID` (new, optional)

### Why Discord?

Discord provides:
- More reliable connections for self-hosted bots
- Better stability on home networks
- No rate limiting issues
- Built-in slash command system with autocomplete
- Same familiar command interface

### Upgrade Guide

1. Create a Discord bot at https://discord.com/developers/applications
2. Enable "Message Content Intent" in bot settings
3. Invite bot to your server with appropriate permissions
4. Update `.env`:
   - Change `BOT_TOKEN` to `DISCORD_BOT_TOKEN`
   - Add Discord bot token
5. Restart: `npm start` or `docker-compose up -d --build`

---

## [1.0.0] - Previous

### Initial Release (Telegram)
- Telegram bot for expense tracking
- Integration with Google Sheets
- 10 expense categories
- Monthly total calculations
- Docker support
