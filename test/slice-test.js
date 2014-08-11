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
        , i = - alen
        , j = - alen
        , r = null
        , x = null
        , k = 1 + alen * 2
        , exit = typeof done === 'function' ? done : function () {}
        ;

    log( '- compare Train#slice with Array#slice results.' );

    log( '- filled Array and Train instances both with %d items.', alen );

    log( '- check slice result with no args.' );
    assert.deepEqual( t.slice(), a, 'something goes wrong, full array expected!' );

    log( '- check results with slice(NaN) and slice(NaN,%d).', 15 );
    assert.deepEqual( t.slice( NaN ), a.slice( NaN ), 'wrong result with NaN!' );
    assert.deepEqual( t.slice( NaN, 15 ), a.slice( NaN, 15 ), 'wrong result with NaN,' + 15 );

    log( '- check result with string numbers ("", "9").' );
    assert.deepEqual( t.slice( '', 9 ), a.slice( '', 9 ), ' wrong result with empty char!' );
    assert.deepEqual( t.slice( '', '9' ), a.slice( '', '9' ), ' wrong result with empty char!' );

    log( '- run slice with other weird arguments.' );
    assert.deepEqual( t.slice( -Infinity, Infinity ), a.slice( -Infinity, Infinity ), 'wrong result with -Inf,+Inf.' );
    assert.deepEqual( t.slice( '' ), a.slice( '' ), ' wrong result with empty char!' );


    log( '- running (%d) slice tests using only begin index, from (%d) to (%d).', k, -alen, alen );
    for ( ; i < alen; ++i ) {
        r = a.slice( i );
        x = t.slice( i );
        // log( '\n- slice(%d): %j\n- should(%d): %j', i, r, i, r );
        assert.deepEqual( x, r, 'sliced arrays do not match! i: ' + i );
    };

    log( '- running (%d) slice tests using both indexes, from (%d,%d) to (%d,%d).', k * k, -alen, -alen, alen, alen );
    for ( i = - alen; i < alen; ++i, j = - alen ) {
        for ( ; j < alen; ++j ) {
            r = a.slice( i, j );
            x = t.slice( i, j );
            // log( '\n- slice(%d,%d): %j\n- should(%d,%d): %j', i, j, r, i, j, r );
            assert.deepEqual( x, r, 'sliced arrays do not match! i: ' + i + ', j:' + j );
        };
    };

    exit();
};