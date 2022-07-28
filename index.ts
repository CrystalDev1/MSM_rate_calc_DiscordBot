import { EmbedBuilder } from '@discordjs/builders'
import DiscordJS, { IntentsBitField } from 'discord.js'
import dotenv from 'dotenv'
const humanize = require('humanize-duration')
const comma = require('add-commas')
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})

client.on('ready', () => {
    console.log('\n\n\n------------\nReady to Calculate\n------------\n\n\n')
})



client.on('messageCreate', async (m) => {
    let valid = false 

    let args: string[] = m.content.trim().split(/\s+/)
    let prefix = args[0]
    if (prefix.toLowerCase() == "!rate") {
        args.splice(0, 1)

        if (args.length != 2) {
            m.reply('Must provide 2 args <rate> <max>')
            valid = false
        } else {
            valid = true
        }

        if (!valid) return;
        let rate: number = 0;
        let max: number = 0;

        if (isNaN(parseInt(args[0])) || isNaN(parseInt(args[1]))) {
            m.reply(`Arguments must be non-decimal numbers`)
            valid = false
        } else {
            rate = parseInt(args[0])
            max = parseInt(args[1])
            valid = true
        }


        if (!valid) return;
        const full = (max / rate) * 60000;
        const hundred_k = (100000 / rate) * 60000;
        const hour1 = 12;

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Gold Rate Information')
            .setDescription(`${rate} gold/min --- ${max} max`)
            .addFields(
                {
                    name: '-----------------------------------',
                    value: '** **',
                    inline: false
                },
                {
                    name: 'Time till full',
                    value: humanize(full, {round: true}),
                    inline: true
                },
                {
                    name: 'Time till 100k',
                    value: humanize(hundred_k, {round: true}) + `\n (Collect at least ${Math.ceil(hundred_k / full)} time(s))`,
                    inline: true
                },
                {
                    name: 'Gold after 1 hour',
                    value: `${comma(rate * 60)}`,
                    inline: true
                },
            );

        
        m.reply({
            embeds: [embed]
        })
        
    } else if (prefix.toLowerCase() == '!help') {
        if (args.length != 2) {
            m.reply('Missing arg: <commandName>')
            return
        }
        args.splice(0, 1)
        if (args[0].toLowerCase() == 'rate') {
            m.reply(`Takes in 2 arguments: <rate> <max>\nWhere **rate** is the amount of gold the monster produces per minute\nand **max** is the maximum amount of gold the monster can hold.\nThis command return information calculated using these parameters.`)
        } else {
            m.reply(`Command \`${args[0]}\` does not exist`)
        }

    }

})

client.login(process.env.TOKEN)