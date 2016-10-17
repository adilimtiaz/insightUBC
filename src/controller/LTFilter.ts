/**
 * Created by Justin on 2016/10/8.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import {MathQuery} from "./QueryFilter";


export default class LTFilter {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processLTFilter(query: MathQuery):  DataStructure {
        Log.trace('LTFilter::processLTFilter( ' + JSON.stringify(query) + ' )');
        var selectedCourses: Course[] = [];
        var structure: DataStructure = new DataStructure();

        let key = Object.keys(query)[0];
        console.log("processLTFilter key is..." + key);
        console.log("processLTFilter type of key is..." + typeof key);
        let upperBound: number = query[key];
        console.log("processLTFilter lowerBound is..." + upperBound);
        console.log("processLTFilter type of lowerBound is..." + typeof upperBound);


        //
        // if(this.dataStructure == null){
        //     structure = null;
        // } else {
        //     if (key === "courses_avg") {
        //         for(var i=0; i < this.dataStructure.data.length; i++) {
        //             var course: Course = this.dataStructure.data[i];
        //             if (course.courses_avg < upperBound) {
        //                 selectedCourses.push(course);
        //             }
        //         }
        //     } else if (key === "courses_pass") {
        //         for(var i=0; i < this.dataStructure.data.length; i++) {
        //             var course: Course = this.dataStructure.data[i];
        //             if (course.courses_pass < upperBound) {
        //                 selectedCourses.push(course);
        //             }
        //         }
        //     } else if (key === "courses_fail") {
        //         for(var i=0; i < this.dataStructure.data.length; i++) {
        //             var course: Course = this.dataStructure.data[i];
        //             if (course.courses_fail < upperBound) {
        //                 selectedCourses.push(course);
        //             }
        //         }
        //     } else if (key === "courses_audit") {
        //         for(var i=0; i < this.dataStructure.data.length; i++) {
        //             var course: Course = this.dataStructure.data[i];
        //             if (course.courses_audit < upperBound) {
        //                 selectedCourses.push(course);
        //             }
        //         }
        //     }
        //     structure.data = selectedCourses;
        // }
        return structure;
    }
}