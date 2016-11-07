/**
 * Created by Adil Imtiaz on 27-09-2016.
 */

export default class DataStructure {
    data: any[]=[];
    alluuids: number[]=[];

    add(c: any){
        if(this.alluuids.indexOf(c['courses_uuid'])==-1) {
            this.data.push(c);
            if(c.hasOwnProperty('courses_uuid')) {
                this.alluuids.push(c['courses_uuid']);
            }
        }
    }
}