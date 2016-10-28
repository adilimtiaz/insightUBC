/**
 * Created by Adil Imtiaz on 27-09-2016.
 */

export default class DataStructure {
    data: any[]=[];
    alluuids: number[]=[];

    add(c: any){
        if(this.alluuids.indexOf(c['courses_uuid'])==-1) {
            this.data.push(c);
            this.alluuids.push(c['courses_uuid']);
        }
    }
}