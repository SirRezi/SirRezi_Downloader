const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config/config.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
const commands = commandFiles.map(file => require(`./commands/${file}`).data.toJSON());

client.once('ready', () => require('./events/ready')(client, commands, config));
client.on('interactionCreate', (interaction) => require('./events/interactionCreate')(interaction));

client.login(config.token);
