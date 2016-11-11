"use strict";
var DatasetController_1 = require("../src/controller/DatasetController");
var QueryController_1 = require("../src/controller/QueryController");
var Util_1 = require("../src/Util");
var fs = require("fs");
var JSZip = require('jszip');
var chai_1 = require('chai');
describe("QueryController", function () {
    beforeEach(function () {
    });
    afterEach(function () {
    });
    it("Should be able to avg", function (done) {
        var query = {
            "GET": ["courses_id", "courses_pass", "courseAverage"],
            "WHERE": {
                "IS": { "courses_avg": 90 }
            },
            "GROUP": ["courses_dept", "courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": "courses_pass",
            "AS": "TABLE"
        };
        var dataset = {};
        var zipDirectory = "./courses.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller2 = new DatasetController_1.default();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                dataset = controller2.datasets;
                console.log(dataset["courses"].data.length);
                var controller = new QueryController_1.default(dataset);
                var isValid = controller.isValid(query);
                chai_1.expect(isValid).to.equal(false);
                done();
            });
        });
    });
    it("Should be able to avg", function (done) {
        var query = {
            "GET": ["courseAverage", "courses_id", "courses_pass",],
            "WHERE": {
                "LT": { "courses_avg": 90 }
            },
            "GROUP": ["courses_dept", "courses_id"],
            "APPLY": [{ "courseAverage": { "MIN": "courses_avg" } }],
            "ORDER": "courses_pass",
            "AS": "TABLE"
        };
        var dataset = {};
        var zipDirectory = "./courses.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller2 = new DatasetController_1.default();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                dataset = controller2.datasets;
                console.log(dataset["courses"].data.length);
                var controller = new QueryController_1.default(dataset);
                var isValid = controller.isValid(query);
                chai_1.expect(isValid).to.equal(false);
                done();
            });
        });
    });
    it("Should be able to low avg", function (done) {
        var query = {
            "GET": ["courseAverage", "courses_id", "courses_pass",],
            "WHERE": {
                "LT": { "courses_avg": 90 }
            },
            "GROUP": ["courses_pass", "courses_id"],
            "APPLY": [{ "courseAverage": { "MAX": "courses_avg" } }],
            "ORDER": "courses_pass",
            "AS": "TABLE"
        };
        var dataset = {};
        var zipDirectory = "./courses.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller2 = new DatasetController_1.default();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                dataset = controller2.datasets;
                console.log(dataset["courses"].data.length);
                var controller = new QueryController_1.default(dataset);
                var isValid = controller.isValid(query);
                chai_1.expect(isValid).to.equal(true);
                controller.query(query);
                done();
            });
        });
    });
    it("Should be able to high avg", function (done) {
        var query = {
            "GET": ["courses_dept", "courses_id", "numSections"],
            "WHERE": {
                "LT": { "courses_avg": 90 }
            },
            "GROUP": ["courses_dept", "courses_id"],
            "APPLY": [{ "numSections": { "COUNT": "courses_uuid" } }],
            "ORDER": { "dir": "DOWN", "keys": ["numSections"] },
            "AS": "TABLE"
        };
        var dataset = {};
        var zipDirectory = "./courses.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller2 = new DatasetController_1.default();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                dataset = controller2.datasets;
                console.log(dataset["courses"].data.length);
                var controller = new QueryController_1.default(dataset);
                var isValid = controller.isValid(query);
                chai_1.expect(isValid).to.equal(true);
                controller.query(query);
                done();
            });
        });
    });
    it("Should be able to not high avg", function (done) {
        var query = {
            "GET": ["courseAverag", "courses_id", "courses_pass",],
            "WHERE": {
                "LT": { "courses_avg": 90 }
            },
            "GROUP": ["courses_pass", "courses_id"],
            "APPLY": [{ "courseAverage": { "MAX": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE"
        };
        var dataset = {};
        var zipDirectory = "./courses.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller2 = new DatasetController_1.default();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                dataset = controller2.datasets;
                console.log(dataset["courses"].data.length);
                var controller = new QueryController_1.default(dataset);
                var isValid = controller.isValid(query);
                chai_1.expect(isValid).to.equal(false);
                done();
            });
        });
    });
    it("Should be able to invalidate max", function (done) {
        var query = {
            "GET": ["courses_dept", "courses_id", "courses_pass", "courseAverage"],
            "WHERE": {
                "GT": { "courses_avg": 90 }
            },
            "GROUP": ["courses_dept", "courses_id"],
            "APPLY": [{ "courseMax": { "MAX": "courses_avg" } }, { "numSections": { "COUNT": "courses_uuid" } }, { "courseMin": { "MIN": "courses_avg" } }],
            "ORDER": "courses_pass",
            "AS": "TABLE"
        };
        var dataset = {};
        var zipDirectory = "./courses.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller2 = new DatasetController_1.default();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                dataset = controller2.datasets;
                console.log(dataset["courses"].data.length);
                var controller = new QueryController_1.default(dataset);
                var isValid = controller.isValid(query);
                var ret = controller.query(query);
                Util_1.default.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
                chai_1.expect(ret).not.to.be.equal(null);
                chai_1.expect(isValid).to.equal(false);
                done();
            });
        });
    });
    it("Should be able to invalidate max 2", function (done) {
        var query = {
            "GET": ["courses_dept", "courses_id"],
            "WHERE": {
                "GT": { "courses_avg": 90 }
            },
            "GROUP": ["courses_dept", "courses_id"],
            "APPLY": [],
            "ORDER": "courses_pass",
            "AS": "TABLE"
        };
        var controller = new QueryController_1.default({});
        var isValid = controller.isValid(query);
        chai_1.expect(isValid).to.equal(false);
        done();
    });
    it("Should be able to max", function (done) {
        var query = {
            "GET": ["courses_dept", "courses_id", "courseMax", "numSections", "courseMin"],
            "WHERE": {
                "IS": { "courses_dept": "an*" }
            },
            "GROUP": ["courses_dept", "courses_id"],
            "APPLY": [{ "courseMax": { "MAX": "courses_avg" } }, { "numSections": { "COUNT": "courses_uuid" } }, { "courseMin": { "MIN": "courses_avg" } }],
            "ORDER": "numSections",
            "AS": "TABLE"
        };
        var dataset = {};
        var zipDirectory = "./courses.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller2 = new DatasetController_1.default();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                dataset = controller2.datasets;
                console.log(dataset["courses"].data.length);
                var controller = new QueryController_1.default(dataset);
                var isValid = controller.isValid(query);
                chai_1.expect(isValid).to.equal(true);
                var ret = controller.query(query);
                Util_1.default.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
                chai_1.expect(ret).not.to.be.equal(null);
                done();
            });
        });
    });
    it("Should be able to empty apply", function (done) {
        var query = {
            "GET": ["courses_id", "courses_dept", "courses_pass"],
            "WHERE": {
                "IS": { "courses_instructor": "deo*" }
            },
            "GROUP": ["courses_dept", "courses_id"],
            "APPLY": [],
            "ORDER": "courses_pass",
            "AS": "TABLE"
        };
        var dataset = {};
        var zipDirectory = "./courses.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller2 = new DatasetController_1.default();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                dataset = controller2.datasets;
                console.log(dataset["courses"].data.length);
                var controller = new QueryController_1.default(dataset);
                var isValid = controller.isValid(query);
                var ret = controller.query(query);
                Util_1.default.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
                chai_1.expect(ret).not.to.be.equal(null);
                chai_1.expect(isValid).to.equal(true);
                done();
            });
        });
    });
    it("Should be able to invalidate an invalid query", function () {
        var query = null;
        var dataset = {};
        var controller = new QueryController_1.default(dataset);
        var isValid = controller.isValid(query);
        chai_1.expect(isValid).to.equal(false);
    });
    it("Should be able to invalidate", function () {
        var query = { GET: ["food"], WHERE: { IS: 'apple' }, ORDER: 'food', AS: 'table' };
        var c = new DatasetController_1.default();
        var dataset = c.getDatasets();
        var controller = new QueryController_1.default(dataset);
        var ret = controller.isValid(query);
        Util_1.default.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
        chai_1.expect(ret).to.equal(false);
    });
    it("aaShould be able to validate a valid query", function (done) {
        var query = {
            "GET": ["courses_dept", "courses_id", "courses_instructor"],
            "WHERE": {
                "OR": [
                    { "AND": [
                            { "GT": { "courses_avg": 70 } },
                            { "IS": { "courses_dept": "cp*" } },
                            { "NOT": { "IS": { "courses_instructor": "murphy, gail" } } }
                        ] },
                    { "IS": { "courses_instructor": "*gregor*" } }
                ]
            },
            "AS": "TABLE"
        };
        var dataset = {};
        var zipDirectory = "./310courses.1.0.zip";
        var zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err)
                throw err;
            console.log(data);
            var controller2 = new DatasetController_1.default();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                dataset = controller2.datasets;
                console.log(dataset["courses"].data.length);
                var controller = new QueryController_1.default(dataset);
                var isValid = controller.isValid(query);
                var ret = controller.query(query);
                Util_1.default.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
                chai_1.expect(ret).not.to.be.equal(null);
                var res = ret.result;
                chai_1.expect(isValid).to.equal(true);
                done();
            });
        });
    });
});
//# sourceMappingURL=QueryControllerSpec.js.map