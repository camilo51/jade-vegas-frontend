const { Telegraf, Markup } = require("telegraf");
const cron = require("node-cron");
const { Client } = require("pg");

const BOT_TOKEN_1 = "6441888027:AAEgcNTRqojLgSsC0VDqZ9PUTqlNtnfo4aM";
const BOT_TOKEN_3 = "6790015621:AAHFFuJ8F3f2crRz9HyAirA8PMyDM7mEQC8";
const BOT_TOKEN_6 = "7181907496:AAHigAV5yl7iEvpJBcjJUXvl4vKDMRRV0QY";
const BOT_JADEVEGAS = "6791491872:AAGjijcSLFqX_aBQWBt6y0E38Xz1pqphI6Q";
const POSTGRES_CONNECTION_STRING =
    "postgres://root:Sgu9vjheQzvVWDd9OwluK3uo5ldQZznj@dpg-cnka3u21hbls739sn000-a.oregon-postgres.render.com/bbwlovejadevegas";

// Crear cliente para la base de datos
const client = new Client({
    connectionString: POSTGRES_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Conectar a la base de datos
client.connect();

// Crear bots de Telegraf
const bot1 = new Telegraf(BOT_TOKEN_1);
const bot3 = new Telegraf(BOT_TOKEN_3);
const bot6 = new Telegraf(BOT_TOKEN_6);
const JADE_VEGAS = new Telegraf(BOT_JADEVEGAS);

// Cron job para procesar la base de datos
cron.schedule("*/10 * * * * *", async () => {
    try {
        const timestampActual = Date.now();
        const query = `SELECT * FROM Autentications WHERE time <= ${timestampActual}`;
        const result = await client.query(query);
        result.rows.forEach(async (row) => {
            try {
                const memberInfo = await JADE_VEGAS.telegram.getChatMember(
                    row.chat_id,
                    row.id_telegram
                );
                if (memberInfo.user.id === parseInt(row.id_telegram)) {
                    try {
                        await JADE_VEGAS.telegram.unbanChatMember(
                            row.chat_id,
                            row.id_telegram
                        );
                        const deleteQuery = `DELETE FROM Autentications WHERE time <= ${timestampActual}`;
                        await client.query(deleteQuery);
                    } catch (error) {
                        console.error("Error al expulsar al usuario:", error);
                    }
                } else {
                    console.error(
                        "El miembro no fue encontrado en el chat:",
                        row.id_telegram
                    );
                }
            } catch (error) {
                console.error(
                    "Error al obtener información del miembro:",
                    error
                );
            }
        });
    } catch (error) {
        console.error("Error al ejecutar la consulta SQL:", error);
    }
});

const query = `
  INSERT INTO Autentications (id_telegram, time, chat_id)
  VALUES ($1, $2, $3)
  RETURNING *;
`;
// Evento para nuevos miembros del chat

bot1.on("new_chat_members", async (ctx) => {
    const timestampExpiracion = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const values = [
        ctx.message.from.id,
        timestampExpiracion,
        ctx.message.chat.id,
    ];
    try {
        const res = await client.query(query, values);
        console.log("Datos insertados correctamente:", res.rows[0]);
    } catch (error) {
        console.error("Error al insertar datos en la base de datos:", error);
    }
});

bot3.on("new_chat_members", async (ctx) => {
    const timestampExpiracion = Date.now() + 3 * 30 * 24 * 60 * 60 * 1000;
    const values = [
        ctx.message.from.id,
        timestampExpiracion,
        ctx.message.chat.id,
    ];
    try {
        const res = await client.query(query, values);
        console.log("Datos insertados correctamente:", res.rows[0]);
    } catch (error) {
        console.error("Error al insertar datos en la base de datos:", error);
    }
});

bot6.on("new_chat_members", async (ctx) => {
    const timestampExpiracion = Date.now() + 6 * 30 * 24 * 60 * 60 * 1000;
    const values = [
        ctx.message.from.id,
        timestampExpiracion,
        ctx.message.chat.id,
    ];
    try {
        const res = await client.query(query, values);
        console.log("Datos insertados correctamente:", res.rows[0]);
    } catch (error) {
        console.error("Error al insertar datos en la base de datos:", error);
    }
});

// ----------------------- [ BOT PARA SUBIR VIDEOS ] ----------------------------------
const userChoices = {};
const userTitles = {};
// Grupos según las membresías (reemplaza con tus IDs de grupos)
const groups = {
    Premium: ["-1002104147541", "-1002081965430", "-1002118911920"],
    Standard: ["-1002052214052", "-1002071740646", "-1002120513049"],
    Basic: ["-1002112239832", "-1002097069886", "-1002107936723"],
};

// Comando personalizado para iniciar la conversación
JADE_VEGAS.command("subirvideo", (ctx) => {
    const buttons = Markup.inlineKeyboard([
        Markup.button.callback("Premium", "premium"),
        Markup.button.callback("Standard", "standard"),
        Markup.button.callback("Basic", "basic"),
    ]);
    ctx.reply("Selecciona la membresía para publicar el video:", buttons);
});

// Manejador para los botones de membresía
JADE_VEGAS.action("premium", (ctx) => handleMembership(ctx, "Premium"));
JADE_VEGAS.action("standard", (ctx) => handleMembership(ctx, "Standard"));
JADE_VEGAS.action("basic", (ctx) => handleMembership(ctx, "Basic"));

// Función para manejar la elección de membresía
function handleMembership(ctx, choice) {
    userChoices[ctx.from.id] = choice;
    ctx.reply(
        `Has seleccionado la membresía: ${choice}. Ahora envía el video.`
    );
}

// Manejador para recibir el video
JADE_VEGAS.on("video", (ctx) => {
    const userId = ctx.from.id;
    const videoFileId = ctx.message.video.file_id;
    userTitles[userId] = videoFileId; // Almacenar el videoFileId temporalmente

    ctx.reply("Ahora envía el título del video.");
});

// Manejador para recibir el título del video
JADE_VEGAS.on("text", (ctx) => {
    const userId = ctx.from.id;
    const selectedMembership = userChoices[userId];
    const videoFileId = userTitles[userId];

    if (!selectedMembership) {
        ctx.reply("Primero selecciona una membresía.");
        return;
    }

    if (!videoFileId) {
        ctx.reply("Primero envía el video.");
        return;
    }

    // Lógica para publicar el video en los grupos correspondientes
    const membershipOrder = ["Basic", "Standard", "Premium"];
    const selectedMembershipIndex = membershipOrder.indexOf(selectedMembership);

    for (let i = selectedMembershipIndex; i < membershipOrder.length; i++) {
        const currentMembership = membershipOrder[i];
        for (const groupId of groups[currentMembership]) {
            ctx.telegram.sendVideo(groupId, videoFileId, {
                caption: ctx.message.text,
            });
        }
    }

    ctx.reply(
        `Video recibido y publicado en grupos ${selectedMembership} con el título: ${ctx.message.text}.`
    );
});

bot1.launch();
bot3.launch();
bot6.launch();
JADE_VEGAS.launch();
