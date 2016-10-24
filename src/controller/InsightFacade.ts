/**
 * Created by Adil Imtiaz on 23-10-2016.
 */
/**
 * Created by rtholmes on 2016-10-04.
 */
/*
 * This should be in the same folder as your controllers
 */
import {QueryRequest, default as QueryController} from "./QueryController";
import DatasetController from "./DatasetController";
import {Datasets} from "./DatasetController";

export interface InsightResponse {
    code: number;
    body: {}; // this is what you would return to a requestee in the REST body
}

export interface IInsightFacade {

    /**
     * Add a dataset to UBCInsight.
     *
     * @param id  The id of the dataset being added. This is the same as the PUT id.
     * @param content  The base64 content of the dataset. This is the same as the PUT body.
     *
     * The promise should return an InsightResponse for both fullfill and reject.
     * fulfill should be for 2XX codes and reject for everything else.
     */
    addDataset(id: string, content: string): Promise<InsightResponse>;

    /**
     * Remove a dataset from UBCInsight.
     *
     * @param id  The id of the dataset to remove. This is the same as the DELETE id.
     *
     * The promise should return an InsightResponse for both fullfill and reject.
     * fulfill should be for 2XX codes and reject for everything else.
     */
    removeDataset(id: string): Promise<InsightResponse>;

    /**
     * Perform a query on UBCInsight.
     *
     * @param query  The query to be performed. This is the same as the body of the POST message.
     * @return Promise <InsightResponse>
     * The promise should return an InsightResponse for both fullfill and reject.
     * fulfill should be for 2XX codes and reject for everything else.
     */
    performQuery(query: QueryRequest): Promise<InsightResponse>;
}

export default class InsightFacade {
    private controller=new DatasetController();

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
                            fulfill({code: 204, body: {success: result}});
                        }
                        else
                            fulfill({code: 201, body: {success: result}});
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
                var s=query.ORDER;
                var s2=s.substring(0,s.indexOf("_"));
                if(typeof that.controller.datasets[s2]=="undefined"){
                    reject({code: 424, body: {err: "Missing:"+ s}});
                }







            }catch(err){
                reject({code: 404, body: {err: err.message}});
            }
        });
    }
}

