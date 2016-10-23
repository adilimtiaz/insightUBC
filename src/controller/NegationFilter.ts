/**
 * Created by Justin on 2016/10/8.
 */
import DataStructure from "../rest/model/DataStructure";
import Course from "../rest/model/Course";
import Log from "../Util";
import Query from "./QueryFilter";
import QueryFilter from "./QueryFilter";

export default class NegationFilter {
    private dataStructure: DataStructure = null;

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
            index = structure.data.indexOf(innerStructure.data[i]);
            if (index > -1) {
                structure.data.splice(index, 1);
            }
        }


       return structure;
    }
}