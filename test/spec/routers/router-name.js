(function() {
	'use strict';

	var root = this;

	root.define([
		'routers/router-name'
		],
		function( RouterName ) {

			describe('RouterName Router', function () {

				it('should be an instance of RouterName Router', function () {
					var router-name = new RouterName();
					expect( router-name ).to.be.an.instanceof( RouterName );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );