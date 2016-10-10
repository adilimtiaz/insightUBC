/**
 * Created by Justin on 2016/10/5.
 */

import DataStructure from "../rest/model/DataStructure";
import ANDFilter from "./ANDFilter";
import ORFilter from "./ORFilter";

export default class LogicFilter {

    private datastructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.datastructure = datastructure;
    }

    public processLogicFilter(query: string): DataStructure {

        var andFilter: ANDFilter;
        var orFilter: ORFilter;
        var structure: DataStructure = null;

        if(query.indexOf("\"AND\"") === 0) {
            andFilter = new ANDFilter(this.datastructure);
            sturcture = andFilter.processANDFilter(query);
        } else if(query.indexOf("\"OR\"") === 0) {
            orFilter = new ORFilter(this.datastructure);
            sturcture = orFilter.processORFilter(query);
        }
        return structure;

    }
}