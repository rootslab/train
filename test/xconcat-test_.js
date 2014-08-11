#!/usr/bin/env node
exports.test = function ( done ) {
    var log = console.log
        , assert = require( 'assert' )
        , Train = require( '../' )
        , arr = []
        , xlim = 2
        , t = new Train( { xlim : xlim } )
        , v = null
        , exit = typeof done === 'function' ? done : function () {}
        ;

    log( '- test queue with xlim argument: Train( null, %d).', xlim );
    log( '- check value of Train.xlim property, should be %d.', xlim );
    assert( t.xlim, xlim );

    log( '- try #xconcat with an array containing 3 items.' );
    v = t.xconcat( [ 1, 2, 3 ] );

    log( '- check if #xconcat fails returning %d.', -1 );
    assert.ok( v === -1, '#xconcat should return ' + ( -1 ) );

    log( '- check queue size, should be %d.', 0 );
    assert.ok( t.length === 0, 'value returned by #xconcat should be ' + 0 );

    log( '- check #xconcat with an array containing 2 items.' );
    v = t.xconcat( [ 1, 2 ] );

    log( '- check if #xconcat returning %d.', 2 );
    assert.ok( v === 2, '#xconcat should return 2!' );

    log( '- check queue size, should be %d.', 2 );
    assert.ok( t.length === 2, 'value returned by #xconcat should be ' + 2 );

    log( '- bypass queue size limit, using #concat with an array with 1 item.' );
    v = t.concat( 1 );

    log( '- check if #concat returns current Train instance.' );
    assert.ok( v === t, '#concat should return ' + 3 );

    log( '- check queue size, should be %d.', 3 );
    assert.ok( t.length === 3, 'value returned by #concat should be ' + 3 );

    exit();
};