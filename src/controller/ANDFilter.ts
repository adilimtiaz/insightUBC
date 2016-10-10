/**
 * Created by Justin on 2016/10/9.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import QueryFilter from "./QueryFilter";
import {findRule} from "tslint/lib/ruleLoader";

export default class ANDFilter {

    private datastructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.datastructure = datastructure;
    }
    // private traverseAll(query: string): number {
    //     var endIndex: number;
    //     if(query.indexOf("[{") !== -1) {
    //         var stack: number[] = [];
    //         var subQuery: string;
    //         stack.push(1);
    //         subQuery = query.slice(query.indexOf("[{"));
    //         while(stack.length !== 0) {
    //             if(query.indexOf("[{") !== -1) {
    //
    //             }
    //         }
    //     }
    //
    //     return
    // }
    public processANDFilter(query: string): DataStructure {
        Log.trace('ANDFilter::processANDFilter( ' + query + ' )');
        var selectedCourses: Course[] = [];
        var structure: DataStructure = new DataStructure();
        var innerQuery = query.slice(query.indexOf("[{"), query.lastIndexOf("}]"));
        if (innerQuery.indexOf("},{") === innerQuery.lastIndexOf("},{")) {
            var firstQuery = innerQuery.slice(0, innerQuery.indexOf("},{"));
            var secondQuery = innerQuery.slice(innerQuery.indexOf("},{")+3);
            var queryFilter1 = new QueryFilter(this.datastructure);
            var queryFilter2 = new QueryFilter(this.datastructure);
            queryFilter1.processFilter(firstQuery);
            queryFilter2.processFilter(secondQuery);
        }




        structure.data = selectedCourses;
        return structure;
    }
}