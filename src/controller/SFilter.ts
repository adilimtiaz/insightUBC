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
        let res=str.split("*");
        if(res.length===1) {
            for (var i = 0; i < this.dataStructure.data.length; i++) {
                let c = this.dataStructure.data[i];
                if (typeof c[key] === "string") {
                    let str2 = c[key];//str2 is equal to first seven letters
                    if (str2 == str) {
                        structure.add(c);
                    }
                }
            }
        }
        else if(res.length===2){ //only one wildcard
            if(res[1]===""){ //wildcard at end
                for (var i = 0; i < this.dataStructure.data.length; i++) {
                    let c = this.dataStructure.data[i];
                    if (typeof c[key] === "string") {
                        let str2 = c[key];
                        if (str2.startsWith(res[0])) {
                            structure.add(c);
                        }
                    }
                }
            }
            else{
                for (var i = 0; i < this.dataStructure.data.length; i++) {
                    let c = this.dataStructure.data[i];
                    if (typeof c[key] === "string") {
                        let str2 = c[key];
                        if (str2.endsWith(res[1])) {
                            structure.add(c);
                        }
                    }
                }
            }
        }
        else if(res.length===3){
            for (var i = 0; i < this.dataStructure.data.length; i++) {
                let c = this.dataStructure.data[i];
                if (typeof c[key] === "string") {
                    let str2 = c[key];
                    if (str2.indexOf(res[1])!==-1) {
                        structure.add(c);
                    }
                }
            }
        }

        console.log("Returning from sfilter");
        return structure;

    }
}