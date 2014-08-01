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
    , stime = 0
    , etime = 0
    ;

log( '- running Train#push( 1 ) 2^%d times', p );

i = k;

stime = Date.now();

for ( ; i--; ) {
    t.push( 1 );
};

etime =  Date.now() - stime;

t.flush();

print( etime, k );

