import DataStructure from "../rest/model/DataStructure";
import {Query} from "./QueryFilter";
import Log from "../Util";
/**
 * Created by Adil Imtiaz on 23-10-2016.
 */

export interface Data {
    [id: string]:DataStructure;
}


export default class GroupFilter {

    private datastructure: DataStructure = new DataStructure();
    private data:Data={};

    constructor(datastructure: DataStructure) {
        this.datastructure = datastructure;
    }


    public processGroups(groupQuery: string[],applyQuery: any[]):DataStructure{

        Log.trace('GroupFilter::processGroups( ' + JSON.stringify(groupQuery) + ', '+ JSON.stringify(applyQuery) + ' )');

        let that=this;
        let structure=new DataStructure();
        let groups:any[]=[];
        let flag=0;

        for(var i=0;i<this.datastructure.data.length;i++){
            let c = this.datastructure.data[i];
            let group = this.keyReturner(c,groupQuery);
            flag=0;
            let arr=Object.keys(group);
            var str:string="";
            for(var j=0;j<arr.length;j++){
                var p=arr[j];
                str=str+group[p];
            }
            /**
            for(let group in groups){

            for(let k in arr) {
                if (c.k !== group.k) {
                    flag = 1;    //c has a key not there in groups
                }
            }
            }
            */

            if(groups.indexOf(str)!==-1){
                that.data[str].data.push(c);
            }
            else{
                groups.push(str);
                that.data[str]=new DataStructure();
                that.data[str].data.push(c);
            }

        }

        if(applyQuery.length==0){
            for(var k=0;k<groups.length;k++){
                let d=that.data[groups[k]];
                let c2=d.data[0];
                structure.add(c2);
            }
        }
        else{
            for(var i=0;i<applyQuery.length;i++){
                let key=Object.keys(applyQuery[i])[0];
                let value=applyQuery[i][key];
                let key2=Object.keys(value)[0];
                let value2=value[key2];//courses_avg
                if(key2==="AVG"){
                    //iterate through a group, add field to get total sum, divide by size of group

                    for(var k=0;k<groups.length;k++) {
                        var sum=0;
                        let d=that.data[groups[k]];
                        for(var n=0;n<d.data.length;n++){
                            sum=sum+d.data[n][value2];
                        }
                        var avg=sum/(d.data.length);
                        let rounded=Number(avg.toFixed(2));
                        let c=d.data[(d.data.length-1)];
                        c[key]=rounded;
                    }
                }
                if(key2==="MAX"){
                    //iterate through a group, add field to get total sum, divide by size of group

                    for(var k=0;k<groups.length;k++) {
                        var max=0;
                        let d=that.data[groups[k]];
                        for(var n=0;n<d.data.length;n++){
                            if(d.data[n][value2]>max) {
                                max = d.data[n][value2];
                            }
                        }
                        let c=d.data[(d.data.length-1)];
                        c[key]=max;
                    }
                }
                if(key2==="MIN"){
                    //iterate through a group, add field to get total sum, divide by size of group

                    for(var k=0;k<groups.length;k++) {
                        let d=that.data[groups[k]];
                        var min=d.data[0][value2];
                        for(var n=0;n<d.data.length;n++){
                            if(d.data[n][value2]<min) {
                                min = d.data[n][value2];
                            }
                        }
                        let c=d.data[(d.data.length-1)];
                        c[key]=min;
                    }
                }
                if(key2==="COUNT"){
                    //iterate through a group, add field to get total sum, divide by size of group

                    for(var k=0;k<groups.length;k++) {
                        let d=that.data[groups[k]];
                        var count=0;
                        var arr:any=[];
                        for(var n=0;n<d.data.length;n++){
                            if(arr.indexOf(d.data[n][value2])==-1) {
                                arr.push(d.data[n][value2]);
                                ++count;
                            }
                        }
                        let c=d.data[(d.data.length-1)];
                        c[key]=count;
                    }
                }
            }
            for(var k=0;k<groups.length;k++) {
                let d=that.data[groups[k]];
                let c=d.data[(d.data.length-1)];
                structure.add(c);
            }

        }

        return structure;
    }

    public keyReturner(classObj: any,keys: string[]):any{
        var groupObj:any={};
        for(let key in keys){
            groupObj[keys[key]]=classObj[keys[key]];
        }
        return groupObj;
    }



}
