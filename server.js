var express  = require('express'),
    mbtiles  = require('mbtiles'),
    http	 = require('http'),
    tilelive = require('tilelive'),
    app 	 = express();

	require('mbtiles').registerProtocols(tilelive);
	require('sqlite3').verbose();


app.set('port', 7777);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

tilelive.load('mbtiles:///Users/owenlamb/Desktop/meetup_stuff/tile-server/crime.mbtiles', function(err, source) {

    if (err) {
        console.log(`Error loading data ${err}`);
        throw err;
    }

    app.get(/^\/v2\/crime\/(\d+)\/(\d+)\/(\d+).vector.pbf$/, function(req, res){

        var z = req.params[0];
        var x = req.params[1];
        var y = req.params[2];

        console.log('get tile %d, %d, %d', z, x, y);

        source.getTile(z, x, y, function(err, tile, headers) {
            if (err) {
                console.log(err.message);
            } else {
                res.set(headers);
                res.send(tile);
            }
        });
    });


});

tilelive.load('mbtiles:///Users/owenlamb/Desktop/meetup_stuff/tile-server/parcels.mbtiles', function(err, source) {

    if (err) {
        console.log(`Error loading data ${err}`);
        throw err;
    }

    app.get(/^\/v2\/parcels\/(\d+)\/(\d+)\/(\d+).vector.pbf$/, function(req, res){

        var z = req.params[0];
        var x = req.params[1];
        var y = req.params[2];

        console.log('get tile %d, %d, %d', z, x, y);

        source.getTile(z, x, y, function(err, tile, headers) {
            if (err) {
                console.log(err.message);
            } else {
                res.set(headers);
                res.send(tile);
            }
        });
    });
});
