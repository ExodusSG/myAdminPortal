app.service('MyCollectionService',function($resource){

    return $resource('api/data/collections/:collectionName');

});
app.factory('myLeaveObj',['MyCollectionService','$q',function(MyCollectionService,$q){

        var defer = $q.defer()
        var myservice = new MyCollectionService();
         myservice.$get({collectionName:'HRLeaveRepository'},function(result){                     
           // $scope.leaves = result.responds;  
                var type = ['halfday','warning']
                var myObj = {}
                var varray=[];
                for(var i=0;i<result.responds.length;i++)
                {
                    var sdate = new Date(result.responds[i].start_date);
                    var edate = new Date(result.responds[i].end_date);
                    myObj.title     = result.responds[i].requestor;
                    myObj.type      = 'halfday';
                    myObj.startsAt  = sdate;
                    myObj.endsAt    = edate;
                    myObj.draggable = true;
                    myObj.resizable = true;

                    varray.push(JSON.parse(JSON.stringify(myObj)))
                    myObj = {};
                }         
                //$scope.leaveArr=varray;
                defer.resolve(varray);    
                //alert(varray)                               
        }); 
        this.get = function(){
            return defer.promise;
        }

         //alert(JSON.stringify(defer.promise))
         return defer.promise;
}]);

// app.factory('Settings', ['$http', function ($http) {
//         function getData() {
//             var url = '/api/data/collections/leavereport';
//             return $http.get(url, {cache: true});
//         }
//         return {
//             promise: getData()
//         };
//     }]);
// app.factory('StoreProducts', function ($http) {
//     // ... 
//     return {
//         // ...
//         getData: function() {
//             return $http.get('/api/data/collections/leavereport').then(function(response) {
//                 //alert(response.data)
//                 return response.data;
//             });
//         }
//     };
// });
// app.service('mydata',function($q, $http){
//             var deferred = $q.defer();
//             $http.get('/api/data/collections/leavereport')
//                .then (function (data) {
                
                
//                 //alert(data.data.responds[0]);
//                 //alert(JSON.stringify(data.data))
//                 var type = ['halfday','warning']
//                 var myObj = {}
//                 var varray=[];
//                 for(var i=0;i<data.data.responds.length;i++)
//                 {
//                     var sdate = new Date(data.data.responds[i].startdate);
//                     var edate = new Date(data.data.responds[i].enddate);
//                     myObj.title     = data.data.responds[i].requester;
//                     myObj.type      = 'halfday';
//                     myObj.startsAt  = sdate;
//                     myObj.endsAt    = edate;
//                     myObj.draggable = true;
//                     myObj.resizable = true;

//                     varray.push(JSON.parse(JSON.stringify(myObj)))
//                     myObj = {};
//                 } 

//                     deferred.resolve(varray)
//                    //alert(varray);
//                });

//               return deferred.promise;
//          }

// );
