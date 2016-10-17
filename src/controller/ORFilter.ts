/**
 * Created by Justin on 2016/10/9.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import Query from "./QueryFilter";
import QueryFilter from "./QueryFilter";

export default class ORFilter {
    private dataStructure: DataStructure = null;

    constructor(dataStructure: DataStructure) {
        this.dataStructure = dataStructure;
    }

    public processORFilter(query: [Query]): DataStructure {
        Log.trace('ORFilter::processORFilter( ' + JSON.stringify(query) + ' )');
        var selectedCourses: Course[] = [];

        var structure: DataStructure = null;

        if (query.length == 1 || query.length == 2) {
            var innerStructure: DataStructure[] = null;

            for (var i=0; i<query.length; i++) {

                let filter = new QueryFilter(this.dataStructure);
                filter.processFilter(query[i]);
                // innerStructure.push(filter.processFilter(query[i]));

                console.log("processORFilter query " + i + " is... " + JSON.stringify(query[i]));
                console.log("processORFilter type of query " + i + " is... " + typeof JSON.stringify(query[i]));
            }
            //TODO combine the two dataStructure
        } else {
            // TODO exception handling
        }


        structure.data = selectedCourses;
        return structure;
    }
}