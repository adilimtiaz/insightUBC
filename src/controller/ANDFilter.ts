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

        var innerStructure: DataStructure = new DataStructure();

        let filter = new QueryFilter(this.dataStructure);
        let innerstruct2: DataStructure = filter.processFilter(query[0]);
        for (var i=0; i<innerstruct2.data.length; i++) {
            innerStructure.add(innerstruct2.data[i]);
        }
        for (var j = 1; j < query.length; j++) {

            let filter = new QueryFilter(innerStructure);
            innerStructure= filter.processFilter(query[j]);
        }


        return innerStructure;
    }
}