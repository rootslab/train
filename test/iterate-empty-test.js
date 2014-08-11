#!/usr/bin/env node
exports.test = function ( done ) {

    var log = console.log
        , assert = require( 'assert' )
        , Train = require( '../' )
        , t = new Train()
        , exit = typeof done === 'function' ? done : function () {}
        ;

    log( '- test iterate() with no elements.' )
    t.iterate( function ( el, i, done ) {
        throw new Error( 'this statement should not execute!' );
    }, null, function ( err, cnt ) {
        var alen = arguments.length;
        log( '- check callback arguments' );
        assert.ok( alen === 2, 'callback sould get 2 arguments, now length is: ' + alen );
        log( '- check if err === null' );
        assert.ok( err === null, 'something goes wrong!' );
        log( '- check if counter === 0' );
        assert.ok( cnt === 0, 'element counter should be 0!' );
        exit();
    } );

};