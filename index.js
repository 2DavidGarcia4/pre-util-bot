const Discord = require("discord.js");
const intents = new Discord.Intents();
const client = new Discord.Client({intents: 32767, ws:{properties:{$browser: "Discord Android"}}});

const config = require("./config.json")
const token = config.tokenSSBot

const creadorID = "717420870267830382"
const colorEmb = "#060606"
const colorEmbInfo = "#ffffff"
const ColorError = "#ff0000"

client.on("ready",async () => {
    console.log(client.user.username, "Hola, estoy listo")

    const estado = [
        {
            name: `${client.guilds.cache.size} servidores.`,
            type: "WATCHING"
        },
        {
            name: "ss.help",
            type: "LISTENING"
        },
        {
            name: `${client.users.cache.size} usuarios.`,
            type: "WATCHING"
        },
        {
            name: "6 canales de Inter promoción",
            type: "WATCHING"
        },
        {
            name: "ss.invite",
            type: "LISTENING"
        }
    ]

    const autoPresencia = () => {
        let aleatorio = Math.floor(Math.random()*estado.length)
        client.user.setPresence({
            activities: [estado[aleatorio]]
        })
    }
    autoPresencia()
    setInterval(()=>{
        autoPresencia()
    },30000)
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
        .setTitle(`Hola, soy **${client.user.username}** un Bot enfocado en la ayuda de tareas que se necesita interactuar con otros servidores`)
        .setDescription(`**Mi prefijo:** ${"``"}ss.${"``"}\n**Invitame:** [*Clic aquí*](https://discord.com/oauth2/authorize?client_id=841531159778426910&scope=bot%20applications.commands&permissions=2147483647)\n**Usa el comando** ${"``"}ss.help${"``"} para conocer mas de mi`)
        .setColor(colorEmb)
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


    if(comando === "er"){
        if(msg.author.id === creadorID){
            let s0 = 0;
            let s1 = 10;
            let pagina = 1;

            const servers = new Discord.MessageEmbed()
            .setAuthor(msg.author.username,msg.author.displayAvatarURL())
            .setTitle("Información de los servidores en los que estoy.")
            .setDescription(`**Servidores:** ${client.guilds.cache.size}\n\n${client.guilds.cache.map(m => m).map((r, i) => `**${i + 1}.** ${r.name} **| 👥 ${r.memberCount}**\n🆔 ${r.id}`).slice(s0, s1).join("\n\n")}`)
            .setColor(colorEmb)
            .setFooter(`Pagina - ${pagina}/${Math.round(client.guilds.cache.size / 10 + 1)}`)
            .setTimestamp()

            const embSv = await msg.channel.send({embeds: [servers]})

            if(client.guilds.cache.size >= 11){
                await embSv.react("⬅");
                await embSv.react("➡");
            }

            const colector = embSv.createReactionCollector(usu => usu.id === msg.author.id)

            colector.on("collect", async reacion => {
                if(reacion.emoji.name === "⬅"){
                    if(s1 <= 10) return await reacion.users.remove(msg.author.id)

                    s0 = s0 - 10
                    s1 = s1 - 10
                    pagina = pagina - 1

                    servers
                    .setDescription(`**Servidores:** ${client.guilds.cache.size}\n\n${client.guilds.cache.map(m => m).map((r, i) => `**${i + 1}.** ${r.name} **| 👥 ${r.memberCount}**\n🆔 ${r.id}`).slice(s0, s1).join("\n\n")}`)
                    .setFooter(`Pagina - ${pagina}/${Math.round(client.guilds.cache.size / 10 + 1)}`)
                    embSv.edit({embeds: [servers]})
                }

                if(reacion.emoji.name === "➡" && reacion.users.cache.get(msg.author.id)){
                    if(client.guilds.cache.size <= s1) return await reacion.users.remove(msg.author.id)

                    s0 = s0 + 10
                    s1 = s1 + 10
                    pagina = pagina + 1

                    servers
                    .setDescription(`**Servidores:** ${client.guilds.cache.size}\n\n${client.guilds.cache.map(m => m).map((r, i) => `**${i + 1}.** ${r.name} **| 👥 ${r.memberCount}**\n🆔 ${r.id}`).slice(s0, s1).join("\n\n")}`)
                    .setFooter(`Pagina - ${pagina}/${Math.round(client.guilds.cache.size / 10 + 1)}`)
                    embSv.edit({embeds: [servers]})
                }
                await reacion.users.remove(msg.author.id)
            })
            
        }
    }

    if(comando === "help"){
        const help = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL())
        .setTitle("Ayuda")
        .setDescription(`**Mi prefijo:** ${"``"}ss.${"``"}\n\n**Comandos principales:**\n${"``"}ss.comandos${"``"} **| Te muestra todos los comandos que puedes usar.**\n${"``"}ss.botInfo${"``"} **| Te muestra información del bot.**`)
        .setColor(colorEmb)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.channel.send({embeds: [help]})
    }
    // Informacion del bot
    if(comando === "botInfo"){
        const infBot = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`<:sslogo:895014367920287754> ${client.user.username}`)
        .setDescription(`Es un bot enfocado en facilitar tareas que requieren la interacción en otros servidores, como crear alianzas, promocionar contenido en servidores, también enfocado en la creación de un sistema de puntos que puede usar el dueño del servidor para determinar cuando un miembro de soporte se merece subir de rol.\n\n**Sistemas:**\n**Sistema de auto alianzas:** *en desarrollo...*\n**Sistema de Inter promoción:** *fase beta lo puede usar usando el comando ${"``"}ss.setInterP${"``"}*\n**Sistema de puntos y registro de acciones:** *en desarrollo...*`)      
        .setFooter(`Creador del bot ${client.users.cache.get(creadorID).tag}`,client.users.cache.get(creadorID).displayAvatarURL({dynamic: true}))
        .setColor(colorEmb)
        .setTimestamp()
        msg.channel.send({embeds: [infBot]})
    }

    if(comando === "comandos"){
        const comandos = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("📑 Comandos")
        .setDescription(`${"``"}ss.setInterP${"``"} **| Establece un canal de inter promoción en tu servidor,** para mas informacion de este comando usa el comando ${"``"}ss.interPInfo${"``"}\n${"``"}ss.botInfo${"``"} **| Te muestra información del bot.**\n${"``"}ss.invite${"``"} **| Te muestra la invitación del bot**`)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setColor(colorEmb)
        .setTimestamp()
        msg.channel.send({embeds: [comandos]})
    }
    
    if(comando === "setInterP"){
        if(!msg.member.permissions.has("ADMINISTRATOR")){
            const error = new Discord.MessageEmbed()
            .setDescription(`❌ __Solo un administrador del servidor puede ejecutar el comando.__`)
            .setColor(ColorError)
            .setTimestamp()
            msg.reply({embeds: [error]}).then(tt => setTimeout(()=> {
                msg.delete()
                tt.delete()
            },30000))
        }
        let canal = msg.mentions.channels.first()
        if(!args[0]){
            let caP = msg.channel
            const embInfo = new Discord.MessageEmbed()
            .setTitle("Comando setInterP")
            .setDescription(`**Uso:**\n${"``"}ss.setInterP <Mencion del canal>${"``"}\n\n**Ejemplo:**\nss.setInterP ${caP}`)
            .setColor(colorEmbInfo)
            .setTimestamp()
            msg.reply({embeds: [embInfo], mentions: false}) 
        }else{
            if(!canal){
                const error = new Discord.MessageEmbed()
                .setDescription(`❌ __Menciona el canal.__`)
                .setColor(ColorError)
                .setTimestamp()
                msg.reply({embeds: [error]}).then(tt => setTimeout(()=> {
                    msg.delete()
                    tt.delete()
                },30000))
            }
        }
        if(canal){
            const embMDCre = new Discord.MessageEmbed()
            .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail(msg.guild.iconURL({dynamic: true}))
            .setTitle("Nuevo canal agregado a Inter promoción")
            .setDescription(`**Servidor:** ${msg.guild.name}\n**ID:** ${msg.guild.id}\nMiembros: ${msg.guild.memberCount}\n\n**Canal añadido:** ${canal.name}\n**ID:** ${canal.id}`)
            .setColor("#00ff00")
            .setFooter(client.user.username,client.user.displayAvatarURL())
            .setTimestamp()
            client.users.cache.get(creadorID).send({embeds: [embMDCre]})
            

            const emb = new Discord.MessageEmbed()
            .setDescription(`✅ **Listo el canal se agregara al sistema de Inter promoción, gracias por usar nuestro Bot.**`)
            .setColor(colorEmb)
            .setFooter("Agregar el canal al sistema de Inter promoción puede tardar entre 10m a mas de 4h, por favor sea paciente.",client.user.displayAvatarURL())
            .setTimestamp()
            msg.channel.send({embeds: [emb]})
        }
    }
    if(comando === "interPInfo"){
        const embInf = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("¿Qué es el sistema de Inter promoción?")
        .setDescription(`Es un sistema que te facilita la tarea de promocionar contenido en otros servidores, con el solo tienes que promocionar el contenido en un canal el bot lo publicara en otros canales de otroas servidores.\n\n**Uso:**\nCrea un canal solo para esta función luego usar el comando ${"``"}ss.setInterP${"``"} para agregar el canal al sistema después seria empezar a publicar tu promoción en el, cada ves que publiques algo en ese canal te mandara tu publicación a todos los canales de los demás servidores que estén conectados al sistema de **Inter promoción**.`)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setColor(colorEmb)
        .setTimestamp()
        msg.channel.send({embeds: [embInf]})
    }

    if(comando === "invite"){
        const inv = new Discord.MessageEmbed()
        .setAuthor(`hola ${msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`[__**Invítame**__](https://discord.com/oauth2/authorize?client_id=841531159778426910&scope=bot%20applications.commands&permissions=2147483647) a tu servidor.`)
        .setColor(colorEmb)
        .setTimestamp()
        .setURL("https://discord.com/oauth2/authorize?client_id=841531159778426910&scope=bot%20applications.commands&permissions=2147483647")
        msg.channel.send({embeds: [inv]})
    }


    // if(comando === "menu"){
    //     const emb1 = new Discord.MessageEmbed()
    //     .setDescription("2")
    //     .setColor("GREYPLE")

    //     const emb2 = new Discord.MessageEmbed()
    //     .setDescription("3")
    //     .setColor("GREYPLE")

    //     const row = new Discord.MessageActionRow()
    //     .addComponents(
    //         new Discord.MessageSelectMenu()
    //         .setCustomId("menn")
    //         .setMaxValues(2)
    //         .addOptions([
    //             {
    //                 label: "Discord.js",
    //                 description: "Rol de discord.js",
    //                 value: "1"
    //             },
    //             {
    //                 label: "Discord.py",
    //                 description: "Rol de Discord.py",
    //                 value: "2"
    //             }
    //         ])
    //     )

    //     const embed = new Discord.MessageEmbed()
    //     .setDescription(`Use los botones del menu para elejir un rol.`)
    //     .setColor("GREY")

    //     const m = await msg.channel.send({embeds: [embed], components: [row]})

    //     const colector = m.createMessageComponentCollector({filter: i=> i.user.id === msg.author.id, time: 60000});

    //     colector.on("collect", async ii => {
    //         if(ii.values[0] === "1"){
    //             await ii.deferUpdate()
    //             ii.editReply({embeds: [emb1]})
    //         }
    //         if(ii.values[0] === "2"){
    //             await ii.deferUpdate()
    //             ii.editReply({embeds: [emb2]})
    //         }
    //     })
    // }
})










client.login(token);