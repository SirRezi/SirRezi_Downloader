# Discord License Generation and Download System

This project implements a license generation and download system for a Discord bot, allowing users to obtain and manage product licenses securely. Admins can generate unique license keys, and users can redeem them to receive download links via direct messages.

## Features

- **License Generation**: Admins can create unique license keys for products.
- **License Redemption**: Users can redeem their license keys to receive download links.
- **Direct Messages**: Download links are sent directly to users via DM.
- **Logging**: Key usage is logged in a specified channel.

## Setup

### Prerequisites

- Node.js v16 or later
- A Discord bot with necessary permissions

### Configuration
**Install Dependencies:**

`npm install`

**Edit Configuration: Open the config/config.json file and update the following fields:**

**`logChannelId:`** The channel ID where log messages will be sent.

**`adminRoleId:`** The role ID for admins who can generate licenses.

**`token:`** Your Discord bot token.

**`Products:`** In the data/products.json file, you can add your products. Each product should have a unique id, name, and downloadLink.

**Commands**

`/generate_key` - Generate a new license key for a specified product (admin only).

`/download` - Redeem your license key to receive a download link via DM.

**Usage**
- Start the bot:

`node index.js`

