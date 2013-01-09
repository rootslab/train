/*
 * The Train module is an implementation of a Queue data structure.
 * It uses 2 arrays, to simulate and perform a fast element shift/pop operation 
 * on its head, without using the Array#shift() method.
 * Copyright(c) 2011 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

exports.version = require( '../package' ).version;
exports.Train = ( function () {
    'use strict';
    var log = console.log,
        Train = function ( arr ) {
            var me = this;
            if ( ! ( me instanceof Train ) ) {
                return new Train( arr );
            }
            me.qhead = Array.prototype.slice.call( arguments );
            me.qtail = [];
            me.pos = 0;
        },
        tproto = Train.prototype;

    tproto.shift = function () {
        var me = this,
            qhead = me.qhead;
        if ( me.pos === qhead.length ) {
            // flush qhead array and reset positions
            qhead.length = me.pos = 0;
            me.qhead = me.qtail;
            me.qtail = qhead;
            return ( me.qhead.length ) ? me.qhead[ me.pos++ ] : undefined; 
        }
        return me.qhead[ me.pos++ ];
    };

    tproto.pop = tproto.shift;

    // NOTE - accessors are very slow, use the size method
    Object.defineProperty( tproto, 'length', {
        get : function () {
            var me = this;
            return me.qhead.length - me.pos + me.qtail.length;
        }
    } );

    tproto.size = function ( el ) {
        var me = this;
        return me.qhead.length - me.pos + me.qtail.length;
    };

    tproto.push = function ( el, slice ) {
        var me = this,
            qhead = me.qhead,
            qtail = me.qtail;
        if ( slice && Array.isArray( el ) ) {
            // push all elements in Array
            return qtail.push.apply( qtail, el ) + qhead.length - me.pos;
        }
        return qtail.push( el ) + qhead.length - me.pos;
    };

    tproto.flush = function () {
        var me = this;
        me.qhead.length = me.qtail.length = me.pos = 0;
    };

    tproto.get = function ( index ) {
        var me = this,
            qhead = me.qhead,
            hlen = qhead.length,
            i = index || 0,
            j = me.pos + i,
            offset = j - hlen;
        if ( me.pos === hlen ) {
            // flush qhead array and reset positions
            return me.qtail[ i ];
        }
        if ( offset >= 0 ) {
            return me.qtail[ offset ];
        }
        return me.qhead[ j ];
    };

    return Train;
} )();