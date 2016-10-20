/**
 * Created by Justin on 2016/10/8.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import {MathQuery} from "./QueryFilter"

export default class GTFilter {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processGTFilter(query: MathQuery):  DataStructure {
        Log.trace('GTFilter::processGTFilter( ' + JSON.stringify(query) + ' )');

        var selectedCourses: Course[] = [];
        var structure: DataStructure = new DataStructure();

        let key = Object.keys(query)[0];
        console.log("processGTFilter key is..." + key);
        console.log("processGTFilter type of key is..." + typeof key);

        let lowerBound = query[key];
        console.log("processGTFilter lowerBound is..." + lowerBound);
        console.log("processGTFilter type of lowerBound is..." + typeof lowerBound);


        if(this.dataStructure == null){
            structure = null;
        } else {
            if (key.indexOf("avg") !== -1) {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if (course.courses_avg > lowerBound) {
                        selectedCourses.push(course);
                    }
                }
            } else if (key.indexOf("pass") !== -1) {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if (course.courses_pass > lowerBound) {
                        selectedCourses.push(course);
                    }
                }
            } else if (key.indexOf("fail") !== -1) {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if (course.courses_fail > lowerBound) {
                        selectedCourses.push(course);
                    }
                }
            } else if (key.indexOf("audit") !== -1) {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if (course.courses_audit > lowerBound) {
                        selectedCourses.push(course);
                    }
                }
            }
            structure.data = selectedCourses;
        }
        return structure;
    }
}