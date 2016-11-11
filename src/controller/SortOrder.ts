/**
 * Created by Justin on 2016/10/10.
 */

import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";

export default class SortOrder {
    private dataStructure: DataStructure = new DataStructure();

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    // public processSortOrder(query: any): DataStructure {
    //     Log.trace('SortOrder::processSortOrder( ' + query + ' )');
    //     Log.trace(query);
    //
    //
    //     this.dataStructure.data.sort(function(a, b) {
    //         return parseFloat(a.query) - parseFloat(b.query);
    //     });
    //     return this.dataStructure;
    // }

    public processSortOrder(query: any): DataStructure {
        Log.trace('SortOrder::processSortOrder( ' + query + ' )');
        Log.trace(query);
        // let a=this.dataStructure.data[0][query];
        // if(typeof a==="number"){
        //     //console.log("w");
        //     this.dataStructure.data.sort(((a:any,b:any) => a[query] - b[query]));
        // }
        // else{
        //     if(typeof a==="string") {
        //         let that = this;
        //         this.dataStructure.data.sort(function (a: any, b: any) {
        //             return that.alphanumCase(a[query], b[query]);
        //         });
        //     }
        // }
        // return this.dataStructure;
        console.log(typeof this.dataStructure.data)
        if(typeof this.dataStructure.data[0][query] === "string") {
            for (var i = 0; i < this.dataStructure.data.length - 1; i++) { // This has the same function as "sort up string" and the original part has some problem. If you have read this and test it, you can delete the original code.
                let minimum = i;
                for (var j = i + 1; j < this.dataStructure.data.length; j++) {
                    if (isNaN(parseInt(this.dataStructure.data[minimum][query]))) {
                        if (this.dataStructure.data[j][query] < this.dataStructure.data[minimum][query]) {
                            minimum = j;
                        }
                    } else {
                        if (parseInt(this.dataStructure.data[j][query]) < parseInt(this.dataStructure.data[minimum][query])) {
                            minimum = j;
                        }
                    }
                }
                var tempCourse: any = this.dataStructure.data[i];
                this.dataStructure.data[i] = this.dataStructure.data[minimum];
                this.dataStructure.data[minimum] = tempCourse;
            }
        } else if (typeof this.dataStructure.data[0][query] === "number") {
            for (var i = 0; i < this.dataStructure.data.length - 1; i++) {
                let minimum = i;
                for (var j = i + 1; j < this.dataStructure.data.length; j++) {
                    if (this.dataStructure.data[j][query] < this.dataStructure.data[minimum][query]) {
                        minimum = j;
                    }
                }
                var tempCourse: any = this.dataStructure.data[i];
                this.dataStructure.data[i] = this.dataStructure.data[minimum];
                this.dataStructure.data[minimum] = tempCourse;
            }
        }

        return this.dataStructure;
    }

    // public alphanumCase(a:string, b:string) : number{
    //     let aa = this.chunkify(a.toLowerCase());
    //     let bb = this.chunkify(b.toLowerCase());
    //
    //     for (var x = 0; aa[x] && bb[x]; x++) {
    //         if (aa[x] !== bb[x]) {
    //             var c = Number(aa[x]), d = Number(bb[x]);
    //             if (c == aa[x] && d == bb[x]) {
    //                 return c - d;
    //             } else return (aa[x] > bb[x]) ? 1 : -1;
    //         }
    //     }
    //     return aa.length - bb.length;
    // }
    //
    // ///Adapted from http://www.davekoelle.com/files/alphanum.js
    //
    // public  chunkify(t: string):any {
    //     let tz:any = [];
    //     var x = 0, y = -1,  i=0;
    //     let j:any=0;
    //     let m=false,n=false;
    //     while (i = (j = t.charAt(x++)).charCodeAt(0)) {
    //         m = (i == 46 || (i >=48 && i <= 57));
    //         if (m !== n) {
    //             tz[++y] = "";
    //             n = m;
    //         }
    //         tz[y] += j;
    //     }
    //     return tz;
    // }


}
