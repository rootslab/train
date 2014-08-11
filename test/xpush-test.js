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

    log( '- test queue with xlim argument: Train(null, %d).', xlim );
    log( '- check value of Train.xlim property, should be %d.', xlim );
    assert( t.xlim, xlim );

    log( '- try #xpush with 3 args/items.' );
    v = t.xpush( 1, 2, 3 );

    log( '- check if #xpush fails returning %d.', -1 );
    assert.ok( v === -1, '#xpush should return ' + ( -1 ) );

    log( '- check queue size, should be %d.', 0 );
    assert.ok( t.length === 0, 'queue size should be ' + 0 );

    log( '- check #xpush with 2 args/items' );
    v = t.xpush( 1, 2 );

    log( '- check if #xpush returning %d.', 2 );
    assert.ok( v === 2, '#xpush should return 2!' );

    log( '- check queue size, should be %d.', 2 );
    assert.ok( t.length === 2, 'queue size should be ' + 2 );

    log( '- bypass queue size limit, using #push with 1 arg/item.' );
    v = t.push( 1 );

    log( '- check if #push returns %d.', 3 );
    assert.ok( v === 3, '#push should return ' + 3 );

    log( '- check queue size, should be %d.', 3 );
    assert.ok( t.length === 3, 'queue size should be ' + 3 );

    exit();
};