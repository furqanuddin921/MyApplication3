app.controller('SimulasiFinanceCtrl', function ($ionicLoading, $cordovaSocialSharing, $cordovaFileTransfer, $q, $scope, $http, $state, $window, $stateParams, BFIFINANCE , POINT) {

  //set product
    $scope.doBack = function () {
        var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
        if (nilaiAjuan == null){
            location.href = "#/app/simulasikredit";
        }else{
            location.href = "#/app/simulasikredit/"+nilaiAjuan;
        }
    }

    $scope.item = {};

    //simulasi kek bca finance
    $scope.$on("$ionicView.beforeEnter", function (event, data) {
          // var agunanAjuan =

          $scope.itemListArrayShow = true;

          function listTenorMilik() {
              var q = $q.defer();
              var dataLoad = localStorage.getItem("listTenorMilik");
              if(dataLoad != null && dataLoad !== ''){
                  q.resolve(JSON.parse(dataLoad));
              }else{
                $ionicLoading.show({
                    template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
                });
                $http({
                  method: 'GET',
                  url: kvlUrlFinance + 'ParamDFTenorAction?action=list-front-tenor',
                  headers : localStorageTokenBearer()
                })
                .success(function (result) {
                    localStorage.setItem("listTenorMilik", JSON.stringify(result));
                    q.resolve(result.rows);
                });
              }
              
              return q.promise;
          }
          listTenorMilik()
          .then(function (result){
              console.log("Result Tenor Kepemilikan");
              console.log(result);
              var itemListArray = [];
              if (result.length>0){
                  $ionicLoading.hide();
                  for (var i=0; i<=result.length-1; i++){
                      var detailTenor   = result[i].detailTenor;
                      console.log(detailTenor);
                      var effRate       = detailTenor[0].effRate;
                      var insuranceRate = detailTenor[0].insuranceRate;
                      var valTenor      = detailTenor[0].valTenor;
                      var tenorAjuan    = result[i].tenor;
                      var nilaiAjuan    = $window.localStorage.getItem("nilaiAjuan");

                      // console.log(result[i].id);
                      // console.log(result[i].tenor);
                      // console.log(nilaiAjuan);
                      // console.log(effRate);
                      // console.log(insuranceRate);
                      // console.log(tenorAjuan);
                      // console.log(valTenor);

                      var angsuranAjuanMilik = perhitunganDFMobil(nilaiAjuan, tenorAjuan, insuranceRate, effRate, valTenor);
                      // console.log(angsuranAjuanMilik);

                      itemListArray.push({
                          id : result[i].id,
                          tenor : result[i].tenor,
                          angsuran : angsuranAjuanMilik,
                          angsuranval : accounting.formatMoney(angsuranAjuanMilik, { precision: 0, thousand: '.', symbol: '', format: '%v %s' })
                      })
                      //
                  }
              }
              console.log(itemListArray);
              $scope.itemListArray = itemListArray;
          })
    })

    function perhitunganDFMobil(nilaiAjuan, tenorAjuan, insuranceRate, effRate, valTenor) {
        var biayaAdm = 2750000;
        var biayaProvisi = 850000;
        var dpAjuan = $window.localStorage.getItem("dpAjuan");

        // var tenorAjuan = $window.localStorage.getItem("tenor");
        // var valAsuransi = $window.localStorage.getItem("insuranceRate");
        // var rateVal  = $window.localStorage.getItem("effRate");
        // var tenorVal = $window.localStorage.getItem("valTenor");

        // $ionicLoading.show({
        //   template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
        // });

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

        var angsuranAjuanMilik = ceilAngular(nilaiiii);

        // $scope.form.angsuranAjuanMilik = accounting.formatMoney(angsuranAjuanMilik, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
        // localStorage.setItem("angsuranAjuan", angsuranAjuanMilik);

        return angsuranAjuanMilik;

        // $ionicLoading.hide();

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

      function round2(value, decimals) {
          return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
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
    console.log("8351")
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
                getDownloadPdfKreditKepemilikan();
              }
            },
            errorCallback);
        }else{
          getDownloadPdfKreditKepemilikan();
        }
      }
    }else{
      console.log("android version lower 6.0 or lollipop");
      getDownloadPdfKreditKepemilikan();
    }
  }

  function getDownloadPdfKreditKepemilikan(){
    console.log($scope.itemListArray);
    var itemListArray = $scope.itemListArray;
    console.log(itemListArray[3].angsuranval);
    // var agunanBiaya = $window.localStorage.getItem("");
    var hrgOTR    = accounting.formatMoney($window.localStorage.getItem("nilaiAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
    var DP        = accounting.formatMoney($window.localStorage.getItem("dpAjuan"), { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
    var thnKend   = $window.localStorage.getItem("tahunAjuan");
    var tenorSatu   = itemListArray[0].angsuranval; //accounting.formatMoney(itemListArray[0].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
    var tenorDua  = itemListArray[1].angsuranval; //accounting.formatMoney(itemListArray[1].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
    var tenorTiga = itemListArray[2].angsuranval; //accounting.formatMoney(itemListArray[2].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
    var tenorEmpat  = itemListArray[3].angsuranval; //accounting.formatMoney(itemListArray[3].angsuranval, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });

    document.addEventListener('deviceready', function () {
      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      });

      var url         = kvlUrlFinance + 'CreditSimulationCustomerAction?action=CreditSimulationCustomer&hrgOTR='+hrgOTR+ '&DP='+DP+ '&thnKend='+thnKend+ '&tenorSatu='+tenorSatu+'&tenorDua='+tenorDua+'&tenorTiga='+tenorTiga+'&tenorEmpat='+tenorEmpat;
      // var url         = kvlUrl + 'PreciseOutputAgentMobilAction?action=PreciseAgentMobil'
      // var targetPath  = cordova.file.externalRootDirectory + "kredit_simulasi_df.pdf";
      var targetPath = ionic.Platform.isIPad() || ionic.Platform.isIOS() ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;
          targetPath += "kredit_simulasi_df.pdf";
      var trustHosts  = true;
      var options     = localStorageTokenBearer();//{};

      console.log(url);

      $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function(result) {
        console.log(result)
        $ionicLoading.hide();
        sharedFile(result.nativeURL,"Simulasi Kredit BFI - DF Kepemilikan");
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
