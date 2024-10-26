const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config/config.json'); 
const config = JSON.parse(fs.readFileSync(configPath));

const loadProducts = () => {
    const productsPath = path.join(__dirname, '../data/products.json');
    if (!fs.existsSync(productsPath)) {
        console.error('Products file does not exist.');
        return [];
    }
    const productsData = fs.readFileSync(productsPath);
    return JSON.parse(productsData);
};

const ensureLicensesFileExists = () => {
    const licensesPath = path.join(__dirname, '../data/licenses.json');
    if (!fs.existsSync(licensesPath)) {
        fs.writeFileSync(licensesPath, JSON.stringify([], null, 2));
    }
};

const getDownloadLink = (productId) => {
    const products = loadProducts();
    const product = products.find(p => p.id === productId);
    return product ? product.downloadLink : null;
};

const removeKey = (key, userId) => {
    const licensesPath = path.join(__dirname, '../data/licenses.json');
    const licensesData = JSON.parse(fs.readFileSync(licensesPath));
    
    const updatedLicenses = licensesData.filter(entry => !(entry.key === key && entry.userId === userId));
    
    fs.writeFileSync(licensesPath, JSON.stringify(updatedLicenses, null, 2));
};

const logKeyUsage = async (key, userId, client) => {
    const logChannelId = config.logChannelId;
    const logChannel = await client.channels.fetch(logChannelId);

    if (logChannel) {
        logChannel.send(`License key **${key}** was used by <@${userId}>`);
    } else {
        console.error('Log channel not found');
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('download')
        .setDescription('Download your product')
        .addStringOption(option => 
            option
                .setName('key')
                .setDescription('Enter your license key')
                .setRequired(true)),
    async execute(interaction) {
        const key = interaction.options.getString('key');
        ensureLicensesFileExists();

        const licensesPath = path.join(__dirname, '../data/licenses.json');
        const licensesData = JSON.parse(fs.readFileSync(licensesPath));

        const licenseEntry = licensesData.find(entry => entry.key === key && entry.userId === interaction.user.id);

        if (!licenseEntry) {
            return interaction.reply('Invalid or unused license key.');
        }

        const downloadLink = getDownloadLink(licenseEntry.productId);

        if (!downloadLink) {
            return interaction.reply('Download link not found for this product.');
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Your Download Link')
            .setDescription(`Here is your download link: [Download](${downloadLink})`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        try {
            await interaction.user.send({ embeds: [embed] });
            await interaction.reply('I have sent you the download link via DM.');
            await logKeyUsage(key, interaction.user.id, interaction.client);
            removeKey(key, interaction.user.id);
        } catch (error) {
            console.error('Error sending DM:', error);
            if (!interaction.replied) {
                await interaction.reply('I was unable to send you a DM. Please check your DM settings.');
            }
        }
    }
};
