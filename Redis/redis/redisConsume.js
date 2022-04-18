var redis = require('redis');
var redisClient = redis.createClient();
console.log("Don't forget to activate Docker")
redisClient.connect()

redisClient.on('error', function (err) {
    console.log(err)
});


redisClient.on('connect', function () {
    console.log('Reciver connected to Redis');
});


//set expiration time for Ten Minutes Avarage Waiting Time
async function set10MinExpire(avg) {
    redisClient.get('tenMinWaitTime').then((data) => {
        if (data === null) {
            redisClient.set('tenMinWaitTime', avg, (err, reply) => {
                if (err) console.log(err)
            })
            redisClient.PEXPIRE('tenMinWaitTime', 600000, (err, resp) => {
                if (err) console.log(err)
            })
        } else {
            redisClient.set('tenMinWaitTime', avg, { KEEPTTL: true })
        }
    });
}

async function set5MinExpire(avg) {
    redisClient.get('fiveMinWaitTime').then((data) => {
        if (data === null) {
            redisClient.set('fiveMinWaitTime', avg, (err, reply) => {
                if (err) console.log(err)
            })
            redisClient.PEXPIRE('fiveMinWaitTime', 300000, (err, resp) => {
                if (err) console.log(err)
            })
        } else {
            redisClient.set('fiveMinWaitTime', avg, { KEEPTTL: true })
        }
    });
}

async function setExpireCalls(expire) {
    my_list = ["totalCalls", "Joining", 'Disconnecting', 'Service', 'Complaint']
    for (const item of my_list) {
        await redisClient.EXPIRE(item, expire, (err, resp) => {
            if (err) console.log(err)
        })
    }
}

async function updateRedis(data) {

    const call = JSON.parse(data.value)

    await redisClient.incr('totalCalls', { KEEPTTL: true }, function (err, id) {
        redisClient.set('totalCalls', 1);
    })

    // increment type of call 
    await redisClient.incr(call.topic, { KEEPTTL: true }, function (err, id) {
        redisClient.set(call.topic, 1);
    })

    await redisClient.set('lastWaitingTime', call.waitTime)

    let avg = Math.floor((Date.now() - parseInt(call.id)) / 1000);
    await redisClient.get('waitingTime').then((data) => {
        if (data !== null) {
            avg = (Math.floor(data) + avg) / 2
        }
        redisClient.set('waitingTime', avg, { KEEPTTL: true })
    })

    // 24 Hours Time Expiration
    var nd = new Date().setHours(23, 59, 59);
    var expire = Math.floor((nd - Date.now()) / 1000);
    setExpireCalls(expire)

    set10MinExpire(avg)
    set5MinExpire(avg)

    console.log("New call inserted to redis!")
}

// // --------- APP VIEW -------------
// app.get('/', (req, res) => res.send('Hello World!'))

// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });



module.exports = {
    consumer: redisClient,
    setExpireCalls: setExpireCalls,
    updateRedis: updateRedis,
}