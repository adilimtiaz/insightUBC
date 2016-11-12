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

    public isValid(query: QueryRequest): boolean {
        if (typeof query !== 'undefined' && query !== null && Object.keys(query).length > 0) {
            var flag: boolean = true;
            let course = new Course();
            let coursePropertyArr = Object.keys(course);//all valid course properties
            let get = query.GET;
            let getKeyArrOriginal: any = []; //all course properties in get
            let getKeyArrApply:any = []; //all properties apply must have
            let groupKeyArr: string[] = [];
            var applyKeyArr: string[] = [];
            let queryKeyArr = Object.keys(query);

            if(queryKeyArr.indexOf("GET")==-1||queryKeyArr.indexOf("WHERE")==-1||queryKeyArr.indexOf("AS")==-1){
                return false;
            }

            if (typeof get == "string") { // Check if key(s) in GET is/are all valid
                if(!this.validKey(get, coursePropertyArr)){return false;} // invalid get key
            }
            else {
                for (var i = 0; i < get.length; i++) {
                    if(!this.validKey(get[i],coursePropertyArr)){return false;}
                }
            }

            if (queryKeyArr.indexOf("GROUP") !== -1 && queryKeyArr.indexOf("APPLY") !== -1) { //check group and apply
                if (query.GROUP.length === 0) {  //empty GROUP error
                    return false;
                }
                if(typeof query.GET=="string"){ // may change query.GET to get to unify the naming
                    getKeyArrOriginal.push(get);
                }
                else{
                    for (var i = 0; i < get.length; i++) {
                        if (coursePropertyArr.indexOf(get[i]) !== -1) {
                            getKeyArrOriginal.push(get[i]);
                        } else {
                            getKeyArrApply.push(get[i]);
                        }
                    }
                }
                for (var i = 0; i < query.GROUP.length; i++) { //group has validkeys
                    if(!this.validKey(query.GROUP[i], coursePropertyArr)){
                        return false; //check group only has course keys
                    }
                    let str = query.GROUP[i];
                    groupKeyArr.push(str);
                }               //groupKeyArr => keys in GROUP

                for (var i = 0; i < groupKeyArr.length; i++) {
                    console.log(groupKeyArr[i]);
                    if (getKeyArrOriginal.indexOf(groupKeyArr[i]) == -1) {
                        return false;   //Get has a underscorekey group doesnt
                    }
                }



                for (var i = 0; i < query.APPLY.length; i++) {
                    coursePropertyArr.push(Object.keys(query.APPLY[i])[0]);  //v3=array of all keys in APPLY
                    applyKeyArr.push(Object.keys(query.APPLY[i])[0]); //applyKeyArr => all valid getkeys
                }
                for (var i = 0; i < applyKeyArr.length; i++) {
                    {
                        if (getKeyArrApply.indexOf(applyKeyArr[i]) == -1) {  //get has keys that are not defined in apply
                            return false;
                        }
                    }
                }
            }
            if ((queryKeyArr.indexOf("GROUP") !== -1 && queryKeyArr.indexOf("APPLY") === -1) || (queryKeyArr.indexOf("GROUP") === -1 && queryKeyArr.indexOf("APPLY") !== -1)) {
                return false; // GROUP and APPLY always appear together.
            }

            if(query.hasOwnProperty("ORDER")){
                if (typeof query.ORDER == "string") {
                    if (get.indexOf(<string> query.ORDER)==-1) { // If typeof query.ORDER == "string", we don't need to use <string> right? May change it to (!this.validKey(query.ORDER, get))
                            return false;
                    }
                }
                else {
                    let order:any = query.ORDER;
                    if(order.hasOwnProperty("dir") && order.hasOwnProperty("keys")){
                        if(order.dir!=="UP" && order.dir!=="DOWN"){
                            return false; // dir got wrong value
                        }
                        for(var i=0; i<order.keys.length; i++) { // all keys in ORDER need to appear in GET
                            if(get.indexOf(order.keys[i])==-1) { // May change it to (!this.validKey(order.keys[i], get))
                                return false;
                            }
                        }
                    }
                    else{
                        return false;
                    }
                }
            }

            return true;
        }
        return false;
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

