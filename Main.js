const http = require('http');
const webpush = require('web-push');

const port = process.env.PORT || 1000;

let Data = [];

const keys = {
    "public": process.env.public_key,
    "private": process.env.private_key
};

webpush.setVapidDetails(
    'mailto:sigmentiumplay@gmail.com',
    keys.public,
    keys.private
);

async function infoNotification() {
    const notification = JSON.stringify({
        title: 'Твой авторитет снова упал!',
        body: 'Твой авторитет уже ниже плинтуса.\nА мы напоминаем, что у нас в Sigmentium ты можешь не только поднять авторитет, но и приумножить его 😉'
    });

    for (let A of Data) {
        await webpush.sendNotification(A, notification);
    }
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'sigmentium.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/subscribe') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            Data.push(JSON.parse(body));

            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify({ successful: true }));
            return;
        });
        return;
    }

    // if (req.method === 'POST' && req.url === '/api/warnNotification') {
    //     const notification = JSON.stringify({
    //         title: 'Вход на новом устройстве',
    //         body: 'Был осуществлён вход на новом устройстве.\nЕсли это были не вы, то скорее зайдите:\nНастройки - общее - сеансы. Далее выберите устройство которое вам незнакомо, и нажмите "Завершить сеанс"'
    //     });
    // }
});

server.listen(port, '0.0.0.0', () => {
    console.log('> Successful start');
});

setInterval(infoNotification, 60000);