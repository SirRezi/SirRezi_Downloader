module.exports = async (interaction) => {
    if (!interaction.isCommand()) return;
  
    if (!interaction.guild) {
      return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    }
  
    const command = require(`../commands/${interaction.commandName}`);
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
  };
  