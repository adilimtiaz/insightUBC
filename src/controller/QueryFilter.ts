/**
 * Created by Justin on 2016/10/5.
 */

import {Datasets} from "./DatasetController";
import DataStructure from "../rest/model/DataStructure";
import Log from "../Util";
import LogicFilter from "./LogicFilter";
import MathFilter from "./MathFilter";
import SFilter from "./SFilter";
import NegationFilter from "./NegationFilter";


export default class QueryFilter {

    private datastructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.datastructure = datastructure;
    }

    strRegExp(queryString: string): boolean {
        Log.trace('QueryFilter::strRegExp( ' + queryString + ' )');
        var regExp = new RegExp('[a-zA-Z0-9,_-]+');
        return regExp.test(queryString);
    }
    numberRegExp(queryString: string): boolean {
        Log.trace('QueryFilter::numberRegExp( ' + queryString + ' )');
        var regExp = new RegExp('^-?\\d*\\.?\\d*$');
        return regExp.test(queryString);
    }
    keyRegExp(queryString: string): boolean {
        Log.trace('QueryFilter::keyRegExp( ' + queryString + ' )');
        var firstString: string;
        var secondString: string;
        firstString = queryString.slice(0, queryString.indexOf("_"));
        secondString = queryString.slice(queryString.indexOf("_")+1);
        if (this.strRegExp(firstString) && this.strRegExp(secondString)) {
            return true;
        } else {
            return false;
        }
    }
    logicComparisonRegExp(queryString:string): boolean {
        Log.trace('QueryFilter::logicComparisonRegExp( ' + queryString + ' )');
        var operator: string = null;
        var filterString: string = null;
        if((queryString.indexOf("\"AND\"") === 0)||(queryString.indexOf("\"OR\"") === 0)) {
            return true;
        }
        return false;
        //new RegExp('\"\":[{' + filterRegExp + '}]');
    }
    mathComparisonRegExp(queryString: string): boolean {
        Log.trace('QueryFilter::mathComparisonRegExp( ' + queryString + ' )');
        var operator: string = null;
        var keyString: string;
        var numberString: string;
        keyString = queryString.slice(queryString.indexOf("{\"")+1, queryString.indexOf("\":"));
        numberString = queryString.slice(queryString.indexOf(":")+1, queryString.indexOf("}"));
        if((queryString.indexOf("\"LT\"") === 0)||(queryString.indexOf("\"GT\"") === 0)||(queryString.indexOf("\"EQ\"") === 0)) {
            if(this.keyRegExp(keyString) && this.numberRegExp(numberString)) {
                return true;
            }
        }
        return false;
    }
    sComparisonRegExp(queryString: string): boolean {
        Log.trace('QueryFilter::sComparisonRegExp( ' + queryString + ' )');
        var keyString: string;
        var regularString: string;
        keyString = queryString.slice(queryString.indexOf("{\"")+1, queryString.indexOf("\":"));
        regularString = queryString.slice(queryString.indexOf(":\"")+1, queryString.indexOf("\"}"));
        if(queryString.indexOf("\"IS\"") === 0) {
            return this.keyRegExp(keyString);
        }
        return false;
    }
    negationRegExp(queryString: string): boolean {
        Log.trace('QueryFilter::negationRegExp( ' + queryString + ' )');
        var filterString: string;
        filterString = queryString.slice(queryString.indexOf(":{"), queryString.lastIndexOf("}"));
        if(queryString.indexOf("\"IS\"") === 0) {
            if(this.filterRegExp(filterString)) {
                return true;
            }
        }
        return false;

    }
    filterRegExp(queryString:string): boolean {
        Log.trace('QueryFilter::filterRegExp( ' + queryString + ' )');
        if(this.logicComparisonRegExp(queryString)||this.mathComparisonRegExp(queryString)||this.sComparisonRegExp(queryString)||this.negationRegExp(queryString)) {
            return true;
        } else {
            return false;
        }
    }

    public processFilter(query: string): DataStructure{
        Log.trace('QueryFilter::processFilter( ' + query + ' )');

        var logicFilter: LogicFilter;
        var mathFilter: MathFilter;
        var sFilter: SFilter;
        var negationFilter: NegationFilter;
        var dataStructure: DataStructure = new DataStructure();


        if (this.filterRegExp(query)) {
            if(this.logicComparisonRegExp(query)) {
                logicFilter = new LogicFilter(this.datastructure);
                dataStructure = logicFilter.processLogicFilter(query);
            } else if (this.mathComparisonRegExp(query)) {
                mathFilter = new MathFilter(this.datastructure);
                dataStructure = mathFilter.processMathFilter(query);
            } else if (this.sComparisonRegExp(query)) {
                sFilter = new SFilter(this.datastructure);
                dataStructure = sFilter.processSFilter(query);
            } else if (this.negationRegExp(query)) {
                negationFilter = new NegationFilter(this.datastructure);
                dataStructure = negationFilter.processNegationFilter(query);
            }
            return dataStructure;
        }


    }

}