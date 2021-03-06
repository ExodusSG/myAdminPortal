app.controller('cardsController',function ($scope,$resource,MyCollectionService){
		$scope.searchData = function(){

                $scope.myABCService = new MyCollectionService();
                $scope.myABCService.$get({collectionName:'data'},function(result){
                    //now AngularJS has two way data binding, so use result to assign values to your scope variables.  
                    //for(var i=0;i<result.length;i++)                
                        $scope.cardPairs = result.responds;
                }); 
		}
        //if admin can see the pair up cards
		$scope.searchData();
});

app.controller('leavesController',function ($scope,MyCollectionService,ModalService){

        $scope.getAllLeaves = function(){

                $scope.myABCService = new MyCollectionService();
                $scope.myABCService.$get({collectionName:'HRLeaveRepository'},function(result){
                    //now AngularJS has two way data binding, so use result to assign values to your scope variables.  
                    //for(var i=0;i<result.length;i++)    
                  
                        $scope.leaves = result.responds;


                }); 
        }
        $scope.getAllLeaves();
        $scope.showLeave = function(leaveObj) {
            
                ModalService.showModal({
                    templateUrl: '/templates/modal/leaveDetail.html',
                    controller: "LeaveModalController",
                    inputs:{
                        requester:leaveObj.requestor,
                        reason:leaveObj.leave_type,
                        status:leaveObj.status,
                        approver:leaveObj.approver,
                        startdate:leaveObj.start_date,
                        enddate:leaveObj.end_date,
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        alert(result);
                    });
                });

            };
});

app.controller('calendarController',['myLeaveObj',function (myLeaveObj,$modal) {
        console.log(new Date().getMilliseconds())
        var vm = this;
        var mystatus = JSON.parse(JSON.stringify(myLeaveObj))
        if(mystatus.$$state.status == 0)
        {
            vm.events = [];
            vm.calendarView = 'month';
            vm.calendarDay = new Date();
            //alert('not yet')
        }
        myLeaveObj.then(function(varray){
            vm.events = varray;
            vm.calendarView = 'month';
            vm.calendarDay = new Date();
            console.log('2nd'+new Date().getMilliseconds())
        });
        // Settings.promise.success(function(response){
            //alert(mydata.promise)

        //         //alert(JSON.stringify(response))
        //         var type = ['halfday','warning']
        //         var myObj = {}
        //         var varray=[];
        //         for(var i=0;i<response.responds.length;i++)
        //         {
        //             var sdate = new Date(response.responds[i].startdate);
        //             var edate = new Date(response.responds[i].enddate);
        //             myObj.title     = response.responds[i].requester;
        //             myObj.type      = 'halfday';
        //             myObj.startsAt  = sdate;
        //             myObj.endsAt    = edate;
        //             myObj.draggable = true;
        //             myObj.resizable = true;

        //             varray.push(JSON.parse(JSON.stringify(myObj)))
        //             myObj = {};
        //         } 
        //         vm.events = varray;
        //         })

    // var myser = new MyCollectionService();
    //vm.events = StoreProducts.getData();
    // myLeaveObj.then(function(varray){

        
    // })
    
    
    //These variables MUST be set as a minimum for the calendar to work



    function showModal(action, event) {
      $modal.open({
        templateUrl: 'modalContent.html',
        controller: function() {
          var vm = this;
          vm.action = action;
          vm.event = event;
        },
        controllerAs: 'vm'
      });
    }

    vm.eventClicked = function(event) {
      showModal('Clicked', event);
    };

    vm.eventEdited = function(event) {
      showModal('Edited', event);
    };

    vm.eventDeleted = function(event) {
      showModal('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {
      showModal('Dropped or resized', event);
    };

    vm.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };


}]);

app.controller('LeaveModalController',  [ '$scope','requester','reason','status','approver','startdate','enddate',
                                  function($scope,requester,reason,status,approver,startdate,enddate) {

    $scope.requester = requester;
    $scope.reason = reason;
    $scope.status = status;
    $scope.approver = approver;

  // when you need to close the modal, call close
     $scope.close = function(result) {        
        close(result, 500); // close, but give 500ms for bootstrap to animate
     };
    $scope.startdate = new Date(startdate);
    $scope.enddate = new Date(enddate);
}]);



// calendarController.loadData = function($q,$scope){

//         var defer = $q.defer()
//         var myservice = new MyCollectionService();
//          myservice.$get({collectionName:'leavereport'},function(result){                     
//             $scope.leaves = result.responds;  
//                 var type = ['info','warning']
//                 var myObj = {}
//                 var varray=[];
//                 for(var i=0;i<$scope.leaves.length;i++)
//                 {
//                     var sdate = new Date($scope.leaves[i].startdate);
//                     var edate = new Date($scope.leaves[i].enddate);
//                     myObj.title     = $scope.leaves[i].requester;
//                     myObj.type      = type[i];
//                     myObj.startsAt  = sdate;
//                     myObj.endsAt    = edate;
//                     myObj.draggable = true;
//                     myObj.resizable = true;

//                     varray.push(JSON.parse(JSON.stringify(myObj)))
//                     myObj = {};
//                 }         
//                 $scope.leaveArr=varray;
//                 defer.resolve();                                   
//         }); 
//          return defer.promise;
// }



