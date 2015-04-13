'use strict';
var questionID;
// Surveycruds controller
angular.module('surveycruds').controller('SurveycrudsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Surveycruds',
	function($scope, $stateParams, $location, Authentication, Surveycruds) {
		$scope.authentication = Authentication;

		// Create new Surveycrud
		$scope.create = function() {
			// Create new Surveycrud object
			var surveycrud = new Surveycruds ({
				name: this.name,
                //questions : this.questions
			});

			// Redirect after save
			surveycrud.$save(function(response) {
				$location.path('surveycruds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Create new Surveycrud
		$scope.createQuestion = function() {
            var surveycrud = $scope.surveycrud;
			//var surveycrudNew = $scope.surveycrud;
            console.log('this.question='+this.question);
            surveycrud['questions'].push({
                question: this.question,
                select1: this.select1,
                select2: this.select2,
                select3: this.select3,
                select4: this.select4,
            });
            console.log('surveycrud='+surveycrud);
			// Redirect after save
			surveycrud.$update(function() {
				$location.path('surveycruds/' + surveycrud._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Remove existing Surveycrud
		$scope.remove = function(surveycrud) {
			if ( surveycrud ) { 
				surveycrud.$remove();

				for (var i in $scope.surveycruds) {
					if ($scope.surveycruds [i] === surveycrud) {
						$scope.surveycruds.splice(i, 1);
					}
				}
			} else {
				$scope.surveycrud.$remove(function() {
					$location.path('surveycruds');
				});
			}
		};

		// Update existing Surveycrud
		$scope.update = function() {
			var surveycrud = $scope.surveycrud;

			surveycrud.$update(function() {
				$location.path('surveycruds/' + surveycrud._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Update existing Surveycrud
		$scope.editQuestion = function(questionId) {
			var surveycrud = $scope.surveycrud;
            $scope.questionId = questionId;
            questionID = questionId;
            console.log('questionId='+questionId);
            console.log('surveycrud._id='+surveycrud._id);
			surveycrud.$update(function() {
				$location.path('surveycruds/' + surveycrud._id+'/editQuestion');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Find a list of Surveycruds
		$scope.find = function() {
			$scope.surveycruds = Surveycruds.query();
		};

		// Find existing Surveycrud
		$scope.findOne = function() {
			$scope.surveycrud = Surveycruds.get({ 
				surveycrudId: $stateParams.surveycrudId
			});
		};
		// Find existing Surveycrud
		$scope.findQuestion = function() {
			$scope.surveycrud = Surveycruds.get({ 
				surveycrudId: $stateParams.surveycrudId
			});
            $scope.questionId = questionID;
            console.log('$stateParams.surveycrudId='+$stateParams.surveycrudId);
            console.log('questionID='+questionID);
            console.log('$scope.questionId='+$scope.questionId);
		};        
	}
]);