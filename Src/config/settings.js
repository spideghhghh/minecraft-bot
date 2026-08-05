module.exports = {
    server: {
        host: process.env.SERVER_HOST || 'localhost',
        port: parseInt(process.env.SERVER_PORT, 10) || 25565,
        version: process.env.MC_VERSION || '1.20.4'
    },
    bot: {
        username: process.env.BOT_USERNAME || 'AdminBot',
        authType: process.env.AUTH_TYPE || 'offline'
    },
    web: {
        port: process.env.PORT || 3000
    },
    events: {
        intervalMinutes: parseInt(process.env.EVENT_INTERVAL_MINUTES, 10) || 15,
        currencySymbol: process.env.CURRENCY_SYMBOL || '$'
    },
    antiAfkSeconds: parseInt(process.env.ANTI_AFK_INTERVAL_SECONDS, 10) || 180,
    reconnectDelay: 10000 // 10 ثوانٍ قبل إعادة المحاولة عند السقوط
};
