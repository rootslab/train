#!/usr/bin/env node
exports.test = function ( done ) {
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
        , size = 0
        , i = 0
        , t = new Train()
        , exit = typeof done === 'function' ? done : function () {}
        ;

    log( '- push %d elements.', arr.length );
    t.concat( arr );

    log( '- call next() and check current result.' );
    el = t.next();
    assert.equal( el, t.get( 0 ) );

    log( '- call next(2) and check current result.' );
    assert.equal( t.next( 2 ), t.get( 1 ) );

    log( '- check current iterator position.' );
    assert.equal( t.ipos, 2 );

    log( '- check current result.' );
    assert.equal( t.next(), t.get( 2 ) );

    log( '- test if the next(%d) returns item at index %d.', 16, ( 14 + 2 ) % 6 );
    t.next( 16 );
    assert.equal( t.next(), t.get( 16 % 6 ) );


    log( '- test next() circular behaviour.' );
    t.ipos = 0;
    el = t.next();
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
            log( ' >> index %d: %s === %s ', i, el, t.get( i ) );
            assert.equal( el, t.get( i ) );
            break;
        }
    }
    assert.equal( el, t.get( 0 ) );

    log( '- check next() result after a shift().' );
    t.shift();
    assert.equal( t.next(), arr[ 1 ] );

    log( '- check iterator when it reaches the last position, should be 0' );
    t.next( 5 );
    assert.equal( t.ipos, 0 );

    log( '- check next() result after pop() multiple elements.' );
    t.concat( [ 'I', 'II', 'III', 'IV', 'V' ], true );
    t.next( 5 );
    t.pop( 3 );
    assert.equal( t.ipos, 2 );
    assert.equal( t.curr(), t.get( 2 ) );

    exit();
};
