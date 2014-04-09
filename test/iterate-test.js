var log = console.log,
    assert = require( 'assert' ),
    Train = require( '../' ),
    arr = [ 
        'Cane Nero',
        'Lupus est agnum',
        'Otia et negotia',
        'Cave canem',
        'Omnes feriunt, ultima necat',
        'Mitto tibi navem sine poppa sine prora'
    ],
    el = null,
    len = 0,
    t = new Train();

log( '- push 3 elements in the queue.' );
t.push( arr.slice( 0, 3 ), true );

log( '- pop head element from the queue.' );
t.pop();

log( '- push other 3 elements in the queue.' );
t.push( arr.slice( 3 ), true );

log( '- test iterate parallel and a final callback with some random latency.' )
t.iterate( function ( el, i, done ) {
    // test if elements match with original ones
    setTimeout( function () {
        assert( el, arr[ i + 1 ] );
        log( ' > index %d: %s === %s ', i, el, arr[ i + 1 ] );
        done();
    }, 800 * i * Math.random() );
}, t, function ( err ) {
    log( ' > test OK: I\'m the final callback!' );
    assert.ifError( err );
} );