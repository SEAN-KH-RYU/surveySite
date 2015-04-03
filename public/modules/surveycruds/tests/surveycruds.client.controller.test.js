'use strict';

(function() {
	// Surveycruds Controller Spec
	describe('Surveycruds Controller Tests', function() {
		// Initialize global variables
		var SurveycrudsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Surveycruds controller.
			SurveycrudsController = $controller('SurveycrudsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Surveycrud object fetched from XHR', inject(function(Surveycruds) {
			// Create sample Surveycrud using the Surveycruds service
			var sampleSurveycrud = new Surveycruds({
				name: 'New Surveycrud'
			});

			// Create a sample Surveycruds array that includes the new Surveycrud
			var sampleSurveycruds = [sampleSurveycrud];

			// Set GET response
			$httpBackend.expectGET('surveycruds').respond(sampleSurveycruds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.surveycruds).toEqualData(sampleSurveycruds);
		}));

		it('$scope.findOne() should create an array with one Surveycrud object fetched from XHR using a surveycrudId URL parameter', inject(function(Surveycruds) {
			// Define a sample Surveycrud object
			var sampleSurveycrud = new Surveycruds({
				name: 'New Surveycrud'
			});

			// Set the URL parameter
			$stateParams.surveycrudId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/surveycruds\/([0-9a-fA-F]{24})$/).respond(sampleSurveycrud);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.surveycrud).toEqualData(sampleSurveycrud);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Surveycruds) {
			// Create a sample Surveycrud object
			var sampleSurveycrudPostData = new Surveycruds({
				name: 'New Surveycrud'
			});

			// Create a sample Surveycrud response
			var sampleSurveycrudResponse = new Surveycruds({
				_id: '525cf20451979dea2c000001',
				name: 'New Surveycrud'
			});

			// Fixture mock form input values
			scope.name = 'New Surveycrud';

			// Set POST response
			$httpBackend.expectPOST('surveycruds', sampleSurveycrudPostData).respond(sampleSurveycrudResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Surveycrud was created
			expect($location.path()).toBe('/surveycruds/' + sampleSurveycrudResponse._id);
		}));

		it('$scope.update() should update a valid Surveycrud', inject(function(Surveycruds) {
			// Define a sample Surveycrud put data
			var sampleSurveycrudPutData = new Surveycruds({
				_id: '525cf20451979dea2c000001',
				name: 'New Surveycrud'
			});

			// Mock Surveycrud in scope
			scope.surveycrud = sampleSurveycrudPutData;

			// Set PUT response
			$httpBackend.expectPUT(/surveycruds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/surveycruds/' + sampleSurveycrudPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid surveycrudId and remove the Surveycrud from the scope', inject(function(Surveycruds) {
			// Create new Surveycrud object
			var sampleSurveycrud = new Surveycruds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Surveycruds array and include the Surveycrud
			scope.surveycruds = [sampleSurveycrud];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/surveycruds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSurveycrud);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.surveycruds.length).toBe(0);
		}));
	});
}());