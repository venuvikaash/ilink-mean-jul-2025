/**
 * NOTE: get() and set() do not support getting/setting nested properties in JSON (operations on only the top-level properties supported)
 */
const fs = require( 'fs' );

function get( key, file, cb ) {
    if( typeof key !== 'string' ) {
        return cb( new Error( 'key is not a string' ) );
    }

    if( typeof cb !== 'function' ) {
        return cb( new Error( 'callback is not a function' ) );
    }

    fs.readFile( file, { encoding: 'utf-8' }, ( err, contents ) => {
        if( err ) {
            return cb( err );
        }

        try {
            const properties = JSON.parse( contents );
            return cb( null, properties[key] );
        } catch( err ) {
            return cb( err );
        }
    });
}

// BUGGY: This is a very rudimentary implementation - a real implementation would need to lock the file till the writing is completed (alternatively sync methods may be used)
function set( key, value, file, cb ) {
    if( typeof key !== 'string' ) {
        return cb( new Error( 'key is not a string' ) );
    }

    if( typeof cb !== 'function' ) {
        return cb( new Error( 'callback is not a function' ) );
    }

    fs.readFile( file, { encoding: 'utf-8' }, ( err, contents ) => {
        if( err ) {
            return cb( err );
        }

        try {
            const properties = JSON.parse( contents );
            properties[key] = value;
            const contentsUpdated = JSON.stringify( properties, null, 4 );

            fs.writeFile( file, contentsUpdated, { encoding: 'utf-8' }, err => {
                if( err ) {
                    return cb( err );
                }

                cb( null );
            });
        } catch( err ) {
            return cb( err );
        }
    });
}

// value should be a primitive for equality check to work - you may modify this function to accept a comparator function instead, and have it work in a general case
function find( key, value, file, cb ) {
    if( typeof key !== 'string' ) {
        return cb( new Error( 'key is not a string' ) );
    }

    if( typeof cb !== 'function' ) {
        return cb( new Error( 'callback is not a function' ) );
    }

    fs.readFile( file, { encoding: 'utf-8' }, ( err, contents ) => {
        if( err ) {
            return cb( err );
        }

        try {
            const items = JSON.parse( contents );
            
            if( !( items instanceof Array ) ) {
                return cb( new Error( 'file does not contain an array' ) );
            }

            cb( null, items.find( item => item[key] === value ) );
        } catch( err ) {
            return cb( err );
        }
    });
}

// BUGGY: This is a very rudimentary implementation - a real implementation would need to lock the file till the writing is completed (alternatively sync methods may be used)
function add( item, file, cb ) {
    if( item === null || typeof item !== 'object' ) {
        return cb( new Error( 'item is not an object' ) );
    }

    if( typeof cb !== 'function' ) {
        return cb( new Error( 'callback is not a function' ) );
    }

    fs.readFile( file, { encoding: 'utf-8' }, ( err, contents ) => {
        if( err ) {
            return cb( err );
        }

        try {
            const items = JSON.parse( contents );
            
            if( !( items instanceof Array ) ) {
                return cb( new Error( 'file does not contain an array' ) );
            }

            items.push( item );

            const contentsUpdated = JSON.stringify( items, null, 4 );

            fs.writeFile( file, contentsUpdated, { encoding: 'utf-8' }, err => {
                if( err ) {
                    return cb( err );
                }

                cb( null );
            });
        } catch( err ) {
            return cb( err );
        }
    });
}

// value should be a primitive for equality check to work - you may modify this function to accept a comparator function instead, and have it work in a general case
// BUGGY: This is a very rudimentary implementation - a real implementation would need to lock the file till the writing is completed (alternatively sync methods may be used)
function update( key, value, item, file, cb ) {
    if( typeof key !== 'string' ) {
        return cb( new Error( 'key is not a string' ) );
    }

    if( item === null || typeof item !== 'object' ) {
        return cb( new Error( 'item is not an object' ) );
    }

    if( typeof cb !== 'function' ) {
        return cb( new Error( 'callback is not a function' ) );
    }

    fs.readFile( file, { encoding: 'utf-8' }, ( err, contents ) => {
        if( err ) {
            return cb( err );
        }

        try {
            const items = JSON.parse( contents );
            
            if( !( items instanceof Array ) ) {
                return cb( new Error( 'file does not contain an array' ) );
            }

            const idx = items.findIndex( item => item[key] === value );

            if( idx === -1 ) {
                return cb( new Error( 'no match for provided key and value' ) );
            }

            items[idx] = Object.assign( {}, items[idx], item );

            const contentsUpdated = JSON.stringify( items, null, 4 );

            fs.writeFile( file, contentsUpdated, { encoding: 'utf-8' }, err => {
                if( err ) {
                    return cb( err );
                }

                cb( null );
            });
        } catch( err ) {
            return cb( err );
        }
    });
}

// value should be a primitive for equality check to work - you may modify this function to accept a comparator function instead, and have it work in a general case
// BUGGY: This is a very rudimentary implementation - a real implementation would need to lock the file till the writing is completed (alternatively sync methods may be used)
function remove( key, value, file, cb ) {
    if( typeof key !== 'string' ) {
        return cb( new Error( 'key is not a string' ) );
    }

    if( typeof cb !== 'function' ) {
        return cb( new Error( 'callback is not a function' ) );
    }

    fs.readFile( file, { encoding: 'utf-8' }, ( err, contents ) => {
        if( err ) {
            return cb( err );
        }

        try {
            const items = JSON.parse( contents );
            
            if( !( items instanceof Array ) ) {
                return cb( new Error( 'file does not contain an array' ) );
            }

            const idx = items.findIndex( item => item[key] === value );

            if( idx === -1 ) {
                return cb( new Error( 'no match for provided key and value' ) );
            }

            items.splice( idx, 1 );

            const contentsUpdated = JSON.stringify( items, null, 4 );

            fs.writeFile( file, contentsUpdated, { encoding: 'utf-8' }, err => {
                if( err ) {
                    return cb( err );
                }

                cb( null );
            });
        } catch( err ) {
            return cb( err );
        }
    });
}

module.exports = {
    get,
    set,
    find,
    add,
    update,
    remove
};