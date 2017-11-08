#!/usr/bin/env node
exports.test = function ( done ) {

    var log = console.log
        , assert = require( 'assert' )
        , Train = require( '../' )
        , t = new Train()
        , p = 20
        , k = Math.pow( 2, p )
        , i = 0
        , el = null
        , result1 = [] 
        , result2 = []
        , exit = typeof done === 'function' ? done : function () {}
        ;

    log( '- add number 0 and check pop(1) result' );
    t.push( 0 );
    el = t.pop();
    assert.deepEqual( el, [ 0 ], 'expected: (0), got: (' + el + ')' );

    log( '- add null value and check pop(1) result' );
    t.push( null );
    el = t.pop();
    assert.deepEqual( el, [ null ], 'expected: (), got: (' + el + ')' );


    log( '- add undefined value and check pop(1) result, should be empty' );
    t.push( undefined );
    el = t.pop();
    assert.deepEqual( el, [], 'expected: (), got: (' + el + ')' );


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