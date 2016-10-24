// /**
//  * Created by justin on 2016/10/23.
//  */
//
// import DataStructure from "../rest/model/DataStructure";
//
// export default class SortDown {
//
//     private dataStructure: DataStructure = null;
//
//     constructor(datastructure: DataStructure) {
//         this.dataStructure = datastructure;
//     }
//
//     public processSortDownString(key: string): DataStructure {
//         for (var i = 0; i < this.dataStructure.data.length - 1; i++) {
//             let minimum = i;
//             for (var j = i + 1; j < this.dataStructure.data.length; j++) {
//                 if (this.dataStructure.data[j].courses_avg < this.dataStructure.data[minimum].courses_avg) {
//                     minimum = j;
//                 }
//                 var tempCourse: any = this.dataStructure.data[i];
//                 this.dataStructure.data[i] = this.dataStructure.data[minimum];
//                 this.dataStructure.data[minimum] = tempCourse;
//             }
//         }
//     }
//
//
//     public processSortDownNumber(key: string): DataStructure {
//         for (var i = 0; i < this.dataStructure.data.length - 1; i++) {
//             let minimum = i;
//             for (var j = i + 1; j < this.dataStructure.data.length; j++) {
//                 if (this.dataStructure.data[j].courses_avg < this.dataStructure.data[minimum].courses_avg) {
//                     minimum = j;
//                 }
//                 var tempCourse: any = this.dataStructure.data[i];
//                 this.dataStructure.data[i] = this.dataStructure.data[minimum];
//                 this.dataStructure.data[minimum] = tempCourse;
//             }
//         }
//     }
// }