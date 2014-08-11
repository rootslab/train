#!/usr/bin/env node
exports.test = function ( done ) {

    var log = console.log
        , assert = require( 'assert' )
        , Train = require( '../' )
        , arr = [ 
            'Cane Nero',
            'Lupus est agnum',
            'Otia et negotia',
            [ 'Cave canem',
              'Omnes feriunt, ultima necat',
              'Mitto tibi navem sine poppa sine prora'
            ]
        ]
        , t = new Train()
        , exit = typeof done === 'function' ? done : function () {}
        ;

    log( '- test #push with 0 arguments, no item should be added.' );
    log( '- check if returned value is %d', 0 );
    assert.equal( t.push(), 0, '#push return value is wrong!' );

    log( '- test #push with multiple arguments: %d', arr.length );
    t.push.apply( t, arr );

    log( '- check resulting queue length: %d', t.length );
    assert.ok( t.length, arr.length, 'queue size value is wrong!' );

    exit();
};