"use strict";
var DatasetController_1 = require("../src/controller/DatasetController");
var Util_1 = require("../src/Util");
var JSZip = require('jszip');
var chai_1 = require('chai');
var fs = require("fs");
var DataStructure_1 = require("../src/rest/model/DataStructure");
describe("DatasetController", function () {
    beforeEach(function () {
    });
    afterEach(function () {
    });
    it("Should be able to receive a Dataset", function () {
        Util_1.default.test('Creating dataset');
        var content = { key: 'value' };
        var zip = new JSZip();
        zip.file('content.obj', JSON.stringify(content));
        var opts = {
            compression: 'deflate', compressionOptions: { level: 2 }, type: 'base64'
        };
        return zip.generateAsync(opts).then(function (data) {
            Util_1.default.test('Dataset created');
            var controller = new DatasetController_1.default();
            return controller.process('setA', data);
        }).then(function (result) {
            Util_1.default.test('Dataset processed; result: ' + result);
            chai_1.expect(result).to.equal(true);
        });
    });
    it.only("Should be able to enter a .JSON file", function (done) {
        Util_1.default.test('Getting dataset zip');
        var content = { key: 'value' };
        var zipDirectory = "./310courses.1.0.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller = new DatasetController_1.default();
            var promise = controller.process('courses', data);
            promise.then(function () {
                var d = new DataStructure_1.default();
                d = controller.datasets['courses'];
                Util_1.default.trace("Size" + d.data.length);
                done();
            });
        });
    });
});
//# sourceMappingURL=DatasetControllerSpec.js.map