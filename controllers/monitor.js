const helpers = require('./helpers');
const axios = require('axios');
const dataJSON = require('../data.json');

// const getHome = (req, res) => {
//     res.render('index', {})
// }

const monitorLog = (req, res) => {
    console.log(new Date());
    
    // read json
    // status
   
    // log
    const { url, data } = dataJSON.log;

    axios({
        method: 'POST',
        url: url, 
        headers: helpers.headers,
        data: data[req.params.id]
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
            title: data[req.params.id].rqBody.route
        }
        console.log(endResult)
        res.send({ response : endResult });
    }).catch((error) => {
        console.log(error);
    });

    
};

const monitorStatus = (req, res) => {
    const { url, data } = dataJSON.status;
    let result = [];
    const max = data.length;

    data.map((rqBody, idx) =>  {
        // get status
        axios({
            method: 'POST',
            url: url, 
            headers: helpers.headers,
            data: rqBody,
        }).then((response) => {
    
            let tmp = {
                status: response.data.rsBody,
                route: rqBody.rqBody.route
            };
            result.push(tmp);
            console.log(result);
            
            if ( result.length === max ) {
                res.render('index', {resultStatus : result});
            }
        }).catch((error) => {
            console.log(error.message);
        });
    });
}

const monitorStatusInterval = (req, res) => {
    const { url, data } = dataJSON.status;
    let result = [];
    const max = data.length;

    data.map((rqBody, idx) =>  {
        // get status
        axios({
            method: 'POST',
            url: url, 
            headers: helpers.headers,
            data: rqBody,
        }).then((response) => {
    
            let tmp = {
                status: response.data.rsBody,
                route: rqBody.rqBody.route
            };
            result.push(tmp);
            console.log(result);
            
            if ( result.length === max ) {
                res.send({resultStatus : result});
            }
        }).catch((error) => {
            console.log(error.message);
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


module.exports = { monitorLog, monitorStatus, monitorStatusInterval };
