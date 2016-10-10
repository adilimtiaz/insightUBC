/**
 * Created by Justin on 2016/10/8.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";

export default class LTFilter {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processLTFilter(query: string):  DataStructure {

        var selectedCourses: Course[] = [];
        var structure: DataStructure = new DataStructure();
        var keyString: string;
        var numberString: string;
        var upperBound: number;

        keyString = query.slice(query.indexOf("{\"")+1, query.indexOf("\":"));
        numberString = query.slice(query.indexOf(":")+1, query.indexOf("}"));
        upperBound = parseFloat(numberString);

        if (keyString === "courses_avg") {
            for(var i=0; i < this.dataStructure.data.length; i++) {
                var course: Course = this.dataStructure.data[i];
                if (course.courses_avg < upperBound) {
                    selectedCourses.push(course);
                }
            }
        } else if (keyString === "courses_pass") {
            for(var i=0; i < this.dataStructure.data.length; i++) {
                var course: Course = this.dataStructure.data[i];
                if (course.courses_pass < upperBound) {
                    selectedCourses.push(course);
                }
            }
        } else if (keyString === "courses_fail") {
            for(var i=0; i < this.dataStructure.data.length; i++) {
                var course: Course = this.dataStructure.data[i];
                if (course.courses_fail < upperBound) {
                    selectedCourses.push(course);
                }
            }
        } else if (keyString === "courses_audit") {
            for(var i=0; i < this.dataStructure.data.length; i++) {
                var course: Course = this.dataStructure.data[i];
                if (course.courses_audit < upperBound) {
                    selectedCourses.push(course);
                }
            }
        }
        structure.data = selectedCourses;
        return structure;
    }
}