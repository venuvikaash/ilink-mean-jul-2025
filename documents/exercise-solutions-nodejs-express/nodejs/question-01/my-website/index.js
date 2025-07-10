const http = require( 'http' );
const fs = require( 'fs' );
const path = require( 'path' );
const url = require( 'url' );
const querystring = require( 'querystring' );

const server = http.createServer(( req, res ) => {
    let rs;

    const { pathname, query } = url.parse( req.url, true );
    const method = req.method.toUpperCase();

    if( method === 'GET' ) {
        switch( pathname ) {
            case '/':
                rs = fs.createReadStream( path.join( __dirname, 'public', 'index.html' ) );
                res.setHeader( 'Content-Type', 'text/html' );
                rs.pipe( res );
                return;
            case '/contact':
                rs = fs.createReadStream( path.join( __dirname, 'public', 'contact.html' ) );
                res.setHeader( 'Content-Type', 'text/html' );
                rs.pipe( res );
                return;
        }
    }

    if( method === 'POST' ) {
        switch( pathname ) {
            case '/message':
                let data = '';

                req.on( 'data', chunk => data += chunk );
                req.on( 'end', () => {
                    const message = querystring.parse( data );

                    fs.readFile( path.join( __dirname, 'messages.json' ), { encoding: 'utf8' }, ( err, contents ) => {
                        if( err ) {
                            res.statusCode = 500;
                            res.end( `Sorry ${message.name}, there was an error capturing your message` );
                            return;
                        }

                        const messages = JSON.parse( contents );
                        messages.push( message );
                        const contentsUpdated = JSON.stringify( messages, null, 4 );

                        fs.writeFile( path.join( __dirname, 'messages.json' ), contentsUpdated, { encoding: 'utf8' }, err => {
                            if( err ) {
                                res.statusCode = 500;
                                res.end( `Sorry ${message.name}, there was an error capturing your message` );
                                return;
                            }

                            res.setHeader( 'Content-Type', 'text/html' );
                            res.end( `Thanks for your message ${message.name}. I will get back to you shortly. Go <a href="/">home</a>` );
                        });
                    });
                });

                return;
        }
    }

    res.statusCode = 404;
    res.end( `Cannot ${method} ${pathname}` );
});

const PORT = process.env.PORT || 3000;

server.listen( PORT );