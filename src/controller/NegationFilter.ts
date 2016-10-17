/**
 * Created by Justin on 2016/10/8.
 */
import DataStructure from "../rest/model/DataStructure";
import Course from "../rest/model/Course";
import Log from "../Util";
import Query from "./QueryFilter";
import QueryFilter from "./QueryFilter";

export default class NegationFilter {
    private dataStructure: DataStructure = null;

    constructor(dataStructure: DataStructure) {
        this.dataStructure = dataStructure;
    }
    public processNegationFilter(query: Query): DataStructure {
        Log.trace('NegationFilter::processNegationFilter( ' + query + ' )');
        // var innerQuery = query.slice(query.indexOf(":{")+2, query.lastIndexOf("}"));
        // let queryFilter = new QueryFilter(this.datastructure);
        // var returnStructure: DataStructure = queryFilter.processFilter(innerQuery);

        var selectedCourses: Course[] = [];
        var structure: DataStructure = null;

        let filter = new QueryFilter(this.dataStructure);
        let innerStructure = filter.processFilter(query);

        // TODO dataStructure minus innerStructure

        structure.data = selectedCourses;
        return this.dataStructure;
    }
}