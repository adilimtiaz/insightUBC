/**
 * Created by rtholmes on 2016-09-03.
 */

import Log from "../Util";
import JSZip = require('jszip');
import fs=require('fs');
import Course from "../rest/model/Course";
import DataStructure from "../rest/model/DataStructure";

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
        Log.trace("Entered getDataset");
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
        Log.trace("Entered get datasets");
        let that = this;
        if (typeof this.datasets[0] != "string") {
            var moveFrom = "./data/";
            if (!fs.existsSync(moveFrom)) {
                fs.mkdir("./data/");
            }
            fs.readdir(moveFrom, function (err, files) {
                if (err) {
                    console.error("Dont you worry child. Heavens got a plan for you");
                }
                else {
                    var i=0;
                    files.forEach(function (file, index) {
                        var fs = require("fs");
                        var contents = fs.readFileSync(moveFrom + file, 'utf8');
                        let obj=JSON.parse(contents);
                        that.datasets[i]=obj;
                        i++;
                    });
                }
            });
            return this.datasets;
        }
    }



    /**
     * Process the dataset; save it to disk when complete.
     *
     * @param id
     * @param data base64 representation of a zip file
     * @returns {Promise<boolean>} returns true if successful; false if the dataset was invalid (for whatever reason)
     */
    public process(id: string, data:any): Promise<boolean> {
        Log.trace('DatasetController::process( ' + id + '... )');

        let that = this;
        return new Promise(function (fulfill, reject) {
            try {
                let myZip = new JSZip();
                var promises:any=[];
                myZip.loadAsync(data, {base64: true}).then(function (zip: JSZip) {
                    Log.trace('DatasetController::process(..) - unzipped');

                    let processedDataset = new DataStructure();
                    // TODO: iterate through files in zip (zip.files)
                    // The contents of the file will depend on the id provided. e.g.,
                    // some zips will contain .html files, some will contain .json files.
                    // You can depend on 'id' to differentiate how the zip should be handled,
                    // although you should still be tolerant to errors.
                    zip.folder("courses").forEach(function(relativePath,file){
                        var promise= file.async("string").then(function (processedfile) {
                            let obj2 = JSON.parse(processedfile);
                            let i = 0;
                            for (i = 0; i < obj2.result.length; i++) {
                                let c = new Course();
                                if (typeof obj2.result[i].id != "undefined") {
                                    c.id = id;
                                    c.courses_id = obj2.result[i].id;
                                    c.courses_dept = obj2.result[i].Subject;
                                    c.courses_title = obj2.result[i].Title;
                                    c.courses_avg = obj2.result[i].Avg;
                                    c.courses_instructor = obj2.result[i].Professor;
                                    c.courses_pass = obj2.result[i].Pass;
                                    c.courses_fail = obj2.result[i].Fail;
                                    c.courses_audit = obj2.result[i].Audit;
                                    processedDataset.add(c);
                                }
                            }
                        },function(error){
                            Log.trace("Rejected");
                            reject(error);
                        });
                        promises.push(promise);
                    });

                    Promise.all(promises).catch(function(err) {
                        // log that I have an error, return the entire array;
                        console.log('A promise failed to resolve', err);
                        reject(err);
                    }).then(function() {
                        that.save(id, processedDataset);
                        fulfill(true);
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
        Log.trace("Entered save");
        this.datasets[id] = processedDataset;


        var dir="./data";
        //fs.openSync("./data/"+id+".json", 'w');
        if(!fs.existsSync(dir)){
            fs.mkdir("./data");
        }
        let s=JSON.stringify(this.datasets[id]);
        fs.writeFileSync("./data/"+id+".json",s);
        Log.trace("File saved");
        // TODO: actually write to disk in the ./data directory

    }


}
