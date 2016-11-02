/**
 * Created by Justin on 2016/10/8.
 */

import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import Query from "./QueryFilter";
import QueryFilter from "./QueryFilter";

export default class NegationFilter {
    private dataStructure: DataStructure = new DataStructure();

    constructor(dataStructure: DataStructure) {
        this.dataStructure = dataStructure;
    }
    public processNegationFilter(query: Query): DataStructure {
        Log.trace('NegationFilter::processNegationFilter( ' + JSON.stringify(query) + ' )');

        var structure: DataStructure = this.dataStructure;

        let filter = new QueryFilter(this.dataStructure);
        let innerStructure = filter.processFilter(query);

        // TODO this.dataStructure minus innerStructure
        var index=-2;
        for (var i=0; i<innerStructure.data.length; i++) {
            index = structure.alluuids.indexOf(innerStructure.data[i]['courses_uuid']);
            if (index > -1) {
                structure.data.splice(index,1);
                structure.alluuids.splice(index,1);
            }
        }

        console.log("Leaving not");
        return structure;

    }
}