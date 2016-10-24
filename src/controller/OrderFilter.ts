/**
 * Created by justin on 2016/10/23.
 */
//lala
import DataStructure from "../rest/model/DataStructure";
import SortUp from "./SortUp";
import SortDown from "./SortDown";
import Log from "../Util";

export interface OrderQuery {
    dir: string;
    keys: string[];
}

export default class OrderFilter {
    private dataStructure: DataStructure = null;

    constructor(datastructure: DataStructure) {
        this.dataStructure = datastructure;
    }
    public processOrderFilter (query: any, index: number): DataStructure {
        Log.trace('OrderFilter::processOrderFilter( ' + JSON.stringify(query) + ' , ' + index +' )');

        if (query.dir === "UP") {//sort "UP"

            let sortUp = new SortUp(this.dataStructure);

            if (typeof this.dataStructure.data[0][query.keys[index]] === "string") { // if the field in course is string type, sort up string
                Log.trace('OrderFilter::processOrderFilter( ' + 'UP string ' + index +' )');
                if (index === 0) {
                    this.dataStructure = sortUp.processSortUpString("nothing" ,query.keys[index]);
                } else {
                    this.dataStructure = sortUp.processSortUpString(query.keys[index-1], query.keys[index]);
                }

            } else if (typeof this.dataStructure.data[0][query.keys[index]] === "number") { // if the field in course is number type, sort up number
                Log.trace('OrderFilter::processOrderFilter( '+ 'UP number ' + index +' )');
                if (index === 0) {
                    this.dataStructure = sortUp.processSortUpNumber("nothing" ,query.keys[index]);
                } else {
                    this.dataStructure = sortUp.processSortUpNumber(query.keys[index-1], query.keys[index]);
                }


            }
            if(index < query.keys.length -1) { // if the query contains more than one key, recursive call with new query
                let orderFilter: OrderFilter = new OrderFilter(this.dataStructure);
                this.dataStructure = orderFilter.processOrderFilter(query, index+1);
            }

        } else if (query.dir === "DOWN") { //sort "DOWN"

            let sortDown = new SortDown(this.dataStructure);

            if (typeof this.dataStructure.data[0][query.keys[index]] === "string") { // if the field in course is string type, sort down string
                Log.trace('OrderFilter::processOrderFilter( '+ 'DOWN string ' + index +' )');
                if (index === 0) {
                    this.dataStructure = sortDown.processSortDownString("nothing" ,query.keys[index]);
                } else {
                    this.dataStructure = sortDown.processSortDownString(query.keys[index-1], query.keys[index]);
                }

            } else if (typeof this.dataStructure.data[0][query.keys[index]] === "number") { // if the field in course is number type, sort down number
                Log.trace('OrderFilter::processOrderFilter( '+ 'DOWN number ' + index +' )');
                if (index === 0) {
                    this.dataStructure = sortDown.processSortDownNumber("nothing" ,query.keys[index]);
                    Log.trace('OrderFilter::processOrderFilter( '+ 'call SortDown number ' + index +' )');
                } else {
                    this.dataStructure = sortDown.processSortDownNumber(query.keys[index-1], query.keys[index]);
                    Log.trace('OrderFilter::processOrderFilter( '+ 'call SortDown number ' + index +' )');
                }
            }

            if(index < query.keys.length -1){ // if the query contains more than one key, recursive call with new query
                let orderFilter: OrderFilter = new OrderFilter(this.dataStructure);
                this.dataStructure = orderFilter.processOrderFilter(query, index+1);
            }

        }

        return this.dataStructure;
    }
}