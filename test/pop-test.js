#!/usr/bin/env node
exports.test = function ( done ) {

    var log = console.log
        , assert = require( 'assert' )
        , Train = require( '../' )
        , t = new Train()
        , p = 20
        , k = Math.pow( 2, p )
        , i = 0
        , result1 = [] 
        , result2 = []
        , exit = typeof done === 'function' ? done : function () {}
        ;

    // get multilple shift() results

    log( '- pre-fill Train with 2^%d items', p );

    i = k >>> 1;

    for ( ; i--; ) {
        t.push( i );
    };

    /*
     * shift out 2 items to force internal switching of
     * Train.qhead with Train.qtail,then push the same
     * number of items to fill qtail, finally set the
     * current qhead index to the middle queue position.
     */
    t.pop( 2 );

    i = k >>> 1;

    for ( ; i--; ) {
        t.push( 1 );
    };

    t.pos = k >>> 2;

    log( '- evicting 2^%d items with %d #shift() from index %d', p - 1, k >>> 1, k >>> 2 );

    i = k >>> 1;


    for ( ; i--; ) {
        // build an array like with pop()
        result1.push( t.shift() );
    };

    // flush queue and get single pop() results

    t.flush();

    log( '- pre-fill Train with 2^%d items', p );

    i = k >>> 1;

    for ( ; i--; ) {
        t.push( i );
    };

    t.pop( 2 );

    i = k >>> 1;

    for ( ; i--; ) {
        t.push( 1 );
    };

    t.pos = k >>> 2;

    log( '- evicting 2^%d items with single #pop() from index %d', p - 1, k >>> 2 );

    i = k >>> 1;

    for ( ; i--; ) {
        // build an array like with pop()
        result2.push( t.shift() );
    };

    log( '- check if results match' );

    assert.deepEqual( result1, result2, 'results do not match!' );

    exit();
};