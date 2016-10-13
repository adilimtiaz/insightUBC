/**
 * Created by Justin on 2016/10/8.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";

export default class EQFilter {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processEQFilter(query: string):  DataStructure {
        Log.trace('EQFilter::processEQFilter( ' + query + ' )');
        var selectedCourses: Course[] = [];
        var structure: DataStructure = new DataStructure();
        var keyString: string;
        var numberString: string;
        var specificBound: number;

        keyString = query.slice(query.indexOf("{\"")+1, query.indexOf("\":"));
        numberString = query.slice(query.indexOf(":")+1, query.indexOf("}"));
        specificBound = parseFloat(numberString);

        if(this.dataStructure == null){
            structure = null;
        } else {
            if (keyString === "courses_avg") {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if (course.courses_avg == specificBound) {
                        selectedCourses.push(course);
                    }
                }
            } else if (keyString === "courses_pass") {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if (course.courses_pass == specificBound) {
                        selectedCourses.push(course);
                    }
                }
            } else if (keyString === "courses_fail") {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if (course.courses_fail == specificBound) {
                        selectedCourses.push(course);
                    }
                }
            } else if (keyString === "courses_audit") {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if (course.courses_audit == specificBound) {
                        selectedCourses.push(course);
                    }
                }
            }
            structure.data = selectedCourses;
        }
        return structure;
    }
}