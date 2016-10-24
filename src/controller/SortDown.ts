/**
 * Created by justin on 2016/10/23.
 */
//lala
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";

export default class SortDown {

    private dataStructure: DataStructure = new DataStructure();

    constructor(dataStructure: DataStructure) {
        this.dataStructure = dataStructure;
    }

    public processSortDownString(preKey: string, key: string): DataStructure {
        Log.trace('SortDown::processSortDownString( ' + preKey + ' , ' + key +' )');
        if (preKey === "nothing"){
            for (var i = 0; i < this.dataStructure.data.length - 1; i++) {
                let maximum = i;
                for (var j = i + 1; j < this.dataStructure.data.length; j++) {
                    if (parseInt(this.dataStructure.data[j][key]) > parseInt(this.dataStructure.data[maximum][key])) {
                        maximum = j;
                    }
                    var tempCourse: any = this.dataStructure.data[i];
                    this.dataStructure.data[i] = this.dataStructure.data[maximum];
                    this.dataStructure.data[maximum] = tempCourse;
                }
            }
        } else {
            for (var i = 0; i < this.dataStructure.data.length - 1; i++) {
                let margin = this.dataStructure.data[i][preKey];
                let maximum = i;
                for (var j = i + 1; j < this.dataStructure.data.length; j++) {
                    if (this.dataStructure.data[j][preKey] === margin) {
                        if (parseInt(this.dataStructure.data[j][key]) > parseInt(this.dataStructure.data[maximum][key])) {
                            maximum = j;
                        }
                        var tempCourse: any = this.dataStructure.data[i];
                        this.dataStructure.data[i] = this.dataStructure.data[maximum];
                        this.dataStructure.data[maximum] = tempCourse;
                    }
                }
            }
        }
        return this.dataStructure;
    }


    public processSortDownNumber(preKey: string, key: string): DataStructure {
        Log.trace('SortDown::processSortDownNumber( ' + preKey + ' , ' + key +' )');
        if (preKey === "nothing"){
            for (var i = 0; i < this.dataStructure.data.length - 1; i++) {
                let maximum = i;
                for (var j = i + 1; j < this.dataStructure.data.length; j++) {
                    if (this.dataStructure.data[j][key] > this.dataStructure.data[maximum][key]) {
                        maximum = j;
                    }
                    var tempCourse: any = this.dataStructure.data[i];
                    this.dataStructure.data[i] = this.dataStructure.data[maximum];
                    this.dataStructure.data[maximum] = tempCourse;
                }
            }
        } else {
            for (var i = 0; i < this.dataStructure.data.length - 1; i++) {
                let margin = this.dataStructure.data[i][preKey];
                let maximum = i;
                for (var j = i + 1; j < this.dataStructure.data.length; j++) {
                    if (this.dataStructure.data[j][preKey] === margin) {
                        if (this.dataStructure.data[j][key] > this.dataStructure.data[maximum][key]) {
                            maximum = j;
                        }
                        var tempCourse: any = this.dataStructure.data[i];
                        this.dataStructure.data[i] = this.dataStructure.data[maximum];
                        this.dataStructure.data[maximum] = tempCourse;
                    }
                }
            }
        }
        return this.dataStructure;
    }
}