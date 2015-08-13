var async       = require("async"); 
var Trello      = require("node-trello");
var getRequests = require("./getRequests");
var dateFormat  = require('dateformat');
var yaml        = require('js-yaml');
var fs          = require('fs');
var mongo       = require('mongoskin');
var MongoClient = mongo.MongoClient;


//initialization
var mongourl = null;
var appkey   = null;
var token    = null;
var admin    = null;
//var lastTime = new Date();
try {
    var doc  = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    mongourl = doc.mongodburl;  
    appkey   = doc.appKey;
    token    = doc.oauthToken;
    admin    = doc.admin;
} catch (e) {
  console.log(e);
}

var g = new getRequests(appkey,token);
var count = 0;
//connect to database
var _db = MongoClient.connect(mongourl);

async.whilst(
    function () { return true; },    
        function (callback) {
        count++;
        setTimeout(callback, 5000);
        //console.log(Jcards.length);  
        console.log(Date())
 
        var collection = _db.collection('data');

        
        collection.find({}).toArray(function (err, result) {
        var Jcards=JSON.parse(JSON.stringify(result));
        for(var i=0; i < Jcards.length; ++i) {
            var vid=Jcards[i]._id;
            //console.log(vid)
            pollingCards(Jcards[i]);
            }
        });

        },
    function (err) {
        // 5 seconds have passed
    }//end of function
    );

function pollingCards(card){
var lid = card.srcID;
var targetID = card.dupID;
var _id = card._id;
if(lid == null || targetID ==null)
    return;
g.getActionByCardId(lid,function(data){
            if(typeof(data) == "undefined")
            {
                console.log('data is '+data);
                return;
            }
            var obj = JSON.parse(data);
            var counter = obj.length-1;
            var obj1 = {};
            for(var key in obj){
                obj1[counter] = obj[key];
                counter--;
            }
            
            //console.log(obj1);
            async.each(obj1,
                  // 2nd param is the function that each item is passed to
                  function(item, callback){
                    if(item.memberCreator.fullName == admin)
                        return;
                    //request database
                    var collection = _db.collection('srcCards');
                    //find the time if not found create a new time
                    collection.findById(_id,function (err, doc) {
                        //console.log(doc);
                        console.log("The 1st time is "+lastTime);
                        var lastTime = new Date();
                        if(doc.lastUpdatingTime != null && doc.lastUpdatingTime != "")
                        {
                            lastTime = new Date(doc.lastUpdatingTime)
                            console.log("Time matched    "+lastTime); 
                        } 
                        else
                        {
                            //console.log("empty");
                            doc.lastUpdatingTime = lastTime;
                            collection.updateById(_id,doc,function (err, doc) {

                            })                            
                        }               
                    console.log("The 2nd time is "+lastTime);
                    dateFormat(lastTime, "isoDateTime");
                    var rTime = new Date(item.date);
                    if(typeof(rTime) == "undefined")
                    {
                        console.log('rTime is '+data);
                        return;
                    }
                    dateFormat(rTime, "isoDateTime");
                    lastTime.setSeconds(lastTime.getSeconds() + 1);
                    //console.log(rTime>lastTime);
                    if(rTime>lastTime){
                        switch (item.type) {
                            //for comment card
                            case 'commentCard':
                                    var commentContains = item.memberCreator.fullName+" commented: "+item.data.text;
                                    g.commentCard(commentContains,targetID,function(data){
                                        console.log(data);
                                    });
                                    break;
                            case 'updateCard':                                    
                                    break;  
                            //for attachment
                            case 'addAttachmentToCard': 
                                    var commentContains = item.memberCreator.fullName+" attached a file: "+item.data.attachment.name;
                                    g.commentCard(commentContains,targetID,function(data){
                                        console.log(data);
                                    });
                                    var card = '{"id":"'+targetID+
                                                '","name":"'+item.data.attachment.name+
                                                '","url":"'+item.data.attachment.url+'"}';
                                    console.log("-----------------attachment found--------------")                                                                                    
                                    g.addAttachmentToCard(card,function(data){
                                        console.log(data);
                                    })                                   
                                    break;                        
                        }
                        //after different get requests
                        //console.log("rTime:       "+rTime);
                        //console.log("latestRecord "+lastTime);
                        doc.lastUpdatingTime = rTime;
                        collection.updateById(_id,doc,function (err, doc) {

                        })                                        
                    }
                    else{
                        callback();
                        return;
                    }
                    });//end of findbyid                
                  },
                  // 3rd param is the function to call when everything's done
                  function(error){
                    // All tasks are done now
                    if(error)
                    {
                        console.log("there was an error")               
                    }
                    //console.log("--------------End-----------------")
                    }//end of alldone function
                );
            });
}
