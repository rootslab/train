#!/usr/bin/env node
exports.test = function ( done ) {
    var log = console.log
        , assert = require( 'assert' )
        , util = require( 'util' )
        , iopt = {
            showHidden : false
            , depth : 3
            , colors : true
            , customInspect : true 
        }
        , inspect = function ( arg, opt ) {
            return util.inspect( arg, iopt );
        }
        , Train = require( '../' )
        , t = Train()
        , expected = null
        , exit = typeof done === 'function' ? done : function () {}
        ;

    // qroll is not empty, offset > 0 (5)

    log( '- fill queue with elements, build a custom qhead array.' );

    t.qhead = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    t.hpos = 9;

    log( '- enable qroll, set rollback limit, build a custom qroll array.' );

    t.rlim = 10;
    t.qroll = [ 'a', 'b', 'c', 'd', 'e', 'f' ];
    t.roll = true;

    log( '- queue status:', inspect ( t ) );

    log( '- shift an element to build rollback queue.' );

    t.shift();

    expected = [ 'f', 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

    log( '- check qroll, should be: %s.', inspect( expected ) );

    assert.deepEqual( t.qroll, expected, 'got: ' + inspect( t.qroll ) );

    log( '- qroll result is:', inspect ( t.qroll ) );

    // qroll is not empty, data fits, offset <= 0 (0)

    log( '\n- fill queue with elements, build a custom qhead array.' );

    t.qhead = [ 1, 2, 3, 4 ];
    t.hpos = 4;

    log( '- enable qroll, set rollback limit, build a custom qroll array.' );

    t.rlim = 10;
    t.qroll = [ 'a', 'b', 'c', 'd', 'e', 'f' ];
    t.roll = true;

    log( '- queue status:', inspect ( t ) );

    log( '- shift an element to build rollback queue.' );

    t.shift();

    expected = t.qroll.concat( t.qhead );

    log( '- check qroll, should be: %s.', inspect( expected ) );

    assert.deepEqual( t.qroll, expected, 'got: ' + inspect( t.qroll ) );

    log( '- qroll result is:', inspect ( t.qroll ) );

    // qroll is not empty, data fits, offset <= 0 (-4 )

    log( '\n- fill queue with elements, build a custom qhead array.' );

    t.qhead = [ 1, 2, 3, 4 ];
    t.hpos = 4;

    log( '- enable qroll, set rollback limit, build a custom qroll array.' );

    t.rlim = 10;
    t.qroll = [ 'a', 'b' ];
    t.roll = true;

    log( '- queue status:', inspect ( t ) );

    log( '- shift an element to build rollback queue.' );

    t.shift();

    expected = [ 'a', 'b', 1, 2, 3, 4 ];

    log( '- check qroll, should be: %s.', inspect( expected ) );

    assert.deepEqual( t.qroll, expected, 'got: ' + inspect( t.qroll ) );

    log( '- qroll result is:', inspect ( t.qroll ) );

    // qroll is not empty, qhead.length > qroll.length

    log( '\n- fill queue with elements, build a custom qhead array.' );

    t.qhead = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
    t.hpos = 11;

    log( '- enable qroll, set rollback limit, build a custom qroll array.' );

    t.rlim = 10;
    t.qroll = [ 'a', 'b', 'c', 'd', 'e', 'f' ];
    t.roll = true;

    log( '- queue status:', inspect ( t ) );

    log( '- shift an element to build rollback queue.' );

    t.shift();

    expected = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];

    log( '- check qroll, should be: %s.', inspect( expected ) );

    assert.deepEqual( t.qroll, expected, 'got: ' + inspect( t.qroll ) );

    log( '- qroll result is:', inspect ( t.qroll ) );

    // qroll is empty, rlim === 0

    log( '\n- fill queue with elements, build a custom qhead array.' );

    t.qhead = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
    t.hpos = 11;

    log( '- enable qroll, set rollback limit, build a custom qroll array.' );

    t.rlim = 0;
    t.qroll = [];
    t.roll = true;

    log( '- queue status:', inspect ( t ) );

    log( '- shift an element to build rollback queue.' );

    t.shift();

    expected = [];

    log( '- check qroll, should be: %s.', inspect( expected ) );

    assert.deepEqual( t.qroll, expected, 'got: ' + inspect( t.qroll ) );

    log( '- check qhead, should be: %s.', inspect( expected ) );

    assert.deepEqual( t.qhead, expected, 'got: ' + inspect( t.qhead ) );

    log( '- qroll result is:', inspect ( t.qroll ) );

    // qroll is not empty, rlim === 1

    log( '\n- fill queue with elements, build a custom qhead array.' );

    t.qhead = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
    t.hpos = 11;

    log( '- enable qroll, set rollback limit, build a custom qroll array.' );

    t.rlim = 1;
    t.qroll = [ 'a' ];
    t.roll = true;

    log( '- queue status:', inspect ( t ) );

    log( '- shift an element to build rollback queue.' );

    t.shift();

    expected = [];

    log( '- check qhead, should be: %s.', inspect( expected ) );

    assert.deepEqual( t.qhead, expected, 'got: ' + inspect( t.qhead ) );

    expected = [ 11 ];

    log( '- check qhead, should be: %s.', inspect( expected ) );

    assert.deepEqual( t.qroll, expected, 'got: ' + inspect( t.qroll ) );

    log( '- qroll result is:', inspect ( t.qroll ) );

    // qroll is not empty, rlim === 2, rpos === qhead.length

    log( '\n- fill queue with elements, build a custom qhead array.' );

    t.qhead = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
    t.hpos = 12;

    log( '- enable qroll, set rollback limit, build a custom qroll array.' );

    t.rlim = 2;
    t.rpos = 12;
    t.qroll = [ 'a', 'b' ];
    t.roll = true;

    log( '- queue status:', inspect ( t ) );

    log( '- shift an element to build rollback queue.' );

    t.shift();

    log( '- check rpos, hpos, should be: %s.', [ 0, 0 ] );

    assert.ok( ( t.rpos === t.hpos ) && t.rpos === 0, 'got: ' + inspect( [ 0, 0 ] ) );

    expected = [];

    log( '- check qroll, should be: %s.', inspect( expected ) );

    assert.deepEqual( t.qhead, expected, 'got: ' + inspect( t.qhead ) );

    log( '- qhead result is:', inspect ( t.qhead ) );

    expected = [ 11, 12 ];

    log( '- check qroll, should be: %s.', inspect( expected ) );

    assert.deepEqual( t.qroll, expected, 'got: ' + inspect( t.qroll ) );

    log( '- qroll result is:', inspect ( t.qroll ) );

    exit();
};