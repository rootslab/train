/*
 * Train, an implementation of a ( FIFO ) Queue data structure.
 * It uses 2 arrays, to simulate and perform a fast element shift/pop operation 
 * on its head, without using the Array#shift() method.
 *
 * Copyright(c) 2013 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

exports.version = require( '../package' ).version;
exports.Train = ( function () {
    // 'use strict';
    var log = console.log
        , emptyFn = function () {}
        , Train = function ( arr ) {
            var me = this;
            if ( ! ( me instanceof Train ) ) {
                return new Train( arr );
            }
            me.qhead = Array.isArray( arr ) ? arr : [];
            me.qtail = [];
            me.pos = 0;
            // an iterator counter
            me.ipos = 0;
        }
        , tproto = Train.prototype;

    tproto.shift = function () {
        var me = this
            , qhead = me.qhead
            ;
        /*
         * Decrement the index of iterator position,
         * when the head element is shifted out.
         */
        if ( me.ipos > 0 ) {
            --me.ipos;
        }
        // head array is empty or it is last index position 
        if ( me.pos === qhead.length ) {
            // flush qhead array and reset positions
            qhead.length = me.pos = 0;
            me.qhead = me.qtail;
            me.qtail = qhead;
            return ( me.qhead.length ) ? me.qhead[ me.pos++ ] : undefined; 
        }
        return me.qhead[ me.pos++ ];
    };

    // evict multiple elements from queue
    tproto.pop = function ( k ) {
        var me = this
            , l = ( k ) ? Math.min( k, me.size() ) : 0
            , qhead = me.qhead
            , qtail = me.qtail
            , pos = me.pos
            , hlen = qhead.length - pos
            , tlen =  qtail.length
            , result = null
            , i = 0
            ;

        if ( ! l ) {
            return me.shift();
        }

        // update the iterator position
        me.ipos = Math.max( 0, me.ipos - l );

        if ( hlen === 0 ) {
             me.qhead.length = me.pos = 0;
             return qtail.splice( 0, l );
        } else {
            // hlen > 0
            if ( hlen >= l ) {
                me.pos = 0;
                // cut head from start, then slice out old elements
                return qhead.splice( 0, pos + l ).slice( pos );
            } else {
                // hlen < l, get items from qhead and qtail
                me.qhead = [];
                me.pos = 0;
                return qhead.splice( pos ).concat( qtail.splice( 0, l - hlen ) )
            }
        }
    };

    // NOTE: accessors are very slow, use the size() method
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

    tproto.push = function ( el, concat ) {
        var me = this
            , qhead = me.qhead
            , qtail = me.qtail
            ;

        if ( concat && Array.isArray( el ) ) {
            // push all elements in Array
            return qtail.push.apply( qtail, el ) + qhead.length - me.pos;
        }
        return qtail.push( el ) + qhead.length - me.pos;
    };

    tproto.flush = function () {
        var me = this
            , len = me.length
            ;
        me.qhead.length = me.qtail.length = me.pos = me.ipos = 0;
        return len;
    };

    tproto.get = function ( index ) {
        var me = this
            , qhead = me.qhead
            , hlen = qhead.length
            , i = index || 0
            , j = me.pos + i
            , offset = j - hlen
            ;

        if ( me.pos === hlen ) {
            // flush qhead array and reset positions
            return me.qtail[ i ];
        }
        if ( offset >= 0 ) {
            return me.qtail[ offset ];
        }
        return me.qhead[ j ];
    };

    // circular get 
    tproto.cget = function ( i ) {
        var me = this
            , size = me.size()
            ;
        return me.get( i % size );
    };

     /*
     * Get the current element through a circular iterator,
     * incrementing internal counter/position by one; optionally,
     * it is possible to specify the next iterator position/index
     * with a number.
     */
    tproto.next = function ( j ) {
        var me = this
            , size = me.size()
            , cpos = me.ipos
            ;
        // set or increment the iterator index
        me.ipos = ( ( j >= 0 ) ? j : ( cpos + 1 ) ) % size;
        // return current item
        return me.get( cpos );
    };

    // return current element through the circular iterator
    tproto.curr = function () {
         var me = this;
        return me.get( me.ipos );
    };

    tproto.forEach = function ( fn, scope ) {
        var me = this
            /*
             * Note : size is fixed to the current queue size,
             * then it is possible to push other elements to the tail,
             * these added elements are not affected by iteration.
             */
            , qsize = me.size()
            , cnt = 0
            , scope = scope || me
            ;

        if ( ( ! qsize ) || ( typeof fn !== 'function' ) ) {
            return me;
        }
        while ( cnt < qsize ) {
            // fn will get 3 args: ( Object element, Number index, Number qsize ) 
            fn.call( scope, me.get( cnt ), cnt, qsize );
            cnt++;
        };
        return me;
    };

    tproto.iterate = function ( fn, scope, cback ) {
        var me = this
            , cnt = 0
            , scope = scope || me
            , size = me.size()
            , done = ( typeof cback === 'function' ) ? cback : emptyFn
            ;

        if ( typeof fn === 'function' ) {
            if ( size ) {
                me.forEach( function ( el, index, qsize ) {
                    fn.call( me, el, index, function ( err ) {
                        if ( err ) {
                            done( err, index );
                            done = emptyFn;
                        } else if ( ++cnt === qsize ) {
                            done( null, qsize );
                        }
                    } );
                }, me );
            } else {
                done( null, 0 );
            }
        }
        return me;
    };

    return Train;
} )();