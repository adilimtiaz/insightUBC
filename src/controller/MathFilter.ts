/**
 * Created by Justin on 2016/10/5.
 */
import Course from "../rest/model/Course";
import LTFilter from "./LTFilter";
import GTFilter from "./GTFilter";
import EQFilter from "./EQFilter";

export default class MathFilter {
    private query: string;

    constructor(query: string) {
        this.query = query;
    }

    public processMathFilter(course: Course[]): Course[] {

        var keyString: string = null;
        var numberString: string = null;
        var ltFilter: LTFilter;
        var gtFilter: GTFilter;
        var eqFilter: EQFilter;

        if(this.query.indexOf("\"LT\"") !== -1) {
            ltFilter = new LTFilter(this.query);
        } else if(this.query.indexOf("\"GT\"") !== -1) {
            gtFilter = new GTFilter(this.query);
        } else if(this.query.indexOf("\"EQ\"") !== -1) {
            eqFilter = new EQFilter(this.query);
        } else {
            return course;
        }


    }
}