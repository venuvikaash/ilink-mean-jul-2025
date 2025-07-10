/**
 * The methods in jsonUtilties run into synchronization issues when called at the same time. Hence they are being called one after another (a better way to serialize the calls to the methods would be using the async npm package)
 */
const path = require( 'path' );
const jsonUtilities = require( './json-utilities' );

const packageJsonPath = path.join( __dirname, 'package.json' );
const itemsJsonPath = path.join( __dirname, 'items.json' );

get();

function get() {
    // Read ```author``` from package.json
    jsonUtilities.get( 'author', packageJsonPath, ( err, value ) => {
        if( err ) {
            return console.log( err.message );
        }

        console.log( 'The value of author field in package.json is', value );

        set();
    });
}

function set() {
    jsonUtilities.set( 'license', 'GPL-3', packageJsonPath, err => {
        if( err ) {
            return console.log( err.message );
        }

        console.log( 'The license field in package.json has been updated to GPL-3' );

        find();
    });
}

function find() {
    jsonUtilities.find( 'name', 'Jane', itemsJsonPath, ( err, item ) => {
        if( err ) {
            return console.log( err.message );
        }

        console.log( 'Found this match for name: "Jane" in items.json' );
        console.log( item );

        add();
    });
}

function add() {
    jsonUtilities.add( { name: 'David', age: 56 }, itemsJsonPath, ( err, item ) => {
        if( err ) {
            return console.log( err.message );
        }

        console.log( 'Added an item with { name : David, age: 56 } to items.json' );

        update();
    });
}

function update() {
    jsonUtilities.update( 'name', 'John', { name: 'Jonathan', age: 33 }, itemsJsonPath, err => {
        if( err ) {
            return console.log( err.message );
        }

        console.log( 'Updated an item with name: "John" in items.json' );

        remove();
    });
}

function remove() {
    jsonUtilities.remove( 'name', 'Mark', itemsJsonPath, err => {
        if( err ) {
            return console.log( err.message );
        }

        console.log( 'Removed an item with name: "Mark" in items.json' );
    });
}