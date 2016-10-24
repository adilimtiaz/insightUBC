/**
 * Created by justin on 2016/10/23.
 */

import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";

export default class SortUp {

    private dataStructure: DataStructure = null;

    constructor(dataStructure: DataStructure) {
        this.dataStructure = dataStructure;
    }

    public processSortUpString(preKey: string, key: string): DataStructure {
        Log.trace('SortUp::processSortUpString( ' + preKey + ' , ' + key +' )');
        if (preKey === "nothing"){
            for (var i = 0; i < this.dataStructure.data.length - 1; i++) {
                let minimum = i;
                for (var j = i + 1; j < this.dataStructure.data.length; j++) {
                    if (parseInt(this.dataStructure.data[j][key]) < parseInt(this.dataStructure.data[minimum][key])) {
                        minimum = j;
                    }
                    var tempCourse: any = this.dataStructure.data[i];
                    this.dataStructure.data[i] = this.dataStructure.data[minimum];
                    this.dataStructure.data[minimum] = tempCourse;
                }
            }
        } else {
            for (var i = 0; i < this.dataStructure.data.length - 1; i++) {
                let margin = this.dataStructure.data[i][preKey];
                let minimum = i;
                for (var j = i + 1; j < this.dataStructure.data.length; j++) {
                    if (this.dataStructure.data[j][preKey] === margin) {
                        if (parseInt(this.dataStructure.data[j][key]) < parseInt(this.dataStructure.data[minimum][key])) {
                            minimum = j;
                        }
                        var tempCourse: any = this.dataStructure.data[i];
                        this.dataStructure.data[i] = this.dataStructure.data[minimum];
                        this.dataStructure.data[minimum] = tempCourse;
                    }
                }
            }

        }

        return this.dataStructure;
    }



    public processSortUpNumber(preKey: string, key: string): DataStructure {
        Log.trace('SortUp::processSortUpNumber( ' + preKey + ' , ' + key +' )');
        if (preKey === "nothing"){
            for (var i = 0; i < this.dataStructure.data.length - 1; i++) {
                let minimum = i;
                for (var j = i + 1; j < this.dataStructure.data.length; j++) {
                    if (this.dataStructure.data[j][key] < this.dataStructure.data[minimum][key]) {
                        minimum = j;
                    }
                    var tempCourse: any = this.dataStructure.data[i];
                    this.dataStructure.data[i] = this.dataStructure.data[minimum];
                    this.dataStructure.data[minimum] = tempCourse;
                }
            }
        } else {
            for (var i = 0; i < this.dataStructure.data.length - 1; i++) {
                let margin = this.dataStructure.data[i][preKey];
                let minimum = i;
                for (var j = i + 1; j < this.dataStructure.data.length; j++) {
                    if (this.dataStructure.data[j][preKey] === margin) {
                        if (this.dataStructure.data[j][key] < this.dataStructure.data[minimum][key]) {
                            minimum = j;
                        }
                        var tempCourse: any = this.dataStructure.data[i];
                        this.dataStructure.data[i] = this.dataStructure.data[minimum];
                        this.dataStructure.data[minimum] = tempCourse;
                    }
                }
            }
        }

        return this.dataStructure;
    }
}