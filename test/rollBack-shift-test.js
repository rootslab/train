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

    t.hpos = offset;

    log( '- moved head position to index %d.', offset );

    t.rollUp();

    log( '- #rollUp started, check roll property, should be %s.', true );
    assert.equal( t.roll, true );

    log( '- %d #shift() to force internal qhead<->qtail swapping.', qtail.length - offset );
    i = offset;
    for ( ; i < qtail.length; ++i, t.shift() );

    // update shortcuts after swapping
    qhead = t.qhead;
    qtail = t.qtail;
    qroll = t.qroll;

    log( '- check qhead qtail and qroll lengths, should be %d, %d, %d.', tlen, 0, hlen - offset );
    assert.equal( qhead.length, tlen );
    assert.equal( qtail.length, 0 );
    assert.equal( qroll.length, hlen - offset );

    log( '- deep check %d qhead elements.', qhead.length );
    assert.deepEqual( qhead, a.slice( hlen ) );

    log( '- deep check %d qroll elements.', qroll.length );
    assert.deepEqual( qroll, a.slice( offset, hlen ) );

    log( '- check roll position, should be %d', 0 );
    assert.equal( t.rpos, 0 );

    log( '- push %d items to qtail', offset );
    qtail.push.apply( qtail, a.slice( 0, offset ) );

    log( '- %d #shift() to force internal qhead<->qtail swapping.', qhead.length );
    i = 0;
    for ( ; i < qhead.length; ++i, t.shift() );

    // update shortcuts after swapping
    qhead = t.qhead;
    qtail = t.qtail;
    qroll = t.qroll;

    log( '- check qhead qtail and qroll lengths, should be %d, %d, %d.', offset, 0, l - offset + 1 );
    assert.equal( qhead.length, offset );
    assert.equal( qtail.length, 0 );
    assert.equal( qroll.length, l - offset + 1 );

    log( '- deep check %d qhead elements.', qhead.length );
    assert.deepEqual( qhead, a.slice( 0, offset ) );

    log( '- deep check %d qroll elements.', qroll.length );
    assert.deepEqual( qroll, a.slice( offset ) );

    log( '- check roll position, should be %d', 0 );
    assert.equal( t.rpos, 0 );

    log( '- %d #shift() to a middle position of head array.', qhead.length >> 1 );
    t.hpos = qhead.length >> 1;

    log( '- now #rollBack().' );
    t.rollBack();

    // update shortcuts after rollback swapping
    qhead = t.qhead;
    qtail = t.qtail;
    qroll = t.qroll;

    log( '- check qtail and qroll lengths, should be %d, %d.', 0, 0 );
    assert.equal( qtail.length, 0 );
    assert.equal( qroll.length, 0 );

    log( '- check roll property, should be %s.', false );
    assert.equal( t.roll, false );
    log( '- check head position, should be %s.', 0 );
    assert.equal( t.hpos, 0 );

    log( '- deep check %d qhead elements.', qhead.length );
    assert.deepEqual( qhead, a.slice( offset ).concat( a.slice( 0, offset ) ) );

    log( '- check the iterator position, should be %d.', a.length - offset );
    assert.equal( t.ipos, a.length - offset );

    exit();
};