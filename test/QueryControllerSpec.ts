/**
 * Created by rtholmes on 2016-10-31.tt
 */

import {Datasets, default as DatasetController} from "../src/controller/DatasetController";
import QueryController from "../src/controller/QueryController";
import {QueryRequest} from "../src/controller/QueryController";
import Log from "../src/Util";
import fs=require("fs");
import JSZip = require('jszip');

import {expect} from 'chai';
describe("QueryController", function () {

    beforeEach(function () {
    });

    afterEach(function () {
    });
    /**
     it("Should be able to validate a valid query", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {GET: ["courses_dept", "courses_avg"], WHERE: {GT: {"courses_avg": 90}}, ORDER: 'courses_avg', AS: 'table'};
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].getSize());
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].getSize());
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                let ret = controller.query(query);
                Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
                expect(ret).not.to.be.equal(null);
                expect(isValid).to.equal(true);
                done();
            });
        });
    });

     it("Should be able to validate a valid query", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {GET: ["courses_dept", "courses_avg"], WHERE:  {"NOT": {"IS": {"courses_dept": "ANTH"}}}, ORDER: 'courses_avg', AS: 'table'};
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].getSize());
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].getSize());
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                let ret = controller.query(query);
                Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
                expect(ret).not.to.be.equal(null);
                expect(isValid).to.equal(true);
                done();
            });
        });
    });


     it("Should be able to validate a valid query", function (done: Function) {

    // NOTE: this is not actually a valid query for D1
    let query: QueryRequest = {GET: ["courses_dept", "courses_avg"], WHERE:  {"OR": [
        {"IS": {"courses_dept": "anth"}},
        {"IS": {"courses_dept": "adhe"}}
    ]}, ORDER: 'courses_avg', AS: 'table'};
    let dataset: Datasets = {};
    let zipDirectory = "./courses.zip";
    let zip = new JSZip();
    fs.readFile(zipDirectory, function (err, data) {
        if (err) throw err;
        console.log(data);

        let controller2 = new DatasetController();
        var promise = controller2.process('courses', data);
        promise.then(function () {
            console.log(controller2.datasets["courses"].getSize());
            //controller.getDatasets();
            //console.log(controller.getSize("aa"));
            dataset=controller2.datasets;
            console.log(dataset["courses"].getSize());
            let controller = new QueryController(dataset);
            let isValid = controller.isValid(query);
            let ret = controller.query(query);
            Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
            expect(ret).not.to.be.equal(null);
            expect(isValid).to.equal(true);
            done();
        });
    });
});




     /**



     it("Should be able to validate a valid query 1", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {GET: ["courses_dept", "courses_avg"], WHERE:  {"AND": [
            {"IS": {"courses_dept": "anth"}},
            {"IS": {"courses_id": "213"}}
        ]}, ORDER: 'courses_avg', AS: 'table'};
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                let ret = controller.query(query);
                Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
                expect(ret).not.to.be.equal(null);
                expect(isValid).to.equal(true);
                done();
            });
        });
    });
     it("Should be able to validate a valid query 2", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {GET: ["courses_dept"], WHERE:  {"AND": [
            {"IS": {"courses_dept": "anth"}},
            {"IS": {"courses_id": "213"}}
        ]}, ORDER: { "dir": "UP", "keys": ["courses_dept"]}, AS: 'table'};
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                expect(isValid).to.equal(true);
                done();
            });
        });
    });

     it("Should be able to invalidate a valid query", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {GET: ["courses_dept", "courses_avg"], WHERE:  {"AND": [
            {"IS": {"courses_dept": "anth"}},
            {"IS": {"courses_id": "213"}}
        ]}, ORDER: { "dir": "UP", "keys": ["courses_dept", "courses_id"]}, AS: 'table'};
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                expect(isValid).to.equal(false);
                done();
            });
        });
    });
     /**
     it("Should be able to validate a valid query", function (done: Function) {

    // NOTE: this is not actually a valid query for D1
    let query: QueryRequest = {GET: ["courses_dept", "courses_avg"], WHERE:  {"AND": [
        {"IS": {"courses_dept": "anth"}},
        {"IS": {"courses_id": "213"}}
    ]}, ORDER: { "dir": "UP", "keys": ["courses_dept", "courses_id"]}, AS: 'table'};
    let dataset: Datasets = {};
    let zipDirectory = "./courses.zip";
    let zip = new JSZip();
    fs.readFile(zipDirectory, function (err, data) {
        if (err) throw err;
        console.log(data);

        let controller2 = new DatasetController();
        var promise = controller2.process('courses', data);
        promise.then(function () {
            console.log(controller2.datasets["courses"].data.length);
            //controller.getDatasets();
            //console.log(controller.getSize("aa"));
            dataset=controller2.datasets;
            console.log(dataset["courses"].data.length);
            let controller = new QueryController(dataset);
            let isValid = controller.isValid(query);
            let ret = controller.query(query);
            Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
            expect(ret).not.to.be.equal(null);
            expect(isValid).to.equal(true);
            done();
        });
    });
});
     it("Should be able to validate a valid query 2", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {GET: ["courses_dept"], WHERE:  {"AND": [
            {"IS": {"courses_dept": "anth"}},
            {"IS": {"courses_id": "213"}}
        ]}, ORDER: { "dir": "UP", "keys": ["courses_dept"]}, AS: 'table'};
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                expect(isValid).to.equal(true);
                done();
            });
        });
    });

     it("Should be able to invalidate a valid query", function (done: Function) {
    // NOTE: this is not actually a valid query for D1
    let query: QueryRequest = {GET: ["courses_dept", "courses_avg"], WHERE:  {"AND": [
        {"IS": {"courses_dept": "anth"}},
        {"IS": {"courses_id": "213"}}
    ]}, ORDER: { "dir": "UP", "keys": ["courses_dept", "courses_id"]}, AS: 'table'};
    let dataset: Datasets = {};
    let zipDirectory = "./courses.zip";
    let zip = new JSZip();
    fs.readFile(zipDirectory, function (err, data) {
        if (err) throw err;
        console.log(data);

        let controller2 = new DatasetController();
        var promise = controller2.process('courses', data);
        promise.then(function () {
            console.log(controller2.datasets["courses"].data.length);
            //controller.getDatasets();
            //console.log(controller.getSize("aa"));
            dataset=controller2.datasets;
            console.log(dataset["courses"].data.length);
            let controller = new QueryController(dataset);
            let isValid = controller.isValid(query);
            expect(isValid).to.equal(false);
            done();
        });
    });
});
     */
    it("Should be able to avg", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {
            "GET": ["courses_id","courses_pass", "courseAverage"],
            "WHERE": {
                "IS" : {"courses_avg" : 90}
            } ,
            "GROUP": [ "courses_dept","courses_id" ],
            "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
            "ORDER": "courses_pass",
            "AS":"TABLE"
        };
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                expect(isValid).to.equal(false);
                done();
            });
        });
    });

    it("Should be able to avg", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {
            "GET": ["courseAverage","courses_id","courses_pass", ],
            "WHERE": {
                "LT" : {"courses_avg" : 90}
            } ,
            "GROUP": [ "courses_dept","courses_id" ],
            "APPLY": [ {"courseAverage": {"MIN": "courses_avg"}} ],
            "ORDER": "courses_pass",
            "AS":"TABLE"
        };
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                expect(isValid).to.equal(false);
                done();
            });
        });
    });

    it("Should be able to low avg", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {
            "GET": ["courseAverage","courses_id","courses_pass", ],
            "WHERE": {
                "LT" : {"courses_avg" : 90}
            } ,
            "GROUP": [ "courses_pass","courses_id" ],
            "APPLY": [ {"courseAverage": {"MAX": "courses_avg"}} ],
            "ORDER": "courses_pass",
            "AS":"TABLE"
        };
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                expect(isValid).to.equal(true);
                controller.query(query);
                done();
            });
        });
    });

    it("Should be able to high avg", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: any = {
            "GET": ["courses_dept","courses_id","numSections"],
            "WHERE": {
                "LT" : {"courses_avg" : 90}
            } ,
            "GROUP": [ "courses_dept","courses_id" ],
            "APPLY": [ {"numSections": {"COUNT": "courses_uuid"}} ],
            "ORDER": { "dir": "DOWN", "keys": ["numSections"]},
            "AS":"TABLE"
        };
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                expect(isValid).to.equal(true);
                controller.query(query);
                done();
            });
        });
    });

    it("Should be able to not high avg", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {
            "GET": ["courseAverag","courses_id","courses_pass", ],
            "WHERE": {
                "LT" : {"courses_avg" : 90}
            } ,
            "GROUP": [ "courses_pass","courses_id" ],
            "APPLY": [ {"courseAverage": {"MAX": "courses_avg"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
            "AS":"TABLE"
        };
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                expect(isValid).to.equal(false);
                done();
            });
        });
    });



    it("Should be able to invalidate max", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {
            "GET": ["courses_dept","courses_id","courses_pass", "courseAverage"],
            "WHERE": {
                "GT" : {"courses_avg" : 90}
            } ,
            "GROUP": [ "courses_dept","courses_id" ],
            "APPLY": [ {"courseMax": {"MAX": "courses_avg"}},{"numSections": {"COUNT": "courses_uuid"}},{"courseMin": {"MIN": "courses_avg"}} ],
            "ORDER": "courses_pass",
            "AS":"TABLE"
        };
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                let ret = controller.query(query);
                Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
                expect(ret).not.to.be.equal(null);
                expect(isValid).to.equal(false);
                done();
            });
        });
    });

    it("Should be able to invalidate max 2", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {
            "GET": ["courses_dept","courses_id"],
            "WHERE": {
                "GT" : {"courses_avg" : 90}
            } ,
            "GROUP": [ "courses_dept","courses_id" ],
            "APPLY": [],
            "ORDER": "courses_pass",
            "AS":"TABLE"
        };

                let controller = new QueryController({});
                let isValid = controller.isValid(query);
                expect(isValid).to.equal(false);
                done();
    });




    it("Should be able to max", function (done: Function) {
        // NOTE: this is not actually a valid query for D1
        let query: QueryRequest = {
            "GET": ["courses_dept","courses_id","courseMax","numSections","courseMin"],
            "WHERE":{
                "IS" : {"courses_dept" : "an*"}
            } ,
            "GROUP": [ "courses_dept","courses_id" ],
            "APPLY": [ {"courseMax": {"MAX": "courses_avg"}},{"numSections": {"COUNT": "courses_uuid"}},{"courseMin": {"MIN": "courses_avg"}} ],
            "ORDER": "numSections",
            "AS":"TABLE"
        };
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                expect(isValid).to.equal(true);
                let ret = controller.query(query);
                Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
                expect(ret).not.to.be.equal(null);
                done();
            });
        });
    });


    it("Should be able to empty apply", function (done: Function) {
    // NOTE: this is not actually a valid query for D1
    let query: QueryRequest = {
        "GET": ["courses_id","courses_dept","courses_pass"],
        "WHERE": {
            "IS" : {"courses_instructor": "deo*"}
        } ,
        "GROUP": [ "courses_dept","courses_id" ],
        "APPLY": [],
        "ORDER": "courses_pass",
        "AS":"TABLE"
    };
    let dataset: Datasets = {};
    let zipDirectory = "./courses.zip";
    let zip = new JSZip();
    fs.readFile(zipDirectory, function (err, data) {
        if (err) throw err;
        console.log(data);

        let controller2 = new DatasetController();
        var promise = controller2.process('courses', data);
        promise.then(function () {
            console.log(controller2.datasets["courses"].data.length);
            //controller.getDatasets();
            //console.log(controller.getSize("aa"));
            dataset=controller2.datasets;
            console.log(dataset["courses"].data.length);
            let controller = new QueryController(dataset);
            let isValid = controller.isValid(query);
            let ret = controller.query(query);
            Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
            expect(ret).not.to.be.equal(null);
            expect(isValid).to.equal(true);
            done();
        });
    });
});
    /**
     */




     it("Should be able to invalidate an invalid query", function () {
        let query: any = null;
        let dataset: Datasets = {};
        let controller = new QueryController(dataset);
        let isValid = controller.isValid(query);

        expect(isValid).to.equal(false);
    });

    it("Should be able to invalidate", function () {
        // NOTE: this is not actually a valid query for D1, nor is the result correct.
        let query: QueryRequest = {GET: ["food"], WHERE: {IS: 'apple'}, ORDER: 'food', AS: 'table'};
        let c=new DatasetController();
        let dataset: Datasets = c.getDatasets();
        let controller = new QueryController(dataset);
        let ret = controller.isValid(query);
        Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
        expect(ret).to.equal(false);
        // should check that the value is meaningful
    });




    it("aaShould be able to validate a valid query", function (done: Function) {
        // NOTE: this is not actually a valid query for D1;

        let query: QueryRequest = {
            "GET": ["courses_dept", "courses_id", "courses_instructor"],
            "WHERE": {
                "OR": [
                    {"AND": [
                        {"GT": {"courses_avg": 70}},
                        {"IS": {"courses_dept": "cp*"}},
                        {"NOT": {"IS": {"courses_instructor": "murphy, gail"}}}
                    ]},
                    {"IS": {"courses_instructor": "*gregor*"}}
                ]
            },
            "AS": "TABLE"
        };
        let dataset: Datasets = {};
        let zipDirectory = "./310courses.1.0.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                let ret = controller.query(query);
                Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
                expect(ret).not.to.be.equal(null);
                let res=ret.result;
                expect(isValid).to.equal(true);
                done();
            });
        });
    });

    it("aaShould be able to not", function (done: Function) {
        // NOTE: this is not actually a valid query for D1;

        let query: QueryRequest = {
            "GET": ["courses_dept", "courses_id", "courses_instructor"],
            "WHERE":  {
                "OR": [
                    {"AND": [
                        {"GT": {"courses_avg": 70}},
                        {"IS": {"courses_dept": "adhe"}}
                    ]},
                    {"EQ": {"courses_avg": 74.4}}
                ]
            },
            "AS": "TABLE"
        };
       //
        let dataset: Datasets = {};
        let zipDirectory = "./courses.zip";
        let zip = new JSZip();
        fs.readFile(zipDirectory, function (err, data) {
            if (err) throw err;
            console.log(data);

            let controller2 = new DatasetController();
            var promise = controller2.process('courses', data);
            promise.then(function () {
                console.log(controller2.datasets["courses"].data.length);
                //controller.getDatasets();
                //console.log(controller.getSize("aa"));
                dataset=controller2.datasets;
                console.log(dataset["courses"].data.length);
                let controller = new QueryController(dataset);
                let isValid = controller.isValid(query);
                let ret = controller.query(query);
                Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
                expect(ret).not.to.be.equal(null);
                let res=ret.result;
                expect(isValid).to.equal(true);
                done();
            });
        });
    });




});
