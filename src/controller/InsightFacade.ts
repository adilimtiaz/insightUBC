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
                            fulfill({code: 204, body: {success: result}});
                        }
                        else {
                            console.log("201");
                            fulfill({code: 201, body: {success: result}});
                        }
                    }
                }).catch(function(err){
                    reject({code: 400, body: {err: err.message}});
                });
            }catch(err){
                reject({code: 400, body: {err: err.message}});
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
                fulfill({code: 204, body: {success: "the operation was successful."}})

            }catch(err){
                reject({code: 404, body: {err: err.message}});
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
                var b=qcon.isValid(query);
                if(b==200) {
                    let result = qcon.query(query);
                    fulfill({code:200, body:result});
                }
                else
                    reject({code:b, body:"Bad query design"});
            }catch(err){
                reject({code:400, body:err.message});
            }
        });
    }
}

