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
        let d = new DataStructure();
        Log.trace("Entered getDataset");
        try {
            var stats = fs.lstatSync('data/' + id + '.json');

            if (stats.isDirectory()) {
                d = this.datasets[id];
                console.log(d.data);
                console.log(d.data.length);
                return d;
            }
        }
        catch (e) {
            Log.error(id + "does not exist in data");
        }
    }

    public getDatasets(): any {
        // TODO: if datasets is empty, load all dataset files in ./data from disk

        /**
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
                    var i = 0;
                    files.forEach(function (file, index) {
                        var fs = require("fs");
                        var contents = fs.readFileSync(moveFrom + file, 'utf8');
                        let obj = JSON.parse(contents);
                        that.datasets[file.substring(0, file.length - 5)] = obj;
                        i++;
                        Log.trace("22");
                    });
                    Log.trace("11");
                    //   Log.trace(that.getSize("aa"));
                    return that.datasets;
                }
            });
        }
         */

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

                    let processedDataset = new DataStructure();
                    // TODO: iterate through files in zip (zip.files)
                    // The contents of the file will depend on the id provided. e.g.,
                    // some zips will contain .html files, some will contain .json files.
                    // You can depend on 'id' to differentiate how the zip should be handled,
                    // although you should still be tolerant to errors.
                    zip.folder("courses").forEach(function (relativePath, file) {
                        var promise = file.async("string").then(function (processedfile) {
                            let obj2 = JSON.parse(processedfile);
                            let i = 0;
                            for (i = 0; i < obj2.result.length; i++) {
                                let c:any={};
                                if (typeof obj2.result[i].hasOwnProperty(id)) {
                                    c.courses_uuid = obj2.result[i].id;
                                    c.courses_id = obj2.result[i].Course;
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



