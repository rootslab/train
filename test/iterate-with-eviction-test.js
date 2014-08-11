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
        , evict = 0
        , size = 0
        , t = new Train()
        , exit = typeof done === 'function' ? done : function () {}
        ;

    log( '- push 3 elements in the queue.' );
    t.concat( arr.slice( 0, 3 ) );

    log( '- pop head element from the queue.' );
    t.pop();

    log( '- push other 3 elements in the queue.' );
    t.concat( arr.slice( 3 ) );

    size = t.size();
    log( '- test iterate parallel and a final callback with some random latency.' )

    t.iterate( function ( el, i, next ) {
        var wait = Math.ceil( 2000 * i * Math.random() )
            ;
        // test if elements match with original ones
        setTimeout( function () {
            log( ' > index %d: %s === %s ', i, el, arr[ i + 1 ] );
            ++evict;
            next();
        }, wait );
    }, t, function ( err ) {
        log( ' > test OK: I\'m the final callback!' );
        assert.ifError( err );
        assert.equal( evict, size, 'something goes wrong with iterate, ' + evict + ' item(s) evicted.' );
        assert.equal( 0, t.size(), 'something goes wrong with iterate, ' + evict + ' item(s) evicted.' );
        exit();
    /*
     * pass true as the last parameter, for evicting all item,
     * after that the last fn has called done().
     */
    }, true );

};