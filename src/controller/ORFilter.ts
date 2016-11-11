/**
 * Created by Justin on 2016/10/9.
 */


import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import Query from "./QueryFilter";
import QueryFilter from "./QueryFilter";

export interface Data {
    [id: number]:DataStructure;
}

export default class ORFilter {
    private dataStructure: DataStructure = new DataStructure();

    constructor(dataStructure: DataStructure) {
        this.dataStructure = dataStructure;
    }

    public processORFilter(query: [Query]): DataStructure {
        Log.trace('ORFilter::processORFilter( ' + JSON.stringify(query) + ' )');

        var structure: DataStructure = new DataStructure();
        for (var i = query.length-1; i > -1; i--) {
            let innerStructure = new DataStructure();
            let filter = new QueryFilter(this.dataStructure);
            innerStructure = filter.processFilter(query[i]);

            for(var j=0; j<innerStructure.data.length; j++) {
                structure.add(innerStructure.data[j]);
            }
            // if(i === 0) {
            //     structure = innerStructure;
            // } else {
            //     for(var j=0; j<innerStructure.data.length; j++) {
            //         if(!structure.identical(innerStructure.data[j])){ // Check if new data is already in the old dataStructure
            //             structure.add(innerStructure.data[j]);
            //         }
            //     }
            // }

            // console.log("ORFilter::processORFilter inner query " + i + " is... " + JSON.stringify(query[i]));
            // console.log("ORFilter::processORFilter type of inner query " + i + " is... " + typeof JSON.stringify(query[i]));
        }

        //TODO remove duplicate
        return structure;
    }
}