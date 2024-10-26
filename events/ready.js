const { REST, Routes } = require('discord.js');

module.exports = async (client, commands, config) => {
  console.log(`Logged in as ${client.user.tag}`);
  const rest = new REST({ version: '9' }).setToken(config.token);
  
  try {
    console.log('Starting command registration...');
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('Commands registered successfully.');
  } catch (error) {
    console.error(error);
  }
};
