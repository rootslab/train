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

log( '- queue filled with %d items. %d in t.qhead, %d in t.qtail', a.length, hlen, a.length - hlen );

// move head position
t.hpos = offset;

log( '- moved head position to index %d.', offset );

// start rollup
t.rollUp();

log( '- rollUp started.' );

// check roll property
assert.equal( t.roll, true );

// pop and move head position to the end
t.pop( offset );

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

log( '- rollBack( true ) queue, re-enables roll.' );

// roll back and re-enable roll
t.rollBack( true );

assert.equal( t.roll, true );

log( '- check items in qhead.' );

// check qhead
assert.deepEqual( t.qhead, a.slice( offset ) );

// fill tail with some elements
t.qtail.push.apply( t.qtail, a.slice( 0, offset ) );

// l > hlen && ! qroll.length
// pop qhead.length + 2 elements
t.pop( t.qhead.length + 2 );

// check lengths
assert.equal( t.qhead.length, offset - 2 );
assert.equal( t.qroll.length, a.length - offset + 2 );

// check qroll result
assert.deepEqual( t.qroll, a.slice( offset ).concat( a.slice( 0, offset - 2 ) ) );

// l <= hlen

// pop qhead.length elements
t.pop( t.qhead.length );

// roll back
t.rollBack();

// check length
assert.equal( t.qhead.length, a.length );

// check qroll result
assert.deepEqual( t.qhead, a.slice( offset ).concat( a.slice( 0, offset ) ) );

// fill tail with some elements
t.qtail.push.apply( t.qtail, a.slice( 0, offset ) );

// enable roll
t.rollUp();

// l > hlen && ! qroll.length

// pop qhead.length + 1 elements
t.pop( t.qhead.length + 1 );

// l > hlen && qroll.length

// pop qhead.length + 1 elements
t.pop( t.qhead.length + 1 );

t.rollBack();

// check qroll result
assert.deepEqual( t.qhead, a.slice( offset ).concat( a.slice( 0, offset ) ).concat( a.slice( 0, offset ) ) );