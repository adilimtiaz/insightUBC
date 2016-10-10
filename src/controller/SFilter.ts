/**
 * Created by Justin on 2016/10/5.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";

export default class SFilter {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processSFilter(query: string):  DataStructure {
        Log.trace('SFilter::processSFilter( ' + query + ' )');
        var selectedCourses: Course[] = [];
        var structure: DataStructure = new DataStructure();
        var keyString: string;
        var regularString: string;

        keyString = query.slice(query.indexOf("{\"")+1, query.indexOf("\":"));
        regularString = query.slice(query.indexOf(":")+1, query.indexOf("}"));
        if(this.dataStructure.data == null) {
            structure = null;
        } else {
            if (keyString === "courses_id") {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if(regularString.indexOf("*") !== regularString.lastIndexOf("*")) {
                        if(course.courses_id.indexOf(regularString) !== -1) {
                            selectedCourses.push(course);
                        }
                    } else {
                        if(regularString.indexOf("*") == 0) {
                            if(course.courses_id.indexOf(regularString) == (course.courses_id.length-regularString.length-1)) {
                                selectedCourses.push(course);
                            }
                        } else {
                            if(course.courses_id.indexOf(regularString) == 0) {
                                selectedCourses.push(course);
                            }
                        }
                    }
                }
            } else if (keyString === "courses_dept") {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if(regularString.indexOf("*") !== regularString.lastIndexOf("*")) {
                        if(course.courses_dept.indexOf(regularString) !== -1) {
                            selectedCourses.push(course);
                        }
                    } else {
                        if(regularString.indexOf("*") == 0) {
                            if(course.courses_dept.indexOf(regularString) == (course.courses_dept.length-regularString.length-1)) {
                                selectedCourses.push(course);
                            }
                        } else {
                            if(course.courses_dept.indexOf(regularString) == 0) {
                                selectedCourses.push(course);
                            }
                        }
                    }

                }
            } else if (keyString === "courses_title") {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if(regularString.indexOf("*") !== regularString.lastIndexOf("*")) {
                        if(course.courses_title.indexOf(regularString) !== -1) {
                            selectedCourses.push(course);
                        }
                    } else {
                        if(regularString.indexOf("*") == 0) {
                            if(course.courses_title.indexOf(regularString) == (course.courses_title.length-regularString.length-1)) {
                                selectedCourses.push(course);
                            }
                        } else {
                            if(course.courses_title.indexOf(regularString) == 0) {
                                selectedCourses.push(course);
                            }
                        }
                    }
                }
            } else if (keyString === "courses_instructor") {
                for(var i=0; i < this.dataStructure.data.length; i++) {
                    var course: Course = this.dataStructure.data[i];
                    if(regularString.indexOf("*") !== regularString.lastIndexOf("*")) {
                        if(course.courses_instructor.indexOf(regularString) !== -1) {
                            selectedCourses.push(course);
                        }
                    } else {
                        if(regularString.indexOf("*") == 0) {
                            if(course.courses_instructor.indexOf(regularString) == (course.courses_instructor.length-regularString.length-1)) {
                                selectedCourses.push(course);
                            }
                        } else {
                            if(course.courses_instructor.indexOf(regularString) == 0) {
                                selectedCourses.push(course);
                            }
                        }
                    }
                }
            }
            structure.data = selectedCourses;
        }
        return structure;
    }
}