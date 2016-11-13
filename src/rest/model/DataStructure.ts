/**
 * Created by Adil Imtiaz on 27-09-2016.
 */

export default class DataStructure {
    data: any[]=[];
    alluuids: number[]=[];

    add(c: any){
        this.data.push(c);
    }

    identical(dataIn: any):boolean { // Check if dataIn has an identical copy in this dataStructure
        for(var i=0; i<this.data.length; i++) {
            let keyArr = Object.keys(this.data[i]);
            for(var j=0; j<keyArr.length; j++) {
                if(dataIn[keyArr[j]]!==this.data[i][keyArr[j]]) {
                    return false;
                }
            }
        }
        return true;
    }

}