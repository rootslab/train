#!/usr/bin/env node
exports.test = function ( done ) {

    var log = console.log
        , assert = require( 'assert' )
        , Train = require( '../' )
        , t1 = new Train()
        , t2 = new Train()
        , t3 = new Train()
        , a = [ 1, 2, 3 ]
        , v = null
        , intruder = { 'an' : 'intruder' }
        , hell = [ 'a', t2, 'b', undefined, NaN, t3, [ '99', 99 ], null, a, intruder ]
        , result = null
        , exit = typeof done === 'function' ? done : function () {}
        ;
    log( '- plug empty queue t1 with 2 empty queues, t2 and t3, using #melt.' );
    log( '- resulting t1 queue should be empty.' );
    t1.melt( [ t2, t3 ] );
    log( t1 )
    assert.ok( t1.length === 0, 'resulting length should be ' + 0 );
    log( '- pushing 1 element to every queue.' );
    t1.push( 1 );
    t2.push( 2 );
    t3.push( 3 );

    log( '- melt t1 with t2 and t3.' );
    t1.melt( [ t2, t3 ] );

    log( '- melted queues t2 and t3 should have length: %d.', 0 );
    assert.ok( t2.length === 0, 'wrong value for t1 length, should be ' + 0 );
    assert.ok( t3.length === 0, 'wrong value for t2 length, should be ' + 0 );

    log( '- resulting t1 should have length: %d.', 3 );
    assert.ok( t1.length === 3, 'wrong value for t1 length, should be ' + 3 );

    log( '- check t1 elements: %j.', t1.qtail );
    assert.deepEqual( t1.qtail, a, 'wrong resulting items for t1 queue, should be ' + a );

    log( '- melt t1 with itself, resulting in the same queue %j.', t1.qtail );
    assert.deepEqual( t1.qtail, a, 'wrong resulting items for t1 queue, should be ' + a );

    log( '- melt t1 with an object ( not Array or Train ): %j.', intruder );
    t1.melt( [ intruder ], true );

    log( '- check if object was added to resulting queue.' );
    assert.deepEqual( t1.get( 3 ), intruder, 'objects intruder was not found!' );

    log( '- add 3 elements to t2 and t3 respectively' );
    t2.push( 22, 222, 2222 );
    t3.push( 33, 333, 3333 );

    log( '- melt t1 with multiple object types, nulls, lists, numbers, hashes.' );
    t1.melt( hell );

    result = [ 1, 2, 3, intruder, 22 , 222, 2222, 33, 333, 3333, '99', 99, 1, 2, 3 ];

    log( '- check if all object were added to queue.' );
    // warning deepEqual bug with NaN
    assert.deepEqual( t1.qtail, result, 'something goes wrong with resulting queue!' );

    exit();
};
