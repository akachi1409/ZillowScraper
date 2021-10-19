const axios = require("axios").default;
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const moment = require("moment");

const zillow = "https://www.zillow.com";
const delay = require('delay');

const base = "https://www.zillow.com/browse/homes/";
const endpoint = "https://www.zillow.com";
var zillowStart = async function(con) {
    console.log("fetching data from test....");

    var qr = 'SELECT COUNT(*) AS num FROM 3invest_data_test.zillow';
    const capacity_temp = await con.query(qr);
    capacity_temp[0].map(row => {
        capacity = row.num;
    })

    const res = await got(base);
    const dom = new JSDOM(res.body);
    const document = dom.window.document;
    let nodes= document.querySelectorAll(".bh-body-links a");
    console.log("States count: ", nodes.length, "  ...need to wait for one minute");
    await delay ( 1000);
    // gathers all states
    
    for (var i = 0 ; i< nodes.length; i++){
        console.log("Step 1 : ",endpoint+ nodes[i].href)
        var res1 = await got(endpoint + nodes[i].href)
        const dom1 = new JSDOM(res1.body);
        const document1 = dom1.window.document;
        let nodes1 = document1.querySelectorAll(".bh-g div section ul li a");
        let value1 = Math.floor(Math.random() * 10)
        console.log( "County count: ", nodes1.length, "  :", value1, "s");
        await delay(500* value1);
    //     // 
        for (var j = 0 ; j<nodes1.length; j= j + 2){
            var res2 = await got (endpoint + nodes[i].href+ "/" + nodes1[j].href);
            const dom2 = new JSDOM(res2.body);
            const document2 = dom2.window.document;
            let nodes2 = document2.querySelectorAll(".bh-g div section ul li a");
            let value2 = Math.floor(Math.random() * 10)
            console.log( "Zip count: ", nodes2.length, "  :", 2* value2, "s");
            await delay(500* value2);
            // gathers zip
            for ( var x = 0 ; x< nodes2.length; x++){
                var res3 = await got (endpoint + nodes[i].href+ "/" + nodes1[j].href + "/" + nodes2[x].href);
                const dom3 = new JSDOM(res3.body);
                const document3 = dom3.window.document;
                let nodes3 = document3.querySelectorAll(".bh-g div section ul li a")
                let value3 = Math.floor(Math.random() * 10)
                console.log( "Address count: ", nodes3.length, "  :", value3, "s");
                await delay(500*value3);
                for (var y = 0 ; y< nodes3.length ; y++){
                    var res4 = await got (endpoint + nodes[i].href+ "/" + nodes1[j].href + "/" + nodes2[x].href + "/" + nodes3[y].href);
                    const dom4 = new JSDOM(res4.body);
                    const document4 = dom4.window.document;
                    let nodes4 = document4.querySelectorAll(".bh-g div section ul li a");
                    let value4 = Math.floor(Math.random() * 10)
                    console.log( "Address count: ", nodes4.length, "  :", value4, "s");
                    await delay(500*value4);
                    for (var z = 0 ; z< nodes4.length ; z++){
                        var res5 = await got (endpoint + nodes4[z].href);
                        console.log("url: ", endpoint + nodes4[z].href)
                        const virtualConsole = new jsdom.VirtualConsole();
                        const dom5 = new JSDOM(res5.body, { virtualConsole });
                        const document5 = dom5.window.document;
                        const data = {};
                        let status;
                        status = document5.querySelector(".TriggerText-c11n-8-48-0__sc-139r5uq-0");
                        if (status == null)
                            status = document5.querySelector(".hdp__sc-xvht8h-0.gDztRH.ds-status-details")
                        data.status = status.textContent;
                        data.url = endpoint + nodes4[z].href
                        let fullAddress = document5.getElementById("ds-chip-property-address")
                        data.fullAddress = fullAddress.textContent;
                        console.log("data: ", data);
                        let value5 = Math.floor(Math.random() * 10)
                        console.log( value5, "s");
                        await delay( 500*value5);

                        const cdate = moment().format("YYYY-MM-DD");
                        const ctime = moment().format("HH:mm:ss");
                        
                        const queryInsert =
                            "INSERT IGNORE INTO zillow (  fulladdress, status, url, cdate, ctime) VALUES (?,?,?,?,?) ";
                        const queryUpdate = "UPDATE zillow SET ctime = ? WHERE SUBSTR(cdate,1,10)=CURDATE()";
                        if (capacity==0 ){
                            await con.query(
                                queryInsert, [
                                   data.fulladdress,
                                   data.status,
                                   data.url,
                                   cdate,
                                   ctime
                                ]
                            );
                        }
                        else
                            await con.query(queryUpdate, [ctime])   
                    }
                }
            }
        }
    }
}

exports.zillowStart = zillowStart