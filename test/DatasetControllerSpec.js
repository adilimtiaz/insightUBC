"use strict";
var DatasetController_1 = require("../src/controller/DatasetController");
var Util_1 = require("../src/Util");
var JSZip = require('jszip');
var fs = require("fs");
describe("DatasetController", function () {
    beforeEach(function () {
    });
    afterEach(function () {
    });
    it("Should be able to enter a .JSON file1", function () {
        Util_1.default.test('Getting dataset zip');
        var content = { key: 'value' };
        var zipDirectory = "./courses.zip";
        var zip = new JSZip();
        var controller = new DatasetController_1.default();
        controller.getDatasets();
    });
    it("Should be able to enter a .JSON file", function () {
        Util_1.default.test('Getting dataset zip');
        var content = { key: 'value' };
        var zipDirectory = "./courses.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller = new DatasetController_1.default();
            var promise = controller.process('courses', data);
            promise.then(function () {
                var d = {};
                console.log(controller.datasets["courses"].data.length);
            });
        });
    });
    it("Should be able to delete a file", function (done) {
        Util_1.default.test('Getting dataset zip');
        var content = { key: 'value' };
        var zipDirectory = "./courses.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller = new DatasetController_1.default();
            var promise = controller.process('courses', data);
            promise.then(function () {
                done();
            });
        });
    });
    it.only("Should be able to read a rooms file", function (done) {
        Util_1.default.test('Getting dataset zip');
        var content = { key: 'value' };
        var zipDirectory = "./310rooms.1.1.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller = new DatasetController_1.default();
            var promise = controller.process('courses', data);
            promise.then(function () {
                done();
            });
        });
    });
});
//# sourceMappingURL=DatasetControllerSpec.js.map