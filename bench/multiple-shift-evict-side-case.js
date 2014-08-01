#!/usr/bin/env node

var log = console.log
     , print = function ( ms, n ) {
        var avg = 1000 * n / ms;
        log( '- total elements: %d.', n );
        log( '- elapsed: %d secs.', ms / 1000 );
        log( '- average: %d Mel/sec.', ( avg / 1000 / 1000 ).toFixed( 2 ) );
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

i = k;

for ( ; i--; ) {
    t.push( 1 );
};

log( '- evicting %d items with multiple #shift()', k );

t.qhead.push( 1 );

i = k;

stime = Date.now();

for ( ; i--; ) {
    result.push( t.shift() );
};

etime = Date.now() - stime;

print( etime, k );