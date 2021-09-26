const Discord = require("discord.js");
const intents = new Discord.Intents();
const client = new Discord.Client({intents: 32767});

client.on("ready", () => {
    console.log("Hola, estoy listo")

    client.user.setPresence({
        status: "idle"
    })
})

client.on("messageCreate", async msg => {
    if(msg.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setLabel("hola")
            .setStyle("DANGER")
            .setCustomId("a"),

            new Discord.MessageButton()
            .setLabel("hola")
            .setStyle("DANGER")
            .setCustomId("a")
        )
        const embP = new Discord.MessageEmbed()
        .setDescription("Hola")
        .setColor("#ff0000")

        const emb1 = new Discord.MessageEmbed()
        .setDescription("Hola")
        .setColor("#00ff00")

        const pop = await msg.channel.send({embeds: [embP], components: [row]})

        client.on("interactionCreate", async btn => {
            if(btn.setCustomId === "a"){
                btn.deferUpdate()
                btn.msg.edit
            }
        })
    }
})

client.on("messageCreate", async msg => {
    const prefijo = "ss."

    if(msg.author.bot) return; 
    if(!msg.content.startsWith(prefijo)) return; 

    const args = msg.content.slice(prefijo.length).trim().split(/ +/g);
    const comando = args.shift()



    if(comando === "servers"){
        const emb = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("Servidores en los que estoy")
        .setDescription(`Servidores: ${client.guilds.cache.size}\nNombres: ${client.guilds.cache.map(n => n.name)}\nMiembros totales: ${client.users.cache.size}`)
        .setColor("RANDOM")
        .setTimestamp()
        msg.channel.send({ embeds: [emb] })
    }
})



// Token del bot SS Bot
client.login("ODQxNTMxMTU5Nzc4NDI2OTEw.YJoG9w.Mmp4gKEQJ5Ody-VQIA6aRLd17hA");
// Token del bot de pruebas
// client.login('ODU5NTU1NTgwNTU3NTI1MDUz.YNuZhA.joZ-KJLXMAEhZ76VbZhHJwBDtq4');
// Toketn de SVSPBot
// client.login('ODQzMTg1OTI5MDAyMDI1MDMw.YKAMFw.nqKx6MthbM0kfav2XFlep7QmB2M');
// Token de PromoBot
// client.login("ODQ0MjQ4NDg3MDI1MzExODA2.YKPprA.OqOGp7T-57QU_gpzhlZPc8yr01E");

// Token de un bot de un YouTuber
// client.login("ODM5NjQ4MzEwNDI3Mzg1ODU2.YJMtbQ.MnHBL6mAcn6dHp2gfSPeJ-gfiJQ");