//----------------------------------------------------------------------------------------------------;

//	REQUIRE;

//----------------------------------------------------------------------------------------------------;

require( "d:/work/csj_nodejs_common_modules/initialize__redCrawling.js" );

//----------------------------------------------------------------------------------------------------;

//	PACKAGE;

//----------------------------------------------------------------------------------------------------;

global.csj.post_data__insert_db = global.csj.post_data__insert_db || {};

//----------------------------------------------------------------------------------------------------;

//	CLASS - global.csj.scrapping.RedCrw;

//----------------------------------------------------------------------------------------------------;
/**
 * RED 데이터를 Scrapping 하는 객체
 * @class
 * @param {Object} data
 * @author 최석준
 */
global.csj.post_data__insert_db.RedCrw = function ( data ) {
	//----------------------------------------------------------------------------------------------------;
	
	var _this = this;
	
	//----------------------------------------------------------------------------------------------------;
	
	// REQUIRE;
	
	//----------------------------------------------------------------------------------------------------;
	var cheerio     = global.csj.STATIC.NPM_MODULE.cheerio;
	var fs          = global.csj.STATIC.NPM_MODULE.fs;
	var winston     = global.csj.STATIC.NPM_MODULE.winston;
	var mongoose    = global.csj.STATIC.NPM_MODULE.mongoose;
	var fse         = global.csj.STATIC.NPM_MODULE.fse;
	var MongoClient = global.csj.STATIC.NPM_MODULE.mongoDB.MongoClient;
	var assert      = global.csj.STATIC.NPM_MODULE.assert
	
	var _processStatus = {
		dataPath       : '../redCrwData/saveCompleteData/posts_detail/'
		, filesCount   : null
		, dataDateDir  : ''
		, DataResult   : []
		, idx          : 0
		, max_data_num : 0
	};
	
	var url = 'mongodb://localhost/redData';
	//var url = 'mongodb://49.175.149.94:9001/redData';
	
	this.insert_data_max_num = function () {
		return new Promise( function ( resolve, reject ) {
			
			var dataSelect = function ( db, callback ) {
				
				db.collection( 'redpostdetails1' ).find( {}, { _id : 1 }, {
					limit : 1,
					sort  : { _id : -1 }
				} ).toArray( function ( err, docs ) {
					assert.equal( err, null );
					callback( docs );
				} );
			};
			
			MongoClient.connect( url, function ( err, db ) {
				assert.equal( null, err );
				dataSelect( db, function ( cb ) {
					db.close( function () {
						console.log( "dbClose0" )
					} );
					console.log( cb[ 0 ]._id );
					_processStatus.max_data_num = cb[ 0 ]._id + 1;
					
					console.log( "-[S]- readDir" );
					var t      = _processStatus;
					var path_1 = t.dataPath + '/';
					var result = fs.readdirSync( path_1 );
					console.log( "-[E]- readDir" );
					
					resolve( result );
					
				} );
			} );
			
		} )
	};
	
	this.readDir = function ( data ) {
		console.log( data )
		return new Promise( function ( resolve, reject ) {
			console.log( "-[S]- readData_process__0" );
			var t   = _processStatus;
			var r   = t.dataPath;
			var arr = [];
			for ( var i = 0; i < data.length; i++ ) {
				arr.push( r + data[ i ] + "/" );
				t.dataDateDir             = data[ i ];
				_processStatus.filesCount = fs.readdirSync( _processStatus.dataPath + data[ i ] + "/" )
			}
			
			console.log( "-[E]- readData_process__0" );
			resolve( arr );
		} )
	};
	
	this.readData = function ( data ) {
		console.log( "===>",data )
		return new Promise( function ( resolve, reject ) {
			var t     = _processStatus;
			var r     = t.DataResult;
			var date2 = {};
			var date1 = {};
			var contents = {}
			var a1 = [];
			var a2 = [];
			var t1 = 0
			
			var func1 = function(){
				var path     = t.dataPath;
				var data_dir = t.dataDateDir
				var ttt = fs.readdirSync( path + "/" + data_dir + "/" )
				
				if(t1 < ttt.length){
				///console.log(ttt);
				
				//for(var i = 0; i < ttt.length; i++){
				
				
				var text     = fs.readFileSync( path + "/" + data_dir + "/" + t1 + ".txt", 'utf-8' )
				
				contents                        = {};
				contents.relate_goods               = [];
				contents.relate_note                = [];
				contents.contents_goods             = [];
				contents.contents_goods_images_list = [];
				contents.d_reg                      = {};
				contents.d_pub                      = {};
				var $                               = cheerio.load( text );
				var id                              = $( '#xhssharelinkurl' ).text().split( '/' )[ 5 ];
				var relate_goods                    = $( '.goods-list li.item a' );
				var j_goods_desc                    = $( '.j_goods_desc' ).text().trim();
				var note_item_title                 = $( '.item-title' );
				var note_item_contents              = $( '.item-content' );
				var relate_note                     = $( '.note a' );
				var note_actions                    = $( '.note-actions .like-btn span' ).text().replace( /\s/g, '' ).split( '·' )[ 1 ];
				var contents_goods_images_list      = $( '.goods-images-list img' );
				var title                           = $( 'title' ).text();
				
				if ( title == '迷路了吧' || text == 'undefined' ) {
					logger.log( 'error', "error__File : ", t1 + ".txt", " | ", a1.length ,_processStatus.max_data_num)
					//++_processStatus.max_data_num;
					if(a1.length == 100 || t1 == ttt.length - 1 ){
						a2.push(a1)
						a1 = [];
					}
					++t1;
					func1();
				} 
				else 
				{
					var regDate = $( 'time' )[ 0 ].attribs.datetime;
					logger.log( 'info', id, regDate, '===>', t1, " | ", a1.length,_processStatus.max_data_num);
					regDate = regDate.split( ' ' );
					
					for ( var j = 0; j < $( '.item-title' ).length; j++ ) {
						var a = [];
						
						var b = note_item_title[ j ].children[ 0 ].data.replace( /\s/g, '' );
						var c = note_item_contents[ j ].children[ 0 ].data.replace( /\s/g, '' );
						
						var a = [ b, c ];
						
						contents.contents_goods.push( a )
						
					}
					
					for ( var z = 0; z < relate_note.length; z++ ) {
						contents.relate_note[ z ] = relate_note[ z ].attribs.href;
					}
					
					for ( var c = 0; c < contents_goods_images_list.length; c++ ) {
						contents.contents_goods_images_list[ c ] = contents_goods_images_list[ c ].attribs[ 'data-src' ];
					}
					
					if ( relate_goods.length > 0 ) 
					{
						for ( var i = 0; i < relate_goods.length; i++ ) {
							contents.relate_goods[ i ] = relate_goods[ i ].attribs.href;
						}
					}
					else 
					{
						contents.relate_goods = null
					}
					
					contents._id               = _processStatus.max_data_num;
					contents.id                = id;
					contents.j_goods_desc      = j_goods_desc;
					contents.note_actions_like = note_actions;
					date1                      = new Date( regDate );
					date2                      = new Date( Date.now() );
					
					contents.d_reg = {
						y    : parseInt( date1.getFullYear() )
						, m  : parseInt( date1.getMonth() + 1 )
						, d  : parseInt( date1.getDate() )
						, ho : parseInt( date1.getHours() )
						, mi : parseInt( date1.getMinutes() )
						, se : parseInt( date1.getSeconds() )
					};
					
					contents.d_pub = {
						y    : parseInt( date2.getFullYear() )
						, m  : parseInt( date2.getMonth() + 1 )
						, d  : parseInt( date2.getDate() )
						, ho : parseInt( date2.getHours() )
						, mi : parseInt( date2.getMinutes() )
						, se : parseInt( date2.getSeconds() )
					};
					
					contents.brand_count_check = "N"
					//return contents;
					//console.log( contents )
					a1.push( contents );

					if(a1.length == 500 || t1 == ttt.length - 1 ){
						a2.push(a1)
						a1 = [];
					}
					++_processStatus.max_data_num;
					//_this.readData();
					++t1;
					func1()
				}
				}
			}
			func1()
			resolve( a2 )
		} )
	};
	
	this.readData111 = function ( data ) {
		console.log( "===>",data.length )
		return new Promise( function ( resolve, reject ) {
		var t2 = 0;
			var func2 = function(){
			if(t2 < data.length){
				
				var data__insertmany = function ( db,callback ) {
					
					db.collection( 'redpostdetails1' ).insertMany( data[t2], function ( err, docs ) {
						assert.equal( err, null );
						callback( docs );
					} );
				};
				
				MongoClient.connect( url, function ( err, db ) {
					assert.equal( null, err );
					data__insertmany( db, function ( cb ) {
						logger.log( 'info', 'insertDataOK! ---- 1' );
						db.close( function () {
							console.log( "dbClose" )
						} );
						++t2;
						func2()
					} );
				} );
				
			}
					
		}
		func2()
			resolve( "allDone" )
		} )
	};
	
	this.copy_dir = function () {
		return new Promise( function ( resolve, reject ) {
			var t    = _processStatus;
			var data = t.dataDateDir;
			console.log( "-[S]- readData_process__5" );
			var oldPath = "../redCrwData/saveCompleteData/posts_detail/";
			var newPath = "../redCrwData/insertCompleteData/posts_detail/";
			//for ( var i = 0 ; i < data.length ; i++ ) {
			console.log( "-[S]- readData_process__5___" + data + "___" );
			fse.copySync( oldPath + data, newPath + data );
			console.log( "------------------Data_Move_Complete------------------" );
			console.log( "-[E]- readData_process__5___" + data + "___" );
			//}
			console.log( "-[E]- readData_process__5" );
			resolve()
		} )
		
	};
	
	this.remove_dir = function () {
		return new Promise( function ( resolve ) {
			console.log( "-[S]- readData_process__6" );
			var t       = _processStatus;
			var data    = t.dataDateDir;
			var oldPath = "../redCrwData/saveCompleteData/posts_detail/";
			//for ( var i = 0 ; i < data.length ; i++ ) {
			console.log( "-[S]- readData_process__6___" + data + "___" );
			fse.removeSync( oldPath + data );
			console.log( "------------------directory_Delete_Complete------------------" );
			console.log( "-[E]- readData_process__6___" + data + "___" );
			//}
			console.log( "-[E]- readData_process__6" );
			resolve( "------------------data_insertWork_Complete------------------" )
		} )
	};
	
	this.run = function () {
		MongoClient.connect( url, function ( err, db ) {
			assert.equal( null, err );
			_this.insert_data_max_num()
				.then( _this.readDir )
				.catch( function ( err ) {
					console.log( err )
				} )
				.then( _this.readData )
				.catch( function ( err ) {
					console.log( err )
				} )
				.then( _this.readData111 )
				.catch( function ( err ) {
					console.log( err )
				} )
				.then( _this.copy_dir )
				.catch( function ( err ) {
					console.log( err )
				} )
				.then( _this.remove_dir )
				.catch( function ( err ) {
					console.log( err )
				} )
				.then( function ( result ) {
					db.close( function () {
						console.log( "dbClose" )
					} );
					console.log( result )
				} )
				.catch( function ( err ) {
					console.log( err )
				} )
		} )
	}
	
	var folderName = new Date().toFormat( 'YYYYMMDD' );
	var fileName   = new Date().toFormat( 'YYYYMMDDHH24MISS' );
	var fileType   = '.log';
	var path       = './logs/';
	var logType    = { info : 'info', err : 'err' };
	
	var a = fs.existsSync( path + folderName );
	console.log( path + folderName );
	if ( a === false ) fs.mkdir( path + folderName, 0777 );
//logData 생성시 폴더및 파일명 생성;
	
	var logger = new ( winston.Logger )( {
		transports : [
			new ( winston.transports.Console )( {
				name        : 'consoleLog'
				, colorize  : false
				, timestamp : function () {
					return new Date().toFormat( 'YYYY-MM-DD HH24:MI:SS' );
				}
				, json      : false
			} )
			, new ( winston.transports.File )( {
				name        : 'infoLog'
				, level     : 'info'
				, filename  : path + folderName + "/" + fileName + '_' + logType.info + fileType
				, maxsize   : 1000000
				, maxFiles  : 100
				, timestamp : function () {
					return new Date().toFormat( 'YYYY-MM-DD HH24:MI:SS' );
				}
				, json      : false
			} )
			, new ( winston.transports.File )( {
				name        : 'errorLog'
				, level     : 'error'
				, filename  : path + folderName + "/" + fileName + '_' + logType.err + fileType
				, maxsize   : 1000000
				, maxFiles  : 100
				, timestamp : function () {
					return new Date().toFormat( 'YYYY-MM-DD HH24:MI:SS' );
				}
				, json      : false
			} )
		]
	} );
}

var redCrw = new global.csj.post_data__insert_db.RedCrw();
redCrw.run();

