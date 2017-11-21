const axios = require('axios');

const monitor = (req, res) => {

    // monitor circuit

    getBoth().then(data => {
        // console.log(data.log.date);
        res.render("index", {response: data});
    });

    
}

async function getBoth() {
    const status = await getMonitorCircuit();
    const log = await getCircuitLog();

    return {status: status, log: log};
}

function getMonitorCircuit() {
    return new Promise( (resolve, reject) => {
        axios({
            method: 'POST',
            url: 'http://smith.tnis.com/sav_txn/v1/monitor/circuit', 
            headers: {
                "Content-Type":"application/json",
                'x-request-id':'c0d519ea-c3bd-4818-8f86-8b67dc876457',
                "x-real-ip":"localhost",
                "x-caller-service":"client",
                "x-caller-domain":"caller-domain",
                "x-device":"android",
                "datetime":"2017-08-24T13:43:56.41906615Z",
                "accept":"application/json"
            },
            data: {
                "rqBody": {
                    "route" : "tran_code",
                    "service": "general_transaction_rule"
                }
            }
        }).then((response) => {
            // console.log(response.data);
            resolve(response.data.rsBody);
        }).catch((error) => {
            reject(error); return;
        });

    });
    
}

function getCircuitLog() {
    return new Promise( (resolve, reject) => {
        axios({
            method: 'POST',
            url: 'http://smith.tnis.com/sav_txn/v1/monitor/circuit_log', 
            headers: {
                "Content-Type":"application/json",
                'x-request-id':'c0d519ea-c3bd-4818-8f86-8b67dc876457',
                "x-real-ip":"localhost",
                "x-caller-service":"client",
                "x-caller-domain":"caller-domain",
                "x-device":"android",
                "datetime":"2017-08-24T13:43:56.41906615Z",
                "accept":"application/json"
            },
            data: {
                "rqBody": {
                    "route" : "tran_code",
                    "range": 7
                }
            }
        }).then((response) => {
            console.log(response.data.rsBody.Data);
            var date = [];
            var failed = [];
            var tripped = [];

            response.data.rsBody.Data.forEach((el) => {
                var dateOnly = el.createdat.split('T')[0] + "";

                if( date.length == 0 || date.indexOf(dateOnly) === -1 ) {
                    date.push(dateOnly);
                    if(el.fail) failed.push(1);
                    else failed.push(0); 

                    if(el.tripped) tripped.push(1);
                    else tripped.push(0);
                } 
            });

            result = {
                date: date.sort(),
                failed: failed,
                tripped: tripped
            }
            console.log(result)
            resolve(result);
        }).catch((error) => {
            reject(error); return;
        });

    });
    
}



module.exports = {monitor};