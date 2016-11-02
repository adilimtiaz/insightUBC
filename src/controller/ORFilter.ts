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
            let d1=new DataStructure();
            let filter = new QueryFilter(this.dataStructure);
            d1 = filter.processFilter(query[i]);
            for(var j=0;j<d1.data.length;j++){
                innerStructure.add(d1.data[j]);
            }
            console.log("ORFilter::processORFilter inner query " + i + " is... " + JSON.stringify(query[i]));
            console.log("ORFilter::processORFilter type of inner query " + i + " is... " + typeof JSON.stringify(query[i]));
        }

        //TODO remove duplicate
        return innerStructure;
    }
}