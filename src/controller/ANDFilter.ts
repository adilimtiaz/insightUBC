/**
 * Created by Justin on 2016/10/9.
 */

import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import Query from "./QueryFilter";
import QueryFilter from "./QueryFilter";


export default class ANDFilter {

    private dataStructure: DataStructure = null;

    constructor(dataStructure: DataStructure) {
        this.dataStructure = dataStructure;
    }

    public processANDFilter(query: [Query]): DataStructure {
        Log.trace('ANDFilter::processANDFilter( ' + JSON.stringify(query) + ' )');
        // var selectedCourses: Course[] = [];
        var structure: DataStructure = new DataStructure();

        if (query.length == 1 || query.length == 2) {
            var innerStructure: DataStructure[] = null;

            for (var i=0; i<query.length; i++) {

                console.log("processANDFilter query " + i + " is... " + JSON.stringify(query[i]));
                console.log("processANDFilter type of query " + i + " is... " + typeof JSON.stringify(query[i]));

                let filter = new QueryFilter(this.dataStructure);
                filter.processFilter(query[i]);
                // innerStructure.push(filter.processFilter(query[i]));


            }
            //TODO combine the two dataStructure
        } else {
            // TODO exception handling
        }



        // console.log("processANDFilter lowerBound is..." + lowerBound);
        // console.log("processANDFilter type of lowerBound is..." + typeof lowerBound);


        // structure.data = selectedCourses;
        return structure;
    }
}