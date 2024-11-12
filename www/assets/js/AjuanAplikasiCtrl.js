app.controller('AjuanAplikasiCtrl', function ($scope, $http, $state, $window, $stateParams, BFIFINANCE, $q) {
  // $scope.scopetahun = "Tahun Kendaraan";

  var angsuranAjuan = $window.localStorage.getItem("angsuranAjuan");
  var agunanAjuan = $window.localStorage.getItem("agunanAjuan");
  var waktuAjuan = $window.localStorage.getItem("tenor");
  var tahunAjuan = $window.localStorage.getItem("tahunAjuan");
  var kondisiAjuan = $window.localStorage.getItem("kondisiAjuan");
  var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
  var jenisAjuan = $window.localStorage.getItem("jenisAjuan");
  var idJenis = $window.localStorage.getItem("idJenisAjuan");

  var thnSekarang = new Date().getFullYear();
  var arrMotor = [];
  var arrMobil = [];
  function tahunMotor() {
    var thnMax = 10;
    var thnMaksimal = parseInt(thnSekarang) - parseInt(thnMax);
    for (i = thnSekarang; i > thnMaksimal; i--) {
      var pushMotorArray = {
        tahun: i
      }
      arrMotor.push(pushMotorArray);
    }
  }

  function tahunMobil() {
    var thnMax = 15;
    var thnMaksimal = parseInt(thnSekarang) - parseInt(thnMax);
    for (i = thnSekarang; i > thnMaksimal; i--) {
      var pushMobilArray = {
        tahun: i
      }
      arrMobil.push(pushMobilArray);
    }

  }

  var valAjuan = $stateParams.nilaiAjuan;
  // console.log(valAjuan);
  if (valAjuan == null || valAjuan == undefined || valAjuan == "") {
    // console.log("Masuk Sini?????");
    // $scope.disabled_kondisi = "false";
  } else {
    // console.log("Masuk Sini!!!!!");
    if (agunanAjuan == "Invoice Alat Berat/BPKB Truk" || agunanAjuan == "Invoice Machinery") {
      $scope.disabled_tahunAjuan = "true";
      $scope.kondisiAjuan = kondisiAjuan;
      $scope.disabled_kondisiAjuan = "true";
    }

    $scope.disabled_agunanAjuan = "false";
    $scope.disabled_nilaiAjuan = "false";
    $scope.disabled_waktuAjuan = "false";
  }

  function getTenorMobil() {
    $scope.tenorList = [];
    BFIFINANCE.selectTenorListMobil()
      .then(function (result) {
        for (var i = 0; i <= result.length - 1; i++) {
          $scope.tenorList.push({
            id: result[i].id,
            tenor: result[i].tenor
          });
        }
        $scope.form.tenorAjuan = $scope.tenorList;
      });
  }

  function getLocalstorage() {
    if (tahunAjuan != null || tahunAjuan != undefined || tahunAjuan != "undefined") {
      $scope.tahunAjuan = tahunAjuan;
    } else {
      $scope.tahunAjuan = "0";
    }

    if (angsuranAjuan != null || angsuranAjuan != undefined || angsuranAjuan != "undefined") {
      $scope.angsuranAjuan = accounting.formatMoney(angsuranAjuan, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
    } else {
      $scope.angsuranAjuan = "0";
    }

    if (waktuAjuan != null || waktuAjuan != undefined || waktuAjuan != "undefined") {
      $scope.waktuAjuan = waktuAjuan;
    } else {
      $scope.waktuAjuan = "0";
    }

    if (nilaiAjuan != null || nilaiAjuan != undefined || nilaiAjuan != "undefined") {
      $scope.nilaiAjuan = nilaiAjuan;
      //accounting.formatMoney(nilaiAjuan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
    } else {
      $scope.nilaiAjuan = "0";
    }
  }
  getLocalstorage();

  function getAgunan() {
    $scope.agunanList = [];
    if (agunanAjuan == null) {
      BFIFINANCE.selectAgunan()
        .then(function (result) {
          console.log(result)
          for (var i = 0; i <= result.length - 1; i++) {
            $scope.agunanList.push({
              id: result[i].id,
              name: result[i].name,
              code: result[i].code,
              log: result[i].log
            })
          }
          $scope.agunanAjuan = $scope.agunanList;
        });
    } else {
      BFIFINANCE.selectAgunan()
        .then(function (result) {
          console.log(result)
          for (var i = 0; i <= result.length - 1; i++) {
            $scope.agunanList.push({
              id: result[i].id,
              name: result[i].name,
              code: result[i].code,
              log: result[i].log
            })
          }
          $scope.agunanAjuan = agunanAjuan;
        });
    }
  }
  getAgunan();

  function getJenisAjuan() {
    if (jenisAjuan == null) {
      $http({
        method: 'GET',
        url: kvlUrlFinance + 'ParamPropertyMesinAction?action=list-front-parampropertymesin',
        headers : localStorageTokenBearer()
      })
        .success(function (result) {
          if (result.rows.length > 0) {
            $scope.mesinList = result.rows;
            // $scope.kondisiAjuan = $scope.kondisiList;
          } else {
            console.log("Ada Kosong");
          }
        });
    } else {
      $scope.element_kondisi = "show";
      $http({
        method: 'GET',
        url: kvlUrlFinance + 'ParamPropertyMesinAction?action=list-front-parampropertymesin',
        headers : localStorageTokenBearer()
      })
        .success(function (result) {
          if (result.rows.length > 0) {
            $scope.mesinList = result.rows;
            $scope.mesinAjuan = jenisAjuan;

            getKondisi(idJenis);

            if (waktuAjuan == null) {
              getParamProperty(kondisiAjuan, jenisAjuan);
              getTenorProperty(kondisiAjuan, jenisAjuan);
            } else {
              getParamProperty2(kondisiAjuan, jenisAjuan, waktuAjuan);
              getTenorProperty2(kondisiAjuan, jenisAjuan, waktuAjuan);
            }

          } else {
            console.log("Ada Kosong");
          }
        });
    }
  }
  getJenisAjuan();

  function getKondisi(mesinAjuan) {

    //ambil list kondisi heto
    $scope.kondisiList = [];
    BFIFINANCE.selectKondisiProperty(agunanAjuan)
      .then(function (result) {
        console.log(result);
        for (var i = 0; i <= result.length - 1; i++) {
          $scope.kondisiList.push({
            id: result[i].id,
            category: result[i].category,
            idProperty: result[i].idProperty
          });
        }
        $scope.form.kondisiAjuan = $scope.kondisiList;

        localStorage.setItem("idJenisAjuan", result[0].idProperty);
        localStorage.setItem("jenisAjuan", agunanAjuan);
      });
  }

  function loadFirst() {
    $scope.scopetahun = "Tahun Kendaraan"
  }
  loadFirst();

  var valKondisi = "";
  $scope.doLoadKondisiAjuan = function (kondisiAjuan) {
    localStorage.removeItem("asuransi");
    localStorage.removeItem("bungaEfektif");
    localStorage.removeItem("bungaFlat");
    localStorage.removeItem("provisiAdm");
    localStorage.removeItem("pokokHutang");
    localStorage.removeItem("securityDeposit");

    var jenisAjuan = $window.localStorage.getItem("jenisAjuan");
    localStorage.setItem("kondisiAjuan", kondisiAjuan.category);

    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
    var waktuAjuan = $window.localStorage.getItem("tenor");
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

  $scope.doLoadMesinAjuan = function (mesinAjuan) {
    console.log("mesinAjuan: " + mesinAjuan);
    // localStorage.setItem("jenisAjuan",mesinAjuan);
    $scope.element_kondisi = "show";
    getKondisi(mesinAjuan);
  }

  function getParamProperty(valKondisi, valProperty) {
    //ambil data perhitungan by kondisi name
    console.log("Category: " + valKondisi);
    console.log("Property: " + valProperty);
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM paramhetocategoryentity WHERE category = (?) AND nameProperty = (?) AND rowstatus = 1",
          [valKondisi, valProperty],
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
                      // localStorage.setItem("bungaFlat", result2.rows.item(0).bungaFlat);
                      localStorage.setItem("provisiAdm", result2.rows.item(0).provisiAdm);
                      localStorage.setItem("asuransi", result2.rows.item(0).asuransi);

                     var nilaiAjuann = $window.localStorage.getItem("nilaiAjuan");
                     var hslDesposit = (parseInt(result2.rows.item(0).securityDeposit)/100)*parseInt(nilaiAjuann);
                     console.log(hslDesposit);
                     $scope.form.securityDeposit = hslDesposit;

                    localStorage.setItem("dpAjuan",hslDesposit)

                    } else {
                      localStorage.setItem("securityDeposit", "0");
                      localStorage.setItem("pokokHutang", "0");
                      localStorage.setItem("bungaEfektif", "0");
                      // localStorage.setItem("bungaFlat", "0");
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
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM paramhetocategoryentity WHERE category = (?) AND nameProperty = (?) AND rowstatus = 1",
          [valKondisi, valProperty],
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
                      // localStorage.setItem("bungaFlat", result2.rows.item(0).bungaFlat);
                      localStorage.setItem("provisiAdm", result2.rows.item(0).provisiAdm);
                      localStorage.setItem("asuransi", result2.rows.item(0).asuransi);

                      var nilaiAjuann = $window.localStorage.getItem("nilaiAjuan");
                     var hslDesposit = (parseInt(result2.rows.item(0).securityDeposit)/100)*parseInt(nilaiAjuann);
                     console.log(hslDesposit);
                     $scope.form.securityDeposit = hslDesposit;

                    } else {
                      localStorage.setItem("securityDeposit", "0");
                      localStorage.setItem("pokokHutang", "0");
                      localStorage.setItem("bungaEfektif", "0");
                      // localStorage.setItem("bungaFlat", "0");
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

  function getTenorProperty(valKondisi, valProperty) {
    $scope.tenorList = [];
    //ambil data tenor by kondisi name
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM paramhetocategoryentity WHERE category = (?) AND nameProperty = (?) AND rowstatus = 1",
          [valKondisi, valProperty],
          function (tx, result) {

            var id = result.rows.item(0).id;
            console.log(id);

            BFIFINANCE.selectCategoryByID(id)
              .then(function (result2) {
                for (var ij = 0; ij <= result2.length - 1; ij++) {
                  $scope.tenorList.push({
                    id: result2[ij].id,
                    tenor: result2[ij].tenor
                  });
                }
                $scope.form.tenorAjuan = $scope.tenorList;
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

  function getTenorProperty2(valKondisi, valProperty, waktuAjuan) {
    //ambil data tenor by kondisi name
    db.transaction(
      function (tx) {
        tx.executeSql(
          "SELECT * FROM paramhetocategoryentity WHERE category = (?) AND nameProperty = (?) AND rowstatus = 1",
          [valKondisi, valProperty],
          function (tx, result) {

            var id = result.rows.item(0).id;
            console.log(id);

            BFIFINANCE.selectCategoryByID(id)
              .then(function (result2) {
                for (var ij = 0; ij <= result2.length - 1; ij++) {
                  $scope.tenorList.push({
                    id: result2[ij].id,
                    tenor: result2[ij].tenor
                  });
                }
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

  function getPriceAmount() {
    //ambil data nilai perkiraan
    $http({
      method: 'GET',
      url: kvlUrlFinance + 'ParamSertifikatAction?action=list-front-paramsertifikat',
      headers : localStorageTokenBearer()
    })
      .success(function (result) {
        if (result.rows.length > 0) {
          localStorage.setItem("hargaPerkiraan", result.rows[0].priceAmount);
          localStorage.setItem("rateProvisi", result.rows[0].rateProvisi);
        } else {
          console.log("Ada Kosong");
        }
      });
    //ambil data nilai perkiraan
  }

  function getTenorList() {
    // console.log("agunanAjuan "+agunanAjuan);
    // console.log("waktuAjuan "+waktuAjuan);
    if (agunanAjuan != null || agunanAjuan != "null" && agunanAjuan == "BPKB-Motor") {
      if (agunanAjuan == "BPKB-Motor") {
        console.log("tenor masuk bpkb motor");
        var idRatePinjaman = $window.localStorage.getItem("idRatePinjaman");
        $http({
          method: 'GET',
          url: kvlUrlFinance + 'ParamMotorDetailAction?action=list-front-rate-parammotorid&idParamMotor=' + idRatePinjaman,
          headers : localStorageTokenBearer()
        })
          .success(function (result) {
            if (result.rows.length > 0) {
              $scope.tenorList = result.rows;
              // console.log("Ada kok waktunyeee"+waktuAjuan);
              $scope.tenorAjuan = waktuAjuan;
            } else {
              console.log("Ada Kosong");
            }
          });
      } else if (agunanAjuan == "Invoice Alat Berat/BPKB Truk") {
        // console.log("tenor masuk Invoice Alat Berat/BPKB Truk");
        var kondisiAjuan = $window.localStorage.getItem("kondisiAjuan");
        $http({
          method: 'GET',
          url: kvlUrlFinance + 'ParamPropertyTenorAction?action=list-front-parampropertytenor&nameParent=' + kondisiAjuan,
          headers : localStorageTokenBearer()
        })
          .success(function (result) {
            if (result.rows.length > 0) {
              console.log("Yes sini masuk");
              $scope.tenorList = result.rows;
              $scope.tenorAjuan = waktuAjuan;
            } else {
              console.log("Ada Kosong");
            }
          });
      } else if (agunanAjuan == "Sertifikat Tanah dan Bangunan") {
        //ambil tenor
        $http({
          method: 'GET',
          url: kvlUrlFinance + 'ParamSertifikatTenorAction?action=list-front-paramsertifikattenor',
          headers : localStorageTokenBearer()
        })
          .success(function (result) {
            if (result.rows.length > 0) {
              $scope.tenorList = result.rows;
              $scope.tenorAjuan = waktuAjuan;

            } else {
              console.log("Ada Kosong");
            }
          });
        //ambil tenor
      } else if (agunanAjuan == "BPKB-Mobil") {
        $http({
          method: 'GET',
          url: kvlUrlFinance + 'ParamMobilAsuransiAction?action=list-tenor-asuransi',
          headers : localStorageTokenBearer()
        })
          .success(function (result) {
            if (result.rows.length > 0) {
              $scope.tenorList = result.rows;
              $scope.tenorAjuan = waktuAjuan;
            } else {
              console.log("Ada Kosong");
            }
          });
      }

    }
  }
  getTenorList();

  function getShowHideButton() {
    var valAjuan = $window.localStorage.getItem("agunanAjuan");
    var jenisAjuan = $window.localStorage.getItem("jenisAjuan");
    if (valAjuan == "BPKB-Mobil") {
      tahunMobil();
      $scope.tahunList = arrMobil;
      $scope.tahunAjuan = tahunAjuan;
      $scope.disabled_tahunAjuankendaraan = "false";
      $scope.element_kondisi = "hidden";
      $scope.element_jenis = "hidden";
      $scope.element_tahun = "hidden";
      $scope.element_mesin = "hidden";
      $scope.element_tahunkendaraan = "show";
      $scope.scopetahun = "Tahun Kendaraan";
      $scope.disclaimer_motor = "hidden";
      $scope.disclaimer_car = "show";
      $scope.disclaimer_heto = "hidden";
      $scope.disclaimer_machinery = "hidden";
    } else if (valAjuan == "BPKB-Motor") {
      tahunMotor();
      $scope.tahunList = arrMotor;
      $scope.tahunAjuan = $scope.tahunList;
      $scope.element_tahunkendaraan = "show";
      $scope.element_kondisi = "hidden";
      $scope.element_tahun = "hidden";
      $scope.element_mesin = "hidden";
      $scope.scopetahun = "Tahun Kendaraan";
      $scope.disclaimer_motor = "show";
      $scope.disclaimer_car = "hidden";
      $scope.disclaimer_heto = "hidden";
      $scope.disclaimer_machinery = "hidden";
    } else if (valAjuan == "Sertifikat Tanah dan Bangunan") {
      getPriceAmount();
      // getListTenorSertifikat();
      $scope.element_kondisi = "hidden";
      $scope.element_tahun = "hidden";
      $scope.element_jenis = "hidden";
      $scope.element_tahunkendaraan = "hidden";
      $scope.element_mesin = "hidden";
      $scope.disclaimer_motor = "hidden";
      $scope.disclaimer_car = "hidden";
      $scope.disclaimer_heto = "hidden";
      $scope.disclaimer_machinery = "hidden";
    } else if (valAjuan == "Invoice Alat Berat/BPKB Truk") {
      // console.log("MASUK SINIIII!!!!!"+jenisAjuan);
      $scope.element_jenis = "hidden";
      $scope.element_tahun = "show";
      $scope.element_tahunkendaraan = "hidden";
      $scope.element_mesin = "hidden";
      $scope.elemet_kondisi = "show";
      $scope.scopetahun = "Tahun Unit";
      $scope.disclaimer_motor = "hidden";
      $scope.disclaimer_car = "hidden";
      $scope.disclaimer_heto = "show";
      $scope.disclaimer_machinery = "hidden";
    } else if (valAjuan == "Invoice Machinery") {
      $scope.element_jenis = "hidden";
      $scope.element_tahun = "show";
      $scope.element_tahunkendaraan = "hidden";
      $scope.element_mesin = "hidden";
      $scope.elemet_kondisi = "show";
      $scope.scopetahun = "Tahun Unit";
      $scope.disclaimer_motor = "hidden";
      $scope.disclaimer_heto = "hidden";
      $scope.disclaimer_car = "hidden";
      $scope.disclaimer_machinery = "show";
    } else {
      $scope.element_tahunkendaraan = "hidden";
      $scope.element_mesin = "hidden";
      $scope.element_kondisi = "hidden";
      $scope.disclaimer_car = "hidden";
      $scope.element_tahun = "show";
      $scope.disclaimer_motor = "hidden";
      $scope.disclaimer_heto = "hidden";
      $scope.disclaimer_machinery = "hidden";
    }
  }
  getShowHideButton();

  function doResetLocalStorage() {
    localStorage.removeItem("nilaiAjuan");
    localStorage.removeItem("angsuranAjuan");
    localStorage.removeItem("dpAjuan");
    localStorage.removeItem("waktuAjuan");
    localStorage.removeItem("tahunAjuan");
    localStorage.removeItem("nilaiAjuan");
    localStorage.removeItem("kondisiAjuan");
    localStorage.removeItem("tenor");
    localStorage.removeItem("agunanAjuan");

    //ini Invoice Alat Berat/BPKB Truk
    localStorage.removeItem("asuransi");
    localStorage.removeItem("bungaEfektif");
    localStorage.removeItem("bungaFlat");
    localStorage.removeItem("provisiAdm");
    localStorage.removeItem("pokokHutang");
    localStorage.removeItem("securityDeposit");

    //ini bpkb motor
    localStorage.removeItem("rate");
    localStorage.removeItem("rateProvisi");
    localStorage.removeItem("biayaAdm");

    //clear text input
    $scope.nilaiAjuan = "0";
    $scope.tahunAjuan = null;
    $scope.angsuranAjuan = null;
    $scope.tenorAjuan = null;

  }

  var valAjuan = "";
  $scope.doLoadAgunan = function (agunanAjuan) {
    doResetLocalStorage();
    valAjuan = agunanAjuan; //item.name
    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
    // var agunanAjuan = $window.localStorage.getItem("agunanAjuan");
    if (valAjuan == "BPKB-Mobil") {
      getTenorMobil();
      tahunMobil();
      $scope.tahunList = arrMobil;
      $scope.tahunAjuan = $scope.tahunList;
      $scope.element_kondisi = "hidden";
      $scope.element_tahun = "hidden";
      $scope.element_tahunkendaraan = "show";
      $scope.scopetahun = "Tahun Kendaraan";
      $scope.disclaimer_motor = "hidden";
      $scope.disclaimer_car = "show";
      $scope.disclaimer_heto = "hidden";
      $scope.disclaimer_machinery = "hidden";
    } else if (valAjuan == "BPKB-Motor") {
      tahunMotor();
      $scope.tahunList = arrMotor;
      $scope.tahunAjuan = $scope.tahunList;
      $scope.element_kondisi = "hidden";
      $scope.element_tahun = "hidden";
      $scope.element_tahunkendaraan = "show";
      $scope.scopetahun = "Tahun Kendaraan";
      $scope.disclaimer_motor = "show";
      $scope.disclaimer_car = "hidden";
      $scope.disclaimer_heto = "hidden";
      $scope.disclaimer_machinery = "hidden";
      // $scope.element_jenis="show";
    } else if (valAjuan == "Sertifikat Tanah dan Bangunan") {
      $scope.element_kondisi = "hidden";
      $scope.element_tahun = "hidden";
      $scope.disclaimer_motor = "hidden";
      $scope.disclaimer_heto = "hidden";
      $scope.disclaimer_machinery = "hidden";
      $scope.disclaimer_car = "hidden";
    } else if (valAjuan == "Invoice Alat Berat/BPKB Truk") {
      $scope.element_kondisi = "show";
      // $scope.disabled_kondisi = "false";
      $scope.element_tahun = "show";
      $scope.element_jenis = "hidden";
      $scope.scopetahun = "Tahun Unit";
      $scope.disclaimer_motor = "hidden";
      $scope.disclaimer_heto = "show";
      $scope.disclaimer_machinery = "hidden";
      $scope.disclaimer_car = "hidden";
      getKondisi(agunanAjuan);
    } else if (valAjuan == "Invoice Machinery") {
      $scope.element_kondisi = "show";
      // $scope.disabled_kondisi = "false";
      $scope.element_tahun = "show";
      $scope.element_jenis = "hidden";
      $scope.scopetahun = "Tahun Unit";
      $scope.disclaimer_car = "hidden";
      $scope.disclaimer_motor = "hidden";
      $scope.disclaimer_heto = "hidden";
      $scope.disclaimer_machinery = "show";
      getKondisi(agunanAjuan);
    } else {
      $scope.element_kondisi = "hidden";
      $scope.element_tahun = "hidden";
      $scope.disclaimer_motor = "hidden";
      $scope.disclaimer_heto = "hidden";
      $scope.disclaimer_car = "hidden";
      $scope.disclaimer_machinery = "hidden";
    }

    localStorage.setItem("agunanAjuan", valAjuan);
  }

  $scope.doFocus = function (nilaiAjuan) {
    var valNilai = nilaiAjuan; //.split(".").join("")
    $scope.nilaiAjuan = valNilai;
  }

  var idRatePinjaman = 0;
  var tenor = 0;
  var rate = 0;
  var rateProvisi = 0;
  $scope.doBlurPinjaman = function (nilaiAjuan) {
    if (agunanAjuan == null) {
      valAjuan = $window.localStorage.getItem("agunanAjuan");;
    } else {
      valAjuan = $window.localStorage.getItem("agunanAjuan");
    }
    var nilaiAjuan = nilaiAjuan;
    localStorage.removeItem("angsuranAjuan");
    localStorage.removeItem("nilaiAjuan");
    if (valAjuan == "BPKB-Motor") {
      //ambil amount
      // hitung disini
      // doHitungAngsuranMotor(nilaiAjuan); //rate, rateProvisi, biayaAdm
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
      // hitung disini
    } else if (valAjuan == "Invoice Alat Berat/BPKB Truk") {
      localStorage.setItem("nilaiAjuan", nilaiAjuan);
      var waktuAjuan = $window.localStorage.getItem("tenor");

      var nilaiAjuann = $window.localStorage.getItem("nilaiAjuan");
      var scDeposit = $window.localStorage.getItem("securityDeposit");
     var hslDesposit = (parseInt(scDeposit)/100)*parseInt(nilaiAjuann);
     $scope.form.securityDeposit = hslDesposit;
     localStorage.setItem("dpAjuan",hslDesposit)

      // doHitungAngsuranProperty(nilaiAjuan, waktuAjuan);
      doHitungAngsuranProperty(nilaiAjuan, waktuAjuan)
        .then(function (result) {
          $scope.form.angsuranAjuan = $filter('number')(result, 0);
        });

    } else if (valAjuan == "Invoice Machinery") {
      localStorage.setItem("nilaiAjuan", nilaiAjuan);
      var waktuAjuan = $window.localStorage.getItem("tenor");

      var nilaiAjuann = $window.localStorage.getItem("nilaiAjuan");
      var scDeposit = $window.localStorage.getItem("securityDeposit");
     var hslDesposit = (parseInt(scDeposit)/100)*parseInt(nilaiAjuann);
     $scope.form.securityDeposit = hslDesposit;
     localStorage.setItem("dpAjuan",hslDesposit)

      // doHitungAngsuranProperty(nilaiAjuan, waktuAjuan);
      doHitungAngsuranProperty(nilaiAjuan, waktuAjuan)
        .then(function (result) {
          $scope.form.angsuranAjuan = $filter('number')(result, 0);
        });

    } else if (valAjuan == "Sertifikat Tanah dan Bangunan") {
      var tenorAjuan = $window.localStorage.getItem("idTenor");
      var waktuAjuan = $window.localStorage.getItem("tenor");

      console.log(nilaiAjuan);
      db.transaction(
        function (tx) {
          tx.executeSql(
            "SELECT * FROM paramsertifikatrateentity WHERE amountFrom <= (?) AND amountTo >= (?) AND idTenor = (?) AND rowstatus = 1",
            [nilaiAjuan, nilaiAjuan, tenorAjuan],
            function (tx, result) {

              if (result.rows.length > 0) {

                localStorage.setItem("ratePerkiraan", result.rows.item(0).rate);
                localStorage.setItem("tenor", result.rows.item(0).tenor);
                doHitungAngsuranMobil(nilaiAjuan222)
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
                          doHitungAngsuranMobil(nilaiAjuan222)
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
      doHitungAngsuranMobil(nilaiAjuan222)
        .then(
        function (Result) {
          console.log(Result);
          $scope.form.angsuranAjuan = $filter('number')(Result, 0);
        }
        );

    } else if (valAjuan == "BPKB-Mobil") {
      //ambil nilai administrasi
      getBiayaAdminMobil(nilaiAjuan);
      getFidusiaMobil(nilaiAjuan);

      //ambil tenor
      getTenorMobil();
      localStorage.setItem("nilaiAjuan", nilaiAjuan);

      // doHitungAngsuranNDFMobil(nilaiAjuan);
      doHitungAngsuranNDFMobil(nilaiAjuan)
        .then(function (result) {
          $ionicLoading.hide();
          $scope.form.angsuranAjuan = $filter('number')(result, 0);
        });
    }

    // localStorage.setItem("nilaiAjuan",nilaiAjuan);
  }

  $scope.doLoadJenis = function (item) {
    var jenisAjuan = item;
    // console.log("Jenis Ajuan: "+jenisAjuan);
    localStorage.setItem("jenisAjuan", jenisAjuan);
  }

  $scope.doBlurTahun = function (tahunAjuan) {
    var tahunAjuan = tahunAjuan;
    localStorage.setItem("tahunAjuan", tahunAjuan);
    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
    var agunanAjuan = $window.localStorage.getItem("agunanAjuan");
    if (agunanAjuan == "BPKB-Mobil") {
      //get eff rate
      var tahunAjuan = $window.localStorage.getItem("tahunAjuan");
      var tenorVal = $window.localStorage.getItem("tenor");
      var currentYear = new Date().getFullYear();
      // console.log("currentYear: "+currentYear);
      var selisihYear = parseInt(currentYear) - parseInt(tahunAjuan);
      // console.log("selisihYear: "+selisihYear);

      //get eff rate
      $http({
        method: 'GET',
        url: kvlUrlFinance + 'ParamMobilRateAction?action=list-front-parammobilrate&tenor=' + tenorVal,
        headers : localStorageTokenBearer()
      })
        .success(function (result) {
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
                  // doHitungAngsuranNDFMobil(nilaiAjuan).;
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
    }
  }

  function getIDTenor(idRatePinjaman, tenor) {
    var agunanAjuan = $window.localStorage.getItem("agunanAjuan");
    var returnHasil;
    if (agunanAjuan == "BPKB-Motor") {
      $http({
        method: 'GET',
        url: kvlUrlFinance + 'ParamMotorDetailAction?action=getIDTenor&idRatePinjaman=' + idRatePinjaman + '&tenor=' + tenor,
        headers : localStorageTokenBearer()
      })
        .success(function (result) {
          if (result.rows.length > 0) {
            console.log(" --- " + result.rows[0].id);
            returnHasil = result.rows[0].id;
          } else {
            console.log("Ada Kosong");
          }
        });
      console.log("returnHasil: " + returnHasil);
      return returnHasil;
    }
  }

  $scope.doLoadTenor = function (tenor) {
    console.log("==========tenor=========::: "+ tenor)
    var valAjuan = $window.localStorage.getItem("agunanAjuan");
    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
    var tenorVal = $window.localStorage.getItem("idTenor");
    var idRatePinjaman = $window.localStorage.getItem("idRatePinjaman");
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

                var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
                // doHitungAngsuranMotor(nilaiAjuan);
                doHitungAngsuranMotor(nilaiAjuan)
                  .then(function (result) {
                    $scope.form.angsuranAjuan = $filter('number')(result, 0);
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

    } else if (valAjuan == "Invoice Alat Berat/BPKB Truk") {
      // localStorage.setItem("tenor",tenor);

      //  var nilaiProperty = $window.localStorage.getItem("nilaiAjuan");
      //   doHitungAngsuranProperty(nilaiProperty, tenor);

      db.transaction(
        function (tx2) {
          tx2.executeSql(
            "SELECT * FROM paramhetotenorentity WHERE id = (?)",
            [tenor],
            function (tx2, result2) {

              if (result2.rows.length > 0) {

                localStorage.setItem("tenor", result2.rows.item(0).tenor);

                var waktuAjuan = result2.rows.item(0).tenor;
                //hitung disini
                var nilaiProperty = $window.localStorage.getItem("nilaiAjuan");
                // doHitungAngsuranProperty(nilaiProperty, waktuAjuan);
                doHitungAngsuranProperty(nilaiProperty, waktuAjuan)
                  .then(function (result) {
                    $scope.form.angsuranAjuan = $filter('number')(result, 0);
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
      //ambil data rate
      //ambil data rate
      db.transaction(
        function (tx2) {
          tx2.executeSql(
            "SELECT * FROM paramhetotenorentity WHERE id = (?) AND rowstatus = 1",
            [tenor],
            function (tx2, result2) {

              if (result2.rows.length > 0) {

                localStorage.setItem("tenor", result2.rows.item(0).tenor);

                var waktuAjuan = result2.rows.item(0).tenor;
                //hitung disini
                var nilaiProperty = $window.localStorage.getItem("nilaiAjuan");
                // doHitungAngsuranProperty(nilaiProperty, waktuAjuan);
                doHitungAngsuranProperty(nilaiProperty, waktuAjuan)
                  .then(function (result) {
                    $scope.form.angsuranAjuan = $filter('number')(result, 0);
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
      //ambil id tenor

      var nilaiAjuan222 = $window.localStorage.getItem("nilaiAjuan");
      db.transaction(
        function (tx) {
          tx.executeSql(
            "SELECT * FROM paramsertifikatrateentity WHERE amountFrom <= (?) AND amountTo >= (?) AND idTenor = (?) AND rowstatus = 1",
            [nilaiAjuan222, nilaiAjuan222, tenor],
            function (tx, result) {

              if (result.rows.length > 0) {
                console.log("MASUK SINI");

                localStorage.setItem("ratePerkiraan", result.rows.item(0).rate);
                localStorage.setItem("tenor", result.rows.item(0).tenor);
                doHitungAngsuranMobil(nilaiAjuan222)
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
                      "SELECT * FROM paramsertifikatrateentity WHERE amountFrom <= (?) AND amountTo = 0  AND idTenor = (?)  AND rowstatus = 1",
                      [nilaiAjuan222, tenor],
                      function (tx2, result2) {

                        if (result2.rows.length > 0) {
                          console.log("MASUK SINI");

                          localStorage.setItem("ratePerkiraan", result2.rows.item(0).rate);
                          localStorage.setItem("tenor", result2.rows.item(0).tenor);
                          doHitungAngsuranMobil(nilaiAjuan222)
                            .then(
                            function (Result) {
                              console.log(Result);
                              $scope.form.angsuranAjuan = $filter('number')(Result, 0);
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

    } else if (valAjuan == "BPKB-Mobil") {
      $http({
        method: 'GET',
        url: kvlUrlFinance + 'ParamMobilAsuransiAction?action=getTenorByID&tenorID=' + tenor,
        headers : localStorageTokenBearer()
      })
        .success(function (result) {
          if (result.rows.length > 0) {
            localStorage.setItem("tenor", result.rows[0].tenor);

            var tenorVal = result.rows[0].tenor;
            getAsuransiJiwa(result.rows[0].tenor);
            getAsuransiKendaraan(result.rows[0].tenor);
            // doHitungAngsuranNDFMobil(nilaiAjuan);
            doHitungAngsuranNDFMobil(nilaiAjuan)
              .then(function (result) {
                $ionicLoading.hide();
                $scope.form.angsuranAjuan = $filter('number')(result, 0);
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
                  doHitungAngsuranNDFMobil(nilaiAjuan)
                    .then(function (result) {
                      $ionicLoading.hide();
                      $scope.form.angsuranAjuan = $filter('number')(result, 0);
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

                } else {
                  console.log("Ada Kosong");
                }
              });

            //ambil persen provisi by tenor
          } else {
            console.log("Ada Kosong");
          }
        });
     doHitungAngsuranNDFMobil(nilaiAjuan)
      .then(function (result) {
        $ionicLoading.hide();
        $scope.form.angsuranAjuan = $filter('number')(result, 0);
      });

    }

  }

  function getAsuransiJiwa(tenor) {
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
    var q = $q.defer();
    var biayaAdm = $window.localStorage.getItem("biayaAdm");
    var biayaFidusia = $window.localStorage.getItem("biayaFidusia");
    var biayaProvisi = $window.localStorage.getItem("biayaProvisi");
    var insuranceKendaraan = $window.localStorage.getItem("insuranceKendaraan");
    var insuranceJiwa = $window.localStorage.getItem("insuranceJiwa");
    var hargaKendaraan = 150000000;

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
    var effRateFinal = null;
    if (effRate == "0" || parseInt(effRate) == 0){
      effRateFinal = "0";
      console.log("effRateFinal: "+effRateFinal);
    }else{
      effRateFinal = ((parseInt(effRate) / 100) / 12);
      console.log("effRateFinal: "+effRateFinal);
    }

    // console.log("effRate: "+effRate);
    // console.log("effRateFinal: "+effRateFinal);

    var satuPlus = (parseInt(1) + parseFloat(effRateFinal));
    // console.log("satuPlus: "+satuPlus);

    var mathPow = Math.pow(satuPlus, parseInt(waktuAjuan));
    // console.log("mathPow: "+mathPow);

    var ntfeff = (ttlNTF * effRateFinal * mathPow);
    // console.log("ntfeff: "+ntfeff);

    var dudud = mathPow - parseInt(1);
    // console.log("Dudu: "+dudud);

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

  function doHitungAngsuranMobil(nilaiAjuan) { //properti ini sih harusnya

    var q = $q.defer();
    var hargaPerkiraan = $window.localStorage.getItem("hargaPerkiraan");
    var ratePerkiraan = $window.localStorage.getItem("ratePerkiraan");
    var rateProvisi = $window.localStorage.getItem("rateProvisi");
    var waktuAjuan = $window.localStorage.getItem("tenor");
    var ltv = (parseInt(nilaiAjuan) * parseInt(100)) / parseInt(hargaPerkiraan);

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
    var effRateFinal = ((parseInt(ratePerkiraan) / 100) / 12);
    // console.log("effRate: "+effRateFinal);

    // (P*i*(1+i)^n)/(((1+i)^n)-1)
    var satuPlus = (parseInt(1) + parseFloat(effRateFinal));
    // console.log("satuPlus: "+satuPlus);

    var mathPow = Math.pow(satuPlus, parseInt(waktuAjuan));
    // console.log("mathPow: "+mathPow);

    var ntfeff = (nilaiAjuan * effRateFinal * mathPow);
    // console.log("ntfeff: "+ntfeff);

    var dudud = mathPow - parseInt(1);
    // console.log("Dudu: "+dudud);

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

  // function doHitungAngsuranMotor(nilaiAjuan){ //rate, rateProvisi, biayaAdm
  //  console.log("nilaiAjuan: "+nilaiAjuan);
  //    // console.log("nilaiAjuan: "+nilaiAjuan);
  //    // var nilaiAjuan  = $window.localStorage.getItem("nilaiAjuan");
  //    var agunanAjuan = $window.localStorage.getItem("agunanAjuan");
  //    var waktuAjuan = $window.localStorage.getItem("tenor");
  //    var biayaFidusia = 175000;

  //    rate = $window.localStorage.getItem("rate");
  //    rateProvisi = $window.localStorage.getItem("rateProvisi");
  //    biayaAdm = $window.localStorage.getItem("biayaAdm");

  //    //RUMUS INI UNTUK YANG AT THE BEGINNING OF PERIODE (A,A,A,A,0)

  //    //get NTF
  //    // var persentan = parseInt(1) - (parseInt(rateProvisi)/100);
  //    // console.log("Persen: "+persentan);
  //    var jmlNTF = parseInt(nilaiAjuan) + parseInt(biayaFidusia) + parseInt(biayaAdm);
  //    // console.log("Jumlah NTF: "+jmlNTF);
  //    var totalNTF = parseInt(jmlNTF) / (parseInt(1) - (parseInt(rateProvisi)/100));
  //    // console.log("Total NTF: "+totalNTF);

  //    //get eff rate
  //    var effRateFinal = ((parseInt(rate)/100) /12);
  //    // console.log("effRate: "+effRateFinal);

  //    // (P*i*(1+i)^n)/(((1+i)^n)-1)
  //    var satuPlus = (parseInt(1) + parseFloat(effRateFinal));
  //    // console.log("satuPlus: "+satuPlus);

  //    var mathPow = Math.pow(satuPlus,parseInt(waktuAjuan));
  //    // console.log("mathPow: "+mathPow);

  //    var ntfeff = (totalNTF * effRateFinal * mathPow);
  //    // console.log("ntfeff: "+ntfeff);

  //    var dudud = mathPow - parseInt(1);
  //    // console.log("Dudu: "+dudud+" ----- "+mathPow);

  //    var hasilpmt = (ntfeff / dudud).toFixed();
  //    // console.log(hasilpmt);

  //    var carichar = hasilpmt.length - 3;
  //    var charst = hasilpmt.charAt(carichar);
  //    var charsc = hasilpmt.charAt(carichar + 1);
  //    var chartd = hasilpmt.charAt(carichar + 2);
  //    var charganti = charst+""+charsc+""+chartd;
  //    var charasli = hasilpmt.charAt(carichar - 1);
  //    var charasli2 = hasilpmt.charAt(carichar - 2);
  //    var charasli3 = hasilpmt.charAt(carichar - 3);
  //    var charasli4 = hasilpmt.charAt(carichar - 4);
  //    var charasli5 = hasilpmt.charAt(carichar - 5);
  //    var charasli6 = hasilpmt.charAt(carichar - 6);
  //    var charasli0 = charasli6+""+charasli5+""+charasli4+""+charasli3+""+charasli2+""+charasli;

  //    if (charst < 5 && charst > 0){
  //      var joining = parseInt(charganti.replace(charganti,"500"));
  //      var hasilFix = charasli0 +""+joining;
  //      // console.log(hasilFix);
  //      localStorage.setItem("angsuranAjuan",hasilFix);
  //       $scope.angsuranAjuan = accounting.formatMoney(hasilFix , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;
  //    }else{
  //      var cicilAjuan = round2(hasilpmt,3)/1000;
  //      var rstCicilan = Math.ceil(cicilAjuan);
  //      var rstCicilan2 = Math.floor(cicilAjuan);
  //      var resultCicilan =  rstCicilan*1000;
  //      // console.log(resultCicilan);
  //      localStorage.setItem("angsuranAjuan",resultCicilan);
  //      $scope.angsuranAjuan = accounting.formatMoney(resultCicilan , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });
  //    }
  // }

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

    var carichar  = hasilpmt.length - 3;
    var charst    = hasilpmt.charAt(carichar);
    var charsc    = hasilpmt.charAt(carichar + 1);
    var chartd    = hasilpmt.charAt(carichar + 2);
    var charganti = charst + "" + charsc + "" + chartd;
    var charasli  = hasilpmt.charAt(carichar - 1);
    var charasli2 = hasilpmt.charAt(carichar - 2);
    var charasli3 = hasilpmt.charAt(carichar - 3);
    var charasli4 = hasilpmt.charAt(carichar - 4);
    var charasli5 = hasilpmt.charAt(carichar - 5);
    var charasli6 = hasilpmt.charAt(carichar - 6);
    var charasli0 = charasli6 + "" + charasli5 + "" + charasli4 + "" + charasli3 + "" + charasli2 + "" + charasli;

    if (charst < 5 && charst > 0) {
      var joining   = parseInt(charganti.replace(charganti, "500"));
      var hasilFix  = charasli0 + "" + joining;
      q.resolve(hasilFix);
      localStorage.setItem("angsuranAjuan", hasilFix);
      // $scope.form.angsuranAjuan = accounting.formatMoney(hasilFix , { precision: 0, thousand: '.', symbol: '',  format: '%v %s' });;
    } else {
      var cicilAjuan    = round2(hasilpmt, 3) / 1000;
      var rstCicilan    = Math.ceil(cicilAjuan);
      var rstCicilan2   = Math.floor(cicilAjuan);
      var resultCicilan = rstCicilan * 1000;
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
    var resultCeil  = 0;
    var carichar    = biayaAsuransi.length - 3;
    var charst      = biayaAsuransi.charAt(carichar);
    var charsc      = biayaAsuransi.charAt(carichar + 1);
    var chartd      = biayaAsuransi.charAt(carichar + 2);
    var charganti   = charst + "" + charsc + "" + chartd;
    var charasli    = biayaAsuransi.charAt(carichar - 1);
    var charasli2   = biayaAsuransi.charAt(carichar - 2);
    var charasli3   = biayaAsuransi.charAt(carichar - 3);
    var charasli4   = biayaAsuransi.charAt(carichar - 4);
    var charasli5   = biayaAsuransi.charAt(carichar - 5);
    var charasli6   = biayaAsuransi.charAt(carichar - 6);
    var charasli7   = biayaAsuransi.charAt(carichar - 7);
    var charasli0   = charasli7 + "" + charasli6 + "" + charasli5 + "" + charasli4 + "" + charasli3 + "" + charasli2 + "" + charasli;

    if (charst < 5 && charst > 0) {
      var joining     = parseInt(charganti.replace(charganti, "500"));
      resultCeil      = charasli0 + "" + joining;
    } else {
      var cicilAjuan  = round2(biayaAsuransi, 3) / 1000;
      var rstCicilan  = Math.ceil(cicilAjuan);
      var rstCicilan2 = Math.floor(cicilAjuan);
      resultCeil      = rstCicilan * 1000;
    }
    return resultCeil;
  }

  $scope.doAjuanAgunanSelanjutnya = function () {

    var nilaiJenis  = $window.localStorage.getItem("jenisAjuan");
    var nilaiTahun  = $window.localStorage.getItem("tahunAjuan");
    var agunanAjuan = $window.localStorage.getItem("agunanAjuan");

    if (agunanAjuan == null) {
      $scope.showAlert({
        title: "Information",
        message: "Mohon maaf, Pilih agunan terlebih dahulu"
      });
    } else {
      $scope.form.nilaiAjuan    = "";
      $scope.form.angsuranAjuan = "";
      $scope.tenorList          = [];
      $scope.tahunList          = [];

      $state.go('app.simulasikredit-pemohon', { url: '/simulasikredit-pemohon' });
    }
  }

})
