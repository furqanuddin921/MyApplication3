app.controller('SimulasiFinanceAgunanCtrl', function ($filter, $cordovaSocialSharing,$timeout, $cordovaFileTransfer, $ionicLoading, $scope, $http, $state, $window, $stateParams, BFIFINANCE, POINT , $q) {

  $scope.item = {};

  $scope.$on("$ionicView.beforeEnter", function (event, data) {

        $scope.doBack = function(){
            $state.go('app.simulasikredit', { url: '/simulasikredit' });
        }

        var agunanAjuan = $window.localStorage.getItem("agunanAjuan");
        // console.log(agunanAjuan);

        if (agunanAjuan == "Sertifikat Tanah dan Bangunan"){
              var itemListArray = [];
               BFIFINANCE.selectTenorListSertifikat()
                .then(function (result) {
                      console.log(result);
                      for (var i = 0; i <= result.length - 1; i++) {
                            if (result.item(i).tenor == "12" || result.item(i).tenor == "24" || result.item(i).tenor == "36" || result.item(i).tenor == "48" || result.item(i).tenor == "60"){
                                loadSertifikat(result.item(i).id)
                                .then (function (result){
                                    console.log(result);
                                    console.log(result.item(0).rate);
                                    console.log(result.item(0).tenor);

                                    var nilaiAngsuranSertifikat = doHitungAngsuranSertifikatFix(result.item(0).rate, result.item(0).tenor);
                                    console.log(result.item(0).tenor);
                                    console.log(nilaiAngsuranSertifikat);
                                    if (nilaiAngsuranSertifikat ==0 || nilaiAngsuranSertifikat == "0"){

                                    }else{
                                        itemListArray.push({
                                          tenor : result.item(0).tenor,
                                          angsuran : nilaiAngsuranSertifikat,
                                          angsuranval : accounting.formatMoney(nilaiAngsuranSertifikat , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' })
                                      });
                                    }

                                })
                                // var nilaiAngsuranSertifikat = 0;
                                //
                            }
                      }
                })
                $scope.itemListArray = itemListArray;

        }else if (agunanAjuan == "Invoice Alat Berat/BPKB Truk"){
            var itemListArray = [];
            loadTenorProperty()
            .then(function (idPinjaman){

                BFIFINANCE.selectCategoryByID(idPinjaman)
                  .then(function (result2) {
                      for (var ij = 0; ij <= result2.length - 1; ij++) {
                        console.log(result2.item(ij).tenor);
                        var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
                        var nilaiAngsuranHeto = doHitungAngsuranPropertyFix(nilaiAjuan, result2.item(ij).tenor);
                          console.log(nilaiAngsuranHeto);
                          itemListArray.push({
                              tenor : result2.item(ij).tenor,
                              angsuran : nilaiAngsuranHeto,
                              angsuranval : accounting.formatMoney(nilaiAngsuranHeto , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' })
                          });
                      }
                  });

            });
            $scope.itemListArray = itemListArray;

        }else if (agunanAjuan == "Invoice Machinery"){
            var itemListArray = [];
            loadTenorProperty()
            .then(function (idPinjaman){

                BFIFINANCE.selectCategoryByID(idPinjaman)
                  .then(function (result2) {
                      for (var ij = 0; ij <= result2.length - 1; ij++) {
                        console.log(result2.item(ij).tenor);
                        var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
                        var nilaiAngsuranHeto = doHitungAngsuranPropertyMachineryFix(nilaiAjuan, result2.item(ij).tenor);
                          console.log(nilaiAngsuranHeto);
                          itemListArray.push({
                              tenor : result2.item(ij).tenor,
                              angsuran : nilaiAngsuranHeto,
                              angsuranval : accounting.formatMoney(nilaiAngsuranHeto , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' })
                          });
                      }
                  });

            });
            $scope.itemListArray = itemListArray;

        }else if (agunanAjuan == "BPKB-Motor"){
              var itemListArray = [];
              getIDPinjamanByAmount()
              .then(function (idRatePinjaman){
                  // console.log(idRatePinjaman);
                  BFIFINANCE.selectTenorListMotor(idRatePinjaman)
                  .then(function (result) {
                      console.log(result);

                      for (var i=0; i<=result.length-1; i++){
                          console.log(result.item(i).tenor);

                          var nilaiAngsuranMotor = doHitungAngsuranMotorFix(result.item(i).tenor, result.item(i).rate, result.item(i).rateProvisi, result.item(i).biayaAdm);
                          console.log(nilaiAngsuranMotor);
                          itemListArray.push({
                              tenor : result.item(i).tenor,
                              angsuran : nilaiAngsuranMotor,
                              angsuranval : accounting.formatMoney(nilaiAngsuranMotor , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' })
                          });
                      }
                  });
              })
              $scope.itemListArray = itemListArray;
              // console.log(itemListArray);

        }else if (agunanAjuan == "BPKB-Mobil"){

            $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
            });

            $timeout(function () {
                $ionicLoading.hide();
                 $scope.itemListArrayShow = true;
            }, 2000);

                var itemListArray = [];
                db.transaction(
                    function (tx) {
                      tx.executeSql(
                        "SELECT life.id, life.tenor, life.insuranceVal AS lifeInsurance, car.insuranceVal AS carInsurance, life.log, life.rowstatus FROM parammobilasuransientity life  INNER JOIN parammobilasuransikendaraanentity car ON life.tenor = car.tenor WHERE life.rowstatus = 1",
                        [],
                            function (tx, result) {

                                console.log("Result Tenor Mobil");
                                console.log(result);
                                if (result.rows.length>0){
                                    for (var ij=0; ij<=result.rows.length-1; ij++){

                                        var idTenor    = result.rows.item(ij).id;
                                        var tenorValue = result.rows.item(ij).tenor;
                                        var carInsurance = result.rows.item(ij).carInsurance;
                                        var lifeInsurance = result.rows.item(ij).lifeInsurance;
                                        var rowstatus = result.rows.item(ij).rowstatus;
                                        var log = result.rows.item(ij).log;
                                        doLoadAngssuran(nilaiAjuan, lifeInsurance, carInsurance, tenorValue, idTenor);

                                    }
                                }
                            }
                      );
                    },
                    function (err) {
                      console.log("ERROR PROCESSING SELECT SQL parammobilasuransientity "+err.message);
                    },
                    function () {
                      // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
                    }
                );
        }

        function doLoadAngssuran(nilaiAjuan, lifeInsurance, carInsurance, tenorValue, idTenor){
            var itemArrayNew = [];
            var angsuranAjuan = doHitungAngsuranNDFMobilFix(nilaiAjuan, lifeInsurance, carInsurance, tenorValue, idTenor)
            .then(function (angsuranAjuan) {

                itemListArray.push({
                    tenor         : parseInt(tenorValue),
                    angsuran : angsuranAjuan,
                    angsuranval : accounting.formatMoney(angsuranAjuan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' })
                })
               $scope.itemListArray     =  itemListArray; //$filter('number')(itemArrayNew.tenor,0);//itemArrayNew;
               $scope.itemListArrayShow = true;
            });
        }

        function getRateEff(idParamMobilRateDetail){
            var tahunAjuan = $window.localStorage.getItem("tahunAjuan");
            var currentYear = new Date().getFullYear();
            var selisihYear = parseInt(currentYear) - parseInt(tahunAjuan);
            var q = $q.defer();
            $http({
                method: 'GET',
                url: kvlUrlFinance + 'ParamMobilRateDetailAction?action=list-front-parammobilratedetail&idParamMobilRateDetail=' + idParamMobilRateDetail + '&selisihYear=' + selisihYear,
                headers : localStorageTokenBearer()
            })
            .success(function (result2) {
                if (result2.rows.length > 0) {
                    q.resolve(result2.rows[0].effRate);
                }
            })
            return q.promise;
        }

        function getProvisi(tenorValue){
            var q = $q.defer();
            $http({
                method: 'GET',
                url: kvlUrlFinance + 'ParamMobilProvisiAction?action=list-front-parammobilprovisi&tenorVal=' + tenorValue,
                headers : localStorageTokenBearer()
            })
            .success(function (result) {
                  if (result.rows.length > 0) {
                    var bProvisii = result.rows[0].rateProvisi;

                    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
                    var bProvisi = parseFloat(bProvisii) / 100;
                    var biayaProvisi = parseInt(nilaiAjuan) * parseFloat(bProvisi);
                    q.resolve(biayaProvisi);
                  }
            })
            return q.promise;
        }

        function loadRateee(tenorValue){
            var q = $q.defer();
            $http({
                method: 'GET',
                url: kvlUrlFinance + 'ParamMobilRateAction?action=list-front-parammobilrate&tenor=' + tenorValue,
                headers : localStorageTokenBearer()
            })
            .success(function (result) {
                if (result.rows.length > 0) {
                  var idParamMobilRateDetail = result.rows[0].id;
                  q.resolve(idParamMobilRateDetail);
                }
            })
            return q.promise;
        }

        function doHitungAngsuranNDFMobilFix(nilaiAjuan, lifeInsurance, carInsurance, tenorValue, idTenor) {
            // console.log("tenorValue: "+tenorValue);
            var q = $q.defer();
            var itemArrayNew = [];
            var biayaAdm = $window.localStorage.getItem("biayaAdm");
            var biayaFidusia = $window.localStorage.getItem("biayaFidusia");
            var insuranceKendaraan = carInsurance; //$window.localStorage.getItem("insuranceKendaraan");
            var insuranceJiwa = lifeInsurance; //$window.localStorage.getItem("insuranceJiwa");
            var hargaKendaraan = 150000000;

            var tahunAjuan = $window.localStorage.getItem("tahunAjuan");
            var currentYear = new Date().getFullYear();
            var selisihYear = parseInt(currentYear) - parseInt(tahunAjuan);

            // var rstNilaiMobil = 0;
            getProvisi(tenorValue)
            .then (function (biayaProvisi){

                  var biayaProvisi = biayaProvisi;

                  loadRateee(tenorValue)
                  .then (function (rateID){

                      getRateEff(rateID)
                      .then(function (effRate){
                            // console.log("effRate: "+effRate);

                            var biayaAdm = $window.localStorage.getItem("biayaAdm");
                            var biayaFidusia = $window.localStorage.getItem("biayaFidusia");
                            var insuranceKendaraan = carInsurance; //$window.localStorage.getItem("insuranceKendaraan");
                            var insuranceJiwa = lifeInsurance; //$window.localStorage.getItem("insuranceJiwa");
                            var hargaKendaraan = 150000000;

                            $ionicLoading.show({
                                template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
                            });

                            var waktuAjuan = tenorValue; //$window.localStorag

                            var ttlBiayaAdmin = parseInt(biayaAdm) + parseInt(biayaFidusia) + parseInt(biayaProvisi);

                            var ttlInsuranceKendaraan = parseInt(insuranceKendaraan) + parseInt(50000);

                            var ttlInsuranceJiwa = (parseFloat(insuranceJiwa) / 100) * parseInt(hargaKendaraan);

                            var ttlNTF = parseInt($window.localStorage.getItem("nilaiAjuan")) + parseInt(ttlBiayaAdmin); //+ parseInt(ttlInsuranceKendaraan) + parseInt(ttlInsuranceJiwa)
                            var effRateFinal = null;
                            if (effRate == "0" || parseInt(effRate) == 0){
                              effRateFinal = "0";
                            }else{
                              effRateFinal = ((parseInt(effRate) / 100) / 12);
                            }

                            var satuPlus = (parseInt(1) + parseFloat(effRateFinal));

                            var mathPow = Math.pow(satuPlus, parseInt(waktuAjuan));

                            var ntfeff = null;
                            if (effRate == "0" || parseInt(effRate) == 0){
                              ntfeff = (ttlNTF * mathPow);
                            }else{
                              ntfeff = (ttlNTF * effRateFinal * mathPow);
                            }

                            var dudud = mathPow - parseInt(1);

                            var hasilpmt = null;
                            if (effRate == "0" || parseInt(effRate) == 0){
                                hasilpmt = dudud.toFixed();
                            }else{
                                hasilpmt = (ntfeff / dudud).toFixed();
                            }

                            var carichar = hasilpmt.length - 3;
                            var charst = hasilpmt.charAt(carichar);
                            var charsc = hasilpmt.charAt(carichar + 1);
                            var chartd = hasilpmt.charAt(carichar + 2);
                            var charganti = charst + "" + charsc + "" + chartd;
                            var charasli = hasilpmt.charAt(carichar - 1);
                            var charasli2 = hasilpmt.charAt(carichar - 2);
                            var charasli3 = hasilpmt.charAt(carichar - 3);
                            var charasli4 = hasilpmt.charAt(carichar - 4);
                            var charasli5 = hasilpmt.charAt(carichar - 5);
                            var charasli6 = hasilpmt.charAt(carichar - 6);
                            var charasli0 = charasli6 + "" + charasli5 + "" + charasli4 + "" + charasli3 + "" + charasli2 + "" + charasli;

                            if (charst < 5 && charst > 0) {
                              var joining = parseInt(charganti.replace(charganti, "500"));
                              var hasilFix = charasli0 + "" + joining;
                              // console.log(hasilFix);
                              // rstNilaiMobil = hasilFix;

                              q.resolve(hasilFix);
                              $ionicLoading.hide();

                              // itemArrayNew.push({
                              //     tenor : tenorValue,
                              //     angsuranval : hasilFix
                              // })
                              // localStorage.setItem("angsuranAjuan", hasilFix);
                              // $scope.form.angsuranAjuan = accounting.formatMoney(hasilFix , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;
                            } else {
                              var cicilAjuan = round2(hasilpmt, 3) / 1000;
                              var rstCicilan = Math.ceil(cicilAjuan);
                              var rstCicilan2 = Math.floor(cicilAjuan);
                              var resultCicilan = rstCicilan * 1000;

                               // rstNilaiMobil = resultCicilan;
                              // console.log(resultCicilan);
                              q.resolve(resultCicilan);
                              $ionicLoading.hide();
                              // itemArrayNew.push({
                              //     tenor : tenorValue,
                              //     angsuranval : resultCicilan
                              // })
                              // localStorage.setItem("angsuranAjuan", resultCicilan);
                              // $scope.form.angsuranAjuan = accounting.formatMoney(resultCicilan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
                            }
                      })
                  })
            })
            // q.resolve(rstNilaiMobil);
            return q.promise;
        }

        function round2(value, decimals) {
          return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        }

        function ceilAngular(biayaAsuransi) {
          var resultCeil = 0;
          var carichar = biayaAsuransi.length - 3;
          var charst = biayaAsuransi.charAt(carichar);
          var charsc = biayaAsuransi.charAt(carichar + 1);
          var chartd = biayaAsuransi.charAt(carichar + 2);
          var charganti = charst + "" + charsc + "" + chartd;
          var charasli = biayaAsuransi.charAt(carichar - 1);
          var charasli2 = biayaAsuransi.charAt(carichar - 2);
          var charasli3 = biayaAsuransi.charAt(carichar - 3);
          var charasli4 = biayaAsuransi.charAt(carichar - 4);
          var charasli5 = biayaAsuransi.charAt(carichar - 5);
          var charasli6 = biayaAsuransi.charAt(carichar - 6);
          var charasli7 = biayaAsuransi.charAt(carichar - 7);
          var charasli0 = charasli7 + "" + charasli6 + "" + charasli5 + "" + charasli4 + "" + charasli3 + "" + charasli2 + "" + charasli;

          if (charst < 5 && charst > 0) {
            var joining = parseInt(charganti.replace(charganti, "500"));
            resultCeil = charasli0 + "" + joining;
          } else {
            var cicilAjuan = round2(biayaAsuransi, 3) / 1000;
            var rstCicilan = Math.ceil(cicilAjuan);
            var rstCicilan2 = Math.floor(cicilAjuan);
            resultCeil = rstCicilan * 1000;
          }
          return resultCeil;
        }
  })

  function loadSertifikat(idTenor){
      var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
      var q = $q.defer();
      db.transaction(
          function (tx) {
            tx.executeSql(
              "SELECT * FROM paramsertifikatrateentity WHERE amountFrom <= (?) AND amountTo >= (?) AND idTenor = (?) AND rowstatus = 1",
              [nilaiAjuan, nilaiAjuan, idTenor],
              function (tx, result) {
                if (result.rows.length > 0) {

                  q.resolve(result.rows);

                } else {
                  db.transaction(
                    function (tx2) {
                      tx2.executeSql(
                        "SELECT * FROM paramsertifikatrateentity WHERE amountFrom <= (?) AND amountTo = 0  AND idTenor = (?) AND rowstatus = 1",
                        [nilaiAjuan, idTenor],
                        function (tx2, result2) {

                          if (result2.rows.length > 0) {

                               q.resolve(result2.rows);

                          }

                        }
                      );
                    },
                    function (err) {
                      console.log("ERROR PROCESSING SELECT SQL paramsertifikatrateentity " + err.code);
                    },
                    function () {
                      // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
                    }
                  );
                }

              }
            );
          },
          function (err) {
            console.log("ERROR PROCESSING SELECT SQL paramsertifikatrateentity " + err.code);
          },
          function () {
            // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
          }
        );
      return q.promise;
  }

  function doHitungAngsuranSertifikatFix(ratePerkiraan, tenorAjuan) { //properti ini sih harusnya
      var hargaPerkiraan = $window.localStorage.getItem("hargaPerkiraan");
      var ratePerkiraan = ratePerkiraan; //$window.localStorage.getItem("ratePerkiraan");
      var rateProvisi = $window.localStorage.getItem("rateProvisi");
      var waktuAjuan = tenorAjuan; //$window.localStorage.getItem("tenor");
      var ltv = (parseInt(nilaiAjuan) * parseInt(100)) / parseInt(hargaPerkiraan);
      var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");

      // console.log(hargaPerkiraan);
      // console.log(ratePerkiraan);
      // console.log(waktuAjuan);
      // console.log(ltv);

      var biayaAdm = 0;
      if (nilaiAjuan < 150000000) {
        biayaAdm = 1500000;
      } else {
        biayaAdm = (parseInt(nilaiAjuan) * parseInt(10)) / 100;
      }

      //get eff rate
      var effRateFinal;
      if (ratePerkiraan == "0" || ratePerkiraan == 0) {
        effRateFinal = "0";
      } else {
        effRateFinal = ((parseInt(ratePerkiraan) / 100) / 12);
      }
      // console.log("effRate: "+effRateFinal);

      // (P*i*(1+i)^n)/(((1+i)^n)-1)
      var satuPlus = (parseInt(1) + parseFloat(effRateFinal));
      console.log("satuPlus: " + satuPlus);

      var mathPow = Math.pow(satuPlus, parseInt(waktuAjuan));
      console.log("mathPow: " + mathPow);

      var ntfeff;
      if (effRateFinal == "0" || effRateFinal == 0) {
        ntfeff = (nilaiAjuan * mathPow);
      } else {
        ntfeff = (nilaiAjuan * effRateFinal * mathPow);
      }
      console.log("ntfeff: " + ntfeff);

      var dudud = mathPow - parseInt(1);
      console.log("Dudu: " + dudud);

      var hasilpmt = (ntfeff / dudud).toFixed();
      console.log(hasilpmt);

      var nilaiSertifikat = Math.ceil(hasilpmt/500)*500;
      console.log(nilaiSertifikat);

      if (nilaiSertifikat == Infinity || nilaiSertifikat == "Infinity"){
        nilaiSertifikat = "0";
      }

      return nilaiSertifikat;

      // var carichar = hasilpmt.length - 3;
      // var charst = hasilpmt.charAt(carichar);
      // var charsc = hasilpmt.charAt(carichar + 1);
      // var chartd = hasilpmt.charAt(carichar + 2);
      // var charganti = charst + "" + charsc + "" + chartd;
      // var charasli = hasilpmt.charAt(carichar - 1);
      // var charasli2 = hasilpmt.charAt(carichar - 2);
      // var charasli3 = hasilpmt.charAt(carichar - 3);
      // var charasli4 = hasilpmt.charAt(carichar - 4);
      // var charasli5 = hasilpmt.charAt(carichar - 5);
      // var charasli6 = hasilpmt.charAt(carichar - 6);
      // var charasli0 = charasli6 + "" + charasli5 + "" + charasli4 + "" + charasli3 + "" + charasli2 + "" + charasli;

      // var nilaiAngsuran = null;
      // var hasil = 0;
      // if (charst < 5 && charst > 0) {
      //   var joining = parseInt(charganti.replace(charganti, "500"));
      //   var hasilFix = charasli0 + "" + joining;
      //   // console.log(hasilFix);
      //   // q.resolve(hasilFix);
      //   hasil = hasilFix;
      //   //$scope.form.angsuranAjuan =  $filter('number')(hasilFix, 0);
      //   nilaiAngsuran = charasli0 + "" + joining;
      //   localStorage.setItem("angsuranAjuan", hasilFix);
      //   // $scope.form.angsuranAjuan = accounting.formatMoney(hasilFix , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;
      // } else {
      //   var cicilAjuan = round2(hasilpmt, 3) / 1000;
      //   var rstCicilan = Math.ceil(cicilAjuan);
      //   var rstCicilan2 = Math.floor(cicilAjuan);
      //   var resultCicilan = rstCicilan * 1000;
      //   // console.log(resultCicilan);
      //   hasil = resultCicilan;
      //   // q.resolve(resultCicilan);
      //   //$scope.form.angsuranAjuan = $filter('number')(resultCicilan, 0);
      //   nilaiAngsuran = rstCicilan * 1000;
      //   // localStorage.setItem("angsuranAjuan", resultCicilan);
      //   // $scope.form.angsuranAjuan = accounting.formatMoney(resultCicilan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
      // }
      // // $scope.form.angsuranAjuan = accounting.formatMoney(nilaiAngsuran , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;

      // return q.promise;
      //return hasil;
      //$scope.form.angsuranAjuan =  $filter('number')(hasil, 0);
  }

  function loadTenorProperty(){
      var q = $q.defer();
    var valKondisi = $window.localStorage.getItem("kondisiAjuan");
    var valProperty = $window.localStorage.getItem("jenisAjuan");
      db.transaction(
          function (tx) {
            tx.executeSql(
              "SELECT * FROM paramhetocategoryentity WHERE category = (?) AND nameProperty = (?) AND rowstatus = 1",
              [valKondisi, valProperty],
              function (tx, result) {

                q.resolve(result.rows.item(0).id);

              }
            );
          },
          function (err) {
            console.log("ERROR PROCESSING SELECT SQL paramhetocategoryentity " + err.code);
          },
          function () {
            // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
          }

      );
      return q.promise;
  }

  function doHitungAngsuranPropertyFix(nilaiAjuan, waktuAjuan) {
    // var q = $q.defer();
    var nilaiAjuan = nilaiAjuan;

    console.log("nilaiAjuan: "+nilaiAjuan);
    console.log("waktuAjuan: "+waktuAjuan);

    var tnr = parseInt(waktuAjuan)/12;

    var nilaiAsuransi = $window.localStorage.getItem("asuransi");
    var nilaiBungaEfektif = $window.localStorage.getItem("bungaEfektif");
    // var nilaiBungaFlat = $window.localStorage.getItem("bungaFlat");
    var nilaiPokokHutang = $window.localStorage.getItem("pokokHutang");
    var nilaiProvisiAdm = $window.localStorage.getItem("provisiAdm");
    var nilaiSecurityDeposit = $window.localStorage.getItem("securityDeposit");

    //RUMUS INI UNTUK YANG AT THE BEGINNING OF PERIODE (A,A,A,A,1)

    //get security deposit
    var ttlDeposit = (parseInt(nilaiSecurityDeposit) / 100) * parseInt(nilaiAjuan);
    // console.log("ttlDeposit: "+ttlDeposit);

    //get pokok hutang
    var ttlPokokHutang = parseInt(nilaiAjuan) - parseInt(ttlDeposit);
    console.log("ttlPokokHutang: "+ttlPokokHutang);

    //get eff rate
    var effRateFinal = ((parseInt(nilaiBungaEfektif) / 100) / 12);
    console.log("effRate: "+effRateFinal);

    //get ttl waktu dalam bulan
    //var ttlBulan  = parseInt(waktuAjuan) * parseInt(12);
    // console.log("ttlBulan: "+ttlBulan);

    // (P*i*(1+i)^n)/(((1+i)^n)-1)
    var satuPlus = (parseInt(1) + parseFloat(effRateFinal));
    console.log("satuPlus: "+satuPlus);

    var mathPow = Math.pow(satuPlus, parseInt(waktuAjuan));
    console.log("mathPow: "+mathPow);

    var ntfeff = (ttlPokokHutang * effRateFinal * mathPow);
    console.log("ntfeff: "+ntfeff);

    var dudud = mathPow - parseInt(1);
    console.log("Dudu: "+dudud+" ----- "+mathPow);

    var ttlHasil = (ntfeff / dudud).toFixed();
    console.log(ttlHasil);

    var ttlHasil2 = null;

    var kondisiAjuan = $window.localStorage.getItem("kondisiAjuan");
    if (kondisiAjuan == "NEW" || kondisiAjuan == "New"){
        ttlHasil2 = Math.ceil(ttlHasil/500)*500;

    }else{
        var init = parseInt(1) + parseFloat(effRateFinal);

      var ttlHasil1 = (parseFloat(ttlHasil) / parseFloat(init)).toFixed();

      ttlHasil2 = Math.ceil(ttlHasil1/500)*500;

    }
    console.log(ttlHasil2);

    // var carichar = ttlHasil.length - 3;
    // var charst = ttlHasil.charAt(carichar);
    // var charsc = ttlHasil.charAt(carichar + 1);
    // var chartd = ttlHasil.charAt(carichar + 2);
    // var charganti = charst + "" + charsc + "" + chartd;
    // var charasli = ttlHasil.charAt(carichar - 1);
    // var charasli2 = ttlHasil.charAt(carichar - 2);
    // var charasli3 = ttlHasil.charAt(carichar - 3);
    // var charasli4 = ttlHasil.charAt(carichar - 4);
    // var charasli5 = ttlHasil.charAt(carichar - 5);
    // var charasli6 = ttlHasil.charAt(carichar - 6);
    // var charasli0 = charasli6 + "" + charasli5 + "" + charasli4 + "" + charasli3 + "" + charasli2 + "" + charasli;
    // var nilaiAngsuranHeto = null;
    // if (charst < 5 && charst > 0) {
    //   var joining = parseInt(charganti.replace(charganti, "500"));
    //   var hasilFix = charasli0 + "" + joining;
    //   // q.resolve(hasilFix);
    //   nilaiAngsuranHeto = hasilFix;
    //   // console.log(hasilFix);
    //   // localStorage.setItem("angsuranAjuan", hasilFix);
    //   // $scope.form.angsuranAjuan = accounting.formatMoney(hasilFix , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;
    // } else {
    //   var cicilAjuan = round2(ttlHasil, 3) / 1000;
    //   var rstCicilan = Math.ceil(cicilAjuan);
    //   var rstCicilan2 = Math.floor(cicilAjuan);
    //   var resultCicilan = rstCicilan * 1000;
    //   // q.resolve(resultCicilan);
    //   nilaiAngsuranHeto = resultCicilan;
    //   // console.log(resultCicilan);
    //   // localStorage.setItem("angsuranAjuan", resultCicilan);
    //   // $scope.form.angsuranAjuan = accounting.formatMoney(resultCicilan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
    // }
    return ttlHasil2;
  }

  function doHitungAngsuranPropertyMachineryFix(nilaiAjuan, waktuAjuan) {
    // var q = $q.defer();
    var nilaiAjuan = nilaiAjuan;

    console.log("nilaiAjuan: "+nilaiAjuan);
    console.log("waktuAjuan: "+waktuAjuan);

    var tnr = parseInt(waktuAjuan)/12;

    var nilaiAsuransi = $window.localStorage.getItem("asuransi");
    var nilaiBungaEfektif = $window.localStorage.getItem("bungaEfektif");
    // var nilaiBungaFlat = $window.localStorage.getItem("bungaFlat");
    var nilaiPokokHutang = $window.localStorage.getItem("pokokHutang");
    var nilaiProvisiAdm = $window.localStorage.getItem("provisiAdm");
    var nilaiSecurityDeposit = $window.localStorage.getItem("securityDeposit");

    //RUMUS INI UNTUK YANG AT THE BEGINNING OF PERIODE (A,A,A,A,1)

    //get security deposit
    var ttlDeposit = (parseInt(nilaiSecurityDeposit) / 100) * parseInt(nilaiAjuan);
    // console.log("ttlDeposit: "+ttlDeposit);

    //get pokok hutang
    var ttlPokokHutang = parseInt(nilaiAjuan) - parseInt(ttlDeposit);
    console.log("ttlPokokHutang: "+ttlPokokHutang);

    //get eff rate
    var effRateFinal = ((parseInt(nilaiBungaEfektif) / 100) / 12);
    console.log("effRate: "+effRateFinal);

    //get ttl waktu dalam bulan
    //var ttlBulan  = parseInt(waktuAjuan) * parseInt(12);
    // console.log("ttlBulan: "+ttlBulan);

    // (P*i*(1+i)^n)/(((1+i)^n)-1)
    var satuPlus = (parseInt(1) + parseFloat(effRateFinal));
    console.log("satuPlus: "+satuPlus);

    var mathPow = Math.pow(satuPlus, parseInt(waktuAjuan));
    console.log("mathPow: "+mathPow);

    var ntfeff = (ttlPokokHutang * effRateFinal * mathPow);
    console.log("ntfeff: "+ntfeff);

    var dudud = mathPow - parseInt(1);
    console.log("Dudu: "+dudud+" ----- "+mathPow);

    var ttlHasil = (ntfeff / dudud).toFixed();
    console.log(ttlHasil);

      var init = parseInt(1) + parseFloat(effRateFinal);

      var ttlHasil1 = (parseFloat(ttlHasil) / parseFloat(init)).toFixed();

     var ttlHasil2 = Math.ceil(ttlHasil1/500)*500;

    console.log(ttlHasil2);

    // var carichar = ttlHasil.length - 3;
    // var charst = ttlHasil.charAt(carichar);
    // var charsc = ttlHasil.charAt(carichar + 1);
    // var chartd = ttlHasil.charAt(carichar + 2);
    // var charganti = charst + "" + charsc + "" + chartd;
    // var charasli = ttlHasil.charAt(carichar - 1);
    // var charasli2 = ttlHasil.charAt(carichar - 2);
    // var charasli3 = ttlHasil.charAt(carichar - 3);
    // var charasli4 = ttlHasil.charAt(carichar - 4);
    // var charasli5 = ttlHasil.charAt(carichar - 5);
    // var charasli6 = ttlHasil.charAt(carichar - 6);
    // var charasli0 = charasli6 + "" + charasli5 + "" + charasli4 + "" + charasli3 + "" + charasli2 + "" + charasli;
    // var nilaiAngsuranHeto = null;
    // if (charst < 5 && charst > 0) {
    //   var joining = parseInt(charganti.replace(charganti, "500"));
    //   var hasilFix = charasli0 + "" + joining;
    //   // q.resolve(hasilFix);
    //   nilaiAngsuranHeto = hasilFix;
    //   // console.log(hasilFix);
    //   // localStorage.setItem("angsuranAjuan", hasilFix);
    //   // $scope.form.angsuranAjuan = accounting.formatMoney(hasilFix , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;
    // } else {
    //   var cicilAjuan = round2(ttlHasil, 3) / 1000;
    //   var rstCicilan = Math.ceil(cicilAjuan);
    //   var rstCicilan2 = Math.floor(cicilAjuan);
    //   var resultCicilan = rstCicilan * 1000;
    //   // q.resolve(resultCicilan);
    //   nilaiAngsuranHeto = resultCicilan;
    //   // console.log(resultCicilan);
    //   // localStorage.setItem("angsuranAjuan", resultCicilan);
    //   // $scope.form.angsuranAjuan = accounting.formatMoney(resultCicilan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
    // }
    return ttlHasil2;
  }

  function round2(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }

  function ceilAngular(biayaAsuransi) {
    var resultCeil = 0;
    var carichar = biayaAsuransi.length - 3;
    var charst = biayaAsuransi.charAt(carichar);
    var charsc = biayaAsuransi.charAt(carichar + 1);
    var chartd = biayaAsuransi.charAt(carichar + 2);
    var charganti = charst + "" + charsc + "" + chartd;
    var charasli = biayaAsuransi.charAt(carichar - 1);
    var charasli2 = biayaAsuransi.charAt(carichar - 2);
    var charasli3 = biayaAsuransi.charAt(carichar - 3);
    var charasli4 = biayaAsuransi.charAt(carichar - 4);
    var charasli5 = biayaAsuransi.charAt(carichar - 5);
    var charasli6 = biayaAsuransi.charAt(carichar - 6);
    var charasli7 = biayaAsuransi.charAt(carichar - 7);
    var charasli0 = charasli7 + "" + charasli6 + "" + charasli5 + "" + charasli4 + "" + charasli3 + "" + charasli2 + "" + charasli;

    if (charst < 5 && charst > 0) {
      var joining = parseInt(charganti.replace(charganti, "500"));
      resultCeil = charasli0 + "" + joining;
    } else {
      var cicilAjuan = round2(biayaAsuransi, 3) / 1000;
      var rstCicilan = Math.ceil(cicilAjuan);
      var rstCicilan2 = Math.floor(cicilAjuan);
      resultCeil = rstCicilan * 1000;
    }
    return resultCeil;
  }

  function loadAngsuran(tenor, rate, rateProvisi, biayaAdm){
      // var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
      // doHitungAngsuranMotorFix(nilaiAjuan, tenor, rate, rateProvisi, biayaAdm).then(function (result) {
      //     console.log(result);
      // });
  }

  function getIDPinjamanByAmount(){
      var q = $q.defer();
      var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
      db.transaction(
          function (tx) {
              tx.executeSql(
                "SELECT * FROM parammotorentity WHERE amountFrom <= (?) AND amountTo >= (?) AND rowstatus = 1",
                [nilaiAjuan, nilaiAjuan],
                function (tx, result) {
                    console.log(result);
                    if (result.rows.length > 0) {
                        q.resolve(result.rows.item(0).id);
                    }else{
                        db.transaction(
                            function (tx2) {
                                tx2.executeSql(
                                 "SELECT * FROM parammotorentity WHERE amountFrom <= (?) AND amountTo = 0 AND rowstatus = 1",
                                  [nilaiAjuan],
                                  function (tx2, result2) {
                                      console.log(result2);
                                      if (result2.rows.length > 0) {
                                          q.resolve(result2.rows.item(0).id);
                                      }else{

                                      }
                                  }
                                )
                            }
                        );
                    }
                }
              )
          }
      );
      return q.promise;
  }

  function doHitungAngsuranMotorFix(tenorAjuan, rate, rateProvisi, biayaAdm) { //rate, rateProvisi, biayaAdm
    // var q = $q.defer();
    var agunanAjuan = $window.localStorage.getItem("agunanAjuan");
    var waktuAjuan = tenorAjuan; //$window.localStorage.getItem("tenor");
    var biayaFidusia = 175000;

    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");

    //RUMUS INI UNTUK YANG AT THE BEGINNING OF PERIODE (A,A,A,A,0)

    //get NTF
    var jmlNTF = parseInt(nilaiAjuan) + parseInt(biayaFidusia) + parseInt(biayaAdm);
    var totalNTF = parseInt(jmlNTF) / (parseInt(1) - (parseInt(rateProvisi) / 100));

    //get eff rate
    var effRateFinal = ((parseInt(rate) / 100) / 12);

    var satuPlus = (parseInt(1) + parseFloat(effRateFinal));

    var mathPow = Math.pow(satuPlus, parseInt(waktuAjuan));

    var ntfeff = (totalNTF * effRateFinal * mathPow);

    var dudud = mathPow - parseInt(1);

    var hasilpmt = (ntfeff / dudud).toFixed();

    var carichar = hasilpmt.length - 3;
    var charst = hasilpmt.charAt(carichar);
    var charsc = hasilpmt.charAt(carichar + 1);
    var chartd = hasilpmt.charAt(carichar + 2);
    var charganti = charst + "" + charsc + "" + chartd;
    var charasli = hasilpmt.charAt(carichar - 1);
    var charasli2 = hasilpmt.charAt(carichar - 2);
    var charasli3 = hasilpmt.charAt(carichar - 3);
    var charasli4 = hasilpmt.charAt(carichar - 4);
    var charasli5 = hasilpmt.charAt(carichar - 5);
    var charasli6 = hasilpmt.charAt(carichar - 6);
    var charasli0 = charasli6 + "" + charasli5 + "" + charasli4 + "" + charasli3 + "" + charasli2 + "" + charasli;
    var angsuranMotor = null;
    if (charst < 5 && charst > 0) {
      var joining = parseInt(charganti.replace(charganti, "500"));
      var hasilFix = charasli0 + "" + joining;
      // console.log(hasilFix);
      // q.resolve(hasilFix);
      angsuranMotor = hasilFix;
      // localStorage.setItem("angsuranAjuan", hasilFix);
      // $scope.form.angsuranAjuan = accounting.formatMoney(hasilFix , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;
    } else {
      var cicilAjuan = round2(hasilpmt, 3) / 1000;
      var rstCicilan = Math.ceil(cicilAjuan);
      var rstCicilan2 = Math.floor(cicilAjuan);
      var resultCicilan = rstCicilan * 1000;
      // console.log(resultCicilan);
      // q.resolve(resultCicilan);
      angsuranMotor = resultCicilan;
      // localStorage.setItem("angsuranAjuan", resultCicilan);
      // $scope.form.angsuranAjuan = accounting.formatMoney(resultCicilan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
    }
    return angsuranMotor;
  }

  $scope.doSelanjutnya = function(tenorAjuan, angsuranAjuan){
      console.log(tenorAjuan);
      console.log(angsuranAjuan);
      localStorage.setItem("tenorAjuan", tenorAjuan);
      localStorage.setItem("waktuAjuan", tenorAjuan);
      localStorage.setItem("angsuranAjuan", angsuranAjuan);

      $state.go('app.simulasikredit-pemohon', { url: '/simulasikredit-pemohon' });
  }

  if(window.cordova){
      var deviceInformation   = ionic.Platform.device();
      var androidVersion      = deviceInformation.version;
      var OSversion           = parseInt(androidVersion.substring(0, 1));
  }

  $scope.doDownloadPDF = function(){
    console.log("7849");//asli
    if(OSversion >= 6 ){
      var permissions = cordova.plugins.permissions;
      permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);
      console.warn();
      function checkPermissionCallback(status) {
        if (!status.hasPermission) {
          var errorCallback = function () {
            console.warn('Storage permission is not turned on');
          }
          permissions.requestPermission(
            permissions.READ_EXTERNAL_STORAGE,
            function (status) {
              if (!status.hasPermission) {
                errorCallback();
              } else {
                getDownloadPdfMobil();
              }
            },
            errorCallback);
        }else{
          getDownloadPdfMobil();
        }
      }
    }else{
      console.log("android version lower 6.0 or lollipop");
      getDownloadPdfMobil();
    }
  }

  function getDownloadPdfMobil(){
    // console.log($scope.itemListArray);
    var agunanBiaya = $window.localStorage.getItem("agunanAjuan");
    if (agunanBiaya == "BPKB-Mobil"){
         var itemListArray = $scope.itemListArray;
         console.log(itemListArray);
          console.log(itemListArray[3].angsuranval);
          var agunanBiaya = $window.localStorage.getItem("agunanAjuan");
          var hrgOTR    = accounting.formatMoney($window.localStorage.getItem("nilaiAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var DP        = accounting.formatMoney($window.localStorage.getItem("dpAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var thnKend   = $window.localStorage.getItem("tahunAjuan");
          var tenorSatu   = accounting.formatMoney(itemListArray[0].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[0].angsuranval; //
          var tenorDua  = accounting.formatMoney(itemListArray[1].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[1].angsuranval; //accounting.formatMoney(itemListArray[1].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorTiga = accounting.formatMoney(itemListArray[2].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[2].angsuranval; //accounting.formatMoney(itemListArray[2].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorEmpat  = accounting.formatMoney(itemListArray[3].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[3].angsuranval; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });

          document.addEventListener('deviceready', function () {
            $ionicLoading.show({
              template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
            });

            var url         = kvlUrlFinance + 'CreditSimulationMobil?action=CreditSimulationCustomer&hrgOTR='+hrgOTR+ '&agunanBiaya='+agunanBiaya+ '&thnKend='+thnKend+ '&tenorSatu='+tenorSatu+'&tenorDua='+tenorDua+'&tenorTiga='+tenorTiga+'&tenorEmpat='+tenorEmpat;
            // var url         = kvlUrl + 'PreciseOutputAgentMobilAction?action=PreciseAgentMobil'
            // var targetPath  = cordova.file.externalRootDirectory + "kredit_simulasi_ndfcar.pdf";
            var targetPath = ionic.Platform.isIPad() || ionic.Platform.isIOS() ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;
                targetPath += "kredit_simulasi_ndfcar.pdf";

            var trustHosts  = true;
            var options     = localStorageTokenBearer();//{};

            console.log(url);

            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
            .then(function(result) {
              console.log(result)
              $ionicLoading.hide();
              sharedFile(result.nativeURL,"Simulasi Kredit BFI - NDF Car");


            }, function(err) {
              console.log(err)
              $ionicLoading.hide();
            }, function (progress) {
              // $timeout(function () {
              // // $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              // console.log("progress download")
              // });
            });

          }, false);
    }else if (agunanBiaya == "BPKB-Motor"){
         var itemListArray = $scope.itemListArray;
         console.log(itemListArray);
          console.log(itemListArray[3].angsuranval);
          console.log(itemListArray[3].angsuran);
          var agunanBiaya = $window.localStorage.getItem("agunanAjuan");
          var hrgOTR    = accounting.formatMoney($window.localStorage.getItem("nilaiAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var DP        = accounting.formatMoney($window.localStorage.getItem("dpAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var thnKend   = $window.localStorage.getItem("tahunAjuan");
          var tenorSatu   = accounting.formatMoney(itemListArray[0].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });// itemListArray[0].angsuranval; //accounting.formatMoney(itemListArray[0].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorDua  = accounting.formatMoney(itemListArray[1].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[1].angsuranval; //accounting.formatMoney(itemListArray[1].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorTiga = accounting.formatMoney(itemListArray[2].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[2].angsuranval; //accounting.formatMoney(itemListArray[2].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorEmpat  = accounting.formatMoney(itemListArray[3].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[3].angsuranval; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorSatuu  = accounting.formatMoney(itemListArray[4].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[4].angsuranval; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorDuaa  = accounting.formatMoney(itemListArray[5].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[5].angsuranval; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorTigaa  = accounting.formatMoney(itemListArray[6].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[6].angsuranval; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorEmpatt  = null;
          if (itemListArray[7].angsuranval === undefined || itemListArray[7].angsuranval == null){
              tenorEmpatt = "0";
          }else{
              tenorEmpatt = accounting.formatMoney(itemListArray[7].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[7].angsuranval;
           //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          }

          document.addEventListener('deviceready', function () {
            $ionicLoading.show({
              template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
            });

            var url         = kvlUrlFinance + 'CreditSimulationMotor?action=CreditSimulationCustomer&hrgOTR='+hrgOTR+ '&agunanBiaya='+agunanBiaya+ '&thnKend='+thnKend+ '&tenorSatu='+tenorSatu+'&tenorDua='+tenorDua+'&tenorTiga='+tenorTiga+'&tenorEmpat='+tenorEmpat+'&tenorSatuu='+tenorSatuu+'&tenorDuaa='+tenorDuaa+'&tenorTigaa='+tenorTigaa+'&tenorEmpatt='+tenorEmpatt;
            // var url         = kvlUrl + 'PreciseOutputAgentMobilAction?action=PreciseAgentMobil'
            // var targetPath  = cordova.file.externalRootDirectory + "kredit_simulasi_ndfmotor.pdf";
            var targetPath = ionic.Platform.isIPad() || ionic.Platform.isIOS() ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;
                targetPath += "kredit_simulasi_ndfmotor.pdf";
            var trustHosts  = true;
            var options     = localStorageTokenBearer();//{};

            console.log(url);

            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
            .then(function(result) {
              console.log(result)
              $ionicLoading.hide();
              sharedFile(result.nativeURL,"Simulasi Kredit BFI - NDF Motor");
            }, function(err) {
              console.log(err)
              $ionicLoading.hide();
            }, function (progress) {
              // $timeout(function () {
              // // $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              // console.log("progress download")
              // });
            });

          }, false);
    }else if (agunanBiaya == "Sertifikat Tanah dan Bangunan"){
         var itemListArray = $scope.itemListArray;
         console.log(itemListArray);
         console.log(itemListArray[0].angsuranVal);
          var agunanBiaya = $window.localStorage.getItem("agunanAjuan");
          var hrgOTR    = accounting.formatMoney($window.localStorage.getItem("nilaiAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var DP        = accounting.formatMoney($window.localStorage.getItem("dpAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var thnKend   = $window.localStorage.getItem("tahunAjuan");
          var tenorSatu   = accounting.formatMoney(itemListArray[0].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[0].angsuranVal; //accounting.formatMoney(itemListArray[0].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorDua  = accounting.formatMoney(itemListArray[1].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[1].angsuranVal; //accounting.formatMoney(itemListArray[1].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorTiga = accounting.formatMoney(itemListArray[2].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[2].angsuranVal; //accounting.formatMoney(itemListArray[2].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorEmpat  = itemListArray[3].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorSatuu  = itemListArray[4].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorDuaa  = itemListArray[5].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorTigaa  = itemListArray[6].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorEmpatt  = null;
          // console.log(itemListArray[7].angsuran);
          // if (itemListArray[7].angsuran === undefined || itemListArray[7].angsuran == null){
          //     tenorEmpatt = "0";
          // }else{
          //     tenorEmpatt = itemListArray[7].angsuran;
          // }

          document.addEventListener('deviceready', function () {
            $ionicLoading.show({
              template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
            });

            var url         = kvlUrlFinance + 'CreditSimulationSertifikat?action=CreditSimulationCustomer&hrgOTR='+hrgOTR+ '&agunanBiaya='+agunanBiaya+ '&thnKend='+thnKend+ '&tenorSatu='+tenorSatu+'&tenorDua='+tenorDua+'&tenorTiga='+tenorTiga;
            // var url         = kvlUrl + 'PreciseOutputAgentMobilAction?action=PreciseAgentMobil'
            // var targetPath  = cordova.file.externalRootDirectory + "kredit_simulasi_pbf.pdf";
            var targetPath = ionic.Platform.isIPad() || ionic.Platform.isIOS() ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;
                targetPath += "kredit_simulasi_pbf.pdf";
            var trustHosts  = true;
            var options     = localStorageTokenBearer();//{};

            console.log(url);

            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
            .then(function(result) {
              console.log(result)
              $ionicLoading.hide();
              sharedFile(result.nativeURL,"Simulasi Kredit BFI - PBF");
            }, function(err) {
              console.log(err)
              $ionicLoading.hide();
            }, function (progress) {
              // $timeout(function () {
              // // $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              // console.log("progress download")
              // });
            });

          }, false);
    }else if (agunanBiaya == "Invoice Alat Berat/BPKB Truk"){
         var itemListArray = $scope.itemListArray;
         console.log(itemListArray);
         console.log(itemListArray[0].angsuranVal);
         var scDepost = (parseInt($window.localStorage.getItem("securityDeposit"))/100) * $window.localStorage.getItem("nilaiAjuan");
         var securityDeposit = accounting.formatMoney(scDepost, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var agunanBiaya = $window.localStorage.getItem("agunanAjuan");
          var kondisiBiaya = $window.localStorage.getItem("kondisiAjuan");
          var hrgOTR    = accounting.formatMoney($window.localStorage.getItem("nilaiAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var DP        = accounting.formatMoney($window.localStorage.getItem("dpAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var thnKend   = $window.localStorage.getItem("tahunAjuan");
          var tenorSatu   = accounting.formatMoney(itemListArray[0].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[0].angsuranVal; //accounting.formatMoney(itemListArray[0].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorDua  = accounting.formatMoney(itemListArray[1].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[1].angsuranVal; //accounting.formatMoney(itemListArray[1].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorTiga = accounting.formatMoney(itemListArray[2].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[2].angsuranVal; //accounting.formatMoney(itemListArray[2].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorEmpat  = itemListArray[3].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorSatuu  = itemListArray[4].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorDuaa  = itemListArray[5].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorTigaa  = itemListArray[6].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorEmpatt  = null;
          // console.log(itemListArray[7].angsuran);
          // if (itemListArray[7].angsuran === undefined || itemListArray[7].angsuran == null){
          //     tenorEmpatt = "0";
          // }else{
          //     tenorEmpatt = itemListArray[7].angsuran;
          // }

          document.addEventListener('deviceready', function () {
            $ionicLoading.show({
              template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
            });

            var url         = kvlUrlFinance + 'CreditSimulationInventory?action=CreditSimulationCustomer&hrgOTR='+hrgOTR+ '&agunanBiaya='+agunanBiaya+ '&thnKend='+thnKend+ '&tenorSatu='+tenorSatu+'&tenorDua='+tenorDua+'&tenorTiga='+tenorTiga+'&kondisiBiaya='+kondisiBiaya+'&securityDeposit='+securityDeposit;
            // var url         = kvlUrl + 'PreciseOutputAgentMobilAction?action=PreciseAgentMobil'
            // var targetPath  = cordova.file.externalRootDirectory + "kredit_simulasi_heto.pdf";
            var targetPath = ionic.Platform.isIPad() || ionic.Platform.isIOS() ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;
                targetPath += "kredit_simulasi_heto.pdf";
            var trustHosts  = true;
            var options     = localStorageTokenBearer();//{};

            console.log(url);

            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
            .then(function(result) {
              console.log(result)
              $ionicLoading.hide();
              sharedFile(result.nativeURL,"Simulasi Kredit BFI - Alat Berat");
            }, function(err) {
              console.log(err)
              $ionicLoading.hide();
            }, function (progress) {
              // $timeout(function () {
              // // $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              // console.log("progress download")
              // });
            });

          }, false);
    }else if (agunanBiaya == "Invoice Machinery"){
         var itemListArray = $scope.itemListArray;
         console.log(itemListArray);
         console.log(itemListArray[0].angsuranVal);
         var scDepost = (parseInt($window.localStorage.getItem("securityDeposit"))/100) * $window.localStorage.getItem("nilaiAjuan");
         var securityDeposit = accounting.formatMoney(scDepost, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var agunanBiaya = $window.localStorage.getItem("agunanAjuan");
          var kondisiBiaya = $window.localStorage.getItem("kondisiAjuan");
          var hrgOTR    = accounting.formatMoney($window.localStorage.getItem("nilaiAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var DP        = accounting.formatMoney($window.localStorage.getItem("dpAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var thnKend   = $window.localStorage.getItem("tahunAjuan");
          var tenorSatu   = accounting.formatMoney(itemListArray[0].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[0].angsuranVal; //accounting.formatMoney(itemListArray[0].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorDua  = accounting.formatMoney(itemListArray[1].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); // itemListArray[1].angsuranVal; //accounting.formatMoney(itemListArray[1].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          var tenorTiga = accounting.formatMoney(itemListArray[2].angsuran, { precision: 0, thousand: '.', symbol: '', format: '%v %s' }); //itemListArray[2].angsuranVal; //accounting.formatMoney(itemListArray[2].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorEmpat  = itemListArray[3].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorSatuu  = itemListArray[4].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorDuaa  = itemListArray[5].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorTigaa  = itemListArray[6].angsuran; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
          // var tenorEmpatt  = null;
          // console.log(itemListArray[7].angsuran);
          // if (itemListArray[7].angsuran === undefined || itemListArray[7].angsuran == null){
          //     tenorEmpatt = "0";
          // }else{
          //     tenorEmpatt = itemListArray[7].angsuran;
          // }

          document.addEventListener('deviceready', function () {
            $ionicLoading.show({
              template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
            });

            var url         = kvlUrlFinance + 'CreditSimulationInventory?action=CreditSimulationCustomer&hrgOTR='+hrgOTR+ '&agunanBiaya='+agunanBiaya+ '&thnKend='+thnKend+ '&tenorSatu='+tenorSatu+'&tenorDua='+tenorDua+'&tenorTiga='+tenorTiga+'&kondisiBiaya='+kondisiBiaya+'&securityDeposit='+securityDeposit;
            // var url         = kvlUrl + 'PreciseOutputAgentMobilAction?action=PreciseAgentMobil'
            // var targetPath  = cordova.file.externalRootDirectory + "kredit_simulasi_machinery.pdf";
            var targetPath = ionic.Platform.isIPad() || ionic.Platform.isIOS() ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;
                targetPath += "kredit_simulasi_machinery.pdf";
            var trustHosts  = true;
            var options     = localStorageTokenBearer();//{};

            console.log(url);

            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
            .then(function(result) {
              console.log(result)
              $ionicLoading.hide();
              sharedFile(result.nativeURL,"Simulasi Kredit BFI - Machinery");
            }, function(err) {
              console.log(err)
              $ionicLoading.hide();
            }, function (progress) {
              // $timeout(function () {
              // // $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              // console.log("progress download")
              // });
            });

          }, false);
    }

  }

  function sharedFile(dirUrl,subject) {
      POINT.updatePointCore().then(function (result) {
          console.log("updatePointCore");
          console.log(result);
          var msg = "Kepada Customer yang terhormat, Terima kasih atas kesediaan waktunya untuk bersedia menjadi customer BFIKu. Kami sangat menghargai kesediaan anda yang sudah melakukan simulasi pembiayaan pada aplikasi BFIKu Terlampir adalah hasil simulasi pembiayaan Anda. Anda akan kami hubungi secepatnya. Hormat Kami, BFI-Ku";

          // $cordovaSocialSharing.shareViaEmail(msg, subject,'','','', dirUrl) // Share via native share sheet
          // .then(function(result) {
          //     console.log(result);
          // }, function(err) {
          //     console.error(err)
          // });
          var bodyEmail ='<div class="text-justify"><h5>Kepada Customer yang terhormat,</h5><p>Terima kasih atas kesediaan waktunya untuk bersedia menjadi customer BFIKu. Kami sangat menghargai kesediaan anda yang sudah melakukan simulasi pembiayaan pada aplikasi BFIKu. </p><p>Terlampir adalah hasil simulasi pembiayaan Anda. <br/>Anda akan kami hubungi secepatnya.</p><p>Hormat Kami,</p><p><b>BFIKu</b></p></div>'
          document.addEventListener('deviceready', function () {
              cordova.plugins.email.open({
                  attachments : dirUrl,
                  subject     : subject,
                  body        : bodyEmail
              });
          }, false);
      });
  }

})
