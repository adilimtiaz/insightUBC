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
        Log.trace('NegationFilter::processNegationFilter( ' + JSON.stringify(query) + ' )');

        var selectedCourses: Course[] = [];
        var structure: DataStructure = null;

        let filter = new QueryFilter(this.dataStructure);
        let innerStructure = filter.processFilter(query);

        // TODO this.dataStructure minus innerStructure


        structure.data = selectedCourses;
        return this.dataStructure;
    }
}