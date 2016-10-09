/**
 * Created by justin on 2016/10/8.
 */

import Course from "../rest/model/Course";

export default class EQFilter {
    private query: string;

    constructor(query: string) {
        this.query = query;
    }

    public processEQFilter(courses: Course[]): Course[] {

        var selectedCourses: Course[] = new Array();
        var keyString: string = null;
        var numberString: string = null;
        var specificBound: number;

        keyString = this.query.slice(this.query.indexOf("{\"")+1, this.query.indexOf("\":"));
        numberString = this.query.slice(this.query.indexOf(":")+1, this.query.indexOf("}"));
        specificBound = parseInt(numberString, 10);
        // TODO interpret keyString for Course fields

        for(var i=0; i < courses.length; i++) {
            var course: Course = courses[i];
            if (course.courses_avg === specificBound) {
                selectedCourses.push(course);
            }
        }
        return selectedCourses;
    }
    }

}