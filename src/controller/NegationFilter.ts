/**
 * Created by Justin on 2016/10/8.
 */
import DataStructure from "../rest/model/DataStructure";
import Course from "../rest/model/Course";
import Log from "../Util";

export default class NegationFilter {
    private datastructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.datastructure = datastructure;
    }
    public processNegationFilter(query: string): DataStructure {
        Log.trace('NegationFilter::processNegationFilter( ' + query + ' )');
        var selectedCourses: Course[] = [];
        var structure: DataStructure = null;
        structure.data = selectedCourses;
        return structure;
    }
}