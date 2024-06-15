const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

const FCM_SERVER_KEY = 'AAAAAc4ekf0:APA91bFvHr52ngS3hrfuOkAO2wOMJDZcPiATeLcyW9Kw-pabB9tU6QGz6tdAwExgrwvOmcK8P5B_1oTDC_fvjEsBXAJipF1b1AEzOrbcoyA43MeLR4yfoK-t0oZ2b78xYWWj7gPcznl4'; // Substitua pelo seu FCM_SERVER_KEY

app.use(cors());
app.use(bodyParser.json());

app.post('/order', async (req, res) => {
    const pedido = req.body;
    const mensagem = {
        notification: {
            title: 'Novo Pedido Recebido',
            body: `Pedido de ${pedido.nomeSobrenome} recebido.`,
            icon: 'https://your-domain.com/path/to/icon.png'
        },
        to: '/topics/admin'
    };

    try {
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Authorization': `key=${FCM_SERVER_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mensagem)
        });

        const data = await response.json();
        console.log('Resposta do FCM:', data);
        res.sendStatus(200);
    } catch (error) {
        console.error('Erro ao enviar notificação:', error);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
