app.controller('ContactUsCtrl', function ($rootScope, $scope, $http, $state, $stateParams, $ionicPopup, $ionicHistory, $q, $ionicLoading, $ionicPopup, Common) {
  
  // cordova.firebase.analytics.setCurrentScreen("contactus_page");
  $scope.uploadImage = false;
  var dataInbox   = $scope.message = {};
  var ServLink    = kvlUrl+"MobileInboxAction";
  var userId      = localStorage.getItem("userId");
  var idCustomer  = localStorage.getItem("userId");

  var filename    = "";

  $scope.kontrakList = [];
  $scope.kontrakList.push({
      AgreementNo : "-- Pilih Kontrak --"
  });
  $scope.message.noKontrak = $scope.kontrakList[0];

  $scope.imageBtn = true;
  $scope.imageView= false;

  $scope.numberContractHide = false;

  function saveImage(filename, base64, idMessage){
    var q = $q.defer();

    var dataImage          = $scope.image = {};
    var ImageLink          = kvlUrl + "MobileImageAction";

    $scope.image.action    = "addProccess";
    $scope.image.id        = "0";
    $scope.image.parentID  = idMessage;
    $scope.image.imageName = filename;
    $scope.image.imageFile = kvlUrlServer + "saved/" + filename;
    $scope.image.image     = "-";
    $scope.image.imageType = "inbox";
    $scope.image.imageContentType = "jpg";

    Common.timeout('upload image','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){
      $http({
          method    : 'POST',
          url       : ImageLink,
          contentType: 'application/json',
          data      : JSON.stringify(dataImage),
      })
      .success(function(result) {
          q.resolve(result);
          clearTimeout(timeoutvar);
          $ionicLoading.hide();
      }).error(function(err){
          clearTimeout(timeoutvar);
          $ionicLoading.hide();
          if (typeof cordova != 'undefined') {
            $ionicPopup.alert({
              title   : 'Oops',
              template: 'Terjadi kesalahan koneksi',
              cssClass: 'alertCustom',
              okText  : 'Ok',
              okType  : 'button-custom-ok'
            });
            // $cordovaToast.showLongBottom('Terjadi kesalahan koneksi');
          }
      });
    });

    
    return q.promise;
  }
  //-----------------------------
  function convertImage(filename, base64){
      var q = $q.defer();
      var dataImage = $scope.form = {};
      var urlServer = kvlUrlServer+"MobileImageFileAction";

      $ionicLoading.show({
          template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      });

      $scope.form.action    = "convertImage";
      $scope.form.imageBase = base64;
      $scope.form.imageName = filename;


      Common.timeout('upload image converted','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){
        $http({
            method    : 'POST',
            url       : urlServer,
            contentType: 'application/json',
            data      : JSON.stringify(dataImage),
        })
        .success(function(result) {
          q.resolve(result);
          clearTimeout(timeoutvar);
          $ionicLoading.hide();
        })
      });

      return q.promise;
  }

  /* -- FUNCTION END ---------------------------------- */
  if (idCustomer != null){
      $scope.imageAttach   = true;
      $scope.class_kontrak = "show";

  }else{
      $scope.class_kontrak = "hidden";
      $scope.imageAttach   = false;
  }

  $scope.doLoadHandphone = function (handphone){
      var ihandphone = handphone.substring(0,1);
      var bhandphone = handphone.substring(1,13);
      // console.log(ihandphone);
      if (ihandphone == "0"){
          $scope.message.handphone = "62"+bhandphone;
      }else{
          $scope.message.handphone = handphone;
      }
  }
  $scope.OpenImageFile = function(){
      console.log("run langsung di android phone untuk me-running function");
      var confirmPopup = $ionicPopup.show({
          title: '',
          // title: '<div style="text-align: right !important;"><i class="icon ion-close-circled font16"></i></div>',
          // title: '<div ng-click="doCloseButton()" style="text-align: right !important;"><i class="icon ion-close-circled font16"></i></div>',
          cssClass  : 'alertCustom',
          //template: '<img src='+imageNameProfil+' class="img-prof-fix">',
          buttons: [{
              text: '<div class="martop15px"><img src="assets/img/take-photo-gallery.png"><p class="text-center fontsmallpx">Gallery</p></div>',
              onTap: function(e){
                  // ImageService.handleMediaDialog(1);
                  galleryPicture();
              }
          },{
              text: '<div class="martop15px"><img src="assets/img/take-photo-camera.png"><p class="text-center fontsmallpx">Take Photo</p></div>',
              onTap: function(e){
                // console.log(e);
                // ImageService.handleMediaDialog(0);
                  takePicture();
              }
          },{
            text: '<i class="icon ion-close-circled"></i>',
            type: 'popupStyle',
            onTap: function (e) {
            }
          }]
      });
  }
  var d           = new Date();
  var dateTimeNow =('IMG_'+d.getFullYear()+''+(d.getMonth()+1)+''+d.getDate()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+d.getMilliseconds());

  function galleryPicture(){
      // var options = {
      //   maximumImagesCount  : 1,
      //   quality             : 80,
      //   destinationType     : Camera.DestinationType.FILE_URI,
      //   sourceType          : Camera.PictureSourceType.SAVEDPHOTOALBUM,
      //   mediaType           : Camera.MediaType.ALLMEDIA,
      //   saveToPhotoAlbum    : true
      // };
      var options = {
          quality         : 100,
          destinationType : Camera.DestinationType.DATA_URL,
          sourceType      : Camera.PictureSourceType.PHOTOLIBRARY,
          allowEdit       : true,
          encodingType    : Camera.EncodingType.JPEG,
          targetWidth     : 300,
          targetHeight    : 300,
          popoverOptions  : CameraPopoverOptions,
          saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function (results) {
          $scope.imageSource   = "";
          var dataSaveImage    = "data:image/jpeg;base64," + results;           
          $scope.form.srcImage = results;
          filename             = dateTimeNow+''+results.substr(results.lastIndexOf("/")+1);

          localStorage.setItem("filename",filename);
          localStorage.setItem("srcImage",results);

          convertImage(filename, dataSaveImage).then(function(result){
              if (result.status == "1" || result.status == 1){
                  $scope.uploadImage = true;
                  $scope.imgSource   = "show";
                  $scope.imageSource = result.imagePath;
              }
          });
          // loadCamera(results);
      }, function(error) {
          // alert("Failed because: " + error);
          console.log('Failed because: ' + error);
      });
  }

  function takePicture(){
      var optionsa = {
          quality: 100,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          encodingType: Camera.EncodingType.JPEG,
          cameraDirection: 1,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 800,
          targetHeight: 800,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(optionsa).then(function (results) {

          var dataSaveImage    = "data:image/jpeg;base64," + results;           
          $scope.form.srcImage = results;
          filename             = dateTimeNow+""+results.substr(results.lastIndexOf("/")+1);
          // console.log("filename: "+filename);
          // console.log("results: "+results)

          localStorage.setItem("filename",filename);
          localStorage.setItem("srcImage",results);

          window.plugins.Base64.encodeFile($scope.form.srcImage, function(base64){
              convertImage(filename, base64).then(function(result){
      //             console.log(result);
                  if (result.status == "1" || result.status == 1){
                      $scope.uploadImage = true;
                      $scope.imgSource   = "show";
                      $scope.imageSource = result.imagePath;
                  }
              });
          })

          // loadCamera(results);
      }, function(error) {
          // alert("Failed because: " + error);
          console.log('Failed because: ' + error);
      });
  }

  //get list jenis pesan
  $http({
      method    : 'GET',
      url       : kvlUrl+'FrontInboxSubjectAction?action=list-front-inboxsubject'
  })
  .success(function(result) {
      // console.log(result);
      if (result.rows.length > 0) {
          var pesanList = [];
          pesanList.push({
              id            : "00",
              codeInbox     : "00",
              categoryInbox : "-- Pilih Jenis Pesan --"
          });
          for (var i=0; i<=result.rows.length-1; i++){
              // console.log(result.rows[i].id);
              pesanList.push({
                  id : result.rows[i].id,
                  codeInbox : result.rows[i].codeInbox,
                  categoryInbox : result.rows[i].categoryInbox
              });
          }
          $scope.pesanList = pesanList;
          $scope.message.jenisPesan = pesanList[0];
      } else {
          // console.log("Belum ada handphone");
      }
    }).error(function(err){

    if (typeof cordova != 'undefined') {
      $ionicPopup.alert({
        title   : 'Oopos',
        template: 'Terjadi kesalahan koneksi',
        cssClass  : 'alertCustom',
        okText  : 'Ok',
        okType  : 'button-custom-ok'
      });

      // $cordovaToast.showLongBottom('Terjadi kesalahan koneksi');
    }
  });

  $scope.doPesanBaru = function(){
      var idCustomer = localStorage.getItem("userId");
      var jenisPesan = $scope.message.jenisPesan;
      var noKontrak = {
        'AgreementNo' : $scope.message.noKontrak
      };

      if (jenisPesan.codeInbox == "00"){
          $rootScope.showAlert({
              title  : "Information",
              message: "Mohon maaf, Silahkan pilih jenis pesan Anda terlebih dahulu"
          });
      }else if (!$scope.message.identitas){
          $rootScope.showAlert({
              title  : "Information",
              message: "Mohon maaf, Silahkan pilih identitas Anda terlebih dahulu"
          });
      }else if (!$scope.message.fullnamePelanggan){
          $rootScope.showAlert({
              title  : "Information",
              message: "Mohon maaf, Nama pelanggan masih kosong"
          });
      }else if (!$scope.message.fullnamePelapor){
          $rootScope.showAlert({
              title  : "Information",
              message: "Mohon maaf, Nama pelapor masih kosong"
          });
      }else if (!$scope.message.handphone){
          $rootScope.showAlert({
              title  : "Information",
              message: "Mohon maaf, No. Handphone Anda masih kosong"
          });
      }else if (!$scope.message.email){
          $rootScope.showAlert({
              title  : "Information",
              message: "Mohon maaf, Email Anda masih kosong"
          });
      }else if (!$scope.message.pesan){
          $rootScope.showAlert({
              title  : "Information",
              message: "Mohon maaf, Pesan Anda masih kosong"
          });
      }else{
          if (idCustomer != null && noKontrak.AgreementNo == "-- Pilih Kontrak --"){
              // $rootScope.showAlert({
              //     title  : "Information",
              //     message: "Mohon maaf, Silahkan pilih kontrak terlebih dahulu"
              // });
              $scope.message.noKontrak    = "0";
          }else{
              $scope.message.action       = "addProccess";
              $scope.message.id           = "0";
              $scope.message.codeInbox    = jenisPesan.codeInbox;
              $scope.message.jenisPesan   = jenisPesan.categoryInbox;
              $scope.message.idMessage    = "0";
              $scope.message.typeInbox    = "userId";

              $ionicLoading.show({
                  template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
              });

              if (idCustomer == null){
                  $scope.message.noKontrak = "0";
                  $scope.message.userId = "0";
              }else{
                  if (noKontrak.AgreementNo == null){
                      $scope.message.noKontrak = "0";
                  }else{
                      $scope.message.noKontrak = noKontrak.AgreementNo;
                  }
                  $scope.message.userId = idCustomer;
              }

              var filenameSave = localStorage.getItem("filename");
              var base64Save   = localStorage.getItem("srcImage");

              if ( filenameSave == undefined && base64Save == undefined || filenameSave == null && base64Save == null ){
                  $scope.message.imageName = "-";
                  $scope.message.imageFile = "-";
                  $scope.message.image     = "-";
                  $scope.message.imageType = "-";
                  $scope.message.imageContentType = "-";

              }else{
                  $scope.message.imageName = filename;
                  $scope.message.imageFile = kvlUrlServer + "saved/" + filenameSave;
                  $scope.message.image     = "-";
                  $scope.message.imageType = "inbox";
                  $scope.message.imageContentType = "jpg";
              }

              $http({
                  method    : 'POST',
                  url       : ServLink,
                  contentType: 'application/json',
                  data      : JSON.stringify(dataInbox),
              })
              .success(function(result) {
                  // console.log(result);
                  $ionicLoading.hide();
                  if ((result.status) == "1" && (result.status) == 1) {

                  // var idMessage = result.idVal;

                  // var filenameSave = localStorage.getItem("filename");
                  // var base64Save   = localStorage.getItem("srcImage");
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                          title: 'Berhasil',
                          cssClass  : 'alertCustom',
                          template: 'Pesan Anda terkirim, akan kami proses segera',
                          okType  : 'button-custom-ok'
                      });
                      alertPopup.then(function(res) {
                          // $state.go('app.inbox', { url: '/inbox' });
                          if (idCustomer == null){
                              location.reload();
                              location.href="#/app/home";
                              $ionicLoading.hide();
                          }else{
                              location.reload();
                              location.href="#/app/inbox";
                              $ionicLoading.hide();
                          }
                      });
                  } else {
                      $ionicLoading.hide();
                      $rootScope.showAlert({
                          title  : "Information",
                          message: "Pesan Anda Gagal. Silakan input kembali pesan Anda"
                      });
                  }
              }).error(function(err){
                  $ionicLoading.hide();
                  if (typeof cordova != 'undefined') {
                    $ionicPopup.alert({
                      title   : 'Oopos',
                      template: 'Terjadi kesalahan koneksi',
                      cssClass  : 'alertCustom',
                      okText  : 'Ok',
                      okType  : 'button-custom-ok'
                    });
                      // $cordovaToast.showLongBottom('Terjadi kesalahan koneksi');
                  }
              });
          }
      }
  }
})