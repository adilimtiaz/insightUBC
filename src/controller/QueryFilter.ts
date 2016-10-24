/**
 * Created by Justin on 2016/10/5.
 */


import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import ANDFilter from "./ANDFilter";
import ORFilter from "./ORFilter";
import LTFilter from "./LTFilter";
import GTFilter from "./GTFilter";
import EQFilter from "./EQFilter";
import SFilter from "./SFilter";
import NegationFilter from "./NegationFilter";


export interface Query {
    [key:string]: any;
}



export interface MathQuery {
    [key:string]: number;
}
export interface SQuery {
    [key:string]: any;
}

export default class QueryFilter {

    private datastructure: DataStructure = new DataStructure();

    constructor(datastructure: DataStructure) {
        this.datastructure = datastructure;
    }


    public processFilter(query: Query): DataStructure{
        Log.trace('QueryFilter::processFilter( ' + JSON.stringify(query) + ' )');

        let structure: DataStructure = new DataStructure();
        let arr=Object.keys(query);
        if(arr.length==0){return this.datastructure;}
        let key = Object.keys(query)[0];
        console.log("processFilter...key is"+ key);
        console.log("processFilter...typeof key is"+ typeof key);
        let value = query[key];
        console.log("processFilter...value is"+ JSON.stringify(value));
        console.log("processFilter...typeof value is"+ typeof value);


        // let newKey = Object.keys(value);
        // for (var j=0; j<newKey.length; j++) {
        //     var name = newKey[j];
        //     var newValue = value[name];
        //     console.log("newKey is..." + name);
        //     console.log("type of newKey is..." + typeof name);
        //     console.log('newValue is ...' + newValue);
        //     console.log("type of newValue is..." + typeof newValue);
        //     // Do something
        // }


        if(key === "LT") {
            let ltFilter = new LTFilter(this.datastructure);
            structure = ltFilter.processLTFilter(value);
        } else if (key === "GT") {
            let gtFilter = new GTFilter(this.datastructure);
            structure = gtFilter.processGTFilter(value);
        } else if (key === "EQ") {
            let eqFilter = new EQFilter(this.datastructure);
            structure = eqFilter.processEQFilter(value);
        } else if (key === "IS") {
            let sFilter = new SFilter(this.datastructure);
            structure = sFilter.processSFilter(value);
        } else if (key === "OR") {
            let orFilter = new ORFilter(this.datastructure);
            structure = orFilter.processORFilter(value);
        } else if (key === "AND") {
            let andFilter = new ANDFilter(this.datastructure);
            structure = andFilter.processANDFilter(value);
        } else if (key === "NOT") {
            let negationFilter = new NegationFilter(this.datastructure);
            structure = negationFilter.processNegationFilter(value);
        } else {

        }


        return structure;
    }

}