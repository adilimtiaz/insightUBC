/**
 * Created by Justin on 2016/10/8.
 */
import DataStructure from "../rest/model/DataStructure";
import Course from "../rest/model/Course";

export default class NegationFilter {
    private datastructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.datastructure = datastructure;
    }
    public processNegationFilter(query: string): DataStructure {
        var selectedCourses: Course[] = [];
        var structure: DataStructure;
        structure.data = selectedCourses;
        return structure;
    }
}