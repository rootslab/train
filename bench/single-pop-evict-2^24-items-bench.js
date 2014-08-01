#!/usr/bin/env node

var log = console.log
     , print = function ( ms, n ) {
        var avg = 1000 * n / ms;
        log( '- total elements: %d.', n );
        log( '- elapsed: %d secs.', ( ms / 1000 ).toFixed( 4 ) );
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

log( '- evicting 2^%d items with single #pop() from index %d', p, 0 );

i = k;

stime = Date.now();

t.pop( k );

etime = Date.now() - stime;

print( etime, k );