const http = require( 'http' );
const fs = require( 'fs' );
const path = require( 'path' );
const url = require( 'url' );

function serveFolder( objectPath, req, res ) {
    const { pathname } = url.parse( req.url, true );

    fs.readdir( objectPath, { encoding: 'utf-8' }, ( err, objectNames ) => {
        if( err ) {
            res.statusCode = 404;
            return res.end( 'Folder is not present or you do not have permissions for accessing it' );
        }

        // construct HTML with a list of links to files and folders
        const html = `
            <!doctype html>
            <html>
                <head>
                    <title>${pathname}</title>
                </head>
                <body>
                    <ul>
                        <li><a href=".." style="text-decoration: none;">..</a></li>
                        ${
                            objectNames.map(
                                object => {
                                    const fullPath = path.join( pathname, object );

                                    return `
                                        <li>
                                            <a href="${fullPath}">${object}</a>
                                        </li>
                                    `;
                                }
                            ).join( '' )
                        }
                    </ul>
                </body>
            </html>
        `.replace( /[\n]/g, '' );

        // serve the HTML
        res.setHeader( 'Content-Type', 'text/html' );
        res.end( html );
    });
}

function serveFile( path, req, res ) {
    fs.readFile( path, { encoding: 'utf-8' }, ( err, contents ) => {
        if( err ) {
            res.statusCode = 404;
            return res.end( 'File is not present or you do not have permissions for accessing it' );
        }

        res.end( contents );
    });
}

const server = http.createServer(( req, res ) => {
    const { pathname } = url.parse( req.url, true );
    const objectPath = path.join( process.cwd(), pathname );

    fs.lstat( objectPath, ( err, stats ) => {
        if( err ) {
            res.statusCode = 404;
            return res.end( 'File or folder is not present or you do not have permissions for accessing it' );
        }

        if( stats.isFile() ) {
            serveFile( objectPath, req, res );
        } else {
            serveFolder( objectPath, req, res );
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen( PORT );