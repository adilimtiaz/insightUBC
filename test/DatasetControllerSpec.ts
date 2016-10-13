/**
 * Created by rtholmes on 2016-09-03.
 */

import DatasetController from "../src/controller/DatasetController";
import Log from "../src/Util";

import JSZip = require('jszip');
import {expect} from 'chai';
import fs=require("fs");
import DataStructure from "../src/rest/model/DataStructure";

describe("DatasetController", function () {

    beforeEach(function () {
    });

    afterEach(function () {
    });

    it("Should be able to receive a Dataset", function () {
        Log.test('Creating dataset');
        let content = {key: 'value'};
        let zip = new JSZip();
        zip.file('content.obj', JSON.stringify(content));
        const opts = {
            compression: 'deflate', compressionOptions: {level: 2}, type: 'base64'
        };
        return zip.generateAsync(opts).then(function (data) {
            Log.test('Dataset created');
            let controller = new DatasetController();
            return controller.process('setA', data);
        }).then(function (result) {
            Log.test('Dataset processed; result: ' + result);
            expect(result).to.equal(true);
        });

    });
    it.only("Should be able to enter a .JSON file", function (done: Function) {
        Log.test('Getting dataset zip');
        let content = {key: 'value'};
        let zipDirectory = "./310courses.1.0.zip";
        let zip = new JSZip();

        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller = new DatasetController();
            var promise=controller.process('courses', data);
            promise.then(function(){
                let d=new DataStructure();
                d=controller.datasets['courses'];
                Log.trace("Size"+d.data.length);
                done();
            });
        });

    });

});
