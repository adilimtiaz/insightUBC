/**
 * Created by rtholmes on 2016-06-19.
 */


import {Datasets} from "./DatasetController";
import QueryFilter from "./QueryFilter";
import Log from "../Util";
import {Query} from "./QueryFilter"
import SortOrder from "./SortOrder";
import Groupfilter from "./Groupfilter";
import Course from "../rest/model/Course";
import OrderFilter from "./OrderFilter";
import {OrderQuery} from "./OrderFilter";
import DataStructure from "../rest/model/DataStructure";


export interface QueryRequest {
    GET: string[];
    WHERE: Query;
    ORDER?: string|OrderQuery;
    GROUP?: string[];
    APPLY?: Query[];
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


export default class QueryController {
    private datasets: Datasets = {};



    constructor(datasets: Datasets) {
        this.datasets = datasets;
    }

    public isValid(query: QueryRequest): boolean {
        /**
         let validget: boolean = false;
         let validorder: boolean = false;
         let that = this;
         try {
            if (typeof query !== 'undefined' && query !== null && Object.keys(query).length > 0) {
                if (query.GET instanceof Array) {
                    validget = true;
                    for (var i = 0; i < query.GET.length; i++) {
                        if (typeof query.GET[i] == "string") {
                            validget = validget && that.validKey(query.GET[i]);
                        }
                        else
                            return false;
                    }
                }
                else {
                    return false;
                }
                let arr = Object.keys(query);
                if (arr.indexOf("ORDER" +
                        "") !== -1) {
                    if (typeof query.ORDER == "string") {
                        if (typeof query.GET == "string") {
                            validorder = query.GET === query.ORDER;
                        }
                        else {
                            for (var i = 0; i < query.GET.length; i++) {
                                if (query.GET[i] === query.ORDER) {
                                    validorder = true;
                                }
                            }
                        }
                    }
                    else if (query.ORDER.hasOwnProperty("dir") && query.ORDER.hasOwnProperty("keys")) {
                        let s: GetQuery = query.ORDER;
                        if (s.dir.toLowerCase() === "up" || "down") {
                            if (typeof query.GET == "string") {
                                validorder = query.GET === query.ORDER.keys[0];
                            }
                            else {
                                for (var i = 0; i < s.keys.length; i++) {
                                    if (query.GET.indexOf(s.keys[i]) == -1) {
                                        return false;
                                    }
                                }
                                validorder = true;
                            }

                        }
                    }
                }
                else{
                    validorder=true;
                }
            }
            if (typeof query.WHERE == "undefined" || typeof query.AS == "undefined") {
                return false;
            }
                 return validget && validorder;
    }

         catch(err) {
        Log.error(err);
        return false;
    }
         */
        if (typeof query !== 'undefined' && query !== null && Object.keys(query).length > 0) {
            let arr=Object.keys(query);
            if(arr.indexOf("GET")==-1||arr.indexOf("WHERE")==-1||arr.indexOf("AS")==-1){
                return false;
            }

            return true;
        }
        return false;



    }

    public validKey(key: any):boolean{
        let c=new Course();
        let v=Object.keys(c);
        if(v.indexOf(key)==-1){
            return false;
        }
        return true;
    }


    public query(query: QueryRequest): QueryResponse {
        Log.trace('QueryController::query( ' + JSON.stringify(query) + ' )');

        // TODO: implement this
        let id: string = "courses";
        let sortedRes=new DataStructure();
        let where:any=query.WHERE;

        let queryFilter: QueryFilter = new QueryFilter(this.datasets[id]);
        sortedRes = queryFilter.processFilter(where);

        let arr=Object.keys(query);
        if(arr.indexOf("GROUP")!==-1){
            let apply:any=query.APPLY;
            let groupFilter=new Groupfilter(sortedRes);
            sortedRes=groupFilter.processGroups(query.GROUP,query.APPLY);
        }

        if(typeof query.ORDER === 'string') {
            let sortOrder = new SortOrder(sortedRes);
            sortedRes = sortOrder.processSortOrder(query.ORDER);
        }





        Log.trace("We here now");

        var get=query.GET;
        for(var i=0;i<sortedRes.data.length;i++){
            for(var p in sortedRes.data[i]){
                if(get.indexOf(p)==-1){
                    delete sortedRes.data[i][p];
                }

            }
        }

        // TODO get the query.GET and implement it to return array




        let render2 = query.AS;
        var renderstr: string;


        // TODO try catch for error handling


        Log.trace("Returning something");
        return {render: render2, result: sortedRes.data};
        //lallala
        // return {status: 'received', ts: new Date().getTime()};
    }
}
