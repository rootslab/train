#!/usr/bin/env node

var log = console.log
     , print = function ( ms, n ) {
        var avg = 1000 * n / ms;
        log( '- total elements evicted: %d.', n );
        log( '- elapsed: %d secs.', ( ms / 1000 ).toFixed( 4 ) );
        log( '- average: %d el/sec.', avg.toFixed( 0 ) );
    }
    , Train = require( '../' )
    , t = new Train()
    , p = 24
    , k = Math.pow( 2, p )
    , i = 0
    , result = []
    , stime = 0
    , etime = 0
    ;

log( '- fill Train with 2^%d items', p );

i = k >>> 1;

for ( ; i--; ) {
    t.push( 1 );
};

/*
 * shift out 2 items to force internal switching of
 * Train.qhead with Train.qtail,then push the same
 * number of items to fill qtail, finally set the
 * current qhead index to the middle queue position.
 */
t.pop( 2 );

i = k >>> 1;

for ( ; i--; ) {
    t.push( 1 );
};

t.pos = k >>> 2;

log( '- evicting 2^%d items with %d #shift() from index %d', p - 1, k >>> 1, k >>> 2 );

i = k >>> 1;

stime = Date.now();

for ( ; i--; ) {
    // build an array like with pop()
    result.push( t.shift() );
};

etime = Date.now() - stime;

print( etime, k >>> 1 );