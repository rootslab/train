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
    size = 0,
    i = 0,
    t = new Train();

log( '- push an array of 6 elements to queue, then call next() itertator without arguments.' );
t.push( arr, true );
el = t.next();

log( '- test if get(0) returns the head element.' );
assert.equal( el, t.get( 0 ) );

log( '- test if the next(0) returns the queue head element.' );
assert.equal( t.next( 0 ), t.get( 0 ) );

log( '- test if the next(2) returns the third element.' );
assert.equal( t.next( 2 ), t.get( 2 ) );

log( '- test if the next(14) returns the third element.' );
assert.equal( t.next( 14 ), t.get( 2 ) );

log( '- test next() circular behaviour.' );
el = t.next( 0 );
i = 0;
size = t.size();

while ( true ) {
    log( ' > index %d: %s === %s ', i, el, t.get( i ) );
    assert.equal( el, t.get( i ) );
    el = t.next();
    i = ++i % size;

    if ( i === 0 ) {
        /*
         * test if the iterator points to the head element.
         * after the last next() call.
         */
        log( ' > index %d: %s === %s ', i, el, t.get( i ) );
        assert.equal( el, t.get( i ) );
        break;
    }
}
assert.equal( el, t.get( 0 ) );

log( '- check next(3) reply.' );
el = t.next( 3 );
assert.equal( el, arr[ 3 ] );

log( '- check if next() returns correct successor after pop/shift operation.' );
// same as shift
t.pop();
assert.equal( t.next(), arr[ 4 ] );

log( '- check internal iterator index when next() reaches last position, should be 0' );
el = t.next( 4 );
assert.equal( t.ipos, 0 );

log( '- check next() correct position after pop() multiple elements.' );
t.push( [ 'Hic et Nunc', 'Odi et Amo', 'Carpe Diem', 'Alea Iacta Est' ] , true );
t.next( 7 )
t.pop( 6 );
t.next();
assert.ok( 'Odi et Amo', t.next(), 'something goes wrong with next() iterator!' );


