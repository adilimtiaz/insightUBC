/**
 * Created by Justin on 2016/10/5.
 */

import DataStructure from "../rest/model/DataStructure";
import LTFilter from "./LTFilter";
import GTFilter from "./GTFilter";
import EQFilter from "./EQFilter";
import Log from "../Util";

export default class MathFilter {

    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }

    public processMathFilter(query: string): DataStructure{

        Log.trace('MathFilter::processMathFilter( ' + query + ' )');

        var ltFilter: LTFilter;
        var gtFilter: GTFilter;
        var eqFilter: EQFilter;
        var structure: DataStructure = null;

        if(query.indexOf("\"LT\"") === 0) {
            ltFilter = new LTFilter(this.dataStructure);
            structure = ltFilter.processLTFilter(query);
        } else if(query.indexOf("\"GT\"") === 0) {
            gtFilter = new GTFilter(this.dataStructure);
            structure = gtFilter.processGTFilter(query);
        } else if(query.indexOf("\"EQ\"") === 0) {
            eqFilter = new EQFilter(this.dataStructure);
            structure = eqFilter.processEQFilter(query);
        }
        return structure;

    }
}