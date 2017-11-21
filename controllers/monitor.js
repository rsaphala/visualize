const axios = require('axios');

const monitor = (req, res) => {

    // monitor circuit

    getBoth().then(data => {
        console.log(data.log);
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
            // console.log(response.data);
            resolve(response.data.rsBody);
        }).catch((error) => {
            reject(error); return;
        });

    });
    
}



module.exports = {monitor};