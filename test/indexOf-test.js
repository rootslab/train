#!/usr/bin/env node
exports.test = function ( done ) {
    var log = console.log
        , assert = require( 'assert' )
        , Train = require( '../' )
        , t = Train()
        , a = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ]
        , alen = a.length
        , cut = 11
        , qhead = t.qhead = a.slice( 0, cut )
        , qtail = t.qtail = a.slice( cut )
        , i = 0
        , l = null
        , exit = typeof done === 'function' ? done : function () {}
        ;

    log( '- filled queue with %d elements.', alen );

    log( '- check equality betwwen #indexOf and #get results. (%d tests)', alen );

    for ( ; i < alen; ++i ) {
        assert.equal( t.indexOf( i ), t.get( i ), 'something goes wrong with indexOf, elements do not match!' );
    };


    log( '- check #indexOf( el ) results after #pop el, every call should return -1. (%d tests)', t.length );

    i = 0;

    for ( ; t.length; ++i ) {
        t.pop();
        assert.equal( t.indexOf( i ), -1, 'expected -1, got: ' + t.indexOf( i ) );
    };


    log( '- re-build queue with doubled elements, now length is %d.', cut << 1 );

    t.qhead = a.slice( 0, cut );
    t.qtail = a.slice( 0, cut );
    t.hpos = 0;

    log( '- check #indexOf( el, offset ) results, 2 matches for every el should be found. (%d tests)', cut );

    i = 0;

    for ( ; i < cut; ++i ) {
        assert.equal( t.get( t.indexOf( i ) ), t.get( t.indexOf( i, i + 1 ) ), 'something goes wrong with offset' );
    };


    log( '- check #indexOf( el ) results after #pop el. (%d tests)', cut );

    i = 0;

    for ( ; i < cut; ++i ) {
        l = t.pop();
        assert.equal( l, t.get( t.indexOf( i ) ), 'something goes wrong with indexOf' );
    };

    exit();
};