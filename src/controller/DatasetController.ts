/**
 * Created by rtholmes on 2016-09-03.
 */

import Log from "../Util";
import JSZip = require('jszip');

/**
 * In memory representation of all datasets.
 */
export interface Datasets {
    [id: string]: {};
}

/**
 * Created by rtholmes on 2016-09-03.
 */

import Log from "../Util";
import JSZip = require('jszip');
import fs=require('fs');
import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";
import {exists} from "fs";

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
    public getDataset(id: string): any {
        // TODO: this should check if the dataset is on disk in ./data if it is not already in memory.
        try {
            var stats = fs.lstatSync('data/' + id + '.json');
            if (stats.isDirectory()) {
                return this.datasets[id];
            }
        }
        catch (e){
            Log.error(id+"does not exist in data");
        }
    }

    public getDatasets(): any {
        // TODO: if datasets is empty, load all dataset files in ./data from disk
        var promises:any = [];
        let that = this;
        if (typeof this.datasets[0] != "string") {
            var moveFrom = "./data/courses";
            if(!fs.existsSync(moveFrom)){
                fs.mkdir("./data/courses");
            }
            var promise2=fs.readdir(moveFrom, function (err, files) {
                if (err) {
                    console.error("Dont you worry child. Heavens got a plan for you");
                }
                else {
                    files.forEach(function(file,index){

                        const opts = {
                            compression: 'deflate', compressionOptions: {level: 2}, type: 'base64'
                        };
                        //Promise.all(promises).then(function() {
                        let filedata = "";
                        let zip = new JSZip();
                        fs.readFile(moveFrom + file, function (err, data) {
                            filedata = JSON.stringify(data);
                        });
                        //      promises.push(promise);
                        //        Promise.all(promises).then(function (results) {
                        zip.file(moveFrom, filedata);
                        zip.generateAsync(opts).then(function (data) {
                            that.process(moveFrom, data);
                        });
                        //promises.push(promise);
                    });
                    //        });
                    //});
                }
            });
            promises.push(promise2);
            Promise.all(promises).catch(function(err) {
                Log.trace("Bad files in /data");
            }).then(function () {
                return that.datasets;
            });
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
    public process(id: string, data:any): Promise<boolean> {
        let that = this;
        return new Promise(function (fulfill, reject) {
            try {
                let myZip = new JSZip();
                var promises:any=[];
                var promise=myZip.loadAsync(data, {base64: true}).then(function (zip: JSZip) {
                    Log.trace('DatasetController::process(..) - unzipped');
                    promises.push(promise);
                    Promise.all(promises).then(function() {
                        let processedDataset = new DataStructure();
                        // TODO: iterate through files in zip (zip.files)
                        // The contents of the file will depend on the id provided. e.g.,
                        // some zips will contain .html files, some will contain .json files.
                        // You can depend on 'id' to differentiate how the zip should be handled,
                        // although you should still be tolerant to errors.
                        promises.push(promise);
                        var promise2: void = myZip.forEach(function (relativePath, file) {
                            promises.push(promise2);
                            Promise.all(promises).then(function () {
                                let obj = file;
                                var promise3= file.async("string").then(function (processedfile) {
                                    let obj2 = JSON.parse(processedfile);
                                    let i = 0;
                                    for (i = 0; i < obj2.length; i++) {
                                        let c = new Course();
                                        if (typeof obj2[i].id != "undefined") {
                                            c.id=id;
                                            c.courses_id = obj2[i].id;
                                            c.courses_dept = obj2[i].Subject;
                                            c.courses_title = obj2[i].Title;
                                            c.courses_avg = obj2[i].Avg;
                                            c.courses_instructor = obj2[i].Professor;
                                            c.courses_pass = obj2[i].Pass;
                                            c.courses_fail = obj2[i].Fail;
                                            c.courses_audit = obj2[i].Audit;
                                            processedDataset.add(c);
                                            Log.trace("Controller size on end of process: " + processedDataset.getSize());
                                        }
                                    }
                                });
                                promises.push(promise3);
                                Promise.all(promises).then(function (results) {
                                    Log.trace("Alll promises passed");
                                    that.save(id, processedDataset);
                                    fulfill(true);
                                });
                            });
                        });
                    });
                }).catch(function (err) {
                    Log.trace('DatasetController::process(..) - unzip ERROR: ' + err.message);
                    reject(err);
                });
            } catch (err) {
                Log.trace('DatasetController::process(..) - ERROR: ' + err);
                reject(err);
            }
        });
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
        this.datasets[id] = processedDataset;

        var dir="./processedData";
        var fd = fs.openSync("./processedData/"+id+".json", 'w');
        if(!fs.existsSync(dir)){
            fs.mkdir("./processedData");
        }
        let s=JSON.stringify(this.datasets[id]);
        fs.writeFileSync("./processedData/"+id+".json",s);
        // TODO: actually write to disk in the ./data directory
    }


}
}