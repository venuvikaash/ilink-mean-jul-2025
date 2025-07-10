const path = require( 'path' );
const url = require( 'url' );
const fs = require( 'fs' );
const express = require( 'express' );

const chalk = require( 'chalk' );
const error = ( ...args ) => console.log( chalk.bold.red( ...args ) );
const success = ( ...args ) => console.log( chalk.green( ...args ) );
const info = ( ...args ) => console.log( chalk.yellow( ...args ) );

const app = express();

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' );

// handle serving files
app.use( express.static( process.cwd(), { index : false } ) );

function serveFolder( objectPath, req, res ) {
    const { pathname } = url.parse( req.url, true );

    fs.readdir( objectPath, { encoding: 'utf-8' }, ( err, objectNames ) => {
        if( err ) {
            return res.status( 404 ).send( 'Folder is not present or you do not have permissions for accessing it' );
        }

        // construct HTML with a list of links to files and folders and serve it
        res.render( 'folder', {
            pathname,
            items: objectNames.map( object => {
                return {
                    object,
                    fullPath: path.join( pathname, object )
                };
            })
        });
    });
}

// handle serving folders (files are served through static file server)
app.get( '*', ( req, res ) => {
    const { pathname } = url.parse( req.url, true );
    const objectPath = path.join( process.cwd(), pathname );

    serveFolder( objectPath, req, res );
});

const PORT = process.env.PORT || 3000;

app.listen( PORT, err => {
    if( err ) {
        return error( err.message );
    }

    success( `Server running on http://localhost:${PORT}/` );
});