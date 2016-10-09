/**
 * Created by Justin on 2016/10/5.
 */

import {Datasets} from "./DatasetController";
import Log from "../Util";
import LogicFilter from "./LogicFilter";
import MathFilter from "./MathFilter";
import SFilter from "./LogicFilter";
import NegationFilter from "./NegationFilter";


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
        if(query.indexOf("\"AND\"") !== -1) {
            operator = "AND";
        } else if(query.indexOf("\"OR\"") !== -1) {
            operator = "OR";
        } else {
            return false;
        }
        if ()
        new RegExp('\"\":[{' + filterRegExp + '}]');
    }
    mathComparisonRegExp(queryString: string): boolean {
        var operator: string = null;
        var keyString: string = null;
        var numberString: string = null;
        if(queryString.indexOf("\"LT\"") !== -1) {
            operator = "LT";
        } else if(queryString.indexOf("\"GT\"") !== -1) {
            operator = "GT";
        } else if(queryString.indexOf("\"EQ\"") !== -1) {
            operator = "EQ";
        } else {
            return false;
        }
        keyString = queryString.slice(queryString.indexOf("{\"")+1, queryString.indexOf("\":"));
        numberString = queryString.slice(queryString.indexOf(":")+1, queryString.indexOf("}"));
        if(this.keyRegExp(keyString) && this.numberRegExp(numberString)) {
            return true;
        } else {
            return false;
        }
    }
    sComparisonRegExp(queryString: string): boolean {
        var keyString: string;
        var regularString: string;
        keyString = queryString.slice(queryString.indexOf("{\"")+1, queryString.indexOf("\":"));
        regularString = queryString.slice(queryString.indexOf(":\"")+1, queryString.indexOf("\"}"));
        return this.keyRegExp(keyString);
    }
    negationRegExp(queryString: string): boolean {
        var filterString: string;
        filterString = queryString.slice(queryString.indexOf(":{"), queryString.lastIndexOf("}"));
        if(this.filterRegExp(filterString)) {
            return true;
        } else {
            return false;
        }
    }
    filterRegExp(queryString:string): boolean {
        if(this.logicComparisonRegExp(queryString)||this.mathComparisonRegExp(queryString)||this.sComparisonRegExp(queryString)||this.negationRegExp(queryString)) {
            return true;
        } else {
            return false;
        }
    }

    public processFilter(query: string) {
        Log.trace('QueryFilter::processFilter( ' + JSON.stringify(query) + ' )');

        var operator: string = null;
        var content: string = null;
        var logicFilter: LogicFilter;
        var mathFilter: MathFilter;
        var sFilter: SFilter;
        var negationFilter: NegationFilter;



        if (this.filterRegExp(query)) {
            if(this.logicComparisonRegExp(query)) {
                logicFilter = new LogicFilter(query);
            } else if (this.mathComparisonRegExp(query)) {
                mathFilter = new MathFilter(query);
            } else if (this.sComparisonRegExp(query)) {
                sFilter = new SFilter(query);
            } else if (this.negationRegExp(query)) {
                negationFilter = new NegationFilter(query);
            }
            return;
        }


    }

}