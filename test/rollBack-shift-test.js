var log = console.log
    , assert = require( 'assert' )
    , Train = require( '../' )
    , t = Train()
    , qhead = t.qhead
    , qtail = t.qtail
    , qroll = null
    , a = []
    , l = 16
    , i = l
    , hlen = l >> 1
    , tlen =  l + 1 - hlen
    , offset = hlen >> 1
    ;

// fill array with l + 1 values 
for ( ; ~i; a[ i ] = i-- );

// build queue
qhead.push.apply( qhead, a.slice( 0, hlen ) );
qtail.push.apply( qtail, a.slice( hlen ) );

// move head position
t.hpos = offset;

// start rollup
t.rollUp();

// check roll property
assert.equal( t.roll, true );

// shift to the end of head array to force internal swapping
i = offset;
for ( ; i < qtail.length; ++i, t.shift() );

// update shortcuts after swapping
qhead = t.qhead;
qtail = t.qtail;
qroll = t.qroll;

// check lengths
assert.equal( qhead.length, tlen );
assert.equal( qtail.length, 0 );
assert.equal( qroll.length, hlen - offset );

// check qhead elements
assert.deepEqual( qhead, a.slice( hlen ) );

// check qroll elements
assert.deepEqual( qroll, a.slice( offset, hlen ) );

// roll position should be 0
assert.equal( t.rpos, 0 );

// re-fill qtail
qtail.push.apply( qtail, a.slice( 0, offset ) );

// shift to the end of head array to force internal swapping
i = 0;
for ( ; i < qhead.length; ++i, t.shift() );

// update shortcuts after swapping
qhead = t.qhead;
qtail = t.qtail;
qroll = t.qroll;

// check lengths
assert.equal( qhead.length, offset );
assert.equal( qtail.length, 0 );
assert.equal( qroll.length, l - offset + 1 );

// check qhead elements
assert.deepEqual( qhead, a.slice( 0, offset ) );

// check qroll elements
assert.deepEqual( qroll, a.slice( offset ) );

// roll position should be 0
assert.equal( t.rpos, 0 );

// shift to a middle position of head array
t.hpos = qhead.length >> 1;

// roll back
t.rollBack();

// update shortcuts after rollback swapping
qhead = t.qhead;
qtail = t.qtail;
qroll = t.qroll;

// check lengths
assert.equal( qtail.length, 0 );
assert.equal( qroll.length, 0 );

assert.equal( t.roll, false );
assert.equal( t.hpos, 0 );

// check qroll elements
assert.deepEqual( qhead, a.slice( offset ).concat( a.slice( 0, offset ) ) );

// check iterator position
assert.equal( t.ipos, a.length - offset );