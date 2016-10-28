/**
 * Created by Adil Imtiaz on 23-10-2016.
 */
/**
 * Created by rtholmes on 2016-10-04.
 */
/*
 * Thisa should be in the same folder as your controllers
 */

import QueryController from '../controller/QueryController';
import {QueryRequest} from "./QueryController";
import DatasetController from "./DatasetController";
import {Datasets} from "./DatasetController";
import {IInsightFacade} from "./IInsightFacade";
import {InsightResponse} from "./IInsightFacade";


export default class InsightFacade implements IInsightFacade{
    public controller=new DatasetController();

    public addDataset(id: string, content: string): Promise<InsightResponse> {
        let that=this;
        let flag=0;
        return new Promise(function (fulfill, reject) {
            try{


                if(typeof that.controller.datasets[id] == "undefined"){
                    flag=1; // if id doesnt exist
                }
                var promise=that.controller.process(id,content);

                promise.then(function(result:any){
                    if(result==true){
                        if(flag==1) {
                            console.log("204");
                            fulfill({statusCode: 204, body: {success: result}});
                        }
                        else
                            console.log("201");
                        fulfill({statusCode: 201, body: {success: result}});
                    }
                }).catch(function(err){
                    reject({statusCode: 400, body: {err: err.message}});
                });
            }catch(err){
                reject({statusCode: 400, body: {err: err.message}});
            }
        });

    }

    public removeDataset(id: string): Promise<InsightResponse> {
        let that=this;
        return new Promise(function (fulfill, reject) {
            try{
                if(typeof that.controller.datasets[id]=="undefined"){
                    throw new Error("the operation was unsuccessful because the delete was for a resource that was not previously PUT");
                }
                that.controller.delete(id);
                fulfill({statusCode: 204, body: {success: "the operation was successful."}})

            }catch(err){
                reject({statusCode: 404, body: {err: err.message}});
            }
        });
    }

    public performQuery(query: QueryRequest): Promise<InsightResponse> {
        let that=this;
        return new Promise(function (fulfill, reject) {
            try{
                let Dataset: Datasets=that.controller.getDatasets();
                let qcon=new QueryController(Dataset);
                var s=query.GET[0];
                var s2=s.substring(0,s.indexOf("_"));
                if(typeof that.controller.datasets[s2]=="undefined"){
                    reject({statusCode: 424, error: "Missing:"+ s});
                }
                var b=qcon.isValid(query);
                if(!b){
                    reject({statusCode: 400, error:"Bad query design"});
                }
                else {
                    let result2 = qcon.query(query);
                    fulfill({statusCode: 200, body: result2});
                }
            }catch(err){
                reject({statusCode: 400, error: err.message});
            }
        });
    }
}

