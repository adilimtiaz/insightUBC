/**
 * Created by rtholmes on 2016-06-19.
 */


import {Datasets} from "./DatasetController";
import QueryFilter from "./QueryFilter";
import Log from "../Util";
import SortOrder from "./SortOrder";
import {error} from "util";

export interface QueryRequest {
    GET: string|string[];
    WHERE: {};
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
    private queryFilter: QueryFilter;
    private error: boolean = false;
    private message: string = null;


    constructor(datasets: Datasets) {
        this.datasets = datasets;
        queryFilter:QueryFilter = new QueryFilter(this.datasets);
    }

    public isValid(query: QueryRequest): boolean {
        if (typeof query !== 'undefined' && query !== null && Object.keys(query).length > 0) {
            return true;
        }
        return false;
    }

    public query(query: QueryRequest): QueryResponse {
        Log.trace('QueryController::query( ' + JSON.stringify(query) + ' )');
        Log.test('WHERE is:' + JSON.stringify(query.WHERE));
        // TODO: implement this
        // Extract WHERE part for analysing filters
        // Get rid of the outter-most curly brace and any space inside
        // queryWhere
        var queryWhere: string = <string> query.WHERE;
        queryWhere = queryWhere.slice(queryWhere.indexOf('{'), queryWhere.lastIndexOf('}')).replace(" ", "");

        let dataStructure = this.queryFilter.processFilter(queryWhere);
        let sortOrder = new SortOrder(dataStructure);
        dataStructure = sortOrder.processSortOrder(query.ORDER);




        return {status: 'received', ts: new Date().getTime(), TABLE: dataStructure, ERROR: this.error, MESSAGE: this.message};
    }
}
