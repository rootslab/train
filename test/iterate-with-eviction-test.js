var log = console.log
    , assert = require( 'assert' )
    , Train = require( '../' )
    , arr = [ 
        'Cane Nero',
        'Lupus est agnum',
        'Otia et negotia',
        'Cave canem',
        'Omnes feriunt, ultima necat',
        'Mitto tibi navem sine poppa sine prora'
    ]
    , el = null
    , len = 0
    , evict = 0
    , size = 0
    , t = new Train()
    ;

log( '- push 3 elements in the queue.' );
t.push( arr.slice( 0, 3 ), true );

log( '- pop head element from the queue.' );
t.pop();

log( '- push other 3 elements in the queue.' );
t.push( arr.slice( 3 ), true );

size = t.size();
log( '- test iterate parallel and a final callback with some random latency.' )
t.iterate( function ( el, i, done ) {
    // test if elements match with original ones
    setTimeout( function () {
        assert( el, arr[ i + 1 ] );
        log( ' > index %d: %s === %s ', i, el, arr[ i + 1 ] );
        done();
        log( '- check if item was evicted, current length is %d', t.size() );
        assert.equal( size, ++evict + t.size(), 'something goes wrong with xiterate, ' + evict + 'items evicted.' );
    }, 800 * i * Math.random() );
}, t, function ( err ) {
    log( ' > test OK: I\'m the final callback!' );
    assert.ifError( err );
/*
 * pass true as the last parameter, for evicting items on
 * every iteration after that fn has called done().
 */
}, true );