/**
 * Created by Justin on 2016/10/5.
 */

import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import SQuery from "./QueryFilter";

export default class SFilter {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processSFilter(query: SQuery):  DataStructure {
        Log.trace('GTFilter::processGTFilter( ' + JSON.stringify(query) + ' )');
        var structure: DataStructure = new DataStructure();

        let key = Object.keys(query)[0];
        console.log("processGTFilter key is..." + key);
        console.log("processGTFilter type of key is..." + typeof key);

        //   let equal = query[key];
        let str: string = (<any>query)[key];
        let i=0;
        for(i=0;i<this.dataStructure.data.length;i++){
            let c=this.dataStructure.data[i];
            if(c[key].toLowerCase()===str.toLowerCase()){
                structure.data.push(c);
            }
        }
        return structure;
    }
}