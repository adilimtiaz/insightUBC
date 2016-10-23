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
    it("Should be able to validate a valid query", function (done) {
        var query = { GET: ["courses_dept", "courses_avg"], WHERE: { "AND": [
                    { "IS": { "courses_dept": "anth" } },
                    { "IS": { "courses_id": "213" } }
                ] }, ORDER: 'courses_avg', AS: 'table' };
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
                console.log(controller2.datasets["courses"].getSize());
                dataset = controller2.datasets;
                console.log(dataset["courses"].getSize());
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
});
//# sourceMappingURL=QueryControllerSpec.js.map