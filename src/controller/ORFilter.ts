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
    private dataset:Data={};


    constructor(dataStructure: DataStructure) {
        this.dataStructure = dataStructure;
    }

    public processORFilter(query: [Query]): DataStructure {
        Log.trace('ORFilter::processORFilter( ' + JSON.stringify(query) + ' )');

        var innerStructure: DataStructure = new DataStructure();
        let i=0;
        for (i = 0; i < query.length; i++) {

            let filter = new QueryFilter(this.dataStructure);
            this.dataset[i] = filter.processFilter(query[i]);
            console.log("ORFilter::processORFilter inner query " + i + " is... " + JSON.stringify(query[i]));
            console.log("ORFilter::processORFilter type of inner query " + i + " is... " + typeof JSON.stringify(query[i]));
        }

        for (var j = 0; j < i;j++){
            for(var k=0;k<this.dataset[j].data.length;k++) {
                if(innerStructure.alluuids.indexOf(this.dataset[j].data[k]['courses_uuid'])===-1) {
                    innerStructure.add(this.dataset[j].data[k]);
                }
            }
        }

        //TODO remove duplicate
        return innerStructure;
    }
}