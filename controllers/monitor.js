const axios = require('axios');
const fs = require('fs');

// set headers
const headers = {
    "Content-Type":"application/json",
    'x-request-id':'c0d519ea-c3bd-4818-8f86-8b67dc876457',
    "x-real-ip":"localhost",
    "x-caller-service":"client",
    "x-caller-domain":"caller-domain",
    "x-device":"android",
    "datetime":"2017-08-24T13:43:56.41906615Z",
    "accept":"application/json"
};

const monitor = (req, res) => {
    filePath = __dirname+'/../data.json';
    fs.readFile(filePath, (err, data) => {
        jsondata = JSON.parse(data);

       
        getBoth(jsondata[0].request).then(data => {
            // console.log(data.log.date);
            res.render("index", {response: data, title: '/tran_code'});
        });
        
    });
    
}

async function getBoth(request) {
    const status = await getMonitorCircuit(request[0].url, request[0].data);
    const log = await getCircuitLog( request[1].url, request[1].data );

    return {status: status, log: log};
}

function getMonitorCircuit(url, data) {
    return new Promise( (resolve, reject) => {
        axios({
            method: 'POST',
            url: url, 
            headers: headers,
            data: data,
        }).then((response) => {
            // console.log(response.data);
            resolve(response.data.rsBody);
        }).catch((error) => {
            reject(error); return;
        });

    });
    
}

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].date === nameKey) {
            return myArray[i];
        }
    }
    return -1;
}

function getCircuitLog(url, data) {
    return new Promise( (resolve, reject) => {
        axios({
            method: 'POST',
            url: url, 
            headers: headers,
            data: data
        }).then((response) => {
            console.log(response.data.rsBody.Data);
            var result = [];

            response.data.rsBody.Data.forEach((el) => {
                var obj = {
                    date: '',
                    failed: {
                        true: 0,
                        false: 0
                    },
                    tripped: {
                        true: 0,
                        false: 0
                    }
                };
                var dateOnly = el.createdat.split('T')[0];

                if ( search(dateOnly, result) === -1 ) {
                    obj.date = dateOnly;
                    result.push(obj);
                }

                var found = search(dateOnly, result);
                if( found  !== -1 ) {
                    ( el.fail )? found.failed.true++ : found.failed.false++ ;
                    ( el.tripped )? found.tripped.true++ : found.tripped.false++ ;
                }
                
            });
            var date = [];
            var failedTrue = [];
            var failedFalse = [];
            var trippedTrue = [];
            var trippedFalse = [];
            result.forEach((el) => {
                date.push(el.date);
                failedTrue.push(el.failed.true);
                failedFalse.push(el.failed.false);
                trippedTrue.push(el.tripped.true);
                trippedFalse.push(el.tripped.false);
            });
            // console.log(result);

            endResult = {
                date: date,
                failedTrue: failedTrue,
                failedFalse: failedFalse,
                trippedTrue: trippedTrue,
                trippedFalse: trippedFalse,
            }
            console.log(endResult)
            resolve(endResult);
        }).catch((error) => {
            reject(error); return;
        });

    });
    
}



module.exports = {monitor};