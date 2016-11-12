/**
 * Created by rtholmes on 2016-06-19.a
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
    GET: string|string[];
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
    result: any[];
}


export default class QueryController {
    private datasets: Datasets = {};


    constructor(datasets: Datasets) {
        this.datasets = datasets;
    }

    public isValid(query: QueryRequest): number {
        //query without get and as
        // empty query
        if(!query.hasOwnProperty("AS")||!query.hasOwnProperty("GET")||!query.hasOwnProperty("WHERE")){
            return 400;
        }
        let get:any=[];
        if(typeof get=="string"){
            get.push(query.GET);
        }
        else{
            for(var i=0;i<query.GET.length;i++){
                get.push(query.GET[i]);
            }
        }
        let validkeys:any=[];
        for(var i=0;i<get.length;i++){
            if(get[i].indexOf("_")!==-1) {  // if it doesnt have an underscore
                var s = get[i].substring(0, get[i].indexOf("_"));
                if (typeof this.datasets[s] == "undefined") { //check if that dataset exists
                    return 424;
                }
                validkeys=Object.keys(this.datasets[s].data[0]);
            }
        }
        //valid keys in get
        if(!query.hasOwnProperty("GROUP")){// check that get only has course or room properties
          for(var i=0;i<get.length;i++){
              if(!this.validKey(get[i],validkeys)){
                  return 400;
              }
          }
        }
        // order key should be in get
        if(query.hasOwnProperty("ORDER")){
            let order=query.ORDER;
            if(typeof order=="string"){
                if(get.indexOf(order)==-1){
                    return 400;
                }
            }
        }
        return 200;
}

    public validKey(key: any, keyArr: any): boolean {
        if (keyArr.indexOf(key) == -1) {
            return false;
        }
        return true;
    }


    public query(query: QueryRequest): QueryResponse {
        Log.trace('QueryController::query( ' + JSON.stringify(query) + ' )');

        // TODO: implement this

        let _index=-1;
        var f=0;
        let field="";
        while(_index==-1) {
            field = query.GET[f];
            _index = field.indexOf("_");
            f++;
        }
        let id:string=field.substring(0,_index);
        let where: any = query.WHERE;

        let queryFilter: QueryFilter = new QueryFilter(this.datasets[id]);

        let sortedRes:DataStructure = queryFilter.processFilter(where);

        let arr = Object.keys(query);
        Log.trace("Right before group");
        if (arr.indexOf("GROUP") !== -1) {
            let groupFilter = new Groupfilter(sortedRes);
            sortedRes = groupFilter.processGroups(query.GROUP, query.APPLY);
        }

        // TODO get the query.GET and implement it to return array


        // TODO try catch for error handling

        if(query.hasOwnProperty("ORDER")) {
            if (typeof query.ORDER === 'string') { // Old order with no dir
                let sortOrder = new SortOrder(sortedRes);
                sortedRes = sortOrder.processSortOrder(query.ORDER);
            } else {
                let orderFilter = new OrderFilter(sortedRes);
                sortedRes = orderFilter.processOrderFilter(query.ORDER, 0); // process Order from the first order key (0)
            }
        }

        let sortedRes2:any=[];
        let get: any=[];
        get=query.GET;
        for (var i = 0; i < sortedRes.data.length; i++) {
            let c:any={};
            for (var j=0;j<query.GET.length;j++) {
                var p=query.GET[j];
                c[p]=sortedRes.data[i][p];
            }
            sortedRes2[i]=c;
        }
        let renderAs = query.AS;
        Log.trace("Returning something");
        return {render: renderAs, result: sortedRes2};
    }

}

