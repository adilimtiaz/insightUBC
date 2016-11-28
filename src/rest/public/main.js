$(function () {
    $("#datasetAdd").click(function () {
        var id = $("#datasetId").val();
        var zip = $("#datasetZip").prop('files')[0];
        var data = new FormData();
        data.append("zip", zip);
        $.ajax("/dataset/" + id,
            {
                type: "PUT",
                data: data,
                processData: false
            }).fail(function (e) {
            spawnHttpErrorModal(e)
        });
    });

    $("#datasetRm").click(function () {
        var id = $("#datasetId").val();
        $.ajax("/dataset/" + id, {type: "DELETE"}).fail(function (e) {
            spawnHttpErrorModal(e)
        });
    });

    $("#queryForm").submit(function (e) {
        e.preventDefault();
        // var query = $("#query").val();
        var query2={};
        query2.GET=["rooms_name"];
        query2.AS="TABLE";
        var where2={};
        where2["AND"]=[];
        if($("#building").val().length!==0) {
            //var dept=JSON.stringify($("#dept").val());
            var b = {"IS": {"rooms_fullname": $("#building").val()}};
            where2["AND"].push(b);
        }

        if($("#size").val().length!==0) {
            //var dept=JSON.stringify($("#dept").val());
            var str=$("#size").val();
            var num=parseInt(str);
            var b = {"GT": {"rooms_seats": num}};
            where2["AND"].push(b);
        }

        if($("#type").val().length!==0) {
            //var dept=JSON.stringify($("#dept").val());
            var b = {"IS": {"rooms_type": $("#type").val()}};
            where2["AND"].push(b);
        }

        if($("#furniture").val().length!==0) {
            //var dept=JSON.stringify($("#dept").val());
            var b = {"IS": {"rooms_furniture": $("#furniture").val()}};
            where2["AND"].push(b);
        }
        var distarray=[];

        if($("#distance").val().length!==0 && $("#name").val().length!==0) {
            //var dept=JSON.stringify($("#dept").val());
            var str=$("#distance").val();
            var num=parseInt(str);
            var q={
                "GET": ["rooms_fullname", "rooms_lat", "rooms_lon"],
                "WHERE": {"IS": {"rooms_fullname": $("#name").val()}},
                "AS": "TABLE"
            };
            q=JSON.stringify(q);
            var targetlat=0;
            var targetlon=0;// These are the target buildings latlon. so dist can be computed.
            try {
                $.ajax("/query", {type:"POST", data: q, contentType: "application/json", dataType: "json", success: function(data) {
                    if (data["render"] === "TABLE") {
                        targetlat=data["result"][0]["rooms_lat"];
                        targetlon=data["result"][0]["rooms_lon"];
                    }
                }}).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }

            var query={
                "GET": ["rooms_name", "rooms_lat", "rooms_lon"],
                "WHERE": {},
                "AS": "TABLE"
            };
            query=JSON.stringify(query);
            try {
                $.ajax("/query", {type:"POST", data: query, contentType: "application/json", dataType: "json", success: function(data) {
                        for(var i=0;i<data["result"].length;i++){
                            //taken from http://stackoverflow.com/questions/1420045/how-to-find-distance-from-the-latitude-and-longitude-of-two-locations
                            var radlat1 = Math.PI * data["result"][i]["rooms_lat"] / 180;
                            var radlat2 = Math.PI * targetlat / 180;
                            var radlon1 = Math.PI * data["result"][i]["rooms_lon"] / 180;
                            var radlon2 = Math.PI * targetlon / 180;
                            var theta = data["result"][i]["rooms_lon"] - targetlon;
                            var radtheta = Math.PI * theta / 180;
                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                            dist = Math.acos(dist);
                            dist = dist * 180 / Math.PI;
                            dist = dist * 60 * 1.1515;

                            //Get in in meters
                            dist = dist * 1.609344*1000;
                            if(dist<=num){
                                var r={};
                                r["rooms_name"]=data["result"][i]["rooms_name"];
                                distarray.push(r);
                            }
                        }
                        console.log("Distarray should have stuff");
                }}).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }

        }

        console.log("Dplease");
        query2.WHERE = where2;
        query2 = JSON.stringify(query2);

            try {
                $.ajax("/query", {type:"POST", data: query2, contentType: "application/json", dataType: "json", success: function(data) {
                    if($("#name").val().length==0&&$("#distance").val().length==0&&$("#building").val().length==0&&$("#furniture").val().length==0&&$("#type").val().length==0&&$("#size").val().length==0){
                        spawnHttpErrorModal("Please enter something to filter by");
                    }
                    if(($("#name").val().length==0&&$("#distance").val().length!==0)||($("#name").val().length!==0&&$("#distance").val().length==0)){
                        spawnHttpErrorModal("Please enter something to filter by");
                    }
                    if($("#building").val().length==0&&$("#furniture").val().length==0&&$("#type").val().length==0&&$("#size").val().length==0){
                        console.log("Spawning distarray");
                        generateTable(distarray);
                    }
                    else {
                        for(var j=0;j<distarray.length;j++) {
                            data["result"].push(distarray[j]);
                        }
                        generateTable(data["result"]);
                    }
                }}).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }
    });

    $("#Scheduler").submit(function (e) {
        e.preventDefault();
        var query2={};
        query2.GET=["rooms_name"];
        query2.AS="TABLE";
        var where2={};
        where2["AND"]=[];
        console.log("Entered");
        if($("#shortnames").val().length!==0) {
            //var dept=JSON.stringify($("#dept").val());
            var str=$("#shortnames").val();
            var res=str.split(",");
            var or={};
            or["OR"]=[];
            for(var i=0;i<res.length;i++){
                var b = {"IS": {"rooms_shortname": res[i]}};
                or["OR"].push(b);
            }
            where2["AND"].push(or);
        }
        query2.WHERE=where2;
        query2=JSON.stringify(query2);
        var roomsarray=[];
        try {
            $.ajax("/query", {type:"POST", data: query2, contentType: "application/json", dataType: "json", success: function(data) {
                    roomsarray=data["result"];
                }
            }).fail(function (e) {
                spawnHttpErrorModal(e)
            });
        } catch (err) {
            spawnErrorModal("Query Error", err);
        }

        if(($("#bname").val().length!==0) && ($("#ty").val().length!==0)){
            var str=$("#ty").val();
            var num=parseInt(str);
            var q={
                "GET": ["rooms_fullname", "rooms_lat", "rooms_lon"],
                "WHERE": {"IS": {"rooms_fullname": $("#bname").val()}},
                "AS": "TABLE"
            };
            q=JSON.stringify(q);
            var targetlat=0;
            var targetlon=0;// These are the target buildings latlon. so dist can be computed.
            try {
                $.ajax("/query", {type:"POST", data: q, contentType: "application/json", dataType: "json", success: function(data) {
                    if (data["render"] === "TABLE") {
                        targetlat=data["result"][0]["rooms_lat"];
                        targetlon=data["result"][0]["rooms_lon"];
                    }
                }}).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }

            var query={
                "GET": ["rooms_name", "rooms_lat", "rooms_lon"],
                "WHERE": {},
                "AS": "TABLE"
            };
            query=JSON.stringify(query);
            try {
                $.ajax("/query", {type:"POST", data: query, contentType: "application/json", dataType: "json", success: function(data) {
                    var distarray=[];
                    for(var i=0;i<data["result"].length;i++){
                        //taken from http://stackoverflow.com/questions/1420045/how-to-find-distance-from-the-latitude-and-longitude-of-two-locations
                        var radlat1 = Math.PI * data["result"][i]["rooms_lat"] / 180;
                        var radlat2 = Math.PI * targetlat / 180;
                        var radlon1 = Math.PI * data["result"][i]["rooms_lon"] / 180;
                        var radlon2 = Math.PI * targetlon / 180;
                        var theta = data["result"][i]["rooms_lon"] - targetlon;
                        var radtheta = Math.PI * theta / 180;
                        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                        dist = Math.acos(dist);
                        dist = dist * 180 / Math.PI;
                        dist = dist * 60 * 1.1515;
                        console.log("Distarray should have stuff");

                        //Get in in meters
                        dist = dist * 1.609344*1000;
                        if(dist<=num){
                            var r={};
                            r["rooms_name"]=data["result"][i]["rooms_name"];
                            distarray.push(r);
                        }
                    }
                    generateTable(distarray);
                }}).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }

        }



    });

    $('#orderBy1').on('change', function() {
        var $ob2 = $('#orderBy2');
        var $ob3 = $('#orderBy3');
        var $ob4 = $('#orderBy4');
        if(this.value == 0) {
            $ob2.prop('disabled', true);
            $ob2.val('0');
            $ob3.prop('disabled', true);
            $ob3.val('0');
            $ob4.prop('disabled', true);
            $ob4.val('0');
        } else {
            if($ob2.is(':disabled')) {
                $ob2.prop('disabled', false);
            }
        }
    });
    $('#orderBy2').on('change', function() {
        var $ob3 = $('#orderBy3');
        var $ob4 = $('#orderBy4');
        if(this.value == 0) {
            $ob3.prop('disabled', true);
            $ob3.val('0');
            $ob4.prop('disabled', true);
            $ob4.val('0');
        } else {
            if($ob3.is(':disabled')) {
                $ob3.prop('disabled', false);
            }
        }
    });
    $('#orderBy3').on('change', function() {
        var $ob4 = $('#orderBy4');
        if(this.value == 0) {
            $ob4.prop('disabled', true);
            $ob4.val('0');
        } else {
            if($ob4.is(':disabled')) {
                $ob4.prop('disabled', false);
            }
        }
    });

    $("#queryForm2").submit(function (e) {
        e.preventDefault();
        // var query = $("#query").val();
        var id = $("#datasetId").val();
        var query = {};

        // Fill in "GET" according to which way the user chooses, course or section
        var getArr = [];
        getArr.push(id + "_dept");
        getArr.push(id + "_id");
        getArr.push(id + "_title");
        if ($('input[name=radio]:checked','#queryForm').attr('id') === "course") {
            getArr.push("numSections");
            getArr.push("courseAverage");
            getArr.push("maxPass");
            getArr.push("maxFail");
        }
        if ($('input[name=radio]:checked','#queryForm').attr('id') === "section") {
            getArr.push(id + "_instructor");
            getArr.push(id + "_avg");
        }
        query["GET"] = getArr;

        // Fill in "WHERE" according to what inputs the user puts in
        var whereObj = {};
        var andObj = [];
        var departmentInput = {};
        var courseIDInput = {};
        var courseTitleInput = {};
        var instructorInput = {};
        var sizeInput = {};

        if($('#department').val()) {
            departmentInput = $('#department').val();
            var isObj = {};
            var isContent = {};
            isContent[id + "_dept"] = departmentInput;
            isObj["IS"] = isContent;
            andObj.push(isObj);
        }
        if($('#courseID').val()) {
            courseIDInput = $('#courseID').val();
            var isObj = {};
            var isContent = {};
            isContent[id + "_id"] = courseIDInput;
            isObj["IS"] = isContent;
            andObj.push(isObj);
        }
        if($('#courseTitle').val()) {
            courseTitleInput = $('#courseTitle').val();
            var isObj = {};
            var isContent = {};
            isContent[id + "_title"] = courseTitleInput;
            isObj["IS"] = isContent;
            andObj.push(isObj);
        }
        if( $('#instructor').val()) {
            instructorInput = $('#instructor').val();
            var isObj = {};
            var isContent = {};
            isContent[id + "_instructor"] = instructorInput;
            isObj["IS"] = isContent;
            andObj.push(isObj);
        }
        if($('#size').val()) {
            sizeInput = parseInt($('#size').val(),10);
            var sizeOperator = $('#sizeOperator').val();
            if(sizeOperator === 0) {
                // TODO
                // var gtObj = {};
                // gtObj = sizeInput;
            } else if (sizeOperator === 1) {

            } else if (sizeOperator === 2) {

            }
        }
        if(andObj.length != 0) {
            whereObj["AND"] = andObj;
        }
        query["WHERE"] = whereObj;

        if ($('input[name=radio]:checked','#queryForm').attr('id') === "course") {
            // Fill in "GROUP"
            var groupArr = [];
            groupArr.push(id+"_dept");
            groupArr.push(id+"_id");
            groupArr.push(id+"_title");
            query["GROUP"] = groupArr;
            // Fill in "APPLY"
            var applyArr = [];
            // {"numSections": {"COUNT": "courses_uuid"}}
            var count = {};
            count["COUNT"] = id + "_uuid";
            var numSections = {};
            numSections["numSections"] = count;
            applyArr.push(numSections);
            // {"courseAverage": {"AVG": "courses_avg"}}
            var avg = {};
            avg["AVG"] = id + "_avg";
            var courseAverage = {};
            courseAverage["courseAverage"] = avg;
            applyArr.push(courseAverage);
            // {"maxPass": {"MAX": "courses_pass"}}
            var maxp = {};
            maxp["MAX"] = id + "_pass";
            var maxPass = {};
            maxPass["maxPass"] = maxp;
            applyArr.push(maxPass);
            // {"maxFail": {"MAX": "courses_fail"}}
            var maxf = {};
            maxf["MAX"] = id + "_fail";
            var maxFail = {};
            maxFail["maxFail"] = maxf;
            applyArr.push(maxFail);
            query["APPLY"] = applyArr;
        }

        var orderBy = parseInt($('orderBy').val(),10);
        if(orderBy === 0) {
            query["ORDER"] = id + "_dept"; // "ORDER": "courses_dept",
        } else {
            var orderObj = {}
            orderObj["dir"] = "UP";
            var orderKeys = [];
            var $ob1 = $('#orderBy1');
            var $ob2 = $('#orderBy2');
            var $ob3 = $('#orderBy3');
            var $ob4 = $('#orderBy4');
            // Change orderBy select value to key value in "APPLY"
            function valToString(val) {
                if(val === "0") {
                    return "null";
                } else if (val === "1") {
                    return "numSections";
                } else if (val === "2") {
                    return "courseAverage";
                } else if (val === "3") {
                    return "maxPass";
                } else if (val === "4") {
                    return "maxFail";
                }
            }
            var key1 = valToString($ob1.val());
            var key2;
            var key3;
            var key4;
            if(key1 !== "null") {
                orderKeys.push(key1);
                key2 = valToString($ob2.val());
                if(key2 !== "null") {
                    orderKeys.push(key2);
                    key3 = valToString($ob3.val());
                    if(key3 !== "null") {
                        orderKeys.push(key3);
                        key4 = valToString($ob4.val());
                        if (key4 !== "null") {
                            orderKeys.push(key4);
                        }
                    }
                }
            }
            if(orderKeys.length == 0) { // If the user does not choose any order, set to default "courses_dept"
                orderKeys.push(id+"_dept");
            }
            orderObj["keys"] = orderKeys;
            query["ORDER"] = orderObj; // "ORDER": { "dir": "UP", "keys": ["numSections", "courseAverage", "maxPass", "maxFail"]},
        }

        query["AS"] = "TABLE";

        query = JSON.stringify(query);

        try {
            $.ajax("/query", {type:"POST", data: query, contentType: "application/json", dataType: "json", success: function(data) {
                if (data["render"] === "TABLE") {
                    generateTable(data["result"]);
                }
            }}).fail(function (e) {
                spawnHttpErrorModal(e)
            });
        } catch (err) {
            spawnErrorModal("Query Error", err);
        }
    });


    function generateTable(data) {
        var columns = [];
        Object.keys(data[0]).forEach(function (title) {
            var colTitle;
            if(title.indexOf("_dept") != -1) {
                colTitle = "Department";
            } else if (title.indexOf("_id") != -1) {
                colTitle = "Course ID";
            } else if (title.indexOf("_title") != -1) {
                colTitle = "Title";
            } else if (title.indexOf("_instructor") != -1) {
                colTitle = "Instructor";
            } else if (title.indexOf("_avg") != -1) {
                colTitle = "Section Average";
            } else if (title.indexOf("numSections") != -1) {
                colTitle = "Number of Sections";
            } else if (title.indexOf("courseAverage") != -1) {
                colTitle = "Course Average";
            } else if (title.indexOf("maxPass") != -1) {
                colTitle = "Max Pass";
            } else if (title.indexOf("maxFail") != -1) {
                colTitle = "Max Fail";
            } else {
                colTitle = title;
            }
            columns.push({
                head: colTitle,
                cl: "title",
                html: function (d) {
                    return d[title]
                }
            });
        });
        var container = d3.select("#render");
        container.html("");
        container.selectAll("*").remove();
        var table = container.append("table").style("margin", "auto");

        table.append("thead").append("tr")
            .selectAll("th")
            .data(columns).enter()
            .append("th")
            .attr("class", function (d) {
                return d["cl"]
            })
            .text(function (d) {
                return d["head"]
            });

        table.append("tbody")
            .selectAll("tr")
            .data(data).enter()
            .append("tr")
            .selectAll("td")
            .data(function (row, i) {
                return columns.map(function (c) {
                    // compute cell values for this specific row
                    var cell = {};
                    d3.keys(c).forEach(function (k) {
                        cell[k] = typeof c[k] == "function" ? c[k](row, i) : c[k];
                    });
                    return cell;
                });
            }).enter()
            .append("td")
            .html(function (d) {
                return d["html"]
            })
            .attr("class", function (d) {
                return d["cl"]
            });
    }

    function spawnHttpErrorModal(e) {
        $("#errorModal .modal-title").html(e.status);
        $("#errorModal .modal-body p").html(e.statusText + "</br>" + e.responseText);
        if ($('#errorModal').is(':hidden')) {
            $("#errorModal").modal('show')
        }
    }

    function spawnErrorModal(errorTitle, errorText) {
        $("#errorModal .modal-title").html(errorTitle);
        $("#errorModal .modal-body p").html(errorText);
        if ($('#errorModal').is(':hidden')) {
            $("#errorModal").modal('show')
        }
    }
});
