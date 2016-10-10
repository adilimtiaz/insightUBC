/**
 * Created by Justin on 2016/10/10.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import {type} from "os";

export default class SortOrder {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processSortOrder(query: string): DataStructure {
        Log.trace('SortOrder::processSortOrder( ' + query + ' )');
        if((this.dataStructure == null)||(this.dataStructure.data == null)||(typeof this.dataStructure === 'undefined')||(typeof this.dataStructure.data === 'undefined')) {
            Log.trace('SortOrder::processSortOrder( dataStructure is null )');
            return null;
        } else {
            if(query === "courses_avg") {
                for(var i=0; i < this.dataStructure.data.length-1; i++) {
                    let minimum = i;
                    for (var j=i+1; j < this.dataStructure.data.length; j++) {
                        if(this.dataStructure.data[j].courses_avg < this.dataStructure.data[minimum].courses_avg) {
                            minimum = j;
                        }
                        var tempCourse: Course = this.dataStructure.data[i];
                        this.dataStructure.data[i] = this.dataStructure.data[minimum];
                        this.dataStructure.data[minimum] = tempCourse;
                    }
                }
                Log.trace('SortOrder::processSortOrder( finish course_avg sorting )');
            } else if (query === "courses_pass") {
                for(var i=0; i < this.dataStructure.data.length-1; i++) {
                    let minimum = i;
                    for (var j=i+1; j < this.dataStructure.data.length; j++) {
                        if(this.dataStructure.data[j].courses_pass < this.dataStructure.data[minimum].courses_pass) {
                            minimum = j;
                        }
                        var tempCourse: Course = this.dataStructure.data[i];
                        this.dataStructure.data[i] = this.dataStructure.data[minimum];
                        this.dataStructure.data[minimum] = tempCourse;
                    }
                }
            } else if(query === "courses_fail") {
                for(var i=0; i < this.dataStructure.data.length-1; i++) {
                    let minimum = i;
                    for (var j=i+1; j < this.dataStructure.data.length; j++) {
                        if(this.dataStructure.data[j].courses_fail < this.dataStructure.data[minimum].courses_fail) {
                            minimum = j;
                        }
                        var tempCourse: Course = this.dataStructure.data[i];
                        this.dataStructure.data[i] = this.dataStructure.data[minimum];
                        this.dataStructure.data[minimum] = tempCourse;
                    }
                }
            } else if(query === "courses_audit") {
                for(var i=0; i < this.dataStructure.data.length-1; i++) {
                    let minimum = i;
                    for (var j=i+1; j < this.dataStructure.data.length; j++) {
                        if(this.dataStructure.data[j].courses_audit < this.dataStructure.data[minimum].courses_audit) {
                            minimum = j;
                        }
                        var tempCourse: Course = this.dataStructure.data[i];
                        this.dataStructure.data[i] = this.dataStructure.data[minimum];
                        this.dataStructure.data[minimum] = tempCourse;
                    }
                }
            }
            return this.dataStructure;
        }
    }
}
