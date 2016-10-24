/**
 * Created by Adil Imtiaz on 23-10-2016.
 */

import fs = require('fs');
import Log from "../src/Util";
import {expect} from 'chai';
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";

describe("InsightFacade", function () {

    var zipFileContents: string = null;
    var facade: InsightFacade = null;
    before(function () {
        Log.info('InsightController::before() - start');
        // this zip might be in a different spot for you
        zipFileContents = new Buffer(fs.readFileSync('courses.zip')).toString('base64');
        try {
            // what you delete here is going to depend on your impl, just make sure
            // all of your temporary files and directories are deleted
            fs.unlinkSync('./data/courses.json');
        } catch (err) {
            // silently fail, but don't crash; this is fine
            Log.warn('InsightController::before() - id.json not removed (probably not present)');
        }
        //Log.info('InsightController::before() - done');
    });

    beforeEach(function () {
        facade = new InsightFacade();
    });

    it("Should be able to add a add a new dataset (204)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        return facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should be able to update an existing dataset (201)", function (done: Function) {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        var promise=facade.addDataset('courses', zipFileContents);

        promise.then(function(){
            return facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
                expect(response.code).to.equal(201);
                done();
            }).catch(function (response: InsightResponse) {
                expect.fail('Should not happen');
            });

        });
    });

    it("Should not be able to add an invalid dataset (400)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        return facade.addDataset('courses', 'some random bytes').then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Should be able to add a delete a new dataset (204)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.removeDataset('courses').then(function(res:InsightResponse){
                expect(res.code).to.equal(204);
            }).catch(function(response: InsightResponse){

                expect.fail("should not happen");
            });
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should not be able to add a delete a non-existing dataset (404)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.removeDataset('course').then(function(res:InsightResponse){
                expect(res.code).to.equal(404);
            }).catch(function(response: InsightResponse){
            });
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should be able to identify missing resources (424)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({GET: ["course_dept", "course_avg"], WHERE:  {"AND": [
                {"IS": {"course_dept": "anth"}},
                {"IS": {"course_id": "213"}}
            ]}, ORDER: 'course_avg', AS: 'table'}).then(function (res: InsightResponse){
                expect(res.code).to.equal(424);
            });

        }).catch(function (response: InsightResponse) {


        });
    });

    it("Should be able to validate good query 1 (200)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({GET: ["courses_dept", "courses_avg"], WHERE:  {"AND": [
                {"IS": {"courses_dept": "anth"}},
                {"IS": {"courses_id": "213"}}
            ]}, ORDER: 'courses_avg', AS: 'table'}).then(function(res :InsightResponse){
                expect(res.code).to.equal(200);
            });
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should be able to validate empty apply (200)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_id", "courseAverage"],
                "WHERE": {"IS": {"courses_dept": "anth"}} ,
                "GROUP": [ "courses_id" ],
                "APPLY": [ ],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){
                expect(res.code).to.equal(200);
            });
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });
    it("Should be able to validate good query (200)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_id", "courseAverage"],
                "WHERE": {"IS": {"courses_dept": "anth"}} ,
                "GROUP": [ "courses_id" ],
                "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){
                expect(res.code).to.equal(200);
            });
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should be able to validate bad (200)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_id", "courseAverage"],
                "WHERE": {} ,
                "GROUP": [ "courses_id" ],
                "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){
                expect(res.code).to.equal(200);
            });
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should be able to validate empty where (200)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_id", "courseAverage"],
                "WHERE": {} ,
                "GROUP": [ "courses_id" ],
                "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){
                expect(res.code).to.equal(200);
            });
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should be able to invalidate bad query (400)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_id"],
                "WHERE": {"IS": {"courses_dept": "anth"}} ,
                "GROUP": [ "courses_id" ],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){
                expect(res.code).to.equal(400);
            });
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });



});