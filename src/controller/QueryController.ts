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
            let c = new Course();
            let v = Object.keys(c);//all valid course properties
            let get=query.GET;
            let getkeyArr: any=[]; //all course properties in get
            let getkeyarr2:any=[];//all properties apply must have
            let v2: string[] = [];
            var v3: string[] = [];
            //check group only has course keys
            let arr = Object.keys(query);
            if(arr.indexOf("GET")==-1||arr.indexOf("WHERE")==-1||arr.indexOf("AS")==-1){
                return false;
            }
            if (arr.indexOf("GROUP") !== -1 && arr.indexOf("APPLY") !== -1) { //check group and apply
                if (query.GROUP.length === 0) {  //empty GROUP error
                    return  false;
                }
                if(typeof query.GET=="string"){
                    getkeyArr.push(get);
                }
                else{
                    for (var i = 0; i < v.length; i++) {
                        if (v.indexOf(get[i]) !== -1) {
                            getkeyArr.push(get[i]);
                        }
                        else{
                            getkeyarr2.push(get[i]);
                        }
                    }
                }
                for (var i = 0; i < query.GROUP.length; i++) { //group has validkeys
                    if(!this.validKey(query.GROUP[i], v)){
                        return false;
                    }
                    let str = query.GROUP[i];
                    v2.push(str);
                }               //v2==keys in GROUP
                for (var i = 0; i < v2.length; i++) {
                    console.log(v2[i]);
                    if (getkeyArr.indexOf(v2[i]) == -1) {
                        return false;   //Get has a underscorekey group doesnt
                    }
                }


                for (var i = 0; i < query.APPLY.length; i++) {
                    v.push(Object.keys(query.APPLY[i])[0]);  //v3=array of all keys in APPLY
                    v3.push(Object.keys(query.APPLY[i])[0]); //v=all valid getkeys
                }
                for (var i = 0; i < v3.length; i++) {
                    {
                        if (getkeyarr2.indexOf(v3[i]) == -1) {  //get has keys that are not defined in apply or order
                            return false;
                        }
                    }
                }
            }
            if ((arr.indexOf("GROUP") !== -1 && arr.indexOf("APPLY") === -1) || (arr.indexOf("GROUP") === -1 && arr.indexOf("APPLY") !== -1)) {
                return false;
            }
            if (typeof query.GET == "string") {
                if(!this.validKey(query.GET, v)){return false;} // invalid get key
            }
            else {
                for (var i = 0; i < query.GET.length; i++) {
                    if(!this.validKey(get[i],v)){return false}
                }
            }
            if(query.hasOwnProperty("ORDER")){
                if (typeof query.ORDER == "string") {
                    if (get.indexOf(<string> query.ORDER)==-1) {
                            return false;
                    }
                }
                else {
                    let g:any=query.ORDER;
                    if(g.hasOwnProperty("dir")&&g.hasOwnProperty("keys")){
                        if(g.dir!=="UP" && g.dir!=="DOWN"){
                            return false;
                        }
                        for(var i=0;i<g.keys.length;i++) {
                            if(query.GET.indexOf(g.keys[i])==-1) {
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

    public validKey(key: any, v: any): boolean {
        if (v.indexOf(key) == -1) {
            return false;
        }
        return true;
    }


    public query(query: QueryRequest): QueryResponse {
        Log.trace('QueryController::query( ' + JSON.stringify(query) + ' )');

        // TODO: implement this
        let id: string = "courses";
        let sortedRes = new DataStructure();
        let where: any = query.WHERE;

        let queryFilter: QueryFilter = new QueryFilter(this.datasets[id]);
        sortedRes = queryFilter.processFilter(where);

        let arr = Object.keys(query);
        if (arr.indexOf("GROUP") !== -1) {
            let apply: any = query.APPLY;
            let groupFilter = new Groupfilter(sortedRes);
            sortedRes = groupFilter.processGroups(query.GROUP, query.APPLY);
        }


        Log.trace("We here now");

        var get = query.GET;
        for (var i = 0; i < sortedRes.data.length; i++) {
            for (var p in sortedRes.data[i]) {
                if (get.indexOf(p) == -1) {
                    delete sortedRes.data[i].p;
                }
            }
        }

        // TODO get the query.GET and implement it to return array


        // TODO try catch for error handling



        let render2 = query.AS;
        if(query.hasOwnProperty("ORDER")) {
            if (typeof query.ORDER === 'string') {
                let sortOrder = new SortOrder(sortedRes);
                sortedRes = sortOrder.processSortOrder(query.ORDER);
            }/** else {
                let orderFilter = new OrderFilter(sortedRes);
                sortedRes = orderFilter.processOrderFilter(query.ORDER, 0);
            }
 */
        }

        Log.trace("Returning something");
        return {render: render2, result: sortedRes.data};
        //lallala
        // return {status: 'received', ts: new Date().getTime()};
    }
}

