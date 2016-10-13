/**
 * Created by Adil Imtiaz on 27-09-2016.
 */

import Course from "./Course";

export default class DataStructure {
    data: any[]=[];

    add(c: any){
        this.data.push(c);
    }

    public getSize() :number {
        return this.data.length;
    }

}