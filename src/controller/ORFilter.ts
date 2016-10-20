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

        var structure: DataStructure = null;

        if (query.length == 1 || query.length == 2) {
            var innerStructure: DataStructure[] = null;

            for (var i=0; i<query.length; i++) {

                let filter = new QueryFilter(this.dataStructure);
                let innerstruct = filter.processFilter(query[i]);
                innerStructure.push(innerstruct);

                console.log("ORFilter::processORFilter inner query " + i + " is... " + JSON.stringify(query[i]));
                console.log("ORFilter::processORFilter type of inner query " + i + " is... " + typeof JSON.stringify(query[i]));
            }

            //TODO combine the two dataStructure
            //TODO remove duplicate
            if(innerStructure.length === 1) {
                structure = innerStructure[0];
            } else if (innerStructure.length === 2) {
                for (var j=0; j<innerStructure[1].data.length; j++) {
                    innerStructure[0].data.push(innerStructure[1].data[j]);
                }
                structure = innerStructure[0];
            }

        } else {
            // TODO exception handling
        }



        return structure;
    }
}