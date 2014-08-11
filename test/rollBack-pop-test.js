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
        , qhead = t.qhead
        , qtail = t.qtail
        , qroll = null
        , a = []
        , l = 16
        , i = l
        , hlen = l >> 1
        , tlen =  l + 1 - hlen
        , offset = hlen >> 1
        , exit = typeof done === 'function' ? done : function () {}
        ;

    // fill array with l + 1 values 
    for ( ; ~i; a[ i ] = i-- );

    // build queue
    qhead.push.apply( qhead, a.slice( 0, hlen ) );
    qtail.push.apply( qtail, a.slice( hlen ) );

    log( '- queue filled with %d items. %d in t.qhead, %d in t.qtail.', a.length, hlen, a.length - hlen );

    // move head position
    t.hpos = offset;

    log( '- moved head position to index %d.', offset );

    t.rollUp();

    log( '- #rollUp started, check roll property, should be true.' );
    assert.equal( t.roll, true );

    // pop and move head position to the end
    log( t.pop( offset ), t );

    log( '- pop %d items reaching the end of t.qhead, then perform another pop(%d).', offset, offset );

    // ( hlen === 0 ) && ! qroll.length
    t.pop( offset );

    log( '- check items in the roll queue.' );

    // check qroll result
    assert.deepEqual( t.qroll, a.slice( offset, offset * 3 ) );

    log( '- pop %d items reaching the end of t.qhead, then perform a single pop.', offset );

    // pop and move head position to the end
    t.pop( t.qhead.length );

    // ( hlen === 0 ) && qroll.length
    t.pop();

    log( '- check items in the roll queue.' );

    // check qroll result
    assert.deepEqual( t.qroll, a.slice( offset ) );

    log( '- now #rollBack(true), check if roll is enabled.' );
    // roll back and re-enable roll
    t.rollBack( true );

    assert.equal( t.roll, true );

    log( '- check %d items in qhead.', t.qhead.length );
    assert.deepEqual( t.qhead, a.slice( offset ) );

    log( '- fill tail with %d elements.', offset );
    t.qtail.push.apply( t.qtail, a.slice( 0, offset ) );

    // l > hlen && ! qroll.length
    // pop qhead.length + 2 elements
    log( '- pop(%d) (qhead.length + 2) elements from qhead.', t.qhead.length + 2 );
    t.pop( t.qhead.length + 2 );

    log( '- check qhead and qroll lengths, should be %d and %d.', offset -2, a.length - offset + 2 );
    assert.equal( t.qhead.length, offset - 2 );
    assert.equal( t.qroll.length, a.length - offset + 2 );

    log( '- deep check %d qroll items.', t.qroll.length );
    assert.deepEqual( t.qroll, a.slice( offset ).concat( a.slice( 0, offset - 2 ) ) );

    // l <= hlen
    log( '- pop(%d) (qhead.length) elements.', t.qhead.length );
    t.pop( t.qhead.length );

    log( '- now #rollBack().' );
    t.rollBack();

    log( '- check qhead length after rollback, should be %d.', a.length );
    assert.equal( t.qhead.length, a.length );

    log( '- deep check qhead items after rollback.' );
    assert.deepEqual( t.qhead, a.slice( offset ).concat( a.slice( 0, offset ) ) );

    log( '- fill tail with %d elements.', offset );
    t.qtail.push.apply( t.qtail, a.slice( 0, offset ) );

    log( '- re-enable roll with #rollUp()' );
    t.rollUp();

    // l > hlen && ! qroll.length
    log( '- pop qhead.length + 1 (%d) elements from qhead.', t.qhead.length + 1 );
    t.pop( t.qhead.length + 1 );

    // l > hlen && qroll.length
    log( '- pop qhead.length + 1 (%d) elements from qhead.', t.qhead.length + 1 );
    t.pop( t.qhead.length + 1 );

    log( '- now #rollBack().' );
    t.rollBack();

    log( '- deep check %d qhead items.', t.qhead.length );
    assert.deepEqual( t.qhead, a.slice( offset ).concat( a.slice( 0, offset ) ).concat( a.slice( 0, offset ) ) );

    exit();
};