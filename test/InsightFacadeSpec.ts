/**
 * Created by Adil Imtiaza on 23-10-2016.
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
        zipFileContents = new Buffer(fs.readFileSync('310courses.1.0.zip')).toString('base64');
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
                expect(response.code).to.equal(404);
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

            });

        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(424);
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
                "GET": ["courses_dept", "courses_id", "courses_instructor"],
                "WHERE": {
                    "OR": [
                        {"AND": [
                            {"GT": {"courses_avg": 70}},
                            {"IS": {"courses_dept": "an*"}},
                            {"NOT": {"IS": {"courses_instructor": "murphy, gail"}}}
                        ]},
                        {"IS": {"courses_instructor": "*william*"}}
                    ]
                },
                "AS": "TABLE"
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

    it.only("Should be able to empty apply and sort numerically (200)", function () {
        var that = this;
        var data22 = fs.readFileSync('./q3.json',"utf8");
        data22=JSON.parse(data22);

        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
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
            }).then(function(res :InsightResponse){
                expect(res.code).to.equal(200);
                expect(res.body).to.equal(data22);


            });
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should be able to empty apply and sort alphanumerically (200)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                    "GET": ["courses_dept", "courses_id", "courseAverage", "maxFail"],
                    "WHERE": {},
                    "GROUP": [ "courses_dept", "courses_id" ],
                    "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}}, {"maxFail": {"MAX": "courses_fail"}} ],
                    "ORDER": { "dir": "UP", "keys": ["courseAverage", "maxFail", "courses_dept", "courses_id"]},
                    "AS":"TABLE"
                }
            ).then(function(res :InsightResponse){
                expect(res.code).to.equal(200);
            });
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });


    it("Should be able to validate empty where2 (200)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_id", "courseAverage"],
                "WHERE": {} ,
                "GROUP": [ "courses_id" ],
                "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
                "ORDER": { "dir": "UP", "keys": ["courseAverag", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){

            });
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
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
                "GROUP": [ "courses_dept" ],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){

            });
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Should be able to invalidate bad order (400)", function (done: Function) {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_id"],
                "WHERE": {"IS": {"courses_dept": "anth"}} ,
                "GROUP": [ "courses_dept" ],
                "ORDER":  "courses_avg",
                "AS":"TABLE"
            }).then(function(res :InsightResponse){

            });
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
            console.log(response.code);
            done();
        });
    });

    it("Should be able to 424 (400)", function (done: Function) {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["course_dept", "courses_id", "courses_instructor"],
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
            }).then(function(res :InsightResponse){

            });
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(424);
            console.log(response.code);
            done();
        });
    });

    it("Should be able to 400 bad get keys(400)", function (done: Function) {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_dept", "courses_i", "courses_instructor"],
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
            }).then(function(res :InsightResponse){

            });
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
            console.log(response.code);
            done();
        });
    });

    it("Should be able to 200  get keys(400)", function (done: Function) {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
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
            }).then(function(res :InsightResponse){
                expect(res.code).to.equal(200);
                console.log(res.code);
                done();
            });
        }).catch(function (response: InsightResponse) {

        });
    });

    it("Should be able to invalid group (400)", function (done: Function) {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_dept", "courses_id", "courseAverage", "maxFail"],
                "WHERE": {},
                "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}}, {"maxFail": {"MAX": "courses_fail"}} ],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "maxFail", "courses_dept", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){

            });
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
            console.log(response.code);
            done();
        });
    });

    it("Should be able to invalid laguna (400)", function (done: Function) {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_dept", "courses_id", "courseAverage", "maxFail"],
                "WHERE": {},
                "GROUP": [ "courses_dept", "courses_id" ],
                "APPLY": [ {"courses_dept": {"AVG": "courses_avg"}}, {"maxFail": {"MAX": "courses_fail"}} ],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "maxFail", "courses_dept", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){

            });
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
            console.log(response.code);
            done();
        });
    });

    it("Should be able to unique apply (400)", function (done: Function) {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_dept", "courses_id", "courseAverage", "maxFail"],
                "WHERE": {},
                "GROUP": [ "courses_dept", "courses_id" ],
                "APPLY": [ {"maxFail": {"AVG": "courses_avg"}}, {"maxFail": {"MAX": "courses_fail"}} ],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "maxFail", "courses_dept", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){

            });
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
            console.log(response.code);
            done();
        });
    });

    it("Should be able to bad query (400)", function (done: Function) {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_dept", "courses_id", "maxFail"],
                "WHERE": {},
                "GROUP": [ "courses_dept", "courses_id" ],
                "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}}, {"maxFail": {"MAX": "courses_fail"}} ],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "maxFail", "courses_dept", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){

            });
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
            console.log(response.code);
            done();
        });
    });

    it("Should be able to good query (400)", function (done: Function) {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            return facade.performQuery({
                "GET": ["courses_dept", "courses_id", "courseAverage", "maxFail"],
                "WHERE": {},
                "GROUP": [ "courses_dept", "courses_id" ],
                "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}}, {"maxFail": {"MAX": "courses_fail"}} ],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "maxFail", "courses_dept", "courses_id"]},
                "AS":"TABLE"
            }).then(function(res :InsightResponse){
                expect(res.code).to.equal(200);
                console.log(res.code);
                done();

            });
        }).catch(function (response: InsightResponse) {

        });
    });






});