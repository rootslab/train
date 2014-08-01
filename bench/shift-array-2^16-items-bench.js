#!/usr/bin/env node

var log = console.log
     , print = function ( ms, n ) {
        var avg = 1000 * n / ms;
        log( '- total elements: %d.', n );
        log( '- elapsed: %d secs.', ( ms / 1000 ).toFixed( 4 ) );
        log( '- average: %d Mel/sec.', ( avg / 1000 / 1000 ).toFixed( 2 ) );
    }
    , a = []
    , p = 16
    , k = Math.pow( 2, p )
    , i = 0
    , stime = 0
    , etime = 0
    ;

log( '- fill Array with 2^%d items', p );

i = k;

for ( ; i--; ) {
    a.push( 1 );
};

log( '- empty Array with #shift()' );

i = k;

stime = Date.now();

for ( ; i--; ) {
    a.shift();
};

etime = Date.now() - stime;

print( etime, k );