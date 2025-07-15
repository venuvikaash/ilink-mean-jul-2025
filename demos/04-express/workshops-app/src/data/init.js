const mongoose = require( 'mongoose' );

// disallows saving fields not in the schema
mongoose.set('strictQuery', true);
mongoose.set('strict', true);

// { "name" : 1234 -> "name" : "1234" } // we prevent such conversions using code set up below
// prevent casting - Be careful, this affects all String fields globally!
mongoose.Schema.Types.String.cast(v => {
  if (typeof v !== 'string') {
    throw new Error('Value must be a string');
  }
  return v;
});

// import model files here...
require('./models/Workshop');

const connectionStr = process.env.DB_CONNECTION_STRING;

const connect = async () => {
    try {
        await mongoose.connect( connectionStr );
        console.log( 'connected to the db' );
    } catch( error ) {
        console.log( 'unable to connect to the db : ' + error.message );
        process.exit(1);
    }
};

connect();