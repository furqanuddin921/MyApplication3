app.controller('SimulasiCtrl', function ($scope, $timeout, $http, $state, $window, $ionicHistory, $stateParams,
  $ionicPlatform, $ionicPopup, $cordovaSQLite, BFIFINANCE, $filter, $q, $ionicLoading) {

  console.log("SIMULASI KREDIT ASLI");
  var tenorListMotorNew = [];
  var tenorListMobilNew = [];

  $scope.doNewSubmit = function(){

      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      });

      $timeout(function () {
        $ionicLoading.hide();
        $state.go('app.likebfi-step-1', { url: '/likebfi-step-1' });
      }, 1000);
  }

  window.addEventListener('load', function () {
  function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";
    status.className = condition;
    status.innerHTML = condition.toUpperCase();
    if (condition == "offline") {
      if ($window.cordova) {
        $ionicPopup.alert({
          title   : 'Oopos',
          template: 'Terjadi kesalahan koneksi',
          cssClass  : 'alertCustom',
          okText  : 'Ok',
          okType  : 'button-custom-ok'
        });
        // $cordovaToast.showLongBottom('Terjadi kesalahan koneksi');
      }
    } else {
    // $ionicLoading.hide();
    }
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  });
  $scope.form = {};
  $scope.agunanList = [];
  $scope.doKreditAgunanVal = function () {
    localStorage.setItem("kredit", "Agunan");
  }

  $scope.doKreditMilik = function () {
    localStorage.setItem("kredit", "Kepemilikan");
  }

  function loadAgunanEntity() {
    console.log('loadAgunanEntity');
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });
    db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM agunanentity WHERE rowstatus = 1",
        [],
        function (tx, result) {
          console.log(result)
          for (var i = 0; i <= result.rows.length - 1; i++) {
            $scope.agunanList.push({
              id: result.rows.item(i).id,
              name: result.rows.item(i).name,
              code: result.rows.item(i).code,
              log: result.rows.item(i).log
            });
          }
          $ionicLoading.hide();
        }
      );
    },
    function (err) {
      console.log("ERROR PROCESSING SELECT SQL agunanentity " + err.code);
    },
    function () {
      console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
    });
  }
  loadAgunanEntity();

  $scope.kreditAgunan = function () {
    console.log("Agunan");
  }

  var storage = $window.localStorage.getItem("CUSTOMER");
  var valAjukan = $stateParams.nilaiAjuan;
  if (valAjukan == null || valAjukan == "" || valAjukan == "0") {
    valAjukan == 0;
  }

  var thnSekarang   = new Date().getFullYear();
  var arrMotor      = [];
  var arrMobil      = [];
  var arrHeto       = [];
  var arrMachinery  = [];
  function tahunMotor() {
    console.log("Fix Tahun Kendaraan Simulasi Motor?")
    var thnMax = 11;
    var thnMotor = [];
    thnMotor.push({
      tahun : "-- Pilih Tahun Kendaraan --"
    })
    var thnMaksimal = parseInt(thnSekarang) - parseInt(thnMax);
    for (i = thnSekarang; i > thnMaksimal; i--) {
      thnMotor.push({
        tahun : i
      })
    }
    $scope.tahunList        = thnMotor;
    $scope.form.tahunAjuan  = thnMotor[0];
  }

  function tahunMobil() {
    console.log("Fix Tahun Kendaraan Simulasi Mobil?")
    var thnMax = 16;
    var thnMobil = [];
    thnMobil.push({
        tahun : "-- Pilih Tahun Kendaraan --"
    })
    var thnMaksimal = parseInt(thnSekarang) - parseInt(thnMax);
    for (i = thnSekarang; i > thnMaksimal; i--) {
      thnMobil.push({
        tahun : i
      })
    }
    $scope.tahunList        = thnMobil;
    $scope.form.tahunAjuan  = thnMobil[0];
  }

  function tahunHeto() {
    var thnMax = 11;
    var thnHeto = [];
    thnHeto.push({
       tahun : "-- Pilih Tahun Unit --"
    })
    var thnMaksimal = parseInt(thnSekarang) - parseInt(thnMax);
    for (i = thnSekarang; i > thnMaksimal; i--) {
      thnHeto.push({
          tahun : i
      })
    }
    $scope.tahunList        = thnHeto;
    $scope.form.tahunAjuan  = thnHeto[0];
  }

  function tahunMachinery() {
    var thnMax = 6;
    var thnMachinery = [];
    thnMachinery.push({
        tahun : "-- Pilih Tahun Unit --"
    })
    var thnMaksimal = parseInt(thnSekarang) - parseInt(thnMax);
    for (i = thnSekarang; i > thnMaksimal; i--) {
      thnMachinery.push({
        tahun : i
      })
    }
    $scope.tahunList = thnMachinery;
    $scope.form.tahunAjuan = thnMachinery[0];
  }

  function doResetLocalStorage() {
    localStorage.removeItem("angsuranAjuan");
    localStorage.removeItem("dpAjuan");
    localStorage.removeItem("waktuAjuan");
    localStorage.removeItem("tahunAjuan");
    // localStorage.removeItem("nilaiAjuan");
    localStorage.removeItem("kondisiAjuan");
    localStorage.removeItem("tenor");
    localStorage.removeItem("agunanAjuan");
    localStorage.removeItem("jenisAjuan");
    localStorage.removeItem("idJenisAjuan");
    //ini Invoice Alat Berat/BPKB Truk ---
    localStorage.removeItem("asuransi");
    localStorage.removeItem("bungaEfektif");
    localStorage.removeItem("bungaFlat");
    localStorage.removeItem("provisiAdm");
    localStorage.removeItem("pokokHutang");
    localStorage.removeItem("securityDeposit");
    //ini bpkb motor -----------
    localStorage.removeItem("rate");
    localStorage.removeItem("rateProvisi");
    localStorage.removeItem("biayaAdm");

    $scope.form.tahunAjuan    = "";
    $scope.form.angsuranAjuan = "";
    $scope.tenorList          = [];
    $scope.kondisiList        = [];

  }

  var valAjuan = "";
  $scope.doLoadAgunan = function (agunanAjuan) {
    console.log("agunan 1111 : "+ agunanAjuan);

    // if(agunanAjuan=="Invoice Alat Berat/BPKB Truk/BPKB Truk"){
    //   localStorage.setItem("agunanAjuan","Invoice Alat Berat/BPKB Truk");
    //   console.log("AAAA")
    // }else{
    //   localStorage.setItem("agunanAjuan",agunanAjuan);
    //   cos
    // }

    localStorage.removeItem("arrayListSimulasiKreditHeto");
    localStorage.removeItem("arrayListSimulasiKreditPBF");
    localStorage.removeItem("arrayListSimulasiKreditMotor");
    localStorage.removeItem("arrayListSimulasiKreditMachinery");
    console.log("Load Agunan Simulasi");
    doResetLocalStorage();
    var nilaiAjuan = $stateParams.nilaiAjuan; //.split(".").join("")
    valAjuan = agunanAjuan; //item.name
    if (valAjuan == "BPKB-Mobil") {
      getTenorMobil();
      tahunMobil();
      // $scope.tahunList = arrMobil;
      // $scope.form.tahunAjuan = $scope.tahunList;
      getBiayaAdminMobil(nilaiAjuan);
      $scope.element_kondisi        = "hidden";
      $scope.element_deposit        = "hidden";
      $scope.element_tahun          = "hidden";
      $scope.element_tahunkendaraan = "show";
      $scope.scopetahun             = "Tahun Kendaraan";
      $scope.disclaimer_motor       = "hidden";
      $scope.disclaimer_car         = "show";
      $scope.disclaimer_heto        = "hidden";
      $scope.disclaimer_machinery   = "hidden";
      $scope.disclaimer_sertifikat  = "hidden";
    } else if (valAjuan == "BPKB-Motor") {
      getTenorListMotor(nilaiAjuan);
      tahunMotor();
      // $scope.tahunList = arrMotor;
      // $scope.form.tahunAjuan = $scope.tahunList;
      $scope.element_kondisi        = "hidden";
      $scope.element_tahun          = "hidden";
      $scope.element_deposit        = "hidden";
      $scope.element_tahunkendaraan = "show";
      $scope.disclaimer_motor       = "show";
      $scope.disclaimer_car         = "hidden";
      $scope.disclaimer_heto        = "hidden";
      $scope.disclaimer_machinery   = "hidden";
      $scope.disclaimer_sertifikat  = "hidden";
    } else if (valAjuan == "Sertifikat Tanah dan Bangunan") {
      getPriceAmount();
      getListTenorSertifikatPBF();
      $scope.element_kondisi        = "hidden";
      $scope.element_tahun          = "hidden";
      $scope.element_deposit        = "hidden";
      $scope.element_tahunkendaraan = "hidden";
      $scope.disclaimer_motor       = "hidden";
      $scope.disclaimer_car         = "hidden";
      $scope.disclaimer_heto        = "hidden";
      $scope.disclaimer_machinery   = "hidden";
      $scope.disclaimer_sertifikat  = "show";
    } else if (valAjuan == "Invoice Alat Berat/BPKB Truk") {
      getKondisi("HETO");
      tahunHeto();
      // $scope.tahunList = arrHeto;
      // $scope.form.tahunAjuan = $scope.tahunList;
      // getKondisiHeto();
      $scope.element_tahun          = "hidden";
      $scope.element_kondisi        = "show";
      $scope.element_deposit        = "show";
      $scope.scopetahun             = "Tahun Unit";
      $scope.element_tahunkendaraan = "show";
      $scope.disclaimer_motor       = "hidden";
      $scope.disclaimer_car         = "hidden";
      $scope.disclaimer_heto        = "show";
      $scope.disclaimer_machinery   = "hidden";
      $scope.disclaimer_sertifikat  = "hidden";
    } else if (valAjuan == "Invoice Machinery") {
      getKondisi("MACHINERY");
      tahunMachinery();
      // $scope.tahunList = arrMachinery;
      // $scope.form.tahunAjuan = $scope.tahunList;
      // getKondisiMachinery();
      $scope.element_tahun          = "hidden";
      $scope.element_deposit        = "show";
      $scope.element_kondisi        = "show";
      $scope.disclaimer_car         = "hidden";
      $scope.element_tahunkendaraan = "show";
      $scope.scopetahun             = "Tahun Unit";
      $scope.disclaimer_motor       = "hidden";
      $scope.disclaimer_heto        = "hidden";
      $scope.disclaimer_sertifikat  = "hidden";
      $scope.disclaimer_machinery   = "show";
    } else {
      $scope.disclaimer_sertifikat  = "hidden";
      $scope.disclaimer_motor       = "hidden";
      $scope.disclaimer_heto        = "hidden";
      $scope.element_deposit        = "hidden";
      $scope.element_kondisi        = "hidden";
      $scope.disclaimer_car         = "hidden";
      $scope.element_tahun          = "hidden";
      $scope.disclaimer_machinery   = "hidden";
    }
    localStorage.setItem("agunanAjuan", valAjuan);
  }

  function loadfield() {
    $scope.element_mesin      = "hidden";
    $scope.element_kondisi    = "hidden";
    $scope.scopetahun         = "Tahun Kendaraan";
    $scope.element_tahun      = "hidden";
    // $scope.element_tahunkendaraan="hidden";
    $scope.disclaimer_motor   = "hidden";
    $scope.disclaimer_heto    = "hidden";
    $scope.disclaimer_car     = "hidden";
      $scope.element_deposit  = "hidden";
    $scope.disclaimer_machinery   = "hidden";
    $scope.disclaimer_sertifikat  = "hidden";
  }
  loadfield();

  function getBiayaAdminMobil(nilaiAjuan) {
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM parammobilfundingentity WHERE amountFrom <= (?) AND amountTo >= (?) AND rowstatus = 1",
          [nilaiAjuan, nilaiAjuan],
          function (tx, result) {
            if (result.rows.length > 0) {
              localStorage.setItem("biayaAdm", result.rows.item(0).amountAdmin);
            } else {
              db.transaction(
                function (tx2) {
                  tx2.executeSql(
                    "SELECT * FROM parammobilfundingentity WHERE amountFrom <= (?) AND amountTo = 0 AND rowstatus = 1",
                    [nilaiAjuan],
                    function (tx2, result2) {
                      if (result2.rows.length > 0) {
                        localStorage.setItem("biayaAdm", result2.rows.item(0).amountAdmin);
                      }
                    }
                  );
                },
                function (err) {
                  console.log("ERROR PROCESSING SELECT SQL parammobilfundingentity " + err.code);
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
        console.log("ERROR PROCESSING SELECT SQL parammobilfundingentity " + err.code);
      },
      function () {
        // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
      }
    );
  }
   var tenorListMotor = [];
  function getFidusiaMobil(nilaiAjuan) {
    // $http({
    //      method    : 'GET',
    //      url       : kvlUrl+'ParamMobilFidusiaAction?action=list-front-parammobilfidusia&nilaiAjuan='+nilaiAjuan
    //  })
    //   .success(function(result) {
    //        if (result.rows.length > 0) {
    //           localStorage.setItem("biayaFidusia",result.rows[0].amountFidusia);

    //        } else {
    //           console.log("Ada Kosong");
    //        }
    //  });
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM parammobilfidusiaentity WHERE amountFrom <= (?) AND amountTo >= (?) AND rowstatus = 1",
          [nilaiAjuan, nilaiAjuan],
          function (tx, result) {

            if (result.rows.length > 0) {

              localStorage.setItem("biayaFidusia", result.rows.item(0).amountFidusia);
              // console.log("Biaya Fidusia FidusiaEntity: "+result.rows.item(0).amountFidusia);

            } else {
              db.transaction(
                function (tx2) {
                  tx2.executeSql(
                    "SELECT * FROM parammobilfidusiaentity WHERE amountFrom <= (?) AND amountTo = 0 AND rowstatus = 1",
                    [nilaiAjuan],
                    function (tx2, result2) {

                      if (result2.rows.length > 0) {

                        localStorage.setItem("biayaFidusia", result2.rows.item(0).amountFidusia);
                        // console.log("Biaya Fidusia FidusiaEntity: "+result2.rows.item(0).amountFidusia);

                      }

                    }
                  );
                },
                function (err) {
                  console.log("ERROR PROCESSING SELECT SQL parammobilfidusiaentity " + err.code);
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
        console.log("ERROR PROCESSING SELECT SQL parammobilfidusiaentity " + err.code);
      },
      function () {
        // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
      }
    );
  }

  function loadFormHome() {
    var nilaiAjuan = $stateParams.nilaiAjuan;
    localStorage.setItem("nilaiAjuan", nilaiAjuan);
    $scope.form.nilaiAjuan = nilaiAjuan;
    $scope.form.nilaiAjuanMilik = nilaiAjuan;

    //get biaya admin
    getBiayaAdminMobil(nilaiAjuan);
    getFidusiaMobil(nilaiAjuan);

  }
  loadFormHome();

  function getTenorListMotor(nilaiAjuan) {

    console.log("Fix Tenor Simulasi Motor?");
  tenorListMotorNew= [];

    var idRatePinjaman = null;
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM parammotorentity WHERE amountFrom <= (?) AND amountTo >= (?) AND rowstatus = 1",
          [nilaiAjuan, nilaiAjuan],
          function (tx, result) {

            if (result.rows.length > 0) {

              idRatePinjaman = result.rows.item(0).id;
              // console.log(idRatePinjaman+ " === ");
              localStorage.setItem("idRatePinjaman", idRatePinjaman);

              // tenorListMotor(idRatePinjaman);
              $scope.tenorList = [];
              var tenorList = [];
              tenorList.push({
                  id : "",
                  idPinjaman : "",
                  biayaAdm : "",
                  tenor : "-- Pilih Jangka Waktu --",
                  tenorVal : "-- Pilih Jangka Waktu --",
                  rate : "",
                  rateProvisi : ""
              })
              BFIFINANCE.selectTenorListMotor(idRatePinjaman)
                .then(function (result) {
                  console.log(result);
                  for (var i = 0; i <= result.length - 1; i++) {
                    // console.log(result.item(i).id);
                    // $scope.tenorList.push({
                    //   id: result.item(i).id,
                    //   idPinjaman: result.item(i).idPinjaman,
                    //   biayaAdm: result.item(i).biayaAdm,
                    //   tenor: result.item(i).tenor,
                    //   rate: result.item(i).rate,
                    //   rateProvisi: result.item(i).rateProvisi
                    // });
                    tenorList.push({
                        id: result.item(i).id,
                        idPinjaman: result.item(i).idPinjaman,
                        biayaAdm: result.item(i).biayaAdm,
                        tenor: result.item(i).tenor,
                        tenorVal: result.item(i).tenor + " Bulan",
                        rate: result.item(i).rate,
                        rateProvisi: result.item(i).rateProvisi
                    })
                  }
                  $scope.tenorList = tenorList;
                  $scope.form.tenorAjuan = tenorList[0]; //$scope.tenorList;
                });

            } else {
              db.transaction(
                function (tx2) {
                  tx2.executeSql(
                    "SELECT * FROM parammotorentity WHERE amountFrom <= (?) AND amountTo = 0 AND rowstatus = 1",
                    [nilaiAjuan],
                    function (tx2, result2) {

                      if (result2.rows.length > 0) {

                        idRatePinjaman = result2.rows.item(0).id;
                        // console.log(idRatePinjaman+" /// ");
                        localStorage.setItem("idRatePinjaman", idRatePinjaman);

                        // tenorListMotor(idRatePinjaman);
                        $scope.tenorList = [];
                        var tenorList = [];
                        tenorList.push({
                            id : "",
                            idPinjaman : "",
                            biayaAdm : "",
                            tenor : "-- Pilih Jangka Waktu --",
                            tenorVal : "-- Pilih Jangka Waktu --",
                            rate : "",
                            rateProvisi : ""
                        })
                        BFIFINANCE.selectTenorListMotor(idRatePinjaman)
                          .then(function (result) {
                            console.log(result);
                            for (var i = 0; i <= result.length - 1; i++) {
                              // console.log(result.item(i).id);
                              // $scope.tenorList.push({
                              //   id: result.item(i).id,
                              //   idPinjaman: result.item(i).idPinjaman,
                              //   biayaAdm: result.item(i).biayaAdm,
                              //   tenor: result.item(i).tenor,
                              //   rate: result.item(i).rate,
                              //   rateProvisi: result.item(i).rateProvisi
                              // });
                              tenorList.push({
                                  id: result.item(i).id,
                                  idPinjaman: result.item(i).idPinjaman,
                                  biayaAdm: result.item(i).biayaAdm,
                                  tenor: result.item(i).tenor,
                                  tenorVal: result.item(i).tenor + " Bulan",
                                  rate: result.item(i).rate,
                                  rateProvisi: result.item(i).rateProvisi
                              })

                              tenorListMotorNew.push({
                                  id: result.item(i).id,
                                  idPinjaman: result.item(i).idPinjaman,
                                  biayaAdm: result.item(i).biayaAdm,
                                  tenor: result.item(i).tenor,
                                  tenorVal: result.item(i).tenor + " Bulan",
                                  rate: result.item(i).rate,
                                  rateProvisi: result.item(i).rateProvisi
                              })
                            }
                            $scope.tenorList = tenorList;
                            $scope.form.tenorAjuan = tenorList[0]; //$scope.tenorList;
                          });
                      }

                    }
                  );
                },
                function (err) {
                  console.log("ERROR PROCESSING SELECT SQL parammotordetailentity " + err.code);
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
        console.log("ERROR PROCESSING SELECT SQL parammotordetailentity " + err.code);
      },
      function () {
        // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
      }
    );
  }

  function getTenorMobil() {
  tenorListMobilNew = [];
    console.log("Fix Tenor Simulasi Mobil?");
    $scope.tenorList = [];      BFIFINANCE.selectTenorListMobil()
    .then(function (result) {
    console.log(result)
        if (result.length>0){
            var tenorList = [];
            tenorList.push({
                id : "",
                tenor : "-- Pilih Jangka Waktu mobil --",
                tenorVal : "-- Pilih Jangka Waktu mobil --",
                insuranceVal : "0"
            })
            for (var i = 0; i <= result.length - 1; i++) {
                // $scope.tenorList.push({
                //   id: result.item(i).id,
                //   tenor: result.item(i).tenor,
                //   insuranceVal: result.item(i).insuranceVal
                // });
                tenorList.push({
                    id: result.item(i).id,
                    tenor: result.item(i).tenor,
                    tenorVal : result.item(i).tenor+" Bulan",
                    insuranceVal: result.item(i).insuranceVal
                })

                tenorListMobilNew.push({
                    id: result.item(i).id,
                    tenor: result.item(i).tenor,
                    tenorVal : result.item(i).tenor+" Bulan",
                    insuranceVal: result.item(i).insuranceVal
                })
            }

            $scope.tenorList = tenorList;
            $scope.form.tenorAjuan = tenorList[0]; //$scope.tenorList;
        }

      });
  }

  $scope.doFocus = function (nilaiAjuan) {
    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
    if (nilaiAjuan == null) {
      nilaiAjuan = $scope.form.nilaiAjuan;
    } else {
      nilaiAjuan = nilaiAjuan;
    }
    var valNilai = nilaiAjuan; //.split(",").join("")
    $scope.form.nilaiAjuan = valNilai;
  }

  $scope.doBlur = function (nilaiAjuan) {
    // console.log("nilaiAjuan: "+nilaiAjuan);
    // $scope.form.nilaiAjuan = nilaiAjuan;
    //accounting.formatMoney(nilaiAjuan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
  }

  function getKondisi(agunanAjuan) {
    $scope.kondisiList = [];
    var kondisiList = [];
    kondisiList.push({
        id : "",
        category : "-- Pilih Kondisi --",
        idProperty : ""
    })
    BFIFINANCE.selectKondisiProperty(agunanAjuan)
      .then(function (result) {
        console.log(result);
        for (var i = 0; i <= result.length - 1; i++) {
          // $scope.kondisiList.push({
          //   id: result.item(i).id,
          //   category: result.item(i).category,
          //   idProperty: result.item(i).idProperty
          // });
          kondisiList.push({
              id: result.item(i).id,
              category: result.item(i).category,
              idProperty: result.item(i).idProperty
          })
        }
        $scope.kondisiList = kondisiList;
        $scope.form.kondisiAjuan = kondisiList[0];

        localStorage.setItem("idJenisAjuan", result.item(0).idProperty);
        localStorage.setItem("jenisAjuan", agunanAjuan);
      });
  }

  function getPriceAmount() {
    //ambil data nilai perkiraan
    // $http({
    //        method    : 'GET',
    //        url       : kvlUrl+'ParamSertifikatAction?action=list-front-paramsertifikat'
    //    })
    //     .success(function(result) {
    //          if (result.rows.length > 0) {
    //             localStorage.setItem("hargaPerkiraan",result.rows[0].priceAmount);
    //             localStorage.setItem("rateProvisi",result.rows[0].rateProvisi);
    //          } else {
    //             console.log("Ada Kosong");
    //          }
    //    });
    //ambil data nilai perkiraan
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM paramsertifikatentity",
          [],
          function (tx, result) {

            if (result.rows.length > 0) {
              localStorage.setItem("hargaPerkiraan", result.rows.item(0).priceAmount);
              localStorage.setItem("rateProvisi", result.rows.item(0).rateProvisi);
            }

          }
        );
      },
      function (err) {
        console.log("ERROR PROCESSING SELECT SQL paramsertifikatentity " + err.code);
      },
      function () {
        // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
      }
    );
  }

  // getKondisi();

  function getParamProperty(valKondisi, valProperty) {
    //ambil data perhitungan by kondisi name
    // $http({
    //      method    : 'GET',
    //      url       : kvlUrl+'ParamPropertyDetailAction?action=list-front-parampropertydetail&nameParent='+valKondisi+'&propertyName='+valProperty
    // })
    // .success(function(result) {
    //     if (result.rows.length > 0) {
    //         console.log(result);
    //         localStorage.setItem("securityDeposit", result.rows[0].securityDeposit);
    //         localStorage.setItem("pokokHutang", result.rows[0].pokokHutang);
    //         localStorage.setItem("bungaEfektif", result.rows[0].bungaEfektif);
    //         localStorage.setItem("bungaFlat", result.rows[0].bungaFlat);
    //         localStorage.setItem("provisiAdm", result.rows[0].provisiAdm);
    //         localStorage.setItem("asuransi", result.rows[0].asuransi);
    //     } else {
    //         console.log("Ada Kosong");
    // localStorage.setItem("securityDeposit", "0");
    // localStorage.setItem("pokokHutang", "0");
    // localStorage.setItem("bungaEfektif", "0");
    // localStorage.setItem("bungaFlat", "0");
    // localStorage.setItem("provisiAdm", "0");
    // localStorage.setItem("asuransi", "0");
    //     }
    // });
    //ambil data perhitungan by kondisi name
    console.log("Category: " + valKondisi.category);
    console.log("Property: " + valProperty);
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM paramhetocategoryentity WHERE category = (?) AND nameProperty = (?) AND rowstatus = 1",
          [valKondisi.category, valProperty],
          function (tx, result) {

            var id = result.rows.item(0).id;
            console.log(id);

            db.transaction(
              function (tx2) {
                tx2.executeSql(
                  "SELECT * FROM paramhetodetailentity WHERE idCategory = (?) AND rowstatus = 1",
                  [id],
                  function (tx2, result2) {

                    if (result.rows.length > 0) {
                      localStorage.setItem("securityDeposit", result2.rows.item(0).securityDeposit);
                      localStorage.setItem("pokokHutang", result2.rows.item(0).pokokHutang);
                      localStorage.setItem("bungaEfektif", result2.rows.item(0).bungaEfektif);
                      localStorage.setItem("bungaFlat", result2.rows.item(0).bungaFlat);
                      localStorage.setItem("provisiAdm", result2.rows.item(0).provisiAdm);
                      localStorage.setItem("asuransi", result2.rows.item(0).asuransi);

                      var nilaiAjuan = $stateParams.nilaiAjuan;
                      if (nilaiAjuan == null || nilaiAjuan === undefined){
                          $window.localStorage.getItem("nilaiAjuan");
                      }
                      var scDeposit  = (parseInt(result2.rows.item(0).securityDeposit)/100)*parseInt(nilaiAjuan);
                      $scope.form.securityDeposit = scDeposit;
                      localStorage.setItem("dpAjuan",scDeposit)

                    } else {
                      localStorage.setItem("securityDeposit", "0");
                      localStorage.setItem("pokokHutang", "0");
                      localStorage.setItem("bungaEfektif", "0");
                      localStorage.setItem("bungaFlat", "0");
                      localStorage.setItem("provisiAdm", "0");
                      localStorage.setItem("asuransi", "0");
                    }

                  }
                );
              },
              function (err2) {
                console.log("ERROR PROCESSING SELECT SQL paramhetodetailentity " + err2.code);
              },
              function () {
                // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
              }
            );

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
  }

  function getParamProperty2(valKondisi, valProperty, waktuAjuan) {
    //ambil data perhitungan by kondisi name
    // $http({
    //      method    : 'GET',
    //      url       : kvlUrl+'ParamPropertyDetailAction?action=list-front-parampropertydetail&nameParent='+valKondisi+'&propertyName='+valProperty
    // })
    // .success(function(result) {
    //     if (result.rows.length > 0) {
    //         console.log(result);
    //         localStorage.setItem("securityDeposit", result.rows[0].securityDeposit);
    //         localStorage.setItem("pokokHutang", result.rows[0].pokokHutang);
    //         localStorage.setItem("bungaEfektif", result.rows[0].bungaEfektif);
    //         localStorage.setItem("bungaFlat", result.rows[0].bungaFlat);
    //         localStorage.setItem("provisiAdm", result.rows[0].provisiAdm);
    //         localStorage.setItem("asuransi", result.rows[0].asuransi);
    //     } else {
    //         console.log("Ada Kosong");
    //         localStorage.setItem("securityDeposit", "0");
    //         localStorage.setItem("pokokHutang", "0");
    //         localStorage.setItem("bungaEfektif", "0");
    //         localStorage.setItem("bungaFlat", "0");
    //         localStorage.setItem("provisiAdm", "0");
    //         localStorage.setItem("asuransi", "0");
    //     }
    // });
    //ambil data perhitungan by kondisi name
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM paramhetocategoryentity WHERE category = (?) AND nameProperty = (?) AND rowstatus = 1",
          [valKondisi.category, valProperty],
          function (tx, result) {

            var id = result.rows.item(0).id;
            db.transaction(
              function (tx2) {
                tx2.executeSql(
                  "SELECT * FROM paramhetodetailentity WHERE idCategory = (?) AND rowstatus = 1",
                  [id],
                  function (tx2, result2) {

                    if (result.rows.length > 0) {
                      localStorage.setItem("securityDeposit", result2.rows.item(0).securityDeposit);
                      localStorage.setItem("pokokHutang", result2.rows.item(0).pokokHutang);
                      localStorage.setItem("bungaEfektif", result2.rows.item(0).bungaEfektif);
                      localStorage.setItem("bungaFlat", result2.rows.item(0).bungaFlat);
                      localStorage.setItem("provisiAdm", result2.rows.item(0).provisiAdm);
                      localStorage.setItem("asuransi", result2.rows.item(0).asuransi);

                      var nilaiAjuan = $stateParams.nilaiAjuan;
                      if (nilaiAjuan == null || nilaiAjuan === undefined){
                          $window.localStorage.getItem("nilaiAjuan");
                      }
                      var scDeposit  = (parseInt(result2.rows.item(0).securityDeposit)/100)*parseInt(nilaiAjuan);
                      $scope.form.securityDeposit = scDeposit;
                      console.log("111")

                    } else {
                      localStorage.setItem("securityDeposit", "0");
                      localStorage.setItem("pokokHutang", "0");
                      localStorage.setItem("bungaEfektif", "0");
                      localStorage.setItem("bungaFlat", "0");
                      localStorage.setItem("provisiAdm", "0");
                      localStorage.setItem("asuransi", "0");
                    }

                  }
                );
              },
              function (err2) {
                console.log("ERROR PROCESSING SELECT SQL paramhetodetailentity " + err2.code);
              },
              function () {
                // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
              }
            );

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
  }
  var tenorListMachineryNew = [];
  function getTenorProperty(valKondisi, valProperty) {
    $scope.tenorList = [];
    //ambil data tenor by kondisi name
    // $http({
    //     method    : 'GET',
    //     url       : kvlUrl+'ParamPropertyTenorAction?action=list-front-parampropertytenor&nameParent='+valKondisi+'&propertyName='+valProperty
    // })
    //  .success(function(result) {
    //       if (result.rows.length > 0) {
    //            $scope.tenorList = result.rows;
    //            // $scope.tenorAjuan = $scope.tenorList;
    //       } else {
    //          console.log("Ada Kosong");
    //       }
    // });
    //ambil data tenor by kondisi name
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM paramhetocategoryentity WHERE category = (?) AND nameProperty = (?) AND rowstatus = 1",
          [valKondisi.category, valProperty],
          function (tx, result) {

            var id = result.rows.item(0).id;
            console.log(id);

            var tenorList = [];
            tenorList.push({
                id : "",
                tenor : "-- Pilih Jangka Waktu --",
                tenorVal : "-- Pilih Jangka Waktu --"
            })

            BFIFINANCE.selectCategoryByID(id)
              .then(function (result2) {
                for (var ij = 0; ij <= result2.length - 1; ij++) {
                  // $scope.tenorList.push({
                  //   id: result2.item(ij).id,
                  //   tenor: result2.item(ij).tenor
                  // });
                  tenorList.push({
                      id: result2.item(ij).id,
                      tenor: result2.item(ij).tenor,
                      tenorVal: result2.item(ij).tenor + " Bulan"
                  })

                  tenorListMachineryNew.push({
                      id: result2.item(ij).id,
                      tenor: result2.item(ij).tenor,
                      tenorVal: result2.item(ij).tenor + " Bulan"
                  })
                }
                $scope.tenorList = tenorList;
                $scope.form.tenorAjuan = tenorList[0]; //$scope.tenorList;
              });
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
  }

   var tenorListAlatBeratNew = [];
  function getTenorProperty2(valKondisi, valProperty, waktuAjuan) {
    //ambil data tenor by kondisi name
    // $http({
    //     method    : 'GET',
    //     url       : kvlUrl+'ParamPropertyTenorAction?action=list-front-parampropertytenor&nameParent='+valKondisi+'&propertyName='+valProperty
    // })
    //  .success(function(result) {
    //       if (result.rows.length > 0) {
    //            $scope.tenorList = result.rows;
    //            $scope.tenorAjuan = waktuAjuan;
    //       } else {
    //          console.log("Ada Kosong");
    //       }
    // });
    //ambil data tenor by kondisi name
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM paramhetocategoryentity WHERE category = (?) AND nameProperty = (?) AND rowstatus = 1",
          [valKondisi.category, valProperty],
          function (tx, result) {

            var id = result.rows.item(0).id;
            console.log(id);

            var tenorList = [];
            tenorList.push({
                id : "",
                tenor : "-- Pilih Jangka Waktu --",
                tenorVal : "-- Pilih Jangka Waktu --"
            })

            BFIFINANCE.selectCategoryByID(id)
              .then(function (result2) {
                for (var ij = 0; ij <= result2.length - 1; ij++) {
                  // $scope.tenorList.push({
                  //   id: result2.item(ij).id,
                  //   tenor: result2.item(ij).tenor
                  // });
                  tenorList.push({
                      id: result2.item(ij).id,
                      tenor: result2.item(ij).tenor,
                      tenorVal: result2.item(ij).tenor + " Bulan"
                  })

                  tenorListAlatBeratNew.push({
                      id: result2.item(ij).id,
                      tenor: result2.item(ij).tenor,
                      tenorVal: result2.item(ij).tenor + " Bulan"
                  })
                }
                $scope.tenorList = tenorList;
                $scope.form.tenorAjuan = waktuAjuan;
              });

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
  }
  var tenorListSertifikatNew = [];
  function getListTenorSertifikatPBF() {
    console.log("TENOR AJUAN FOR PBF");

    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
    if (nilaiAjuan <= 100000000) {
      // console.log("TENOR KURANG");
      $scope.tenorList = [];
      var tenorList = [];
      tenorList.push({
          id : "",
          tenor : "-- Pilih Jangka Waktu --",
          tenorVal : " -- Pilih Jangka Waktu --"
      });
      BFIFINANCE.selectTenorListSertifikat()
        .then(function (result) {
          // console.log(result);
    tenorListSertifikatNew = [];
          for (var i = 0; i <= result.length - 1; i++) {
            // console.log(result[i].id);
            // console.log(result.item(i).tenor);

            if (result.item(i).tenor == "12" || result.item(i).tenor == "24" || result.item(i).tenor == "36" || result.item(i).tenor == "48" || result.item(i).tenor == "60"){
                // $scope.tenorList.push({
                //     id: result.item(i).id,
                //     tenor: result.item(i).tenor
                // })
                tenorList.push({
                    id: result.item(i).id,
                    tenor: result.item(i).tenor,
                    tenorVal : result.item(i).tenor + " Bulan"
                })

         tenorListSertifikatNew.push({
                    id: result.item(i).id,
                    tenor: result.item(i).tenor,
                    tenorVal : result.item(i).tenor + " Bulan"
                })

            }

          }
          $scope.tenorList = tenorList;
          $scope.form.tenorAjuan = tenorList[0]; //$scope.tenorList;

    console.log(tenorListSertifikatNew)

          // $scope.tenorList = result;
        });

    } else {
      // console.log("TENOR FULL");
      $scope.tenorList = [];
      var tenorList = [];
      tenorList.push({
          id : "",
          tenor : "-- Pilih Jangka Waktu --",
          tenorVal : " -- Pilih Jangka Waktu --"
      });
      BFIFINANCE.selectTenorListSertifikat()
        .then(function (result) {
          // console.log(result);
          // $scope.tenorList.push({
          //           id: "",
          //           tenor: "-- Pilih Tenor --"
          //       })
          for (var i = 0; i <= result.length - 1; i++) {
            // console.log(result[i].id);
            if (result.item(i).tenor == "12" || result.item(i).tenor == "24" || result.item(i).tenor == "36" || result.item(i).tenor == "48" || result.item(i).tenor == "60"){
                // $scope.tenorList.push({
                //     id: result.item(i).id,
                //     tenor: result.item(i).tenor
                // })
                tenorList.push({
                    id: result.item(i).id,
                    tenor: result.item(i).tenor,
                    tenorVal : result.item(i).tenor + " Bulan"
                })
            }

            // $scope.tenorList.push({
            //   id: result.item(i).id,
            //   tenor: result.item(i).tenor
            // })
          }
          $scope.tenorList = tenorList;
          $scope.form.tenorAjuan = tenorList[0]; //$scope.tenorList;
        });
    }

  }

  function getListTenorSertifikat() {
    //  $http({
    //     method    : 'GET',
    //     url       : kvlUrl+'ParamSertifikatTenorAction?action=list-front-paramsertifikattenor'
    // })
    //  .success(function(result) {
    //       if (result.rows.length > 0) {
    //         $scope.tenorList = result.rows;
    //         $scope.tenorAjuan = $scope.tenorList;

    //       } else {
    //          console.log("Ada Kosong");
    //       }
    // });

    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
    console.log(nilaiAjuan);
    if (nilaiAjuan <= 100000000) {
      console.log("TENOR KURANG");
      $scope.tenorList = [];
      BFIFINANCE.selectTenorListSertifikat()
        .then(function (result) {
          // console.log(result);

          for (var i = 0; i <= result.length - 1; i++) {
            // console.log(result[i].id);

            if (result.item(i).tenor == "48" || result.item(i).tenor == "60") {

            } else {
              $scope.tenorList.push({
                id: result.item(i).id,
                tenor: result.item(i).tenor
              })
            }

          }
          $scope.tenorAjuan = $scope.tenorList;
          // $scope.tenorList = result;
        });

    } else {
      console.log("TENOR FULL");
      $scope.tenorList = [];
      BFIFINANCE.selectTenorListSertifikat()
        .then(function (result) {
          // console.log(result);

          for (var i = 0; i <= result.length - 1; i++) {
            // console.log(result[i].id);

            $scope.tenorList.push({
              id: result.item(i).id,
              tenor: result.item(i).tenor
            })
          }
          $scope.tenorAjuan = $scope.tenorList;
          // $scope.tenorList = result;
        });
    }

  }

  $scope.doLoadMesinAjuan = function (mesinAjuan) {
    console.log("mesinAjuan: " + mesinAjuan);
    // localStorage.setItem("jenisAjuan",mesinAjuan);
    $scope.element_kondisi = "show";
    getKondisi(mesinAjuan);
  }

  var valKondisi = "";
  $scope.doLoadKondisiAjuan = function (kondisiAjuan) {
    console.log("FIX NIH???");
    localStorage.removeItem("asuransi");
    localStorage.removeItem("bungaEfektif");
    localStorage.removeItem("bungaFlat");
    localStorage.removeItem("provisiAdm");
    localStorage.removeItem("pokokHutang");
    localStorage.removeItem("securityDeposit");

    console.log(kondisiAjuan)
    var jenisAjuan = $window.localStorage.getItem("jenisAjuan");
    if(kondisiAjuan != null){

      localStorage.setItem("kondisiAjuan", kondisiAjuan.category);

      var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
      var waktuAjuan = $window.localStorage.getItem("tenor");

      // getTenorProperty2(kondisiAjuan, jenisAjuan, waktuAjuan);

      if (waktuAjuan == null) {
        getParamProperty(kondisiAjuan, jenisAjuan);
        getTenorProperty(kondisiAjuan, jenisAjuan);
      } else {
        getParamProperty2(kondisiAjuan, jenisAjuan, waktuAjuan)
        getTenorProperty2(kondisiAjuan, jenisAjuan, waktuAjuan);
        // doHitungAngsuranProperty(nilaiAjuan, waktuAjuan);
        doHitungAngsuranProperty(nilaiAjuan, waktuAjuan)
          .then(function (result) {
            $scope.form.angsuranAjuan = $filter('number')(result, 0);
          });
      }
    }

  }

  function doLoadNilaiAjuan(nilaiAjuan) {
      var nAjuan = nilaiAjuan.toString();
      var carichar = nAjuan.length - 5;
      var charst = nAjuan.charAt(carichar);
      var hs1 = nAjuan.charAt(carichar + 1);
      var hs2 = nAjuan.charAt(carichar + 2);
      var hs3 = nAjuan.charAt(carichar + 3);
      var hs4 = nAjuan.charAt(carichar + 4);
      var hasil1 = hs2 + "" + hs3 + "" + hs4;
      // console.log(hasil1);
      var ms1 = nAjuan.charAt(carichar - 7);
      var ms2 = nAjuan.charAt(carichar - 6);
      var ms3 = nAjuan.charAt(carichar - 5);
      var ms4 = nAjuan.charAt(carichar - 4);
      var ms5 = nAjuan.charAt(carichar - 3);
      var ms6 = nAjuan.charAt(carichar - 2);
      var ms7 = nAjuan.charAt(carichar - 1);
      var hasil3 = ms1 + "" + ms2 + "" + ms3 + "" + ms4 + "" + ms5 + "" + ms6 + "" + ms7;
      var hasil2 = ms1 + "" + ms2 + "" + ms3 + "" + ms4 + "" + ms5 + "" + ms6;
      // var ms8 = nAjuan.charAt(carichar - 8);
      // var ms9 = nAjua=n.charAt(carichar - 9);
      var hasilKk = charst + "" + hs1;
      var hasilFix;
      if (hasilKk == 00) {
          // console.log("Masuk sini");
          hasilFix = nilaiAjuan;
          // localStorage.setItem("nilaiAjuan",hasilFix);
      } else if (hasilKk <= 50 && hasilKk >= 00) {
        var joining = parseInt(hasilKk.replace(hasilKk, "50"));
        hasilFix = hasil3 + "" + joining + "" + hasil1;
        // localStorage.setItem("nilaiAjuan",hasilFix);
      } else {
        var nilaiMs = parseInt(ms7) + parseInt(1);
        var joining = parseInt(hs1.replace(hs1, "00"));
        hasilFix = hasil2 + "" + nilaiMs + "" + joining + "" + hasil1 + "0";
        // console.log(hasilFix);
        // localStorage.setItem("nilaiAjuan",hasilFix);
        // console.log("Naekinlah 1000");
      }
      $scope.form.nilaiAjuan = hasilFix;

  }

  var idRatePinjaman = 0;
  var tenor = 0;
  var rate = 0;
  var rateProvisi = 0;
  $scope.doBlurPinjaman = function (nilaiAjuan) {
    var nilaiAjuanaaa = $scope.form.nilaiAjuan;

    console.log("Fix Blur Pinjaman Simulasi?");

    // doLoadNilaiAjuan(nilaiAjuan);
    localStorage.removeItem("angsuranAjuan");
    localStorage.removeItem("nilaiAjuan");
    if (valAjuan == "BPKB-Motor") {
      doLoadNilaiAjuan(nilaiAjuan);
      var nilaiAjuanasli = $scope.form.nilaiAjuan;
      console.log(nilaiAjuanasli);
      //ambil amount
      getTenorListMotor(nilaiAjuanasli);
      localStorage.setItem("nilaiAjuan", nilaiAjuanasli);
      //ambil amount

      // hitung disini
      // doHitungAngsuranMotor(nilaiAjuanasli); //rate, rateProvisi, biayaAdm
      doHitungAngsuranMotor(nilaiAjuanasli)
        .then(function (result) {
          $scope.form.angsuranAjuan = $filter('number')(result, 0);
        });
      // hitung disini

    } else if (valAjuan == "Invoice Alat Berat/BPKB Truk") {
      localStorage.setItem("nilaiAjuan", nilaiAjuan);
      var waktuAjuan = $window.localStorage.getItem("tenor");

      var scDeposit = $window.localStorage.getItem("securityDeposit");
      var securityDeposit = ((parseInt(scDeposit)/100) * parseInt(nilaiAjuan));

      console.log(scDeposit);
      console.log(nilaiAjuan);
      console.log(securityDeposit);

      $scope.form.securityDeposit = securityDeposit;
      localStorage.setItem("dpAjuan",securityDeposit)

      // doHitungAngsuranProperty(nilaiAjuan, waktuAjuan);
      doHitungAngsuranProperty(nilaiAjuan, waktuAjuan).then(function (result) {
        $scope.form.angsuranAjuan = $filter('number')(result, 0);
      });

    } else if (valAjuan == "Invoice Machinery") {
      localStorage.setItem("nilaiAjuan", nilaiAjuan);
      var waktuAjuan = $window.localStorage.getItem("tenor");

      var scDeposit = $window.localStorage.getItem("securityDeposit");
      var securityDeposit = ((parseInt(scDeposit)/100) * parseInt(nilaiAjuan));

      $scope.form.securityDeposit = securityDeposit;

      localStorage.setItem("dpAjuan",securityDeposit)
      // doHitungAngsuranProperty(nilaiAjuan, waktuAjuan);
      doHitungAngsuranProperty(nilaiAjuan, waktuAjuan).then(function (result) {
        $scope.form.angsuranAjuan = $filter('number')(result, 0);
      });

    } else if (valAjuan == "Sertifikat Tanah dan Bangunan") {
      var tenorAjuan = $window.localStorage.getItem("idTenor");
      //ambil tenor
      //ambil tenor

      if (nilaiAjuan < 50000000) {
        $scope.showAlert({
          title: "Informasi",
          message: "Minimal Nilai Pembiayaan untuk Sertifikat Tanah dan Bangunan Rp50.000.000,"
        });
        $scope.form.nilaiAjuan = "";
      } else {
        console.log("Lanjut");
        localStorage.setItem("nilaiAjuan", nilaiAjuan);
        getListTenorSertifikatPBF();

        db.transaction(
          function (tx) {
            tx.executeSql(
              "SELECT * FROM paramsertifikatrateentity WHERE amountFrom <= (?) AND amountTo >= (?) AND idTenor = (?) AND rowstatus = 1",
              [nilaiAjuan, nilaiAjuan, tenorAjuan],
              function (tx, result) {
                console.log("paramsertifikatrateentity");
                console.log(result);
                if (result.rows.length > 0) {

                  localStorage.setItem("ratePerkiraan", result.rows.item(0).rate);
                  localStorage.setItem("tenor", result.rows.item(0).tenor);
                  doHitungAngsuranMobil(nilaiAjuanaaa)
                    .then(
                    function (Result) {
                      console.log(Result);
                      $scope.form.angsuranAjuan = $filter('number')(Result, 0);
                    }
                    );

                } else {
                  db.transaction(
                    function (tx2) {
                      tx2.executeSql(
                        "SELECT * FROM paramsertifikatrateentity WHERE amountFrom <= (?) AND amountTo = 0  AND idTenor = (?) AND rowstatus = 1",
                        [nilaiAjuan, tenorAjuan],
                        function (tx2, result2) {

                          if (result2.rows.length > 0) {

                            localStorage.setItem("ratePerkiraan", result.rows.item(0).rate);
                            localStorage.setItem("tenor", result.rows.item(0).tenor);
                            doHitungAngsuranMobil(nilaiAjuanaaa)
                              .then(
                              function (Result) {
                                console.log(Result);
                                $scope.form.angsuranAjuan = $filter('number')(Result, 0);
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
        localStorage.setItem("nilaiAjuan", nilaiAjuan);

        doHitungAngsuranMobil(nilaiAjuanaaa)
          .then(
          function (Result) {
            console.log(Result);
            $scope.form.angsuranAjuan = $filter('number')(Result, 0);
          }
          );
      }

    } else if (valAjuan == "BPKB-Mobil") {

      getBiayaAdminMobil(nilaiAjuan);
      getFidusiaMobil(nilaiAjuan);

      //ambil tenor
      getTenorMobil();
      localStorage.setItem("nilaiAjuan", nilaiAjuan);

      // doHitungAngsuranNDFMobil(nilaiAjuan);
      // doHitungAngsuranNDFMobil(nilaiAjuan)
      //   .then(function (result) {
      //     $scope.form.angsuranAjuan = $filter('number')(result, 0);
      //   });
      doHitungAngsuranNDFMobil(nilaiAjuan)
        .then(function (result) {
          $ionicLoading.hide();
          $scope.form.angsuranAjuan = $filter('number')(result, 0);
        });
    }

  }

  $scope.doBlurTahun = function (tahunAjuan) {
    console.log("Fix Blur Tahun Simulasi?");
    var tahunAjuan = tahunAjuan;
    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
    var agunanAjuan = $window.localStorage.getItem("agunanAjuan");
    var currentYear = new Date().getFullYear();
    var selisihYear = parseInt(currentYear) - parseInt(tahunAjuan);

    if (tahunAjuan > currentYear) {
      $scope.showAlert({
        title: "Information",
        message: "Tahun yang Anda masukkan tidak melebihi tahun sekarang"
      });
      $scope.form.tahunAjuan = "";
    } else {

      if (agunanAjuan == "BPKB-Mobil") {
        console.log("Tahun: "+tahunAjuan.tahun);
        localStorage.setItem("tahunAjuan", tahunAjuan.tahun);
        //get eff rate
        // if (selisihYear<=15){
        var tahunAjuan = $window.localStorage.getItem("tahunAjuan");
        var tenorVal = $window.localStorage.getItem("tenor");
        //get eff rate
        $http({
          method: 'GET',
          url: kvlUrlFinance + 'ParamMobilRateAction?action=list-front-parammobilrate&tenor=' + tenorVal,
          headers : localStorageTokenBearer()
        })
          .success(function (result) {
            console.log(result);
            if (result.rows.length > 0) {
              console.log(result.rows[0].id);
              var idParamMobilRateDetail = result.rows[0].id;

              $http({
                method: 'GET',
                url: kvlUrlFinance + 'ParamMobilRateDetailAction?action=list-front-parammobilratedetail&idParamMobilRateDetail=' + idParamMobilRateDetail + '&selisihYear=' + selisihYear,
                headers : localStorageTokenBearer()
              })
                .success(function (result2) {
                  if (result2.rows.length > 0) {
                    console.log(result2.rows[0].effRate);
                    localStorage.setItem("effRate", result2.rows[0].effRate);
                    // doHitungAngsuranNDFMobil(nilaiAjuan);
                    // doHitungAngsuranNDFMobil(nilaiAjuan)
                    //   .then(function (result) {
                    //     $scope.form.angsuranAjuan = $filter('number')(result, 0);
                    //   });
                    doHitungAngsuranNDFMobil(nilaiAjuan)
                      .then(function (result) {
                        $ionicLoading.hide();
                        $scope.form.angsuranAjuan = $filter('number')(result, 0);
                      });
                  } else {
                    console.log("Ada Kosong");
                  }
                });

            } else {
              console.log("Ada Kosong");
            }
          });

      } else if (agunanAjuan == "BPKB-Motor") {
            localStorage.setItem("tahunAjuan", tahunAjuan.tahun);

      } else if (agunanAjuan == "Invoice Machinery") {
        var selisihYear = parseInt(currentYear) - parseInt(tahunAjuan.tahun);
        if (selisihYear <= 5) {
          localStorage.setItem("tahunAjuan", tahunAjuan.tahun);
        } else {
          localStorage.removeItem("tahunAjuan");
          var shouldYear = parseInt(currentYear) - parseInt(5);
          // console.log(shouldYear);
          $scope.showAlert({
            title: "Information",
            message: "Minimal Tahun Unit " + shouldYear
          });
          $scope.form.tahunAjuan = "";
        }
      } else if (agunanAjuan == "Invoice Alat Berat/BPKB Truk") {
        var selisihYear = parseInt(currentYear) - parseInt(tahunAjuan.tahun);
        if (selisihYear <= 10) {
          localStorage.setItem("tahunAjuan", tahunAjuan.tahun);
        } else {
          localStorage.removeItem("tahunAjuan");
          var shouldYear = parseInt(currentYear) - parseInt(10);
          // console.log(shouldYear);
          $scope.showAlert({
            title: "Information",
            message: "Minimal Tahun Unit " + shouldYear
          });
          $scope.form.tahunAjuan = "";

        }
      }
    }
  }

  var getAllData = "";
  var arrayGetAllData = [];

  // $scope.doCalculationSimulation = function(){
  function doCalculationSimulation(){
    arrayGetAllData = [];

    if (valAjuan == "BPKB-Motor") {
        for (var i=0; i<=tenorListMotorNew.length-1; i++){
          doLoadHasilTenor(tenorListMotorNew[i], tenorListMotorNew[i].id, tenorListMotorNew[i].tenorVal);
        }

    } else if (valAjuan == "Invoice Alat Berat/BPKB Truk") {

        for (var kk=0; kk<=tenorListMachineryNew.length-1; kk++){
          doLoadHasilTenor(tenorListMachineryNew[kk], tenorListMachineryNew[kk].id, tenorListMachineryNew[kk].tenorVal);
          // console.log( tenorListMachineryNew[kk].tenorVal)
        }

    } else if (valAjuan == "Invoice Machinery") {

        for (var kk=0; kk<=tenorListMachineryNew.length-1; kk++){
          doLoadHasilTenor(tenorListMachineryNew[kk], tenorListMachineryNew[kk].id, tenorListMachineryNew[kk].tenorVal);
          // console.log( tenorListMachineryNew[kk].tenorVal)
        }
    } else if (valAjuan == "Sertifikat Tanah dan Bangunan") {
        var tenorProcess  = $filter('filter')(tenorListSertifikatNew, function (d) { return d.tenor != "60"; });
        var tenorProcess2 = $filter('filter')(tenorProcess, function (d) { return d.tenor != "48"; });

        for (var jj=0; jj<=tenorProcess2.length-1; jj++){
          doLoadHasilTenor(tenorProcess2[jj], tenorProcess2[jj].id, tenorProcess2[jj].tenorVal);
          // console.log( tenorProcess2[jj].tenorVal)
        }

    } else if (valAjuan == "BPKB-Mobil") {
        for (var ii=0; ii<=tenorListMobilNew.length-1; ii++){
          doLoadHasilTenor(tenorListMobilNew[ii], tenorListMobilNew[ii].id, tenorListMobilNew[ii].tenor);
        }

    }
    // console.log("==============-------------------------->>>")
    // console.log(arrayGetAllData);
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });

    $timeout(function () {
        $ionicLoading.hide();
          // console.log("==============-------------------------->>>")
          // console.log(arrayGetAllData);

          // var arrayNewMobil = [];

          // var tenor12 = $filter('filter')(arrayGetAllData, function (d) { return d.tenorVal == "12"; });
          // var tenor24 = $filter('filter')(arrayGetAllData, function (d) { return d.tenorVal == "24"; });
          // var tenor36 = $filter('filter')(arrayGetAllData, function (d) { return d.tenorVal == "36"; });
          // var tenor48 = $filter('filter')(arrayGetAllData, function (d) { return d.tenorVal == "48"; });

          // tenor12.sort(function(a, b){return b.angsuran - a.angsuran});
          // tenor24.sort(function(a, b){return b.angsuran - a.angsuran});
          // tenor36.sort(function(a, b){return b.angsuran - a.angsuran});
          // tenor48.sort(function(a, b){return b.angsuran - a.angsuran});

          // for (var i = 0; i< tenor12.length; i++) {
          //   arrayNewMobil.push({
          //       angsuran : tenor12[0].angsuran,
          //       tenorVal : tenor12[0].tenorVal
          //   })
          // }

        $state.go('app.likebfi-step-1');
        // $state.go('app.simulasikredit-finance-agunan');
    }, 1000);

  }

  $scope.doLoadTenor = function (tenor) {
  }

  function doLoadHasilTenor(tenor, idTenor, tenorVal){
      // console.log(tenor);
      // console.log(idTenor)
      // console.log("Fix Blur Tenor Simulasi?============");
      var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
      if (nilaiAjuan == null) {
        var valNilai = $scope.form.nilaiAjuan;
        nilaiAjuan = valNilai;
      }
      localStorage.setItem("idTenor", tenor.id);

      if (valAjuan == "BPKB-Motor") {
        db.transaction(
          function (tx) {
            tx.executeSql(
              "SELECT * FROM parammotordetailentity WHERE id = (?) AND rowstatus = 1",
              [idTenor],
              function (tx, result) {
                if (result.rows.length > 0) {
                  localStorage.setItem("rate", result.rows.item(0).rate);
                  localStorage.setItem("biayaAdm", result.rows.item(0).biayaAdm);
                  localStorage.setItem("rateProvisi", result.rows.item(0).rateProvisi);
                  localStorage.setItem("tenor", result.rows.item(0).tenor);

                  var rate    = result.rows.item(0).rate;
                  var rateProvisi = result.rows.item(0).rateProvisi;
                  var biayaAdm  = result.rows.item(0).biayaAdm;
                  var tenor     = result.rows.item(0).tenor;

                  doHitungAngsuranMotor(nilaiAjuan).then(function (result) {
                  // console.log("Result BPKB-Motor ::: "+result);
                  $scope.form.angsuranAjuan = $filter('number')(result, 0);
                  // console.log($scope.form.angsuranAjuan);

                  arrayGetAllData.push({
                      angsuran  : $scope.form.angsuranAjuan,
                      angsuranVal : result,
                      tenorVal  : tenor,
                      tenor  : tenor,
                      nilaiAjukan : nilaiAjuan,
                      rate    : rate,
                      biayaAdm  : biayaAdm,
                      rateProvisi : rateProvisi
                  })

                  localStorage.setItem("arrayListSimulasiKreditMotor", JSON.stringify(arrayGetAllData));
                  // localStorage.setItem("arrayListSimulasiKredit", JSON.stringify(arrayGetAllData));

                  });

                }

              }
            );
          },
          function (err) {
            console.log("ERROR PROCESSING SELECT SQL parammotordetailentity " + err.code);
          },
          function () {
            // console.log("SUCCESS PROCESSING SELECT SQL agunanentity");
          }
        );
        //ambil data rate
      } else if (valAjuan == "Invoice Alat Berat/BPKB Truk") {
        // console.log("==alat berat==???/")
        db.transaction(
          function (tx2) {
            // console.log("==========="+ tenor.id)
            tx2.executeSql(
              "SELECT * FROM paramhetotenorentity WHERE id = (?) and rowstatus = (?)",
              [tenor.id, 1],
              function (tx2, result2) {
                if (result2.rows.length > 0) {
                  localStorage.setItem("tenor", result2.rows.item(0).tenor);

                  var waktuAjuan = result2.rows.item(0).tenor;
                  //hitung disini
                  var nilaiProperty = $window.localStorage.getItem("nilaiAjuan");
                  // doHitungAngsuranProperty(nilaiProperty, waktuAjuan);
                  doHitungAngsuranProperty(nilaiProperty, waktuAjuan).then(function (result) {
                    // console.log("Result Invoice Alat Berat/BPKB Truk ::: "+result);
                    $scope.form.angsuranAjuan = $filter('number')(result, 0);
                    // console.log($scope.form.angsuranAjuan)
                    // console.log("===========================tenor fathur ========" + tenor)
                     arrayGetAllData.push({
                          angsuran    : $scope.form.angsuranAjuan,
                          angsuranVal : result,
                          tenorVal    : waktuAjuan,
                          tenor       : waktuAjuan,
                          nilaiAjukan : "",
                          rate        : "",
                          biayaAdm    : "",
                          rateProvisi : ""
                      });
                       localStorage.setItem("arrayListSimulasiKreditHeto", JSON.stringify(arrayGetAllData));
                       // localStorage.setItem("arrayListSimulasiKredit", JSON.stringify(arrayGetAllData));

                  });
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

      } else if (valAjuan == "Invoice Machinery") {
        // console.log(tenor.id);
        // console.log("TENOR MACHINER");
        //ambil data rate
        db.transaction(
          function (tx2) {
            tx2.executeSql(
              "SELECT * FROM paramhetotenorentity WHERE id = (?) AND rowstatus = 1",
              [tenor.id],
              function (tx2, result2) {
                if (result2.rows.length > 0) {
                  localStorage.setItem("tenor", result2.rows.item(0).tenor);
                  var waktuAjuan = result2.rows.item(0).tenor;

                  var tenor = result2.rows.item(0).tenor;
                  //hitung disini
                  var nilaiProperty = $window.localStorage.getItem("nilaiAjuan");
                  // doHitungAngsuranProperty(nilaiProperty, waktuAjuan);
                  doHitungAngsuranProperty(nilaiProperty, waktuAjuan).then(function (result) {
                    $scope.form.angsuranAjuan = $filter('number')(result, 0);
                    // console.log( $scope.form.angsuranAjuan);
                    // console.log("===========================tenor fathur ========" + tenor)
                     arrayGetAllData.push({
                          angsuran    : $scope.form.angsuranAjuan,
                          angsuranVal : result,
                          tenorVal    : tenor,
                          tenor      : tenor,
                          nilaiAjukan : "",
                          rate        : "",
                          biayaAdm    : "",
                          rateProvisi : ""
                      });

                      localStorage.setItem("arrayListSimulasiKreditMachinery", JSON.stringify(arrayGetAllData));
                      // localStorage.setItem("arrayListSimulasiKredit", JSON.stringify(arrayGetAllData));

                  });
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

      } else if (valAjuan == "Sertifikat Tanah dan Bangunan") {
        var nilaiAjuan222 = $window.localStorage.getItem("nilaiAjuan");
        db.transaction(
          function (tx) {
            var nilaiAjuanXX = $window.localStorage.getItem("nilaiAjuan");
            tx.executeSql(
              "SELECT * FROM paramsertifikatrateentity WHERE amountFrom <= (?) AND amountTo >= (?) AND idTenor = (?) AND rowstatus = 1",
              [nilaiAjuanXX, nilaiAjuanXX, tenor.id],
              function (tx, result) {

                if (result.rows.length > 0) {
                  localStorage.setItem("ratePerkiraan", result.rows.item(0).rate);
                  localStorage.setItem("tenor", result.rows.item(0).tenor);

                  var rate   =   result.rows.item(0).rate;
                  var tenor  =   result.rows.item(0).tenor;

                  doHitungAngsuranMobil(nilaiAjuanXX).then(
                    function (Result) {
                      // console.log(Result);
                      $scope.form.angsuranAjuan = $filter('number')(Result, 0);
                      // console.log("if")
                      // console.log($scope.form.angsuranAjuan);
                      var ckckc = 0;
                      var ckckc = $scope.form.angsuranAjuan;

                      // if(!$scope.form.angsuranAjuan){
                         arrayGetAllData.push({
                              angsuran    : $scope.form.angsuranAjuan,
                              angsuranVal : Result,
                              tenor       : tenor,
                              tenorVal    : tenor,
                              nilaiAjukan : "",
                              rate        : rate,
                              biayaAdm    : "",
                              rateProvisi : ""
                          })
                      // }

                      localStorage.setItem("arrayListSimulasiKreditPBF", JSON.stringify(arrayGetAllData));
                      // localStorage.setItem("arrayListSimulasiKredit", JSON.stringify(arrayGetAllData));

                    }
                  );

                } else {
                  db.transaction(
                    function (tx2) {
                          var nilaiAjuanYY = $window.localStorage.getItem("nilaiAjuan");
                          // console.log("=========nilaiAjuanYY else ==============="+ nilaiAjuanYY)
                      tx2.executeSql(
                        "SELECT * FROM paramsertifikatrateentity WHERE amountFrom <= (?) AND amountTo = 0  AND idTenor = (?) AND rowstatus = 1",
                        [nilaiAjuanYY, tenor.id],
                        function (tx2, result2) {
                          if (result2.rows.length > 0) {
                            console.log("MASUK SINI");

                            localStorage.setItem("ratePerkiraan", result2.rows.item(0).rate);
                            localStorage.setItem("tenor", result2.rows.item(0).tenor);
                            doHitungAngsuranMobil(nilaiAjuanYY).then(
                              function (Result) {
                                console.log(Result);
                                $scope.form.angsuranAjuan = $filter('number')(Result, 0);
                                  console.log("else")
                                  console.log($scope.form.angsuranAjuan)
                              }
                            );
                            // $scope.form.angsuranAjuan = $filter('number')(doHitungAngsuranMobil(nilaiAjuan222), 0);
                          }
                        }
                      );
                    },
                    function (err) {
                      console.log("ERROR PROCESSING SELECT SQL paramsertifikatrateentity " + err.code);
                    }
                  );
                }
              }
            );
          },
          function (err) {
            console.log("ERROR PROCESSING SELECT SQL paramsertifikatrateentity " + err.code);
          }
        );
        // $scope.tenorList = [];
        // getListTenorSertifikat();

        //doHitungAngsuranMobil(nilaiAjuan222);
        //ambil data rate
      } else if (valAjuan == "BPKB-Mobil") {
        //masukin tenor ke localstorage
        console.log(tenor);
        console.log(tenor.tenor);
        console.log(tenor.id);
        $http({
          method: 'GET',
          url: kvlUrlFinance + 'ParamMobilAsuransiAction?action=getTenorByID&tenorID=' + tenor.id,
          headers : localStorageTokenBearer()
        })
          .success(function (result) {
            if (result.rows.length > 0) {
              localStorage.setItem("tenor", result.rows[0].tenor);
              console.log(result.rows[0].tenor);

              var tenorVal = result.rows[0].tenor;
              getAsuransiJiwa(result.rows[0].tenor);
              getAsuransiKendaraan(result.rows[0].tenor);
              // doHitungAngsuranNDFMobil(nilaiAjuan);
              // doHitungAngsuranNDFMobil(nilaiAjuan).then(function (result) {
              //   $scope.form.angsuranAjuan = $filter('number')(result, 0);
              // });
              doHitungAngsuranNDFMobil(nilaiAjuan)
                                  .then(function (result) {
                                      $ionicLoading.hide();
                                      $scope.form.angsuranAjuan = $filter('number')(result, 0);
                                      // console.log("==============333====== "+tenorVal+":::"+$scope.form.angsuranAjuan)
                                      var str = $scope.form.angsuranAjuan;
                                      str = str.replace( /,/g, "" );
                                      arrayGetAllData.push({
                                            angsuran    : str,
                                            tenorVal    : tenorVal
                                      })
                                  });
              //ambil persen provisi by tenor
              $http({
                method: 'GET',
                url: kvlUrlFinance + 'ParamMobilProvisiAction?action=list-front-parammobilprovisi&tenorVal=' + tenorVal,
                headers : localStorageTokenBearer()
              })
                .success(function (result) {
                  if (result.rows.length > 0) {
                    var bProvisii = result.rows[0].rateProvisi;
                    console.log("bProvisii: " + bProvisii);
                    localStorage.setItem("rateProvisi", result.rows[0].rateProvisi);

                    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
                    var bProvisi = parseFloat(bProvisii) / 100;
                    var biayaProvisi = parseInt(nilaiAjuan) * parseFloat(bProvisi);

                    localStorage.setItem("biayaProvisi", biayaProvisi);
                    // doHitungAngsuranNDFMobil(nilaiAjuan);
                    // doHitungAngsuranNDFMobil(nilaiAjuan).then(function (result) {
                    //   $scope.form.angsuranAjuan = $filter('number')(result, 0);
                    // });
                    doHitungAngsuranNDFMobil(nilaiAjuan)
                                  .then(function (result) {
                                    $ionicLoading.hide();
                                    $scope.form.angsuranAjuan = $filter('number')(result, 0);
                                    // console.log("==============222======= "+tenorVal+":::"+$scope.form.angsuranAjuan)
                                    var str = $scope.form.angsuranAjuan;
                                      str = str.replace( /,/g, "" );
                                      arrayGetAllData.push({
                                            angsuran    : str,
                                            tenorVal    : tenorVal
                                      })
                                  });

                    //get eff rate
                    var tahunAjuan = $window.localStorage.getItem("tahunAjuan");
                    var currentYear = new Date().getFullYear();
                    var selisihYear = parseInt(currentYear) - parseInt(tahunAjuan);

                    //get eff rate
                    $http({
                      method: 'GET',
                      url: kvlUrlFinance + 'ParamMobilRateAction?action=list-front-parammobilrate&tenor=' + tenorVal,
                      headers : localStorageTokenBearer()
                    })
                      .success(function (result) {
                        if (result.rows.length > 0) {
                          var idParamMobilRateDetail = result.rows[0].id;
                          $http({
                            method: 'GET',
                            url: kvlUrlFinance + 'ParamMobilRateDetailAction?action=list-front-parammobilratedetail&idParamMobilRateDetail=' + idParamMobilRateDetail + '&selisihYear=' + selisihYear,
                            headers : localStorageTokenBearer()
                          })
                            .success(function (result2) {
                              if (result2.rows.length > 0) {
                                localStorage.setItem("effRate", result2.rows[0].effRate);
                                // doHitungAngsuranNDFMobil(nilaiAjuan);
                                // doHitungAngsuranNDFMobil(nilaiAjuan).then(function (result) {
                                //   $scope.form.angsuranAjuan = $filter('number')(result, 0);
                                // });
                                doHitungAngsuranNDFMobil(nilaiAjuan)
                                  .then(function (result) {
                                    $ionicLoading.hide();
                                    $scope.form.angsuranAjuan = $filter('number')(result, 0);
                                    console.log("==============111======= "+tenorVal+":::"+$scope.form.angsuranAjuan)
                                    var str = $scope.form.angsuranAjuan;
                                      str = str.replace( /,/g, "" );
                                      arrayGetAllData.push({
                                            angsuran    : str,
                                            tenorVal    : tenorVal
                                      })
                                  });
                              } else {
                                console.log("Ada Kosong");
                              }
                            });
                        } else {
                          console.log("Ada Kosong");
                        }
                      });
                  } else {
                    console.log("Ada Kosong");
                  }
                });
              //ambil persen provisi by tenor
            } else {
              console.log("Ada Kosong");
            }
          });
        // doHitungAngsuranNDFMobil(nilaiAjuan);
        doHitungAngsuranNDFMobil(nilaiAjuan)
                                  .then(function (result) {
                                    $ionicLoading.hide();
                                    $scope.form.angsuranAjuan = $filter('number')(result, 0);
                                    console.log("==================ALL============"+tenorVal+":::"+$scope.form.angsuranAjuan)

                                    // arrayGetAllData.push({
                                    //       angsuran   : $scope.form.angsuranAjuan,
                                    //       tenorVal   : tenorVal
                                    // })

                                  });
      }
  }

  //ambil asuransi kendaraan dan jiwa
  function getAsuransiJiwa(tenor) {
    // $http({
    //      method    : 'GET',
    //      url       : kvlUrl+'ParamMobilAsuransiAction?action=getAsuransiJiwa&tenor='+tenor
    //  })
    //   .success(function(result) {
    //        if (result.rows.length > 0) {
    //             localStorage.setItem("insuranceJiwa",result.rows[0].insuranceVal);
    //        } else {
    //           console.log("Ada Kosong");
    //        }
    //  });
    db.transaction(
      function (tx2) {
        tx2.executeSql(
          "SELECT * FROM parammobilasuransientity WHERE tenor = (?) AND rowstatus = 1",
          [tenor],
          function (tx2, result2) {

            if (result2.rows.length > 0) {
              console.log(result2.rows.item(0).insuranceVal + "     Insurance Kendaraan");
              localStorage.setItem("insuranceJiwa", result2.rows.item(0).insuranceVal);

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

  function getAsuransiKendaraan(tenor) {
    // $http({
    //      method    : 'GET',
    //      url       : kvlUrl+'ParamMobilAsuransiKendaraanAction?action=getAsuransiKendaraan&tenor='+tenor
    //  })
    //   .success(function(result) {
    //        if (result.rows.length > 0) {
    //             console.log("insuranceKendaraan: "+result.rows[0].insuranceVal);
    //             localStorage.setItem("insuranceKendaraan",result.rows[0].insuranceVal);
    //        } else {
    //           console.log("Ada Kosong");
    //        }
    //  });
    db.transaction(
      function (tx2) {
        tx2.executeSql(
          "SELECT * FROM parammobilasuransikendaraanentity WHERE tenor = (?) AND rowstatus = 1",
          [tenor],
          function (tx2, result2) {

            if (result2.rows.length > 0) {
              console.log(result2.rows.item(0).insuranceVal + "     Insurance Kendaraan");
              localStorage.setItem("insuranceKendaraan", result2.rows.item(0).insuranceVal);

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

  function doHitungAngsuranNDFMobil(nilaiAjuan) {
    console.log("nilaiAjuan=========");
    console.log(nilaiAjuan)
    var q = $q.defer();
    var biayaAdm = $window.localStorage.getItem("biayaAdm");
    var biayaFidusia = $window.localStorage.getItem("biayaFidusia");
    var biayaProvisi = $window.localStorage.getItem("biayaProvisi");
    var insuranceKendaraan = $window.localStorage.getItem("insuranceKendaraan");
    var insuranceJiwa = $window.localStorage.getItem("insuranceJiwa");
    var hargaKendaraan = 150000000;

     $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });

    // var nilaiAjuan         = $window.localStorage.getItem("nilaiAjuan");
    var waktuAjuan = $window.localStorage.getItem("tenor");
    var effRate = $window.localStorage.getItem("effRate");
    console.log("effRate: "+effRate);

    var ttlBiayaAdmin = parseInt(biayaAdm) + parseInt(biayaFidusia) + parseInt(biayaProvisi);
    // console.log("ttlBiayaAdmin: "+ttlBiayaAdmin);

    console.log(insuranceKendaraan);
    var ttlInsuranceKendaraan = parseInt(insuranceKendaraan) + parseInt(50000);
    // console.log("ttlInsuranceKendaraan: "+ttlInsuranceKendaraan);

    var ttlInsuranceJiwa = (parseFloat(insuranceJiwa) / 100) * parseInt(hargaKendaraan);
    // console.log("ttlInsuranceJiwa: "+ttlInsuranceJiwa);

    var ttlNTF = parseInt(nilaiAjuan) + parseInt(ttlBiayaAdmin); //+ parseInt(ttlInsuranceKendaraan) + parseInt(ttlInsuranceJiwa)
    // console.log("ttlNTF: "+ttlNTF);

    //get eff rate
    // var effRateFinal = ((parseInt(effRate) / 100) / 12);
    // console.log("effRate: "+effRate);
    // console.log("effRateFinal: "+effRateFinal);
    var effRateFinal = null;
    if (effRate == "0" || parseInt(effRate) == 0){
      effRateFinal = "0";
      console.log("effRateFinal00: "+effRateFinal);
    }else{
      effRateFinal = ((parseInt(effRate) / 100) / 12);
      console.log("effRateFinal11: "+effRateFinal);
    }

    var satuPlus = (parseInt(1) + parseFloat(effRateFinal));
    // console.log("satuPlus: "+satuPlus);

    var mathPow = Math.pow(satuPlus, parseInt(waktuAjuan));
    // console.log("mathPow: "+mathPow);

    var ntfeff = null;
    if (effRate == "0" || parseInt(effRate) == 0){
      ntfeff = (ttlNTF * mathPow);
    }else{
      ntfeff = (ttlNTF * effRateFinal * mathPow);
    }

    // console.log("ntfeff: "+ntfeff);

    var dudud = mathPow - parseInt(1);
    // console.log("Dudu: "+dudud);

    var hasilpmt = null;
    if (effRate == "0" || parseInt(effRate) == 0){
        hasilpmt = dudud.toFixed();
        console.log("hasilpmt00: "+hasilpmt);
    }else{
        hasilpmt = (ntfeff / dudud).toFixed();
        console.log("hasilpmt11: "+hasilpmt);
    }

    // console.log(hasilpmt);

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
      q.resolve(hasilFix);
      // $ionicLoading.hide();
      localStorage.setItem("angsuranAjuan", hasilFix);
      // $scope.form.angsuranAjuan = accounting.formatMoney(hasilFix , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;
    } else {
      var cicilAjuan = round2(hasilpmt, 3) / 1000;
      var rstCicilan = Math.ceil(cicilAjuan);
      var rstCicilan2 = Math.floor(cicilAjuan);
      var resultCicilan = rstCicilan * 1000;
      // console.log(resultCicilan);
      q.resolve(resultCicilan);
      // $ionicLoading.hide();
      localStorage.setItem("angsuranAjuan", resultCicilan);
      // $scope.form.angsuranAjuan = accounting.formatMoney(resultCicilan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
    }
    return q.promise;

  }
  function doHitungAngsuranMobil(nilaiAjuan) { //properti ini sih harusnya
      console.log("======nilaiAjuan=====")
      console.log(nilaiAjuan)
      var q = $q.defer();
      var hargaPerkiraan = $window.localStorage.getItem("hargaPerkiraan");
      var ratePerkiraan = $window.localStorage.getItem("ratePerkiraan");
      var rateProvisi = $window.localStorage.getItem("rateProvisi");
      var waktuAjuan = $window.localStorage.getItem("tenor");
      var ltv = (parseInt(nilaiAjuan) * parseInt(100)) / parseInt(hargaPerkiraan);

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

      // console.log("nilaiAjuan BPKB-Mobil: "+nilaiAjuan);
      // console.log("hargaPerkiraan: "+hargaPerkiraan);
      // console.log("ratePerkiraan: "+ratePerkiraan);
      // console.log("rateProvisi: "+rateProvisi);
      // console.log("LTV: "+ltv);
      // console.log("biayaAdm: "+biayaAdm);
      // console.log("waktuAjuan: "+waktuAjuan);

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

      var nilaiAngsuran = null;
      var hasil = 0;
      if (charst < 5 && charst > 0) {
        var joining = parseInt(charganti.replace(charganti, "500"));
        var hasilFix = charasli0 + "" + joining;
        console.log(hasilFix);
        q.resolve(hasilFix);
        hasil = hasilFix;
        //$scope.form.angsuranAjuan =  $filter('number')(hasilFix, 0);
        nilaiAngsuran = charasli0 + "" + joining;
        localStorage.setItem("angsuranAjuan", hasilFix);
        // $scope.form.angsuranAjuan = accounting.formatMoney(hasilFix , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;
      } else {
        var cicilAjuan = round2(hasilpmt, 3) / 1000;
        var rstCicilan = Math.ceil(cicilAjuan);
        var rstCicilan2 = Math.floor(cicilAjuan);
        var resultCicilan = rstCicilan * 1000;
        console.log(resultCicilan);
        hasil = resultCicilan;
        q.resolve(resultCicilan);
        //$scope.form.angsuranAjuan = $filter('number')(resultCicilan, 0);
        nilaiAngsuran = rstCicilan * 1000;
        localStorage.setItem("angsuranAjuan", resultCicilan);
        // $scope.form.angsuranAjuan = accounting.formatMoney(resultCicilan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
      }
      // $scope.form.angsuranAjuan = accounting.formatMoney(nilaiAngsuran , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;

      return q.promise;
      //return hasil;
      //$scope.form.angsuranAjuan =  $filter('number')(hasil, 0);
  }

  function doHitungAngsuranProperty(nilaiAjuan, waktuAjuan) {
    var q = $q.defer();
    var nilaiAjuan = nilaiAjuan;

    var nilaiAsuransi = $window.localStorage.getItem("asuransi");
    var nilaiBungaEfektif = $window.localStorage.getItem("bungaEfektif");
    var nilaiBungaFlat = $window.localStorage.getItem("bungaFlat");
    var nilaiPokokHutang = $window.localStorage.getItem("pokokHutang");
    var nilaiProvisiAdm = $window.localStorage.getItem("provisiAdm");
    var nilaiSecurityDeposit = $window.localStorage.getItem("securityDeposit");

    //RUMUS INI UNTUK YANG AT THE BEGINNING OF PERIODE (A,A,A,A,1)

    //get security deposit
    var ttlDeposit = (parseInt(nilaiSecurityDeposit) / 100) * parseInt(nilaiAjuan);
    // console.log("ttlDeposit: "+ttlDeposit);

    //get pokok hutang
    var ttlPokokHutang = parseInt(nilaiAjuan) - parseInt(ttlDeposit);
    // console.log("ttlPokokHutang: "+ttlPokokHutang);

    //get eff rate
    var effRateFinal = ((parseInt(nilaiBungaEfektif) / 100) / 12);
    // console.log("effRate: "+effRateFinal);

    //get ttl waktu dalam bulan
    //var ttlBulan  = parseInt(waktuAjuan) * parseInt(12);
    // console.log("ttlBulan: "+ttlBulan);

    // (P*i*(1+i)^n)/(((1+i)^n)-1)
    var satuPlus = (parseInt(1) + parseFloat(effRateFinal));
    // console.log("satuPlus: "+satuPlus);

    var mathPow = Math.pow(satuPlus, parseInt(waktuAjuan));
    // console.log("mathPow: "+mathPow);

    var ntfeff = (ttlPokokHutang * effRateFinal * mathPow);
    // console.log("ntfeff: "+ntfeff);

    var dudud = mathPow - parseInt(1);
    // console.log("Dudu: "+dudud+" ----- "+mathPow);

    var hasilpmt = (ntfeff / dudud).toFixed();
    // console.log(hasilpmt);

    var init = parseInt(1) + parseFloat(effRateFinal);

    var ttlHasil = (parseFloat(hasilpmt) / parseFloat(init)).toFixed();
    // console.log("ttlHasil: "+ttlHasil);

    var carichar = ttlHasil.length - 3;
    var charst = ttlHasil.charAt(carichar);
    var charsc = ttlHasil.charAt(carichar + 1);
    var chartd = ttlHasil.charAt(carichar + 2);
    var charganti = charst + "" + charsc + "" + chartd;
    var charasli = ttlHasil.charAt(carichar - 1);
    var charasli2 = ttlHasil.charAt(carichar - 2);
    var charasli3 = ttlHasil.charAt(carichar - 3);
    var charasli4 = ttlHasil.charAt(carichar - 4);
    var charasli5 = ttlHasil.charAt(carichar - 5);
    var charasli6 = ttlHasil.charAt(carichar - 6);
    var charasli0 = charasli6 + "" + charasli5 + "" + charasli4 + "" + charasli3 + "" + charasli2 + "" + charasli;

    if (charst < 5 && charst > 0) {
      var joining = parseInt(charganti.replace(charganti, "500"));
      var hasilFix = charasli0 + "" + joining;
      q.resolve(hasilFix);
      // console.log(hasilFix);
      localStorage.setItem("angsuranAjuan", hasilFix);
      // $scope.form.angsuranAjuan = accounting.formatMoney(hasilFix , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;
    } else {
      var cicilAjuan = round2(ttlHasil, 3) / 1000;
      var rstCicilan = Math.ceil(cicilAjuan);
      var rstCicilan2 = Math.floor(cicilAjuan);
      var resultCicilan = rstCicilan * 1000;
      q.resolve(resultCicilan);
      // console.log(resultCicilan);
      localStorage.setItem("angsuranAjuan", resultCicilan);
      // $scope.form.angsuranAjuan = accounting.formatMoney(resultCicilan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
    }
    return q.promise;
  }

  function doHitungAngsuranMotor(nilaiAjuan) { //rate, rateProvisi, biayaAdm
    var q = $q.defer();
    // console.log("nilaiAjuan: "+nilaiAjuan);
    // var nilaiAjuan  = $window.localStorage.getItem("nilaiAjuan");
    var agunanAjuan = $window.localStorage.getItem("agunanAjuan");
    var waktuAjuan = $window.localStorage.getItem("tenor");
    var biayaFidusia = 175000;

    rate = $window.localStorage.getItem("rate");
    rateProvisi = $window.localStorage.getItem("rateProvisi");
    biayaAdm = $window.localStorage.getItem("biayaAdm");

    //RUMUS INI UNTUK YANG AT THE BEGINNING OF PERIODE (A,A,A,A,0)

    //get NTF
    // var persentan = parseInt(1) - (parseInt(rateProvisi)/100);
    // console.log("Persen: "+persentan);
    var jmlNTF = parseInt(nilaiAjuan) + parseInt(biayaFidusia) + parseInt(biayaAdm);
    // console.log("Jumlah NTF: "+jmlNTF);
    var totalNTF = parseInt(jmlNTF) / (parseInt(1) - (parseInt(rateProvisi) / 100));
    // console.log("Total NTF: "+totalNTF);

    //get eff rate
    var effRateFinal = ((parseInt(rate) / 100) / 12);
    // console.log("effRate: "+effRateFinal);

    // (P*i*(1+i)^n)/(((1+i)^n)-1)
    var satuPlus = (parseInt(1) + parseFloat(effRateFinal));
    // console.log("satuPlus: "+satuPlus);

    var mathPow = Math.pow(satuPlus, parseInt(waktuAjuan));
    // console.log("mathPow: "+mathPow);

    var ntfeff = (totalNTF * effRateFinal * mathPow);
    // console.log("ntfeff: "+ntfeff);

    var dudud = mathPow - parseInt(1);
    // console.log("Dudu: "+dudud+" ----- "+mathPow);

    var hasilpmt = (ntfeff / dudud).toFixed();
    // console.log(hasilpmt);

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
      q.resolve(hasilFix);
      localStorage.setItem("angsuranAjuan", hasilFix);
      // $scope.form.angsuranAjuan = accounting.formatMoney(hasilFix , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;
    } else {
      var cicilAjuan = round2(hasilpmt, 3) / 1000;
      var rstCicilan = Math.ceil(cicilAjuan);
      var rstCicilan2 = Math.floor(cicilAjuan);
      var resultCicilan = rstCicilan * 1000;
      // console.log(resultCicilan);
      q.resolve(resultCicilan);
      localStorage.setItem("angsuranAjuan", resultCicilan);
      // $scope.form.angsuranAjuan = accounting.formatMoney(resultCicilan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
    }
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
  //PERHITUNGAN DF MOTOR

  function loadKreditKepemilikan() {
    // tahunMobilMilik();

    var dataLoad = localStorage.getItem("loadKreditKepemilikan");
    if(dataLoad != null && dataLoad !== ''){
    }else{
      $http({
        method: 'GET',
        url: kvlUrlFinance + 'ParamDFAction?action=getListMinimalDP&category=Mobil Penumpang',
        headers : localStorageTokenBearer()
      })
      .success(function (result) {
        localStorage.setItem("loadKreditKepemilikan", JSON.stringify(result));
        if (result.rows.length > 0) {
          localStorage.setItem("dpRate", result.rows[0].dpRate);

          var nilaiAjuan = $stateParams.nilaiAjuan;
          var dpMinimal = (parseInt(result.rows[0].dpRate) / 100) * parseInt(nilaiAjuan);
          // console.log(dpMinimal);
          $scope.form.dpAjuanMilik = dpMinimal;
          localStorage.setItem("dpAjuan", dpMinimal);

        } else {
          localStorage.setItem("dpRate", "0");
        }
      });
    }
  }
  loadKreditKepemilikan();
  function tahunMobilMilik() {
    var thnMax = 16;
    var thnSekarang = new Date().getFullYear();
    var arrMobil = [];
    arrMobil.push({
      id: "0",
      tahun: "-- Pilih Tahun Kendaraan --"
    })
    var thnMaksimal = parseInt(thnSekarang) - parseInt(thnMax);
    for (i = thnSekarang; i > thnMaksimal; i--) {
      // console.log(i);
      arrMobil.push({
        id: i,
        tahun: i
      })
    }
    // console.log(arrMobil);
    $scope.tahunListMilik = arrMobil;
    $scope.form.tahunAjuanMilik = arrMobil[0];
  }
  tahunMobilMilik();

  function getDPMinimal() {
    $http({
      method: 'GET',
      url: kvlUrlFinance + 'ParamDFAction?action=getListMinimalDP&category=Mobil Penumpang',
      headers : localStorageTokenBearer()
    })
      .success(function (result) {
        if (result.rows.length > 0) {
          localStorage.setItem("dpRate", result.rows[0].dpRate);

        } else {
          localStorage.setItem("dpRate", "0");
        }
      });
  }
  getDPMinimal();

  function listTenorMilik() {
    $http({
      method: 'GET',
      url: kvlUrlFinance + 'ParamDFTenorAction?action=list-front-tenor',
      headers : localStorageTokenBearer()
    })
      .success(function (result) {
        // console.log(result);
        var tenorListMilik = [];
        tenorListMilik.push({
          id: "-- Pilih Jangka Waktu --",
          category: "0",
          categoryID: "0",
          log: "0",
          rowstatus: "0",
          tenor: "-- Pilih Jangka Waktu --",
          value: "-- Pilih Jangka Waktu --"
        })
        if (result.rows.length > 0) {
          for (var i = 0; i <= result.rows.length - 1; i++) {
            tenorListMilik.push({
              id: result.rows[i].id,
              category: result.rows[i].category,
              categoryID: result.rows[i].categoryID,
              log: result.rows[i].log,
              rowstatus: result.rows[i].rowstatus,
              tenor: result.rows[i].tenor,
              value: result.rows[i].tenor + " Bulan"
            })
          }
          $scope.tenorMilikList = tenorListMilik;
          $scope.form.tenorAjuanMilik = tenorListMilik[0];
        } else {
          console.log("Ada Kosong");
        }
      });
  }
  listTenorMilik();

  function getDetailParamByTenor(nilaiAjuan, tenor) {
    console.log(tenor.id);
    // $ionicLoading.show({
    //   template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    // });

    $http({
      method: 'GET',
      url: kvlUrlFinance + 'ParamDFRateAction?action=list-front-paramdfrate&tenorID=' + tenor.id,
      headers : localStorageTokenBearer()
    })
      .success(function (result) {
        console.log(result);
        if (result.rows.length > 0) {
          console.log(result.rows);
          $ionicLoading.hide();
          localStorage.setItem("tenor", result.rows[0].tenor);
          localStorage.setItem("insuranceRate", result.rows[0].insuranceRate);
          localStorage.setItem("effRate", result.rows[0].effRate);
          localStorage.setItem("valTenor", result.rows[0].valTenor);

          var tenor = result.rows[0].tenor;
          var insuranceRate = result.rows[0].insuranceRate;
          var effRate = result.rows[0].effRate;
          var valTenor = result.rows[0].valTenor;

          perhitunganDFMobil(nilaiAjuan, tenor, insuranceRate, effRate, valTenor);

        } else {
          $ionicLoading.hide();
          localStorage.setItem("tenor", "0");
          localStorage.setItem("insuranceRate", "0");
          localStorage.setItem("effRate", "0");
          localStorage.setItem("valTenor", "0");
        }
      });

  }

  function doLoadDPAAjuan() {
    var nilaiAjuan = $scope.form.nilaiAjuanMilik;
    console.log(nilaiAjuan);
    if (nilaiAjuan == "" || nilaiAjuan == null || nilaiAjuan == undefined) {

      nilaiAjuan = $scope.form.nilaiAjuan;
      var dpRate = $window.localStorage.getItem("dpRate");
      var dpMinimal = (parseInt(dpRate) / 100) * parseInt(nilaiAjuan);
      // console.log(dpMinimal);
      $scope.form.dpAjuanMilik = dpMinimal;

    } else {
      var dpRate = $window.localStorage.getItem("dpRate");
      var dpMinimal = (parseInt(dpRate) / 100) * parseInt(nilaiAjuan);
      // console.log(dpMinimal);
      $scope.form.dpAjuanMilik = dpMinimal;
    }
  }

  $scope.doBlurPinjamaMilik = function (nilaiAjuan) {

    console.log("nilaiAjuan :: " + nilaiAjuan)
    localStorage.setItem("nilaiAjuan", nilaiAjuan);
    var dpRate = $window.localStorage.getItem("dpRate");
    // console.log(dpRate);

    var dpMinimal = (parseInt(dpRate) / 100) * parseInt(nilaiAjuan);
    // console.log(dpMinimal);
    $scope.form.dpAjuanMilik = dpMinimal;
    localStorage.setItem("dpAjuan", dpMinimal);
    // tahunMobilMilik();
    // perhitunganDFMobil(nilaiAjuan);

    // console.log("Nilai Ajuan Milik: "+nilaiAjuan);
    doResetAjuanMilik();
    listTenorMilik();
    // $scope.tahunListMilik = [];
    // tahunMobilMilik();

    // var nilaiAjuan = $scope.form.nilaiAjuanMilik;
    // var tenor = $window.localStorage.getItem("tenor");
    // var insuranceRate = $window.localStorage.getItem("insuranceRate");
    // var effRate = $window.localStorage.getItem("effRate");
    // var valTenor = $window.localStorage.getItem("valTenor");

    // perhitunganDFMobil(nilaiAjuan, tenor, insuranceRate, effRate, valTenor);

  }

  function doErrorDP(dpAjuan) {
    console.log("dpAjuan: " + dpAjuan);
    console.log("nilaiAjuan: " + $scope.form.nilaiAjuanMilik);
  }

  $scope.doBlurDPMilik = function (dpAjuan) {
    console.log('dpAjuan :: ' + dpAjuan);
    var nilaiAjuan = $scope.form.nilaiAjuanMilik;
    // console.log(nilaiAjuan);
    var dpRate = $window.localStorage.getItem("dpRate");
    var minDP = (parseInt(dpRate) / 100) * parseInt(nilaiAjuan);

    var tenor = $window.localStorage.getItem("tenor");
    var insuranceRate = $window.localStorage.getItem("insuranceRate");
    var effRate = $window.localStorage.getItem("effRate");
    var valTenor = $window.localStorage.getItem("valTenor");

    if (dpAjuan == "" || dpAjuan == null || dpAjuan === undefined) {
      console.log("DP Ajuan: " + dpAjuan);
      doLoadDPAAjuan();
      doErrorDP(dpAjuan);
    } else if (parseInt(dpAjuan) < parseInt(minDP)) {
      // var alertPopup = $ionicPopup.alert({
      //      title: 'Information',
      //      template: 'Total uang muka Anda masih lebih kecil dari minimum uang muka'
      //    });

      //   alertPopup.then(function(res) {
      //     // $scope.form.dpAjuan = "";
      //     doLoadDPAAjuan();

      //   });
      doLoadDPAAjuan();
      doErrorDP(dpAjuan);
    } else if (parseInt(dpAjuan) > parseInt(nilaiAjuan)) {
      // var alertPopup = $ionicPopup.alert({
      //    title: 'Information',
      //    template: 'Nilai DP tidak boleh lebih besar dari Nilai Ajuan'
      //  });

      // alertPopup.then(function(res) {
      //   // $scope.form.dpAjuan = "";
      //   doLoadDPAAjuan();
      // });
      doLoadDPAAjuan();
      doErrorDP(dpAjuan);
    } else {
      if (dpAjuan != "" || dpAjuan != "" || dpAjuan != "0" || dpAjuan != 0) {
        localStorage.setItem("dpAjuan", dpAjuan);
        // perhitunganDFMobil(nilaiAjuan);
        console.log("Masuk sini");
      } else {
        console.log("Tidak ada perhitungannye");
      }
    }

    doResetAjuanMilik();

    // var nilaiAjuan = $scope.form.nilaiAjuanMilik;
    // var tenor = $window.localStorage.getItem("tenor");
    // var insuranceRate = $window.localStorage.getItem("insuranceRate");
    // var effRate = $window.localStorage.getItem("effRate");
    // var valTenor = $window.localStorage.getItem("valTenor");

    // perhitunganDFMobil(nilaiAjuan, tenor, insuranceRate, effRate, valTenor);

  }

  $scope.doTahunMilik = function (tahunAjuan) {
    console.log(tahunAjuan.tahun);
    var nilaiAjuan = $scope.form.nilaiAjuanMilik;
    localStorage.setItem("tahunAjuan", tahunAjuan.tahun);

    // perhitunganDFMobil(nilaiAjuan);
    // doResetAjuanMilik();

    var nilaiAjuan = $scope.form.nilaiAjuanMilik;
    var tenor = $window.localStorage.getItem("tenor");
    var insuranceRate = $window.localStorage.getItem("insuranceRate");
    var effRate = $window.localStorage.getItem("effRate");
    var valTenor = $window.localStorage.getItem("valTenor");

    perhitunganDFMobil(nilaiAjuan, tenor, insuranceRate, effRate, valTenor);

  }

  $scope.doTenorMilik = function (tenor) {
    var nilaiAjuan = $scope.form.nilaiAjuanMilik;
    getDetailParamByTenor(nilaiAjuan, tenor);
    // localStorage.setItem("tenor",tenor);

    // perhitunganDFMobil(nilaiAjuan);
  }

  function doResetAjuanMilik() {
    $scope.form.angsuranAjuanMilik = "0";
    localStorage.setItem("angsuranAjuan", "0");
    tahunMobilMilik();

    $http({
      method: 'GET',
      url: kvlUrlFinance + 'ParamDFTenorAction?action=list-front-tenor',
      headers : localStorageTokenBearer()
    })
      .success(function (result) {
        var tenorListMilik = [];
        tenorListMilik.push({
          id: "-- Pilih Jangka Waktu --",
          category: "0",
          categoryID: "0",
          log: "0",
          rowstatus: "0",
          tenor: "-- Pilih Jangka Waktu --",
          value: "-- Pilih Jangka Waktu --"
        })
        if (result.rows.length > 0) {
          for (var i = 0; i <= result.rows.length - 1; i++) {
            tenorListMilik.push({
              id: result.rows[i].id,
              category: result.rows[i].category,
              categoryID: result.rows[i].categoryID,
              log: result.rows[i].log,
              rowstatus: result.rows[i].rowstatus,
              tenor: result.rows[i].tenor,
              value: result.rows[i].tenor + " Bulan"
            })
          }
          $scope.tenorMilikList = tenorListMilik;
          $scope.form.tenorAjuanMilik = tenorListMilik[0];
        } else {
          console.log("Ada Kosong");
        }
      });

    //remove localstorage
    localStorage.removeItem("tenor");
    localStorage.removeItem("insuranceRate");
    localStorage.removeItem("effRate");
    localStorage.removeItem("valTenor");
  }

  function perhitunganDFMobil(nilaiAjuan, tenorAjuan, insuranceRate, effRate, valTenor) {
    var biayaAdm = 2750000;
    var biayaProvisi = 850000;
    var dpAjuan = $window.localStorage.getItem("dpAjuan");

    // var tenorAjuan = $window.localStorage.getItem("tenor");
    // var valAsuransi = $window.localStorage.getItem("insuranceRate");
    // var rateVal  = $window.localStorage.getItem("effRate");
    // var tenorVal = $window.localStorage.getItem("valTenor");

    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });

    var dpRate = $window.localStorage.getItem("dpRate");
    var minDP = (parseInt(dpRate) / 100) * parseInt(nilaiAjuan);
    // console.log("Minimal DP: "+minDP);

    var maksAjuan = (parseFloat(0.85) * parseInt(nilaiAjuan));
    // console.log("Nilai Maksimal: "+maksAjuan);

    var nilaiNtf = parseInt(nilaiAjuan) - parseInt(minDP);
    // console.log("NTF Murni: "+nilaiNtf);

    var biayaAss = ((parseFloat(insuranceRate) / 100) * parseInt(nilaiNtf)).toFixed();
    // console.log("biayaAss: "+biayaAss);
    var biayaAsuransi = ceilAngular(biayaAss);
    // console.log("Biaya Asuransi: "+biayaAsuransi);

    var hasilRate = (parseFloat(effRate) * parseInt(valTenor)) / 100;
    // console.log("HasilRate: "+hasilRate);

    var nilaii = parseInt(1) + parseFloat(hasilRate);
    // console.log("nilaii: "+nilaii);

    var nilaiii = parseFloat(nilaii) * parseInt(maksAjuan);
    // console.log("nilaiii: "+nilaiii);

    var nilaiiii = (parseFloat(nilaiii) / parseInt(tenorAjuan)).toFixed();
    // console.log("nilaiiii: "+nilaiiii);

    $scope.form.angsuranAjuanMilik = accounting.formatMoney(ceilAngular(nilaiiii), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
    localStorage.setItem("angsuranAjuan", ceilAngular(nilaiiii));

    $ionicLoading.hide();

  }
  //PERHITUNGAN DF MOTOR

  $scope.doAjuanAgunan = function () {
    localStorage.setItem("nilaiAjuan", $scope.form.nilaiAjuan);
    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
    var angsuranAjuan = $window.localStorage.getItem("angsuranAjuan");
    var agunanAjuan = $window.localStorage.getItem("agunanAjuan");
    var waktuAjuan = $window.localStorage.getItem("tenor");
    var tahunAjuan = $window.localStorage.getItem("tahunAjuan");

    var nilaiAngsuran = $scope.angsuranAjuan;
    console.log(parseInt($scope.form.nilaiAjuan));

    if (agunanAjuan == "Sertifikat Tanah dan Bangunan" && parseInt($scope.form.nilaiAjuan) < 50000000){
			$scope.form.nilaiAjuan = "";
			console.log("Nilai Ajuan Salah");
    }else{
			if (!$scope.form.agunanAjuan || agunanAjuan == null) {
				$scope.showAlert({
				title: "Information",
				message: "Mohon maaf, Pilih agunan terlebih dahulu"
				});
			}
			else if (!$scope.form.nilaiAjuan || nilaiAjuan == null) {
				$scope.showAlert({
					title: "Information",
					message: "Mohon maaf, Masukkan nilai pembiayaan terlebih dahulu"
				});
			}
			else if (!$scope.form.tahunAjuanMilik || tahunAjuan == null) {
				$scope.showAlert({
					title: "Information",
					message: "Mohon maaf, Masukkan Tahun Kendaraan terlebih dahulu"
				});
			}
			// } else if (!$scope.form.tenorAjuan || waktuAjuan == null) {
			//  $scope.showAlert({
			//  title: "Information",
			//  message: "Mohon maaf, Pilih waktu pembiayaan terlebih dahulu"
			//  });
			// } else if (!$scope.form.angsuranAjuan || angsuranAjuan == null) {
			//  $scope.showAlert({
			//  title: "Information",
			//  message: "Mohon maaf, Angsuran masih kosong"
			//  });
			// } else if ($scope.form.angsuranAjuan == 0 || angsuranAjuan == "0" || angsuranAjuan == 0) {
			//  $scope.showAlert({
			//  title: "Information",
			//  message: "Mohon maaf, Sesuaikan jangka waktu dan tahun kendaraan Anda"
			//  });
			// } else if ($scope.form.angsuranAjuan == "0") {
			//  $scope.showAlert({
			//  title: "Information",
			//  message: "Mohon maaf, Sesuaikan jangka waktu dan tahun kendaraan Anda"
			//  });
			else {
				//tes disini
				// $scope.tenorList           = {};
				// $scope.kondisiList         = {};
				// $scope.form.agunanAjuan    = {};
				// $scope.form.angsuranAjuan  = "";
				// $scope.form.tenorAjuan     = {};
				// $scope.form.kondisiAjuan   = {};
				// $scope.form.nilaiAjuan     = "";
				// $scope.form.tahunAjuan     = "";

				var storage = $window.localStorage.getItem("CUSTOMER");
				var nilaiVal = $window.localStorage.getItem("nilaiAjuan");
				// $state.go('app.ajukanaplikasi', { url: '/ajukanaplikasi', nilaiAjuan : nilaiVal });

				if ($scope.form.agunanAjuan == "Sertifikat Tanah dan Bangunan" || $scope.form.agunanAjuan == "Invoice Machinery" || $scope.form.agunanAjuan == "BPKB-Mobil" || $scope.form.agunanAjuan == "BPKB-Motor" || $scope.form.agunanAjuan == "Invoice Alat Berat/BPKB Truk"){

						$ionicLoading.show({
								template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
						});

						$timeout(function () {
								$ionicLoading.hide();
								$state.go('app.simulasikredit-finance-agunan', { url: '/app.simulasikredit-finance-agunan' });
						}, 1000);

				}else{
						// doCalculationSimulation();

				}

				//

			}
    }

  }

  $scope.doAjuanPemilikan = function () {
      if (!$scope.form.dpAjuanMilik) {
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, Nilai Ajuan Anda masih kosong"
          });
      } else if (!$scope.form.dpAjuanMilik) {
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, DP Ajuan Anda masih kosong"
          });
      } else if (!$scope.form.dpAjuanMilik) {
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, Tahun Ajuan Anda masih kosong"
          });
      } else if (!$scope.form.tenorAjuanMilik) {
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, Tenor Ajuan Anda masih kosong"
          });
      } else if (!$scope.form.angsuranAjuanMilik) {
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, Angsuran Ajuan Anda masih kosong"
          });
      } else {
        // $scope.form.nilaiAjuan     = "";
        // $scope.form.tahunAjuan     = "";
        // $scope.form.dpAjuan        = "";
        // $scope.form.waktuAjuan     = {};
        // $scope.form.angsuranAjuan  = "";
        $scope.disclaimer_motor = "hidden";

        localStorage.setItem("jenisAjuan", "-");
        localStorage.setItem("kondisiAjuan", "-");
        localStorage.setItem("agunanAjuan", "-");
        // localStorage.setItem("dpAjuan","0");

        // $state.go('app.simulasikredit-pemohon', { url: '/simulasikredit-pemohon' });

        $state.go('app.simulasikredit-finance', { url: '/simulasikredit-finance' });

      }
    }

})
