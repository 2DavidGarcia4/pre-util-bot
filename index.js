const Discord = require("discord.js");
const intents = new Discord.Intents();
const client = new Discord.Client({intents: 32767, ws:{properties:{$browser: "Discord Android"}}});

client.on("ready",async () => {
    console.log(client.user.username, "Hola, estoy listo")
 
    // client.user.setPresence({
    //     status: "idle"
    // })
})



client.on("messageCreate", async msg =>{
    if(msg.author.bot) return;
    
    const canales = ["887130134308593694","892485197390565406","892209298732625931","891866153792700436","892815046999175189","893245800627453952"]

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