angular.module('app.directives.contactCard',[])
.directive('contactCard',function() {
	return{
		restrict: 'E',
		replace:true,
		templateUrl:"templates/directives/contactCard.html"		
	};
})
angular.module('app.directives.sidebar',[])
.directive('sideBar',function() {
	return{
		restrict: 'E',
		replace:true,
		templateUrl:"templates/directives/sidebar.html"		
	};
})
angular.module('app.directives.leavebar',[])
.directive('leaveBar',function() {
	return{
		restrict: 'E',
		replace:true,
		templateUrl:"templates/directives/leavebar.html"		
	};
})