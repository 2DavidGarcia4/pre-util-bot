const Discord = require("discord.js");
const intents = new Discord.Intents();
const client = new Discord.Client({intents: 32767, ws:{properties:{$browser: "Discord Android"}}});

const config = require("./config.json")
const token = config.tokenSSBot

const creadorID = "717420870267830382"
const creadoresID = ["717420870267830382","825186118050775052"]
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

    const canales = ["896575496421269544","892485197390565406","891866153792700436","892209298732625931","892815046999175189","893245800627453952","898324696154660915"]
    
    if(canales.some(ch => ch === msg.channel.id)){
        let invit = await msg.guild.invites.fetch()
        let url = invit.filter(fi => fi.inviter.id === client.user.id).map(mi => mi.url)
        const embed = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`<:61208:879518684039774239> [Unirse al servidor](${url})\n\n💬 **Mensaje:**\n${msg.content}`)
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
    if(msg.author.bot)return;
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



    if(comando === "help"){
        const help = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL())
        .setDescription(`**Mi prefijo:** ${"``"}ss.${"``"}\n\n**Comandos principales:**\n${"``"}ss.comandos${"``"} **| Te muestra todos los comandos.**\n${"``"}ss.botInfo${"``"} **| Te muestra información del bot.**`)
        .setColor(colorEmb)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.channel.send({embeds: [help]})
    }

    if(comando === "comandos" || comando == "commands"){
        const comandos = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("📑 Comandos")
        .addField("\u200B","\u200B")
        .setDescription(`Un comando es una palabra a la que el bot responde.`)
        .addField("🌎 Comandos generales",`Comandos que todos pueden usar.\n\n${"``"}ss.user${"``"} **|** Muestra información del usuario.\n${"``"}ss.stats${"``"} **|** Muestra estadisticas generales de todos los servidores.\n${"``"}ss.uptime${"``"} **|** Muestra el tiempo que llevo activo o encendido.\n${"``"}ss.avatar${"``"} **|** Muestra el avatar del usuario.\n${"``"}ss.server${"``"} **|** Muestra información del servidor.\n${"``"}ss.invite${"``"} **|** Te muestra la invitación del bot.\n${"``"}ss.qrcode${"``"} **|** Genera un código QR de un enlace.\n${"``"}ss.botInfo${"``"} **|** Te muestra información del bot.`)
        .addField("\u200B", "\u200B")
        .addField("👮 Comandos de moderacion",`Comandos que solo los moderadores pueden usar.\n\n${"``"}ss.warn${"``"} **|** Advierte a un usuario.\n${"``"}ss.kick${"``"} **|** Expulsa a un usuario dándole una razón.\n${"``"}ss.ban${"``"} **|** Prohíbe a un usuario entrar al servidor.\n${"``"}ss.unban${"``"} **|** Elimina la prohibición de un miembro al servidor.\n${"``"}ss.clear${"``"} **|** Elimina múltiples mensajes en un canal.\n${"``"}ss.dmsend${"``"} **|** Envía un mensaje directo por medio del bot a un miembro.\n${"``"}ss.banlist${"``"} **|** Te muestra una lista de los usuarios baneados en el servidor.`)
        .addField("\u200B", "\u200B")
        .addField("💎 Comandos de administración",`Comandos que solo los administradores pueden usar.\n\n${"``"}ss.setInterP${"``"} **|** Establece un canal de inter promoción en tu servidor, para mas informacion de este comando usa el comando ${"``"}ss.interPInfo${"``"}\n${"``"}ss.addRol${"``"} **|** Añade un rol a un miembro o mas en el servidor.\n${"``"}ss.removeRol${"``"} **|** Remueve un rol de un miembro o mas en el servidor.\n${"``"}ss.createCha${"``"} **|** Crea un canal.\n${"``"}ss.deleteCha${"``"} **|** Elimina un canal.`)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setColor(colorEmb)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [comandos]})
    }

    // Comandos generales
    if(comando === "user"){
        let estados = {
            "dnd": "<:nomolestar:904558124793475083> No molestar",
            "idle": "<:ausente:904557543228059650> Ausente",
            "undefined": "<:desconectado:904558485155495946> Desconectado",
            "offline": "<:desconectado:904558485155495946> Desconectado",
            "online": "<:online:904556872005222480> Conectado"
        }
        let mencion = msg.mentions.members.first()
        let miemID = args.join(" ")

        if(mencion){
            const embUser = new Discord.MessageEmbed()
            .setAuthor(`Información de ${mencion.user.username} pedida por ${msg.author.username}`)
            .setThumbnail(mencion.user.displayAvatarURL({dynamic: true, format: "png" || "gif"}))
            .setDescription(`${mencion}`)
            .addFields(
                {name: "🏷 Tag", value: `${mencion.user.tag}`},
                {name: "🆔 ID", value: `${mencion.user.id}`},
                {name: "📌 Apodo", value: `${mencion.nickname !== null ? `${mencion.nickname}`: "Ninguno"}`},
                {name: "📅 Creacion", value: `<t:${Math.round(mencion.user.createdAt / 1000)}:R>`},
                {name: "📥 Se unio", value: `<t:${Math.round(mencion.joinedAt / 1000)}:R>`},
                {name: "<:booster:904828668264730625> Booster", value: `${mencion.premiumSince ? "Usuario Booster": "No Booster"}`},
                {name: "🔍 Estado", value: `${estados[mencion.presence?.status]}`}
            )
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
        }else{
            if(miemID){
                let usuario = msg.guild.members.cache.get(miemID)

                const embErr1 = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`Esa ID no corresponde a la de ningún miembro de este servidor, introduce un ID de un miembro del servidor.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!usuario) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                    msg.delete()
                    dt.delete()
                },60000))

                const embUser = new Discord.MessageEmbed()
                .setAuthor(`Información de ${usuario.username} pedida por ${msg.author.username}`)
                .setThumbnail(usuario.user.displayAvatarURL({dynamic: true}))
                .setDescription(`${usuario}`)
                .addFields(
                    {name: "🏷 Tag", value: `${usuario.user.tag}`},
                    {name: "🆔 ID", value: `${usuario.id}`},
                    {name: "📌 Apodo", value: `${usuario.nickname !== null ? `${usuario.nickname}`: "Ninguno"}`},
                    {name: "📅 Creacion", value: `<t:${Math.round(usuario.user.createdAt / 1000)}:R>`},
                    {name: "📥 Se unio", value: `<t:${Math.round(usuario.joinedAt / 1000)}:R>`},
                    {name: "<:booster:904828668264730625> Booster", value: `${usuario.premiumSince ? "Usuario Booster": "No Booster"}`},
                    {name: "🔍 Estado", value: `${estados[usuario.presence?.status]}`}
                )
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
            }else{
                const embUser = new Discord.MessageEmbed()
                .setAuthor(`Información de ${msg.author.username} pedida por el`)
                .setThumbnail(msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`${msg.author}`)
                .addFields(
                    {name: "🏷 Tag", value: `${msg.author.tag}`},
                    {name: "🆔 ID", value: `${msg.author.id}`},
                    {name: "📌 Apodo", value: `${msg.member.nickname !== null ? `${msg.member.nickname}`: "Ninguno"}`},
                    {name: "📅 Creacion", value: `<t:${Math.round(msg.author.createdAt / 1000)}:R>`},
                    {name: "📥 Se unio", value: `<t:${Math.round(msg.member.joinedAt / 1000)}:R>`},
                    {name: "<:booster:904828668264730625> Booster", value: `${msg.member.premiumSince ? "Usuario Booster": "No Booster"}`},
                    {name: "🔍 Estado", value: `${estados[msg.member.presence?.status]}`}
                )
                .setColor(colorEmb)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
            }
        }
    }

    if(comando === "stats"){
        const embed = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("Estadisticas")
        .addFields(
            {name: "Servidores", value: `🧿 ${client.guilds.cache.size}`, inline: true},
            {name: "Miembros", value: `👥 ${client.users.cache.filter(fu => !fu.bot).size}\n🤖 ${client.users.cache.filter(fb => fb.bot).size}`, inline: true},
            {name: "Canales", value: `<:canaldetexto:904812801925738557> ${client.channels.cache.filter(fct => fct.type === "GUILD_TEXT").size}\n <:canaldevoz:904812835295596544> ${client.channels.cache.filter(fcv => fcv.type === "GUILD_VOICE").size}`, inline: true},
            {name: "Emojis", value: `😀 ${client.emojis.cache.size}`,inline: true},
            {name: "Ping", value: `🏓 ${client.ws.ping} ms`, inline: true},
            {name: "Discord.js", value: `👾 ${Discord.version}`, inline: true},
            {name: "Node", value: `<:node:904814964542410752> ${process.version}`, inline: true}
        )
        .setColor(colorEmb)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
    }

    if(comando === "uptime"){
        let dias = Math.floor(client.uptime / 86400000);
        let horas = Math.floor(client.uptime / 3600000) % 24;
        let minutos = Math.floor(client.uptime / 60000) % 60;
        let segundos = Math.floor(client.uptime / 1000)% 60;
        const embed = new Discord.MessageEmbed()
        .setTitle("⏱ Tiempo activo")
        .setDescription(`${"``"}Dias: ${dias}${"``"} **|** ${"``"}Horas: ${horas}${"``"} **|** ${"``"}Minutos: ${minutos}${"``"} **|** ${"``"}Segundos: ${segundos}${"``"} `)
        .setColor(colorEmb)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
    }
    
    if(comando === "avatar"){
        let mencion = msg.mentions.members.first()
        let userID = args.join(" ")

        if(mencion){
            const embAva = new Discord.MessageEmbed()
            .setAuthor(`Avatar de ${mencion.user.username} pedido por ${msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("Avatar")
            .setURL(mencion.user.displayAvatarURL({dynamic: true, format: "png", size: 2048}))
            .setImage(mencion.user.displayAvatarURL({dynamic: true, format: "png", size: 2048}))
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAva]})
        }else{
            if(userID){
                let usuario = await client.users.fetch(userID)
                const embAva = new Discord.MessageEmbed()
                .setAuthor(`Avatar de ${usuario.username} pedido por ${msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("Avatar")
                .setURL(usuario.displayAvatarURL({dynamic: true, format: "png", size: 2048}))
                .setImage(usuario.displayAvatarURL({dynamic: true, format: "png", size: 2048}))
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAva]})
            }else{
                const embAva = new Discord.MessageEmbed()
                .setAuthor(`Avatar de ${msg.author.username} pedoido por el`,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("Avatar")
                .setURL(msg.author.displayAvatarURL({dynamic: true, format: "png", size: 2048}))
                .setImage(msg.author.displayAvatarURL({dynamic: true, format: "png", size: 2048}))
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAva]})
            }
        }
    }

    if(comando === "server"){
        let verificacion ={
            "NONE": "Ninguno",
            "LOW": "Bajo",
            "MEDIUM": "Medio",
            "HIGH": "Alto",
            "VERY_HIGH": "Muy alto"
        }

        let mgmc = msg.guild.members.cache
        let enlinea = mgmc.filter(fm => fm.presence?.status === "online" ).size
        let ausente = mgmc.filter(fm => fm.presence?.status === "idle").size
        let nomolestar = mgmc.filter(fm => fm.presence?.status === "dnd").size
        let todos = msg.guild.memberCount
        let bots = msg.guild.members.cache.filter(fb => fb.user.bot).size
        
        const embServer = new Discord.MessageEmbed()
        .setThumbnail(msg.guild.iconURL({dynamic: true}))
        .setAuthor(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        .setTitle("Informacion del servidor")
        .addFields(
            {name: "📃 Descripcion", value: `${msg.guild.description !== null ? msg.guild.description: "Sin descripción"}`},
            {name: "🆔", value: `${msg.guild.id}`, inline: true},
            {name: "👑 Propiedad de", value: `<@${msg.guild.ownerId}>`, inline: true},
            {name: "Canales", value: `<:canaldetexto:904812801925738557> ${msg.guild.channels.cache.filter(fc => fc.type === "GUILD_TEXT").size} texto\n<:canaldevoz:904812835295596544> ${msg.guild.channels.cache.filter(fv => fv.type === "GUILD_VOICE").size} voz`, inline: true},
            {name: "Roles", value: `💈 ${msg.guild.roles.cache.size}`, inline: true},
            {name: "Boost", value: `<:booster:904828668264730625> ${msg.guild.premiumSubscriptionCount}`, inline: true},
            {name: `Miembros`, value: `👥 ${msg.guild.memberCount} todos **|** 🤖 ${bots} bots **|** <:online:904556872005222480> ${enlinea} en linea **|** <:ausente:904557543228059650> ${ausente} ausentes **|** <:nomolestar:904558124793475083> ${nomolestar} no molestar **|** <:desconectado:904558485155495946> ${todos - enlinea - ausente - nomolestar} desconectados`},
            {name: "Nivel de verificacion", value: `🔎 ${verificacion[msg.guild.verificationLevel]}`}
        )
        .setColor(colorEmb)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServer]})
    }
    
    if(comando === "invite"){
        const inv = new Discord.MessageEmbed()
        .setAuthor(`hola ${msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`[__**Invítame**__](https://discord.com/oauth2/authorize?client_id=841531159778426910&scope=bot%20applications.commands&permissions=2147483647) a tu servidor.`)
        .setColor(colorEmb)
        .setTimestamp()
        .setURL("https://discord.com/oauth2/authorize?client_id=841531159778426910&scope=bot%20applications.commands&permissions=2147483647")
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [inv]})
    }

    // Generador de codigo QR
    if(comando === "qrcode" || comando === "QR"){
        let url = args[0]
        let urQR = `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=600x600`

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando qrcode")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.qrcode <URL o link>${"``"}`},
            {name: "Ejemplo", value: `ss.qrcode ${(await msg.guild.invites.fetch()).map(mi => mi.url).slice(0,1)}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!url) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        const attachment = new Discord.MessageAttachment(urQR, `imagen.png`)

        const embQR = new Discord.MessageEmbed()
        .setAuthor(`Codigo QR creado por ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
        .setImage(`attachment://imagen.png`)
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()

        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embQR], files: [attachment]}).catch(()=> msg.reply("Ubo un error. quisas no introdujiste bien el enlace."))


    }

    if(comando === "botInfo" || comando === "botinfo"){
        const infBot = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`<:sslogo:895014367920287754> ${client.user.username}`)
        .setDescription(`Es un bot enfocado en facilitar tareas que requieren la interacción en otros servidores, como crear alianzas, promocionar contenido en servidores, también enfocado en la creación de un sistema de puntos que puede usar el dueño del servidor para determinar cuando un miembro de soporte se merece subir de rol.\n\n**Sistemas:**\n**Sistema de auto alianzas:** *en desarrollo...*\n**Sistema de Inter promoción:** *fase beta lo puede usar usando el comando ${"``"}ss.setInterP${"``"}*\n**Sistema de puntos y registro de acciones:** *en desarrollo...*`)      
        .setFooter(`Creador del bot ${client.users.cache.get(creadorID).tag}`,client.users.cache.get(creadorID).displayAvatarURL({dynamic: true}))
        .setColor(colorEmb)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [infBot]})
    }




    // Comandos de moderacion
    if(comando === "warn"){
        const embErr1 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: expulsar miembros o banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("KICK_MEMBERS" || "BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
            msg.delete()
            dt.delete()
        },60000))

        let mencion = msg.mentions.members.first()
        let usuarioID = args[0]

        let razonM = args.join(" ").slice(22)
        let razonID = args.join(" ").slice(18)

        if(!args[0]){
            const embInfo = new Discord.MessageEmbed()
            .setTitle("🔎 Comando warn")
            .addFields(
                {name: "Uso:", value: `${"``"}ss.warn <Mencion> <Razón>${"``"}\n${"``"}ss.warn <ID del usuario> <Razón>${"``"}`},
                {name: "Ejemplo:", value: `ss.warn ${msg.author} Mal uso de canales.\nss.warn ${msg.author.id} Uso de palabras in adecuadas.`}
            )
            .setColor(colorEmbInfo)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }

        if(mencion){
            const embErr1 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`El usuario mencionado es un bot, no puedo advertir a un bot.`)
            .setColor(ColorError)
            .setTimestamp()
            if(mencion.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                msg.delete()
                dt.delete()
            },60000))

            const embErr2 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`No has proporcionado una razón, proporciona una razón.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!razonM) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                msg.delete()
                dt.delete()
            },60000))

            const embMencion = new Discord.MessageEmbed()
            .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail(mencion.user.displayAvatarURL({dynamic: true}))
            .setTitle("⚠ Usuario advertido")
            .setDescription(`👤 ${mencion}\n${mencion.user.tag}\n${mencion.user.id}\n\n📝 **razón:** ${razonM}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
            .setColor("#E5DA00")
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})

            const embMDMencion = new Discord.MessageEmbed()
            .setAuthor(mencion.user.tag,mencion.user.displayAvatarURL({dynamic: true}))
            .setTitle("⚠ Has sido advertido")
            .setDescription(`📝 **Por la razón:**\n${razonM}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
            .setColor("#E5DA00")
            .setFooter(`En el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            mencion.send({embeds: [embMDMencion]})
        }else{
            if(usuarioID){
                let usuario = msg.guild.members.cache.get(usuarioID)

                const embErr1 = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`El usuario no se encuentra en el servidor, proporciona una ID de un usuario que este dentro del servidor.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!usuario) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                    msg.delete()
                    dt.delete()
                },60000))

                const embErr2 = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`Esa ID es de un bot, no puedes advertir a un bot.`)
                .setColor(ColorError)
                .setTimestamp()
                if(usuario.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete()
                    dt.delete()
                },60000))

                const embErr3 = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                    msg.delete()
                    dt.delete()
                },60000))

                const embID = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(usuario.user.displayAvatarURL({dynamic: true}))
                .setTitle("⚠ Usuario advertido")
                .setDescription(`👤 ${usuario}\n${usuario.user.tag}\n${usuario.user.id}\n\n📝 **razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("#E5DA00")
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embID]})

                const embMDID = new Discord.MessageEmbed()
                .setAuthor(usuario.user.tag,usuario.user.displayAvatarURL({dynamic: true}))
                .setTitle("⚠ Has sido advertido")
                .setDescription(`📝 **Por la razón:**\n${razonID}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:** ${msg.author.id}`)
                .setColor("#E5DA00")
                .setFooter(`En el servidor ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                usuario.send({embeds: [embMDID]})
            }
        }
    }

    if(comando === "kick"){
        const embErr1 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: expulsar miembros o banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("KICK_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
            msg.delete()
            dt.delete()
        },60000))

        const embErr2 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso para expulsar miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("KICK_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
            msg.delete()
            dt.delete()
        },60000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando kick")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.kick <Mencion> <Razón>${"``"}\n${"``"}ss.kick <ID del usuario> <Razón>${"``"}`},
            {name: "Ejemplo:", value: `ss.kick ${msg.author} Romper una regla.\nss.kick ${msg.author.id} Flood en canales.`}
        )
        .setColor(colorEmbInfo)
        .setFooter("La razón es opcional")
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]})
    

        let mencion = msg.mentions.members.first()
        let userID = args[0]

        let razonM = args.join(" ").slice(22)
        let razonID = args.join(" ").slice(18)

        if(mencion){
            const embErr1 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`No me puedo expulsar a mi mismo.`)
            .setColor(ColorError)
            .setTimestamp()
            if(mencion.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                msg.delete()
                dt.delete()
            },60000))

            const embErr2 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`¿Por que te quieres expulsar?, no puedo realizar esa acción.`)
            .setColor(ColorError)
            .setTimestamp()
            if(msg.author.id === mencion.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                msg.delete()
                dt.delete()
            },60000))

            const embErr3 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`No puedes expulsar a un miembro con igual o mayor rol que tu.`)
            .setColor(ColorError)
            .setTimestamp()
            if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                msg.delete()
                dt.delete()
            },60000))

            if(!razonM){
                razonM = "*no proporcionada*"
            }

            if(mencion.user.bot){
                const embedMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("<:salir12:879519859694776360> Usuario expulsado")
                .setDescription(`👤 ${mencion}\n${mencion.user.tag}\n${mencion.user.id}\n\n📝 **Razón:** ${razonM}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("#F78701")
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embedMencion]})
                mencion.kick()

            }else{
                const embedMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("<:salir12:879519859694776360> Usuario expulsado")
                .setDescription(`👤 ${mencion}\n${mencion.user.tag}\n${mencion.user.id}\n\n📝 **Razón:** ${razonM}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("#F78701")
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embedMencion]})

                const embMDMencion = new Discord.MessageEmbed()
                .setAuthor(mencion.user.tag,mencion.user.displayAvatarURL({dynamic: true}))
                .setTitle("<:salir12:879519859694776360> Has sido expulsado")
                .setDescription(`📝 **Por la razón:** ${razonM}\n\n👮 **Por el moderador:** ${msg.author}\n**ID:** ${msg.author.id}`)
                .setColor("#F78701")
                .setFooter(`Del el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                mencion.send({embeds: [embMDMencion]})
                mencion.kick()
            }
        }else{
            if(userID){
                let usuario = msg.guild.members.cache.get(userID)

                const embErr1 = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`El usuario no se encuentra en el servidor, proporciona una ID de un usuario que este dentro del servidor.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!usuario) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                    msg.delete()
                    dt.delete()
                },60000))

                const embErr2 = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`Esa ID es es tuya, no puedo realizar la acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(usuario.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete()
                    dt.delete()
                },60000))

                const embErr3 = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`No puedes expulsar a un miembro con igual o mayor rol que tu.`)
                .setColor(ColorError)
                .setTimestamp()
                if(msg.member.roles.highest.comparePositionTo(usuario.roles.highest)<= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                    msg.delete()
                    dt.delete()
                },60000))

                if(!razonID){
                    razonID = "*no proporcionada*"
                }

                if(usuario.user.bot){
                    const embMiemIDB = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(usuario.user.displayAvatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Usuario expulsado")
                    .setDescription(`👤 ${usuario}\n${usuario.user.tag}\n${usuario.user.id}\n\n📝 **Razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#F78701")
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMiemIDB]})
                    usuario.kick()

                }else{
                    const embMiemID = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(usuario.user.displayAvatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Usuario expulsado")
                    .setDescription(`👤 ${usuario}\n${usuario.user.tag}\n${usuario.user.id}\n\n📝 **Razón:** ${razonID !== null ? razonID: "Sin razón"}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#F78701")
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMiemID]})

                    const embMDID = new Discord.MessageEmbed()
                    .setAuthor(usuario.user.tag,usuario.user.displayAvatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Has sido expulsado")
                    .setDescription(`📝 **Por la razón:** ${razonID}\n\n👮 **Por el moderador:** ${msg.author}\n**ID:** ${msg.author.id}`)
                    .setColor("#F78701")
                    .setFooter(`Del el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    usuario.send({embeds: [embMDID]})
                    usuario.kick()
                }
            }
        }
    }

    if(comando === "ban"){
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso de Banear miembros")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=> {
            msg.delete()
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tienes el permiso requerido para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Banear miembros")
        .setTimestamp()
        if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=> {
            msg.delete()
            tm.delete()
        },60000))

        const embInfo = new Discord.MessageEmbed()
        .setAuthor("🔎 Comanod ban")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.ban <Mencion> <Razón>${"``"}\n${"``"}ss.ban <ID del usuario> <Razón>${"``"}`},
            {name: "Ejemplo:", value: `ss.ban ${msg.author} Publicar URLs maliciosas.\nss.ban ${msg.author.id} Romper múltiples reglas en el servidor.`}
        )
        .setColor(colorEmbInfo)
        .setFooter("La razón es obligatoria")
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]}).then(tm => setTimeout(()=> {
            msg.delete()
            tm.delete()
        },60000))

        let mencion = msg.mentions.members.first()
        let razonMe = args.join(" ").slice(22)

        let userID = args[0]
        let razonID = args.join(" ").slice(18)

        if(mencion){
            const embErrM1 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`¿Por que me quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
            .setColor(ColorError)
            .setTimestamp()
            if(mencion.user.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM1]}).then(tm => setTimeout(()=>{
                msg.delete()
                tm.delete()
            },60000))

            const embErrM2 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`¿Por que te quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
            .setColor(ColorError)
            .setTimestamp()
            if(mencion.user.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM2]}).then(tm => setTimeout(()=>{
                msg.delete()
                tm.delete()
            },60000))

            const embErrM3 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`No puedes banear a un usuario con el mismo rol o mayor que tu.`)
            .setColor(ColorError)
            .setTimestamp()
            if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM3]}).then(tm => setTimeout(()=>{
                msg.delete()
                tm.delete()
            },60000))

            const embErrM4 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`No has proporcionado una razón, proporciona una razón.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!razonMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM4]}).then(tm => setTimeout(()=>{
                msg.delete()
                tm.delete()
            },60000))


            if(mencion.user.bot){
                const embMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(mencion.user.displayAvatarURL({dynamic: true}))
                .setTitle("⛔ Usuario baneado")
                .setDescription(`👤 ${mencion}\n${mencion.user.tag}\n${mencion.user.id}\n\n📝 **Razón:** ${razonMe}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("#ff0000")
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})
                mencion.ban({reason: `Razón: ${razonMe} || Por: ${msg.author.tag}/ID: ${msg.author.id} || Fecha: ${msg.createdAt.toLocaleDateString()}`})

            }else{
                const embMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(mencion.user.displayAvatarURL({dynamic: true}))
                .setTitle("⛔ Usuario baneado")
                .setDescription(`👤 ${mencion}\n${mencion.user.tag}\n${mencion.user.id}\n\n📝 **Razón:** ${razonMe}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("#ff0000")
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})

                const embMeMD = new Discord.MessageEmbed()
                .setAuthor(mencion.user.tag,mencion.user.displayAvatarURL({dynamic: true}))
                .setTitle("⛔ Has sido baneado")
                .setDescription(`📝 **Por la razón:** ${razonMe}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:** ${msg.author.id}`)
                .setColor("#ff0000")
                .setFooter(`Del servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                mencion.send({embeds: [embMeMD]})
                mencion.ban({reason: `Razón: ${razonMe} || Por: ${msg.author.tag}/ID: ${msg.author.id} || Fecha: ${msg.createdAt.toLocaleDateString()}`})
            }
        }else{
            if(userID){
                let usuario = await client.users.fetch(userID)

                const embErrID1 = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`Esa ID es mia, ¿Por que me quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(usuario.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID1]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))

                const embErrID2 = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`Esa ID es tuya, ¿Por que te quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(usuario.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID2]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))


                let miemSV = msg.guild.members.cache.get(userID)
                if(miemSV){
                    const embErrID3 = new Discord.MessageEmbed()
                    .setTitle("❌ Error")
                    .setDescription(`Esa ID es de un miembro del servidor con igual o mayor rol que tu, no puedes banear a ese usuario.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(miemSV.roles.highest)<= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID3]}).then(tm => setTimeout(()=>{
                        msg.delete()
                        tm.delete()
                    },60000))

                    const embErrID4 = new Discord.MessageEmbed()
                    .setTitle("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID4]}).then(tm => setTimeout(()=>{
                        msg.delete()
                        tm.delete()
                    },60000))

                    if(usuario.bot){
                        const embID = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(usuario.displayAvatarURL({dynamic: true}))
                        .setTitle("⛔ Usuario baneado")
                        .setDescription(`👤 ${usuario}\n${usuario.tag}\n${usuario.id}\n\n📝 **Razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embID]})
                        msg.guild.members.ban(usuario.id, {reason: `Razón: ${razonID} || Por: ${msg.author.tag}/ID: ${msg.author.id} || Fecha: ${msg.createdAt.toLocaleDateString()}`})

                    }else{
                        const embID = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(usuario.displayAvatarURL({dynamic: true}))
                        .setTitle("⛔ Usuario baneado")
                        .setDescription(`👤 ${usuario}\n${usuario.tag}\n${usuario.id}\n\n📝 **Razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embID]})

                        const embIDMD = new Discord.MessageEmbed()
                        .setAuthor(usuario.tag,usuario.displayAvatarURL({dynamic: true}))
                        .setTitle("⛔ Has sido baneado")
                        .setDescription(`📝 **Por la razón:** ${razonMe}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:** ${msg.author.id}`)
                        .setColor("#ff0000")
                        .setFooter(`Del servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        usuario.send({embeds: [embIDMD]})
                        msg.guild.members.ban(usuario.id, {reason: `Razón: ${razonID} || Por: ${msg.author.tag}/ID: ${msg.author.id} || Fecha: ${msg.createdAt.toLocaleDateString()}`})
                    }

                }else{
                    const embID = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(usuario.displayAvatarURL({dynamic: true}))
                    .setTitle("⛔ Usuario baneado")
                    .setDescription(`👤 ${usuario}\n${usuario.tag}\n${usuario.id}\n\n📝 **Razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#ff0000")
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embID]})
                    msg.guild.members.ban(usuario.id, {reason: `Razón: ${razonID} || Por: ${msg.author.tag}/ID: ${msg.author.id} || Fecha: ${msg.createdAt.toLocaleDateString()}`})
                }
            }
        }
    }

    // unban
    if(comando === "unban"){
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso de Banear miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso de Banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErrP3 = new Discord.MessageEmbed()
        .setTitle("📄")
        .setDescription(`No se ha encontrado ningún miembro baneado en este servidor.`)
        .setColor(colorEmbInfo)
        .setTimestamp()
        if((await msg.guild.bans.fetch()).size === 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP3]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("Comando unban")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.unban <ID del usuario baneado>${"``"}`},
            {name: "Ejemplo:", value: `ss.unban ${(await msg.guild.bans.fetch()).map(mb => mb.user.id).slice(0,1)}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let usuario = await client.users.fetch(args[0])

        const embErrP4 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`Ese usuario no esta baneado en este servidor o no introdujiste bien su ID.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!(await msg.guild.bans.fetch()).find(fb => fb.user.id === args[0])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP4]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embUban = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(usuario.displayAvatarURL({dynamic: true}))
        .setTitle("✅ Usuario des baneado")
        .setDescription(`👤 ${usuario.tag}\n${usuario.id}\n\n👮 **Por el moderador:**\n${msg.author}\n${msg.author.id}`)
        .setColor("GREEN")
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUban]})
        msg.guild.members.unban(usuario.id)
    }

    // clear 
    if(comando === "clear" || comando === "cl"){
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar mensajes .")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_MESSAGES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar mensajes .")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_MESSAGES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        let algo = args[0]

        const embInfo = new Discord.MessageEmbed()
        .setTitle("Comando unban")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.clear <Cantidad>${"``"}`},
            {name: "Ejemplo:", value: `ss.clear ${Math.round(Math.random(1)*100)}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!algo) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        const embErr1 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`Has introducido un valor no numérico, introduce un valor numérico.`)
        .setColor(ColorError)
        .setTimestamp()
        if(isNaN(algo)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErr2 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`Introduce un valor mayor a 1`)
        .setColor(ColorError)
        .setTimestamp()
        if(algo <= 2) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErr3 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`Has introducido un valor mayor a 100, el máximo de mensajes que puedo eliminar es de 100, introduce un valor igual o menor a 100.`)
        .setColor(ColorError)
        .setTimestamp()
        if(algo >= 101) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embClear = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("🗑 Mensajes eliminados")
        .setDescription(`${msg.author} ha eliminado **${algo}** mensajes.`)
        .setColor(colorEmb)

        setTimeout(()=>{
            msg.delete()
            setTimeout(()=>{
                msg.channel.bulkDelete(algo)
                msg.channel.send({embeds: [embClear]}).then(tm => setTimeout(()=>{
                    tm.delete()
                },20000))
            },1000)
        },800)
    }

    // Banlist
    if(comando === "banlist" || comando === "blist"){
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Banear miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        let ss0 = 0
        let ss1 = 10
        let pagina = 1
        let gb = await msg.guild.bans.fetch()

        const embBanlist = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("🧾 Lista de baneos")
        .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m=>m).map((bm, i) => `**${i+1}. ${bm.user.tag}**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}\n[Avatar del usuario](${bm.user.displayAvatarURL({dynamic: true})})`).slice(ss0,ss1).join("\n\n")}`)
        .setColor()
        .setFooter(`Pagina - ${pagina}/${Math.round(gb.size / 10)}`)
        .setTimestamp()

        const sendEmb = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBanlist]})

        if(gb.size >= 11){
            await sendEmb.react("⬅");
            await sendEmb.react("➡");
        }

        const colector = sendEmb.createReactionCollector(rec => rec.id === msg.author.id)

        colector.on("collect", async reacion => {
            if(reacion.emoji.name === "⬅"){
                if(ss0 <= 8) return await reacion.users.remove(msg.author.id)

                ss0=ss0-10
                ss1=ss1-10
                pagina=pagina-1

                embBanlist
                .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m=>m).map((bm, i) => `**${i+1}. ${bm.user.tag}**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}\n[Avatar del usuario](${bm.user.displayAvatarURL({dynamic: true})})`).slice(ss0,ss1).join("\n\n")}`)
                .setFooter(`Pagina - ${pagina}/${Math.round(gb.size / 10)}`)
                sendEmb.edit({embeds: [embBanlist]})
            }
            if(reacion.emoji.name === "➡" && reacion.users.cache.get(msg.author.id)){
                if(gb.size <= ss1) return await reacion.users.remove(msg.author.id)

                ss0=ss0+10
                ss1=ss1+10
                pagina=pagina+1

                embBanlist
                .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m=>m).map((bm, i) => `**${i+1}. ${bm.user.tag}**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}\n[Avatar del usuario](${bm.user.displayAvatarURL({dynamic: true})})`).slice(ss0,ss1).join("\n\n")}`)
                .setFooter(`Pagina - ${pagina}/${Math.round(gb.size / 10)}`)
                sendEmb.edit({embeds: [embBanlist]})
            }
            await reacion.users.remove(msg.author.id)
        })
    }

    // dmsend
    if(comando === "dmsend" || comando === "dm"){
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero de uno de los siguientes permisos: Gestionar mensajes, Expulsar miembros o Banear miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_MESSAGES" || "KICK_MEMBERS" || "BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres de uno de estos permisos: Gestionar mensajes, Expulsar miembros o Banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_MESSAGES" || "KICK_MEMBERS" || "BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando dmsend")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.dmsend <Mencion del usuario> <Mensaje>${"``"}\n${"``"}ss.dmsend <ID sel usuario> <Mensaje>${"``"}`},
            {name: "Ejemplo:", value: `ss.dmsend ${msg.author} Mensaje a enviar.\nss.dmsend ${msg.author.id} Mensaje a enviar.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let mencionUs = msg.mentions.members.first()
        let usuarioID = msg.guild.members.cache.get(args[0])

        let mensajeMe = args.join(" ").slice(22)
        let mensajeID = args.join(" ").slice(18)

        if(mencionUs){
            const embErr1 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`El usuario mencionado no permite los mensaje directos.`)
            .setColor(ColorError)
            .setTimestamp()


            const embErr2 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`El miembro mencionado es un bot, no puedo enviar un mensaje directo a un bot.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!mensajeMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                msg.delete()
                tm.delete()
            },60000))

            const embErr3 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`No has proporcionado el mensaje a enviar, proporciona el mensaje que enviare el usuario.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!mensajeMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                msg.delete()
                tm.delete()
            },60000))

            const emdSendDM = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail(mencionUs.user.displayAvatarURL({dynamic: true}))
            .setTitle("📤 Mensaje enviado al usuario")
            .setDescription(`👤 ${mencionUs}\n**ID:** ${mencionUs.id}\n\n📝 **Mensaje:** ${mensajeMe}\n\n👮 **Enviado por:** ${msg.author}\n**ID:** ${msg.author.id}`)
            .setColor(colorEmb)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [emdSendDM]})
        
            const embMDSend = new Discord.MessageEmbed()
            .setAuthor(mencionUs.user.tag,mencionUs.user.displayAvatarURL({dynamic: true}))
            .setTitle("📥 Mensaje entrante")
            .setDescription(`📝 **Mensaje:** ${mensajeMe}\n\n👮 **Enviado por:** ${msg.author.tag}\n**ID:** ${msg.author.id}`)
            .setColor(colorEmb)
            .setFooter(`Desde el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            mencionUs.send({embeds: [embMDSend]}).catch(()=> msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}))
        }
        if(usuarioID){
            const embErr1 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`El usuario mencionado no permite los mensaje directos.`)
            .setColor(ColorError)
            .setTimestamp()


            const embErr2 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`la ID ingresada no corresponde a la de ningún miembro del servidor, verifica la ID ingresada.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!usuarioID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                msg.delete()
                tm.delete()
            },60000))

            const embErr3 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`la ID ingresada corresponde a la de un bot, no puedo enviar un mensaje directo a un bot.`)
            .setColor(ColorError)
            .setTimestamp()
            if(usuarioID.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                msg.delete()
                tm.delete()
            },60000))

            const embErr4 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`No has proporcionado el mensaje a enviar, proporciona el mensaje que enviare el usuario.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!mensajeID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                msg.delete()
                tm.delete()
            },60000))

            const emdSendDM = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail(usuarioID.user.displayAvatarURL({dynamic: true}))
            .setTitle("📤 Mensaje enviado al usuario")
            .setDescription(`👤 ${usuarioID}\n**ID:** ${usuarioID.id}\n\n📝 **Mensaje:** ${mensajeID}\n\n👮 **Enviado por:** ${msg.author}\n**ID:** ${msg.author.id}`)
            .setColor(colorEmb)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [emdSendDM]})
        
            const embMDSend = new Discord.MessageEmbed()
            .setAuthor(usuarioID.user.tag,usuarioID.user.displayAvatarURL({dynamic: true}))
            .setTitle("📥 Mensaje entrante")
            .setDescription(`📝 **Mensaje:** ${mensajeID}\n\n👮 **Enviado por:** ${msg.author.tag}\n**ID:** ${msg.author.id}`)
            .setColor(colorEmb)
            .setFooter(`Desde el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            usuarioID.send({embeds: [embMDSend]}).catch(()=> msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}))
        }
    }
    



    // Comandos de administracion
    if(comando === "setInterP" || comando === "setinterp"){
        const error = new Discord.MessageEmbed()
        .setAuthor(`❌ Error`)
        .setDescription(`Solo un administrador del servidor puede ejecutar el comando.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [error]}).then(tt => setTimeout(()=> {
            msg.delete()
            tt.delete()
        },60000))

        const embErrMiem = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`Tu servidor no cuenta con el mínimo de 100 miembros necesarios para poder usar el sistema de Inter Promoción.`)
        .setColor(ColorError)
        .setTimestamp()
        if(msg.guild.members.cache.size <= 99) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiem]}).then(tt => setTimeout(()=> {
            msg.delete()
            tt.delete()
        },60000))


        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando setInterP")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.setInterP <Mención del canal>${"``"}\n${"``"}ss.setInterP <ID del canal>${"``"}`},
            {name: "Ejemplos:", value: `ss.setInterP ${msg.channel}\n`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let canal = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0])

        if(canal){
            const embErr1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El argumento que has proporcionado no se identifico como un canal en este servidor, menciona o proporciona la ID de un canal de este servidor.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!canal) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tt => setTimeout(()=> {
                msg.delete()
                tt.delete()
            },60000))

            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El canal proporcionado no es de tipo texto, proporciona un canal de tipo texto.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!canal.isText()) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tt => setTimeout(()=> {
                msg.delete()
                tt.delete()
            },60000))

            const embMDCre = new Discord.MessageEmbed()
            .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail(msg.guild.iconURL({dynamic: true}))
            .setTitle("Nuevo canal agregado a Inter promoción")
            .setDescription(`**Servidor:** ${msg.guild.name}\n**Miembros:** ${msg.guild.memberCount}\n[**Unirse**](${(await msg.guild.invites.fetch()).map(mi => mi.url).slice(0,1)})\n**ID:** ${msg.guild.id}\n\n**Canal:** ${canal.name}\n**ID:** ${canal.id}\n\n**Autor:** ${msg.author}\n${msg.author.tag}\n${msg.author.id}`)
            .setColor("#00ff00")
            .setFooter(client.user.username,client.user.displayAvatarURL())
            .setTimestamp()
            client.users.cache.get(creadorID).send({embeds: [embMDCre]})
            

            const emb = new Discord.MessageEmbed()
            .setDescription(`✅ **Listo el canal se agregara al sistema de Inter promoción, gracias por usar el Bot.**`)
            .setColor(colorEmb)
            .setFooter("Agregar el canal al sistema de Inter promoción puede tardar entre 10m a mas de 4h, por favor sea paciente.",client.user.displayAvatarURL())
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [emb]})
 
        }
    }


    if(comando === "interPInfo" || comando === "interpinfo"){
        const embInf = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("¿Qué es el sistema de Inter promoción?")
        .setDescription(`Es un sistema que te facilita la tarea de promocionar contenido en otros servidores, con el solo tienes que promocionar el contenido en un canal el bot lo publicara en otros canales de otroas servidores.\n\n**Uso:**\nCrea un canal solo para esta función luego usar el comando ${"``"}ss.setInterP${"``"} para agregar el canal al sistema después seria empezar a publicar tu promoción en el, cada ves que publiques algo en ese canal te mandara tu publicación a todos los canales de los demás servidores que estén conectados al sistema de **Inter promoción**.`)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setColor(colorEmb)
        .setTimestamp()
        msg.channel.send({embeds: [embInf]})
    }

    // addrol
    let roles = msg.guild.roles.cache.filter(fr => !fr.managed).map(mr => mr)
    let random = Math.floor(Math.random()* roles.length)
    let rolesParaID = msg.guild.roles.cache.filter(fr => !fr.managed).map(mr => mr.id)
    let randomRID = Math.floor(Math.random()* rolesParaID.length)

    if(comando === "addrol" || comando === "addr"){
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_ROLES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_ROLES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))
        msg.guild.ownerId

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando addrol")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.addrol <Mencion del miembro> <Mencion del rol>${"``"}\n${"``"}ss.addrol <ID del miembro> <ID del rol>${"``"}`},
            {name: "Ejemplos:", value: `ss.addrol ${msg.author} ${roles[random]}\nss.addrol ${msg.author} ${rolesParaID[randomRID]}\nss.addrol ${msg.author.id} ${rolesParaID[randomRID]}\nss.addrol ${msg.author.id} ${roles[random]}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]})

        let rolParaAdd = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[1])

        let mencionUs = msg.mentions.members.first()
        let usuarioID = msg.guild.members.cache.get(args[0])


        if(mencionUs){
            const embErr1 = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`No has mencionado o proporcionado la ID del rol a dar.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!args[1]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                msg.delete()
                tm.delete()
            },60000))

            if(rolParaAdd){
                let rolesDelMenc = mencionUs.roles.cache.map(mp => mp.id)

                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`Ese rol esta por encima de mi, no puedo añadirlo a ningún miembro.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!rolParaAdd.editable) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El el miembro ya tiene ese rol.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El rol mencionado es exclusivo para un bot, no se le puede agregar a ningún miembro.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolParaAdd.managed) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))

                const embErr4 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setTitle("No se pudo ejecutar el comando.")
                .addField("Razón:", `Has intentado dar un rol igual o mayor que tu rol mas alto al miembro mencionado, no puedo hacer eso.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolParaAdd.comparePositionTo(msg.member.roles.highest) >= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))

                const embRoladd = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("✅ Rol añadido al miembro")
                .setDescription(`👤 ${mencionUs}\n${mencionUs.user.tag}\n${mencionUs.user.id}\n\n**Rol añadido:** ${rolParaAdd}`)
                .setColor("GREEN")
                .setTimestamp()
                mencionUs.roles.add(rolParaAdd.id).then(() => msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRoladd]}))
            }
        }else{
            if(usuarioID){
                const embErr1 = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`No has mencionado o proporcionado la ID del rol a dar.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!args[1]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))

                if(rolParaAdd){
                    let rolesDelMenc = usuarioID.roles.cache.map(mp => mp.id)
                    const embErr1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese rol esta por encima de mi, no puedo añadirlo a ningún miembro.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!rolParaAdd.editable) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                        msg.delete()
                        tm.delete()
                    },60000))

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`El el miembro ya tiene ese rol.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                        msg.delete()
                        tm.delete()
                    },60000))

                    const embErr3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`El rol mencionado es exclusivo para un bot, no se le puede agregar a ningún miembro.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!rolParaAdd.hoist) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                        msg.delete()
                        tm.delete()
                    },60000))

                    const embErr4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setTitle("No se pudo ejecutar el comando.")
                    .addField("Razón:", `Has intentado dar un rol igual o mayor que tu rol mas alto al miembro mencionado, no puedo hacer eso.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(rolParaAdd.comparePositionTo(msg.member.roles.highest) >= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                        msg.delete()
                        tm.delete()
                    },60000))

                    const embRoladd = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("✅ Rol añadido al miembro")
                    .setDescription(`👤 ${usuarioID}\n${usuarioID.user.tag}\n${usuarioID.user.id}\n\n**Rol añadido:** ${rolParaAdd}`)
                    .setColor("GREEN")
                    .setTimestamp()
                    usuarioID.roles.add(rolParaAdd.id).then(() => msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRoladd]}))
                }
            }
        }   
    }

    // removeRol
    if(comando === "removeRol" || comando === "rmr"){
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_ROLES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_ROLES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))
        msg.guild.ownerId

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando addrol")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.addrol <Mencion del miembro> <Mencion del rol>${"``"}\n${"``"}ss.addrol <ID del miembro> <ID del rol>${"``"}`},
            {name: "Ejemplos:", value: `ss.addrol ${msg.author} ${roles[random]}\nss.addrol ${msg.author} ${rolesParaID[randomRID]}\nss.addrol ${msg.author.id} ${rolesParaID[randomRID]}\nss.addrol ${msg.author.id} ${roles[random]}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]})

        let rolParaAdd = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[1])

        let mencionUs = msg.mentions.members.first()
        let usuarioID = msg.guild.members.cache.get(args[0])


        if(mencionUs){
            const embErr1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`No has mencionado o proporcionado la ID del rol a remover.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!args[1]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                msg.delete()
                tm.delete()
            },60000))

            if(rolParaAdd){
                let rolesDelMenc = mencionUs.roles.cache.map(mp => mp.id)

                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`Ese rol esta por encima de mi, no puedo removerlo del miembro.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!rolParaAdd.editable) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El el miembro no tiene ese rol.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El rol mencionado es exclusivo para un bot, no lo puedo remover de ningún miembro.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolParaAdd.managed) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))

                const embErr4 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setTitle("No se pudo ejecutar el comando.")
                .addField("Razón:", `Has intentado remover un rol igual o mayor que tu rol mas alto al miembro mencionado, no puedo hacer eso.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolParaAdd.comparePositionTo(msg.member.roles.highest) >= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))

                const embRoladd = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("📤 Rol removido del miembro")
                .setDescription(`👤 ${mencionUs}\n${mencionUs.user.tag}\n${mencionUs.user.id}\n\n**Rol removido:** ${rolParaAdd}`)
                .setColor("RED")
                .setTimestamp()
                mencionUs.roles.remove(rolParaAdd.id).then(() => msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRoladd]}))
            }
        }else{
            if(usuarioID){
                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No has mencionado o proporcionado la ID del rol a dar.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!args[1]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                    msg.delete()
                    tm.delete()
                },60000))

                if(rolParaAdd){
                    let rolesDelMenc = usuarioID.roles.cache.map(mp => mp.id)
                    const embErr1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese rol esta por encima de mi, no puedo removerlo del miembro.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!rolParaAdd.editable) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                        msg.delete()
                        tm.delete()
                    },60000))

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`El el miembro no tiene ese rol.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                        msg.delete()
                        tm.delete()
                    },60000))

                    const embErr3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`El rol mencionado es exclusivo para un bot, no se le puede agregar a ningún miembro.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!rolParaAdd.hoist) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                        msg.delete()
                        tm.delete()
                    },60000))

                    const embErr4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setTitle("No se pudo ejecutar el comando.")
                    .addField("Razón:", `Has intentado remover un rol mayor o igual que tu rol mas alto del miembro, no puedo hacer eso.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(rolParaAdd.comparePositionTo(msg.member.roles.highest) >= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                        msg.delete()
                        tm.delete()
                    },60000))

                    const embRoladd = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("📤 Rol removido del miembro")
                    .setDescription(`👤 ${usuarioID}\n${usuarioID.user.tag}\n${usuarioID.user.id}\n\n**Rol removido:** ${rolParaAdd}`)
                    .setColor("RED")
                    .setTimestamp()
                    usuarioID.roles.remove(rolParaAdd.id).then(() => msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRoladd]}))
                }
            }
        }   
    }

    // createCha
    if(comando === "createCha" || comando === "crech"){
        let categoriasGMS = msg.guild.channels.cache.filter(fc => fc.type === "GUILD_CATEGORY").map(mc => mc.id)
        let randomCat = Math.floor(Math.random()* categoriasGMS.length)

        let tiposDeCanales = {
            "GUILD_TEXT": "Texto",
            "GUILD_VOICE": "Voz"
        }
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar canales.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_CHANNELS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar canales.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_CHANNELS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando createCha")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.createCha <Nombre del canal>${"``"}\nCrea un canal con el nombre proporcionado de tipo texto en la categoría que estas utilizando\n${"``"}ss.createCha <Nombre del canal> - <Tipo de canal (texto o voz)>${"``"}\nCrea un canal con el nombre ingresado y el tipo de canal ingresado en la categoría que estas usando\n${"``"}ss.createCha <Nombre del canal> - <Tipo de canal (texto o voz)> - <ID de la categoría en la que se creara>${"``"}\nCrea un canal con el nombre ingresado, tipo de canal ingresado y en la categoría ingresada.`},
            {name: "Ejemplos:", value: `ss.createCha Chat\nss.createCha Reglas - texto\nss.createCha Musica - voz - ${categoriasGMS[randomCat]}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]}) 
        
        let opciones = args.join(" ").split(" - ")
        let tipoCanal = opciones[1]
        let categoria = opciones[2]
        
        
        if(args[0]){
            if(opciones[1] == "texto"){
                tipoCanal = "GUILD_TEXT"
            }else{
                if(opciones[1] == "voz"){
                    tipoCanal = "GUILD_VOICE"
                }else{
                    tipoCanal = "GUILD_TEXT"
                }
            }

            if(!opciones[2]){
                categoria = `${msg.channel.parentId}`
            }
            
    
            msg.guild.channels.create(`${opciones[0]}`,{type: `${tipoCanal}`, parent: `${categoria}`}).then(cc=> {
                const embCreateCha = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("✅ Canal creado")
                .setDescription(`**Canal:** ${cc}\n**Nombre:** ${cc.name}\n**ID:** ${cc.id}\n\n**Tipo:** ${tiposDeCanales[cc.type]}\n\n**Categoría:** ${cc.parent}`)
                .setColor("GREEN")
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embCreateCha]})
            })
        }
    }

    // deleteCha
    if(comando == "deleteCha" || comando === "delch"){
        let canalesAlDel = msg.guild.channels.cache.filter(fc => fc.type === "GUILD_TEXT" ).map(mc => mc)
        let randomChanne = Math.floor(Math.random()* canalesAlDel.length)

        let tiposDeCanales = {
            "GUILD_TEXT": "texto",
            "GUILD_VOICE": "voz",
            "GUILD_CATEGORY": "categoría"
        }

        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar canales.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_CHANNELS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar canales.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_CHANNELS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando deleteCha")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.deleteCha <Mencion del canal>${"``"}\n${"``"}ss.deleteCha <ID del canal>${"``"}`},
            {name: "Ejemplos:", value: `ss.deleteCha ${canalesAlDel[randomChanne]}\nss.createCha Musica voz ${canalesAlDel[randomChanne].id}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]}) 
        
        let canalDel = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0])
        
        if(canalDel){
            const embCreateCha = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("⭕ Canal eliminado")
            .setDescription(`**Nombre:** ${canalDel.name}\n**ID:** ${canalDel.id}\n**Tipo:** ${tiposDeCanales[canalDel.type]}\n**Categoría:** ${canalDel.parent}`)
            .setColor("RED")
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embCreateCha]}).then(mt => {
                canalDel.delete()
            })
        }
    }


    // Comandos para el creador
    if(comando === "crearI"){
        if(msg.author.id === "717420870267830382"){
            let canalID = args[0]
            client.channels.cache.get(canalID).createInvite({maxAge: 0, reason: "Importante para el sistema de Inter promoción."}).then(tt => msg.channel.send(`${tt}`))
        }
    }

    if(comando === "ver"){
        if(creadoresID.some(sc => sc === msg.author.id)){
            let canal = client.channels.cache.get(args[0])
            let servidor = client.guilds.cache.get(canal.guild.id)

            const emb = new Discord.MessageEmbed()
            .setThumbnail(canal.guild.iconURL({dynamic: true}))
            .setDescription(`${canal.name}\n${canal}\n${canal.id}\n\n${canal.guild.name}\n${canal.guild.id}\nMiembros: ${servidor.members.cache.size}\n${(await servidor.invites.fetch()).map(mi => mi.url).slice(0,1)}`)
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [emb]})
        }
    }

    if(comando === "servers"){
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
})






client.login(token);