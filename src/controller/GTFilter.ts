/**
 * Created by Justin on 2016/10/8.
 */

import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import {MathQuery} from "./QueryFilter"

export default class GTFilter {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processGTFilter(query: MathQuery):  DataStructure {
        Log.trace('GTFilter::processGTFilter( ' + JSON.stringify(query) + ' )');
        var structure: DataStructure = new DataStructure();

        let key = Object.keys(query)[0];
        console.log("processGTFilter key is..." + key);
        console.log("processGTFilter type of key is..." + typeof key);

        let lowerBound = query[key];
        console.log("processGTFilter lowerBound is..." + lowerBound);
        console.log("processGTFilter type of lowerBound is..." + typeof lowerBound);

        for(var i=0;i<this.dataStructure.data.length;i++){
            let c=this.dataStructure.data[i];
            if(c[key]>lowerBound){
                structure.add(c);
            }
        }
        return structure;

    }
}