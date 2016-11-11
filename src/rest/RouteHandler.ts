/**
 * Created by rtholmes on 2016-06-14.
 */
import restify = require('restify');
import fs = require('fs');

import DatasetController from '../controller/DatasetController';
import {Datasets} from '../controller/DatasetController';
import QueryController from '../controller/QueryController';

import {QueryRequest} from "../controller/QueryController";
import Log from '../Util';

import {Route} from "restify";
import InsightFacade from "../controller/InsightFacade";
import {InsightResponse} from "../controller/IInsightFacade";

export default class RouteHandler {

    private static datasetController = new DatasetController();
    private static facade=new InsightFacade();

    public static getHomepage(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RoutHandler::getHomepage(..)');
        fs.readFile('./src/rest/views/index.html', 'utf8', function (err: Error, file: Buffer) {
            if (err) {
                res.send(500);
                Log.error(JSON.stringify(err));
                return next();
            }
            res.write(file);
            res.end();
            return next();
        });
    }

    public static  putDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RouteHandler::postDataset(..) - params: ' + JSON.stringify(req.params));
        try {
            var id: string = req.params.id;

            // stream bytes from request into buffer and convert to base64
            // adapted from: https://github.com/restify/node-restify/issues/880#issuecomment-133485821
            let buffer: any = [];
            req.on('data', function onRequestData(chunk: any) {
                Log.trace('RouteHandler::postDataset(..) on data; chunk length: ' + chunk.length);
                buffer.push(chunk);
            });

            req.once('end', function () {
                let concated = Buffer.concat(buffer);
                req.body = concated.toString('base64');
                Log.trace('RouteHandler::postDataset(..) on end; total length: ' + req.body.length);
                RouteHandler.facade.addDataset(id, req.body).then(function (result: InsightResponse) {
                    Log.trace('RouteHandler::postDataset(..) - processed'+result.code);
                    res.json(result.code,result.body);
                }).catch(function (err: InsightResponse) {
                    Log.trace('RouteHandler::postDataset(..) - ERROR: ' + err.body);
                    res.json(err.code,err.body );
                });
            });

        } catch (err) {
            Log.error('RouteHandler::postDataset(..) - ERROR: ' + err.message);
            res.send(400, {err: err.message});
        }
        return next();
    }

    public static postQuery(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RouteHandler::postQuery(..) - params: ' + JSON.stringify(req.params));
        try {
            let query: QueryRequest = req.params;
            RouteHandler.facade.performQuery(query).then(function(response:InsightResponse){
                console.log("This is the code" + response.code);
                console.log(response.body);
                res.json(response.code,response.body);
            }).catch(function (err: InsightResponse) {
                Log.trace('RouteHandler::postQuery(..) - ERROR: ' + err.body);
                console.log("This is the error" + err.code);
                res.json(err.code,err.body );
            });
        } catch (err) {
            Log.error('RouteHandler::postQuery(..) - ERROR: ' + err);
            res.send(400);
        }
        return next();
    }

    public static  deleteDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RouteHandler::deleteDataset(..) - params: ' + JSON.stringify(req.params));
        try {
            var id: string = req.params.id;

            // stream bytes from request into buffer and convert to base64
            // adapted from: https://github.com/restify/node-restify/issues/880#issuecomment-133485821
            let buffer: any = [];
            req.on('data', function onRequestData(chunk: any) {
                Log.trace('RouteHandler::deleteDataset(..) on data; chunk length: ' + chunk.length);
                buffer.push(chunk);
            });

            req.once('end', function () {
                let concated = Buffer.concat(buffer);
                req.body = concated.toString('base64');
                Log.trace('RouteHandler::deleteDataset(..) on end; total length: ' + req.body.length);
                try {
                    RouteHandler.facade.removeDataset(id).then(function(res2:InsightResponse){
                        res.json(res2.code,res2.body);
                    }).catch(function (err: InsightResponse) {
                        Log.trace('RouteHandler::deleteQuery(..) - ERROR: ' + err.body);
                        res.json(err.code,err.body );
                    });
                }catch(err) {
                    Log.trace('RouteHandler::deleteDataset(..) - ERROR: ' + err.message);
                    res.json(404, {err: err.message});
                }
            });

        } catch (err) {
            Log.error('RouteHandler::deleteDataset(..) - ERROR: ' + err.message);
            res.send(400, {err: err.message});
        }
        return next();
    }
}
