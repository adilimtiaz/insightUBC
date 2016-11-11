/**
 * Created by Justin on 2016/10/9.
 */


import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import Query from "./QueryFilter";
import QueryFilter from "./QueryFilter";


export default class ANDFilter {

    private dataStructure: DataStructure = new DataStructure();

    constructor(dataStructure: DataStructure) {
        this.dataStructure = dataStructure;
    }

    public processANDFilter(query: [Query]): DataStructure {
        Log.trace('ANDFilter::processANDFilter( ' + JSON.stringify(query) + ' )');

        var innerStructure: DataStructure = this.dataStructure;
        for(var i=0; i<query.length; i++) {
            let filter = new QueryFilter(innerStructure); // Use innerStructure for new filter to base on. The result data must fulfill all of the conditions on the filter.
            innerStructure = filter.processFilter(query[i]);
        }

        return innerStructure;
    }
}