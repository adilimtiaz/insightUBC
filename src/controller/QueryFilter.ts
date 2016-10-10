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
import Course from "../rest/model/Course";


export default class QueryFilter {
    private datasets: Datasets = null;

    constructor (datasets: Datasets) {
        this.datasets = datasets;
    }

    strRegExp(queryString: string): boolean {
        var regExp = new RegExp('[a-zA-Z0-9,_-]+');
        return regExp.test(queryString);
    }
    numberRegExp(queryString: string): boolean {
        var regExp = new RegExp('^-?\\d*\\.?\\d*$');
        return regExp.test(queryString);
    }
    keyRegExp(queryString: string): boolean {
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
        var operator: string = null;
        var filterString: string = null;
        if((queryString.indexOf("\"AND\"") === 0)||(queryString.indexOf("\"OR\"") === 0)) {
            return true;
        }
        return false;
        //new RegExp('\"\":[{' + filterRegExp + '}]');
    }
    mathComparisonRegExp(queryString: string): boolean {
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
        if(this.logicComparisonRegExp(queryString)||this.mathComparisonRegExp(queryString)||this.sComparisonRegExp(queryString)||this.negationRegExp(queryString)) {
            return true;
        } else {
            return false;
        }
    }

    public processFilter(query: string): DataStructure{
        Log.trace('QueryFilter::processFilter( ' + JSON.stringify(query) + ' )');

        var logicFilter: LogicFilter;
        var mathFilter: MathFilter;
        var sFilter: SFilter;
        var negationFilter: NegationFilter;
        var dataStructure: DataStructure = new DataStructure();


        if (this.filterRegExp(query)) {
            if(this.logicComparisonRegExp(query)) {
                logicFilter = new LogicFilter(this.datasets["courses"]);
                dataStructure = logicFilter.processLogicFilter(query);
            } else if (this.mathComparisonRegExp(query)) {
                mathFilter = new MathFilter(this.datasets["courses"]);
                dataStructure = mathFilter.processMathFilter(query);
            } else if (this.sComparisonRegExp(query)) {
                sFilter = new SFilter(this.datasets["courses"]);
                dataStructure = sFilter.processSFilter(query);
            } else if (this.negationRegExp(query)) {
                negationFilter = new NegationFilter(this.datasets["courses"]);
                dataStructure = negationFilter.processNegationFilter(query);
            }
            return dataStructure;
        }


    }

}