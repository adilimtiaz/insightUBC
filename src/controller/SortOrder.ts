/**
 * Created by Justin on 2016/10/10.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import {type} from "os";

export default class SortOrder {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processSortOrder(query: string): DataStructure {
        Log.trace('SortOrder::processSortOrder( ' + query + ' )');
        Log.trace(query);


        this.dataStructure.data.sort(function(a, b) {
            return parseFloat(a.query) - parseFloat(b.query);
        });
        return this.dataStructure;
    }
}
