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
        var roomsarray = [];
        var courses = [];
        var query2 = {};
        query2.GET = ["rooms_name","rooms_seats"];
        query2.AS = "TABLE";
        var where2 = {};
        where2["AND"] = [];
        console.log("Entered");
        if ($("#shortnames").val().length !== 0) {
            //var dept=JSON.stringify($("#dept").val());
            console.log("Should not be here");
            var str = $("#shortnames").val();
            var res = str.split(",");
            var or = {};
            or["OR"] = [];
            for (var i = 0; i < res.length; i++) {
                var b = {"IS": {"rooms_shortname": res[i]}};
                or["OR"].push(b);
            }
            where2["AND"].push(or);
            query2.WHERE = where2;
            query2 = JSON.stringify(query2);
            try {
                $.ajax("/query", {
                    type: "POST",
                    data: query2,
                    async: false,
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        for (var i = 0; i < data["result"].length; i++) {
                            roomsarray.push(data["result"][i]);
                        }
                    }
                }).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }
        }

        if (($("#bname").val().length !== 0) && ($("#ty").val().length !== 0)) {
            var str = $("#ty").val();
            var num = parseInt(str);
            var q = {
                "GET": ["rooms_fullname", "rooms_lat", "rooms_lon"],
                "WHERE": {"IS": {"rooms_fullname": $("#bname").val()}},
                "AS": "TABLE"
            };
            q = JSON.stringify(q);
            var targetlat = 0;
            var targetlon = 0;// These are the target buildings latlon. so dist can be computed.
            try {
                $.ajax("/query", {
                    type: "POST", data: q, async: false,contentType: "application/json", dataType: "json", success: function (data) {
                        if (data["render"] === "TABLE") {
                            targetlat = data["result"][0]["rooms_lat"];
                            targetlon = data["result"][0]["rooms_lon"];
                        }
                    }
                }).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }

            var query = {
                "GET": ["rooms_name", "rooms_lat", "rooms_lon","rooms_seats"],
                "WHERE": {},
                "AS": "TABLE"
            };
            query = JSON.stringify(query);
            try {
                $.ajax("/query", {
                    type: "POST",
                    data: query,
                    async: false,
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        var distarray = [];
                        for (var i = 0; i < data["result"].length; i++) {
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
                            dist = dist * 1.609344 * 1000;
                            if (dist <= num) {
                                var r = {};
                                r["rooms_name"] = data["result"][i]["rooms_name"];
                                r["rooms_seats"] = data["result"][i]["rooms_seats"];
                                distarray.push(r);
                            }
                        }
                        for (var i = 0; i < distarray.length; i++) {
                            roomsarray.push(distarray[i]);
                        }
                    }
                }).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }
        }

        var courseq = {};
        courseq.GET = ["courses_dept", "courses_id", "maxSize" ,"numSections"];
        courseq.AS = "TABLE";
        courseq.APPLY=[ {"numSections": {"COUNT": "courses_uuid"}},{"maxSize": {"MAX": "courses_size"}}];
        courseq.GROUP=[ "courses_dept", "courses_id" ];
        var where2 = {};
        where2["AND"] = [];
        if ($("#dept").val().length !== 0) {
            //var dept=JSON.stringify($("#dept").val());
            var str = $("#dept").val();
            var b = {"IS": {"courses_dept": str}};
            where2["AND"].push(b);
        }

        if ($("#number").val().length !== 0) {
            //var dept=JSON.stringify($("#dept").val());
            var num = $("#number").val();
            var str = num.toString();
            var b = {"IS": {"courses_id": str}};
            where2["AND"].push(b);
        }
        var c = {"EQ": {"courses_year": 2014}};
        where2["AND"].push(c);
        courseq.WHERE = where2;
        courseq = JSON.stringify(courseq);

        try {
            $.ajax("/query", {
                type: "POST",
                data: courseq,
                async: false,
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    for (var i = 0; i < data["result"].length; i++) {
                        courses.push(data["result"][i]);
                    }
                }
            }).fail(function (e) {
                spawnHttpErrorModal(e)
            });
        } catch (err) {
            spawnErrorModal("Query Error", err);
        }
        var days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
        var slots=[];
        for(var i=0;i<roomsarray.length;i++){ //creating slots for all rooms
            for(var j=0;j<2;j++){ //5 days a week
                if(j%2==0) {  //its MWF
                    for (var k = 0; k < 24; k++) { //24 hours a day
                        var slot = {};
                        slot["days"] = days[j]+days[j+2]+days[j+4];
                        slot["time"] = (800+(k*100))%2400;
                        slot["room"]=roomsarray[i]["rooms_name"];
                        slot["seats"]=roomsarray[i]["rooms_seats"];
                        slot["taken"]=false;
                        slot["farr"]=[];
                        slots.push(slot);
                    }
                }
                else {
                    for (var k = 0; k < 16; k++) { //24 hours a day
                        var slot = {};
                        slot["days"] = days[j]+days[j+2];
                        slot["time"] = (800+(k*150))%2400;
                        if(slot["time"]%100!==0){
                            slot["time"]=slot["time"]-20; //950 would be 930
                        }
                        slot["room"]=roomsarray[i]["rooms_name"];
                        slot["seats"]=roomsarray[i]["rooms_seats"];
                        slot["taken"]=false;
                        slot["farr"]=[]; //indicates if another class is scheduled during this slot
                        slots.push(slot);
                    }
                }
            }
        }
        var schcourses=[];
        for(var i=0;i<courses.length;i++){
            var secsnum=Math.ceil((courses[i]["numSections"])/3);
            for(var j=0;j<secsnum;j++){
                var newc={};
                newc["name"]=courses[i]["courses_dept"]+"_"+courses[i]["courses_id"]+"_"+j;
                newc["reqdseats"]=courses[i]["maxSize"];
                newc["scheduled"]=false;
                newc["Professor"]=courses[i]["courses_instructor"];
                newc["f"]=courses[i]["courses_dept"]+"_"+courses[i]["courses_id"]; // indicates value to push into flag
                schcourses.push(newc);
            }
        }
        schcourses.sort(function(a, b) {  //sort both arrays in ascending order so that the smallest rooms get matched with the smallest courses
            return parseFloat(a["reqdseats"]) - parseFloat(b["reqdseats"]);
        });
        slots.sort(function(a, b) {
            return parseFloat(a["seats"]) - parseFloat(b["seats"]);
        });
        console.log(JSON.stringify(slots));
        var schslots=[];
        var goodoourses=0; //number of courses scheduled between 800 and 1700
        var badcourses=0; //number of courses scheduled outside of those times
        var coursesnotscheduled=schcourses.length;
        for(var i=0;i<schcourses.length;i++){
            var day=[];
            var time=0;
            var coursetitle=schcourses[i]["f"]; //course that is currently being scheduled
            for(var j=0;j<slots.length;j++){ //first try to schedule between 8 and 5
                if((slots[j]["time"]>=800)&&(slots[j]["time"]<=1600)) {
                    if (slots[j]["seats"] >= schcourses[i]["reqdseats"]) { //slot can take this class
                        if ((slots[j]["taken"] == false) && (slots[j]["farr"].indexOf(coursetitle) == -1)) {  //slots not taken and that class is not scheduled during this time
                            slots[j]["course"] = schcourses[i]["name"];
                            day = slots[j]["days"];
                            time = slots[j]["time"];
                            slots[j]["taken"] = true;
                            schcourses[i]["scheduled"] = true;
                            var s={};
                            s["days"]=slots[j]["days"];
                            s["time"]=slots[j]["time"];
                            s["room"]=slots[j]["room"];
                            s["course"]=schcourses[i]["name"];
                            s["seats"]=slots[j]["seats"];
                            s["coursereqdseats"]=schcourses[i]["reqdseats"];
                            schslots.push(s);
                            goodoourses++;
                            coursesnotscheduled--;
                            break;
                        }
                    }
                }
            }
            if(schcourses[i]["scheduled"] == false){
                for(var j=0;j<slots.length;j++){
                        if (slots[j]["seats"] >= schcourses[i]["reqdseats"]) { //slot can take this class
                            if ((slots[j]["taken"] == false) && (slots[j]["farr"].indexOf(coursetitle) == -1)) {  //slots not taken and that class is not scheduled during this time
                                slots[j]["course"] = schcourses[i]["name"];
                                day = slots[j]["days"];
                                time = slots[j]["time"];
                                slots[j]["taken"] = true;
                                schcourses[i]["scheduled"] = true;
                                var s={};
                                s["days"]=slots[j]["days"];
                                s["time"]=slots[j]["time"];
                                s["room"]=slots[j]["room"];
                                s["course"]=schcourses[i]["name"];
                                s["seats"]=slots[j]["seats"];
                                s["coursereqdseats"]=schcourses[i]["reqdseats"];
                                schslots.push(s);
                                badcourses++;
                                coursesnotscheduled--;
                                break;
                            }
                        }
                    }
            }
            for(var j=0;j<slots.length;j++){
                if(slots[j]["taken"]==false){
                    if(slots[j]["taken"]==false){
                        if((slots[j]["days"]==day)&&(slots[j]["time"]==time)){ //all slots with the same time and day now know that this class is scheduled now
                            slots[j]["farr"].push(coursetitle);
                        }
                    }
                }
            }
        }
        var notsch=[];
        for(var i=0;i<schcourses.length;i++){
            if(schcourses[i]["scheduled"]==false){
                notsch.push(schcourses[i]["name"]);
            }
        }
        console.log(JSON.stringify(schslots));
        console.log("Good courses:" + goodoourses);
        console.log("Bad courses:" + badcourses);
        console.log("not scheduled:" + coursesnotscheduled);
        generateTable(schslots);
        var message="Quality is :- "+(100-((badcourses/(schcourses.length))*100)) +"\n";
        message=message+"This indicates the percentage of classes that were scheduled but not scheduled between 8:00 and 17:00" +"\n";
        message=message+"This measure includes classes that could not be scheduled plus classes outside of the above times :- "+(100-((badcourses+coursesnotscheduled)/(schcourses.length))*100) + "\n";
        message=message+"These classes could not be scheduled"+JSON.stringify(notsch);
        spawnErrorModal("Quality",message);
    });

    $("#Scheduler2").submit(function (e) {
        e.preventDefault();
        var roomsarray = [];
        var courses = [];
        var query2 = {};
        query2.GET = ["rooms_name","rooms_seats"];
        query2.AS = "TABLE";
        var where2 = {};
        where2["AND"] = [];
        console.log("Entered");
        if ($("#shortname").val().length !== 0) {
            //var dept=JSON.stringify($("#dept").val());
            console.log("Should not be here");
            var str = $("#shortname").val();
            var res = str.split(",");
            var or = {};
            or["OR"] = [];
            for (var i = 0; i < res.length; i++) {
                var b = {"IS": {"rooms_shortname": res[i]}};
                or["OR"].push(b);
            }
            where2["AND"].push(or);
            query2.WHERE = where2;
            query2 = JSON.stringify(query2);
            try {
                $.ajax("/query", {
                    type: "POST",
                    data: query2,
                    async: false,
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        for (var i = 0; i < data["result"].length; i++) {
                            roomsarray.push(data["result"][i]);
                        }
                    }
                }).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }
        }

        if (($("#bnames").val().length !== 0) && ($("#typ").val().length !== 0)) {
            var str = $("#typ").val();
            var num = parseInt(str);
            var q = {
                "GET": ["rooms_fullname", "rooms_lat", "rooms_lon"],
                "WHERE": {"IS": {"rooms_fullname": $("#bnames").val()}},
                "AS": "TABLE"
            };
            q = JSON.stringify(q);
            var targetlat = 0;
            var targetlon = 0;// These are the target buildings latlon. so dist can be computed.
            try {
                $.ajax("/query", {
                    type: "POST", data: q, async: false,contentType: "application/json", dataType: "json", success: function (data) {
                        if (data["render"] === "TABLE") {
                            targetlat = data["result"][0]["rooms_lat"];
                            targetlon = data["result"][0]["rooms_lon"];
                        }
                    }
                }).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }

            var query = {
                "GET": ["rooms_name", "rooms_lat", "rooms_lon","rooms_seats"],
                "WHERE": {},
                "AS": "TABLE"
            };
            query = JSON.stringify(query);
            try {
                $.ajax("/query", {
                    type: "POST",
                    data: query,
                    async: false,
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        var distarray = [];
                        for (var i = 0; i < data["result"].length; i++) {
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
                            dist = dist * 1.609344 * 1000;
                            if (dist <= num) {
                                var r = {};
                                r["rooms_name"] = data["result"][i]["rooms_name"];
                                r["rooms_seats"] = data["result"][i]["rooms_seats"];
                                distarray.push(r);
                            }
                        }
                        for (var i = 0; i < distarray.length; i++) {
                            roomsarray.push(distarray[i]);
                        }
                    }
                }).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }
        }

        console.log(courses.length);
        var courseq = {};
        courseq.GET = ["courses_dept", "courses_id", "courses_instructor","maxSize" ,"numSections"];
        courseq.AS = "TABLE";
        courseq.APPLY=[ {"numSections": {"COUNT": "courses_uuid"}},{"maxSize": {"MAX": "courses_size"}}];
        courseq.GROUP=[ "courses_dept", "courses_id" ,"courses_instructor"];
        var where2 = {};
        where2["AND"] = [];
        if ($("#depat").val().length !== 0) {
            //var dept=JSON.stringify($("#dept").val());
            var str = $("#depat").val();
            var b = {"IS": {"courses_dept": str}};
            where2["AND"].push(b);
        }

        if ($("#numer").val().length !== 0) {
            //var dept=JSON.stringify($("#dept").val());
            var num = $("#numer").val();
            var str = num.toString();
            var b = {"IS": {"courses_id": str}};
            where2["AND"].push(b);
        }
        var c = {"EQ": {"courses_year": 2014}};
        where2["AND"].push(c);
        courseq.WHERE = where2;
        courseq = JSON.stringify(courseq);

        try {
            $.ajax("/query", {
                type: "POST",
                data: courseq,
                async: false,
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    for (var i = 0; i < data["result"].length; i++) {
                        courses.push(data["result"][i]);
                    }
                }
            }).fail(function (e) {
                spawnHttpErrorModal(e)
            });
        } catch (err) {
            spawnErrorModal("Query Error", err);
        }
        var days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
        console.log(JSON.stringify(courses));
        console.log(JSON.stringify(courses.length));
        var slots=[];
        for(var i=0;i<roomsarray.length;i++){ //creating slots for all rooms
            for(var j=0;j<2;j++){ //5 days a week
                if(j%2==0) {  //its MWF
                    for (var k = 0; k < 24; k++) { //24 hours a day
                        var slot = {};
                        slot["days"] = days[j]+days[j+2]+days[j+4];
                        slot["time"] = (800+(k*100))%2400;
                        slot["room"]=roomsarray[i]["rooms_name"];
                        slot["seats"]=roomsarray[i]["rooms_seats"];
                        slot["taken"]=false;
                        slot["farr"]=[];
                        slot["instrarr"]=[];
                        slots.push(slot);
                    }
                }
                else {
                    for (var k = 0; k < 16; k++) { //24 hours a day
                        var slot = {};
                        slot["days"] = days[j]+days[j+2];
                        slot["time"] = (800+(k*150))%2400;
                        if(slot["time"]%100!==0){
                            slot["time"]=slot["time"]-20; //950 would be 930
                        }
                        slot["room"]=roomsarray[i]["rooms_name"];
                        slot["seats"]=roomsarray[i]["rooms_seats"];
                        slot["taken"]=false;
                        slot["farr"]=[]; //indicates if another class is scheduled during this slot
                        slot["instrarr"]=[];
                        slots.push(slot);
                    }
                }
            }
        }
        var schcourses=[];
        for(var i=0;i<courses.length;i++){
            var secsnum=Math.ceil((courses[i]["numSections"])/3);
            for(var j=0;j<secsnum;j++){
                var newc={};
                newc["name"]=courses[i]["courses_dept"]+"_"+courses[i]["courses_id"]+"_"+j;
                newc["reqdseats"]=courses[i]["maxSize"];
                newc["scheduled"]=false;
                newc["f"]=courses[i]["courses_dept"]+"_"+courses[i]["courses_id"];// indicates value to push into flag
                newc["Professor"]=courses[i]["courses_instructor"];
                schcourses.push(newc);
            }
        }
        console.log(JSON.stringify(schcourses));
        schcourses.sort(function(a, b) {  //sort both arrays in ascending order so that the smallest rooms get matched with the smallest courses
            return parseFloat(a["reqdseats"]) - parseFloat(b["reqdseats"]);
        });
        slots.sort(function(a, b) {
            return parseFloat(a["seats"]) - parseFloat(b["seats"]);
        });
        console.log(JSON.stringify(slots));
        var schslots=[];
        var goodoourses=0; //number of courses scheduled between 800 and 1700
        var badcourses=0; //number of courses scheduled outside of those times
        var coursesnotscheduled=schcourses.length;
        for(var i=0;i<schcourses.length;i++){
            var day=[];
            var time=0;
            var coursetitle=schcourses[i]["f"];
            var prof=schcourses[i]["Professor"];//course that is currently being scheduled
            for(var j=0;j<slots.length;j++){ //first try to schedule between 8 and 5
                if((slots[j]["time"]>=800)&&(slots[j]["time"]<=1600)) {
                    if (slots[j]["seats"] >= schcourses[i]["reqdseats"]) { //slot can take this class
                        if ((slots[j]["taken"] == false) && (slots[j]["farr"].indexOf(coursetitle) == -1)&&(slots[j]["instrarr"].indexOf(prof) == -1)) {  //slots not taken and that class is not scheduled during this time
                            slots[j]["course"] = schcourses[i]["name"];
                            day = slots[j]["days"];
                            time = slots[j]["time"];
                            slots[j]["taken"] = true;
                            schcourses[i]["scheduled"] = true;
                            var s={};
                            s["days"]=slots[j]["days"];
                            s["time"]=slots[j]["time"];
                            s["room"]=slots[j]["room"];
                            s["course"]=schcourses[i]["name"];
                            s["seats"]=slots[j]["seats"];
                            s["coursereqdseats"]=schcourses[i]["reqdseats"];
                            s["Professor"]=schcourses[i]["Professor"];
                            schslots.push(s);
                            goodoourses++;
                            coursesnotscheduled--;
                            break;
                        }
                    }
                }
            }
            if(schcourses[i]["scheduled"] == false){
                for(var j=0;j<slots.length;j++){
                    if (slots[j]["seats"] >= schcourses[i]["reqdseats"]) { //slot can take this class
                        if ((slots[j]["taken"] == false) && (slots[j]["farr"].indexOf(coursetitle) == -1) && (slots[j]["instrarr"].indexOf(prof) == -1)) {  //slots not taken and that class is not scheduled during this time
                            slots[j]["course"] = schcourses[i]["name"];
                            day = slots[j]["days"];
                            time = slots[j]["time"];
                            slots[j]["taken"] = true;
                            schcourses[i]["scheduled"] = true;
                            var s={};
                            s["days"]=slots[j]["days"];
                            s["time"]=slots[j]["time"];
                            s["room"]=slots[j]["room"];
                            s["course"]=schcourses[i]["name"];
                            s["seats"]=slots[j]["seats"];
                            s["coursereqdseats"]=schcourses[i]["reqdseats"];
                            s["Professor"]=schcourses[i]["Professor"];
                            schslots.push(s);
                            badcourses++;
                            coursesnotscheduled--;
                            break;
                        }
                    }
                }
            }
            for(var j=0;j<slots.length;j++){
                if(slots[j]["taken"]==false){
                    if(slots[j]["taken"]==false){
                        if((slots[j]["days"]==day)&&(slots[j]["time"]==time)){ //all slots with the same time and day now know that this class is scheduled now
                            slots[j]["farr"].push(coursetitle);
                            slots[j]["instrarr"].push(prof);
                        }
                    }
                }
            }
        }
        var notsch=[];
        for(var i=0;i<schcourses.length;i++){
            if(schcourses[i]["scheduled"]==false){
                notsch.push(schcourses[i]["name"]);
            }
        }
        console.log(JSON.stringify(schslots));
        console.log("Good courses:" + goodoourses);
        console.log("Bad courses:" + badcourses);
        console.log("not scheduled:" + coursesnotscheduled);
        generateTable(schslots);
        var message="Quality is :- "+(100-((badcourses/(schcourses.length))*100)) +"\n";
        message=message+"This indicates the percentage of classes that were scheduled but not scheduled between 8:00 and 17:00" +"\n";
        message=message+"This measure includes classes that could not be scheduled plus classes outside of the above times :- "+(100-((badcourses+coursesnotscheduled)/(schcourses.length))*100) + "\n";
        message=message+"These classes could not be scheduled"+JSON.stringify(notsch);
        spawnErrorModal("Quality",message);
    });

    $('#orderBy1').on('change', function() {
        var $ob2 = $('#orderBy2');
        var $ob3 = $('#orderBy3');
        var $ob4 = $('#orderBy4');
        if(this.value == "0") {
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
        if(this.value == "0") {
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
        if(this.value == "0") {
            $ob4.prop('disabled', true);
            $ob4.val('0');
        } else {
            if($ob4.is(':disabled')) {
                $ob4.prop('disabled', false);
            }
        }
    });

    $('#orderBys2').on('change', function() {
        var $obs3 = $('#orderBys3');
        if(this.value == "0" ) {
            $obs3.prop('disabled', true);
            $obs3.val('0');
        } else {
            if($obs3.is(':disabled')) {
                $obs3.prop('disabled', false);
            }
        }
    });

    $('input[name=radio]','#queryForm2').change( function() {
        if ($('input[name=radio]:checked','#queryForm2').attr('id') === "section") {
            $('#courseOrder').hide();
            $('#sectionOrder').show();
        }
        if ($('input[name=radio]:checked','#queryForm2').attr('id') === "course") {
            $('#sectionOrder').hide();
            $('#courseOrder').show();
        }
    });

    $("#queryForm2").submit(function (e) {
        e.preventDefault();
        // var query = $("#query").val();
        var id = $("#datasetId").val();
        var query = {};
        var radioChecked = $('input[name=radio]:checked','#queryForm2').attr('id');

        // Fill in "GET" according to which way the user chooses, course or section
        var getArr = [];
        getArr.push(id + "_dept");
        getArr.push(id + "_id");
        getArr.push(id + "_title");
        if (radioChecked === "course") {
            getArr.push("numSections");
            getArr.push("courseAverage");
            getArr.push("maxPass");
            getArr.push("maxFail");
            getArr.push("maxSize");
        }
        if (radioChecked === "section") {
            getArr.push(id + "_instructor");
            getArr.push(id + "_avg");
            getArr.push(id + "_size");
        }
        query["GET"] = getArr;

        // Fill in "WHERE" according to what inputs the user puts in
        var whereObj = {};
        var andArr = [];
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
            andArr.push(isObj);
        }
        if($('#courseID').val()) {
            courseIDInput = $('#courseID').val();
            var isObj = {};
            var isContent = {};
            isContent[id + "_id"] = courseIDInput;
            isObj["IS"] = isContent;
            andArr.push(isObj);
        }
        if($('#courseTitle').val()) {
            courseTitleInput = $('#courseTitle').val();
            var isObj = {};
            var isContent = {};
            isContent[id + "_title"] = courseTitleInput;
            isObj["IS"] = isContent;
            andArr.push(isObj);
        }
        if( $('#instructor').val()) {
            instructorInput = $('#instructor').val();
            var isObj = {};
            var isContent = {};
            isContent[id + "_instructor"] = instructorInput;
            isObj["IS"] = isContent;
            andArr.push(isObj);
        }
        if(radioChecked === "section") {
            if($('#sizeCS').val()) {
                sizeInput = parseInt($('#sizeCS').val(),10);
                var sizeOperator = $('#sizeOperator').val();
                if(sizeOperator === "0") {
                    // TODO
                    var gtObj = {};
                    var gtContent = {};
                    gtContent[id+"_size"] = sizeInput;
                    gtObj["GT"] = gtContent;
                    andArr.push(gtObj);
                } else if (sizeOperator === "1") {
                    var eqObj = {};
                    var eqContent = {};
                    eqContent[id+"_size"] = sizeInput;
                    eqObj["EQ"] = eqContent;
                    andArr.push(eqObj);
                } else if (sizeOperator === "2") {
                    var ltObj = {};
                    var ltContent = {};
                    ltContent[id+"_size"] = sizeInput;
                    ltObj["LT"] = ltContent;
                    andArr.push(ltObj);
                }
            }
        }
        // {"NOT": {"EQ": {"courses_year": 1900}}}
        var notObj = {};
        var eqObj = {};
        var eqContent = {};
        eqContent[id+"_year"] = 1900;
        eqObj["EQ"] = eqContent;
        notObj["NOT"] = eqObj;
        andArr.push(notObj);

        whereObj["AND"] = andArr;
        query["WHERE"] = whereObj;

        if (radioChecked === "course") {
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
            // {"maxSize": {"MAX": "courses_size"}}
            var maxs = {};
            maxs["MAX"] = id + "_size";
            var maxSize = {};
            maxSize["maxSize"] = maxs;
            applyArr.push(maxSize);

            query["APPLY"] = applyArr;
        }
        // Fill in "ORDER"
        var orderObj = {};
        if($('#orderBy0').val() == 0) {
            orderObj["dir"] = "UP";
        } else {
            orderObj["dir"] = "DOWN";
        }
        var orderKeys = [];
        if(radioChecked === "section") {
            var $obs1 = $('#orderBys1');
            var $obs2 = $('#orderBys2');
            var $obs3 = $('#orderBys3');
            function svalToString(val) {
                if(val === "0") {
                    return "null";
                } else if (val === "1") {
                    return id+"_dept";
                } else if (val === "2") {
                    return id+"_id";
                } else if (val === "3") {
                    return id+"_avg";
                }
            }
            var keys1 = svalToString($obs1.val());
            var keys2;
            var keys3;
            orderKeys.push(keys1);
            keys2 = svalToString($obs2.val());
            if(keys2 !== "null") {
                orderKeys.push(keys2);
                keys3 = svalToString($obs3.val());
                if(keys3 !== "null") {
                    orderKeys.push(keys3);
                }
            }
        } else {
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
        }
        if(orderKeys.length == 0) { // If the user does not choose any order, set to default "courses_dept"
            orderKeys.push(id+"_dept");
        }
        orderObj["keys"] = orderKeys;
        query["ORDER"] = orderObj; // "ORDER": { "dir": "UP", "keys": ["numSections", "courseAverage", "maxPass", "maxFail"]}

        query["AS"] = "TABLE";

        query = JSON.stringify(query);

        function gtFilter(data, limit) {
            var newData = [];
            for(var i=0; i<data.length; i++) {
                if(data[i]["maxSize"] > limit) {
                    newData.push(data[i]);
                }
            }
            return newData;
        }
        function eqFilter(data, limit) {
            var newData = [];
            for(var i=0; i<data.length; i++) {
                if(data[i]["maxSize"] = limit) {
                    newData.push(data[i]);
                }
            }
            return newData;
        }
        function ltFilter(data, limit) {
            var newData = [];
            for(var i=0; i<data.length; i++) {
                if(data[i]["maxSize"] < limit) {
                    newData.push(data[i]);
                }
            }
            return newData;
        }
        try {
            $.ajax("/query", {type:"POST", data: query, contentType: "application/json", dataType: "json", success: function(data) {
                if (data["render"] === "TABLE") {
                    if (data["result"].length > 0) {
                        if(radioChecked === "course") {
                            if($('#sizeCS').val()) {
                                sizeInput = parseInt($('#sizeCS').val(),10);
                                var sizeOperator = $('#sizeOperator').val();
                                if(sizeOperator === "0") {
                                    data["result"] = gtFilter(data["result"], sizeInput);
                                } else if (sizeOperator === "1") {
                                    data["result"] = eqFilter(data["result"], sizeInput);
                                } else if (sizeOperator === "2") {
                                    data["result"] = ltFilter(data["result"], sizeInput);
                                }
                            }
                        }
                        generateTable(data["result"]);
                    } else {
                        alert("Empty Result");
                        var container = $("#render");
                        container.empty();
                    }
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
        if(data.length>0) {
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
                } else if (title.indexOf("_size") != -1) {
                    colTitle = "Section Size";
                } else if (title.indexOf("numSections") != -1) {
                    colTitle = "Number of Sections";
                } else if (title.indexOf("courseAverage") != -1) {
                    colTitle = "Course Average";
                } else if (title.indexOf("maxPass") != -1) {
                    colTitle = "Max Pass";
                } else if (title.indexOf("maxFail") != -1) {
                    colTitle = "Max Fail";
                } else if (title.indexOf("maxSize") != -1) {
                    colTitle = "Course Size";
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
        } else {
            alert("Empty Result");
            var container = $("#render");
            container.empty();
        }
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
