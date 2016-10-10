/**
 * Created by Justin on 2016/10/8.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";

export default class GTFilter {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processGTFilter(query: string):  DataStructure {
        Log.trace('GTFilter::processGTFilter( ' + query + ' )');
        var selectedCourses: Course[] = [];
        var structure: DataStructure = new DataStructure();
        var keyString: string;
        var numberString: string;
        var lowerBound: number;

        keyString = query.slice(query.indexOf("{\"") + 1, query.indexOf("\":"));
        numberString = query.slice(query.indexOf(":") + 1, query.indexOf("}"));
        lowerBound = parseFloat(numberString);

        if (keyString === "courses_avg") {
            for(var i=0; i < this.dataStructure.data.length; i++) {
                var course: Course = this.dataStructure.data[i];
                if (course.courses_avg > lowerBound) {
                    selectedCourses.push(course);
                }
            }
        } else if (keyString === "courses_pass") {
            for(var i=0; i < this.dataStructure.data.length; i++) {
                var course: Course = this.dataStructure.data[i];
                if (course.courses_pass > lowerBound) {
                    selectedCourses.push(course);
                }
            }
        } else if (keyString === "courses_fail") {
            for(var i=0; i < this.dataStructure.data.length; i++) {
                var course: Course = this.dataStructure.data[i];
                if (course.courses_fail > lowerBound) {
                    selectedCourses.push(course);
                }
            }
        } else if (keyString === "courses_audit") {
            for(var i=0; i < this.dataStructure.data.length; i++) {
                var course: Course = this.dataStructure.data[i];
                if (course.courses_audit > lowerBound) {
                    selectedCourses.push(course);
                }
            }
        }

        structure.data = selectedCourses;
        return structure;
    }
}