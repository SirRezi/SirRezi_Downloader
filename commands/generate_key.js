const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

const config = require('../config/config.json');

const loadProducts = () => {
    const productsPath = path.join(__dirname, '../data/products.json');
    if (!fs.existsSync(productsPath)) {
        console.error('Products file does not exist.');
        return [];
    }
    const productsData = fs.readFileSync(productsPath);
    return JSON.parse(productsData);
};

const generateLicenseKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 16; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
};

const ensureLicensesFileExists = () => {
    const licensesPath = path.join(__dirname, '../data/licenses.json');
    if (!fs.existsSync(licensesPath)) {
        fs.writeFileSync(licensesPath, JSON.stringify([], null, 2));
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate_key')
        .setDescription('Generate a new license key for a product')
        .addStringOption(option => {
            const products = loadProducts();
            const choices = products.map(product => ({
                name: product.name,
                value: product.id
            }));
            return option
                .setName('product')
                .setDescription('Select the product to generate a key for')
                .setRequired(true)
                .addChoices(choices);
        }),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.adminRoleId)) {
            return interaction.reply('You do not have permission to execute this command.');
        }

        const productId = interaction.options.getString('product');
        const licenseKey = generateLicenseKey();

        ensureLicensesFileExists();

        const licensesPath = path.join(__dirname, '../data/licenses.json');
        const licensesData = JSON.parse(fs.readFileSync(licensesPath));
        
        licensesData.push({
            key: licenseKey,
            productId: productId,
            userId: interaction.user.id
        });
        fs.writeFileSync(licensesPath, JSON.stringify(licensesData, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('New License Key Generated')
            .addFields(
                { name: 'Product ID', value: productId, inline: true },
                { name: 'License Key', value: `||${licenseKey}||`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Generated by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        try {
            await interaction.user.send({ embeds: [embed] });
            await interaction.reply('License key generated successfully! Check your DMs for the key.');
        } catch (error) {
            console.error('Error sending DM:', error);
            await interaction.reply('I was unable to send you a DM. Please check your DM settings.');
        }
    }
};

// © 2024 SirRezi
