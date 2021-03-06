'use strict';
function NumbersCtrl(DAO, $scope, $filter, ngTableParams)
{
	if ($scope.appConfig) {
		if (!$scope.appConfig.token!='') {
			window.location.href = "#/login"
		}
	}

	$scope.flags = {save: false};
	$scope.errors = {loadingSite: false, showErrors: false, showServerError: false,errorMessages:[]};
	$scope.errorValidation = function(){
	   $scope.errors = {loadingSite: true};
	};
	
	if(!$scope.numbers){
		$scope.filter = ""
		$scope.numberss = [];
		$scope.numbers = {};
	}

	$scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,           // count per page
        sorting: {
            id : 'desc' // initial sorting
        }
	}, {
		getData: function($defer, params) {
			DAO.query({appName: $scope.appConfig.appName, token: $scope.appConfig.token, controller: 'numbers', action: 'list'},	
				$scope.loadingSite=true,
					function (result) {
						$scope.numberss=result;
						var putIt  = params.sorting() ? $filter('orderBy')($scope.numberss, params.orderBy()): id;
						putIt = params.filter ? $filter('filter')( putIt, params.filter()) :  putIt;
						params.total(putIt.length);
						$defer.resolve(putIt.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						$scope.numberss=(putIt.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						$scope.loadingSite=false;   
					},
					function (error) {
						$scope.errors.showErrors = true;
						$scope.errors.showServerError = true;
						$scope.errors.errorMessages.push(''+error.status+' '+error.data);
						$scope.loadingSite=false;
					});
      	}
    });
	
	//Required for dependency lookup 
	$scope.getAllNumbers = function () {
		//get all
		$scope.errors.errorMessages=[];
		DAO.query({appName: $scope.appConfig.appName, token: $scope.appConfig.token, controller: 'numbers', action: 'list'},
		$scope.loadingSite=true,
		function (result) {
			$scope.numberss = result;
			$scope.loadingSite=false;   
			
		},
		function (error) {
			$scope.errors.showErrors = true;
			$scope.errors.showServerError = true;
			$scope.errors.errorMessages.push(''+error.status+' '+error.data);
			$scope.loadingSite=false;
		});
	};
	 
	
	$scope.newNumbers = function () {
		$scope.loadingSite=true;
		$scope.numbers = {};
		$scope.loadingSite=false;
		window.location.href = "#/numbers/create"		
	}

	$scope.manualSaveNumbers = function () {
		$scope.loadingSite=true;
		$scope.flags.save = false;
		if ($scope.numbers.id == undefined)
		{
			$scope.saveNumbers();
		}
		else
		{
			$scope.updateNumbers();
		}
	}

	$scope.saveNumbers = function () {
		$scope.errors.errorMessages=[];
		DAO.save({appName: $scope.appConfig.appName, token: $scope.appConfig.token, instance:$scope.numbers, controller:'numbers', action:'save'},
		function (result) {
			$scope.numbers = result;
			$scope.flags.save = true;
			$scope.loadingSite=false;

		},
		function (error) {
			$scope.flags.save = false;
			$scope.errors.showErrors = true;
			$scope.errors.showServerError = true;
			$scope.errors.errorMessages.push(''+error.status+' '+error.data);
			$scope.loadingSite=false;   
		});
	}

	$scope.updateNumbers = function () {
		$scope.errors.errorMessages=[];
		DAO.update({appName: $scope.appConfig.appName, token: $scope.appConfig.token, instance:$scope.numbers, controller:'numbers', action:'update'},
		$scope.loadingSite=true,
		function (result) {
			$scope.numberss = result;
			$scope.flags.save = true;
			$scope.loadingSite=false;
			window.location.href = "#/numbers/list"
		},
		function (error) {
			$scope.flags.save = false;
			$scope.errors.showErrors = true;
			$scope.errors.showServerError = true;
			$scope.errors.errorMessages.push(''+error.status+' '+error.data);
			$scope.loadingSite=false;
		});
	}

	$scope.editNumbers = function (numbers){
		$scope.errors.errorMessages=[];
		DAO.get({appName: $scope.appConfig.appName, token: $scope.appConfig.token, instance:$scope.numbers, id: numbers.id, controller:'numbers', action:'show'},
		$scope.loadingSite=true,
		function (result) {
			$scope.numbers = result;
			$scope.flags.save = true;
			$scope.loadingSite=false;
			window.location.href = "#/numbers/edit"
		},
		function (error) {
			$scope.errors.showErrors = true;
			$scope.errors.showServerError = true;
			$scope.errors.errorMessages.push('Error: '+error.status+' '+error.data);
			$scope.loadingSite=false;
		});
	}

	$scope.confirmDeleteNumbers = function () {
		$scope.errors.errorMessages=[];
		DAO.delete({appName: $scope.appConfig.appName, token: $scope.appConfig.token, instance:$scope.numbers, id: $scope.numbers.id, controller:'numbers', action:'delete'},
		$scope.loadingSite=true,
		function (result) {
			//$scope.numberss = result;
			$scope.flags.save = true;
			$scope.loadingSite=false;
			window.location.href = "#/numbers/list"
		},
		function (error) {
			$scope.errors.showErrors = true;
			$scope.errors.showServerError = true;
			$scope.errors.errorMessages.push(''+error.status+' '+error.data);
			$scope.loadingSite=false;
		});
	}
}
