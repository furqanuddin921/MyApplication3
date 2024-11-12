// Ionic Starter App
var appVersion = 1;
var db  = null;

var StacktraceService = function() {}
StacktraceService.prototype.print = function($window, exception) {
  return $window.printStackTrace({
    e: exception
  });
};

//hardcode
// localStorage.setItem('localStorageTokenBearer', 'JJAgpDsqbtAAXe7joUDkGGf8us6M');
//endharcode

var localStorageTokenBearer = function () {
  return { 'Authorization': 'Bearer '+localStorage.getItem('tokenApiGee')}
}

var localStorageTokenBasic = function () {
  return { 'Authorization': 'Basic YmZpc3JzOkp2dUt6YVoyOVdPTUJ6RmpZS1BvZ3c='}
}

var httpPostOptionBfiSrs = function (urlPOST, jsonBody) {
  console.log("httpPostOptionBfiSrs ::: ", urlPOST, jsonBody);
  return {
    method      : 'POST',
    url         : urlPOST,
    contentType : 'application/json',
    timeout     : 30000,
    data        : JSON.stringify(jsonBody),
    headers     : localStorageTokenBearer()
  }
}

var httpGetOptionBfiSrs = function (urlGet) {
  console.log("httpGetOptionBfiSrs ::: ", urlGet);
  return {
    method    : 'GET',
    url       : urlGet,
    timeout   : 30000,
    headers   : localStorageTokenBearer()
  }
}


angular.module('starter', ['ionic', 'starter.controllers', 'ui.utils.masks', 'starter.services', 'ngCordova','ngAnimate','dcbImgFallback'])

.run(function($ionicPlatform, $http, $window , BFIFINANCE, $PopupUnauthorized) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    // if (window.cordova && window.cordova.plugins.Keyboard) {
    //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    //   cordova.plugins.Keyboard.disableScroll(true);
    // }
    console.log("window.StatusBar 1")
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      console.log("window.StatusBar 2")
      StatusBar.styleDefault();
    }

    if (window.cordova) {
      db = window.sqlitePlugin.openDatabase({name: 'BFIFINANCE.db', location: 'default'});
    } else {
      db = window.openDatabase("BFIFINANCE.db", "1.0", "BFIFINANCE", 1);
    }
    // throw { message: 'error message' };

//    if (window.cordova) {
//      // cordova.firebase.analytics.logEvent("login", {name: "firebase_analytics"});
//      // alert("FIREBASE CHECKED");
//
//      $window['FirebasePlugin'].setScreenName('Bookmarks');
//      window.FirebasePlugin.getToken(function(token) {
//        // save this server-side and use it to push notifications to this device
//        alert("FIREBASE ON");
       // console.log(token);
//      }, function(error) {
//        alert("FIREBASE OFF");
//        console.error(error);
//      });
//    }

    //  // alert("FIREBASE CHECKED");
    //  if (window && window.FirebasePlugin) {
    //    // $window['FirebasePlugin'].setScreenName('Bookmarks');
    //    window.FirebasePlugin.getToken(function(token) {
    //      // save this server-side and use it to push notifications to this device
    //      alert("FIREBASE ON");
         // console.log(token);
    //    }, function(error) {
    //      alert("FIREBASE OFF");
    //      console.error(error);
    //    });
    //  } else {
    //    // alert("FIREBASE UNAVAILABLE");
    //  }

    db.transaction(function(tx) {

        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS agunanentity (id text, name text, code text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS parammotorentity (id text, amountFrom double, amountTo double, idAgunan text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS parammotordetailentity (id text, biayaAdm double, tenor integer, rate text, rateProvisi text, idPinjaman text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS paramhetoentity (id text, name text, idAgunan text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS paramhetocategoryentity (id text, idProperty text, nameProperty text, category text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS paramhetotenorentity (id text, idProperty text, nameProperty text, idCategory text, nameCategory text, tenor integer, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS paramhetodetailentity (id text, idProperty text, nameProperty text, idCategory text, nameCategory text, bungaEfektif text, bungaFlat text, pokokHutang text, provisiAdm text, securityDeposit text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS parammobilentity (id text, carType text, idAgunan text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS parammobilasuransientity (id text, idMobil text, tenor integer, insuranceVal text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS parammobilasuransikendaraanentity (id text, idMobil text, tenor integer, insuranceVal text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS parammobilfidusiaentity (id text, idMobil text, amountTo double, amountFrom double, amountFidusia double, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS parammobilfundingentity (id text, idMobil text, amountTo double, amountFrom double, amountAdmin double, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS parammobilprovisientity (id text, idMobil text, tenorTo integer, tenorFrom integer, rateProvisi text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS parammobilrateentity (id text, idMobil text, tenorTo integer, tenorFrom integer, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS parammobilratedetailentity (id text, idRate text, ageFrom integer, ageTo integer, effRate text, maksLtv text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS paramsertifikatentity (id text, propertyType text, priceAmount double, rateProvisi text, idAgunan text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS paramsertifikattenorentity (id text, idParent text, nameParent text, tenor integer, idSertifikat text, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS paramsertifikatrateentity (id text, idParent text, nameParent text, amountFrom double, amountTo double, rate text, idTenor text, tenor integer, log text)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS parammachineryentity (id text, name text, idAgunan text)'
        );
        //ADD ROWSTATUS column if not exist---------
        checkRowExist('agunanentity');
        checkRowExist('parammotorentity');
        checkRowExist('parammotordetailentity');
        checkRowExist('paramhetoentity');
        checkRowExist('paramhetocategoryentity');
        checkRowExist('paramhetotenorentity');
        checkRowExist('paramhetodetailentity');
        checkRowExist('parammobilentity');
        checkRowExist('parammobilasuransientity');
        checkRowExist('parammobilasuransikendaraanentity');
        checkRowExist('parammobilfidusiaentity');
        checkRowExist('parammobilfundingentity');
        checkRowExist('parammobilprovisientity');
        checkRowExist('parammobilrateentity');
        checkRowExist('parammobilratedetailentity');
        checkRowExist('paramsertifikatentity');
        checkRowExist('paramsertifikattenorentity');
        checkRowExist('paramsertifikatrateentity');

        //ADD LOG column if not exist---------
        checkRowLogExist('agunanentity');
        checkRowLogExist('parammotorentity');
        checkRowLogExist('parammotordetailentity');
        checkRowLogExist('paramhetoentity');
        checkRowLogExist('paramhetocategoryentity');
        checkRowLogExist('paramhetotenorentity');
        checkRowLogExist('paramhetodetailentity');
        checkRowLogExist('parammobilentity');
        checkRowLogExist('parammobilasuransientity');
        checkRowLogExist('parammobilasuransikendaraanentity');
        checkRowLogExist('parammobilfidusiaentity');
        checkRowLogExist('parammobilfundingentity');
        checkRowLogExist('parammobilprovisientity');
        checkRowLogExist('parammobilrateentity');
        checkRowLogExist('parammobilratedetailentity');
        checkRowLogExist('paramsertifikatentity');
        checkRowLogExist('paramsertifikattenorentity');
        checkRowLogExist('paramsertifikatrateentity');
        function checkRowExist(table){
            db.transaction(function(tx){
                tx.executeSql(
                    "select rowstatus from "+table+" LIMIT 1",
                    [],
                    function querySuccess(tx, results){
                        console.log("rowstatus already exist");
                    },
                    function queryFail(err){
                        db.transaction(function(tx){
                            tx.executeSql(
                                'ALTER TABLE '+table+' ADD rowstatus INTEGER NOT NULL DEFAULT 0',
                                [],
                                function querySuccess(tx, results){
                                    console.log("ALTER TABLE rowstatus SUCCESS");
                                },
                                function queryFail(err){
                                    // console.log("ALTER TABLE rowstatus column ERROR : "+err.message+" , code : "+err.code);
                                    // console.log(err);
                                }
                            );
                        });
                    }
                );
            });
        }
        function checkRowLogExist(table){
            db.transaction(function(tx){
                tx.executeSql(
                    "select log from "+table+" LIMIT 1",
                    [],
                    function querySuccess(tx, results){
                        console.log("log already exist");
                    },
                    function queryFail(err){
                        db.transaction(function(tx){
                            tx.executeSql(
                                'ALTER TABLE '+table+' ADD log text',
                                [],
                                function querySuccess(tx, results){
                                    console.log("ALTER TABLE  SUCCESS");
                                },
                                function queryFail(err){
                                    // console.log("ALTER TABLE log column ERROR : "+err.message+" , code : "+err.code);
                                    // console.log(err);
                                }
                            );
                        });
                    }
                );
            });
        }
    },
    function (err) {
        // console.log("ERROR PROCESSING SQL createTable "+err.message);
    },
    function () {
        // console.log("SUCCESS PROCESSING SQL createTable");
    });

    function sqLiteService(){
      $http({
          method    : 'GET',
          url       : kvlUrlFinance+'WebserviceAction?action=webservice-customer',
          headers : localStorageTokenBearer()
      })
      .success(function(result) {
          // console.log("SQL Service");
          // console.log(result);
          if (result.rows.length>0){
              var listAgunan = result.rows[0].listAgunan;
              for (var i=0; i<=listAgunan.length-1; i++){
                  var agunanentity = {
                      id          : listAgunan[i].id,
                      code        : listAgunan[i].code,
                      name        : listAgunan[i].name,
                      log         : listAgunan[i].log,
                      publish     : listAgunan[i].publish,
                      rowstatus   : listAgunan[i].rowstatus
                  }
                  BFIFINANCE.insertAgunan(agunanentity);
              }
              var listParamMotor = result.rows[0].listParamMotor;
              for (var i=0; i<=listParamMotor.length-1; i++){
                  var parammotorentity = {
                      id : listParamMotor[i].id,
                      amountFrom  : listParamMotor[i].amountFrom,
                      amountTo    : listParamMotor[i].amountTo,
                      idAgunan    : listParamMotor[i].idAgunan,
                      log         : listParamMotor[i].log,
                      rowstatus   : listParamMotor[i].rowstatus
                  }
                  BFIFINANCE.insertParamMotor(parammotorentity);
              }
              var listParamMotorDetail = result.rows[0].listParamMotorDetail;
              for (var i=0; i<=listParamMotorDetail.length-1; i++){
                  var parammotordetailentity  = {
                      id          : listParamMotorDetail[i].id,
                      idPinjaman  : listParamMotorDetail[i].idPinjaman,
                      biayaAdm    : listParamMotorDetail[i].biayaAdm,
                      tenor       : listParamMotorDetail[i].tenor,
                      rate        : listParamMotorDetail[i].rate,
                      rateProvisi : listParamMotorDetail[i].rateProvisi,
                      log         : listParamMotorDetail[i].log,
                      rowstatus   : listParamMotorDetail[i].rowstatus
                  }
                  // console.log(parammotordetailentity);
                  BFIFINANCE.insertParamMotorDetail(parammotordetailentity);
              }
          }
      })
  }
  // sqLiteService();
  function insertWebservice(){
      $http({
          method    : 'GET',
          url       : kvlUrlFinance+'WebserviceAction?action=webservice-bfifinance',
          headers : localStorageTokenBearer()
      })
      .success(function(result) {
        localStorage.setItem("webserviceBfifinance", JSON.stringify(result));
          if (result.rows.length > 0) {
            for (var i=0; i<=result.rows.length-1; i++){
              var nameAgunan  = result.rows[i].name;
              var codeAgunan  = result.rows[i].code;
              var logAgunan   = result.rows[i].log;
              var idAgunan    = result.rows[i].id;
              var listTenor   = result.rows[i].tenor;
              var rowstatus   = result.rows[i].rowstatus;
              var agunanentity = {
                  id : idAgunan,
                  code : codeAgunan,
                  name : nameAgunan,
                  log : logAgunan,
                  rowstatus : rowstatus
              }
              BFIFINANCE.insertAgunan(agunanentity);
              if (nameAgunan == "BPKB-Motor"){
                  for (var j=0; j<=listTenor.length-1; j++){
                      var idParam         = listTenor[j].id;
                      var amountFrom      = listTenor[j].amountFrom;
                      var amountTo        = listTenor[j].amountTo;
                      var idAgunan        = listTenor[j].idAgunan;
                      var listTenorDetail = listTenor[j].listTenorDetail;
                      var logTenor        = listTenor[j].log;
                      var rowstatus       = result.rows[j].rowstatus;
                      var parammotorentity = {
                          id          : idParam,
                          amountFrom  : amountFrom,
                          amountTo    : amountTo,
                          idAgunan    : idAgunan,
                          log         : logTenor,
                          rowstatus   : rowstatus
                      }
                      BFIFINANCE.insertParamMotor(parammotorentity);
                      // BFIFINANCE.addParamMotor(parammotorentity);
                      for (var ij=0; ij<=listTenorDetail.length-1; ij++){
                          var idDetailTenor  = listTenorDetail[ij].id;
                          var idPinjaman     = listTenorDetail[ij].idPinjaman;
                          var biayaAdm       = listTenorDetail[ij].biayaAdm;
                          var tenor          = listTenorDetail[ij].tenor;
                          var rate           = listTenorDetail[ij].rate;
                          var rateProvisi    = listTenorDetail[ij].rateProvisi;
                          var logTenorDetail = listTenorDetail[ij].log;
                          var rowstatus      = listTenorDetail[ij].rowstatus;

                          var parammotordetailentity  = {
                              id          : idDetailTenor,
                              idPinjaman  : idPinjaman,
                              biayaAdm    : biayaAdm,
                              tenor       : tenor,
                              rate        : rate,
                              rateProvisi : rateProvisi,
                              log         : logTenorDetail,
                              rowstatus   : rowstatus
                          }
                          BFIFINANCE.insertParamMotorDetail(parammotordetailentity);
                          // BFIFINANCE.addParamMotorDetail(parammotordetailentity);
                      }
                  }
              }
              else if (nameAgunan == "Invoice Alat Berat/BPKB Truk"){
                  for (var j=0; j<=listTenor.length-1; j++){
                      var nameProperty    = listTenor[j].nameProperty;
                      var idProperty      = listTenor[j].id;
                      var rowstatus       = listTenor[j].rowstatus;
                      var paramhetoentity = {
                          id              : idProperty,
                          name            : nameProperty,
                          idAgunan        : listTenor[j].idAgunan,
                          log             : listTenor[j].log,
                          rowstatus       : rowstatus
                      }
                      BFIFINANCE.insertHeto(paramhetoentity);
                      var listProperty = listTenor[j].listProperty;
                      for (var pr=0; pr<=listProperty.length-1; pr++){

                          var idCategory      = listProperty[pr].id;
                          var nameCategory    = listProperty[pr].category;
                          var rowstatus       = listProperty[pr].rowstatus;
                          var paramhetocategoryentity = {
                              id                  : idCategory,
                              category            : nameCategory,
                              idProperty          : listProperty[pr].idProperty,
                              nameProperty        : nameProperty,
                              log                 : listProperty[pr].log,
                              rowstatus           : rowstatus
                          }
                          BFIFINANCE.insertHetoCategory(paramhetocategoryentity);
                          var listPropertyDetail = listProperty[pr].listPropertyDetail;
                          for (var pd=0; pd<=listPropertyDetail.length-1; pd++){
                              var paramhetodetailentity = {
                                  id              : listPropertyDetail[pd].id,
                                  bungaEfektif    : listPropertyDetail[pd].bungaEfektif,
                                  bungaFlat       : listPropertyDetail[pd].bungaFlat,
                                  idProperty      : idProperty,
                                  nameProperty    : nameProperty,
                                  idCategory      : idCategory,
                                  nameCategory    : nameCategory,
                                  pokokHutang     : listPropertyDetail[pd].pokokHutang,
                                  provisiAdm      : listPropertyDetail[pd].provisiAdm,
                                  securityDeposit : listPropertyDetail[pd].securityDeposit,
                                  log             : listPropertyDetail[pd].log,
                                  rowstatus       : listPropertyDetail[pd].rowstatus
                              }
                              BFIFINANCE.insertHetoDetail(paramhetodetailentity);
                          }
                          var listPropertyTenor = listProperty[pr].listPropertyTenor;
                          for (var pt=0; pt<=listPropertyTenor.length-1; pt++){
                              var paramhetotenorentity = {
                                  id              : listPropertyTenor[pt].id,
                                  idProperty      : idProperty,
                                  nameProperty    : nameProperty,
                                  idCategory      : idCategory,
                                  nameCategory    : nameCategory,
                                  tenor           : listPropertyTenor[pt].tenor,
                                  log             : listPropertyTenor[pt].log,
                                  rowstatus       : listPropertyTenor[pt].rowstatus
                              }
                              BFIFINANCE.insertHetoTenor(paramhetotenorentity);
                          }
                      }
                  }
              }
              else if (nameAgunan == "Sertifikat Tanah dan Bangunan"){
                  for (var j=0; j<=listTenor.length-1; j++){
                      var idParent    = listTenor[j].id;
                      var nameParent  = listTenor[j].propertyType;
                      var rowstatus   = listTenor[j].rowstatus;
                      var paramsertifikatentity = {
                          id              : listTenor[j].id,
                          propertyType    : listTenor[j].propertyType,
                          priceAmount     : listTenor[j].priceAmount,
                          rateProvisi     : listTenor[j].rateProvisi,
                          idAgunan        : listTenor[j].idAgunan,
                          log             : listTenor[j].log,
                          rowstatus       : rowstatus
                      }
                      BFIFINANCE.insertParamSertifikat(paramsertifikatentity);
                      // addParamSertifikat(paramsertifikatentity);
                      var listSertifikatTenor = listTenor[j].listSertifikatTenor;
                      for (var st=0; st<= listSertifikatTenor.length-1; st++){
                          var paramsertifikattenorentity = {
                              id            : listSertifikatTenor[st].id,
                              tenor         : listSertifikatTenor[st].tenor,
                              idSertifikat  : listSertifikatTenor[st].idSertifikat,
                              idParent      : idParent,
                              nameParent    : nameParent,
                              log           : listSertifikatTenor[st].log,
                              rowstatus     : listSertifikatTenor[st].rowstatus
                          }
                          BFIFINANCE.insertParamSertifikatTenor(paramsertifikattenorentity);
                          // addParamSertifikatTenor(paramsertifikattenorentity);
                          // BFIFINANCE.addParamSertifikatTenor(paramsertifikattenorentity);
                          var tenorVal = listSertifikatTenor[st].tenor;
                          var listSertifikatRate = listSertifikatTenor[st].listSertifikatRate;
                          for (var sr=0; sr<=listSertifikatRate.length-1; sr++){
                            console.log("Tenor: "+listSertifikatRate[sr].tenor);
                              var paramsertifikatrateentity = {
                                  id : listSertifikatRate[sr].id,
                                  amountFrom : listSertifikatRate[sr].amountFrom,
                                  amountTo : listSertifikatRate[sr].amountTo,
                                  rate : listSertifikatRate[sr].rateSertifikat,
                                  idTenor : listSertifikatRate[sr].idTenor,
                                  tenor : tenorVal,
                                  idParent : idParent,
                                  nameParent : nameParent,
                                  log : listSertifikatRate[sr].log,
                                  rowstatus : listSertifikatRate[sr].rowstatus
                              }
                              BFIFINANCE.insertParamSertifikatRate(paramsertifikatrateentity);
                              // addParamSertifikatRate(paramsertifikatrateentity);
                              // BFIFINANCE.addParamSertifikatRate(paramsertifikatrateentity);
                          }
                      }
                  }
              }
              else if (nameAgunan == "BPKB-Mobil"){

                  for (var k=0; k<=listTenor.length-1; k++){
                      var idParam     = listTenor[k].id;
                      var carType     = listTenor[k].carType;
                      var idAgunan    = listTenor[k].idAgunan;
                      var log         = listTenor[k].log;
                      var rowstatus   = listTenor[k].rowstatus;
                    // addParamMobil(parammobilentity);

                    var listAssJiwa = listTenor[k].listAssJiwa;
                    for (var las=0; las<=listAssJiwa.length-1; las++){
                        var parammobilasuransientity = {
                            id            : listAssJiwa[las].id,
                            idMobil       : listAssJiwa[las].idMobil,
                            tenor         : listAssJiwa[las].tenor,
                            insuranceVal  : listAssJiwa[las].insuranceVal,
                            log           : listAssJiwa[las].log,
                            rowstatus     : listAssJiwa[las].rowstatus
                        }
                        BFIFINANCE.insertParamMobilAsuransi(parammobilasuransientity);
                        // addParamMobilAsuransi(parammobilasuransientity);
                        // BFIFINANCE.addParamMobilAsuransi(parammobilasuransientity);
                    }

                    var listAssKendaraan = listTenor[k].listAssKendaraan;
                    for (var lk=0; lk<=listAssKendaraan.length-1; lk++){
                        var parammobilasuransikendaraanentity = {
                            id            : listAssKendaraan[lk].id,
                            idMobil       : listAssKendaraan[lk].idMobil,
                            tenor         : listAssKendaraan[lk].tenor,
                            insuranceVal  : listAssKendaraan[lk].insuranceVal,
                            log           : listAssKendaraan[lk].log,
                            rowstatus     : listAssKendaraan[lk].rowstatus
                        }
                        BFIFINANCE.insertParamMobilAsuransiKendaraan(parammobilasuransikendaraanentity);
                        // addParamMobilAsuransiKendaraan(parammobilasuransikendaraanentity);
                        // BFIFINANCE.addParamMobilAsuransiKendaraan(parammobilasuransikendaraanentity);
                    }

                    var listFidusiaMobil = listTenor[k].listFidusiaMobil;
                    for (var fd=0; fd<=listFidusiaMobil.length-1; fd++){
                        var parammobilfidusiaentity = {
                            id            : listFidusiaMobil[fd].id,
                            idMobil       : listFidusiaMobil[fd].idMobil,
                            amountFrom    : listFidusiaMobil[fd].amountFrom,
                            amountTo      : listFidusiaMobil[fd].amountTo,
                            amountFidusia : listFidusiaMobil[fd].amountFidusia,
                            log           : listFidusiaMobil[fd].log,
                            rowstatus     : listFidusiaMobil[fd].rowstatus
                        }
                        BFIFINANCE.insertParamMobilFidusia(parammobilfidusiaentity);
                        // addParamMobilFidusia(parammobilfidusiaentity);
                        // BFIFINANCE.addParamMobilFidusia(parammobilfidusiaentity);
                    }

                    var listFundingMobil = listTenor[k].listFundingMobil;
                    for (var fg=0; fg<=listFundingMobil.length-1; fg++){
                        var parammobilfundingaentity = {
                            id            : listFundingMobil[fg].id,
                            idMobil       : listFundingMobil[fg].idMobil,
                            amountFrom    : listFundingMobil[fg].amountFrom,
                            amountTo      : listFundingMobil[fg].amountTo,
                            amountAdmin   : listFundingMobil[fg].amountAdmin,
                            log           : listFundingMobil[fg].log,
                            rowstatus     : listFundingMobil[fg].rowstatus
                        }
                        BFIFINANCE.insertParamMobilFunding(parammobilfundingaentity);
                        // addParamMobilFunding(parammobilfundingaentity);
                        // BFIFINANCE.addParamMobilFunding(parammobilfundingaentity);
                    }

                    var listProvisiMobil = listTenor[k].listProvisiMobil;
                    for (var pv=0; pv<=listProvisiMobil.length-1; pv++){
                        var parammobilprovisientity = {
                            id : listProvisiMobil[pv].id,
                            idMobil : listProvisiMobil[pv].idMobil,
                            tenorFrom : listProvisiMobil[pv].tenorFrom,
                            tenorTo : listProvisiMobil[pv].tenorTo,
                            rateProvisi : listProvisiMobil[pv].rateProvisi,
                            log : listProvisiMobil[pv].log,
                            rowstatus : listProvisiMobil[pv].rowstatus
                        }
                        BFIFINANCE.insertParamMobilProvisi(parammobilprovisientity);
                        // addParamMobilProvisi(parammobilprovisientity);
                        // BFIFINANCE.addParamMobilProvisi(parammobilprovisientity);
                    }

                    var listRateMobil = listTenor[k].listRateMobil;
                    for (var rm=0; rm<=listRateMobil.length-1; rm++){
                        var parammobilrateentity = {
                            id : listRateMobil[rm].id,
                            idMobil : listRateMobil[rm].idMobil,
                            tenorFrom : listRateMobil[rm].tenorForm,
                            tenorTo : listRateMobil[rm].tenorTo,
                            log : listRateMobil[rm].log,
                            rowstatus : listRateMobil[rm].rowstatus
                        }
                        BFIFINANCE.insertParamMobilRate(parammobilrateentity);
                        // console.log(parammobilrateentity);
                        // addParamMobilRate(parammobilrateentity);
                        // BFIFINANCE.addParamMobilRate(parammobilrateentity);

                        var listDetailTenor = listRateMobil[pv].listRateDetailMobil;
                        for (var ld=0; ld<=listDetailTenor.length-1; ld++){
                            var parammobilratedetailentity = {
                                id : listDetailTenor[ld].id,
                                idRate : listDetailTenor[ld].idMobilRate,
                                ageFrom : listDetailTenor[ld].ageFrom,
                                ageTo : listDetailTenor[ld].ageTo,
                                effRate : listDetailTenor[ld].effRate,
                                maksLtv : listDetailTenor[ld].maksLtv,
                                log : listDetailTenor[ld].log,
                                rowstatus : listDetailTenor[ld].rowstatus
                            }
                            BFIFINANCE.insertParamMobilRateDetail(parammobilratedetailentity);
                            // addParamMobilRateDetail(parammobilratedetailentity);
                            // BFIFINANCE.addParamMobilRateDetail(parammobilratedetailentity);
                        }
                    }

                    var parammobilentity = {
                        id          : idParam,
                        carType     : carType,
                        idAgunan    : idAgunan,
                        log         : log,
                        rowstatus   : rowstatus
                    }
                    BFIFINANCE.insertParamMobil(parammobilentity);
                }
              }
            }
          }
      }).error(function(res) {
        $PopupUnauthorized.show();
      });
  }

  var dataTempFinance = localStorage.getItem("webservicebfifinance");
  if(dataTempFinance == null || dataTempFinance != ''){
      insertWebservice();
  }

  });
})
.factory('BFIFINANCE', function($cordovaSQLite, $window, $ionicPlatform, $q, $ionicLoading) {
  var self    = this;

  $ionicPlatform.ready(function() {
      self.loadSQLFirst = function(){
          var q = $q.defer();
          db.transaction(
              function (tx) {
                  tx.executeSql(
                      "SELECT * FROM agunanentity ", [],
                      function (tx, result) {
                          q.resolve(result.rows);
                      }
                  );
              },
              function (err) {
                  // console.log("ERROR PROCESSING SELECT SQL agunanentity "+err.message);
              },
              function () {
                  // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
              }
          );
          return q.promise;
      }

      self.insertAgunan = function(agunanentity){
          db.transaction(
              function (tx) {
                  tx.executeSql(
                      "SELECT * FROM agunanentity WHERE id = (?)", [ agunanentity.id],
                      function (tx, result) {
                          if (result.rows.length>0){
                              if (agunanentity.log != result.rows.item(0).log || agunanentity.rowstatus != result.rows.item(0).rowstatus){
                                  db.transaction(
                                      function (tx) {
                                          tx.executeSql(
                                              "UPDATE agunanentity SET name = ?, code = ?, log = ? , rowstatus = ? WHERE id = ?",
                                              [agunanentity.name, agunanentity.code, agunanentity.log, agunanentity.rowstatus, agunanentity.id]
                                          );
                                      },
                                      function (err) {
                                          console.error("ERROR UPDATE SQL agunanentity ::: "+err.message);
                                      },
                                      function () {
                                          // $ionicLoading.hide();
                                          // console.log("SUCCESS UPDATE UPDATE SQL agunanentity");
                                      }
                                  );
                              }
                          }else{
                              db.transaction(
                                  function (tx) {
                                      tx.executeSql("INSERT INTO agunanentity (id, name, code, log, rowstatus) VALUES (?, ?, ?, ?, ?)",
                                          [agunanentity.id, agunanentity.name, agunanentity.code, agunanentity.log, agunanentity.rowstatus]);
                                  },
                                  function (err) {
                                      console.error("ERROR INSERT INTO agunanentity ::: "+err.message);
                                  },
                                  function () {
                                      $ionicLoading.hide();
                                      // console.log("SUCCESS INSERT INTO agunanentity");
                                  }
                              );
                          }
                      }
                  );
              },
              function (err) {
                // console.log("ERROR PROCESSING SELECT SQL agunanentity : "+err.message);
              },
              function () {
                // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
              }
          );
      }

      self.insertParamMotor = function(parammotorentity){
          db.transaction(
              function (tx) {
                  tx.executeSql(
                      "SELECT * FROM parammotorentity WHERE id = (?)",
                      [parammotorentity.id],
                      function (tx, result) {
                          if (result.rows.length>0){
                              if (parammotorentity.log != result.rows.item(0).log || parammotorentity.rowstatus != result.rows.item(0).rowstatus){
                                  db.transaction(
                                      function (tx) {
                                          tx.executeSql(
                                              "UPDATE parammotorentity SET amountFrom = ?, amountTo = ?, idAgunan = ?, rowstatus = ? WHERE id = ?",
                                              [parammotorentity.amountFrom, parammotorentity.amountTo, parammotorentity.idAgunan, parammotorentity.rowstatus, parammotorentity.id]
                                          );
                                      },
                                      function (err) {
                                          console.error("ERROR UPDATE SQL parammotorentity ::: "+err.message);
                                      },
                                      function () {
                                          // console.log("SUCCESS UPDATE SQL parammotorentity");
                                      }
                                  );
                              }
                          }else{
                              db.transaction(
                                  function (tx) {
                                      tx.executeSql(
                                          "INSERT INTO parammotorentity (id, amountFrom, amountTo, idAgunan, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?)",
                                          [parammotorentity.id, parammotorentity.amountFrom, parammotorentity.amountTo, parammotorentity.idAgunan, parammotorentity.log, parammotorentity.rowstatus]
                                          );
                                  },
                                  function (err) {
                                      console.error("ERROR INSERT SQL parammotorentity ::: "+err.message);
                                  },
                                  function () {
                                      // console.log("SUCCESS INSERT SQL parammotorentity");
                                  }
                              );
                          }
                      }
                  );
              },
              function (err) {
                  console.error("ERROR SELECT SQL parammotorentity ::: "+err.message);
              },
              function () {
                  // console.log("SUCCESS PROCESSING SELECT SQL parammotorentity");
              }
          );
      }

      self.insertParamMotorDetail = function(parammotordetailentity){
        db.transaction( function (tx) {
          tx.executeSql(
            "SELECT * FROM parammotordetailentity WHERE id = (?)", [parammotordetailentity.id],
            function (tx, result) {
              if (result.rows.length>0){
                if (parammotordetailentity.log != result.rows.item(0).log || parammotordetailentity.rowstatus != result.rows.item(0).rowstatus){
                  db.transaction(function (tx) {
                      tx.executeSql("UPDATE parammotordetailentity SET biayaAdm = ?, tenor = ?, rate = ?, rateProvisi = ?, idPinjaman = ?, rowstatus = ? WHERE id = ?",
                            [parammotordetailentity.biayaAdm, parammotordetailentity.tenor, parammotordetailentity.rate, parammotordetailentity.rateProvisi, parammotordetailentity.idPinjaman, parammotordetailentity.rowstatus, parammotordetailentity.id]);
                    },
                    function (err) {
                      console.error("failed UPDATE parammotordetailentity : "+err.message);
                    },
                    function () {
                      // console.log("success UPDATE parammotordetailentity");
                  });
                }
              }else{
                db.transaction(
                  function (tx) {
                    tx.executeSql("INSERT INTO parammotordetailentity (id, biayaAdm, tenor, rate, rateProvisi, idPinjaman, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                          [parammotordetailentity.id, parammotordetailentity.biayaAdm, parammotordetailentity.tenor, parammotordetailentity.rate, parammotordetailentity.rateProvisi, parammotordetailentity.idPinjaman, parammotordetailentity.log, parammotordetailentity.rowstatus]);
                  },
                  function (err) {
                    console.error("failed INSERT parammotordetailentity : "+err.message);
                  },
                  function () {
                    // console.log("success INSERT parammotordetailentity");
                  }
                );
              }
          });
        },
        function (err) {
          // console.log(parammotorentity);
          console.error("failed PROCESSING SELECT SQL parammotordetailentity "+err.message);
        },
        function () {
          // console.log("SUCCESS PROCESSING SELECT SQL parammotordetailentity");
        });
      }

      self.insertHeto = function(paramhetoentity){
        db.transaction(
          function (tx) {
            tx.executeSql( "SELECT * FROM paramhetoentity WHERE id = (?)", [paramhetoentity.id],
              function (tx, result) {
                if (result.rows.length>0){
                  if (paramhetoentity.log != result.rows.item(0).log || paramhetoentity.rowstatus != result.rows.item(0).rowstatus){
                    db.transaction(
                      function (tx) {
                         tx.executeSql("UPDATE paramhetoentity SET name = ?, idAgunan = ?, log = ?, rowstatus = ? WHERE id = ?",
                              [paramhetoentity.name, paramhetoentity.idAgunan, paramhetoentity.log,paramhetoentity.rowstatus, paramhetoentity.id ]);
                      },
                      function (err) {
                        // console.log("failed PROCESSING UPDATE SQL paramhetoentity "+err.message);
                      },
                      function () {
                        // $ionicLoading.hide();
                        // console.log("SUCCESS PROCESSING UPDATE SQL paramhetoentity");
                      }
                    );
                  }

                }else{
                   db.transaction(
                     function (tx) {
                       tx.executeSql("INSERT INTO paramhetoentity (id, name, idAgunan, log, rowstatus) VALUES (?, ?, ?, ?, ?)",
                            [paramhetoentity.id, paramhetoentity.name, paramhetoentity.idAgunan, paramhetoentity.log, paramhetoentity.rowstatus]);
                    },
                    function (err) {
                      console.error("failed PROCESSING SQL paramhetoentity "+err.message);
                    },
                    function () {
                      // console.log("SUCCESS PROCESSING SQL paramhetoentity");
                    }
                  );
                }
              }
            );
          },
            function (err) {
              // console.log(paramhetoentity);
              console.error("failed PROCESSING SELECT SQL paramhetoentity "+err.message);
            },
            function () {
              // console.log("SUCCESS PROCESSING SELECT SQL paramhetoentity");
            }
          );
        }

        self.insertHetoCategory = function(paramhetocategoryentity){
          db.transaction(
          function (tx) {
            tx.executeSql(
              "SELECT * FROM paramhetocategoryentity WHERE id = (?)",
              [paramhetocategoryentity.id],
                  function (tx, result) {

                      if (result.rows.length>0){

                        if (paramhetocategoryentity.log != result.rows.item(0).log || paramhetocategoryentity.rowstatus != result.rows.item(0).rowstatus){
                              db.transaction(
                                function (tx) {
                                   tx.executeSql("UPDATE paramhetocategoryentity SET idProperty = ?, nameProperty = ?, category = ?, log = ?, rowstatus = ? WHERE id = ?",
                                        [paramhetocategoryentity.idProperty, paramhetocategoryentity.nameProperty, paramhetocategoryentity.category, paramhetocategoryentity.log, paramhetocategoryentity.rowstatus, paramhetocategoryentity.id]);
                                },
                                function (err) {
                                  // console.log("ERROR PROCESSING UPDATE SQL paramhetocategoryentity "+err.message);
                                },
                                function () {
                                  // $ionicLoading.hide();
                                  // console.log("SUCCESS PROCESSING UPDATE SQL paramhetocategoryentity");
                                }
                              );
                          }

                      }else{
                          db.transaction(
                            function (tx) {
                               tx.executeSql("INSERT INTO paramhetocategoryentity (id, idProperty, nameProperty, category, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?)",
                                    [paramhetocategoryentity.id, paramhetocategoryentity.idProperty, paramhetocategoryentity.nameProperty, paramhetocategoryentity.category, paramhetocategoryentity.log, paramhetocategoryentity.rowstatus]);
                            },
                            function (err) {
                              // console.log("ERROR PROCESSING SQL paramhetocategoryentity "+err.message);
                            },
                            function () {
                              // console.log("SUCCESS PROCESSING SQL paramhetocategoryentity");
                            }
                          );
                      }
                  }
            );
          },
            function (err) {
              // console.log("ERROR PROCESSING SELECT SQL paramhetocategoryentity "+err.message);
            },
            function () {
              // console.log("SUCCESS PROCESSING SELECT SQL paramhetocategoryentity");
            }
          );

        }

         self.insertHetoDetail = function(paramhetodetailentity){
               db.transaction(
          function (tx) {
            tx.executeSql(
              "SELECT * FROM paramhetodetailentity WHERE id = (?)",
              [paramhetodetailentity.id],
                  function (tx, result) {

                      if (result.rows.length>0){

                        if (paramhetodetailentity.log != result.rows.item(0).log || paramhetodetailentity.rowstatus != result.rows.item(0).rowstatus){
                              db.transaction(
                                function (tx) {
                                   tx.executeSql("UPDATE paramhetodetailentity SET idProperty = ?, nameProperty = ?, idCategory = ?, nameCategory = ?, bungaEfektif = ?, bungaFlat = ?, pokokHutang = ?, provisiAdm = ?, securityDeposit = ?, log = ?, rowstatus = ? WHERE id = ?",
                                        [paramhetodetailentity.idProperty, paramhetodetailentity.nameProperty, paramhetodetailentity.idCategory, paramhetodetailentity.nameCategory, paramhetodetailentity.bungaEfektif, paramhetodetailentity.bungaFlat, paramhetodetailentity.pokokHutang, paramhetodetailentity.provisiAdm, paramhetodetailentity.securityDeposit, paramhetodetailentity.log, paramhetodetailentity.rowstatus, paramhetodetailentity.id]);
                                },
                                function (err) {
                                  // console.log("ERROR PROCESSING UPDATE SQL paramhetodetailentity "+err.message);
                                },
                                function () {
                                  // $ionicLoading.hide();
                                  // console.log("SUCCESS PROCESSING UPDATE SQL paramhetodetailentity");
                                }
                              );
                          }

                      }else{
                          db.transaction(
                            function (tx) {
                               tx.executeSql("INSERT INTO paramhetodetailentity (id, idProperty, nameProperty, idCategory, nameCategory, bungaEfektif, bungaFlat, pokokHutang, provisiAdm, securityDeposit, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                    [paramhetodetailentity.id, paramhetodetailentity.idProperty, paramhetodetailentity.nameProperty, paramhetodetailentity.idCategory, paramhetodetailentity.nameCategory, paramhetodetailentity.bungaEfektif, paramhetodetailentity.bungaFlat, paramhetodetailentity.pokokHutang, paramhetodetailentity.provisiAdm, paramhetodetailentity.securityDeposit, paramhetodetailentity.log, paramhetodetailentity.rowstatus]);
                            },
                            function (err) {
                              console.log(paramhetodetailentity);
                              // console.log("ERROR PROCESSING SQL paramhetodetailentity "+err.message);
                            },
                            function () {
                              // console.log("SUCCESS PROCESSING SQL paramhetodetailentity");
                            }
                          );
                      }

                  }
            );
          },
            function (err) {
              // console.log("ERROR PROCESSING SELECT SQL paramhetodetailentity "+err.message);
            },
            function () {
              // console.log("SUCCESS PROCESSING SELECT SQL paramhetodetailentity");
            }
          );

        }

        self.insertHetoTenor = function(paramhetotenorentity){
            db.transaction(
              function (tx) {
                tx.executeSql(
                  "SELECT * FROM paramhetotenorentity WHERE id = (?)",
                  [paramhetotenorentity.id],
                      function (tx, result) {

                          if (result.rows.length>0){

                            if (paramhetotenorentity.log != result.rows.item(0).log || paramhetotenorentity.rowstatus != result.rows.item(0).rowstatus){
                                db.transaction(
                                  function (tx) {
                                     tx.executeSql("UPDATE paramhetotenorentity SET idProperty = ?, nameProperty = ?, idCategory = ?, nameCategory = ?, tenor = ?, log = ?, rowstatus = ? WHERE id = ?",
                                          [paramhetotenorentity.idProperty, paramhetotenorentity.nameProperty, paramhetotenorentity.idCategory, paramhetotenorentity.nameCategory, paramhetotenorentity.tenor, paramhetotenorentity.log, paramhetotenorentity.rowstatus, paramhetotenorentity.id]);
                                  },
                                  function (err) {
                                    // console.log("ERROR PROCESSING UPDATE SQL paramhetotenorentity "+err.message);
                                  },
                                  function () {
                                    // $ionicLoading.hide();
                                    // console.log("SUCCESS PROCESSING UPDATE SQL paramhetotenorentity");
                                  }
                                );
                            }

                          }else{
                             db.transaction(
                               function (tx) {
                                 tx.executeSql("INSERT INTO paramhetotenorentity (id, idProperty, nameProperty, idCategory, nameCategory, tenor, log,rowstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                                      [paramhetotenorentity.id, paramhetotenorentity.idProperty, paramhetotenorentity.nameProperty, paramhetotenorentity.idCategory, paramhetotenorentity.nameCategory, paramhetotenorentity.tenor, paramhetotenorentity.log, paramhetotenorentity.rowstatus]);
                              },
                              function (err) {
                                console.log(paramhetotenorentity);
                                // console.log("ERROR PROCESSING SQL paramhetotenorentity "+err.message);
                              },
                              function () {
                                // console.log("SUCCESS PROCESSING SQL paramhetotenorentity");
                              }
                            );
                          }

                      }
                );
              },
                function (err) {
                  // console.log("ERROR PROCESSING SELECT SQL paramhetotenorentity "+err.message);
                },
                function () {
                  // console.log("SUCCESS PROCESSING SELECT SQL paramhetotenorentity");
                }
              );

            }

            self.insertParamSertifikatRate = function(paramsertifikatrateentity){
              db.transaction(
              function (tx) {
                tx.executeSql(
                  "SELECT * FROM paramsertifikatrateentity WHERE id = (?)",
                  [paramsertifikatrateentity.id],
                  function (tx, result) {
                    if (result.rows.length>0){
                      if (paramsertifikatrateentity.log != result.rows.item(0).log || paramsertifikatrateentity.rowstatus != result.rows.item(0).rowstatus){
                        db.transaction(
                          function (tx) {
                            tx.executeSql("UPDATE paramsertifikatrateentity SET idParent = ?, nameParent = ?, amountFrom = ?, amountTo = ?, rate = ?, idTenor = ?, tenor = ?, log = ?, rowstatus = ? WHERE id = ?",
                                  [paramsertifikatrateentity.idParent, paramsertifikatrateentity.nameParent, paramsertifikatrateentity.amountFrom, paramsertifikatrateentity.amountTo, paramsertifikatrateentity.rate, paramsertifikatrateentity.idTenor, paramsertifikatrateentity.tenor, paramsertifikatrateentity.log, paramsertifikatrateentity.id, paramsertifikatrateentity.rowstatus]);
                          },
                          function (err) {
                            // console.log("ERROR PROCESSING UPDATE SQL paramsertifikatrateentity "+err.message);
                          },
                          function () {
                            // console.log("SUCCESS PROCESSING UPDATE SQL paramsertifikatrateentity");
                          }
                        );
                      }
                    }else{
                      db.transaction(
                        function (tx) {
                          tx.executeSql("INSERT INTO paramsertifikatrateentity (id, idParent, nameParent, amountFrom, amountTo, rate, idTenor, tenor, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                [paramsertifikatrateentity.id, paramsertifikatrateentity.idParent, paramsertifikatrateentity.nameParent, paramsertifikatrateentity.amountFrom, paramsertifikatrateentity.amountTo, paramsertifikatrateentity.rate, paramsertifikatrateentity.idTenor, paramsertifikatrateentity.tenor, paramsertifikatrateentity.log, paramsertifikatrateentity.rowstatus]);
                        },
                        function (err) {
                          // console.log("ERROR PROCESSING SQL paramsertifikatrateentity "+err.message);
                        },
                        function () {
                          // console.log("SUCCESS PROCESSING SQL paramsertifikatrateentity");
                        }
                      );
                    }
                  }
                );
              },
                function (err) {
                  // console.log("ERROR PROCESSING SELECT SQL paramsertifikatrateentity "+err.message);
                },
                function () {
                  // console.log("SUCCESS PROCESSING SELECT SQL paramsertifikatrateentity");
                }
              );

            }

            self.insertParamSertifikatTenor = function(paramsertifikattenorentity){
              db.transaction(
                function (tx) {
                  tx.executeSql(
                    "SELECT * FROM paramsertifikattenorentity WHERE id = (?)", [paramsertifikattenorentity.id],
                    function (tx, result) {
                        if (result.rows.length>0){
                          if (paramsertifikattenorentity.log != result.rows.item(0).log || paramsertifikattenorentity.rowstatus != result.rows.item(0).rowstatus){
                            db.transaction(
                              function (tx) {
                                tx.executeSql("UPDATE paramsertifikattenorentity SET idParent = ?, nameParent = ?, tenor = ?, idSertifikat = ?, log = ?, rowstatus = ? WHERE id = ?",
                                      [paramsertifikattenorentity.idParent, paramsertifikattenorentity.nameParent, paramsertifikattenorentity.tenor, paramsertifikattenorentity.idSertifikat, paramsertifikattenorentity.log, paramsertifikattenorentity.id, paramsertifikattenorentity.rowstatus]);
                              },
                              function (err) {
                                // console.log("ERROR PROCESSING UPDATE SQL paramsertifikattenorentity "+err.message);
                              },
                              function () {
                                // $ionicLoading.hide();
                                // console.log("SUCCESS PROCESSING UPDATE SQL paramsertifikattenorentity");
                              }
                            );
                          }
                        }else{
                          db.transaction(
                            function (tx) {
                              tx.executeSql("INSERT INTO paramsertifikattenorentity (id, idParent, nameParent, tenor, idSertifikat, log, rowstatus) VALUES (?,?,?, ?, ?, ?, ?)",
                                    [paramsertifikattenorentity.id, paramsertifikattenorentity.idParent, paramsertifikattenorentity.nameParent, paramsertifikattenorentity.tenor, paramsertifikattenorentity.idSertifikat, paramsertifikattenorentity.log, paramsertifikattenorentity.rowstatus]);
                            },
                            function (err) {
                              // console.log("ERROR PROCESSING SQL paramsertifikattenorentity "+err.message);
                            },
                            function () {
                              // console.log("SUCCESS PROCESSING SQL paramsertifikattenorentity");
                            }
                          );
                        }

                    }
                  );
                },
                function (err) {
                  // console.log("ERROR PROCESSING SELECT SQL paramsertifikattenorentity "+err.message);
                },
                function () {
                  // console.log("SUCCESS PROCESSING SELECT SQL paramsertifikattenorentity");
                }
              );
            }

            self.insertParamSertifikat = function(paramsertifikatentity){
              db.transaction(
                function (tx) {
                  tx.executeSql(
                    "SELECT * FROM paramsertifikatentity WHERE id = (?)",
                    [paramsertifikatentity.id],
                    function (tx, result) {
                      if (result.rows.length>0){
                        if (paramsertifikatentity.log != result.rows.item(0).log || paramsertifikatentity.rowstatus != result.rows.item(0).rowstatus){
                          db.transaction(
                            function (tx) {
                               tx.executeSql("UPDATE paramsertifikatentity SET propertyType = ?, priceAmount = ?, rateProvisi = ?, idAgunan = ?, log = ?, rowstatus = ? WHERE id = ?",
                                    [paramsertifikatentity.propertyType, paramsertifikatentity.priceAmount, paramsertifikatentity.rateProvisi, paramsertifikatentity.idAgunan, paramsertifikatentity.log, paramsertifikatentity.id, paramsertifikatentity.rowstatus]);
                            },
                            function (err) {
                              // console.log("ERROR PROCESSING UPDATE SQL paramsertifikatentity "+err.message);
                            },
                            function () {
                              // $ionicLoading.hide();
                              // console.log("SUCCESS PROCESSING UPDATE SQL paramsertifikatentity");
                            }
                          );
                        }
                      }else{
                        db.transaction(
                          function (tx) {
                            tx.executeSql("INSERT INTO paramsertifikatentity (id, propertyType, priceAmount, rateProvisi, idAgunan, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                  [paramsertifikatentity.id, paramsertifikatentity.propertyType, paramsertifikatentity.priceAmount, paramsertifikatentity.rateProvisi, paramsertifikatentity.idAgunan, paramsertifikatentity.log, paramsertifikatentity.rowstatus]);
                          },
                          function (err) {
                            // console.log("ERROR PROCESSING SQL paramsertifikatentity "+err.message);
                          },
                          function () {
                            // console.log("SUCCESS PROCESSING SQL paramsertifikatentity");
                          }
                        );
                      }
                    }
                  );
                },
                function (err) {
                  // console.log("ERROR PROCESSING SELECT SQL paramsertifikatentity "+err.message);
                },
                function () {
                  // console.log("SUCCESS PROCESSING SELECT SQL paramsertifikatentity");
                }
              );
            }

            self.insertParamMobilRateDetail = function(parammobilratedetailentity){
              db.transaction(
                function (tx) {
                  tx.executeSql(
                    "SELECT * FROM parammobilratedetailentity WHERE id = (?)",
                    [parammobilratedetailentity.id],
                        function (tx, result) {

                            if (result.rows.length>0){

                              if (parammobilratedetailentity.log != result.rows.item(0).log || parammobilratedetailentity.rowstatus != result.rows.item(0).rowstatus){
                                  db.transaction(
                                    function (tx) {
                                       tx.executeSql("UPDATE parammobilratedetailentity SET idRate = ?, ageFrom = ?, ageTo = ?, effRate = ?, maksLtv = ?, log = ?, rowstatus = ? WHERE id = ?",
                                            [parammobilratedetailentity.idRate, parammobilratedetailentity.ageFrom, parammobilratedetailentity.ageTo, parammobilratedetailentity.effRate, parammobilratedetailentity.maksLtv, parammobilratedetailentity.log, parammobilratedetailentity.id, parammobilratedetailentity.rowstatus]);
                                    },
                                    function (err) {
                                      // console.log("ERROR PROCESSING UPDATE SQL parammobilratedetailentity "+err.message);
                                    },
                                    function () {
                                      // $ionicLoading.hide();
                                      // console.log("SUCCESS PROCESSING UPDATE SQL parammobilratedetailentity");
                                    }
                                  );
                              }

                            }else{
                              db.transaction(
                                  function (tx) {
                                     tx.executeSql("INSERT INTO parammobilratedetailentity (id, idRate, ageFrom, ageTo, effRate, maksLtv, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                                          [parammobilratedetailentity.id, parammobilratedetailentity.idRate, parammobilratedetailentity.ageFrom, parammobilratedetailentity.ageTo, parammobilratedetailentity.effRate, parammobilratedetailentity.maksLtv, parammobilratedetailentity.log, parammobilratedetailentity.rowstatus]);
                                  },
                                  function (err) {
                                    // console.log("ERROR PROCESSING SQL parammobilratedetailentity "+err.message);
                                  },
                                  function () {

                                    // console.log("SUCCESS PROCESSING SQL parammobilratedetailentity");
                                  }
                                );
                            }

                        }
                  );
                },
                function (err) {
                  // console.log("ERROR PROCESSING SELECT SQL parammobilratedetailentity "+err.message);
                },
                function () {
                  // console.log("SUCCESS PROCESSING SELECT SQL parammobilratedetailentity");
                }
              );
            }

            self.insertParamMobilRate = function(parammobilrateentity){
              db.transaction(
                  function (tx) {
                    tx.executeSql(
                      "SELECT * FROM parammobilrateentity WHERE id = (?)",
                      [parammobilrateentity.id],
                          function (tx, result) {

                              if (result.rows.length>0){

                                if (parammobilrateentity.log != result.rows.item(0).log || parammobilrateentity.rowstatus != result.rows.item(0).rowstatus){
                                    db.transaction(
                                      function (tx) {
                                         tx.executeSql("UPDATE parammobilrateentity SET idMobil = ?, tenorTo = ?, tenorFrom = ?,  log = ?, rowstatus = ? WHERE id = ?",
                                              [parammobilrateentity.idMobil, parammobilrateentity.tenorTo, parammobilrateentity.tenorFrom, parammobilrateentity.log, parammobilrateentity.id, parammobilrateentity.rowstatus]);
                                      },
                                      function (err) {
                                        // console.log("ERROR PROCESSING UPDATE SQL parammobilrateentity "+err.message);
                                      },
                                      function () {
                                        // $ionicLoading.hide();
                                        // console.log("SUCCESS PROCESSING UPDATE SQL parammobilrateentity");
                                      }
                                    );
                                }

                              }else{
                                db.transaction(
                                  function (tx) {
                                     tx.executeSql("INSERT INTO parammobilrateentity (id, idMobil, tenorTo, tenorFrom, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?)",
                                          [parammobilrateentity.id, parammobilrateentity.idMobil, parammobilrateentity.tenorTo, parammobilrateentity.tenorFrom, parammobilrateentity.log, parammobilrateentity.rowstatus]);
                                  },
                                  function (err) {
                                    // console.log("ERROR PROCESSING SQL parammobilrateentity "+err.message);
                                  },
                                  function () {
                                    // console.log("SUCCESS PROCESSING SQL parammobilrateentity");
                                  }
                                );
                              }

                          }
                    );
                  },
                  function (err) {
                    // console.log("ERROR PROCESSING SELECT SQL parammobilrateentity "+err.message);
                  },
                  function () {
                    // console.log("SUCCESS PROCESSING SELECT SQL parammobilrateentity");
                  }
                );

            }

            self.insertParamMobilProvisi = function(parammobilprovisientity){
              db.transaction(
                function (tx) {
                  tx.executeSql(
                    "SELECT * FROM parammobilprovisientity WHERE id = (?)",
                    [parammobilprovisientity.id],
                    function (tx, result) {

                      if (result.rows.length>0){

                        if (parammobilprovisientity.log != result.rows.item(0).log || parammobilprovisientity.rowstatus != result.rows.item(0).rowstatus){
                          db.transaction(
                            function (tx) {
                              tx.executeSql("UPDATE parammobilprovisientity SET idMobil = ?, tenorTo = ?, tenorFrom = ?, rateProvisi = ?,  log = ?, rowstatus = ? WHERE id = ?",
                                    [parammobilprovisientity.idMobil, parammobilprovisientity.tenorTo, parammobilprovisientity.tenorFrom, parammobilprovisientity.rateProvisi, parammobilprovisientity.log, parammobilprovisientity.id, parammobilprovisientity.rowstatus]);
                            },
                            function (err) {
                              // console.log("ERROR PROCESSING UPDATE SQL parammobilprovisientity "+err.message);
                            },
                            function () {
                              // $ionicLoading.hide();
                              // console.log("SUCCESS PROCESSING UPDATE SQL parammobilprovisientity");
                            }
                          );
                        }

                      }else{
                        db.transaction(
                          function (tx) {
                            tx.executeSql("INSERT INTO parammobilprovisientity (id, idMobil, tenorTo, tenorFrom, rateProvisi, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                  [parammobilprovisientity.id, parammobilprovisientity.idMobil, parammobilprovisientity.tenorTo, parammobilprovisientity.tenorFrom, parammobilprovisientity.rateProvisi, parammobilprovisientity.log, parammobilprovisientity.rowstatus]);
                          },
                          function (err) {
                            // console.log("ERROR PROCESSING SQL parammobilprovisientity "+err.message);
                          },
                          function () {
                            // console.log("SUCCESS PROCESSING SQL parammobilprovisientity");
                          }
                        );
                      }
                    }
                  );
                },
                function (err) {
                  // console.log("ERROR PROCESSING SELECT SQL parammobilprovisientity "+err.message);
                },
                function () {
                  // console.log("SUCCESS PROCESSING SELECT SQL parammobilprovisientity");
                }
              );

            }

            self.insertParamMobilFunding = function(parammobilfundingentity){
               db.transaction(
                  function (tx) {
                    tx.executeSql(
                      "SELECT * FROM parammobilfundingentity WHERE id = (?)",
                      [parammobilfundingentity.id],
                      function (tx, result) {

                        if (result.rows.length>0){

                          if (parammobilfundingentity.log != result.rows.item(0).log || parammobilfundingentity.rowstatus != result.rows.item(0).rowstatus){
                              db.transaction(
                                function (tx) {
                                   tx.executeSql("UPDATE parammobilfundingentity SET idMobil = ?, amountTo = ?, amountFrom = ?, amountAdmin = ?, log = ?, rowstatus = ? WHERE id = ?",
                                        [parammobilfundingentity.idMobil, parammobilfundingentity.amountTo, parammobilfundingentity.amountFrom, parammobilfundingentity.amountAdmin, parammobilfundingentity.log, parammobilfundingentity.id, parammobilfundingentity.rowstatus]);
                                },
                                function (err) {
                                  // console.log("ERROR PROCESSING UPDATE SQL parammobilfundingentity "+err.message);
                                },
                                function () {
                                  // $ionicLoading.hide();
                                  // console.log("SUCCESS PROCESSING UPDATE SQL parammobilfundingentity");
                                }
                              );
                          }

                        }else{
                          db.transaction(
                            function (tx) {
                               tx.executeSql("INSERT INTO parammobilfundingentity (id, idMobil, amountTo, amountFrom, amountAdmin, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                    [parammobilfundingentity.id, parammobilfundingentity.idMobil, parammobilfundingentity.amountTo, parammobilfundingentity.amountFrom, parammobilfundingentity.amountAdmin, parammobilfundingentity.log, parammobilfundingentity.rowstatus]);
                            },
                            function (err) {
                              // console.log("ERROR PROCESSING SQL parammobilfundingentity "+err.message);
                            },
                            function () {
                              // console.log("SUCCESS PROCESSING SQL parammobilfundingentity");
                            }
                          );
                        }

                      }
                    );
                  },
                    function (err) {
                      // console.log("ERROR PROCESSING SELECT SQL parammobilfundingentity "+err.message);
                    },
                    function () {
                      // console.log("SUCCESS PROCESSING SELECT SQL parammobilfundingentity");
                    }
                  );

            }

            self.insertParamMobilFidusia = function(parammobilfidusiaentity){
              db.transaction(
                  function (tx) {
                    tx.executeSql(
                      "SELECT * FROM parammobilfidusiaentity WHERE id = (?)",
                      [parammobilfidusiaentity.id],
                          function (tx, result) {

                              if (result.rows.length>0){

                                if (parammobilfidusiaentity.log != result.rows.item(0).log || parammobilfidusiaentity.rowstatus != result.rows.item(0).rowstatus){
                                      db.transaction(
                                        function (tx) {
                                           tx.executeSql("UPDATE parammobilfidusiaentity SET idMobil = ?, amountTo = ?, amountFrom = ?, amountFidusia = ?, log = ?, rowstatus = ? WHERE id = ?",
                                                [parammobilfidusiaentity.idMobil, parammobilfidusiaentity.amountTo, parammobilfidusiaentity.amountFrom, parammobilfidusiaentity.amountFidusia, parammobilfidusiaentity.log, parammobilfidusiaentity.id, parammobilfidusiaentity.rowstatus]);
                                        },
                                        function (err) {
                                          // console.log("ERROR PROCESSING UPDATE SQL parammobilfidusiaentity "+err.message);
                                        },
                                        function () {
                                          // $ionicLoading.hide();
                                          // console.log("SUCCESS PROCESSING UPDATE SQL parammobilfidusiaentity");
                                        }
                                      );
                                  }

                              }else{
                                db.transaction(
                                  function (tx) {
                                     tx.executeSql("INSERT INTO parammobilfidusiaentity (id, idMobil, amountTo, amountFrom, amountFidusia, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                          [parammobilfidusiaentity.id, parammobilfidusiaentity.idMobil, parammobilfidusiaentity.amountTo, parammobilfidusiaentity.amountFrom, parammobilfidusiaentity.amountFidusia, parammobilfidusiaentity.log, parammobilfidusiaentity.rowstatus]);
                                  },
                                  function (err) {
                                    // console.log("ERROR PROCESSING SQL parammobilfidusiaentity "+err.message);
                                  },
                                  function () {
                                    // console.log("SUCCESS PROCESSING SQL parammobilfidusiaentity");
                                  }
                                );
                              }

                          }
                    );
                  },
                    function (err) {
                      // console.log("ERROR PROCESSING SELECT SQL parammobilfidusiaentity "+err.message);
                    },
                    function () {
                      // console.log("SUCCESS PROCESSING SELECT SQL parammobilfidusiaentity");
                    }
                  );

            }

            self.insertParamMobilAsuransiKendaraan = function(parammobilasuransikendaraanentity){
              db.transaction(
                  function (tx) {
                    tx.executeSql(
                      "SELECT * FROM parammobilasuransikendaraanentity WHERE id = (?)",
                      [parammobilasuransikendaraanentity.id],
                          function (tx, result) {

                              if (result.rows.length>0){

                                if (parammobilasuransikendaraanentity.log != result.rows.item(0).log || parammobilasuransikendaraanentity.rowstatus != result.rows.item(0).rowstatus){
                                      db.transaction(
                                        function (tx) {
                                           tx.executeSql("UPDATE parammobilasuransikendaraanentity SET idMobil = ?, tenor = ?, insuranceVal = ?,  log = ?, rowstatus = ? WHERE id = ?",
                                                [parammobilasuransikendaraanentity.idMobil, parammobilasuransikendaraanentity.tenor, parammobilasuransikendaraanentity.insuranceVal, parammobilasuransikendaraanentity.log, parammobilasuransikendaraanentity.id, parammobilasuransikendaraanentity.rowstatus]);
                                        },
                                        function (err) {
                                          // console.log("ERROR PROCESSING UPDATE SQL parammobilasuransikendaraanentity "+err.message);
                                        },
                                        function () {
                                          // $ionicLoading.hide();
                                          // console.log("SUCCESS PROCESSING UPDATE SQL parammobilasuransikendaraanentity");
                                        }
                                      );
                                  }

                              }else{
                                db.transaction(
                                    function (tx) {
                                       tx.executeSql("INSERT INTO parammobilasuransikendaraanentity (id, idMobil, tenor, insuranceVal, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?)",
                                            [parammobilasuransikendaraanentity.id, parammobilasuransikendaraanentity.idMobil, parammobilasuransikendaraanentity.tenor, parammobilasuransikendaraanentity.insuranceVal, parammobilasuransikendaraanentity.log, parammobilasuransikendaraanentity.rowstatus]);
                                    },
                                    function (err) {
                                      // console.log("ERROR PROCESSING SQL parammobilasuransikendaraanentity "+err.message);
                                    },
                                    function () {
                                      // console.log("SUCCESS PROCESSING SQL parammobilasuransikendaraanentity");
                                    }
                                  );
                              }

                          }
                    );
                  },
                    function (err) {
                      // console.log("ERROR PROCESSING SELECT SQL parammobilasuransikendaraanentity "+err.message);
                    },
                    function () {
                      // console.log("SUCCESS PROCESSING SELECT SQL parammobilasuransikendaraanentity");
                    }
                  );

            }

            self.insertParamMobilAsuransi = function(parammobilasuransientity){
              db.transaction(
                  function (tx) {
                    tx.executeSql(
                      "SELECT * FROM parammobilasuransientity WHERE id = (?)",
                      [parammobilasuransientity.id],
                          function (tx, result) {

                              if (result.rows.length>0){

                                if (parammobilasuransientity.log != result.rows.item(0).log || parammobilasuransientity.rowstatus != result.rows.item(0).rowstatus){
                                      db.transaction(
                                        function (tx) {
                                           tx.executeSql("UPDATE parammobilasuransientity SET idMobil = ?, tenor = ?, insuranceVal = ?,  log = ?, rowstatus = ? WHERE id = ?",
                                                [parammobilasuransientity.idMobil, parammobilasuransientity.tenor, parammobilasuransientity.insuranceVal, parammobilasuransientity.log, parammobilasuransientity.id, parammobilasuransientity.rowstatus]);
                                        },
                                        function (err) {
                                          // console.log("ERROR PROCESSING UPDATE SQL parammobilasuransientity "+err.message);
                                        },
                                        function () {
                                          // $ionicLoading.hide();
                                          // console.log("SUCCESS PROCESSING UPDATE SQL parammobilasuransientity");
                                        }
                                      );
                                  }

                              }else{
                                 db.transaction(
                                    function (tx) {
                                       tx.executeSql("INSERT INTO parammobilasuransientity (id, idMobil, tenor, insuranceVal, log, rowstatus) VALUES (?, ?, ?, ?, ?, ?)",
                                            [parammobilasuransientity.id, parammobilasuransientity.idMobil, parammobilasuransientity.tenor, parammobilasuransientity.insuranceVal, parammobilasuransientity.log, parammobilasuransientity.rowstatus]);
                                    },
                                    function (err) {
                                      // console.log("ERROR PROCESSING SQL parammobilasuransientity "+err.message);
                                    },
                                    function () {
                                      // console.log("SUCCESS PROCESSING SQL parammobilasuransientity");
                                    }
                                  );
                              }

                          }
                    );
                  },
                    function (err) {
                      // console.log("ERROR PROCESSING SELECT SQL parammobilasuransientity "+err.message);
                    },
                    function () {
                      // console.log("SUCCESS PROCESSING SELECT SQL parammobilasuransientity");
                    }
                  );

            }

            self.insertParamMobil = function(parammobilentity){
              db.transaction(
                  function (tx) {
                    tx.executeSql(
                      "SELECT * FROM parammobilentity WHERE id = (?) AND rowstatus = 1",
                      [parammobilentity.id],
                          function (tx, result) {

                              if (result.rows.length>0){

                                  if (parammobilentity.log != result.rows.item(0).log || parammobilentity.rowstatus != result.rows.item(0).rowstatus){
                                        db.transaction(
                                          function (tx) {
                                             tx.executeSql("UPDATE parammobilentity SET  carType = ?, idAgunan = ?,  log = ?, rowstatus = ? WHERE id = ?",
                                                  [parammobilentity.carType, parammobilentity.idAgunan, parammobilentity.log, parammobilentity.id, parammobilentity.rowstatus]);
                                          },
                                          function (err) {
                                            // console.log("ERROR PROCESSING UPDATE SQL parammobilentity "+err.message);
                                          },
                                          function () {
                                            // $ionicLoading.hide();
                                            // console.log("SUCCESS PROCESSING UPDATE SQL parammobilentity");
                                          }
                                        );
                                    }

                              }else{
                                  db.transaction(
                                    function (tx) {
                                       tx.executeSql("INSERT INTO parammobilentity (id, carType, idAgunan, log, rowstatus) VALUES (?, ?, ?, ?, ?)",
                                            [parammobilentity.id, parammobilentity.carType, parammobilentity.idAgunan, parammobilentity.log, parammobilentity.rowstatus]);
                                    },
                                    function (err) {
                                      // console.log("ERROR PROCESSING SQL parammobilentity "+err.message);
                                    },
                                    function () {
                                      $ionicLoading.hide();
                                      // console.log("SUCCESS PROCESSING SQL parammobilentity");
                                    }
                                  );
                              }

                          }
                    );
                  },
                    function (err) {
                      // console.log("ERROR PROCESSING SELECT SQL parammobilentity "+err.message);
                    },
                    function () {
                      // console.log("SUCCESS PROCESSING SELECT SQL parammobilentity");
                    }
                  );

            }

            self.selectTenorListSertifikat = function(){
              var q = $q.defer();
                db.transaction(
                    function (tx) {
                      tx.executeSql(
                        "SELECT * FROM paramsertifikattenorentity WHERE rowstatus = 1",
                        [],
                            function (tx, result) {

                                if (result.rows.length>0){
                                  q.resolve(result.rows);
                                }

                            }
                      );
                    },
                      function (err) {
                        // console.log("ERROR PROCESSING SELECT SQL paramhetocategoryentity "+err.message);
                      },
                      function () {
                        console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
                      }
                  );
                return q.promise;
            }

            self.selectTenorListMotor = function(idRatePinjaman){
              var q = $q.defer();
              db.transaction(
                    function (tx) {
                      tx.executeSql(
                        "SELECT * FROM parammotordetailentity WHERE idPinjaman = (?) AND rowstatus = 1",
                        [idRatePinjaman],
                            function (tx, result) {
                              console.log("app.js");
                              console.log(result);
                              console.log("------------");
                                if (result.rows.length>0){
                                  q.resolve(result.rows);
                                }

                            }
                      );
                    },
                      function (err) {
                        // console.log("ERROR PROCESSING SELECT SQL parammotordetailentity "+err.message);
                      },
                      function () {
                        console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
                      }
                  );
                  return q.promise;
            }

            self.selectTenorListMobil = function(){
                var q = $q.defer();
                db.transaction(
                    function (tx) {
                      tx.executeSql(
                        "SELECT * FROM parammobilasuransientity WHERE rowstatus = 1",
                        [],
                            function (tx, result) {
                                if (result.rows.length>0){
                                  q.resolve(result.rows);
                                }
                            }
                      );
                    },
                      function (err) {
                        // console.log("ERROR PROCESSING SELECT SQL parammotordetailentity "+err.message);
                      },
                      function () {
                        console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
                      }
                  );
                return q.promise;
            }

            self.selectKondisiProperty = function(agunanAjuan){
              console.error(agunanAjuan);
              var q = $q.defer();
              db.transaction(
                  function (tx) {
                    tx.executeSql(
                      "SELECT * FROM paramhetocategoryentity WHERE nameProperty = (?) AND rowstatus = 1",
                      [agunanAjuan],
                          function (tx, result) {

                            if (result.rows.length>0){
                                  q.resolve(result.rows);
                            }

                          }
                    );
                  },
                    function (err) {
                      // console.log("ERROR PROCESSING SELECT SQL paramhetocategoryentity "+err.message);
                    },
                    function () {
                      console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
                    }
                );
               return q.promise;
            }

            self.selectCategoryByID = function(id){
                var q = $q.defer();
                db.transaction(
                  function (tx2) {
                    tx2.executeSql(
                      "SELECT * FROM paramhetotenorentity WHERE idCategory = (?) AND rowstatus = 1",
                      [id],
                          function (tx2, result2) {

                            if (result2.rows.length>0){
                               q.resolve(result2.rows);
                            }

                          }
                    );
                  },
                    function (err2) {
                      // console.log("ERROR PROCESSING SELECT SQL paramhetotenorentity "+err2.code);
                    },
                    function () {
                      console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
                    }
                );
                return q.promise;
            }

            self.selectAgunan = function(){
              var q = $q.defer();
               db.transaction(
                    function (tx) {
                      tx.executeSql(
                        "SELECT * FROM agunanentity WHERE rowstatus = 1",
                        [1],
                            function (tx, result) {
                                  if (result.rows.length>0){
                                     q.resolve(result.rows);
                                  }
                            }
                      );
                    },
                      function (err) {
                        // console.log("ERROR PROCESSING SELECT SQL agunanentity "+err.message);
                      },
                      function () {
                        // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
                      }
                  );
               return q.promise;
            }

            //16 OKTOBER 2017
            self.selectTenorListMobilValue = function(){
                var q = $q.defer();
                db.transaction(
                    function (tx) {
                      tx.executeSql(
                        "SELECT * FROM parammobilasuransientity WHERE rowstatus = 1",
                        [],
                            function (tx, result) {
                                if (result.rows.length>0){
                                  q.resolve(result.rows);
                                }
                            }
                      );
                    },
                      function (err) {
                        // console.log("ERROR PROCESSING SELECT SQL parammotordetailentity "+err.message);
                      },
                      function () {
                        console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
                      }
                  );
                return q.promise;
            }

            self.selectProvisiByTenorMobil = function(tenorVal){
                var q = $q.defer();
                db.transaction(
                    function (tx) {
                      tx.executeSql(
                        "SELECT * FROM parammobilprovisientity WHERE tenorFrom <= (?) AND tenorTo >= (?) AND rowstatus = 1",
                        [tenorVal, tenorVal],
                            function (tx, result) {
                                if (result.rows.length == 0){
                                      db.transaction(
                                        function (tx2) {
                                          tx2.executeSql(
                                            "SELECT * FROM parammobilprovisientity WHERE tenorFrom <= (?) AND tenorTo = 0 AND rowstatus = 1",
                                            [tenorVal],
                                                function (tx2, result2) {
                                                    if (result2.rows.length == 0){

                                                    }else{
                                                        q.resolve(result2.rows);
                                                    }
                                                }
                                          );
                                        },
                                          function (err) {
                                            // console.log("ERROR PROCESSING SELECT SQL parammobilprovisientity "+err.message);
                                          },
                                          function () {
                                            // console.log("SUCCESS PROCESSING SELECT SQL parammobilprovisientity-2");
                                          }
                                      );
                                }else{
                                    q.resolve(result.rows);
                                }
                            }
                      );
                    },
                      function (err) {
                        // console.log("ERROR PROCESSING SELECT SQL parammobilprovisientity "+err.message);
                      },
                      function () {
                        // console.log("SUCCESS PROCESSING SELECT SQL parammobilprovisientity");
                      }
                  );
                return q.promise;
            }

      self.emailAccount = function(){
        var q = $q.defer();
          $window.plugins.DeviceAccounts.getEmails(function(emails){
            console.log(emails);
            q.resolve(emails);
          }, function(error){
            q.reject(error);
          });
        return q.promise;
      }

  });

self.loadNilaiAjuan = function(nilaiAjuan){
    var hasilFix  = null;
    var nAjuan    = nilaiAjuan.toString();
    var carichar  = nAjuan.length - 5;
    var charst    = nAjuan.charAt(carichar);
    var hs1       = nAjuan.charAt(carichar + 1);
    var hs2       = nAjuan.charAt(carichar + 2);
    var hs3       = nAjuan.charAt(carichar + 3);
    var hs4       = nAjuan.charAt(carichar + 4);
    var hasil1    = hs2+""+hs3+""+hs4;
    var ms1       = nAjuan.charAt(carichar - 7);
    var ms2       = nAjuan.charAt(carichar - 6);
    var ms3       = nAjuan.charAt(carichar - 5);
    var ms4       = nAjuan.charAt(carichar - 4);
    var ms5       = nAjuan.charAt(carichar - 3);
    var ms6       = nAjuan.charAt(carichar - 2);
    var ms7       = nAjuan.charAt(carichar - 1);
    var hasil3    = ms1+""+ms2+""+ms3+""+ms4+""+ms5+""+ms6+""+ms7;
    var hasil2    = ms1+""+ms2+""+ms3+""+ms4+""+ms5+""+ms6;
    var hasilKk   = charst+""+hs1;

    if (hasilKk == 00){
      hasilFix      = nilaiAjuan;
    }else if (hasilKk<=50 && hasilKk >= 00){
       var joining  = parseInt(hasilKk.replace(hasilKk,"50"));
       hasilFix     = hasil3 +""+joining+""+hasil1;
    }else{
      var nilaiMs   = parseInt(ms7) + parseInt(1);
      var joining   = parseInt(hs1.replace(hs1,"00"));
       hasilFix     = hasil2+""+nilaiMs+""+joining+""+hasil1+"0";
    }
    return hasilFix;
    // localStorage.setItem("nilaiAjuan",hasilFix);
}

self.distanceMap = function (lat1, lon1, lat2, lon2, unit){
    var radlat1     = Math.PI * lat1/180
    var radlat2     = Math.PI * lat2/180
    var theta       = lon1-lon2
    var radtheta    = Math.PI * theta/180
    var dist        = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist            = Math.acos(dist)
    dist            = dist * 180/Math.PI
    dist            = dist * 60 * 1.1515
    dist            = dist * 1.609344
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}

return self;
})
.factory('POINT', function($cordovaSQLite, $window, $ionicPlatform,$http, $q, $ionicLoading) {
  var self = this;
  self.updatePointCore = function(activityName){
      var q = $q.defer();
      // console.log(activityName);
      var Product        = $window.localStorage.getItem("Product");
      var BranchID       = $window.localStorage.getItem("branchID");
      var MarketingID    = $window.localStorage.getItem("MarketingID");

      var pointCriteria  = "";
      var pointValue     = "";

      if (activityName == "Login"){

          if (Product == "NDF Car"){
              pointCriteria = "BFIKU_PointCriteria_4";
              pointValue    = "10";
          }else if (Product == "NDF Motorcycle"){
              pointCriteria = "BFIKU_PointCriteria_13";
              pointValue    = "10";
          }
          // else if (Product == "KPR" || Product == "PBF"){
          //     pointCriteria = "BFIKU_PointCriteria_22";
          //     pointValue    = "0";
          // }

      }else if (activityName == "AOP"){

          if (Product == "NDF Car"){
              pointCriteria = "BFIKU_PointCriteria_6";
              pointValue    = "10";
          }else if (Product == "KPR" || Product == "PBF"){
              pointCriteria = "BFIKU_PointCriteria_24";
              pointValue    = "5";
          }
          // else if (Product == "NDF Motorcycle"){
          //     pointCriteria = "";
          //     pointValue    = "";
          // }

      }else if (activityName == "Surat Penawaran"){

          if (Product == "NDF Car"){
              pointCriteria = "BFIKU_PointCriteria_7";
              pointValue    = "4";
          }else if (Product == "NDF Motorcycle"){
              pointCriteria = "BFIKU_PointCriteria_16";
              pointValue    = "3";
          }
          // else if (Product == "KPR" || Product == "PBF"){
          //     pointCriteria = "";
          //     pointValue    = "";
          // }

      }else if (activityName == "Sukses Dikunjungi ARE"){

          if (Product == "NDF Car"){
              pointCriteria = "BFIKU_PointCriteria_8";
              pointValue    = "2";
          }else if (Product == "NDF Motorcycle"){
              pointCriteria = "BFIKU_PointCriteria_17";
              pointValue    = "2";
          }
          // else if (Product == "KPR" || Product == "PBF"){
          //     pointCriteria = "";
          //     pointValue    = "";
          // }

      }else if (activityName == "Mengisi Survey"){

          if (Product == "NDF Car"){
              pointCriteria = "BFIKU_PointCriteria_9";
              pointValue    = "10";
          }else if (Product == "NDF Motorcycle"){
              pointCriteria = "BFIKU_PointCriteria_18";
              pointValue    = "10";
          }else if (Product == "KPR" || Product == "PBF"){
              pointCriteria = "BFIKU_PointCriteria_27";
              pointValue    = "10";
          }

      }

      // console.log("activityName   ::: "+activityName);
      // console.log("pointCriteria  ::: "+pointCriteria);
      // console.log("pointValue     ::: "+pointValue);

      var ServLink        = kvlUrlFinance + "MobileCoreBaAction";
      var dataSendPoint   = {
          "action"        : "UpdatePoint",
          "BFIKU_ID"      : MarketingID,
          "BranchID"      : BranchID,
          "BFIKU_Apps"    : "Agent",
          "ActivityID"    : pointCriteria, //"BFIKU_PointCriteria_13",
          "Point"         : pointValue //point
      }

      $http({
          method      : 'POST',
          url         : ServLink,
          contentType : 'application/json',
          data: JSON.stringify(dataSendPoint),
          headers : localStorageTokenBearer()
      }).success(function (result) {
          // console.log(result);
          q.resolve(result);
      }).error(function (err) {
          console.log(err);
      });
      return q.promise;
  }

  return self;
})
.factory('PointValue', function($cordovaSQLite, $window, $ionicPlatform,$http, $q, $ionicLoading) {
  var self = this;
  self.getPointValues = function(){
      var q = $q.defer();
      // start --
      var customerID    = $window.localStorage.getItem("customerID");
      var customer      = $window.localStorage.getItem("CUSTOMER");
      // console.log("POINT CONTROLLER");

      var pointLink = kvlUrlFinance + "MobileCoreAction";

      // console.log("A");
      if (customerID != null){
        var datas = {
          "action"     : "ViewPoint",
          "BFIKU_ID"   : customerID,
          "BFIKU_Apps" : "Customer",
          "BranchID"   : ""
        }
        $http({
          method    : 'POST',
          url       : pointLink,
          contentType: 'application/json',
          data      : JSON.stringify(datas),
          headers : localStorageTokenBearer()
        })
        .success(function(result) {
          console.log(result);
          if (result.status == "1" || result.status == ""){
              var totalPoint   = result.TotalPoint;
              localStorage.setItem("totalPointKU", totalPoint);
              q.resolve(result.TotalPoint);
          }else{
              localStorage.setItem("totalPointKU", "0");
              q.resolve("0");
          }
        })
        .error(function (err) {
            // console.log(err);
        });
      }
      return q.promise;
  }
  return self;
})
.directive('onErrorSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.onErrorSrc) {
          attrs.$set('src', attrs.onErrorSrc);
        }
      });
    }
  }
})
.service('VideoService', function($q) {
    // TBD
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $animateProvider) {

  $ionicConfigProvider.scrolling.jsScrolling(false);
  $ionicConfigProvider.views.maxCache(5);

  function configureAnimate( $animateProvider ) {
    // By default, the $animate service will check for animation styling
    // on every structural change. This requires a lot of animateFrame-based
    // DOM-inspection. However, we can tell $animate to only check for
    // animations on elements that have a specific class name RegExp pattern
    // present. In this case, we are requiring the "animated" class.
    // --
    // NOTE: I have personally seen a performance boost using this approach
    // on some complex page. The AngularJS documentation also says that
    // this can also be really beneficial for low-powered mobile devices,
    // but I don't do much mobile.
    $animateProvider.classNameFilter( /\banimated\b/ );
  }

  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  // SRS
  .state('app.index', {
    cache:false,
    url: '/index',
    views: {
      'menuContent': {
        templateUrl: 'templates/index.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.slider-detail', {
    url: '/slider-detail/:idSlider',
    views: {
      'menuContent': {
        templateUrl: 'templates/slider-detail.html',
        controller: 'SliderDetailCtrl'
      }
    }
  })

  .state('app.panduan', {
    url: '/panduan/:idPanduan',
    views: {
      'menuContent': {
        templateUrl: 'templates/panduan.html',
        controller: 'PanduanCtrl'
      }
    }
  })

  .state('app.panduanList', {
    cache:true,
    url: '/panduan-list/:idPanduan',
    views: {
      'menuContent': {
        templateUrl: 'templates/panduan-list.html',
        controller : 'PanduanListCtrl',
        params: {
          'type' :'default'
        }
      }
    }
  })

  .state('app.panduanContent', {
    url: '/panduan-content/:type/:idPanduan',
    views: {
      'menuContent': {
        templateUrl: 'templates/panduan-content.html',
        controller : 'PanduanContentCtrl'
      }
    }
  })

  .state('app.tentang-bfi', {
    url: '/tentang-bfi',
    views: {
      'menuContent': {
        templateUrl: 'templates/tentang-bfi.html',
        controller: 'TentangBFICtrl'
      }
    }
  })

  .state('app.contact-us', {
    url: '/contact-us',
    views: {
      'menuContent': {
        templateUrl: 'templates/contact-us.html',
        controller: 'ContactUsCtrl'
      }
    }
  })

  .state('app.profil', {
    url: '/profil',
    views: {
      'menuContent': {
        templateUrl: 'templates/profil.html',
        controller: 'ProfilCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.promo', {
    url: '/promo',
    views: {
      'menuContent': {
        templateUrl: 'templates/promo.html',
        controller: 'PromoCtrl'
      }
    }
  })
  .state('app.promo-detail', {
    url: '/promo-detail/:idPromo',
    views: {
      'menuContent': {
        templateUrl: 'templates/promo-detail.html',
        controller: 'PromoDetailCtrl'
      }
    }
  })

  .state('app.merchant', {
    url: '/merchant',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/merchant.html',
        controller: 'MerchantCtrl'
      }
    }
  })
  .state('app.merchant-detail', {
    cache   :false,
    url: '/merchant-detail/:lat/:long/:name/:address',
        views: {
            'menuContent': {
            templateUrl: 'templates/merchant-detail.html',
            controller : 'MerchantDetailCtrl'
      }
    }
  })

  .state('app.reward', {
    url: '/reward',
    views: {
      'menuContent': {
        templateUrl: 'templates/reward.html',
        controller: 'RewardCtrl'
      }
    }
  })

  .state('app.pesan', {
    url: '/pesan',
    views: {
      'menuContent': {
        templateUrl: 'templates/pesan.html',
        controller: 'PesanCtrl'
      }
    }
  })

  .state('app.pesan-detail', {
    url: '/pesan-detail/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/pesan-detail.html',
        controller: 'PesanDetailCtrl'
      }
    }
  })

  .state('app.srs', {
    url: '/srs',
    views: {
      'menuContent': {
        templateUrl: 'templates/srs.html',
        controller: 'SRSCtrl'
      }
    }
  })

  .state('app.srs-1', {
    url: '/srs-1',
    views: {
      'menuContent': {
        templateUrl: 'templates/srs-1.html',
        controller: 'SRSStep1Ctrl'
      }
    }
  })

  .state('app.srs-2', {
    cache:false,
    url: '/srs-2/:type',
    views: {
      'menuContent': {
        templateUrl: 'templates/srs-2.html',
        controller: 'SRSStep2Ctrl'
      }
    }
  })

  .state('app.srs-3', {
    url: '/srs-3',
    views: {
      'menuContent': {
        templateUrl: 'templates/srs-3.html',
        controller: 'SRSStep3Ctrl'
      }
    }
  })

  .state('app.srs-4', {
    cache:false,
    url: '/srs-4',
    views: {
      'menuContent': {
        templateUrl: 'templates/srs-4.html',
        controller: 'SRSStep4Ctrl'
      }
    }
  })

  .state('app.srs-5', {
    url: '/srs-5',
    views: {
      'menuContent': {
        templateUrl: 'templates/srs-5.html',
        controller: 'SRSStep5Ctrl'
      }
    }
  })

  .state('app.sec', {
    cache:false,
    url: '/sec',
    views: {
      'menuContent': {
        templateUrl: 'templates/sec.html',
        controller: 'SECCtrl'
      }
    }
  })

  .state('app.sec-1', {
    cache:false,
    url: '/sec-1',
    views: {
      'menuContent': {
        templateUrl: 'templates/sec-1.html',
        controller: 'SEC1Ctrl'
      }
    }
  })

  .state('app.sec-2', {
    cache:false,
    url: '/sec-2',
    views: {
      'menuContent': {
        templateUrl: 'templates/sec-2.html',
        controller: 'SEC2Ctrl'
      }
    }
  })

  .state('app.sec-3', {
    cache:false,
    url: '/sec-3',
    views: {
      'menuContent': {
        templateUrl: 'templates/sec-3.html',
        controller: 'SEC3Ctrl'
      }
    }
  })

  .state('app.sec-4', {
    cache:false,
    url: '/sec-4/:status',
    views: {
      'menuContent': {
        templateUrl: 'templates/sec-4.html',
        controller: 'SEC4Ctrl'
      }
    }
  })

  .state('app.sec-5', {
    cache:false,
    url: '/sec-5',
    views: {
      'menuContent': {
        templateUrl: 'templates/sec-5.html',
        controller: 'SEC5Ctrl'
      }
    }
  })

  .state('app.sec-6', {
    cache:false,
    url: '/sec-6',
    views: {
      'menuContent': {
        templateUrl: 'templates/sec-6.html',
        controller: 'SEC6Ctrl'
      }
    }
  })

  .state('app.sec-7', {
    cache:false,
    url: '/sec-7',
    views: {
      'menuContent': {
        templateUrl: 'templates/sec-7.html',
        controller: 'SEC7Ctrl'
      }
    }
  })

  .state('app.simulasikredit', {
    cache:false,
    url: '/simulasikredit',
    views: {
      'menuContent': {
        templateUrl: 'templates/simulasikredit.html',
        controller: 'SimulasiCtrl'
      }
    }
  })

  .state('app.simulasikredit-finance', {
    url: '/simulasikredit-finance',
    views: {
      'menuContent': {
        templateUrl: 'templates/simulasikredit-finance.html',
        controller: 'SimulasiFinanceCtrl'
      }
    }
  })

  .state('app.simulasikredit-finance-agunan', {
    url: '/simulasikredit-finance-agunan',
    views: {
      'menuContent': {
        templateUrl: 'templates/simulasikredit-finance-agunan.html',
        controller: 'SimulasiFinanceAgunanCtrl'
      }
    }
  })

  .state('app.simulasikredit-pemohon', {
    cache:false,
    url: '/simulasikredit-pemohon',
    views: {
      'menuContent': {
        templateUrl: 'templates/simulasikredit-pemohon.html',
        controller: 'PemohonCtrl'
      }
    }
  })

  .state('app.simulasikredit1', {
    url: '/simulasikredit1',
    views: {
      'menuContent': {
        templateUrl: 'templates/simulasikredit1.html',
        controller: 'SimulasiKredit1Ctrl'
      }
    }
  })

  .state('app.forgot-password', {
    url: '/forgot-password',
    views: {
      'menuContent': {
        templateUrl: 'templates/forgot-password.html',
        controller: 'ForgotPasswordCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/index');
});
