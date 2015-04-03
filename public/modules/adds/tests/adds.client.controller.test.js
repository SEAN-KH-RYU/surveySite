'use strict';

(function() {
	// Adds Controller Spec
	describe('Adds Controller Tests', function() {
		// Initialize global variables
		var AddsController,
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

			// Initialize the Adds controller.
			AddsController = $controller('AddsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Add object fetched from XHR', inject(function(Adds) {
			// Create sample Add using the Adds service
			var sampleAdd = new Adds({
				name: 'New Add'
			});

			// Create a sample Adds array that includes the new Add
			var sampleAdds = [sampleAdd];

			// Set GET response
			$httpBackend.expectGET('adds').respond(sampleAdds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.adds).toEqualData(sampleAdds);
		}));

		it('$scope.findOne() should create an array with one Add object fetched from XHR using a addId URL parameter', inject(function(Adds) {
			// Define a sample Add object
			var sampleAdd = new Adds({
				name: 'New Add'
			});

			// Set the URL parameter
			$stateParams.addId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/adds\/([0-9a-fA-F]{24})$/).respond(sampleAdd);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.add).toEqualData(sampleAdd);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Adds) {
			// Create a sample Add object
			var sampleAddPostData = new Adds({
				name: 'New Add'
			});

			// Create a sample Add response
			var sampleAddResponse = new Adds({
				_id: '525cf20451979dea2c000001',
				name: 'New Add'
			});

			// Fixture mock form input values
			scope.name = 'New Add';

			// Set POST response
			$httpBackend.expectPOST('adds', sampleAddPostData).respond(sampleAddResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Add was created
			expect($location.path()).toBe('/adds/' + sampleAddResponse._id);
		}));

		it('$scope.update() should update a valid Add', inject(function(Adds) {
			// Define a sample Add put data
			var sampleAddPutData = new Adds({
				_id: '525cf20451979dea2c000001',
				name: 'New Add'
			});

			// Mock Add in scope
			scope.add = sampleAddPutData;

			// Set PUT response
			$httpBackend.expectPUT(/adds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/adds/' + sampleAddPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid addId and remove the Add from the scope', inject(function(Adds) {
			// Create new Add object
			var sampleAdd = new Adds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Adds array and include the Add
			scope.adds = [sampleAdd];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/adds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAdd);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.adds.length).toBe(0);
		}));
	});
}());