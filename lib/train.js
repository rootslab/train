/*
 * Train, an implementation of a ( FIFO ) Queue data structure.
 * It uses 2 arrays, to simulate and perform fast shift and pop 
 * operations without using the Array#shift() method.
 *
 * Copyright(c) 2013 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

exports.version = require( '../package' ).version;
exports.Train = ( function () {
    var log = console.log
        , isArray = Array.isArray
        // Funny helpers
        , Funny = require( 'funny' )
        , checkArr = Funny.checkArr
        , emptyFn = Funny.emptyFn
        , push = Funny.push
        // Train
        , Train = function ( arr ) {
            var me = this;
            if ( ! ( me instanceof Train ) ) {
                return new Train( arr );
            }
            me.qhead = Funny.checkArr( arr );
            me.qtail = [];
            me.pos = 0;
            // current index of iterator 
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

    tproto.concat = function ( el ) {
        var me = this;
         return ( isArray( el ) ?
                push( me.qtail, el ) :
                me.qtail.push( el ) ) &&
                me;
    };

    tproto.push = function ( el ) {
        var me = this;
        return me.qtail.push( el ) + me.qhead.length - me.pos;
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
            , hlen = me.qhead.length
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
        var me = this;
        return me.get( i % me.size() );
    };

     /*
     * Get the current element through a circular iterator,
     * incrementing internal counter/position by one; optionally,
     * it is possible to specify the next iterator position/index
     * with a number.
     */
    tproto.next = function ( j ) {
        var me = this
            , cpos = me.ipos
            ;
        // set or increment iterator position
        me.ipos = ( ( j >= 0 ) ? j : ( cpos + 1 ) ) % me.size();
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
            , nope = ( typeof fn !== 'function' )
            , emsg = 'Train#forEach: first arg should be a function!'
            ;

        if ( nope ) {
            throw new Error( emsg );
            return me;
        }
        if ( ! qsize ) {
            return me;
        }
        while ( cnt < qsize ) {
            // fn gets 3 args: Object element, Number index, Number qsize 
            fn.call( scope, me.get( cnt ), cnt, qsize );
            cnt++;
        };
        return me;
    };

    tproto.iterate = function ( fn, scope, cback, evict ) {
        var me = this
            , cnt = 0
            , scope = scope || me
            , size = me.size()
            , done = Funny.checkFn( cback )
            , nope = typeof fn !== 'function'
            , emsg = 'Train#iterate: first arg should be a function!'
            ;

        if ( nope ) {
            done( new Error( emsg ) );
            return;
        }
        if ( size ) {
            me.forEach( function ( el, index, qsize ) {
                fn.call( me, el, index, function ( err ) {
                    if ( err ) {
                        done( err, index );
                         // reset done fn
                        done = emptyFn;
                        // no item shift()
                        return;
                    }
                    if ( ++cnt === qsize ) {
                        done( null, qsize );
                    }
                    if ( evict ) {
                        me.shift();
                    }
                } );
            }, me );
        } else {
            done( null, 0 );
        }
        return me;
    };

    return Train;
} )();