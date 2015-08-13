var app = angular.module('cardsApp',['ngResource',
                                     'ui.router',
                                     'mwl.calendar',
                                     'ui.bootstrap',
                                     'app.directives.contactCard',
                                     'app.directives.sidebar',
                                     'app.directives.leavebar',
                                     'angularModalService'])
//var $injector = window.angular.injector(['ng']);
app.config(['$urlRouterProvider', '$stateProvider','$locationProvider',function($urlRouterProvider, $stateProvider, $locationProvider) {
    // $urlRouterProvider.otherwise('/#/home');
    
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'cardsController'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'templates/about.html',
        controller: 'aboutCtrl'
      })      
      .state('contact', {
        url: '/contact',
        templateUrl: 'templates/contact.html',
        controller: 'contactCtrl'
      })
      .state('leavereport', {
        url: '/leavereport',
        templateUrl: 'templates/leavereport.html',
        controller: 'leavesController'
      })
      .state('leavereport.listview', {
        url: '/listview',
        templateUrl: 'templates/directives/listview.html',
        controller: 'leavesController'
      })
      .state('leavereport.calendarview', {
        // resolve:{
        //    // mydata: function(){
        //    //  return 'hi';
        //    // }
        //  mydata: function($q, $http){
        //     var deferred = $q.defer();
        //     $http.get('/api/data/collections/leavereport')
        //        .then (function (data) {
                
                
        //         //alert(data.data.responds[0]);
        //         //alert(JSON.stringify(data.data))
        //         var type = ['halfday','warning']
        //         var myObj = {}
        //         var varray=[];
        //         for(var i=0;i<data.data.responds.length;i++)
        //         {
        //             var sdate = new Date(data.data.responds[i].startdate);
        //             var edate = new Date(data.data.responds[i].enddate);
        //             myObj.title     = data.data.responds[i].requester;
        //             myObj.type      = 'halfday';
        //             myObj.startsAt  = sdate;
        //             myObj.endsAt    = edate;
        //             myObj.draggable = true;
        //             myObj.resizable = true;

        //             varray.push(JSON.parse(JSON.stringify(myObj)))
        //             myObj = {};
        //         } 

                   
        //            //alert(varray);
        //        });
        //        deferred.resolve('hi')
        //       return deferred.promise;
        //  }
        // },
        // resolve:{
        //   mydata: function(){

        //           var url = '/api/data/collections/leavereport';
        //           return $http.get(url, {cache: true});
        //       }

          
        // },
        url: '/calendarview',
        templateUrl: 'templates/directives/calendarview.html'
        // controller:'calendarController'

      });      
      // $urlRouterProvider.when('/leavereport',{redirectTo: '/home'});
      $locationProvider.html5Mode(true).hashPrefix('!');
  }]);


// app.config(function(calendarConfigProvider) {

//     calendarConfigProvider.setDateFormatter('moment'); // use moment to format dates

//     calendarConfigProvider.setDateFormatter('moment'); // use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.

//     calendarConfigProvider.setDateFormats({
//       hour: 'HH:mm' //this will configure the hour view to display in 24 hour format rather than the default of 12 hour
//     });

//     calendarConfigProvider.setTitleFormats({
//       day: 'ddd D MMM' //this will configure the day view title to be shorter
//     });

//     calendarConfigProvider.setI18nStrings({
//       eventsLabel: 'Events', //This will set the events label on the day view
//       timeLabel: 'Time' //This will set the time label on the time view
//     });

//     calendarConfigProvider.setDisplayAllMonthEvents(true); //This will display all events on a month view even if they're not in the current month. Default false.

// });	


// app.service('leavereport',function($resource){
//     return $resource('leavereport');
// });

