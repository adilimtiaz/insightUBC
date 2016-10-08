/**
 * Created by rtholmes on 2016-06-19.
 */

import {Datasets} from "./DatasetController";
import Log from "../Util";

export interface QueryRequest {
    POST: string|string[];
    WHERE: {};
    AS: string;
    ADD: number[];
}

export interface QueryResponse {
}

export default class QueryController {
    private datasets: Datasets = null;

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
        // let ret=JSON.parse(query);
        // let sum : number=0;
        // for(let n in ret){
        //     sum=sum+n;
        // }
        var sum = 0;
        var numbers : number[] = query.add;
        for (var i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }


        return {status: 'result', sum};
    }
}
