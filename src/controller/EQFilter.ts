/**
 * Created by Justin on 2016/10/8.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import {MathQuery} from "./QueryFilter"

export default class EQFilter {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processEQFilter(query: MathQuery):  DataStructure {
        Log.trace('EQFilter::processEQFilter( ' + JSON.stringify(query) + ' )');
        var selectedCourses: Course[] = [];
        var structure: DataStructure = new DataStructure();

        let key = Object.keys(query)[0];
        console.log("processEQFilter key is..." + key);
        console.log("processEQFilter type of key is..." + typeof key);
        let specificBound: number = query[key];
        console.log("processEQFilter lowerBound is..." + specificBound);
        console.log("processEQFilter type of lowerBound is..." + typeof specificBound);

        if(this.dataStructure == null){
            structure = null;
        } else {
            if (key.indexOf("avg") !== -1) {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if (course.courses_avg == specificBound) {
                        selectedCourses.push(course);
                    }
                }
            } else if (key.indexOf("pass") !== -1) {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if (course.courses_pass == specificBound) {
                        selectedCourses.push(course);
                    }
                }
            } else if (key.indexOf("fail") !== -1) {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if (course.courses_fail == specificBound) {
                        selectedCourses.push(course);
                    }
                }
            } else if (key.indexOf("audit") !== -1) {
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