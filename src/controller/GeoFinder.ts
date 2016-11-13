/**
 * Created by justin on 2016/11/9.
 */

import http = require('http');

interface GeoResponse {
    lat?: number;
    lon?: number;
    error?: string;
}

export default class GeoFinder {
    private html:string = "http://skaha.cs.ubc.ca:8022/api/v1/team77/";

    constructor() {}

    public processGeoFinder(address: string): Promise<GeoResponse>  {
        var returnArr: string[];
        var url = this.html+ encodeURIComponent(address);
        return new Promise(function(fulfill, reject) {
            http.get(url, function(res){
                var body = '';
                res.on('data', function(chunck: any) {
                    body += chunck;
                });
                res.on('end', function(){
                    body = body.trim();
                    let res: GeoResponse = {};
                    if(body.indexOf("\"lat\":") != -1) {
                        res.lat  = parseFloat(body.substring(body.indexOf("\"lat\":")+6,body.indexOf(",")));
                    }
                    if(body.indexOf("\"lon\":") != -1) {
                        res.lon  = parseFloat(body.substring(body.indexOf("\"lon\":")+6,body.indexOf("}")));
                    }
                    if(body.indexOf("\"error\":") != -1) {
                        res.error  = (body.substring(body.indexOf(":")+2,body.indexOf("}")-1));
                    }
                    fulfill(res);
                });

            }).on('error', function(e: any) {
                console.log("Got error: " + e.message);
                reject(e);
            });
        })



    }
}/**
 * Created by Adil Imtiaz on 12-11-2016.
 */
