const Discord = require("discord.js");
const intents = new Discord.Intents();
const client = new Discord.Client({intents: 32767, ws:{properties:{$browser: "Discord Android"}}});

const config = require("./config.json")
const token = config.tokenSSBot
const ms = require("ms")
const canales = ["887829645649641472","850121919382159421"]

const creadorID = "717420870267830382"
const creadoresID = ["717420870267830382","825186118050775052"]
const colorEmb = "#060606"
const colorEmbInfo = "#ffffff"
const ColorError = "#ff0000"

client.on("ready",async () => {
    console.log(client.user.username, "Hola, estoy listo")

    const estado = [
        {
            name: `${client.guilds.cache.size.toLocaleString()} servidores.`,
            type: "WATCHING"
        },
        {
            name: "ss.help",
            type: "LISTENING"
        },
        {
            name: `${client.users.cache.size.toLocaleString()} usuarios.`,
            type: "WATCHING"
        },
        {
            name: `${canales.length} canales de Inter promoción`,
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


// Inter promocion
client.on("messageCreate", async msg =>{
    if(msg.author.bot) return;
    
    if(canales.some(ch => ch === msg.channel.id)){
        let invit = await msg.guild.invites.fetch()
        let url = invit.filter(fi => fi.inviter.id === client.user.id).map(mi => mi.url).slice(0,1)
        const embed = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`<:61208:879518684039774239> [Unirse al servidor](${url})\n\n💬 **Mensaje:**\n${msg.content}`)
        .setColor(msg.guild.me.displayHexColor)
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
    if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
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
    const prefijo = "|"

    if(msg.author.bot) return; 
    if(!msg.content.startsWith(prefijo)) return; 

    const args = msg.content.slice(prefijo.length).trim().split(/ +/g);
    const comando = args.shift()

    if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;



    if(comando === "help"){
        const help = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL())
        .setDescription(`**Mi prefijo:** ${"``"}ss.${"``"}\n\n**Comandos principales:**\n${"``"}ss.comandos${"``"} **| Te muestra todos los comandos.**\n${"``"}ss.botInfo${"``"} **| Te muestra información del bot.**`)
        .setColor(colorEmb)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [help]})
    }

    if(comando === "comandos" || comando == "commands"){
        const comandos = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("📑 Comandos")
        .addField("\u200B","\u200B")
        .setDescription(`Un comando es una palabra a la que el bot responde.`)
        .addField("🌎 Comandos generales",`Comandos que todos pueden usar.\n\n${"``"}ss.user${"``"} **|** Muestra información del usuario.\n${"``"}ss.stats${"``"} **|** Muestra estadisticas generales de todos los servidores.\n${"``"}ss.jumbo${"``"} **|** Muestra en grande un emoji del servidor.\n${"``"}ss.emojis${"``"} **|** Muestra todos los emojis del servidor.\n${"``"}ss.uptime${"``"} **|** Muestra el tiempo que llevo activo o encendido.\n${"``"}ss.avatar${"``"} **|** Muestra el avatar del usuario.\n${"``"}ss.server${"``"} **|** Muestra información del servidor.\n${"``"}ss.invite${"``"} **|** Te muestra la invitación del bot.\n${"``"}ss.qrcode${"``"} **|** Genera un código QR de un enlace.\n${"``"}${prefijo}stikers${"``"} **|** Te muestra todos los stikers del servidor.\n${"``"}ss.botInfo${"``"} **|** Te muestra información del bot.`)
        .addField("\u200B", "\u200B")
        .addField("👮 Comandos de moderacion",`Comandos que solo los moderadores pueden usar.\n\n${"``"}ss.warn${"``"} **|** Advierte a un usuario.\n${"``"}ss.kick${"``"} **|** Expulsa a un usuario dándole una razón.\n${"``"}ss.ban${"``"} **|** Prohíbe a un usuario entrar al servidor.\n${"``"}ss.unban${"``"} **|** Elimina la prohibición de un miembro al servidor.\n${"``"}ss.clear${"``"} **|** Elimina múltiples mensajes en un canal.\n${"``"}ss.dmsend${"``"} **|** Envía un mensaje directo por medio del bot a un miembro.\n${"``"}ss.banlist${"``"} **|** Te muestra una lista de los usuarios baneados en el servidor.`)
        .addField("\u200B", "\u200B")
        .addField("💎 Comandos de administración",`Comandos que solo los administradores pueden usar.\n\n${"``"}ss.setInterP${"``"} **|** Establece un canal de inter promoción en tu servidor, para mas informacion de este comando usa el comando ${"``"}ss.interPInfo${"``"}\n${"``"}ss.addRol${"``"} **|** Añade un rol a un miembro o mas en el servidor.\n${"``"}ss.removeRol${"``"} **|** Remueve un rol de un miembro o mas en el servidor.\n${"``"}ss.createCha${"``"} **|** Crea un canal.\n${"``"}ss.deleteCha${"``"} **|** Elimina un canal.`)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setColor(colorEmb)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [comandos]}).catch(()=> console.log("No se ha podido enviar el mensaje"))
    }

    // Comandos generales
    if(comando === "user"){
        let presencia = {
            "dnd": "<:nomolestar:904558124793475083> No molestar",
            "idle": "<:ausente:904557543228059650> Ausente",
            "undefined": "<:desconectado:904558485155495946> Desconectado",
            "offline": "<:desconectado:904558485155495946> Desconectado",
            "online": "<:online:904556872005222480> Conectado"
        }

        let tyEstado = {
            "CUSTOM": "Personalizada:",
            "COMPETING": "Compitiendo",
            "LISTENING": "Escuchando",
            "PLAYING": "Jugando a",
            "STREAMING": "Trasmitiendo",
            "WATCHING": "Viendo"
        }

        let insignias = {
            "BUGHUNTER_LEVEL_1": "<:BughunterLevel1:920743741512368178> Cazador de bugs nivel 1",
            "BUGHUNTER_LEVEL_2": "<:BughunterLevel2:920744747914657842> Cazador de bugs nivel 2",
            "DISCORD_CERTIFIED_MODERATOR": "<:DiscordCertifiedModerator:920751094928384041> Moderador",
            "DISCORD_EMPLOYEE": "<:DiscordEmployee:920745583151575071> Empleado de Discord",
            "EARLY_SUPPORTER": "<:EarlySupporter:920741677931569182>",
            "EARLY_VERIFIED_BOT_DEVELOPER": "<:VerifiedBotDeveloper:920746956706414693> Desarrollador de bots verificado ",
            "HOUSE_BALANCE": "<:HouaseBalance:920750191508860928> Balance",
            "HOUSE_BRAVERY": "<:HouseBravery:920750033660416103> Bravery",
            "HOUSE_BRILLIANCE": "<:HouseBrilliance:920749159743635457> Brilliance",
            "HYPESQUAD_EVENTS": "<:HypeSquad:920754083940413500> Eventos de la hypesquad",
            "PARTNERED_SERVER_OWNER": "<:DiscordPartner:920746109259898890> Servidor socio",
            "VERIFIED_BOT": "<:VerifiedBot:920750538012885013> Bot verificado",
            "TEAM_USER": "👥"
        }

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])

        if(miembro){
            let actyvidad 
            if(miembro.presence?.activities.length <= 0){
                actyvidad = "Sin texto de estado"
            }
            if(miembro.presence?.activities.length >=1){
                if(miembro.presence?.activities[0].type === "CUSTOM"){
                    actyvidad = `${miembro.presence?.activities[0].emoji ? miembro.presence?.activities[0].emoji: ""} ${miembro.presence?.activities[0].state}`
                }else{
                    actyvidad = `${tyEstado[miembro.presence?.activities[0].type]} ${miembro.presence?.activities[0].emoji ? miembro.presence?.activities[0].emoji: ""} ${miembro.presence?.activities[0].name}`
                }
            }

            if(miembro.id === msg.author.id){
                const embUser = new Discord.MessageEmbed()
                .setAuthor(`Información de ${msg.author.username} pedida por el`,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048}))
                .setDescription(`👤 Tu ${miembro}`)
                .addFields(
                    {name: "🏷 **Tag:**", value: `${miembro.user.tag}`, inline: true},
                    {name: "🆔 **ID:**", value: `${miembro.id}`, inline: true},
                    {name: "📌 **Apodo:**", value: `${miembro.nickname !== null ? `${miembro.nickname}`: "Ninguno"}`, inline: true},
                    {name: "📅 **Creaste la cuenta:**", value: `<t:${Math.round(miembro.user.createdAt / 1000)}:R>`, inline: true},
                    {name: "📥 **Te uniste :**", value: `<t:${Math.round(miembro.joinedAt / 1000)}:R>`, inline: true},
                    {name: "<:Booster:920792402376130582> **Booster:**", value: `${miembro.premiumSince ? "Eres Booster": "No eres Booster"}`, inline: true},
                    {name: `🎖 **Insignias:** ${miembro.user.flags.toArray().length}`, value: `${miembro.user.flags.toArray().length ? miembro.user.flags.toArray().map(i=> insignias[i]).join("\n") : "No tienes insignias"}`, inline: true},
                    {name: "🔍 **Estado:**", value: `${presencia[miembro.presence?.status]}\n${actyvidad}`, inline: true},
                )
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
            
            }else{
                if(miembro.user.bot){
                    const embUser = new Discord.MessageEmbed()
                    .setAuthor(`Información de ${miembro.user.username} pedida por ${msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048}))
                    .setDescription(`🤖 Bot: ${miembro}`)
                    .addFields(
                        {name: "🏷 **Tag:**", value: `${miembro.user.tag}`, inline: true},
                        {name: "🆔 **ID:**", value: `${miembro.user.id}`, inline: true},
                        {name: "📌 **Apodo:**", value: `${miembro.nickname !== null ? `${miembro.nickname}`: "Ninguno"}`, inline: true},
                        {name: "📅 **Fue creado:**", value: `<t:${Math.round(miembro.user.createdAt / 1000)}:R>`, inline: true},
                        {name: "📥 **Se unio:**", value: `<t:${Math.round(miembro.joinedAt / 1000)}:R>`, inline: true},
                        {name: "<:Booster:920792402376130582> **Booster:**", value: `Un bot no puede boostear`, inline: true},
                        {name: `🎖 **Insignias:** ${miembro.user.flags.toArray().length}`, value: `${miembro.user.flags.toArray().length ? miembro.user.flags.toArray().map(i=> insignias[i]).join("\n") : "No tiene insignias"}`, inline: true},
                        {name: "🔍 **Estado:**", value: `${presencia[miembro.presence?.status]}\n${actyvidad}`, inline: true},
                    )
                    .setColor(msg.guild.me.displayHexColor)
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})

                }else{
                    const embUser = new Discord.MessageEmbed()
                    .setAuthor(`Información de ${miembro.user.username} pedida por ${msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})) 
                    .setDescription(`👤 Miembro: ${miembro}`)
                    .addFields(
                        {name: "🏷 **Tag:**", value: `${miembro.user.tag}`, inline: true},
                        {name: "🆔 **ID:**", value: `${miembro.user.id}`, inline: true},
                        {name: "📌 **Apodo:**", value: `${miembro.nickname !== null ? `${miembro.nickname}`: "Ninguno"}`, inline: true},
                        {name: "📅 **Creo la cuenta:**", value: `<t:${Math.round(miembro.user.createdAt / 1000)}:R>`, inline: true},
                        {name: "📥 **Se unio:**", value: `<t:${Math.round(miembro.joinedAt / 1000)}:R>`, inline: true},
                        {name: "<:Booster:920792402376130582> **Booster:**", value: `${miembro.premiumSince ? "Es Booster": "No es Booster"}`, inline: true},
                        {name: `🎖 **Insignias:** ${miembro.user.flags.toArray().length}`, value: `${miembro.user.flags.toArray().length ? miembro.user.flags.toArray().map(i=> insignias[i]).join("\n") : "No tiene insignias"}`, inline: true},
                        {name: "🔍 **Estado:**", value: `${presencia[miembro.presence?.status]}\n${actyvidad}`, inline: true},
                    )
                    .setColor(msg.guild.me.displayHexColor)
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
                }
            }
        
        }else{
            if(args[0]){
                let usuario = await client.users.fetch(args[0])

                if(usuario.bot){
                    const embUser = new Discord.MessageEmbed()
                    .setAuthor(`Información de ${usuario.tag} pedida por ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048}))
                    .setThumbnail(usuario.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048}))
                    .setDescription(`🤖 Bot: ${usuario}`)
                    .addFields(
                        {name: "🏷 **Tag:**", value: `${usuario.tag}`, inline: true},
                        {name: "🆔 **ID:**", value: `${usuario.id}`, inline: true},
                        {name: "📅 **Fue creado:**", value: `<t:${Math.round(usuario.createdAt/ 1000)}:R>`, inline: true},
                        {name: `🎖 **Insignias:** ${usuario.flags.toArray().length}`, value: `${usuario.flags.toArray().length ? usuario.flags.toArray().map(i=> insignias[i]).join("\n") : "No tiene insignias"}`, inline: true},
                    )
                    .setColor(msg.guild.me.displayHexColor)
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})

                }else{
                    const embUser = new Discord.MessageEmbed()
                    .setAuthor(`Información de ${usuario.tag} pedida por ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048}))
                    .setThumbnail(usuario.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048}))
                    .setDescription(`👤 Usuario: ${usuario}`)
                    .addFields(
                        {name: "🏷 **Tag:**", value: `${usuario.tag}`, inline: true},
                        {name: "🆔 **ID:**", value: `${usuario.id}`, inline: true},
                        {name: "📅 **Creao la cuenta:**", value: `<t:${Math.round(usuario.createdAt/ 1000)}:R>`, inline: true},
                        {name: `🎖 **Insignias:** ${usuario.flags.toArray().length}`, value: `${usuario.flags.toArray().length ? usuario.flags.toArray().map(i=> insignias[i]).join("\n") : "No tiene insignias"}`, inline: true},
                    )
                    .setColor(msg.guild.me.displayHexColor)
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
                }
            }else{
                let actyvidad 
                if(msg.member.presence?.activities.length <= 0){
                    actyvidad = "Sin texto de estado"
                }
                if(msg.member.presence?.activities.length >=1){
                    if(msg.member.presence?.activities[0].type === "CUSTOM"){
                        actyvidad = `${msg.member.presence?.activities[0].emoji ? msg.member.presence?.activities[0].emoji: ""} ${msg.member.presence?.activities[0].state}`
                    }else{
                        actyvidad = `${tyEstado[msg.member.presence?.activities[0].type]} ${msg.member.presence?.activities[0].emoji ? msg.member.presence?.activities[0].emoji: ""} ${msg.member.presence?.activities[0].name}`
                    }
                }

                const embUser = new Discord.MessageEmbed()
                .setAuthor(`Información de ${msg.member.user.tag} pedida por el`,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(msg.author.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})) 
                .setDescription(`👤 Tu: ${msg.author}`)
                .addFields(
                    {name: "🏷 **Tag:**", value: `${msg.author.tag}`, inline: true},
                    {name: "🆔 **ID:**", value: `${msg.author.id}`, inline: true},
                    {name: "📌 **Apodo:**", value: `${msg.member.nickname !== null ? `${msg.member.nickname}`: "Ninguno"}`, inline: true},
                    {name: "📅 **Creaste la cuenta:**", value: `<t:${Math.round(msg.author.createdAt / 1000)}:R>`, inline: true},
                    {name: "📥 **Te uniste:**", value: `<t:${Math.round(msg.member.joinedAt / 1000)}:R>`, inline: true},
                    {name: "<:Booster:920792402376130582> **Booster:**", value: `${msg.member.premiumSince ? "Eres Booster": "No eres Booster"}`, inline: true},
                    {name: `🎖 **Insignias:** ${msg.author.flags.toArray().length}`, value: `${msg.author.flags.toArray().length ? msg.author.flags.toArray().map(i=> insignias[i]).join("\n") : "No tienes insignias"}`, inline: true},
                    {name: "🔍 **Estado:**", value: `${presencia[msg.member.presence?.status]}\n${actyvidad}`, inline: true},
                )
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
            }
        }     
    }

    if(comando === "stats"){
        let textCh = client.channels.cache.filter(ft=>ft.type==="GUILD_TEXT").size
        let voiseCH = client.channels.cache.filter(fv=>fv.type==="GUILD_VOICE").size
        let cateCh = client.channels.cache.filter(fc=>fc.type==="GUILD_CATEGORY").size

        let ping
        if(client.ws.ping <= 60){
            ping = "<:30ms:917227036890791936>"
        }
        if(client.ws.ping > 60 && client.ws.ping < 120){
            ping = "<:60ms:917227058399162429>"
        }
        if(client.ws.ping > 120){
            ping = "<:150ms:917227075243503626>"
        }

        const embed = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("Estadisticas")
        .addFields(
            {name: "<:wer:920166217086537739> **Servidores:**", value: `${client.guilds.cache.size.toLocaleString()}`, inline: true},
            {name: "📑 **Comandos:**", value: `25`, inline: true},
            {name: "⏱ **Uptime:**", value: `${ms(client.uptime)}`, inline: true},
            {name: `${ping} **Ping:**`, value: `${client.ws.ping} ms`, inline: true},
            {name: "<:memoria:920501773272227880> **Memoria:**", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true},
            {name: "<:node:904814964542410752> **Node:**", value: `${process.version}`, inline: true},
            {name: "👾 **Discord.js:**", value: `v${Discord.version}`, inline: true},
            {name: "📅 **Creación:**", value: `<t:${Math.floor(client.user.createdAt / 1000)}:R>`, inline: true},
            {name: "👨‍💻 **Creador**", value: `${client.users.cache.get("717420870267830382").tag}`, inline: true},
            {name: `😀 **Emojis:** ${client.emojis.cache.size.toLocaleString()}`, value: `${client.emojis.cache.filter(fn=>!fn.animated).size.toLocaleString()} normales\n${client.emojis.cache.filter(fa=>fa.animated).size.toLocaleString()} animados`,inline: true},
            {name: `👥 **Usuarios: ${client.users.cache.size.toLocaleString()}**`, value: `👤 ${client.users.cache.filter(fu => !fu.bot).size.toLocaleString()} miembros\n🤖 ${client.users.cache.filter(fb => fb.bot).size.toLocaleString()} bots`, inline: true},
            {name: ` **Canales: ${(textCh+voiseCH+cateCh).toLocaleString()}**`, value: `<:canaldetexto:904812801925738557> ${textCh.toLocaleString()} texto\n <:canaldevoz:904812835295596544> ${voiseCH.toLocaleString()} voz\n<:carpeta:920494540111093780> ${cateCh.toLocaleString()} categorías`, inline: true},
        )
        .setColor(colorEmb)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
    }

    if(comando === "jumbo"){
        let emojisSV = msg.guild.emojis.cache.map(e=>e)
        let emR = Math.floor(Math.random()*emojisSV.length)
        const embInfo = new Discord.MessageEmbed()
        .setAuthor("🔎 Comando jumbo")
        .addFields(
            {name: "**Uso:**", value: `${"``"}ss.jumbo <Emoji>${"``"}`},
            {name: "**Ejemplo:**", value: `ss.jumbo ${emojisSV[emR]}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})


        let emoji = msg.guild.emojis.cache.find(ec => ec.name === args[0].split(":")[1])

        const embErr1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`Ese emoji es no es un emoji del servidor.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!emoji) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            dt.delete()
        },60000))
        
        const embJumbo = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setImage(emoji.url)
        .setDescription(`[${emoji.name}](${emoji.url})`)
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embJumbo]})
    }

    if(comando === "emojis"){
        let emojisAl = ["😃","😄","😅","🤣","😊","🤪","😐","😝","🤑","😡"]
        let emojRandom = Math.floor(Math.random()*emojisAl.length)
        
        let emojis = msg.guild.emojis.cache
        if(msg.guild.emojis.cache.size <= 0){
            const embEmojis = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`${emojisAl[emojRandom]} Emojis del servidor`)
            .setDescription(`Este servidor no tiene emojis propios.`)
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEmojis]})

        }else{
            let em1 = 0
            let em2 = 10
            let pagina = 1

            const embEmojis = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`${emojisAl[emojRandom]} Emojis del servidor`)
            .setDescription(`Emojis: ${emojis.size}\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(em1,em2).join("\n\n")}`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(`Pagina - ${pagina}/${Math.round(emojis.size / 10)}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            const msEm = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEmojis]})
             
            if(emojis.size > 10){
                await msEm.react("⬅")
                await msEm.react("➡")
            }

            const colector = msEm.createReactionCollector(rec => rec.id === msg.author.id)

            colector.on("collect", async reaccion => {
                if(reaccion.emoji.name === "⬅" && reaccion.users.cache.get(msg.author.id)){
                    if(em2<=10) return await reaccion.users.remove(msg.author.id)

                    em1=em1-10
                    em2=em2-10
                    pagina=pagina-1

                    embEmojis
                    .setDescription(`Emojis: ${emojis.size}\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(em1,em2).join("\n\n")}`)
                    .setFooter(`Pagina - ${pagina}/${Math.round(emojis.size / 10)}`,msg.guild.iconURL({dynamic: true}))
                    msEm.edit({embeds: [embEmojis]})
                }

                if(reaccion.emoji.name === "➡" && reaccion.users.cache.get(msg.author.id)){
                    if(em2>=emojis.size) return await reaccion.users.remove(msg.author.id)
                    em1=em1+10
                    em2=em2+10
                    pagina=pagina+1

                    embEmojis
                    .setDescription(`Emojis: ${emojis.size}\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(em1,em2).join("\n\n")}`)
                    .setFooter(`Pagina - ${pagina}/${Math.round(emojis.size / 10)}`,msg.guild.iconURL({dynamic: true}))
                    msEm.edit({embeds: [embEmojis]})
                } 
                await reaccion.users.remove(msg.author.id)
            })
        }
    }

    if(comando === "stikers"){
        let stikers = msg.guild.stickers.cache

        if(stikers.size <= 0){
            const embStikers = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`<:sticker:920136186687795262> Stikers del servidor`)
            .setDescription(`Este servidor no tiene stikers propios.`)
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embStikers]})

        }else{
            let em1 = 0
            let em2 = 10
            let pagina = 1

            const embEmojis = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`<:sticker:920136186687795262> Stikers del servidor`)
            .setDescription(`Stikers: ${stikers.size}\n\n${stikers.map(e=>e).map((en, e)=>`**${e+1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1,em2).join("\n\n")}`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(`Pagina - ${pagina}/${Math.round(stikers.size / 10)}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            const msEm = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEmojis]})
             
            if(stikers.size > 10){
                await msEm.react("⬅")
                await msEm.react("➡")
            }

            const colector = msEm.createReactionCollector(rec => rec.id === msg.author.id)

            colector.on("collect", async reaccion => {
                if(reaccion.emoji.name === "⬅" && reaccion.users.cache.get(msg.author.id)){
                    if(em2<=10) return await reaccion.users.remove(msg.author.id)

                    em1=em1-10
                    em2=em2-10
                    pagina=pagina-1

                    embEmojis
                    .setDescription(`Stikers: ${stikers.size}\n\n${stikers.map(e=>e).map((en, e)=>`**${e+1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1,em2).join("\n\n")}`)
                    .setFooter(`Pagina - ${pagina}/${Math.round(emojis.size / 10)}`,msg.guild.iconURL({dynamic: true}))
                    msEm.edit({embeds: [embEmojis]})
                }

                if(reaccion.emoji.name === "➡" && reaccion.users.cache.get(msg.author.id)){
                    if(em2>=emojis.size) return await reaccion.users.remove(msg.author.id)
                    em1=em1+10
                    em2=em2+10
                    pagina=pagina+1

                    embEmojis
                    .setDescription(`Stikers: ${stikers.size}\n\n${stikers.map(e=>e).map((en, e)=>`**${e+1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1,em2).join("\n")}`)
                    .setFooter(`Pagina - ${pagina}/${Math.round(emojis.size / 10)}`,msg.guild.iconURL({dynamic: true}))
                    msEm.edit({embeds: [embEmojis]})
                } 
                await reaccion.users.remove(msg.author.id)
            })
        }
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

        if(mencion){
            const embAva = new Discord.MessageEmbed()
            .setAuthor(`Avatar de ${mencion.user.tag} pedido por ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("Avatar")
            .setURL(mencion.user.displayAvatarURL({dynamic: true, format: "png", size: 4096}))
            .setImage(mencion.user.displayAvatarURL({dynamic: true, format: "png", size: 4096}))
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAva]})
        }else{
            if(args[0]){
                if(!isNaN(args[0])){
                    let usuario = await client.users.fetch(args[0])
                    const embAva = new Discord.MessageEmbed()
                    .setAuthor(`Avatar de ${usuario.tag} pedido por ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("Avatar")
                    .setURL(usuario.displayAvatarURL({dynamic: true, format: "png", size: 4096}))
                    .setImage(usuario.displayAvatarURL({dynamic: true, format: "png", size: 4096}))
                    .setColor(msg.guild.me.displayHexColor)
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAva]})
                }else{
                    if(args[0] === "guild" || args[0] === "servidor" || args[0] === "server"){
                        const embAva = new Discord.MessageEmbed()
                        .setAuthor(`Avatar del servidor pedido por ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle("Avatar")
                        .setURL(msg.guild.iconURL({dynamic: true, format: "png", size: 4096}))
                        .setImage(msg.guild.iconURL({dynamic: true, format: "png", size: 4096}))
                        .setColor(msg.guild.me.displayHexColor)
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAva]})
                    }
                }
            }else{
                const embAva = new Discord.MessageEmbed()
                .setAuthor(`Avatar de ${msg.author.tag} pedoido por el`,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("Avatar")
                .setURL(msg.author.displayAvatarURL({dynamic: true, format: "png" || "gif", size: 4096}))
                .setImage(msg.author.displayAvatarURL({dynamic: true, format: "png" || "gif", size: 4096}))
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAva]})
            }
        }
    }

    if(comando === "server"){
        let feat = {
            "ANIMATED_ICON": "Icono animado",
            "BANNER": "Banner",
            "COMMERCE": "Comercio",
            "COMMUNITY": "Comunidad",
            "DISCOVERABLE": "Reconocible",
            "FEATURABLE": "Destacado",
            "INVITE_SPLASH": "Invite splash",
            "MEMBER_VERIFICATION_GATE_ENABLED": "Puerta de verificación de miembros habilitada",
            "MONETIZATION_ENABLED": "Monetización habilitada",
            "MORE_STICKERS": "Mas pegatinas",
            "NEWS": "Noticias",
            "PARTNERED": "Asociado",
            "THREADS_ENABLED": "Hilos habilitados",
            "PREVIEW_ENABLED": "Vista previa habilitada",
            "PRIVATE_THREADS": "Hilos privados",
            "SEVEN_DAY_THREAD_ARCHIVE": "Archivo de hilo de siete días",
            "THREE_DAY_THREAD_ARCHIVE": "Archivo de hilo de tres días",
            "TICKETED_EVENTS_ENABLED": "Eventos con ticket habilitados",
            "VANITY_URL": "URL personalizada",
            "VERIFIED": "Verificado",
            "VIP_REGIONS": "Regiones VIP",
            "WELCOME_SCREEN_ENABLED": "Pantalla de bienvenida habilitada",
            "ENABLED_DISCOVERABLE_BEFORE": "Descubrimiento habilitado antes",
            "NEW_THREAD_PERMISSIONS": "Permisos para hilos nuevos"
        }

        let verificacion ={
            "NONE": "Ninguno",
            "LOW": "Bajo",
            "MEDIUM": "Medio",
            "HIGH": "Alto",
            "VERY_HIGH": "Muy alto"
        }

        let levelMejora = {
            "NONE": "Ninguno",
            "TIER_1": "<:Tier1:921852504713625670> Nivel 1",
            "TIER_2": "<:Tier2:921852557691863082> Nivel 2",
            "TIER_3": "<:Tier3:921852589933469716> Nivel 3"
        }

        let filterNSFW = {
            "DISABLED": "Deshabilitado",
            "MEMBERS_WITHOUT_ROLES": "Miembros sin rol",
            "ALL_MEMBERS": "Todos los miembros"
        }

        let notifi = {
            "ALL_MESSAGES": "Todos los mensajes",
            "ONLY_MENTIONS": "Solo menciones"
        }

        let imgs 
        
        if(msg.guild.bannerURL() && msg.guild.discoverySplashURL() && msg.guild.splashURL()){
            imgs = `[Banner](${msg.guild.bannerURL({size: 4096, format: "png"})}) | [Splash](${msg.guild.splashURL({size: 4096, format: "png"})}) | [Discovery](${msg.guild.discoverySplashURL({size: 4096, format: "png"})})`
        }else{
            if(msg.guild.splashURL() && msg.guild.discoverySplashURL()){
                imgs = `[Splash](${msg.guild.splashURL({size: 4096, format: "png"})}) | [Discovery](${msg.guild.discoverySplashURL({size: 4096, format: "png"})})`
            }else{
                if(msg.guild.bannerURL() && msg.guild.splashURL()){
                    imgs = `[Banner](${msg.guild.bannerURL({size: 4096, format: "png"})}) | [Splash](${msg.guild.splashURL({size: 4096, format: "png"})})`
                }else{
                    if(msg.guild.bannerURL() && msg.guild.discoverySplashURL()){
                        imgs = `[Banner](${msg.guild.bannerURL({size: 4096, format: "png"})}) | [Discovery](${msg.guild.discoverySplashURL({size: 4096, format: "png"})})`
                    }else{
                        if(msg.guild.bannerURL()){
                            imgs = `[Banner](${msg.guild.bannerURL({size: 4096, format: "png"})})`
                        }else{
                            if(msg.guild.splashURL()){
                                imgs = `[Splash](${msg.guild.splashURL({size: 4096, format: "png"})})`
                            }else{
                                if(msg.guild.discoverySplashURL()){
                                    imgs = `[Discovery](${msg.guild.discoverySplashURL({size: 4096, format: "png"})})`
                                }
                            }
                        }
                    }
                }
            }
        }


        let mgmc = msg.guild.members.cache
        let enlinea = mgmc.filter(fm => fm.presence?.status === "online" ).size
        let ausente = mgmc.filter(fm => fm.presence?.status === "idle").size
        let nomolestar = mgmc.filter(fm => fm.presence?.status === "dnd").size
        let todos = msg.guild.members.cache.size
        let bots = msg.guild.members.cache.filter(fb => fb.user.bot).size.toLocaleString()

        let chText = msg.guild.channels.cache.filter(t=>t.type==="GUILD_TEXT").size
        let chVoize = msg.guild.channels.cache.filter(v=>v.type==="GUILD_VOICE").size
        let chCategorie = msg.guild.channels.cache.filter(c=>c.type==="GUILD_CATEGORY").size
        
        const embServer = new Discord.MessageEmbed()
        .setThumbnail(msg.guild.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
        .setAuthor(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        .setImage(msg.guild.bannerURL({format: "png", size: 4096}))
        .setTitle("Informacion del servidor")
        .addFields(
            {name: "📃 **Descripcion:**", value: `${msg.guild.description !== null ? msg.guild.description: "Sin descripción"}`},
            {name: "🆔 **ID:**", value: `${msg.guild.id}`, inline: true},
            {name: "👑 **Propiedad de:**", value: `<@${msg.guild.ownerId}>`, inline: true},
            {name: `📅 **Creado:**`, value: `<t:${Math.floor(msg.guild.createdAt / 1000)}:R>`, inline: true},
            {name: `✅ **Verificado:**`, value: `${msg.guild.verified ? "Si": "No"}`, inline: true},
            {name: `<:DiscordPartner:920746109259898890> **Socio:**`, value: `${msg.guild.partnered ? "Si es socio": "No es socio"}`, inline: true},
            {name: `😃 **Emojis:** ${msg.guild.emojis.cache.size.toLocaleString()}`, value: `${msg.guild.emojis.cache.filter(n=> !n.animated).size.toLocaleString()} normales\n${msg.guild.emojis.cache.filter(a=> a.animated).size.toLocaleString()} animados`, inline: true},
            {name: `<:sticker:920136186687795262> **Stikers:**`, value: `${msg.guild.stickers.cache.size.toLocaleString()}`, inline: true},
            {name: "💈 **Roles:**", value: `${msg.guild.roles.cache.size}`, inline: true},
            {name: `✉ **Invitaciones creadas:**`, value: `${(await msg.guild.invites.fetch()).size.toLocaleString()}`, inline: true},
            {name: `⛔ **Baneos:**`, value: `${(await msg.guild.bans.fetch()).size.toLocaleString()}`, inline: true},
            {name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true},
            {name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true},
            {name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true},
            {name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true},
            {name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true},
            {name: `**Canales:** ${(chText+chVoize+chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()}`, inline: true},
            {name: `👥 **Miembros:** ${msg.guild.members.cache.size.toLocaleString()}`, value: `👤 ${mgmc.filter(u=> !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:904556872005222480> ${(enlinea+ausente+nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true},
            {name: `📋 **Características:** ${msg.guild.features.length}`, value: `${msg.guild.features.map(f=> feat[f]).join(" **|** ")}`, inline: false},
            {name: `\u200B`, value: `${imgs}`, inline: true},
        )
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServer]})
    }
    
    if(comando === "invite"){
        let invURL = "https://discord.com/oauth2/authorize?client_id=841531159778426910&scope=bot%20applications.commands&permissions=2147483647"
        const inv = new Discord.MessageEmbed()
        .setAuthor(`hola ${msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`[__**Invítame**__](${invURL}) a tu servidor.`)
        .setColor(colorEmb)
        .setTimestamp()
        
        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setLabel("Invítame")
            .setEmoji("🔗")
            .setStyle("LINK")
            .setURL(invURL)
        )

        msg.reply({allowedMentions: {repliedUser: false}, embeds: [inv], components: [row]})
    }

    // Generador de codigo QR
    if(comando === "qrcode" || comando === "QR" || comando === "qr"){
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
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Expulsar miembros o Banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("KICK_MEMBERS" || "BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            dt.delete()
        },60000))

        let mencion = msg.mentions.members.first()
        let razonM = args.join(" ").slice(22)

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
            if(msg.author.id === msg.guild.ownerId){
                const embErr0 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No he podido enviar la advertencia al usuario, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                .setColor(ColorError)
                .setTimestamp()

                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El usuario mencionado es un bot, no puedo advertir a un bot.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete()
                },60000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que quieres advertirte a ti mismo?, no puedo realizar la acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete()
                },60000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!razonM) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete()
                },60000))

                const embMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(mencion.user.displayAvatarURL({dynamic: true}))
                .setTitle("⚠ Usuario advertido")
                .setDescription(`👤 ${mencion}\n${mencion.user.tag}\n${mencion.id}\n\n📝 **razón:** ${razonM}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("#E5DA00")
                .setTimestamp()

                const embMDMencion = new Discord.MessageEmbed()
                .setAuthor(mencion.user.tag,mencion.user.displayAvatarURL({dynamic: true}))
                .setTitle("⚠ Has sido advertido")
                .setDescription(`📝 **Por la razón:**\n${razonM}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                .setColor("#E5DA00")
                .setFooter(`En el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                mencion.send({embeds: [embMDMencion]}).then(t=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})
                }).catch(c=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr0]}).then(tm=>setTimeout(()=>{
                        msg.delete().catch(cm=>{
                            return;
                        })
                        tm.delete()
                    },60000))
                })

            }else{
                const embErr0 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No he podido enviar la advertencia al usuario, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                .setColor(ColorError)
                .setTimestamp()

                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El usuario mencionado es un bot, no puedo advertir a un bot.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete()
                },60000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que quieres advertirte a ti mismo?, no puedo realizar la acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete()
                },60000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`Ese miembro es el dueño del servidor, no puedes advertir al dueño del servidor.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.id === msg.guild.ownerId) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete()
                },60000))

                const embErr4 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`Ese miembro tiene un rol igual o mayor al tuyo por lo tanto no lo puedo advertirlo.`)
                .setColor(ColorError)
                .setTimestamp()
                if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete()
                },60000))

                const embErr5 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!razonM) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr5]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete()
                },60000))

                const embMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(mencion.user.displayAvatarURL({dynamic: true}))
                .setTitle("⚠ Usuario advertido")
                .setDescription(`👤 ${mencion}\n${mencion.user.tag}\n${mencion.id}\n\n📝 **razón:** ${razonM}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("#E5DA00")
                .setTimestamp()

                const embMDMencion = new Discord.MessageEmbed()
                .setAuthor(mencion.user.tag,mencion.user.displayAvatarURL({dynamic: true}))
                .setTitle("⚠ Has sido advertido")
                .setDescription(`📝 **Por la razón:**\n${razonM}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                .setColor("#E5DA00")
                .setFooter(`En el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                mencion.send({embeds: [embMDMencion]}).then(t=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})
                }).catch(c=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr0]}).then(tm=>setTimeout(()=>{
                        msg.delete().catch(cm=>{
                            return;
                        })
                        tm.delete()
                    },60000))
                })
            }
        }else{
            const embErr1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El argumento proporcionado (${args[0]}) no se reconoce como una Mención o una ID de un miembro del servidor, proporciona una Mención o ID valida de un miembro del servidor.`)
            .setColor(ColorError)
            .setTimestamp()
            if(isNaN(args[0])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                dt.delete()
            },60000))

            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID ingresada no puede ser valida ya que contiene menos de 18 caracteres numéricos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(args[0].length < 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                dt.delete()
            },60000))

            const embErr3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID ingresada no puede ser valida ya que contiene mas de 18 caracteres numéricos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(args[0].length > 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                dt.delete()
            },60000))

            let razonID = args.join(" ").slice(18)
            let miembroID = msg.guild.members.cache.get(args[0])

            const embErr4 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID proporcionada no es de ningún miembro del servidor o es incorrecta, proporciona una ID de un miembro del servidor.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!miembroID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(dt => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                dt.delete()
            },60000))

            if(miembroID){
                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`Esa ID es de un bot, no puedes advertir a un bot.`)
                .setColor(ColorError)
                .setTimestamp()
                if(miembroID.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete()
                },60000))
    

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`Esa ID es tuya, ¿Por que quieres advertirte a ti mismo?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(miembroID.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete()
                },60000))

                if(msg.author.id === msg.guild.ownerId){
                    const embErr1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No he podido enviar la advertencia al usuario, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                    .setColor(ColorError)
                    .setTimestamp()

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete()
                    },60000))
    
                    const embID = new Discord.MessageEmbed()
                    .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembroID.user.displayAvatarURL({dynamic: true}))
                    .setTitle("⚠ Usuario advertido")
                    .setDescription(`👤 ${miembroID}\n${miembroID.user.tag}\n${miembroID.id}\n\n📝 **razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#E5DA00")
                    .setTimestamp()
    
                    const embMDID = new Discord.MessageEmbed()
                    .setAuthor(miembroID.user.tag,miembroID.user.displayAvatarURL({dynamic: true}))
                    .setTitle("⚠ Has sido advertido")
                    .setDescription(`📝 **Por la razón:**\n${razonID}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:** ${msg.author.id}`)
                    .setColor("#E5DA00")
                    .setFooter(`En el servidor ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    miembroID.send({embeds: [embMDID]}).then(tn=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embID]})
                    }).catch(ch=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(te=>setTimeout(()=>{
                            msg.delete().catch(cd=>{
                                return;
                            })
                            te.delete()
                        },60000))
                    })

                }else{
                    const embErr1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No he podido enviar la advertencia al usuario, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                    .setColor(ColorError)
                    .setTimestamp()

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es del dueño del servidor, no puedes advertir al dueño del servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(miembroID.id === msg.guild.ownerId) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete()
                    },60000))

                    const embErr3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es de un miembro con igual o mayor rol que tu por lo tanto no lo puedes advertir.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(miembroID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete()
                    },60000))


                    const embErr4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete()
                    },60000))

                    const embID = new Discord.MessageEmbed()
                    .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembroID.user.displayAvatarURL({dynamic: true}))
                    .setTitle("⚠ Usuario advertido")
                    .setDescription(`👤 ${miembroID}\n${miembroID.user.tag}\n${miembroID.id}\n\n📝 **razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#E5DA00")
                    .setTimestamp()

                    const embMDID = new Discord.MessageEmbed()
                    .setAuthor(miembroID.user.tag,miembroID.user.displayAvatarURL({dynamic: true}))
                    .setTitle("⚠ Has sido advertido")
                    .setDescription(`📝 **Por la razón:**\n${razonID}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:** ${msg.author.id}`)
                    .setColor("#E5DA00")
                    .setFooter(`En el servidor ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    miembroID.send({embeds: [embMDID]}).then(t=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embID]})
                    }).catch(c=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt=>setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete()
                        },60000))
                    })
                }
            }
        }
    }

    if(comando === "kick"){
        const embErr1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Expulsar miembros")
        .setTimestamp()
        if(!msg.member.permissions.has("KICK_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
            msg.delete().then(t=>{
                return;
            })
            dt.delete()
        },60000))

        const embErr2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Expulsar miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("KICK_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
            msg.delete().then(t=>{
                return;
            })
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
        let razonM = args.join(" ").slice(22)

        if(mencion){
            if(msg.author.id === msg.guild.ownerId){
                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No me puedo expulsar a mi mismo.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                    msg.delete().then(t=>{
                        return;
                    })
                    dt.delete()
                },60000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que te quieres expulsar de tu propio servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(msg.author.id === mencion.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete().then(t=>{
                        return;
                    })
                    dt.delete()
                },60000))

                if(!razonM){
                    razonM = "*no proporcionada*"
                }

                if(mencion.user.bot){
                    const embErrb1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese bot tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.guild.me.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrb1]}).then(dt => setTimeout(()=>{
                        msg.delete().then(t=>{
                            return;
                        })
                        dt.delete()
                    },60000))

                    const embedMencion = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Bot expulsado")
                    .setDescription(`🤖 ${mencion}\n${mencion.user.tag}\n${mencion.user.id}\n\n📝 **Razón:** ${razonM}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#F78701")
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embedMencion]})
                    mencion.kick(`Razón: ${razonM}`)

                }else{
                    const embErrb1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese miembro tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.guild.me.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrb1]}).then(dt => setTimeout(()=>{
                        msg.delete().then(t=>{
                            return;
                        })
                        dt.delete()
                    },60000))

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
                    mencion.send({embeds: [embMDMencion]}).catch(e=>{
                        return;
                    })
                    mencion.kick(`Razón: ${razonM}`)
                }
            }else{
                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No me puedo expulsar a mi mismo.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                    msg.delete().then(t=>{
                        return;
                    })
                    dt.delete()
                },60000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que quieres que te expulse de este increíble servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(msg.author.id === mencion.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete().then(t=>{
                        return;
                    })
                    dt.delete()
                },60000))

                if(!razonM){
                    razonM = "*no proporcionada*"
                }

                if(mencion.user.bot){
                    const embErrb1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese bot tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.guild.me.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrb1]}).then(dt => setTimeout(()=>{
                        msg.delete().then(t=>{
                            return;
                        })
                        dt.delete()
                    },60000))

                    const embErrb2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese bot tiene un rol igual o mayor que el tuyo por lo tanto no puedes expulsarlo.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrb2]}).then(dt => setTimeout(()=>{
                        msg.delete().then(t=>{
                            return;
                        })
                        dt.delete()
                    },60000))

                    const embedMencion = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Bot expulsado")
                    .setDescription(`🤖 ${mencion}\n${mencion.user.tag}\n${mencion.user.id}\n\n📝 **Razón:** ${razonM}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#F78701")
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embedMencion]})
                    mencion.kick(`Razón: ${razonM}`)

                }else{
                    const embErrb1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese miembro es el dueño del servidor, no lo puedes expulsar de su propio servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(mencion.id === msg.guild.ownerId) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrb1]}).then(dt => setTimeout(()=>{
                        msg.delete().then(t=>{
                            return;
                        })
                        dt.delete()
                    },60000))

                    const embErrb2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese miembro tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.guild.me.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrb2]}).then(dt => setTimeout(()=>{
                        msg.delete().then(t=>{
                            return;
                        })
                        dt.delete()
                    },60000))

                    const embErrb3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese miembro tiene un rol igual o mayor que el tuyo por lo tanto no puedes expulsarlo.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrb3]}).then(dt => setTimeout(()=>{
                        msg.delete().then(t=>{
                            return;
                        })
                        dt.delete()
                    },60000))

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
                    mencion.send({embeds: [embMDMencion]}).catch(e=>{
                        return;
                    })
                    mencion.kick(`Razón: ${razonM}`)
                }
            }
        }else{
            const embErr1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El argumento proporcionado no se reconoce como una mención o una ID de un miembro del servidor.`)
            .setColor(ColorError)
            .setTimestamp()
            if(isNaN(args[0])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                msg.delete().then(t=>{
                    return;
                })
                dt.delete()
            },60000))

            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID ingresada no puede ser valida ya que contiene menos de 18 caracteres numéricos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(args[0].length < 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                msg.delete().then(t=>{
                    return;
                })
                dt.delete()
            },60000))

            const embErr3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID ingresada no puede ser valida ya que contiene mas de 18 caracteres numéricos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(args[0].length > 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                msg.delete().then(t=>{
                    return;
                })
                dt.delete()
            },60000))

            let miembroID = msg.guild.members.cache.get(args[0])
            let razonID = args.join(" ").slice(18)

            const embErr4 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID proporcionada no corresponde a la de ningún miembro de este servidor, asegúrese de introducir una ID de un miembro del servidor.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!miembroID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(dt => setTimeout(()=>{
                msg.delete().then(t=>{
                    return;
                })
                dt.delete()
            },60000))

            if(miembroID){
                if(msg.author.id === msg.guild.ownerId){
                    const embErr1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es es tuya, ¿Por que quieres expulsarte de tu propio servidor?, no puedo realizar esa acción.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(miembroID.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                        msg.delete().then(t=>{
                            return;
                        })
                        dt.delete()
                    },60000))

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es mía, ¿Por que me quieres expulsar de tu increíble servidor?, *no puedo realizar esa acción.*`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(miembroID.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                        msg.delete().then(t=>{
                            return;
                        })
                        dt.delete()
                    },60000))

                    if(!razonID){
                        razonID = "*no proporcionada*"
                    }

                    if(miembroID.user.bot){
                        const embErrB1 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un bot con igual o mayor rol que yo por lo tanto no lo puedo expulsar del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.guild.me.roles.highest.comparePositionTo(miembroID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrB1]}).then(dt => setTimeout(()=>{
                            msg.delete().then(t=>{
                                return;
                            })
                            dt.delete()
                        },60000))

                        const embMiemIDB = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(miembroID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("<:salir12:879519859694776360> Bot expulsado")
                        .setDescription(`🤖 ${miembroID}\n${miembroID.user.tag}\n${miembroID.id}\n\n📝 **Razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#F78701")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMiemIDB]})
                        miembroID.kick(`Razón: ${razonID}`)

                    }else{
                        const embErrM1 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un miembro con igual o mayor rol que yo por lo tanto no lo puedo expulsar del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.guild.me.roles.highest.comparePositionTo(miembroID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM1]}).then(dt => setTimeout(()=>{
                            msg.delete().then(t=>{
                                return;
                            })
                            dt.delete()
                        },60000))

                        const embMiemID = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(miembroID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("<:salir12:879519859694776360> Usuario expulsado")
                        .setDescription(`👤 ${miembroID}\n${miembroID.user.tag}\n${miembroID.id}\n\n📝 **Razón:** ${razonID !== null ? razonID: "Sin razón"}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#F78701")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMiemID]})

                        const embMDID = new Discord.MessageEmbed()
                        .setAuthor(miembroID.user.tag,miembroID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("<:salir12:879519859694776360> Has sido expulsado")
                        .setDescription(`📝 **Por la razón:** ${razonID}\n\n👮 **Por el moderador:** ${msg.author}\n**ID:** ${msg.author.id}`)
                        .setColor("#F78701")
                        .setFooter(`Del el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        miembroID.send({embeds: [embMDID]}).catch(dm=>{
                            return;
                        })
                        miembroID.kick(`Razón: ${razonID}`)
                    }
                }else{
                    const embErr1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es es tuya, ¿Por que quieres que te expulse de este increíble servidor?, *no puedo realizar esa acción.*`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(miembroID.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                        msg.delete().then(t=>{
                            return;
                        })
                        dt.delete()
                    },60000))

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es mía, ¿Por que me quieres expulsar de este increíble servidor?, *no puedo realizar esa acción.*`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(miembroID.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                        msg.delete().then(t=>{
                            return;
                        })
                        dt.delete()
                    },60000))

                    if(!razonID){
                        razonID = "*no proporcionada*"
                    }

                    if(miembroID.user.bot){
                        const embErrB1 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un bot con igual o mayor rol que yo por lo tanto no lo puedo expulsar del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.guild.me.roles.highest.comparePositionTo(miembroID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrB1]}).then(dt => setTimeout(()=>{
                            msg.delete().then(t=>{
                                return;
                            })
                            dt.delete()
                        },60000))

                        const embErrB2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un bot con igual o mayor rol que el tuyo por lo tanto no lo puedes expulsar del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(miembroID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrB2]}).then(dt => setTimeout(()=>{
                            msg.delete().then(t=>{
                                return;
                            })
                            dt.delete()
                        },60000))

                        const embMiemIDB = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(miembroID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("<:salir12:879519859694776360> Bot expulsado")
                        .setDescription(`🤖 ${miembroID}\n${miembroID.user.tag}\n${miembroID.id}\n\n📝 **Razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#F78701")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMiemIDB]})
                        miembroID.kick(`Razón: ${razonID}`)

                    }else{
                        const embErrM1 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de el dueño del servidor, no puedes expulsar al dueño del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(miembroID.id === msg.guild.ownerId) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM1]}).then(dt => setTimeout(()=>{
                            msg.delete().then(t=>{
                                return;
                            })
                            dt.delete()
                        },60000))

                        const embErrM2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un miembro con igual o mayor rol que yo por lo tanto no lo puedo expulsar del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.guild.me.roles.highest.comparePositionTo(miembroID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM2]}).then(dt => setTimeout(()=>{
                            msg.delete().then(t=>{
                                return;
                            })
                            dt.delete()
                        },60000))

                        const embErrM3 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un miembro con igual o mayor rol que tu por lo tanto no lo puedes expulsar del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(miembroID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM3]}).then(dt => setTimeout(()=>{
                            msg.delete().then(t=>{
                                return;
                            })
                            dt.delete()
                        },60000))

                        const embMiemID = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(miembroID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("<:salir12:879519859694776360> Usuario expulsado")
                        .setDescription(`👤 ${miembroID}\n${miembroID.user.tag}\n${miembroID.id}\n\n📝 **Razón:** ${razonID !== null ? razonID: "Sin razón"}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#F78701")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMiemID]})

                        const embMDID = new Discord.MessageEmbed()
                        .setAuthor(miembroID.user.tag,miembroID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("<:salir12:879519859694776360> Has sido expulsado")
                        .setDescription(`📝 **Por la razón:** ${razonID}\n\n👮 **Por el moderador:** ${msg.author}\n**ID:** ${msg.author.id}`)
                        .setColor("#F78701")
                        .setFooter(`Del el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        miembroID.send({embeds: [embMDID]}).catch(dm=>{
                            return;
                        })
                        miembroID.kick(`Razón: ${razonID}`)
                    }
                }
            }
        }
    }

    if(comando === "ban"){
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso de Banear miembros")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=> {
            msg.delete().catch(c=>{
                return;
            })
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes el permiso requerido para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Banear miembros")
        .setTimestamp()
        if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=> {
            msg.delete().catch(c=>{
                return;
            })
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
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let mencion = msg.mentions.members.first()
        let razonMe = args.join(" ").slice(22)

        if(mencion){
            if(msg.author.id === msg.guild.ownerId){
                const embErrM1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que me quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.user.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM1]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const embErrM2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que te quieres banear de tu propio servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.user.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM2]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    tm.delete()
                },60000))


                if(mencion.user.bot){
                    const embErrM3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese bot tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.guild.me.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM3]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErrM4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM4]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embMencion = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(mencion.user.displayAvatarURL({dynamic: true}))
                    .setTitle("⛔ Bot baneado")
                    .setDescription(`🤖 ${mencion}\n${mencion.user.tag}\n${mencion.user.id}\n\n📝 **Razón:** ${razonMe}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#ff0000")
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})
                    mencion.ban({reason: `Razón: ${razonMe} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`})
    
                }else{
                    const embErrM3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese miembro tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.guild.me.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM3]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErrM4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM4]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

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
                    mencion.ban({reason: `Razón: ${razonMe} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`})
                }
            }else{
                const embErrM1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que me quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.user.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM1]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const embErrM2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que te quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.user.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM2]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    tm.delete()
                },60000))

                if(mencion.user.bot){
                    const embErrM2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese bot tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.guild.me.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM2]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErrM3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No puedes banear a un bot con el mismo rol o mayor que tu.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM3]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))


                    const embErrM4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM4]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embMencion = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(mencion.user.displayAvatarURL({dynamic: true}))
                    .setTitle("⛔ Bot baneado")
                    .setDescription(`🤖 ${mencion}\n${mencion.user.tag}\n${mencion.user.id}\n\n📝 **Razón:** ${razonMe}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#ff0000")
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})
                    mencion.ban({reason: `Razón: ${razonMe} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`})
    
                }else{
                    const embErrM1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No puedes banear al dueño del servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(mencion.id === msg.guild.ownerId) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM1]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErrM2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No puedes banear a un usuario con el mismo rol o mayor que tu.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM2]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErrM3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese miembro tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.guild.me.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM3]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErrM4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM4]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

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
                    mencion.ban({reason: `Razón: ${razonMe} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`})
                
                }
            }
        }else{
            const embErrID1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El argumento proporcionado no es un mención ni una ID.`)
            .setColor(ColorError)
            .setTimestamp()
            if(isNaN(args[0])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                tm.delete()
            },60000))

            const embErrID2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID ingresada no puede ser valida ya que contiene menos de 18 caracteres numéricos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(args[0].length < 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                tm.delete()
            },60000))

            const embErrID3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID ingresada no puede ser valida ya que contiene mas de 18 caracteres numéricos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(args[0].length > 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID3]}).then(tm => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                tm.delete()
            },60000))

            let userID = msg.guild.members.cache.get(args[0])
            let razonID = args.join(" ").slice(18)
            if(userID){
                if(msg.author.id === msg.guild.ownerId){
                    const embErrID1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es mia, ¿Por que me quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(userID.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID1]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErrID2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es tuya, ¿Por que te quieres banear de tu propio servidor?, no puedo realizar esa acción.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(userID.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID2]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))


                    if(userID.user.bot){
                        const embErr1 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un bot con igual o mayor rol que yo por lo tanto no lo puedo banear.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.guild.me.roles.highest.comparePositionTo(userID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete()
                        },60000))

                        const embErr2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete()
                        },60000))

                        const embID = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(userID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("⛔ Bot baneado")
                        .setDescription(`🤖 ${userID}\n${userID.user.tag}\n${userID.id}\n\n📝 **Razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embID]})
                        msg.guild.members.ban(userID.id, {reason: `Razón: ${razonID} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`})

                    }else{
                        const embErr1 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un miembro con igual o mayor rol que yo por lo tanto no lo puedo banear.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.guild.me.roles.highest.comparePositionTo(userID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete()
                        },60000))

                        const embErr2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete()
                        },60000))

                        const embID = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(userID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("⛔ Usuario baneado")
                        .setDescription(`👤 ${userID}\n${userID.user.tag}\n${userID.id}\n\n📝 **Razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embID]})

                        const embIDMD = new Discord.MessageEmbed()
                        .setAuthor(userID.user.tag,userID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("⛔ Has sido baneado")
                        .setDescription(`📝 **Por la razón:** ${razonID}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:** ${msg.author.id}`)
                        .setColor("#ff0000")
                        .setFooter(`Del servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        userID.send({embeds: [embIDMD]}).catch(dm=>{
                            return;
                        })
                        msg.guild.members.ban(userID.id, {reason: `Razón: ${razonID} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`})
                    }

                }else{
                    const embErrID1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es mia, ¿Por que me quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(userID.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID1]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErrID2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es tuya, ¿Por que te quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(userID.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID2]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete()
                    },60000))


                    if(userID.user.bot){
                        const embErr1 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un bot con igual o mayor rol que yo por lo tanto no lo puedo banear.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.guild.me.roles.highest.comparePositionTo(userID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete()
                        },60000))

                        const embErr2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un bot con igual o mayor rol que tu por lo tanto no lo puedo banear.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(userID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete()
                        },60000))

                        const embErr3 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete()
                        },60000))

                        const embID = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(userID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("⛔ Bot baneado")
                        .setDescription(`🤖 ${userID}\n${userID.user.tag}\n${userID.id}\n\n📝 **Razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embID]})
                        msg.guild.members.ban(userID.id, {reason: `Razón: ${razonID} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`})

                    }else{
                        const embErr1 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de el dueño del servidor, no puedes banear al dueño del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(userID.id === msg.guild.ownerId) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete()
                        },60000))

                        const embErr2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un miembro con igual o mayor rol que yo por lo tanto no lo puedo banear.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.guild.me.roles.highest.comparePositionTo(userID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                        },60000))

                        const embErr3 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un miembro con igual o mayor rol que tu por lo tanto no lo puedo banear.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(userID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete()
                        },60000))

                        const embErr4 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete()
                        },60000))

                        const embID = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(userID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("⛔ Usuario baneado")
                        .setDescription(`👤 ${userID}\n${userID.user.tag}\n${userID.id}\n\n📝 **Razón:** ${razonID}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embID]})

                        const embIDMD = new Discord.MessageEmbed()
                        .setAuthor(userID.user.tag,userID.user.displayAvatarURL({dynamic: true}))
                        .setTitle("⛔ Has sido baneado")
                        .setDescription(`📝 **Por la razón:** ${razonID}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:** ${msg.author.id}`)
                        .setColor("#ff0000")
                        .setFooter(`Del servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        userID.send({embeds: [embIDMD]}).catch(dm=>{
                            return;
                        })
                        msg.guild.members.ban(userID.id, {reason: `Razón: ${razonID} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`})
                    }
                }
            }else{
                let usuarioID = await client.users.fetch(args[0])
                if(usuarioID){
                    const embErr1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón para el baneo.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(mbt => setTimeout(()=>{
                        msg.delete().catch(dm=>{
                            return;
                        })
                        mbt.delete()
                    },40000));

                    if(usuarioID.bot){
                        const embedg = new Discord.MessageEmbed()
                        .setAuthor(msg.author.username,msg.author.displayAvatarURL())
                        .setThumbnail(usuarioID.displayAvatarURL({dynamic: true}))
                        .setTitle("❌ Bot externo baneado")
                        .setDescription(`🤖 **Bot:** ${usuarioID.tag}\n**ID:** ${usuarioID.id}\n\n📑 **Razon:** ${razonID}\n\n👮 **Moderador:** ${msg.author}`)
                        .setFooter(client.user.username,client.user.displayAvatarURL())
                        .setColor("#ff0000")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embedg]})

                        msg.guild.members.ban(usuarioID.id,{reason: `Razon: ${razonID}  | Moderador: ${msg.author.username}  | Fecha: ${msg.createdAt.toLocaleTimeString()}`})

                    
                    }else{
                        const embedg = new Discord.MessageEmbed()
                        .setAuthor(msg.author.username,msg.author.displayAvatarURL())
                        .setThumbnail(usuarioID.displayAvatarURL({dynamic: true}))
                        .setTitle("❌ Usuario externo baneado")
                        .setDescription(`👤 **Usuario:** ${usuarioID}\n**ID:** ${usuarioID.id}\n\n📑 **Razon:** ${razonID}\n\n👮 **Moderador:** ${msg.author}`)
                        .setFooter(client.user.username,client.user.displayAvatarURL())
                        .setColor("#ff0000")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embedg]})

                        msg.guild.members.ban(usuarioID.id,{reason: `Razon: ${razonID}  | Moderador: ${msg.author.username}  | Fecha: ${msg.createdAt.toLocaleTimeString()}`})
                    }
                }
            }
        }
    }

    // unban
    if(comando === "unban"){
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso de Banear miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().then(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso de Banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().then(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embErrP3 = new Discord.MessageEmbed()
        .setTitle("📄")
        .setDescription(`No se ha encontrado ningún miembro baneado en este servidor.`)
        .setColor(colorEmbInfo)
        .setTimestamp()
        if((await msg.guild.bans.fetch()).size === 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP3]}).then(tm => setTimeout(()=>{
            msg.delete().then(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando unban")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.unban <ID del usuario baneado>${"``"}`},
            {name: "Ejemplo:", value: `ss.unban ${(await msg.guild.bans.fetch()).map(mb => mb.user.id).slice(0,1)}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let usuario = await client.users.fetch(args[0])

        const embErrP4 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`Ese usuario no esta baneado en este servidor o no introdujiste bien su ID.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!(await msg.guild.bans.fetch()).find(fb => fb.user.id === args[0])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP4]}).then(tm => setTimeout(()=>{
            msg.delete().then(t=>{
                return;
            })
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
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar mensajes .")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_MESSAGES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().then(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar mensajes .")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_MESSAGES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().then(t=>{
                return;
            })
            tm.delete()
        },60000))

        let algo = args[0]

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando clear")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.clear <Cantidad>${"``"}`},
            {name: "Ejemplo:", value: `ss.clear ${Math.round(Math.random(1)*100)}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!algo) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        const embErr1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`Has introducido un valor no numérico, introduce un valor numérico.`)
        .setColor(ColorError)
        .setTimestamp()
        if(isNaN(algo)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
            msg.delete().then(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embErr2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`Introduce un valor mayor a 1`)
        .setColor(ColorError)
        .setTimestamp()
        if(algo <= 2) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
            msg.delete().then(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embErr3 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`Has introducido un valor mayor a 100, el máximo de mensajes que puedo eliminar es de 100, introduce un valor igual o menor a 100.`)
        .setColor(ColorError)
        .setTimestamp()
        if(algo > 100) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
            msg.delete().then(t=>{
                return;
            })
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
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Banear miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete()
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
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
        .setColor(colorEmb)
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
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero de uno de los siguientes permisos: Gestionar mensajes, Expulsar miembros o Banear miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_MESSAGES" || "KICK_MEMBERS" || "BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres de uno de estos permisos: Gestionar mensajes, Expulsar miembros o Banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_MESSAGES" || "KICK_MEMBERS" || "BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
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

        let mensajeMe = args.join(" ").slice(22)

        if(mencionUs){
            const embErr1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`No pude enviar el mensaje directo al usuario, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
            .setColor(ColorError)
            .setTimestamp()

            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El miembro mencionado soy yo, ¿Por que me quieres enviar un mensaje?, de nada serviría, no puedo realizar la acción.`)
            .setColor(ColorError)
            .setTimestamp()
            if(mencionUs.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete()
            },60000))

            const embErr3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El miembro mencionado es un bot, no puedo enviar un mensaje directo a un bot.`)
            .setColor(ColorError)
            .setTimestamp()
            if(mencionUs.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete()
            },60000))

            const embErr4 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`¿Para que quieres que te envié un mensaje creado por ti?, no puedo realizar esa acción.`)
            .setColor(ColorError)
            .setTimestamp()
            if(mencionUs.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete()
            },60000))

            const embErr5 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`No has proporcionado el mensaje a enviar, proporciona el mensaje que enviare el usuario.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!mensajeMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr5]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete()
            },60000))

            const emdSendDM = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail(mencionUs.user.displayAvatarURL({dynamic: true}))
            .setTitle("📤 Mensaje enviado al usuario")
            .setDescription(`👤 ${mencionUs}\n**ID:** ${mencionUs.id}\n\n📝 **Mensaje:** ${mensajeMe}\n\n👮 **Enviado por:** ${msg.author}\n**ID:** ${msg.author.id}`)
            .setColor(colorEmb)
            .setTimestamp()
        
            const embMDSend = new Discord.MessageEmbed()
            .setAuthor(mencionUs.user.tag,mencionUs.user.displayAvatarURL({dynamic: true}))
            .setTitle("📥 Mensaje entrante")
            .setDescription(`📝 **Mensaje:** ${mensajeMe}\n\n👮 **Enviado por:** ${msg.author.tag}\n**ID:** ${msg.author.id}`)
            .setColor(colorEmb)
            .setFooter(`Desde el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            mencionUs.send({embeds: [embMDSend]}).then(tm =>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [emdSendDM]})
            }).catch(t=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete()
                },60000))
            })
        }
        if(args[0]){
            let usuarioID = msg.guild.members.cache.get(args[0])
            let mensajeID = args.join(" ").slice(18)

            if(usuarioID){
                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No pude enviar el mensaje directo al usuario, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                .setColor(ColorError)
                .setTimestamp()


                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`La ID proporcionada es mía, ¿Por que me quieres enviar un mensaje?, de nada serviría, no puedo realizar la acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(usuarioID.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`La ID proporcionada es la de un bot, no puedo enviar un mensaje directo a un bot.`)
                .setColor(ColorError)
                .setTimestamp()
                if(usuarioID.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const embErr4 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Para que quieres que te envié un mensaje creado por ti?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(usuarioID.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const embErr5 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No has proporcionado el mensaje a enviar, proporciona el mensaje que enviare el usuario.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!mensajeID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr5]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const emdSendDM = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(usuarioID.user.displayAvatarURL({dynamic: true}))
                .setTitle("📤 Mensaje enviado al usuario")
                .setDescription(`👤 ${usuarioID}\n**ID:** ${usuarioID.id}\n\n📝 **Mensaje:** ${mensajeID}\n\n👮 **Enviado por:** ${msg.author}\n**ID:** ${msg.author.id}`)
                .setColor(colorEmb)
                .setTimestamp()
            
                const embMDSend = new Discord.MessageEmbed()
                .setAuthor(usuarioID.user.tag,usuarioID.user.displayAvatarURL({dynamic: true}))
                .setTitle("📥 Mensaje entrante")
                .setDescription(`📝 **Mensaje:** ${mensajeID}\n\n👮 **Enviado por:** ${msg.author.tag}\n**ID:** ${msg.author.id}`)
                .setColor(colorEmb)
                .setFooter(`Desde el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                usuarioID.send({embeds: [embMDSend]}).then(tm =>{
                  msg.reply({allowedMentions: {repliedUser: false}, embeds: [emdSendDM]})
                }).catch(ct =>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete()
                    },60000))
                })
            }
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
            msg.delete().catch(t=>{
                return;
            })
            tt.delete()
        },60000))

        const embErrMiem = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`Tu servidor no cuenta con el mínimo de 100 miembros necesarios para poder usar el sistema de Inter Promoción.`)
        .setColor(ColorError)
        .setTimestamp()
        if(msg.guild.members.cache.filter(f=> !f.user.bot).size < 100) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiem]}).then(tt => setTimeout(()=> {
            msg.delete().catch(t=>{
                return;
            })
            tt.delete()
        },60000))


        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando setInterP")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.setInterP <Mención del canal>${"``"}\n${"``"}ss.setInterP <ID del canal>${"``"}`},
            {name: "Ejemplos:", value: `ss.setInterP ${msg.channel}\nss.setInterP ${msg.channelId}`}
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
                msg.delete().catch(t=>{
                    return;
                })
                tt.delete()
            },60000))

            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El canal proporcionado no es de tipo texto, proporciona un canal de tipo texto.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!canal.isText()) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tt => setTimeout(()=> {
                msg.delete().catch(t=>{
                    return;
                })
                tt.delete()
            },60000))

            const embErr3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`No tengo los permisos suficientes en ese canal.`)
            .setColor(ColorError)
            .setTimestamp()
            .setFooter("Permisos requeridos: Crear invitación, Gestionar mensajes, Gestionar canal.")
            if(!msg.guild.me.permissionsIn(canal).has(["CREATE_INSTANT_INVITE","MANAGE_MESSAGES","MANAGE_CHANNELS"])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tt => setTimeout(()=> {
                msg.delete().catch(t=>{
                    return;
                })
                tt.delete()
            },60000))

            canal.setRateLimitPerUser(8*60, "El modo pausado de 8m es necesario para el Sistema de Inter promoción para evitar flood")
            canal.createInvite({maxAge: 0, reason: "Importante para el sistema de Inter promoción."}).then(ti=> client.channels.cache.get("850189144826052648").send(`${ti}`))

            const embMDCre = new Discord.MessageEmbed()
            .setAuthor(`${msg.author.tag} - ID: ${msg.author.id}`,msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail(msg.guild.iconURL({dynamic: true}))
            .setTitle("Nuevo canal agregado a Inter promoción")
            .addFields(
                {name: "**Servidor:**", value: `${msg.guild.name}\n**ID:** ${msg.guildId}\n👥 ${msg.guild.members.cache.size}`},
                {name: "**Canal:**", value: `${msg.channel}\n${msg.channel.name}\n**ID:** ${msg.channelId}\n**Permisos:** ${msg.guild.me.permissionsIn(canal).toArray().length}`}
            )
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(client.user.tag,client.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            client.channels.cache.get("850189144826052648").send({content: `${creadoresID.map(c=> `<@${c}>`).join(" **|** ")}`, embeds: [embMDCre]})
            

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
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInf]})
    }

    // addrol
    let roles = msg.guild.roles.cache.filter(fr => !fr.managed).map(mr => mr)
    let random = Math.floor(Math.random()* roles.length)
    let rolesParaID = msg.guild.roles.cache.filter(fr => !fr.managed).map(mr => mr.id)
    let randomRID = Math.floor(Math.random()* rolesParaID.length)

    if(comando === "addrol" || comando === "addr"){
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_ROLES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_ROLES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
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
            .setDescription(`No has mencionado o proporcionado la ID del rol a dar.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!args[1]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
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
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El el miembro ya tiene ese rol.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El rol mencionado es exclusivo para un bot, no se le puede agregar a ningún miembro.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolParaAdd.managed) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const embErr4 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setTitle("No se pudo ejecutar el comando.")
                .addField("Razón:", `Has intentado dar un rol igual o mayor que tu rol mas alto al miembro mencionado, no puedo hacer eso.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolParaAdd.comparePositionTo(msg.member.roles.highest) >= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
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
                .setAuthor("❌ Error")
                .setDescription(`No has mencionado o proporcionado la ID del rol a dar.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!args[1]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
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
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`El el miembro ya tiene ese rol.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErr3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese rol es exclusivo para un bot, no se le puede agregar a ningún miembro.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(rolParaAdd.managed) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErr4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setTitle("No se pudo ejecutar el comando.")
                    .addField("Razón:", `Has intentado dar un rol igual o mayor que tu rol mas alto al miembro mencionado, no puedo hacer eso.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(rolParaAdd.comparePositionTo(msg.member.roles.highest) >= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
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
    if(comando === "removeRol" || comando === "removerol" || comando === "rmr"){
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_ROLES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_ROLES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete()
        },60000))
        msg.guild.ownerId

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando removeRol")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.removeRol <Mencion del miembro> <Mencion del rol>${"``"}\n${"``"}ss.removeRol <ID del miembro> <ID del rol>${"``"}`},
            {name: "Ejemplos:", value: `ss.removeRol ${msg.author} ${roles[random]}\nss.removeRol ${msg.author} ${rolesParaID[randomRID]}\nss.removeRol ${msg.author.id} ${rolesParaID[randomRID]}\nss.removeRol ${msg.author.id} ${roles[random]}`}
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
                msg.delete().catch(t=>{
                    return;
                })
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
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El el miembro no tiene ese rol.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El rol mencionado es exclusivo para un bot, no lo puedo remover de ningún miembro.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolParaAdd.managed) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete()
                },60000))

                const embErr4 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setTitle("No se pudo ejecutar el comando.")
                .addField("Razón:", `Has intentado remover un rol igual o mayor que tu rol mas alto al miembro mencionado, no puedo hacer eso.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolParaAdd.comparePositionTo(msg.member.roles.highest) >= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
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
                    msg.delete().catch(t=>{
                        return;
                    })
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
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`El el miembro no tiene ese rol.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErr3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`El rol mencionado es exclusivo para un bot, no se le puede agregar a ningún miembro.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(rolParaAdd.managed) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete()
                    },60000))

                    const embErr4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setTitle("No se pudo ejecutar el comando.")
                    .addField("Razón:", `Has intentado remover un rol mayor o igual que tu rol mas alto del miembro, no puedo hacer eso.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(rolParaAdd.comparePositionTo(msg.member.roles.highest) >= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
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
    if(comando === "createCha" || comando === "createcha"  || comando === "crech"){
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
            msg.delete().catch(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar canales.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_CHANNELS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
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
    if(comando == "deleteCha" || comando == "deletecha" || comando === "delch"){
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
            msg.delete().catch(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar canales.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_CHANNELS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete()
        },60000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando deleteCha")
        .addFields(
            {name: "Uso:", value: `${"``"}ss.deleteCha <Mencion del canal>${"``"}\n${"``"}ss.deleteCha <ID del canal>${"``"}`},
            {name: "Ejemplos:", value: `ss.deleteCha ${canalesAlDel[randomChanne]}\nss.deleteCha ${canalesAlDel[randomChanne].id}`}
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
        if(creadoresID.some(s=>s === msg.author.id)){
            let canalID = client.channels.cache.get(args[0])
            if(!canalID) return msg.reply({allowedMentions: {repliedUser: false}, content: "No se ha encontrado el canal o la ID es incorecta."})
            canalID.createInvite({maxAge: 0, reason: "Importante para el sistema de Inter promoción."}).then(tt => msg.channel.send(`${tt}`))
        }
    }

    if(comando === "infoSv"){
        if(creadoresID.some(sc => sc === msg.author.id)){
            let servidor = client.guilds.cache.get(args[0])
            if(!servidor) return msg.reply({allowedMentions: { repliedUser: false}, content: "No se pudo encontrar o proporcionar informacion de ese servidor."})
            let inURL = (await servidor.invites.fetch()).map(mi => mi.url).slice(0,1)
            if(inURL.length <= 0){
                inURL = "No pude proporcionar una invitación."
            }

            let perm = servidor.me.permissions

            let permisos = `${perm.toArray(p=>p).length}\n${perm.toArray(p=>p).join(" **|** ")}`
            if(permisos.length <= 0){
                permisos = "No puedo proporcionar permisos de ese servidor"
            }

            const emb = new Discord.MessageEmbed()
            .setAuthor(servidor.members.cache.get(servidor.ownerId).user.tag,servidor.members.cache.get(servidor.ownerId).user.displayAvatarURL({dynamic: true}))
            .setThumbnail(servidor.iconURL({dynamic: true}))
            .setTitle(`${servidor.name}`)
            .setDescription(`Miembros: ${servidor.members.cache.size}\nPermisos: ${permisos}`)
            .setColor(servidor.me.displayHexColor)
            .setFooter(`${servidor.name} • Miembros: ${servidor.members.cache.size}`)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [emb], content: `${inURL}`})
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

// Registro de nuevo servidor 
client.on("guildCreate", async gc => {
    let creador = gc.members.cache.get(gc.ownerId)
    let url = (await gc.invites.fetch()).map(mi => mi.url).slice(0,1)
    let invitacion
    if(url){
        invitacion = `[Unirse](${url})`
    }
    if(!url){
        invitacion = "El servidor no tiene invitaciones."
    }
    const embGC = new Discord.MessageEmbed()
    .setAuthor(creador.user.tag,creador.user.displayAvatarURL({dynamic: true}))
    .setThumbnail(gc.iconURL({dynamic: true}))
    .setTitle("➕ Añadido en un nuevo servidor")
    .addFields(
        {name: `**${gc.name}**`, value: `🆔 ${gc.id}\n👥 ${gc.members.cache.filter(fm => !fm.user.bot).size}\n🤖 ${gc.members.cache.filter(fb => fb.user.bot).size}\n📅 <t:${Math.round(gc.createdAt / 1000)}:R>\n${invitacion}`},
        {name: "Baneos", value: `${(await gc.bans.fetch()).size}`}
    )
    .setColor()
    .setTimestamp()
    client.channels.cache.get("838457311684853827").send({embeds: [embGC]})
})






client.login(token);