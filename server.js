const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const FCM_SERVER_KEY = 'AAAAAc4ekf0:APA91bFvHr52ngS3hrfuOkAO2wOMJDZcPiATeLcyW9Kw-pabB9tU6QGz6tdAwExgrwvOmcK8P5B_1oTDC_fvjEsBXAJipF1b1AEzOrbcoyA43MeLR4yfoK-t0oZ2b78xYWWj7gPcznl4'; // Substitua pelo seu FCM_SERVER_KEY

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Rota para obter produtos
app.get('/api/products', (req, res) => {
    fs.readFile(path.join(__dirname, 'public/products.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler o arquivo de produtos.');
        }
        res.send(JSON.parse(data));
    });
});

// Rota para adicionar/editar produtos
app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    fs.readFile(path.join(__dirname, 'public/products.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler o arquivo de produtos.');
        }
        const products = JSON.parse(data);
        if (newProduct.index !== undefined) {
            products[newProduct.index] = newProduct.product;
        } else {
            products.push(newProduct.product);
        }
        fs.writeFile(path.join(__dirname, 'public/products.json'), JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar o produto.');
            }
            res.send('Produto salvo com sucesso.');
        });
    });
});

// Rota para excluir produtos
app.delete('/api/products/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    fs.readFile(path.join(__dirname, 'public/products.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler o arquivo de produtos.');
        }
        const products = JSON.parse(data);
        products.splice(index, 1);
        fs.writeFile(path.join(__dirname, 'public/products.json'), JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao excluir o produto.');
            }
            res.send('Produto excluído com sucesso.');
        });
    });
});

// Rota existente para pedidos
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
