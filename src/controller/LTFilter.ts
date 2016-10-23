/**
 * Created by Justin on 2016/10/8.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import {MathQuery} from "./QueryFilter";


export default class LTFilter {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processLTFilter(query: MathQuery):  DataStructure {
        Log.trace('GTFilter::processGTFilter( ' + JSON.stringify(query) + ' )');
        var structure: DataStructure = new DataStructure();

        let key = Object.keys(query)[0];
        console.log("processGTFilter key is..." + key);
        console.log("processGTFilter type of key is..." + typeof key);

        let upperBound = query[key];
        let i=0;
        for(i=0;i<this.dataStructure.data.length;i++){
            let c=this.dataStructure.data[i];
            if(c[key]>upperBound){
                structure.add(c);
            }
        }
        return structure;
    }
}