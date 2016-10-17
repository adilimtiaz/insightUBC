/**
 * Created by rtholmes on 2016-06-19.
 */


import {Datasets} from "./DatasetController";
import QueryFilter from "./QueryFilter";
import Log from "../Util";
import {Query} from "./QueryFilter"
import SortOrder from "./SortOrder";

export interface QueryRequest {
    GET: string|string[];
    WHERE: Query;
    ORDER: string;
    AS: string;
}

export interface QueryResponse {
    // status: string;
    // ts: any;
    // TABLE: string[];
    // ERROR: boolean;
    // MESSAGE: string;
}



export default class QueryController {
    private datasets: Datasets = null;
    private error: boolean = false;
    private message: string = null;


    constructor(datasets: Datasets) {
        this.datasets = datasets;
    }

    public isValid(query: QueryRequest): boolean {
        if (typeof query !== 'undefined' && query !== null && Object.keys(query).length > 0) {
            return true;
        }
        return false;
    }

    public query(query: QueryRequest): QueryResponse {
        Log.trace('QueryController::query( ' + JSON.stringify(query) + ' )');

        // TODO: implement this
        // Extract WHERE part for analysing filters
        // Get rid of the outter-most curly brace and any space inside
        // queryWhere

        let queryFilter: QueryFilter = new QueryFilter(this.datasets["courses"]);
        let dataStructure = queryFilter.processFilter(query.WHERE);
        //
        // let sortOrder = new SortOrder(dataStructure);
        // dataStructure = sortOrder.processSortOrder(query.ORDER);

        // Log.test("This is a test on WHERE JSON...");
        // Log.test("This is a keys in WHERE JSON...");
        // let key = Object.keys(query.WHERE)[0];
        // console.log(key);
        //
        // let value = query.WHERE[key];
        // console.log(value);


        //
        // for(var myKey in query.WHERE) {
        //     console.log("key:"+myKey+", value:"+ JSON.stringify(query.WHERE[myKey]));
        //     console.log(myKey);
        //     console.log(typeof myKey);
        // }
        //
        // Log.test("This is a values in WHERE JSON...");
        // Log.test(JSON.stringify(query.WHERE[key]));
        //
        // if(query.WHERE.hasOwnProperty(key)) {
        //     Log.test("WHERE JSON has property" + key + " ...");
        //     Log.test("And the value is ...");
        //     Log.test(JSON.stringify(query.WHERE[key]));
        // } else {
        //     Log.test("WHERE JSON does not have property" + key + " ...");
        // }
        // Log.test("The typeof WHERE keys is...");
        // Log.test(typeof key);
        // if(JSON.stringify(key) === "[\"GT\"]") {
        //     Log.test("WHERE key is \"GT\"");
        // }





        return {status: 'received', ts: new Date().getTime()};
    }
}
