const axios = require('axios');
const fs = require('fs');
const dataJSON = require('../data.json');
const filePath = __dirname+'/../data.json';

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
    console.log(new Date());
    var title = [];
    var result = [];
    var max = dataJSON.length;

    dataJSON.forEach((el) => {

    });

    fs.readFile(filePath, (err, data) => {
        jsondata = JSON.parse(data);
        var max = jsondata.length;
        
        jsondata.forEach((el) => {
            getBoth(el.request)
                .then(data => {
                    console.log(data)
                    if( data.status !== -1 && data.log !== -1 ) {
                        title.push(data.status.route);
                        result.push(data);
    
                        // console.log(result.length)
                        if (result.length == max) {
                            res.render("index", {response: result, title: title});
                        }
                    }

                    // res.send('Please boot up your server!');
                    
                })
                .catch(() => {
                    // console.log(error);
                    console.log('so nice');
                });
        });
        
        // res.send("hello");
    });
    
}

async function getBoth(request) {
    const status = await getMonitorCircuit(request[0].url, request[0].data).catch(()=> {
        return -1;
    });
    const log = await getCircuitLog( request[1].url, request[1].data ).catch(()=> {
        return -1;
    });
    return { status, log};
}

function getMonitorCircuit(url, data) {
    return new Promise( (resolve, reject) => {
        axios({
            method: 'POST',
            url: url, 
            headers: headers,
            data: data,
        }).then((response) => {
            console.log(response.data.rsBody);

            const result = {
                rsBody: response.data.rsBody,
                route: data.rqBody.route
            };
            resolve(result);
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
            // console.log(response.data.rsBody.Data);
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


async function getOneCircuit(request) {
    const status = await getMonitorCircuit(request[0].url, request[0].data).catch(()=>{
        return -1;
    });
    return {status};
}

const getCircuit = (req, res) => {
    console.log(new Date());
    var result = [];
    fs.readFile(filePath, (err, data) => {
        jsondata = JSON.parse(data);
        var max = jsondata.length;

        jsondata.forEach((el) => {
            getOneCircuit(el.request)
            .then(data => {
                console.log(data)
                if( data.status !== -1) {
                    result.push(data);

                    // console.log(result.length)
                    if (result.length == max) {
                        res.send({response: result});
                    }
                }

                // res.send('Please boot up your server!');
                
            })
            .catch(() => {
                // console.log(error);
                console.log('so nice');
            });
        });
    });
}

async function getOneCircuitLog(request) {
    const log = await getCircuitLog( request[1].url, request[1].data ).catch(()=>{
        return -1;
    });
    return {log};
}

const getCircuitLogEndpoint = (req, res) => {
    console.log('-------------')
    console.log(dataJSON[0]);
    console.log('-------------')
    console.log(new Date());
    var result = [];
    fs.readFile(filePath, (err, data) => {
        jsondata = JSON.parse(data);
        var max = jsondata.length;

        jsondata.forEach((el) => {
            getOneCircuitLog(el.request)
            .then(data => {
                console.log(data)
                if( data.log !== -1) {
                    result.push(data);

                    // console.log(result.length)
                    if (result.length == max) {
                        res.send({response: result});
                    }
                }

                // res.send('Please boot up your server!');
                
            })
            .catch(() => {
                // console.log(error);
                console.log('so nice');
            });
        });
    });
}

module.exports = {monitor, getCircuit, getCircuitLogEndpoint};