/**
 * Created by Justin on 2016/10/9.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";

export default class ANDFilter {

    private datastructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.datastructure = datastructure;
    }
    private traverseAll(query: string): number {
        var endIndex: number;
        if(query.indexOf("[{") !== -1) {
            var stack: number[] = [];
            var subQuery: string;
            stack.push(1);
            subQuery = query.slice(query.indexOf("[{"));
            while(stack.length !== 0) {
                if(query.indexOf("[{") !== -1) {

                }
            }
        }

        return
    }
    public processANDFilter(query: string): DataStructure {

        var selectedCourses: Course[] = [];
        var structure: DataStructure = new DataStructure();
        var innerQuery = query.slice(query.indexOf("[{"));
        if (innerQuery.indexOf("[{") !== -1) {

        }




        structure.data = selectedCourses;
        return structure;
    }
}