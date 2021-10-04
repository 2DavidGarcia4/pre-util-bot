const Discord = require("discord.js");
const intents = new Discord.Intents();
const client = new Discord.Client({intents: 32767, ws:{properties:{$browser: "Discord Android"}}});

const config = require("./config.json")
const token = config.tokenSSBot

const creadorID = "717420870267830382"

client.on("ready",async () => {
    console.log(client.user.username, "Hola, estoy listo")
 
    // client.user.setPresence({
    //     status: "idle"
    // })
})



client.on("messageCreate", async msg =>{
    if(msg.author.bot) return;
    
    const canales = ["887130134308593694","892485197390565406","892209298732625931","891866153792700436","892815046999175189","893245800627453952","893656997872926750"]

    if(canales.some(ch => ch === msg.channel.id)){
        const embed = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        // .setTitle()
        .setDescription(`💬 **Mensaje:** ${msg.content}`)
        .setColor("RANDOM")
        .setFooter(`Desde: ${msg.guild.name} • Miembros: ${msg.guild.memberCount}`,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()

        for(let i=0; i<canales.length; i++){
            client.channels.cache.get(canales[i]).send({embeds: [embed]})
        }
    msg.delete()
    }
})

client.on("messageCreate", async msg => {
    if(msg.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
        const emb = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`Hola, soy **${client.user.username}** un Bot enfocado en la promoción aun que tambien puedo hacer otras cosas`)
        .setDescription(`**Mi prefijo:** ${"``"}ss.${"``"}\n**Invitame:** [*Clic aquí*](https://discord.com/oauth2/authorize?client_id=841531159778426910&scope=bot%20applications.commands&permissions=2147483647)\n**Usa el comando** ${"``"}ss.help${"``"} para conocer mas de mi`)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.reply({embeds: [emb]})
    }    
})


client.on("messageCreate", async msg => {
    const prefijo = "ss."

    if(msg.author.bot) return; 
    if(!msg.content.startsWith(prefijo)) return; 

    const args = msg.content.slice(prefijo.length).trim().split(/ +/g);
    const comando = args.shift()


    if(comando === "servers"){
        const servers = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL())
        .setTitle("Información de los servidores en los que estoy.")
        .setDescription(`**Servidores:** ${client.guilds.cache.size}\n${client.guilds.cache.map(n => n.name + " **|** " + `**${n.memberCount}** Miembros\n**ID:** ${n.id}`).join(`\n\n`)}`)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.reply({embeds: [servers]})
    }

    if(comando === "help"){
        const help = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL())
        .setTitle("Ayuda")
        .setDescription(`Por ahora no hay omandos ni interaciones.`)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.channel.send({embeds: [help]})
    }

})










client.login(token);