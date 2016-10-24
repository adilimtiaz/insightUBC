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

    public processSortOrder(query: any): DataStructure {
        Log.trace('SortOrder::processSortOrder( ' + query + ' )');
        Log.trace(query);


        this.dataStructure.data.sort(function(a, b) {
            return parseFloat(a.query) - parseFloat(b.query);
        });
        return this.dataStructure;
    }
}
