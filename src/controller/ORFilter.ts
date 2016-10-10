/**
 * Created by Justin on 2016/10/9.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";

export default class ORFilter {
    private datastructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.datastructure = datastructure;
    }

    public processORFilter(query: string): DataStructure {
        Log.trace('ORFilter::processORFilter( ' + query + ' )');
        var selectedCourses: Course[] = [];
        var dataStructure: DataStructure = null;
        dataStructure.data = selectedCourses;
        return dataStructure;
    }
}