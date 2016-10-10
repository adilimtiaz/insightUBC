/**
 * Created by Justin on 2016/10/8.
 */
import DataStructure from "../rest/model/DataStructure";
import Course from "../rest/model/Course";
import Log from "../Util";
import QueryFilter from "./QueryFilter";

export default class NegationFilter {
    private datastructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.datastructure = datastructure;
    }
    public processNegationFilter(query: string): DataStructure {
        Log.trace('NegationFilter::processNegationFilter( ' + query + ' )');
        // var innerQuery = query.slice(query.indexOf(":{")+2, query.lastIndexOf("}"));
        // let queryFilter = new QueryFilter(this.datastructure);
        // var returnStructure: DataStructure = queryFilter.processFilter(innerQuery);

        var selectedCourses: Course[] = [];
        var structure: DataStructure = null;
        structure.data = selectedCourses;
        return this.datastructure;
    }
}