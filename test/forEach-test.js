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
        , t = new Train()
        , exit = typeof done === 'function' ? done : function () {}
        , cnt = 0
        ;

    log( '- push 3 elements in the queue.' );
    t.concat( arr.slice( 0, 3 ) );

    log( '- pop head element from the queue.' );
    t.pop();

    log( '- push other 3 elements in the queue.' );
    t.concat( arr.slice( 3 ) );

    log( '- test parallel forEach method with some latency.' )
    t.forEach( function ( el, i ) {
        var wait = Math.ceil( 4000 * Math.random() )
            ;
        // test if elements match with original ones
        setTimeout( function () {
            assert( el, arr[ i + 1 ] );
            log( ' > index %d: %s === %s ', i, el, arr[ i + 1 ] );
            if ( ++cnt === t.size() ) exit();
        }, wait );
    } );

};
