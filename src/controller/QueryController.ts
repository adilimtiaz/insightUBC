/**
 * Created by rtholmes on 2016-06-19.
 */


import {Datasets} from "./DatasetController";
import QueryFilter from "./QueryFilter";
import Log from "../Util";
import {Query} from "./QueryFilter"
import SortOrder from "./SortOrder";
import Course from "../rest/model/Course";

export interface QueryRequest {
    GET: string|string[];
    WHERE: Query;
    ORDER: any;
    AS: string;
}

export interface GetQuery {
    dir: string;
    keys: string[];
}

export interface QueryResponse {
    render: string;
    result: Course[];
}

export interface missArray {
    missing: string[];
}


export default class QueryController {
    private datasets: Datasets = null;
    private missRes: boolean = false;
    private missArr: missArray;



    constructor(datasets: Datasets) {
        this.datasets = datasets;
    }

    public isValid(query: QueryRequest): boolean {
        let validget:boolean=false;
        let validorder:boolean=false;
        let that=this;
        try {
            if (typeof query !== 'undefined' && query !== null && Object.keys(query).length > 0) {
                if(typeof query.GET=="string"){
                    var s:any=query.GET;
                    validget=that.validKey(s);
                }
                else {
                    if (query.GET instanceof Array) {
                        validget=true;
                        for (var i = 0; i < query.GET.length; i++) {
                            if (typeof query.GET[i] == "string") {
                                validget = validget && that.validKey(query.GET[i]);
                            }
                            else
                                return false;
                        }
                    }
                }
                if(typeof query.ORDER=="string"){
                    if(typeof query.GET=="string"){
                        validorder=query.GET===query.ORDER;
                    }
                    else{
                        for (var i = 0; i < query.GET.length; i++) {
                            if (query.GET[i] === query.ORDER) {
                                validorder=true;
                            }
                        }
                    }
                }
                if(query.ORDER.hasOwnProperty("dir")&&query.ORDER.hasOwnProperty("keys")){
                    let s:GetQuery=query.ORDER;
                    if(s.dir.toLowerCase()==="up"||"down"){
                        if(typeof query.GET=="string"){
                            validorder=query.GET===query.ORDER.keys[0];
                        }
                        else{
                            for(var i=0;i<s.keys.length;i++){
                                if(query.GET.indexOf(s.keys[i])==-1){
                                    return false;
                                }
                            }
                            validorder=true;
                        }

                    }
                }
                if(typeof query.WHERE=="undefined" || typeof query.AS =="undefined"){
                    return false;
                }




            }
            return validget&&validorder;
        }catch(err){
            Log.error(err);
        }
    }

    public validKey(key: any):boolean{
        if (key==="courses_avg"||"courses_uuid"||"courses_id"||"courses_audit"||"courses_pass"||"courses_fail"||"courses_title"||"courses_instructor"||"courses_dept"){
            return true;
        }
        return false;
    }

    public missResources(): boolean {
        return this.missRes;
    }

    public getMissArray(): missArray {
        return this.missArr;
    }

    public query(query: QueryRequest): QueryResponse {
        Log.trace('QueryController::query( ' + JSON.stringify(query) + ' )');

        // TODO: implement this
        let id: string = "courses";

        let queryFilter: QueryFilter = new QueryFilter(this.datasets[id]);
        let sortedRes = queryFilter.processFilter(query.WHERE);

        let sortOrder = new SortOrder(sortedRes);//CHANGE BACKKKKK
        if(typeof query.ORDER=="string") {
            let s:any=query.ORDER;
            let sortedRes = sortOrder.processSortOrder(query.ORDER);
        }


        var get=query.GET;
        for(var i=0;i<sortedRes.data.length;i++){
            for(var p in sortedRes.data[i]){
                if(get.indexOf(p)==-1){
                    delete sortedRes.data[i][p];
                }
            }
        }
        // TODO get the query.GET and implement it to return array




        let render = query.AS;
        var renderstr: string;
        if(JSON.stringify(render) === "TABLE") {
            renderstr = "TABLE";
        }

        // TODO try catch for error handling


        Log.trace("Returning something");
        return {render: renderstr, result: sortedRes.data};

        // return {status: 'received', ts: new Date().getTime()};
    }
}
