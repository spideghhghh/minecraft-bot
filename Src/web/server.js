const express = require('express');
const settings = require('../config/settings');

function startWebServer() {
    const app = express();
    const PORT = settings.web.port;

    // الواجهة الرئيسية لموقع الويب (Dashboard)
    app.get('/', (req, res) => {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Minecraft Admin Bot Status</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #0f172a;
                    color: #f8fafc;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .card {
                    background-color: #1e293b;
                    padding: 2.5rem;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
                    text-align: center;
                    max-width: 420px;
                    width: 90%;
                    border: 1px solid #334155;
                }
                .badge {
                    display: inline-block;
                    padding: 6px 14px;
                    background-color: #22c55e;
                    color: #052e16;
                    font-weight: bold;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    margin-bottom: 1.2rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                h1 { margin: 0 0 10px; font-size: 1.6rem; color: #38bdf8; }
                p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; }
                .uptime-box {
                    background-color: #0f172a;
                    padding: 12px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 1.1rem;
                    color: #facc15;
                    margin-top: 20px;
                    border: 1px solid #1e293b;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="badge">● Server Active 24/7</div>
                <h1>Minecraft Bot Keeper</h1>
                <p>Keep-alive web service is operational. Preventing container shutdown on Render / Replit.</p>
                <div class="uptime-box">
                    System Uptime: ${hours}h ${minutes}m ${seconds}s
                </div>
            </div>
        </body>
        </html>
        `;
        res.send(htmlResponse);
    });

    // نقطة استجابة خفيفة ومباشرة لخدمات Monitoring
    app.get('/ping', (req, res) => {
        res.status(200).send('PONG');
    });

    app.listen(PORT, () => {
        console.log(`[WEB SERVER] Keep-Alive Web Dashboard running on port ${PORT}`);
    });
}

module.exports = startWebServer;
