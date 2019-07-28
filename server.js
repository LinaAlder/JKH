function initialization(){
  let express, CORS, bodyParser, pgp, server, db, siteFolder, PORT;
  
  // Requires
  express = require( "express" );
  CORS = require( "cors" );
  bodyParser = require( "body-parser" );
  pgp = require( "pg-promise" )();
  
  // Set variables
  server = express();
  db = pgp( {
    host : "localhost",
    port : 5432,
    database : "JKH",
    user : "JKHUser",
    password : "8ijhgt67ujhgft"
  } );
  siteFolder = "site";
  PORT = 80;
  
  // Routes
  server.use( CORS() );
  server.use( bodyParser() );
  
  server.post( "/getPoints", ( req, res ) => {
    db.any( "select * from points" ).then( data => res.send( JSON.stringify( data ) ) );
  } );
  server.post( "/addNewPoint", ( req, res ) => {
    db.none( "insert into points values( nextval( 'points_seq' ), $1, $2 )", [ req.body.lat, req.body.long ] ).then( () => {
      res.send( "{}" );
    } );
  } );
  server.post( "/deletePoint", ( req, res ) => {
    db.none( "delete from points where id = $1", [ req.body.id ] ).then( () => {
      res.send( "{}" );
    } );
  } );
  server.post( "/addNewStreet", ( req, res ) => {
    db.one( "select id from streets where startpoint = $1 and endpoint = $2", [ req.body.startPoint, req.body.endPoint ] )
      .then()
      .catch( () => {
        db.none( "insert into streets values( nextval( 'streets_seq' ), $1, $2, $3 )", [ req.body.name, req.body.startPoint, req.body.endPoint ] ).then( () => {
          res.send( "{}" );
        } );
      } );
  } );
  server.post( "/deleteStreet", ( req, res ) => {
    db.none( "delete from street where id = $1", [ req.body.id ] ).then( () => {
      res.send( "{}" );
    } );
  } );
  server.post( "/getStreetsCoordinates", ( req, res ) => {
    db.any( "select points0.lat as p0lat, points0.long as p0long, points1.lat as p1lat, points1.long as p1long " +
            "from streets, points as points0, points as points1 " +
            "where streets.startpoint = points0.id and streets.endpoint = points1.id"
    ).then( data => res.send( JSON.stringify( data ) ) );
  } );
  server.post( "/getStreets", ( req, res ) => {
    db.any( "select * from streets order by inprocess" ).then( data => res.send( JSON.stringify( data ) ) );
  } );
  
  server.get( "/*", ( req, res, next ) => {
    next();
  } );
  
  // Settings
  server.use( express.static( siteFolder ) );

  // Run server
  server.listen( PORT, () => {
    console.log( `server listened on port ${PORT}` );
  } );
}

initialization();