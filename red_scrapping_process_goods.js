/**
 * Created by B2LiNK on 2016-11-04.
 */
var exec  = require( 'child_process' ).exec;
var spawn = require( 'child_process' ).spawn;
var path  = require( 'path' );


//ls.stdout.on('data', function (data) {
//    console.log('stdout: ' + data);
//});
//
//ls.stderr.on('data', function (data) {
//    console.log('stderr: ' + data);
//});
//
//ls.on('exit', function (code) {
//    console.log('child process exited with code ' + code);
//});




var process1 = function () {
    return new Promise( function ( resolve ) {
        var argv =  process.argv;
        console.log(argv)
        console.log(argv.shift());
        console.log(argv.shift());
        console.log(argv)
        var redCrw    = spawn(process.execPath,  ["red_goods_data__downlogd_to_json.js", argv[0]], {
            cwd: process.cwd(),
            env: process.env,
            detached: true
        });
        redCrw.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });
    
        redCrw.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });
    
        redCrw.on('exit', function (code) {
            console.log('child process exited with code ' + code);
            resolve();
        });
        
        /*
        var redCrw    = 'node redCrw.js';
        var parentDir = path.join( process.cwd() );
        exec( redCrw, { cwd : parentDir }, function ( err, stdout, stderr ) {
        if ( err ) {
        console.log( err )
        }
        console.log( stdout );
        resolve();
        } );
        */
        
    } );
};


var process2 = function () {
    return new Promise( function ( resolve ) {
        var argv =  process.argv;
        var redCrw    = spawn(process.execPath,  ["red_goods_data__insert_db.js", argv], {
            cwd: process.cwd(),
            env: process.env,
            detached: true
        });
    
        redCrw.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });
        
        redCrw.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });
    
        redCrw.on('exit', function (code) {
            console.log('child process exited with code ' + code);
            resolve("goodsProcess__Done");
        });
        
        /*
        var redCrw    = 'node insertRedData.js';
        var parentDir = path.join( process.cwd() );
        exec( redCrw, { cwd : parentDir }, function ( err, stdout, stderr ) {
            if ( err ) {
                console.log( err )
            }
            console.log( stdout );
            resolve("goodsProcess__Done");
        } );
         */
    } );
};



var process3 = function () {
    return new Promise( function ( resolve ) {
        var argv =  process.argv;
        var redCrw    = spawn(process.execPath,  ["red_goods_data__insert_list_db.js", argv], {
            cwd: process.cwd(),
            env: process.env,
            detached: true
        });

        redCrw.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        redCrw.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        redCrw.on('exit', function (code) {
            console.log('child process exited with code ' + code);
            resolve("goodsProcess__Done");
        });

        /*
         var redCrw    = 'node insertRedData.js';
         var parentDir = path.join( process.cwd() );
         exec( redCrw, { cwd : parentDir }, function ( err, stdout, stderr ) {
         if ( err ) {
         console.log( err )
         }
         console.log( stdout );
         resolve("goodsProcess__Done");
         } );
         */
    } );
};




var process4 = function () {
    return new Promise( function ( resolve ) {
    
        var argv =  process.argv;
        var redCrw    = spawn(process.execPath,  ["red_goods_detail__download_to_txt.js", argv], {
            cwd: process.cwd(),
            env: process.env,
            detached: true
        });
    
        redCrw.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });
    
        redCrw.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });
    
        redCrw.on('exit', function (code) {
            console.log('child process exited with code ' + code);
            resolve();
        });
        
        /*
        var redCrw    = 'node redCrwPost.js';
        var parentDir = path.join( process.cwd() );
        exec( redCrw, { cwd : parentDir }, function ( err, stdout, stderr ) {
            if ( err ) {
                console.log( err )
            }
            console.log( stdout );
            resolve();
        } );
        */
    } );
};


var process5 = function () {
    return new Promise( function ( resolve ) {
        
        var argv =  process.argv;
        var redCrw    = spawn(process.execPath,  ["red_goods_detail__insert_db.js", argv], {
            cwd: process.cwd(),
            env: process.env,
            detached: true
        });
    
        redCrw.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });
    
        redCrw.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });
    
        redCrw.on('exit', function (code) {
            console.log('child process exited with code ' + code);
            resolve("postProcess__Done");
        });
        
        /*
        var redCrw    = 'node insertRedDataPost.js';
        var parentDir = path.join( process.cwd() );
        exec( redCrw,{maxBuffer: 1024 * 500}, { cwd : parentDir }, function ( err, stdout, stderr ) {
            if ( err ) {
                console.log( err )
            }
            console.log( stdout );
            resolve("postProcess__Done");
        } );
        */
    } );
};



process1()
    .then( process2 )
    .catch( function ( err ) {
        console.log( err )
    } )
    .then( process3 )
    .catch( function ( err ) {
        console.log( err )
    } )
    .then( process4 )
    .catch( function ( err ) {
        console.log( err )
    } )
    .then( process5 )
    .catch( function ( err ) {
        console.log( err )
    } )
    .then( function ( result ) {
        console.log( result )
    } );
