/**
 * Created by Justin on 2016/10/8.
 */

import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import {MathQuery} from "./QueryFilter"

export default class GTFilter {
    private dataStructure: DataStructure = new DataStructure();

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processGTFilter(query: MathQuery):  DataStructure {
        Log.trace('GTFilter::processGTFilter( ' + JSON.stringify(query) + ' )');
        var structure: DataStructure = new DataStructure();

        let key = Object.keys(query)[0];
        let lowerBound = query[key];

        for (var i = 0; i < this.dataStructure.data.length; i++) {
                let data = this.dataStructure.data[i];
            //    if (!data.hasOwnProperty(key)) {
              //      throw new Error("424");
               // }
                if (data[key] > lowerBound) {
                    structure.add(data);
                }
            }
        return structure;

    }
}