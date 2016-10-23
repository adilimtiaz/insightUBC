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
        // var selectedCourses: Course[] = [];


            var innerStructure: DataStructure = new DataStructure();

            for (var i = 0; i < query.length; i++) {

                let filter = new QueryFilter(this.dataStructure);
                let innerstruct: DataStructure = filter.processFilter(query[i]);
                for (var j = 0; j < innerstruct.data.length;j++){
                    innerStructure.add(innerstruct.data[i]);
                }
                console.log("ORFilter::processORFilter inner query " + i + " is... " + JSON.stringify(query[i]));
                console.log("ORFilter::processORFilter type of inner query " + i + " is... " + typeof JSON.stringify(query[i]));
            }

            //TODO combine the two dataStructure
            //TODO remove duplicate
        return innerStructure;
    }
}