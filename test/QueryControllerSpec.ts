/**
 * Created by rtholmes on 2016-10-31.
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
 /**
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
 */
it("Should be able to validate a valid query", function (done: Function) {
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

    it("Should be able to invalidate an invalid query", function () {
        let query: any = null;
        let dataset: Datasets = {};
        let controller = new QueryController(dataset);
        let isValid = controller.isValid(query);

        expect(isValid).to.equal(false);
    });

    it("Should be able to query, although the answer will be empty", function () {
        // NOTE: this is not actually a valid query for D1, nor is the result correct.
        let query: QueryRequest = {GET: 'food', WHERE: {IS: 'apple'}, ORDER: 'food', AS: 'table'};
        let dataset: Datasets = {};
        let controller = new QueryController(dataset);
        let ret = controller.query(query);
        Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
        expect(ret).not.to.be.equal(null);
        // should check that the value is meaningful
    });

    it("Should be able to validate a valid query, but too complicated", function () {
        // NOTE: this is not actually a valid query for D1, nor is the result correct.
        let query: QueryRequest = {GET: ["courses_dept", "courses_id", "courses_avg"], WHERE: {
            OR: [
                {AND: [
                    {GT: {"courses_avg": 70}},
                    {IS: {"courses_dept": "adhe"}}
                ]},
                {EQ: {"courses_avg": 90}}
                ]}, ORDER: 'courses_avg', AS: 'table'};
        let dataset: Datasets = {};
        let controller = new QueryController(dataset);
        let ret = controller.query(query);
        Log.test('In: ' + JSON.stringify(query) + ', out: ' + JSON.stringify(ret));
        expect(ret).not.to.be.equal(null);
        // should check that the value is meaningful
    });
     */
});
