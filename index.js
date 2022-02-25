const Discord = require("discord.js");
const intents = new Discord.Intents();
const client = new Discord.Client({intents: 32767, ws:{properties:{$browser: "Discord Android"}}});

const config = require("./config.json")
const token = config.tokenSSBot
const ms = require("ms")
const mongoose = require("mongoose")

const creadorID = "717420870267830382"
const creadoresID = ["717420870267830382","825186118050775052"]
const colorEmb = "#060606"
const colorEmbInfo = "#ffffff"
const ColorError = "#ff0000"

mongoose.connect("mongodb+srv://Music:oQJo4VnF3rXj615k@ssbot.jbt17.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Conectado corectamente a la base de datos.")
}).catch(e=>{
    console.log("Ocurrio un error al conectarse con la DB", e)
})

// // Sistema de inter promocion
const interPromocion = new mongoose.Schema({
    Nombre: {
        type: String,
        required: true
    },
    canalID: {
        type: Array,
        required: true
    },
    autor: {
        type: Array,
        required: true
    },
    serverID: {
        type: Array,
        required: true
    }
})
const interP = mongoose.model("Inter promo", interPromocion)


// // Prefijo configurable
const confPrefijo = new mongoose.Schema({
    Nombre: {
        type: String,
        required: true
    },
    serverID: {
        type: Array,
        required: true
    },
    prefijo: {
        type: Array,
        required: true
    }
})
const mPrefix = mongoose.model("Prefijo", confPrefijo)


// // Sistema de puntos
// Sistema de puntos
const puntosMongo = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    serverName: {
        type: String,
        required: true
    },
    emoji: {
        type: String,
        required: true
    },
    sistema: {
        type: Array,
        required: true
    }
})
const sPuntos = mongoose.model("Sistema de puntos", puntosMongo) 


client.on("ready",async () => {
    console.log(client.user.username, "Hola, estoy listo")
    const embReady = new Discord.MessageEmbed()
    .setTitle("<a:si:929138357940944977> Estoy conectado")
    .setColor("00ff00")
    .setTimestamp()
    client.channels.cache.get("922546474896752651").send({embeds: [embReady]})

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
    },60000)
})

let cooldInterP = []
// sistema Inter promocion
client.on("messageCreate", async msg =>{
    if(msg.author.bot) return;
    let dataIP = await interP.findOne({Nombre: "Inter promocion"})
    let canales = []

    for(let i=0; i<dataIP.canalID.length; i++){
        if(client.channels.cache.get(dataIP.canalID[i])){
            canales.push(dataIP.canalID[i])
        }
    }
    
    if(canales.some(ch => ch === msg.channel.id)){
        const embCool = new Discord.MessageEmbed()
        .setAuthor("⏲ Tiempo")
        .setDescription(`Espera **40** minutos para bolver a publicara tu promoción.`)
        .setColor("BLUE")
        .setTimestamp()
        if(cooldInterP.some(s=> s === msg.author.id) && !creadoresID.some(s=>s === msg.author.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embCool]}).then(mt=> setTimeout(()=>{
            msg.delete().catch(c=>{
                return
            })
            mt.delete().catch(c=>{
                return
            })
        },15000))

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

        cooldInterP.push(msg.author.id)
        setTimeout(()=>{
            let num = cooldInterP.indexOf(msg.author.id)
            cooldInterP.splice(num,1)
        },ms(`40m`))
    }
})


client.on("messageCreate", async msg => {
    if(msg.author.bot)return;

    let dataPre = await mPrefix.findOne({Nombre: "Prefijos"})
    let num = dataPre.serverID.indexOf(msg.guildId)
    let pref = dataPre.prefijo[num] ? dataPre.prefijo[num]: "ss."


    if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
    if(msg.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
        const emb = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`Hola, soy **${client.user.username}** un Bot multi fundacional, tengo comandos de moderación, comandos informativos y mas tipos de comandos.`)
        .setDescription(`**Mi prefijo en este servidor:** ${"``"}${pref}${"``"}\n**Invitame:** [*Clic aquí*](https://discord.com/oauth2/authorize?client_id=841531159778426910&scope=bot%20applications.commands&permissions=2147483647)\n**Usa el comando** ${"``"}${pref}help${"``"} para conocer mas de mi.`)
        .setColor(colorEmb)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.reply({embeds: [emb]})
    }    
})


client.on("messageCreate", async msg => {
    if(msg.author.bot) return; 

    let dataPre = await mPrefix.findOne({Nombre: "Prefijos"})
    let num = dataPre.serverID.indexOf(msg.guildId)
    let prefijo = dataPre.prefijo[num] ? dataPre.prefijo[num]: "ss."


    if(!msg.content.startsWith(prefijo)) return; 

    const args = msg.content.slice(prefijo.length).trim().split(/ +/g);
    const comando = args.shift()


    if(comando === "help"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const help = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL())
        .setDescription(`**Mi prefijo en este servidor:** ${"``"}${prefijo}${"``"}\n\n**Comandos principales:**\n${"``"}${prefijo}comandos${"``"} **|** Te muestra todos los comandos.\n${"``"}${prefijo}botInfo${"``"} **|** Te muestra información del bot.`)
        .setColor(colorEmb)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [help]})
    }

    if(comando === "comandos" || comando == "commands"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const comandos = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("📑 Comandos")
        .addField("\u200B","\u200B")
        .setDescription(`Un comando es una palabra a la que el bot responde.`)
        .addField("🌎 **Comandos generales:**",`Comandos que todos pueden usar.\n\n${"``"}${prefijo}user${"``"} **|** Muestra información del usuario.\n${"``"}${prefijo}stats${"``"} **|** Muestra estadisticas generales de todos los servidores.\n${"``"}${prefijo}jumbo${"``"} **|** Muestra en grande un emoji del servidor.\n${"``"}${prefijo}emojis${"``"} **|** Muestra todos los emojis del servidor.\n${"``"}${prefijo}uptime${"``"} **|** Muestra el tiempo que llevo activo o encendido.\n${"``"}${prefijo}avatar${"``"} **|** Muestra el avatar del usuario.\n${"``"}${prefijo}server${"``"} **|** Muestra información del servidor.\n${"``"}${prefijo}invite${"``"} **|** Te muestra la invitación del bot.\n${"``"}${prefijo}qrcode${"``"} **|** Genera un código QR de un enlace.\n${"``"}${prefijo}stikers${"``"} **|** Te muestra todos los stikers del servidor.\n${"``"}${prefijo}botInfo${"``"} **|** Te muestra información del bot.`)
        .addField("\u200B", "\u200B")
        .addField("👮 **Comandos de moderacion:**",`Comandos que solo los moderadores pueden usar.\n\n${"``"}${prefijo}warn${"``"} **|** Advierte a un usuario.\n${"``"}${prefijo}kick${"``"} **|** Expulsa a un usuario dándole una razón.\n${"``"}${prefijo}ban${"``"} **|** Prohíbe a un usuario entrar al servidor.\n${"``"}${prefijo}unban${"``"} **|** Elimina la prohibición de un miembro al servidor.\n${"``"}${prefijo}clear${"``"} **|** Elimina múltiples mensajes en un canal.\n${"``"}${prefijo}dmsend${"``"} **|** Envía un mensaje directo por medio del bot a un miembro.\n${"``"}${prefijo}banlist${"``"} **|** Te muestra una lista de los usuarios baneados en el servidor.`)
        .addField("\u200B", "\u200B")
        .addField("💎 **Comandos de administración:**",`Comandos que solo los administradores pueden usar.\n\n${"``"}${prefijo}setPrefix${"``"} **|** Establece un prefijo personalizado en este servidor.\n${"``"}${prefijo}addRol${"``"} **|** Añade un rol a un miembro o mas en el servidor.\n${"``"}${prefijo}removeRol${"``"} **|** Remueve un rol de un miembro o mas en el servidor.\n${"``"}${prefijo}createCha${"``"} **|** Crea un canal.\n${"``"}${prefijo}deleteCha${"``"} **|** Elimina un canal.\n${"``"}${prefijo}setSlowMode${"``"} **|** Establece el modo pausado de un canal de texto.`)
        .addField("\u200B", "\u200B")
        .addField("⚙ **Comandos de sistemas:**", `Comandos de los sistemas que tiene el bot.\n\n${"``"}${prefijo}interPInfo${"``"} **|** Te muestra información de que es el sistema de inter promoción y te muestra sus comandos.\n${"``"}${prefijo}puntosInfo${"``"} **|** Te muestra información del sistema de Puntos y sus comandos.`)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setColor(colorEmb)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [comandos]})
    }

    // Comandos generales
    if(comando === "user"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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

        const embErr1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No puede encontrar a ese miembro.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!miembro) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            dt.delete().catch(e=>{
                return;
            })
        },40000))

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
                    const embUserNo = new Discord.MessageEmbed()
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
                        {name: `🎖 **Insignias:** 0`, value: `No tiene insignias`, inline: true},
                        {name: "🔍 **Estado:**", value: `${presencia[miembro.presence?.status]}\n${actyvidad}`, inline: true},
                    )
                    .setColor(msg.guild.me.displayHexColor)
                    .setTimestamp()
                    if(!miembro.user.flags) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUserNo]})


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
                    const embUserNo = new Discord.MessageEmbed()
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
                        {name: `🎖 **Insignias:** 0`, value: `No tiene insignias`, inline: true},
                        {name: "🔍 **Estado:**", value: `${presencia[miembro.presence?.status]}\n${actyvidad}`, inline: true},
                    )
                    .setColor(msg.guild.me.displayHexColor)
                    .setTimestamp()
                    if(!miembro.user.flags) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUserNo]})


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
        
        }     
    }

    if(comando === "stats"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
            {name: "📑 **Comandos:**", value: `39`, inline: true},
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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        let emojisSV = msg.guild.emojis.cache.map(e=>e)
        let emR = Math.floor(Math.random()*emojisSV.length)
        const embInfo = new Discord.MessageEmbed()
        .setAuthor("🔎 Comando jumbo")
        .addFields(
            {name: "**Uso:**", value: `${"``"}${prefijo}jumbo <Emoji>${"``"}`},
            {name: "**Ejemplo:**", value: `${prefijo}jumbo ${emojisSV[emR]}`}
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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
            let segPage
            if(String(emojis.size).slice(-1) === 0){
                segPage = Math.floor(emojis.size / 10)
            }else{
                segPage = Math.floor(emojis.size / 10 + 1)
            }

            let em1 = 0
            let em2 = 10
            let pagina = 1

            const embEmojis = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`${emojisAl[emojRandom]} Emojis del servidor`)
            .setDescription(`Emojis: ${emojis.size}\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n${"``"}${en}${"``"}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(em1,em2).join("\n\n")}`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
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
                    .setDescription(`Emojis: ${emojis.size}\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n${"``"}${en}${"``"}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(em1,em2).join("\n\n")}`)
                    .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                    msEm.edit({embeds: [embEmojis]})
                }

                if(reaccion.emoji.name === "➡" && reaccion.users.cache.get(msg.author.id)){
                    if(em2>=emojis.size) return await reaccion.users.remove(msg.author.id)
                    em1=em1+10
                    em2=em2+10
                    pagina=pagina+1

                    embEmojis
                    .setDescription(`Emojis: ${emojis.size}\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n${"``"}${en}${"``"}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(em1,em2).join("\n\n")}`)
                    .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                    msEm.edit({embeds: [embEmojis]})
                } 
                await reaccion.users.remove(msg.author.id)
            })
        }
    }

    if(comando === "stikers"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        let dias = Math.floor(client.uptime / 86400000);
        let horas = Math.floor(client.uptime / 3600000) % 24;
        let minutos = Math.floor(client.uptime / 60000) % 60;
        let segundos = Math.floor(client.uptime / 1000)% 60;
        const embed = new Discord.MessageEmbed()
        .setTitle("⏱ Tiempo activo")
        .setDescription(`${"``"}Dias: ${dias}${"``"} **|** ${"``"}Horas: ${horas}${"``"} **|** ${"``"}Minutos: ${minutos}${"``"} **|** ${"``"}Segundos: ${segundos}${"``"} `)
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
    }
    
    if(comando === "avatar"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
                .setAuthor(`Tu avatar ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
                                }else{
                                    imgs = "\u200B"
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

        if(msg.guild.features.length >= 1 && msg.guild.me.permissions.has(["BAN_MEMBERS","MANAGE_GUILD"])){
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

        }else{
            if(msg.guild.me.permissions.has(["BAN_MEMBERS","MANAGE_GUILD"])){        
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
                    {name: `\u200B`, value: `${imgs}`, inline: true},
                )
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServer]})

            }else{
                if(msg.guild.me.permissions.has("BAN_MEMBERS")){
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
                        {name: `⛔ **Baneos:**`, value: `${(await msg.guild.bans.fetch()).size.toLocaleString()}`, inline: true},
                        {name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true},
                        {name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true},
                        {name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true},
                        {name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true},
                        {name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true},
                        {name: `**Canales:** ${(chText+chVoize+chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()}`, inline: true},
                        {name: `👥 **Miembros:** ${msg.guild.members.cache.size.toLocaleString()}`, value: `👤 ${mgmc.filter(u=> !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:904556872005222480> ${(enlinea+ausente+nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true},
                        {name: `\u200B`, value: `${imgs}`, inline: true},
                    )
                    .setColor(msg.guild.me.displayHexColor)
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServer]})
                }else{
                    if(msg.guild.me.permissions.has("MANAGE_GUILD")){
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
                            {name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true},
                            {name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true},
                            {name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true},
                            {name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true},
                            {name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true},
                            {name: `**Canales:** ${(chText+chVoize+chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()}`, inline: true},
                            {name: `👥 **Miembros:** ${msg.guild.members.cache.size.toLocaleString()}`, value: `👤 ${mgmc.filter(u=> !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:904556872005222480> ${(enlinea+ausente+nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true},
                            {name: `\u200B`, value: `${imgs}`, inline: true},
                        )
                        .setColor(msg.guild.me.displayHexColor)
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServer]})

                    }else{
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
                            {name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true},
                            {name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true},
                            {name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true},
                            {name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true},
                            {name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true},
                            {name: `**Canales:** ${(chText+chVoize+chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()}`, inline: true},
                            {name: `👥 **Miembros:** ${msg.guild.members.cache.size.toLocaleString()}`, value: `👤 ${mgmc.filter(u=> !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:904556872005222480> ${(enlinea+ausente+nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true},
                            {name: `\u200B`, value: `${imgs}`, inline: true},
                        )
                        .setColor(msg.guild.me.displayHexColor)
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServer]})
                    }
                }
            }
        }
    }

    
    if(comando === "invite"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        let url = args[0]
        let urQR = `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=600x600`

        if(!args[0]){
            if(msg.guild.me.permissions.has("MANAGE_GUILD")){
                const embInfo = new Discord.MessageEmbed()
                .setTitle("🔎 Comando qrcode")
                .addFields(
                    {name: "Uso:", value: `${"``"}${prefijo}qrcode <URL o link>${"``"}`},
                    {name: "Ejemplo", value: `${prefijo}qrcode ${(await msg.guild.invites.fetch()).map(mi => mi.url).slice(0,1)}`}
                )
                .setColor(colorEmbInfo)
                return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
            }else{
                const embInfo = new Discord.MessageEmbed()
                .setTitle("🔎 Comando qrcode")
                .addFields(
                    {name: "Uso:", value: `${"``"}${prefijo}qrcode <URL o link>${"``"}`},
                    {name: "Ejemplo", value: `${prefijo}qrcode https://discord.gg/yKfWU4uykc`}
                )
                .setColor(colorEmbInfo)
                return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
            }
        }

        const attachment = new Discord.MessageAttachment(urQR, `imagen.png`)

        const embQR = new Discord.MessageEmbed()
        .setAuthor(`Codigo QR creado por ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
        .setImage(`attachment://imagen.png`)
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()

        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embQR], files: [attachment]}).catch(()=> msg.reply("Ubo un error. quisas no introdujiste bien el enlace."))
    }

    if(comando === "botInfo" || comando === "botinfo"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const infBot = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`<:sslogo:895014367920287754> ${client.user.username}`)
        .setDescription(`Es un bot enfocado en facilitar tareas que requieren la interacción en otros servidores, como crear alianzas, promocionar contenido en servidores, también enfocado en la creación de un sistema de puntos que puede usar el dueño del servidor para determinar cuando un miembro de soporte se merece subir de rango de acuerdo con los puntos acumulados que tenga.`)
        .addField("⚙ **Sistemas:**", `📣 **Sistema de inter promoción:**\nFase semi final, para mas información utilice el comando ${"``"}${prefijo}interPInfo${"``"}.\n\n🟢 **Sistema de puntos:**\nFase beta, para mas información utilice el comando ${"``"}${prefijo}puntosInfo${"``"}.\n\n🤝 **Sistema de auto alianzas:**\nEn desarollo...`)      
        .setFooter(`Creador del bot ${client.users.cache.get(creadorID).tag}`,client.users.cache.get(creadorID).displayAvatarURL({dynamic: true}))
        .setColor(colorEmb)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [infBot]})
    }




    // Comandos de moderacion
    if(comando === "warn"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
            dt.delete().catch(e=>{
                return;
            })
        },40000))

        let mencion = msg.mentions.members.first()
        let razonM = args.join(" ").slice(22)

        if(!args[0]){
            const embInfo = new Discord.MessageEmbed()
            .setTitle("🔎 Comando warn")
            .addFields(
                {name: "Uso:", value: `${"``"}${prefijo}warn <Mencion> <Razón>${"``"}\n${"``"}${prefijo}warn <ID del usuario> <Razón>${"``"}`},
                {name: "Ejemplo:", value: `${prefijo}warn ${msg.author} Mal uso de canales.\n${prefijo}warn ${msg.author.id} Uso de palabras in adecuadas.`}
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
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que quieres advertirte a ti mismo?, no puedo realizar la acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!razonM) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

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
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))
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
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que quieres advertirte a ti mismo?, no puedo realizar la acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`Ese miembro es el dueño del servidor, no puedes advertir al dueño del servidor.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.id === msg.guild.ownerId) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErr4 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`Ese miembro tiene un rol igual o mayor al tuyo por lo tanto no lo puedo advertirlo.`)
                .setColor(ColorError)
                .setTimestamp()
                if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErr5 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!razonM) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr5]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

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
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))
                })
            }

        }else{
            if(args[0]){
                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El argumento proporcionado (${args[0]}) no se reconoce como una Mención o una ID de un miembro del servidor, proporciona una Mención o ID valida de un miembro del servidor.`)
                .setColor(ColorError)
                .setTimestamp()
                if(isNaN(args[0])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`La ID ingresada no puede ser valida ya que contiene menos de 18 caracteres numéricos.`)
                .setColor(ColorError)
                .setTimestamp()
                if(args[0].length < 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`La ID ingresada no puede ser valida ya que contiene mas de 18 caracteres numéricos.`)
                .setColor(ColorError)
                .setTimestamp()
                if(args[0].length > 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

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
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

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
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))
        

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es tuya, ¿Por que quieres advertirte a ti mismo?, no puedo realizar esa acción.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(miembroID.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

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
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000))
        
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
                                te.delete().catch(e=>{
                                    return;
                                })
                            },40000))
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
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000))

                        const embErr3 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un miembro con igual o mayor rol que tu por lo tanto no lo puedes advertir.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(miembroID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000))


                        const embErr4 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000))

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
                                dt.delete().catch(e=>{
                                    return;
                                })
                            },40000))
                        })
                    }
                }
            }
        }
    }

    if(comando === "kick"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const embErr1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Expulsar miembros")
        .setTimestamp()
        if(!msg.member.permissions.has("KICK_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            dt.delete().catch(e=>{
                return;
            })
        },40000))

        const embErr2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Expulsar miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("KICK_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            dt.delete().catch(e=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando kick")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}kick <Mencion> <Razón>${"``"}\n${"``"}${prefijo}kick <ID del usuario> <Razón>${"``"}`},
            {name: "Ejemplo:", value: `${prefijo}kick ${msg.author} Romper una regla.\n${prefijo}kick ${msg.author.id} Flood en canales.`}
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
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que te quieres expulsar de tu propio servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(msg.author.id === mencion.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

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
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

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
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

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
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que quieres que te expulse de este increíble servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(msg.author.id === mencion.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                },40000))

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
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErrb2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese bot tiene un rol igual o mayor que el tuyo por lo tanto no puedes expulsarlo.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrb2]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

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
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErrb2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese miembro tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.guild.me.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrb2]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErrb3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese miembro tiene un rol igual o mayor que el tuyo por lo tanto no puedes expulsarlo.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrb3]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

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
                msg.delete().catch(c=>{
                    return;
                })
                dt.delete().catch(e=>{
                    return;
                })
            },40000))

            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID ingresada no puede ser valida ya que contiene menos de 18 caracteres numéricos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(args[0].length < 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                dt.delete().catch(e=>{
                    return;
                })
            },40000))

            const embErr3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID ingresada no puede ser valida ya que contiene mas de 18 caracteres numéricos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(args[0].length > 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(dt => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                dt.delete().catch(e=>{
                    return;
                })
            },40000))

            let miembroID = msg.guild.members.cache.get(args[0])
            let razonID = args.join(" ").slice(18)

            const embErr4 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID proporcionada no corresponde a la de ningún miembro de este servidor, asegúrese de introducir una ID de un miembro del servidor.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!miembroID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(dt => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                dt.delete().catch(e=>{
                    return;
                })
            },40000))

            if(miembroID){
                if(msg.author.id === msg.guild.ownerId){
                    const embErr1 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es es tuya, ¿Por que quieres expulsarte de tu propio servidor?, no puedo realizar esa acción.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(miembroID.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es mía, ¿Por que me quieres expulsar de tu increíble servidor?, *no puedo realizar esa acción.*`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(miembroID.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

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
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000))

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
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000))

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
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es mía, ¿Por que me quieres expulsar de este increíble servidor?, *no puedo realizar esa acción.*`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(miembroID.id === client.user.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    },40000))

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
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000))

                        const embErrB2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un bot con igual o mayor rol que el tuyo por lo tanto no lo puedes expulsar del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(miembroID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrB2]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000))

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
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000))

                        const embErrM2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un miembro con igual o mayor rol que yo por lo tanto no lo puedo expulsar del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.guild.me.roles.highest.comparePositionTo(miembroID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM2]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000))

                        const embErrM3 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un miembro con igual o mayor rol que tu por lo tanto no lo puedes expulsar del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(miembroID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM3]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000))

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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
            tm.delete().catch(e=>{
                return;
            })
        },40000))

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
            tm.delete().catch(e=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setAuthor("🔎 Comanod ban")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}ban <Mencion> <Razón>${"``"}\n${"``"}${prefijo}ban <ID del usuario> <Razón>${"``"}`},
            {name: "Ejemplo:", value: `${prefijo}ban ${msg.author} Publicar URLs maliciosas.\n${prefijo}ban ${msg.author.id} Romper múltiples reglas en el servidor.`}
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
                    tm.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErrM2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que te quieres banear de tu propio servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.user.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM2]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    tm.delete().catch(e=>{
                        return;
                    })
                },40000))


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
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErrM4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM4]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

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
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErrM4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM4]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

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
                    tm.delete().catch(e=>{
                        return;
                    })
                },40000))

                const embErrM2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Por que te quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(mencion.user.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM2]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    tm.delete().catch(e=>{
                        return;
                    })
                },40000))

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
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErrM3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No puedes banear a un bot con el mismo rol o mayor que tu.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM3]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))


                    const embErrM4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM4]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

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
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErrM2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No puedes banear a un usuario con el mismo rol o mayor que tu.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(mencion.roles.highest)<= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM2]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErrM3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese miembro tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(msg.guild.me.roles.highest.comparePositionTo(mencion.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM3]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErrM4 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razonMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrM4]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

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
                tm.delete().catch(e=>{
                    return;
                })
            },40000))

            const embErrID2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID ingresada no puede ser valida ya que contiene menos de 18 caracteres numéricos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(args[0].length < 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                tm.delete().catch(e=>{
                    return;
                })
            },40000))

            const embErrID3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`La ID ingresada no puede ser valida ya que contiene mas de 18 caracteres numéricos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(args[0].length > 18) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID3]}).then(tm => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                tm.delete().catch(e=>{
                    return;
                })
            },40000))

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
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErrID2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es tuya, ¿Por que te quieres banear de tu propio servidor?, no puedo realizar esa acción.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(userID.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID2]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))


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
                            tm.delete().catch(e=>{
                                return;
                            })
                        },40000))

                        const embErr2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete().catch(e=>{
                                return;
                            })
                        },40000))

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
                            tm.delete().catch(e=>{
                                return;
                            })
                        },40000))

                        const embErr2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete().catch(e=>{
                                return;
                            })
                        },40000))

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
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))

                    const embErrID2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Esa ID es tuya, ¿Por que te quieres banear de este increíble servidor?, no puedo realizar esa acción.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(userID.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrID2]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete().catch(e=>{
                            return;
                        })
                    },40000))


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
                            tm.delete().catch(e=>{
                                return;
                            })
                        },40000))

                        const embErr2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un bot con igual o mayor rol que tu por lo tanto no lo puedo banear.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(userID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete().catch(e=>{
                                return;
                            })
                        },40000))

                        const embErr3 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete().catch(e=>{
                                return;
                            })
                        },40000))

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
                            tm.delete().catch(e=>{
                                return;
                            })
                        },40000))

                        const embErr2 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un miembro con igual o mayor rol que yo por lo tanto no lo puedo banear.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.guild.me.roles.highest.comparePositionTo(userID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete().catch(e=>{
                                return;
                            })
                        },40000))

                        const embErr3 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`Esa ID es de un miembro con igual o mayor rol que tu por lo tanto no lo puedo banear.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(userID.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete().catch(e=>{
                                return;
                            })
                        },40000))

                        const embErr4 = new Discord.MessageEmbed()
                        .setAuthor("❌ Error")
                        .setDescription(`No has proporcionado una razón, proporciona una razón.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(!razonID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            tm.delete().catch(e=>{
                                return;
                            })
                        },40000))

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
                        mbt.delete().catch(e=>{
                            return;
                        })
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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso de Banear miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        },40000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso de Banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        },40000))

        const embErrP3 = new Discord.MessageEmbed()
        .setTitle("📄")
        .setDescription(`No se ha encontrado ningún miembro baneado en este servidor.`)
        .setColor(colorEmbInfo)
        .setTimestamp()
        if((await msg.guild.bans.fetch()).size === 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP3]}).then(tm => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando unban")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}unban <ID del usuario baneado>${"``"}`},
            {name: "Ejemplo:", value: `${prefijo}unban ${(await msg.guild.bans.fetch()).map(mb => mb.user.id).slice(0,1)}`}
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
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        },40000))

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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar mensajes .")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_MESSAGES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        },40000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar mensajes .")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_MESSAGES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        },40000))

        let algo = args[0]

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando clear")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}clear <Cantidad>${"``"}`},
            {name: "Ejemplo:", value: `${prefijo}clear ${Math.round(Math.random(1)*100)}`}
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
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        },40000))

        const embErr2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`Introduce un valor mayor a 1`)
        .setColor(ColorError)
        .setTimestamp()
        if(algo <= 2) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        },40000))

        const embErr3 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`Has introducido un valor mayor a 100, el máximo de mensajes que puedo eliminar es de 100, introduce un valor igual o menor a 100.`)
        .setColor(ColorError)
        .setTimestamp()
        if(algo > 100) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        },40000))

        const embClear = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("🗑 Mensajes eliminados")
        .setDescription(`${msg.author} ha eliminado **${Math.round(algo)}** mensajes.`)
        .setColor(colorEmb)

        setTimeout(()=>{
            msg.delete()
            setTimeout(()=>{
                msg.channel.bulkDelete(Math.round(algo)).catch(e=>{
                    return;
                })
                msg.channel.send({embeds: [embClear]}).then(tm => setTimeout(()=>{
                    tm.delete().catch(e=>{
                        return;
                    })
                },20000))
            },1000)
        },800)
    }

    // Banlist
    if(comando === "banlist" || comando === "blist"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Banear miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        },40000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        },40000))

        let ss0 = 0
        let ss1 = 10
        let pagina = 1
        let gb = await msg.guild.bans.fetch()

        const embBanlist = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("🧾 Lista de baneos")
        .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m=>m).map((bm, i) => `**${i+1}. ${bm.user.tag}**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}\n[Avatar del usuario](${bm.user.displayAvatarURL({dynamic: true})})`).slice(ss0,ss1).join("\n\n")}`)
        .setColor(msg.guild.me.displayHexColor)
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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
            tm.delete().catch(t=>{
                return;
            })
        },40000))

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
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando dmsend")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}dmsend <Mencion del usuario> <Mensaje>${"``"}\n${"``"}${prefijo}dmsend <ID sel usuario> <Mensaje>${"``"}`},
            {name: "Ejemplo:", value: `${prefijo}dmsend ${msg.author} Mensaje a enviar.\n${prefijo}dmsend ${msg.author.id} Mensaje a enviar.`}
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
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El miembro mencionado es un bot, no puedo enviar un mensaje directo a un bot.`)
            .setColor(ColorError)
            .setTimestamp()
            if(mencionUs.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr4 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`¿Para que quieres que te envié un mensaje creado por ti?, no puedo realizar esa acción.`)
            .setColor(ColorError)
            .setTimestamp()
            if(mencionUs.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr5 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`No has proporcionado el mensaje a enviar, proporciona el mensaje que enviare el usuario.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!mensajeMe) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr5]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

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
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))
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
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`La ID proporcionada es la de un bot, no puedo enviar un mensaje directo a un bot.`)
                .setColor(ColorError)
                .setTimestamp()
                if(usuarioID.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr4 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`¿Para que quieres que te envié un mensaje creado por ti?, no puedo realizar esa acción.`)
                .setColor(ColorError)
                .setTimestamp()
                if(usuarioID.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr5 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No has proporcionado el mensaje a enviar, proporciona el mensaje que enviare el usuario.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!mensajeID) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr5]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

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
                        tm.delete().catch(t=>{
                            return;
                        })
                    },40000))
                })
            }
        }
    }
    



    // Comandos de administracion

    // Establecer prefijo en el servidor
    if(comando === "setPrefix" || comando === "setprefix"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando, solo un administrador del servidor lo puede ejecutar.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando setPrefix")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}setPrefix <Nuevo prefijo>${"``"}`},
            {name: "Ejemplo:", value: `${prefijo}setPrefix s!`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]})

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No puedes establecer un prefijo con un emoji.`)
        .setColor(ColorError)
        .setTimestamp()
        if(args[0].includes(":")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        const embErrP3 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`El prefijo no puede tener mas de 3 caracteres.`)
        .setColor(ColorError)
        .setTimestamp()
        if(args[0].length > 3) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP3]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete().catch(t=>{
                return;
            })
        },40000))



        let dataPre = await mPrefix.findOne({Nombre: "Prefijos"})

        if(!dataPre.serverID.some(s=> s === msg.guildId)){
            dataPre.serverID.push(msg.guildId)
            dataPre.prefijo.push(args[0])

            const embPrefix = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("Prefijo cambiado")
            .setDescription(`Nuevo prefijo: ${"``"}${args[0]}${"``"}`)
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPrefix]})
            return await dataPre.save()
        }
        let num = dataPre.serverID.indexOf(msg.guildId)
        dataPre.prefijo[num] = args[0]

        const embPrefix = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("Prefijo cambiado")
        .setDescription(`Nuevo prefijo: ${"``"}${args[0]}${"``"}`)
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPrefix]})
        return await dataPre.save()
    }

    if(comando === "setSlowMode" || comando === "setslowmode" || comando === "setSlow" || comando === "setslow" || comando === "slowmode"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido:  Gestionar canales o Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR") || !msg.member.permissions.has("MANAGE_CHANNELS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tengo los permisos suficientes.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Gestionar canales")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_CHANNELS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        let tiempos = ["10s","2m","30m","1h","6h","12h"]
        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando setSlowMode")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}setSlowMode <Mención del canal> <Tiempo a establecer el modo pausado>${"``"}\n${"``"}${prefijo}setSlowMode <ID del canal> <Tiempo a establecer el modo pausado>${"``"}`},
            {name: "Ejemplos:", value: `${prefijo}setSlowMode ${msg.channel} ${tiempos[Math.floor(Math.random()*tiempos.length)]}\n${prefijo}setSlowMode ${msg.channelId} ${tiempos[Math.floor(Math.random()*tiempos.length)]}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let canal = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0])

        if(canal){
            const embErr1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El canal proporcionado (${canal}) no es de tipo texto, el modo pausado solo se puede establecer en canales de tipo texto.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!canal.isText()) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`No has proporcionado el tiempo del modo pausado a establecer para el canal.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!args[1]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`No solo ingreses números determina si son segundos con ${"``"}s${"``"}, minutos con ${"``"}m${"``"}, horas con ${"``"}h${"``"} al final del numero, ejemplo ${"``"}10s${"``"}.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!isNaN(args[1])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr4 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El tiempo del modo pausado de un canal no debe de superar 6h.`)
            .setColor(ColorError)
            .setTimestamp()
            if(ms(args[1])/1000 >= 21600) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            const embSlow = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("⏲ Modo pausado")
            .setDescription(`El modo pausado de **${args[1]}** ha sido establecido en el canal **${canal}**.`)
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            canal.setRateLimitPerUser(ms(args[1]) / 1000, `Modo pausado de ${args[1]} establecido en el canal por ${msg.author.tag}.`).then(tm=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embSlow]})
            }).catch(c=> console.log(c))
        }

    }

    // addrol
    let roles = msg.guild.roles.cache.filter(fr => !fr.managed).map(mr => mr)
    let random = Math.floor(Math.random()* roles.length)
    let rolesParaID = msg.guild.roles.cache.filter(fr => !fr.managed).map(mr => mr.id)
    let randomRID = Math.floor(Math.random()* rolesParaID.length)

    if(comando === "addrol" || comando === "addr"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
            tm.delete().catch(t=>{
                return;
            })
        },40000))

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
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando addrol")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}addrol <Mencion del miembro> <Mencion del rol>${"``"}\n${"``"}${prefijo}addrol <ID del miembro> <ID del rol>${"``"}`},
            {name: "Ejemplos:", value: `${prefijo}addrol ${msg.author} ${roles[random]}\n${prefijo}addrol ${msg.author} ${rolesParaID[randomRID]}\n${prefijo}addrol ${msg.author.id} ${rolesParaID[randomRID]}\n${prefijo}addrol ${msg.author.id} ${roles[random]}`}
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
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

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
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El el miembro ya tiene ese rol.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El rol mencionado es exclusivo para un bot, no se le puede agregar a ningún miembro.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolParaAdd.managed) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

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
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

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
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

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
                        tm.delete().catch(t=>{
                            return;
                        })
                    },40000))

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`El el miembro ya tiene ese rol.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete().catch(t=>{
                            return;
                        })
                    },40000))

                    const embErr3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Ese rol es exclusivo para un bot, no se le puede agregar a ningún miembro.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(rolParaAdd.managed) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete().catch(t=>{
                            return;
                        })
                    },40000))

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
                        tm.delete().catch(t=>{
                            return;
                        })
                    },40000))

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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
            tm.delete().catch(t=>{
                return;
            })
        },40000))

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
            tm.delete().catch(t=>{
                return;
            })
        },40000))
        msg.guild.ownerId

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando removeRol")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}removeRol <Mencion del miembro> <Mencion del rol>${"``"}\n${"``"}${prefijo}removeRol <ID del miembro> <ID del rol>${"``"}`},
            {name: "Ejemplos:", value: `${prefijo}removeRol ${msg.author} ${roles[random]}\n${prefijo}removeRol ${msg.author} ${rolesParaID[randomRID]}\n${prefijo}removeRol ${msg.author.id} ${rolesParaID[randomRID]}\n${prefijo}removeRol ${msg.author.id} ${roles[random]}`}
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
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

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
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El el miembro no tiene ese rol.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El rol mencionado es exclusivo para un bot, no lo puedo remover de ningún miembro.`)
                .setColor(ColorError)
                .setTimestamp()
                if(rolParaAdd.managed) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

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
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

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
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

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
                        tm.delete().catch(t=>{
                            return;
                        })
                    },40000))

                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`El el miembro no tiene ese rol.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!rolesDelMenc.some(sr => sr === rolParaAdd.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete().catch(t=>{
                            return;
                        })
                    },40000))

                    const embErr3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`El rol mencionado es exclusivo para un bot, no se le puede agregar a ningún miembro.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(rolParaAdd.managed) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete().catch(t=>{
                            return;
                        })
                    },40000))

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
                        tm.delete().catch(t=>{
                            return;
                        })
                    },40000))

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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
            tm.delete().catch(t=>{
                return;
            })
        },40000))

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
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando createCha")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}createCha <Nombre del canal>${"``"}\nCrea un canal con el nombre proporcionado de tipo texto en la categoría que estas utilizando\n${"``"}${prefijo}createCha <Nombre del canal> - <Tipo de canal (texto o voz)>${"``"}\nCrea un canal con el nombre ingresado y el tipo de canal ingresado en la categoría que estas usando\n${"``"}${prefijo}createCha <Nombre del canal> - <Tipo de canal (texto o voz)> - <ID de la categoría en la que se creara>${"``"}\nCrea un canal con el nombre ingresado, tipo de canal ingresado y en la categoría ingresada.`},
            {name: "Ejemplos:", value: `${prefijo}createCha Chat\n${prefijo}createCha Reglas - texto\n${prefijo}createCha Musica - voz - ${categoriasGMS[randomCat]}`}
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
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
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
            tm.delete().catch(t=>{
                return;
            })
        },40000))

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
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando deleteCha")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}deleteCha <Mencion del canal>${"``"}\n${"``"}${prefijo}deleteCha <ID del canal>${"``"}`},
            {name: "Ejemplos:", value: `${prefijo}deleteCha ${canalesAlDel[randomChanne]}\n${prefijo}deleteCha ${canalesAlDel[randomChanne].id}`}
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


    // Comandos del sistema de Inter Promocion
    if(comando === "interPInfo" || comando === "interpinfo"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const embInf = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("📣 ¿Qué es el sistema de Inter promoción?")
        .setDescription(`Es un sistema que te facilita la tarea de promocionar contenido en otros servidores, con el solo tienes que promocionar el contenido en un canal el bot lo publicara en otros canales de otroas servidores.\n\n📑 **Comandos:**\n${"``"}${prefijo}setInterP${"``"} **|** Agrega un canal al sistema de *Inter promoción*.\n${"``"}${prefijo}removeInterP${"``"} **|** Elimina el canal establecido para el sistema de *Inter promoción*.\n${"``"}${prefijo}InterPlist${"``"} **|** Muestra una lista de servidores que tienen activo el sistema de *Inter promoción*.`)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setColor(colorEmb)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInf]})
    }

    // Establecer el canal de inter promocion
    if(comando === "setInterP" || comando === "setinterp"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const error = new Discord.MessageEmbed()
        .setAuthor(`❌ Error`)
        .setDescription(`Solo un administrador del servidor puede ejecutar el comando.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [error]}).then(tt => setTimeout(()=> {
            msg.delete().catch(t=>{
                return;
            })
            tt.delete().catch(t=>{
                return;
            })
        },40000))

        const embErrMiem = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`Este servidor no cuenta con el mínimo de 100 miembros necesarios para poder usar el sistema de Inter Promoción.`)
        .setColor(ColorError)
        .setTimestamp()
        if(msg.guild.members.cache.filter(f=> !f.user.bot).size < 100) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiem]}).then(tt => setTimeout(()=> {
            msg.delete().catch(t=>{
                return;
            })
            tt.delete().catch(t=>{
                return;
            })
        },40000))

        let dataIP = await interP.findOne({Nombre: "Inter promocion"})


        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando setInterP")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}setInterP <Mención del canal>${"``"}\n${"``"}${prefijo}setInterP <ID del canal>${"``"}`},
            {name: "Ejemplos:", value: `${prefijo}setInterP ${msg.channel}\n${prefijo}setInterP ${msg.channelId}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let canal = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0])

        const embErr1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`El argumento que has proporcionado no se identifico como un canal en este servidor, menciona o proporciona la ID de un canal de este servidor.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!canal) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tt => setTimeout(()=> {
            msg.delete().catch(t=>{
                return;
            })
            tt.delete().catch(t=>{
                return;
            })
        },40000))

        if(canal){
            const embErr1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`En este servidor ya hay un canal de Inter promoción, no puedes agregar otro al sistema de Inter promoción.`)
            .setColor(ColorError)
            .setTimestamp()
            if(dataIP.serverID.some(s=> s === msg.guildId)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tt => setTimeout(()=> {
                msg.delete().catch(t=>{
                    return;
                })
                tt.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El canal proporcionado no es de tipo texto, proporciona un canal de tipo texto.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!canal.isText()) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tt => setTimeout(()=> {
                msg.delete().catch(t=>{
                    return;
                })
                tt.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`Ese canal ya esta agregado al sistema de **Inter promoción**.`)
            .setColor(ColorError)
            .setTimestamp()
            if(dataIP.canalID.some(s=> s === canal.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tt => setTimeout(()=> {
                msg.delete().catch(t=>{
                    return;
                })
                tt.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr4 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`No tengo los permisos suficientes en ese canal.`)
            .setColor(ColorError)
            .setTimestamp()
            .setFooter("Permisos requeridos: Crear invitación, Gestionar mensajes, Gestionar canal.")
            if(!msg.guild.me.permissionsIn(canal).has(["CREATE_INSTANT_INVITE","MANAGE_MESSAGES","MANAGE_CHANNELS"])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tt => setTimeout(()=> {
                msg.delete().catch(t=>{
                    return;
                })
                tt.delete().catch(t=>{
                    return;
                })
            },40000))

            dataIP.canalID.push(canal.id)
            dataIP.autor.push(msg.author.id)
            dataIP.serverID.push(msg.guildId)

            canal.setRateLimitPerUser(8*60, "El modo pausado de 8m es necesario para el Sistema de Inter promoción para evitar flood")
            canal.createInvite({maxAge: 0, reason: "Importante para el sistema de Inter promoción."}).then(ti=> client.channels.cache.get("850189144826052648").send(`${ti}`))

            const embMDCre = new Discord.MessageEmbed()
            .setAuthor(`${msg.author.tag} - ID: ${msg.author.id}`,msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail(msg.guild.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
            .setTitle("Nuevo canal agregado al sistema de Inter promoción")
            .addFields(
                {name: "**Servidor:**", value: `${msg.guild.name}\n**ID:** ${msg.guildId}\n👥 ${msg.guild.members.cache.size}`},
                {name: "**Canal:**", value: `${msg.channel}\n${msg.channel.name}\n**ID:** ${msg.channelId}\n**Permisos:** ${msg.guild.me.permissionsIn(canal).toArray().length}`}
            )
            .setColor("GREEN")
            .setFooter(client.user.tag,client.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            client.channels.cache.get("850189144826052648").send({embeds: [embMDCre]})
            

            const emb = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("✅ El canal se agregara al sistema de Inter promoción, gracias por usar el Bot.")
            .setDescription(`<:canaldetexto:904812801925738557> **Canal:** ${canal}`)
            .setColor("GREEN")
            .setFooter(client.user.username,client.user.displayAvatarURL())
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [emb]})
            return await dataIP.save()
        }
    }


    // Eliminar el canal de inter promocion
    if(comando === "removeInterP" || comando === "removeinterp"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        const error = new Discord.MessageEmbed()
        .setAuthor(`❌ Error`)
        .setDescription(`Solo un administrador del servidor puede ejecutar el comando.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [error]}).then(tt => setTimeout(()=> {
            msg.delete().catch(t=>{
                return;
            })
            tt.delete().catch(t=>{
                return;
            })
        },40000))

        let dataIP = await interP.findOne({Nombre: "Inter promocion"})

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando removeInterP")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}removeInterP <Mención del canal>${"``"}\n${"``"}${prefijo}removeInterP <ID del canal>${"``"}`},
            {name: "Ejemplos:", value: `${prefijo}removeInterP ${msg.channel}\n${prefijo}removeInterP ${msg.channelId}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let canal = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0])

        const embErr1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`El argumento que has proporcionado no se identifico como un canal en este servidor, menciona o proporciona la ID de un canal de este servidor.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!canal) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tt => setTimeout(()=> {
            msg.delete().catch(t=>{
                return;
            })
            tt.delete().catch(t=>{
                return;
            })
        },40000))

        if(canal){
            const embErr1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El canal proporcionado no se encontró en el sistema de Inter promoción.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!dataIP.canalID.some(s=> s === canal.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tt => setTimeout(()=> {
                msg.delete().catch(t=>{
                    return;
                })
                tt.delete().catch(t=>{
                    return;
                })
            },40000))

            let num = dataIP.canalID.indexOf(canal.id)
            dataIP.canalID.splice(num,1)
            dataIP.autor.splice(num,1)
            dataIP.serverID.splice(num,1)

            canal.setRateLimitPerUser(0,"Se ha eliminado el canal del sistema de Inter promoción.");
            (await msg.guild.invites.fetch()).filter(fi => fi.channel.id === canal.id && fi.inviter.id === client.user.id).map(mi => mi.delete("He eliminado la invitación que anteriormente había creado para el sistema de inter promoción."));

            const embCIDel = new Discord.MessageEmbed()
            .setAuthor(`${msg.author.tag} - ID: ${msg.author.id}`,msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail(msg.guild.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
            .setTitle("❌ Canal eliminado del sistema de Inter promoción")
            .addFields(
                {name: "**Servidor:**", value: `${msg.guild.name}\n**ID:** ${msg.guildId}\n👥 ${msg.guild.members.cache.size}`},
                {name: "**Canal:**", value: `${msg.channel}\n${msg.channel.name}\n**ID:** ${msg.channelId}\n**Permisos:** ${msg.guild.me.permissionsIn(canal).toArray().length}`}
            )
            .setColor("RED")
            .setFooter(client.user.tag,client.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            client.channels.cache.get("850189144826052648").send({embeds: [embCIDel]})

            const embF = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("❌ Canal eliminado del sistema de Inter promoción")
            .setDescription(`<:canaldetexto:904812801925738557> **Canal:** ${canal}`)
            .setColor("RED")
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embF]})
            return await dataIP.save()
        }
    }

    if(comando === "InterPlist" || comando === "interplist"){
        if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
        msg.channel.sendTyping()
        let dataIP = await interP.findOne({Nombre: "Inter promocion"})
        
        let canales = []
        let servidores = []
        for(let i=0; i<dataIP.canalID.length; i++){
            if(client.channels.cache.get(dataIP.canalID[i])){
                canales.push(dataIP.canalID[i])
                servidores.push(dataIP.serverID[i])
            }
        }

        let list = []
        for(let i=0; i<canales.length; i++){
            list.push(`**${i+1}.** ${client.guilds.cache.get(servidores[i]).name}\n**Miembros:** ${client.guilds.cache.get(servidores[i]).members.cache.size.toLocaleString()}\n**Canal:** ${client.channels.cache.get(canales[i]).name}\n[Unirse](${(await client.guilds.cache.get(servidores[i]).invites.fetch()).filter(fi=> fi.inviter.id === client.user.id).map(mi => mi.url).slice(0,1)})`)
        }
        
        const embSIP = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("Lista de servidores que tienen activado el sistema de Inter promoción")
        .setDescription(`**Servidores:** ${servidores.length}\n\n${list.join("\n\n")}`)
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embSIP]})
    }



    // Sistema de puntos
    if(comando.toLowerCase() === "puntosInfo"){
        msg.channel.sendTyping()
        const embInfoP = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("🟢 ¿Qué es el sistema de Puntos?")
        .setDescription(`Es un sistema creado con la intención de ayudar a los creadores de servidores a tener un registro de las acciones que han realizado los miembros del equipo de soporte del servidor.\n\n📑 **Comandos:**\n${"``"}${prefijo}puntos${"``"} **|** Muestra la cantidad de puntos que tienes o tiene un miembro.\n${"``"}${prefijo}addPuntos${"``"} **|** Agrega puntos a un miembro.\n${"``"}${prefijo}removePuntos${"``"} **|** Elimina puntos a un miembro.\n${"``"}${prefijo}leaderboardP${"``"} **|** Muestra una tabla con los miembros que han utilizado el sistema de puntos y sus respectivos puntos.\n${"``"}${prefijo}setEmojiP${"``"} **|** Establece el icono o emoji de los puntos.\n\`\`${prefijo}updateSystemP\`\` **|** Actualiza la base de datos de tu servidor eliminando a todos los miembros que ya no estén en tu servidor de la base de datos del sistema de puntos.\n\`\`${prefijo}removeSystemPUser\`\` **|** Elimina del sistema de puntos a un miembro de tu servidor.`)
        .setColor(colorEmb)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfoP]})
    }

    if(comando === "puntos" || comando === "ps"){
        msg.channel.sendTyping()
        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])

        if(miembro){
            const embErrP1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El miembro proporcionado es un bot, por lo tanto no tiene puntos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(miembro.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete()
            },60000))

            let dataSP = await sPuntos.findOne({_id: msg.guildId})

            if(!dataSP){
                let nuevaDataSP = new sPuntos({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    emoji: "🟢",
                    sistema: [{nombre: msg.author.tag, miembroID: msg.author.id, puntos: 0}]
                })

                const embPMi = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setDescription(`Tiene 🟢 **0** puntos.`)
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPMi]})

                return await nuevaDataSP.save()
            }

            if(!dataSP.sistema.some(s=> s.miembroID === miembro.id)){
                dataSP.sistema.push({nombre: msg.author.tag, miembroID: miembro.id, puntos: 0})

                const embPMi = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setDescription(`Tiene ${dataSP.emoji} **0** puntos.`)
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPMi]})

                return await dataSP.save()
            }

            let posiscion
            for(let i=0; i<dataSP.sistema.length; i++){
                if(dataSP.sistema[i].miembroID === miembro.id){
                    posiscion = i
                }
            }

            const embPMi = new Discord.MessageEmbed()
            .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
            .setDescription(`Tiene ${dataSP.emoji} **${dataSP.sistema[posiscion].puntos}** puntos.`)
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPMi]})
        }else{
            let dataSP = await sPuntos.findOne({
                _id: msg.guildId
            })

            if(!dataSP){
                let nuevaDataSP = new sPuntos({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    emoji: "🟢",
                    sistema: [{nombre: msg.author.tag, miembroID: msg.author.id, puntos: 0}]
                })

                const embPAu = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Tienes 🟢 **0** puntos.`)
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPAu]})

                return await nuevaDataSP.save()
            }

            if(!dataSP.sistema.some(s=> s.miembroID === msg.author.id)){
                dataSP.sistema.push({nombre: msg.author.tag, miembroID: msg.author.id, puntos: 0})

                const embPAu = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Tienes ${dataSP.emoji} **0** puntos.`)
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPAu]})

                return await dataSP.save()
            }

            let posiscion
            for(let i=0; i<dataSP.sistema.length; i++){
                if(dataSP.sistema[i].miembroID === msg.author.id){
                    posiscion = i
                }
            }

            const embPAu = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Tienes ${dataSP.emoji} **${dataSP.sistema[posiscion].puntos}** puntos.`)
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPAu]})
        }
    }

    if(comando === "addPuntos" || comando === "addpuntos" || comando === "addp"){
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando addPuntos")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}addPuntos <Mención del miembro> <Puntos a dar>${"``"}\n${"``"}${prefijo}addPuntos <ID del miembro> <Puntos a dar>${"``"}`},
            {name: "Ejemplos:", value: `${prefijo}addPuntos ${msg.author} ${Math.round(Math.random(1)*200)}\n${prefijo}addPuntos ${msg.author.id} ${Math.round(Math.random(1)*200)}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let dataSP = await sPuntos.findOne({_id: msg.guildId})

        let mencionM = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])

        if(mencionM){
            const embErr1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El miembro es un bot, no puedes dar puntos a un bot.`)
            .setColor(ColorError)
            .setTimestamp()
            if(mencionM.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`No has proporcionado la cantidad de puntos a dar.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!args[1]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El segundo argumento no es numérico, debe de ser numérico para poder agregar al miembro una cantidad de puntos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(isNaN(args[1])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            let cantidad = Math.round(args[1])

            if(!dataSP){
                nuevaDataSP = new sPuntos({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    emoji: "🟢",
                    sistema: [{nombre: mencionM.user.tag, miembroID: mencionM.id, puntos: cantidad}]
                })
                
                const embAddP = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("✅ Puntos agregados al miembro")
                .setDescription(`Se le han agregado 🟢 **${cantidad}** puntos a **${mencionM}**.`)
                .setColor("GREEN")
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                return await nuevaDataSP.save()
            }

            if(!dataSP.sistema.some(s=> s.miembroID === mencionM.id)){
                dataSP.sistema.push({nombre: mencionM.user.tag, miembroID: mencionM.id, puntos: cantidad})

                const embAddP = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("✅ Puntos agregados al miembro")
                .setDescription(`Se le han agregado ${dataSP.emoji} **${cantidad}** puntos a **${mencionM}**.`)
                .setColor("GREEN")
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})

                return await dataSP.save()
            }

            let posiscion
            for(let i=0; i<dataSP.sistema.length; i++){
                if(dataSP.sistema[i].miembroID === mencionM.id){
                    posiscion = i
                }
            }

            let cantidadMiem = dataSP.sistema[posiscion].puntos
            dataSP.sistema[posiscion] = {nombre: mencionM.user.tag, miembroID: mencionM.id, puntos: cantidadMiem + cantidad}

            const embAddP = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("✅ Puntos agregados al miembro")
            .setDescription(`Se le han agregado ${dataSP.emoji} **${cantidad}** puntos a **${mencionM}**.`)
            .setColor("GREEN")
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})

            return await dataSP.save()
        }
    }

    if(comando === "removePuntos" || comando === "removepuntos" || comando === "removep"){
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando removePuntos")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}removePuntos <Mención del miembro> <Puntos a eliminar>${"``"}\n${"``"}${prefijo}removePuntos <ID del miembro> <Puntos a eliminar>${"``"}`},
            {name: "Ejemplos:", value: `${prefijo}removePuntos ${msg.author} ${Math.round(Math.random(1)*200)}\n${prefijo}removePuntos ${msg.author.id} ${Math.round(Math.random(1)*200)}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let dataSP = await sPuntos.findOne({_id: msg.guildId})

        let mencionM = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])

        if(mencionM){
            const embErr1 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El miembro es un bot, no puedes eliminar puntos a un bot.`)
            .setColor(ColorError)
            .setTimestamp()
            if(mencionM.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`No has proporcionado la cantidad de puntos a eliminar.`)
            .setColor(ColorError)
            .setTimestamp()
            if(!args[1]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            const embErr3 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`El segundo argumento no es numérico, debe de ser numérico para poder eliminar al miembro una cantidad de puntos.`)
            .setColor(ColorError)
            .setTimestamp()
            if(isNaN(args[1])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },40000))

            let cantidad = Math.round(args[1])

            if(!dataSP){
                nuevaDataSP = new sPuntos({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    emoji: "🟢",
                    sistema: [{nombre: mencionM.user.tag, miembroID: mencionM.id, puntos: 0-cantidad}]
                })
                
                const embAddP = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("❌ Puntos eliminados al miembro")
                .setDescription(`Se le han eliminado 🟢 **${cantidad}** puntos a **${mencionM}**.`)
                .setColor("RED")
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                return await nuevaDataSP.save()
            }

            if(!dataSP.sistema.some(s=> s.miembroID === mencionM.id)){
                dataSP.sistema.push({nombre: mencionM.user.tag, miembroID: mencionM.id, puntos: 0-cantidad})

                const embAddP = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("❌ Puntos eliminados al miembro")
                .setDescription(`Se le han eliminado ${dataSP.emoji} **${cantidad}** puntos a **${mencionM}**.`)
                .setColor("RED")
                .setTimestamp()
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})

                return await dataSP.save()
            }

            let posiscion
            for(let i=0; i<dataSP.sistema.length; i++){
                if(dataSP.sistema[i].miembroID === mencionM.id){
                    posiscion = i
                }
            }

            let cantidadMiem = dataSP.sistema[posiscion].puntos
            dataSP.sistema[posiscion] = {nombre: mencionM.user.tag, miembroID: mencionM.id, puntos: cantidadMiem - cantidad}

            const embAddP = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("❌ Puntos eliminados al miembro")
            .setDescription(`Se le han eliminado ${dataSP.emoji} **${cantidad}** puntos a **${mencionM}**.`)
            .setColor("RED")
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})

            return await dataSP.save()
        }
    }

    if(comando === "leaderboardP" || comando === "leaderboardp" || comando === "topP" || comando === "topp"){
        msg.channel.sendTyping()
        let dataSP = await sPuntos.findOne({_id: msg.guildId})

        if(!dataSP){
            nuevaDataSP = new sPuntos({
                _id: msg.guildId,
                serverName: msg.guild.name,
                emoji: "🟢",
                sistema: [{nombre: msg.author.tag, miembroID: msg.autho.id, puntos: 0}]
            })

            const embed = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`No se ha registrado ningún miembro de este servidor al sistema de puntos, para saber mas del sistema usa el comando ${"``"}${prefijo}puntosInfo${"``"}.`)
            .setColor(msg.guild.me.displayHexColor)
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
            return nuevaDataSP.save()
        }

        const embed = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`No se ha registrado ningún miembro de este servidor al sistema de puntos, para saber mas del sistema usa el comando ${"``"}${prefijo}puntosInfo${"``"}.`)
        .setColor(msg.guild.me.displayHexColor)
        if(dataSP.sistema.length <= 0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})

        let sistPs = []
        for(let i=0; i<dataSP.sistema.length; i++){
            sistPs.push({miembro: `${dataSP.sistema[i].miembroID}`, puntos: dataSP.sistema[i].puntos})
        }

        let ordenPs = sistPs.sort((a,b)=> b.puntos - a.puntos)
        let top = []
        
        for(let i=0; i<ordenPs.length; i++){
            top.push(`**${i+1}.** ${client.users.cache.get(ordenPs[i].miembro)} - ${dataSP.emoji} **${ordenPs[i].puntos}**`)
        }

        let segPage 
        if(String(ordenPs.length).slice(-1) === "0"){
            segPage = Math.floor(ordenPs.length / 10)
        }else{
            segPage = Math.floor(ordenPs.length / 10 + 1)
        }

        let cps1 = 0
        let cps2 = 10
        let pagina = 1 

        const embTopP = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1,cps2).join("\n")}`)
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()
        const mensajeSend = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embTopP]})

        if(ordenPs.length > 10){
            await mensajeSend.react("⬅")
            await mensajeSend.react("➡")
        }

        const colector = mensajeSend.createReactionCollector(rec => rec.id === msg.author.id)

        colector.on("collect", async reaccion => {
            if(reaccion.emoji.name === "⬅" && reaccion.users.cache.get(msg.author.id)){
                if(cps2 <= 10) return await reaccion.users.remove(msg.author.id)

                cps1=cps1-10
                cps2=cps2-10
                pagina=pagina-1

                embTopP
                .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1,cps2).join("\n")}`)
                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                mensajeSend.edit({embeds: [embTopP]})
            }

            if(reaccion.emoji.name === "➡" && reaccion.users.cache.get(msg.author.id)){
                if(cps2>=ordenPs.length) return await reaccion.users.remove(msg.author.id)
                cps1=cps1+10
                cps2=cps2+10
                pagina=pagina+1

                embTopP
                .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1,cps2).join("\n")}`)
                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                mensajeSend.edit({embeds: [embTopP]})
            } 
            await reaccion.users.remove(msg.author.id)
        })
    }

    if(comando === "setEmojiP" || comando === "setemojip" || comando === "setep"){
        msg.channel.sendTyping()
        let emojis = msg.guild.emojis.cache.map(e=>e)
        let embRandom = Math.floor(Math.random()*emojis.length)
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando setEmojiP")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}setEmojiP <Emoji a establecer>${"``"}`},
            {name: "Ejemplo:", value: `${prefijo}setEmojiP ${emojis[embRandom]}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        const embErrP3 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No puedes establecer números como símbolo del sistema de puntos.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!isNaN(args[0])) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP3]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete().catch(t=>{
                return;
            })
        },40000)) 

        let dataSP = await sPuntos.findOne({_id: msg.guildId})

        if(!dataSP){
            nuevaDataSP = new sPuntos({
                _id: msg.guildId,
                serverName: msg.guild.name,
                emoji: args[0],
                sistema: [{nombre: msg.author.tag, miembroID: msg.author.id, puntos: 0}]
            })

            const embSetE = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Emoji ${args[0]} establecido como el emoji del sistema de puntos.`)
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embSetE]})
            return nuevaDataSP.save()
        }

        await sPuntos.findOneAndUpdate({
            _id: msg.guildId
        },
        {
            serverName: msg.guild.name,
            emoji: args[0]
        })

        const embSetE = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`Emoji ${args[0]} establecido como el emoji del sistema de puntos.`)
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embSetE]})
    }

    if(comando.toLowerCase() === "updatesystemp"){
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        // let dataSP = await sPuntos.findOne({_id: msg.guildId})

        let posiciones = 0
        let cant = 0
        for(let i=0; i<dB.length; i++){
            if(!msg.guild.members.cache.get(dB[i].miembroID)){
                console.log(Number(i-cant))
                let sum = Number(i-cant)
                dB.splice(sum,1)
                posiciones = posiciones + 1
                cant = cant + 1
            }
            
            console.log("1. :",i)
            // for(let e=0; e<dataSP.sistema.length; e++){
            //     console.log("2. :",e)
            //     if(!msg.guild.members.cache.get(dataSP.sistema[e].miembroID)){
            //         dataSP.sistema.splice(e,1)
            //     }
            // }
        }
        // await dataSP.save()

        const embUpdateSistemP = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("✅ Sistema actualizado")
        .setDescription(`Se han eliminado datos de **${posiciones.toLocaleString()}** usuarios que no se encontraron en el servidor.`)
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUpdateSistemP]})
        }, 400)

        console.log(posiciones)
        console.log(dB)
    }

    if(comando.toLowerCase() === "removesystempuser"){
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(t=>{
                return;
            })
            tm.delete().catch(t=>{
                return;
            })
        },40000))

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando removesystempuser")
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}removesystempuser <Mención del miembro>${"``"}\n${"``"}${prefijo}removesystempuser <ID del miembro>${"``"}`},
            {name: "Ejemplos:", value: `${prefijo}removesystempuser ${msg.author}\n${prefijo}removesystempuser ${msg.author.id}`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let dataSP = await sPuntos.findOne({_id: msg.guildId})
        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`El argumento proporcionado no se reconoce como un miembro del servidor, proporciona una mención a un miembro o la ID del miembro que quieres eliminar del sistema de puntos.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!miembro){
            setTimeout(()=>{
                return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(t=> setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    t.delete().catch(c=>{
                        return;
                    })
                }, 40000))
            }, 400)
        }

        if(miembro){
            if(msg.author.id === msg.guild.ownerId){
                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El miembro es un bot, un bot no puede estar en el sistema de puntos.`)
                .setColor(ColorError)
                .setTimestamp()
                if(miembro.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No te puedes eliminar a ti mismo del sistema de puntos.`)
                .setColor(ColorError)
                .setTimestamp()
                if(miembro.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El miembro que proporcionaste no esta en el sistema de puntos.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!dataSP.sistema.some(s=> s.miembroID === miembro.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                let posicion 
                for(let i=0; i<dataSP.sistema.length; i++){
                    if(dataSP.sistema[i].miembroID === miembro.id){
                        posicion = i
                    }
                }

                dataSP.sistema.splice(posicion,1)
                await dataSP.save()

                const embRemoveUserSystem = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("🗑️ Miembro eliminado del sistema")
                .setDescription(`El miembro ${miembro} ha sido eliminado del sistema de puntos.`)
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRemoveUserSystem]})
                }, 400)
            }else{
                const embErr1 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El miembro es un bot, un bot no puede estar en el sistema de puntos.`)
                .setColor(ColorError)
                .setTimestamp()
                if(miembro.user.bot) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr2 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`No te puedes eliminar a ti mismo del sistema de puntos.`)
                .setColor(ColorError)
                .setTimestamp()
                if(miembro.id === msg.author.id) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr3 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El miembro proporcionado tiene un rol igual o mayor que tu rol mas alto por lo tanto no lo puedes eliminar de la base de datos del sistema.`)
                .setColor(ColorError)
                .setTimestamp()
                if(msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<=0) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                const embErr4 = new Discord.MessageEmbed()
                .setAuthor("❌ Error")
                .setDescription(`El miembro que proporcionaste no esta en el sistema de puntos.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!dataSP.sistema.some(s=> s.miembroID === miembro.id)) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr4]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                },40000))

                let posicion 
                for(let i=0; i<dataSP.sistema.length; i++){
                    if(dataSP.sistema[i].miembroID === miembro.id){
                        posicion = i
                    }
                }

                dataSP.sistema.splice(posicion,1)
                await dataSP.save()

                const embRemoveUserSystem = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("🗑️ Miembro eliminado del sistema")
                .setDescription(`El miembro ${miembro} ha sido eliminado del sistema de puntos.`)
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRemoveUserSystem]})
                }, 400)
            }
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

    if(comando === "infoCH" && creadoresID.some(s=> s === msg.author.id)){
        let canal = client.channels.cache.get(args[0])
        let servidor = canal.guild

        const embCanales = new Discord.MessageEmbed()
        .setAuthor(`${client.users.cache.get(servidor.ownerId).tag} - ${servidor.ownerId}`,client.users.cache.get(servidor.ownerId).displayAvatarURL({dynamic: true}))
        .setDescription(`Servidor:\n${servidor.name}\n${servidor.id}\n\nCanal: ${canal.name}`)
        .setColor(servidor.me.displayHexColor)
        .setThumbnail(servidor.iconURL({dynamic: true}))
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embCanales]})
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

    if(comando === "statsinterp" && creadoresID.some(s => s === msg.author.id)){
        let dataIP = await interP.findOne({Nombre: "Inter promocion"})

        let servidoresSi = []

        let servidoresNo = []

        for(let i=0; i<dataIP.canalID.length; i++){
            if(client.channels.cache.get(dataIP.canalID[i])){
                servidoresSi.push(dataIP.serverID[i])
            }else{
                servidoresNo.push(dataIP.serverID[i])   
            }
        }

        const embStatsIP = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("Estadisticas del seistema de Inter promoción")
        .addFields(
            {name: "Datos validos:", value: `${servidoresSi.length}`},
            {name: "Datos no validos:", value: `${servidoresNo.length}`}
        )
        .setColor(colorEmb)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embStatsIP]})
    }

    if(comando === "deletefalsedata" && creadoresID.some(s => s === msg.author.id)){
        let dataIP = await interP.findOne({Nombre: "Inter promocion"})

        let servers = []
        let channels = []
        let authores = []

        for(let e=0; e<dataIP.serverID.length; e++){
            for(let i=0; i<dataIP.serverID.length; i++){
                if(!client.channels.cache.get(dataIP.canalID[i])){
                    servers.push(dataIP.serverID[i])
                    channels.push(dataIP.canalID[i])
                    authores.push(dataIP.autor[i])
    
                    dataIP.serverID.splice(i,1)
                    dataIP.canalID.splice(i,1)
                    dataIP.autor.splice(i,1)
                }
            }
        }

        if(servers.length <= 0){
            const embDelDIP = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("No hay datos invalidos.")
            .setColor(colorEmb)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDelDIP]})

        }else{
            const embDelDIP = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("Datos inválidos eliminados de la base de datos.")
            .setDescription(`Información de los datos eliminados de la base de datos.\n\n**Servidores:**\n${servers.map(s=> s).join(" **|** ")}\n**Canales:**\n${channels.map(c=> c).join(" **|** ")}\n**Autores:**\n${authores.map(a=> a).join(" **|** ")}`)
            .setColor(colorEmb)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDelDIP]})
            await dataIP.save()
        }
    }
})


// Registro de nuevo servidor 
client.on("guildCreate", async gc => {
    let creador = gc.members.cache.get(gc.ownerId)
    
    const embGC = new Discord.MessageEmbed()
    .setAuthor(creador.user.tag,creador.user.displayAvatarURL({dynamic: true}))
    .setThumbnail(gc.iconURL({dynamic: true}))
    .setTitle("➕ Añadido en un nuevo servidor")
    .addFields(
        {name: `**${gc.name}**`, value: `🆔 ${gc.id}\n👥 ${gc.members.cache.filter(fm => !fm.user.bot).size}\n🤖 ${gc.members.cache.filter(fb => fb.user.bot).size}\n📅 <t:${Math.round(gc.createdAt / 1000)}:R>`}
    )
    .setColor("GREEN")
    .setTimestamp()
    client.channels.cache.get("838457311684853827").send({embeds: [embGC]})
})

// Registro de expulsion de servidor
client.on("guildDelete",async gd => {
    let creador = gd.members.cache.get(gd.ownerId)
    const embGD = new Discord.MessageEmbed()
    .setAuthor(creador.user.tag,creador.user.displayAvatarURL({dynamic: true}))
    .setThumbnail(gd.iconURL({dynamic: true}))
    .setTitle("➖ Expulsado de un servidor")
    .addFields(
        {name: `**${gd.name}**`, value: `🆔 ${gd.id}\n👥 ${gd.members.cache.filter(fm => !fm.user.bot).size}\n🤖 ${gd.members.cache.filter(fb => fb.user.bot).size}\n📅 Creado:\n<t:${Math.round(gd.createdAt / 1000)}:R>`}
    )
    .setColor("RED")
    .setTimestamp()
    client.channels.cache.get("838457311684853827").send({embeds: [embGD]})

})

client.on("channelDelete",async cdl => {
    let dataIP = await interP.findOne({Nombre: "Inter promocion"})
    if(dataIP.canalID.some(s => s === cdl.id)){
        let num = dataIP.canalID.indexOf(cdl.id)
        dataIP.serverID.splice(num,1)
        dataIP.canalID.splice(num,1)
        dataIP.autor.splice(num,1)
        return await dataIP.save()
    }
})


client.login(token);