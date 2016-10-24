// /**
//  * Created by justin on 2016/10/23.
//  */
//
// import DataStructure from "../rest/model/DataStructure";
// import SortUp from "./SortUp";
// import SortDown from "./SortDown";
//
// export interface OrderQuery {
//     dir: string;
//     keys: string[];
// }
//
// export default class OrderFilter {
//     private dataStructure: DataStructure = null;
//
//     constructor(datastructure: DataStructure) {
//         this.dataStructure = datastructure;
//     }
//     public processOrderFilter (query: OrderQuery): DataStructure {
//
//         if (query.dir === "UP") {//sort "UP"
//
//             let sortUp = new SortUp(this.dataStructure);
//
//             if (typeof this.dataStructure.data[0][query.keys[0]] === "string") { // if the field in course is string type, sort up string
//                 this.dataStructure = sortUp.processSortUpString(query.keys[0]);
//             } else if (typeof this.dataStructure.data[0][query.keys[0]] === "number") { // if the field in course is number type, sort up number
//                 this.dataStructure = sortUp.processSortUpNumber(query.keys[0]);
//             }
//             if(query.keys.length > 1){ // if the query contains more than one key, recursive call with new query
//                 let newQuery = {dir: query.dir, keys: query.keys.slice(0, 1)};
//
//                 let orderFilter: OrderFilter = new OrderFilter(this.dataStructure);
//                 this.dataStructure = orderFilter.processOrderFilter(newQuery);
//             }
//
//         } else if (query.dir === "DOWN") { //sort "DOWN"
//
//             let sortDown = new SortDown(this.dataStructure);
//
//             if (typeof this.dataStructure.data[0][query.keys[0]] === "string") { // if the field in course is string type, sort down string
//                 this.dataStructure = sortDown.processSortDownString(query.keys[0]);
//             } else if (typeof this.dataStructure.data[0][query.keys[0]] === "number") { // if the field in course is number type, sort down number
//                 this.dataStructure = sortDown.processSortDownNumber(query.keys[0]);
//             }
//
//             if(query.keys.length > 1){ // if the query contains more than one key, recursive call with new query
//                 let newQuery = {dir: query.dir, keys: query.keys.slice(0, 1)};
//
//                 let orderFilter: OrderFilter = new OrderFilter(this.dataStructure);
//                 this.dataStructure = orderFilter.processOrderFilter(newQuery);
//             }
//
//         }
//         return this.dataStructure;
//     }
// }