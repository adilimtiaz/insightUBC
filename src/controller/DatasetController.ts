/**
 * Created by rtholmes on 2016-09-03.
 */

import Log from "../Util";
import JSZip = require('jszip');
var parse5 = require('parse5');
import { ASTNode } from 'parse5';

import fs=require('fs');
import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import {ASTAttribute} from "parse5";

/**
 * In memory representation of all datasets.
 */
export interface Datasets {
    [id: string]:DataStructure;
}


export default class DatasetController {


    public datasets: Datasets = {};

    constructor() {
        Log.trace('DatasetController::init()');
    }

    /**
     * Returns the referenced dataset. If the dataset is not in memory, it should be
     * loaded from disk and put in memory. If it is not in disk, then it should return
     * null.
     *
     * @param id
     * @returns {{}}
     */
    public getDataset(id: string): DataStructure {
        // TODO: this should check if the dataset is on disk in ./data if it is not already in memory.
        let d = new DataStructure();
        Log.trace("Entered getDataset");
        try {
            var stats = fs.lstatSync('data/' + id + '.json');

            if (stats.isDirectory()) {
                d = this.datasets[id];
                //console.log(d.data);
                //console.log(d.data.length);
                return d;
            }
        }
        catch (e) {
            Log.error(id + "does not exist in data");
        }
    }

    public getDatasets(): any {
        // TODO: if datasets is empty, load all dataset files in ./data from disk

        let that=this;
        if (this.datasets == {}||typeof this.datasets["courses"] == "undefined"){
            try {
                fs.accessSync("./data/", fs.F_OK);
                let filestoread = fs.readdirSync('./data/');
                for (var i=0;i<filestoread.length;i++){
                    if (filestoread[i].charAt(0) != "."){
                        var data = fs.readFileSync('./data/' + filestoread[i],"utf8");
                        let Data=new DataStructure();
                        Data=JSON.parse(data);
                        let id2 = filestoread[i];
                        let id=id2.substring(0, id2.length - 5);
                        that.datasets[id] = Data;
                    }

                }
            } catch (err) {
                Log.trace('DatasetController::getDatasets(..) - error:' + err.message);
            }

        }
        return this.datasets;

    }




    /**
     * Process the dataset; save it to disk when complete.
     *
     * @param id
     * @param data base64 representation of a zip file
     * @returns {Promise<boolean>} returns true if successful; false if the dataset was invalid (for whatever reason)
     */
    public process(id: string, data: any): Promise<boolean> {
        Log.trace('DatasetController::process( ' + id + '... )');
        let that = this;
        return new Promise(function (fulfill, reject) {
            try {
                let myZip = new JSZip();
                var promises: any = [];
                myZip.loadAsync(data, {base64: true}).then(function (zip: JSZip) {
                    Log.trace('DatasetController::process(..) - unzipped');
                    let that2=this;
                    let arrayofrooms:any=[];
                    let arrayofhrefs:any=[];
                    let processedDataset = new DataStructure();
                    if(zip.file("index.htm")!==null){  //go here if the file has index.htm
                        var promise = zip.file("index.htm").async("string").then(function (processedfile){
                            let s=processedfile.indexOf("<tbody>");
                            let s2=processedfile.indexOf("</tbody>");
                            let test3=processedfile.substring(s,s2+8); //only tbody is important so we process that
                            let tbody=parse5.parseFragment(test3).childNodes[0];
                            for(var i=0;i<tbody.childNodes.length;i++){
                                let node=tbody.childNodes[i];
                                if (node.nodeName=="tr") {
                                    let room:any={};
                                    room=that.Nodeprocessor(tbody.childNodes[i],room,id);
                                    if(Object.keys(room).length===3) {
                                        arrayofrooms.push(room);
                                    }
                                }
                            }          //at this point processedDataset has all the buildings
                            //open the files that are specified in index
                            //arrrayofrooms is actually all buildings
                            for(var i=0;i<arrayofrooms.length;i++){
                                var promise2 = zip.file(arrayofrooms[i]["href"]).async("string").then(function (processedfile2) {
                                    let s=processedfile2.indexOf("<tbody>");
                                    let s2=processedfile2.indexOf("</tbody>");
                                    if(s2!==-1) { //element has rooms
                                        let test3 = processedfile2.substring(s, s2 + 8); //only tbody is important so we process that
                                        let tbody2 = parse5.parseFragment(test3).childNodes[0];
                                        for (var i = 0; i < tbody2.childNodes.length; i++) {
                                            let node = tbody2.childNodes[i];
                                            if (node.nodeName == "tr") {
                                                let room: any = {};
                                                room = that.Nodeprocessor2(node, arrayofrooms[i], id);
                                                if (Object.keys(room).length === 8) {
                                                    room[id+"_fullname"]
                                                    processedDataset.add(room);
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                            promises.push(promise2);
                            Promise.all(promises).catch(function (err) {
                                // log that I have an error, return the entire array;
                                console.log('A promise failed to resolve', err);
                                reject(false);
                            }).then(function () {
                                if (processedDataset.data.length == 0) {
                                    reject(false);
                                }
                                that.save(id, processedDataset);
                                fulfill(true);
                            });
                        });
                        promises.push(promise);
                        Promise.all(promises).catch(function (err) {
                            // log that I have an error, return the entire array;
                            console.log('A promise failed to resolve', err);
                            reject(false);
                        }).then(function () {
                            console.log("Wait");
                        });
                    }
                    // TODO: iterate through files in zip (zip.files)
                    // The contents of the file will depend on the id provided. e.g.,
                    // some zips will contain .html files, some will contain .json files.
                    // You can depend on 'id' to differentiate how the zip should be handled,
                    // although you should still be tolerant to errors.
                    else {   //if it doesnt then to be a valid zip it must be a courses zip
                        zip.folder("courses").forEach(function (relativePath, file) {
                            var promise = file.async("string").then(function (processedfile) {
                                let obj2 = JSON.parse(processedfile);
                                let i = 0;
                                for (i = 0; i < obj2.result.length; i++) {
                                    let c: any = {};
                                    if (typeof obj2.result[i].hasOwnProperty(Course)) {
                                        c[id + '_uuid'] = obj2.result[i].id;
                                        c[id + '_id'] = obj2.result[i].Course;
                                        c[id + '_dept'] = obj2.result[i].Subject;
                                        c[id + '_title'] = obj2.result[i].Title;
                                        c[id + '_avg'] = obj2.result[i].Avg;
                                        c[id + '_instructor'] = obj2.result[i].Professor;
                                        c[id + '_pass'] = obj2.result[i].Pass;
                                        c[id + '_fail'] = obj2.result[i].Fail;
                                        c[id + '_audit'] = obj2.result[i].Audit;
                                        processedDataset.add(c);
                                    }
                                }
                            }, function (error) {
                                Log.trace("Rejected");
                                reject(error);
                            });
                            promises.push(promise);
                        });
                        Promise.all(promises).catch(function (err) {
                            // log that I have an error, return the entire array;
                            console.log('A promise failed to resolve', err);
                            reject(false);
                        }).then(function () {
                            if (processedDataset.data.length == 0) {
                                reject(false);
                            }
                            that.save(id, processedDataset);
                            fulfill(true);
                        });
                    }

                }).catch(function (err) {
                    Log.trace('DatasetController::process(..) - unzip ERROR: ' + err.message);
                    reject(false);
                });
            } catch (err) {
                Log.trace('DatasetController::process(..) - ERROR: ' + err);
                reject(false);
            }
        });
    }

    public Nodeprocessor(node: ASTNode,room:any,id: string): any {
        if (node.attrs) {
            node.attrs.forEach(function (value: ASTAttribute) {
                if((value.name=="class")&&(value.value==="views-field views-field-field-building-code")){
                    let str=node.childNodes[0].value;  //Removing /n and spaces
                    let p=str.indexOf("\n");
                    if(p!==-1) {
                        str = str.substring(p + 2, str.length);
                    }
                    str=str.trim();
                    room[id+"_shortname"]=str;
                }
                if((value.name=="class")&&(value.value==="views-field views-field-field-building-address")){
                    let str=node.childNodes[0].value;
                    let p=str.indexOf("\n");
                    if(p!==-1) {
                        str = str.substring(p + 2, str.length);
                    }
                    str=str.trim();
                    room[id+"_address"]=str;
                }
                if((value.name=="href")){
                    let str=value.value;
                    let p=str.indexOf("./");
                    if(p!==-1) {
                        str = str.substring(p + 2, str.length);
                    }
                    room["href"]=str;
                }
            });
        }

        if (node.value) {
        }

        if (node.childNodes) {
            for(var i=0;i<node.childNodes.length;i++){
                this.Nodeprocessor(node.childNodes[i],room,id);
            }
        }
        return room;
    }

    public Nodeprocessor2(node: ASTNode,room:any,id: string): any {
        if (node.attrs) {
            node.attrs.forEach(function (value: ASTAttribute) {
                if((value.name=="title")&&(value.value==="Room Details")){
                    let str=node.childNodes[0].value;  //Removing /n and spaces
                    room[id+"_number"]=str; //adding room number
                    str=room[id+"_shortname"]+"_"+room[id+"_number"];
                    room[id+"_name"]=str;   //adding room name
                }
                if((value.name=="class")&&(value.value==="views-field views-field-field-room-capacity")){
                    let str=node.childNodes[0].value;
                    let p=str.indexOf("\n");
                    if(p!==-1) {
                        str = str.substring(p + 2, str.length);
                    }
                    str=str.trim();
                    let n=parseInt(str);
                    room[id+"_seats"]=n;  //room seats 6 properties
                }
                if((value.name=="class")&&(value.value==="views-field views-field-field-room-furniture")){
                    let str=node.childNodes[0].value;
                    let p=str.indexOf("\n");
                    if(p!==-1) {
                        str = str.substring(p + 2, str.length);
                    }
                    str=str.trim();
                    room[id+"_furniture"]=str;  //room seats 8 properties
                }
                if((value.name=="class")&&(value.value==="views-field views-field-field-room-type")){
                    let str=node.childNodes[0].value;
                    let p=str.indexOf("\n");
                    if(p!==-1) {
                        str = str.substring(p + 2, str.length);
                    }
                    str=str.trim();
                    room[id+"_type"]=str;  //room seats 8 properties
                }
                if((value.name=="href")){
                    let str=value.value;
                    delete room["href"];
                    room[id+"_href"]=str;  //room href 7 properties
                }
            });
        }



        if (node.value) {
        }

        if (node.childNodes) {
            for(var i=0;i<node.childNodes.length;i++){
                this.Nodeprocessor2(node.childNodes[i],room,id);
            }
        }
        return room;
    }


    /**
     * Writes the processed dataset to disk as 'id.json'. The function should overwrite
     * any existing dataset with the same name.
     *
     * @param id
     * @param processedDataset
     */
    public save(id: string, processedDataset: any) {
        // add it to the memory model
        Log.trace("Entered save");
        this.datasets[id] = processedDataset;


        var dir = "./data";
        //fs.openSync("./data/"+id+".json", 'w');
        if (!fs.existsSync(dir)) {
            fs.mkdir("./data");
        }
        let s = JSON.stringify(this.datasets[id]);
        fs.writeFileSync("./data/" + id + ".json", s);
        Log.trace("File saved");
        // TODO: actually write to disk in the ./data directory

    }

    public getSize(id: string): number {
        let i = 0;
        if (typeof this.datasets[id] != "undefined") {
            i = this.datasets[id].data.length;
        }
        return i;
    }

    public delete(id: string):boolean {
        Log.trace('DatasetController::delete( ' + id + '... )');
        let that = this;
        try {
            var stats = fs.lstatSync('./data/' + id + ".json");
            if (!stats.isFile()) {
                throw new Error("Trying to delete dataset that does not exist")
            }
            fs.unlinkSync('./data/' + id + ".json");
            delete that.datasets[id];
            return true;
        } catch (err) {
            Log.trace('DatasetController:delete(..) - ERROR: ' + err);
            return false;
        }
    }
}



