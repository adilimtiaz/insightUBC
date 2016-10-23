///<reference path="../src/controller/DatasetController.ts"/>
/**
 * Created by rtholmes on 2016-09-03.
 */

import DatasetController from "../src/controller/DatasetController";
import Log from "../src/Util";

import JSZip = require('jszip');
import {expect} from 'chai';
import fs=require("fs");
import DataStructure from "../src/rest/model/DataStructure";
import {Datasets} from "../src/controller/DatasetController";

describe("DatasetController", function () {

    beforeEach(function () {
    });

    afterEach(function () {
    });


    it.only("Should be able to enter a .JSON file", function (done: Function) {
        Log.test('Getting dataset zip');
        let content = {key: 'value'};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();


            let controller = new DatasetController();
            controller.getDatasets();



    });


    it("Should be able to enter a .JSON file", function (done: Function) {
        Log.test('Getting dataset zip');
        let content = {key: 'value'};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();

        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller = new DatasetController();
            var promise = controller.process('courses', data);
            promise.then(function () {
                let d = {};
                console.log(controller.datasets["courses"].getSize());
                controller.getDatasets();
                done();
                //console.log(controller.getSize("aa"));
            });
        });
    });


    it("Should be able to delete a file", function (done: Function) {
        Log.test('Getting dataset zip');
        let content = {key: 'value'};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();

        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller = new DatasetController();
            var promise = controller.process('courses', data);
            promise.then(function () {
                // controller.delete("courses");
                //controller.getSize("courses");
                done();
            });


        });

    });
});


//});
