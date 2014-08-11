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
        , popped = null
        , exit = typeof done === 'function' ? done : function () {}
        ;

    // 0 < hlen < l

    log( '- fill queue with elements, build a custom qhead array.' );

    t.qhead = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    t.qtail = [ 11, 12, 13, 14, 15, 16, 17, 18, 19 ];

    log( '- enable qroll, set rollback limit, build a custom qroll array.' );

    t.rlim = 10;
    t.qroll = [ 'a', 'b', 'c', 'd', 'e', 'f' ];
    t.roll = true;

    log( '- queue status:', inspect ( t ) );

    log( '- pop all elements to build rollback queue.' );

    popped = t.pop( Infinity );

    log( '- popped: %s.', inspect( popped ) );

    expected = [ 9, 11, 12, 13, 14, 15, 16, 17, 18, 19 ];

    log( '- check qroll, expected: %s.', inspect( expected ) );

    assert.deepEqual( t.qroll, expected, 'got: ' + inspect( t.qroll ) );

    log( '- qroll result is:', inspect ( t.qroll ) );

    log( '\n- fill queue with elements, build a custom qhead array.' );

    t.flush();

    t.push( 0, 1, 2, 3, 4 );
    t.shift();
    t.push( 11, 12, 13, 14, 15, 16, 17, 18, 19 );

    log( '- enable qroll, set rollback limit, build a custom qroll array.' );

    t.rlim = 10;
    t.rpos = 1;
    t.qroll = [ 'a', 'b', 'c', 'd', 'e', 'f' ];
    t.roll = true;

    log( '- queue status:', inspect ( t ) );

    log( '- pop %d elements to build rollback queue.', 6 );

    popped = t.pop( 6 );

    log( '- popped: %s.', inspect( popped ) );

    expected = [  'c', 'd', 'e', 'f', 1, 2, 3, 4, 11, 12 ];

    log( '- check qroll, expected: %s.', inspect( expected ) );

    assert.deepEqual( t.qroll, expected, 'got: ' + inspect( t.qroll ) );

    log( '\n- fill queue with elements, build a custom qhead array.' );

    t.flush();

    t.push( 0, 1, 2, 3, 4 );
    t.shift();
    t.push( 11, 12, 13, 14, 15, 16, 17, 18, 19 );

    log( '- enable qroll, set rollback limit, build a custom qroll array.' );

    t.rlim = 10;
    t.rpos = 1;
    t.qroll = [ 'a', 'b', 'c', 'd', 'e', 'f' ];
    t.roll = true;

    log( '- queue status:', inspect ( t ) );

    log( '- pop all qhead elements (%d).', inspect( t.qhead.length ) );

    popped = t.pop( 4 );

    log( '- popped: %s.', inspect( popped ) );

    log( '- pop sime qtail elements (%d).', inspect( 3 ) );

    popped = t.pop( 3 );

    log( '- popped: %s.', inspect( popped ) );

    expected = [  'd', 'e', 'f', 1, 2, 3, 4, 11, 12, 13 ];

    log( '- check qroll, expected: %s.', inspect( expected ) );

    assert.deepEqual( t.qroll, expected, 'got: ' + inspect( t.qroll ) );

    exit();
};