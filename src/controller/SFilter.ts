/**
 * Created by Justin on 2016/10/5.
 */

import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import SQuery from "./QueryFilter";

export default class SFilter {
    private dataStructure: DataStructure = new DataStructure();

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processSFilter(query: SQuery):  DataStructure {
        Log.trace('ISFilter::processISFilter( ' + JSON.stringify(query) + ' )');
        var structure: DataStructure = new DataStructure();

        let key = Object.keys(query)[0]; //
        console.log("ISFilter key is..." + key);
        console.log("processISFilter type of key is..." + typeof key);
        let that=this;

        let str: string = (<any>query)[key];
        let c2 = str.charAt(str.length - 1); //
        if (c2 == "*") {
            str = str.substring(0, str.length - 1);
        }
        let c1 = str.charAt(0);
        if (c1 == "*") {
            str = str.substring(1, str.length);
        }
        str=str.toLowerCase();
        if (str.length !== 0) {
            for (var i = 0; i < this.dataStructure.data.length; i++) {
                let c = this.dataStructure.data[i];
                let str2: string = c[key];
                if(typeof str2==="string") {
                    str2 = str2.toLowerCase();
                    if (str2.indexOf(str) !== -1) {
                        structure.add(c);
                    }
                }
            }

        }
        console.log("Returning from sfilter");
        return structure;

    }
}