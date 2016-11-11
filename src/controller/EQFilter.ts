/**
 * Created by Justin on 2016/10/8.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import {MathQuery} from "./QueryFilter"

export default class EQFilter {
    private dataStructure: DataStructure = new DataStructure();

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processEQFilter(query: MathQuery):  DataStructure {
        Log.trace('GTFilter::processGTFilter( ' + JSON.stringify(query) + ' )');
        var structure: DataStructure = new DataStructure();

        let key = Object.keys(query)[0];
        let equal = query[key];

        for(var i=0;i<this.dataStructure.data.length;i++){
            let data = this.dataStructure.data[i];
            if(data[key]==equal){
                structure.add(data);
            }
        }
        return structure;
    }
}