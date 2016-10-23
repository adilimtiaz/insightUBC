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
    ORDER: string;
    AS: string;
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
        if (typeof query !== 'undefined' && query !== null && Object.keys(query).length > 0) {
            console.log(Object.keys);
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
        let id: string = query.ORDER.slice(0, query.ORDER.indexOf("_"));

        let queryFilter: QueryFilter = new QueryFilter(this.datasets[id]);
        let filterRes = queryFilter.processFilter(query.WHERE);

        let sortOrder = new SortOrder(filterRes);
        let sortedRes = sortOrder.processSortOrder(query.ORDER);


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
