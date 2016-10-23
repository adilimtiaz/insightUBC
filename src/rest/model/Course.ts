/**
 * Created by Adil Imtiaz on 28-09-2016.
 */
export default class Course {
    id:string;
    courses_uuid: string;
    courses_id: string;
    courses_dept: string;
    courses_avg: number;
    courses_instructor: string;
    courses_title: string;
    courses_pass: number;
    courses_fail: number;
    courses_audit: number;

    constructor(){
        this.id="";
        this.courses_uuid="";
        this.courses_id="";
        this.courses_dept="";
        this.courses_avg=0;
        this.courses_title="";
        this.courses_pass=0;
        this.courses_fail=0;
        this.courses_audit=0;
        this.courses_instructor="";
    }
}