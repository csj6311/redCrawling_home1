//----------------------------------------------------------------------------------------------------;

//	REQUIRE;

//----------------------------------------------------------------------------------------------------;

require( "d:/work/csj_nodejs_common_modules/initialize__redCrawling.js" );

//----------------------------------------------------------------------------------------------------;

//	PACKAGE;

//----------------------------------------------------------------------------------------------------;

global.csj.savePostHtmltoTXT = global.csj.savePostHtmltoTXT || {};

//----------------------------------------------------------------------------------------------------;

//	CLASS - global.csj.scrapping.RedCrw;

//----------------------------------------------------------------------------------------------------;

/**
 * RED 데이터를 Scrapping 하는 객체
 * @class
 * @param {Object} data
 * @author 최석준
 */
global.csj.savePostHtmltoTXT.RedCrw = function ( data ) {
    //----------------------------------------------------------------------------------------------------;
    
    var _this = this;
    
    //----------------------------------------------------------------------------------------------------;
    
    // REQUIRE;
    
    //----------------------------------------------------------------------------------------------------;
    
    var fs       = global.csj.STATIC.NPM_MODULE.fs;
    var winston  = global.csj.STATIC.NPM_MODULE.winston;
    var mongoose = global.csj.STATIC.NPM_MODULE.mongoose;
    var fse      = global.csj.STATIC.NPM_MODULE.fse;
    
    //----------------------------------------------------------------------------------------------------;
    
    // MongoDB Setting;
    
    //----------------------------------------------------------------------------------------------------;
    
    var db = mongoose.connection;
    db.on( 'error', console.error );
    mongoose.connect( 'mongodb://localhost/redData' );
    var Schema          = mongoose.Schema;
    var redPostssSchema = new Schema( {
        user               : {
            image            : String, //프로필이미지
            userid           : String, //아이디
            discoverys_total : Number, //게시물갯수
            likes            : { type : Number, default : 0 },//좋아요수
            nickname         : String,//별명
            id               : String,//아이디
            fans_total       : Number //팔로워수
        },
        title              : { type : String, default : null },//게시글제목
        image              : String,//게시글이미지
        related_goods_name : { type : String, default : null },//게시글관련상품
        likes              : Number,//좋아요수
        id                 : String,//게시글 아이디
        desc               : String,//게시글 짧은설명
        crawlingDate       : Date,//수집날짜
        regDate            : Date,//게시글 등록날짜
        detailYN           : { type : String, default : 'N' },//포스팅상세저장여부 (페이지상세소스 저장시사용)
        published_date     : { type : Date, default : Date.now } //데이터입력 Date
    } );
    
    var RedPosts = mongoose.model( 'redPosts', redPostssSchema );
    
    //----------------------------------------------------------------------------------------------------;
    
    // PACKAGE;
    
    //----------------------------------------------------------------------------------------------------;
    
    // var classes = {
    //     DataProcessorParent : null
    // };
    
    //----------------------------------------------------------------------------------------------------;
    
    // CLASS - DataProcessorParent;
    
    //----------------------------------------------------------------------------------------------------;
    
    // global.DataProcessorParent = function() {
    
    //var _parent = this;
    //-----------------------------------------------------------------------------------------------------------;
    
    //STATIC
    
    //-----------------------------------------------------------------------------------------------------------;
    
    var _processStatus = {
        dataPath : '../redCrwData/saveCompleteData/', type : [ 'goods', 'posts', 'search' ], dataDateDir : []
    };
    
    //-----------------------------------------------------------------------------------------------------------;
    
    //function
    
    //-----------------------------------------------------------------------------------------------------------//
    
    this.readDir = function () {
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readDir" );
            var t      = _processStatus;
            var path_1 = t.dataPath + t.type[ 1 ] + '/';
            var result = fs.readdirSync( path_1 );
            console.log( "-[E]- readDir" );
            resolve( result );
        } )
    };
    
    this.readData_process__0 = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__0" );
            console.log( data )
            var t   = _processStatus;
            var r   = t.dataPath + t.type[ 1 ] + '/';
            var arr = [];
            for ( var i = 0 ; i < data.length ; i++ ) {
                arr.push( r + data[ i ] + "/" );
                t.dataDateDir.push( data[ i ] );
            }
            console.log( "-[E]- readData_process__0" );
            resolve( arr );
        } )
    };
    
    this.readData_process__1 = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            
            console.log( "-[S]- readData_process__1" );
            var c = data;
            var r = [];
            for ( var i = 0 ; i < c.length ; ++i ) {
                r.push( c[ i ] )
            }
            console.log( "-[E]- readData_process__1" );
            console.log( r );
            resolve( r );
        } )
        
    };
    
    this.readData_process__2 = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__2" );
            console.log( data );
            var arr = [];
            for ( var i = 0 ; i < data.length ; i++ ) {
                var r     = fs.readdirSync( data[ i ] );
                var o     = {};
                o.dirPath = data[ i ];
                o.file    = r;
                arr.push( o )
            }
            console.log( "-[E]- readData_process__2" );
            resolve( arr );
            
        } )
        
    };
    
    this.readData_process__2__1 = function ( data ) {
        return new Promise( function ( resolve ) {
            console.log( "-[S]- readData_process__2__1" );
            var arr = [];
            for ( var i = 0 ; i < data.length ; i++ ) {
                for ( var j = 0 ; j < data[ i ].file.length ; j++ ) {
                    arr.push( data[ i ].dirPath + data[ i ].file[ j ] )
                }
            }
            console.log( "-[E]- readData_process__2__1" );
            resolve( arr );
        } )
        
    };
    
    this.readData_process__3 = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__3" );
            var arr = [];
            for ( var i = 0 ; i < data.length ; ++i ) {
                var r = fs.readFileSync( data[ i ] );
                arr.push( JSON.parse( r ) );
            }
            console.log( "-[E]- readData_process__3" );
            resolve( arr );
        } )
        
    };
    
    this.readData_process__4 = function ( data ) {
        
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__4" );
            var t   = _processStatus;
            var arr = [];
            for ( var i = 0 ; i < data.length ; ++i ) {
                
                for ( var j = 0 ; j < data[ i ].length ; ++j ) {
                    var r = data[ i ][ j ];
                    RedPosts.find( { id : r.id }, function ( err, data ) {
                        if (data) {
                            
                            try {
                                var redPosts = new RedPosts( {
                                    user               : {
                                        image            : r.user.image,
                                        userid           : r.user.userid,
                                        discoverys_total : r.user.discoverys_total,
                                        likes            : r.user.likes,
                                        nickname         : r.user.nickname,
                                        id               : r.user.id,
                                        fans_total       : r.user.fans_total
                                    },
                                    title              : r.title,
                                    image              : r.image,
                                    related_goods_name : r.related_goods_name,
                                    likes              : r.likes,
                                    id                 : r.id,
                                    desc               : r.desc,
                                    regDate            : r.regDate,
                                    crawlingDate       : r.crwlingDate
                                } );
                                console.log( "-[S]- dataInsert___" + i + "___" + j );
                                arr.push( redPosts );
                                console.log( "-[E]- dataInsert___" + i + "___" + j );
                            }
                            catch ( exeption ) {
                                console.log( exeption )
                            }
                        }
                        
                    } )
                    
                }
            }
            console.log( "-[E]- readData_process__4" )
            resolve( arr )
        } )
        
    }
    
    this.readData_process__4___1 = function ( data ) {
        console.log("Insert__Data__Count : "+data.length)
        
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__4___1" );
            var arr  = [];
            var arr1 = [];
            
            for ( var z = 0 ; z < data.length ; z++ ) {
                
                arr.push( data[ z ] );
                
                if ( arr.length == 900 || z == data.length - 1 ) {
                    arr1.push( arr );
                    arr = []
                }
            }
            console.log( "-[E]- readData_process__4___1" );
            resolve( arr1 );
        } )
        
    };
    
    this.readData_process__4___2 = function ( data ) {
        
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__4___2" );
            var i = 0;
            
            var insertData = function () {
                if ( i < data.length ) {
                    RedPosts.insertMany( data[ i ], function ( err ) {
                        
                        if ( err ) {
                            console.log( err )
                        }
                        
                        if ( i < data.length ) {
                            console.log( "dataInsertOK --- ", i )
                            ++i;
                            insertData();
                        }
                    } );
                }
                else {
                    console.log( "------------------db_insert_Complete------------------" );
                    resolve();
                }
            };
            insertData();
            
            console.log( "-[E]- readData_process__4___2" )
            
        } )
        
    }
    
    this.readData_process__5 = function () {
        return new Promise( function ( resolve, reject ) {
            var t    = _processStatus;
            var data = t.dataDateDir;
            console.log( "-[S]- readData_process__5" );
            var oldPath = "../redCrwData/saveCompleteData/posts/";
            var newPath = "../redCrwData/insertCompleteData/posts/";
            for ( var i = 0 ; i < data.length ; i++ ) {
                console.log( "-[S]- readData_process__5___" + data[ i ] + "___" );
                fse.copySync( oldPath + data[ i ], newPath + data[ i ] );
                console.log( "------------------Data_Move_Complete------------------" );
                console.log( "-[E]- readData_process__5___" + data[ i ] + "___" );
            }
            console.log( "-[E]- readData_process__5" );
            resolve()
        } )
        
    };
    
    this.readData_process__6 = function () {
        return new Promise( function ( resolve ) {
            console.log( "-[S]- readData_process__6" );
            var t       = _processStatus;
            var data    = t.dataDateDir;
            var oldPath = "../redCrwData/saveCompleteData/posts/";
            for ( var i = 0 ; i < data.length ; i++ ) {
                console.log( "-[S]- readData_process__6___" + data[ i ] + "___" );
                fse.removeSync( oldPath + data[ i ] );
                console.log( "------------------directory_Delete_Complete------------------" );
                console.log( "-[E]- readData_process__6___" + data[ i ] + "___" );
            }
            console.log( "-[E]- readData_process__6" );
            resolve( "------------------data_insertWork_Complete------------------" )
        } )
    };
    
    this.run = function () {
        db.once( 'open', function () {
            console.log( "Connected to mongod server" );
            _this.readDir()
                 .then( _this.readData_process__0 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__1 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__2 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__2__1 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__3 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__4 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__4___1 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__4___2 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__5 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__6 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( function ( result ) {
                     console.log( "-[S]- mongoose.disconnect" );
                     mongoose.disconnect();
                     console.log( "-[E]- mongoose.disconnect" );
                     console.log( result )
                 } )
        } );
    }
    //-----------------------------------------------------------------------------------------------------------;
    
    //LOGIC;
    
    //-----------------------------------------------------------------------------------------------------------;
}

var redCrw = new global.csj.savePostHtmltoTXT.RedCrw();
redCrw.run();
