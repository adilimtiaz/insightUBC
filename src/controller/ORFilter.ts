/**
 * Created by Justin on 2016/10/9.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";

export default class LTFilter {
    private datastructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.datastructure = datastructure;
    }

    public processORFilter(query: string): DataStructure {
        var selectedCourses: Course[] = [];
        var
        selectedCourses
        return selectedCourses;
    }
}