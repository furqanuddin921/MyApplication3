app.controller('PemohonCtrl', function ($scope,$timeout, $http, $state, $window, $ionicPopup, $ionicHistory, $ionicLoading) {

  $scope.doBack = function () {
    var nilaiAjuan = $window.localStorage.getItem("nilaiAjuan");
    if (nilaiAjuan == null){
        location.href = "#/app/simulasikredit";
    }else{
        location.href = "#/app/simulasikredit/"+nilaiAjuan;
    }
  }

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    var agunanAjuan = $window.localStorage.getItem("agunanAjuan");
    if (agunanAjuan == "BPKB-Motor") {
      $scope.placeDeskripsi = "Contoh: Honda Beat"
    } else if (agunanAjuan == "BPKB-Mobil") {
      $scope.placeDeskripsi = "Contoh: Toyota Avanza"
    } else if (agunanAjuan == "Sertifikat Tanah dan Bangunan") {
      $scope.placeDeskripsi = "Contoh: Sertifikat Rumah Hak Milik"
    } else if (agunanAjuan == "Invoice Alat Berat/BPKB Truk" || agunanAjuan == "Invoice Machinery") {
      $scope.placeDeskripsi = "Contoh: Alat Traktor"
    } else if (agunanAjuan == "-") {
      $scope.placeDeskripsi = "Contoh: Toyota Avanza"
    }
  })

  var dataSubmit        = $scope.submit = {};
  var PengajuanLink     = kvlUrlFinance + "MobilePengajuanAction";
  $scope.class_password = "hidden";

  var idEmail       = null;
  var customerID    = $window.localStorage.getItem("CUSTOMER");
  var newCustomer   = $window.localStorage.getItem("customerID"); //.substring(0,6)

  if (customerID == null) {
      $scope.ceked        = "false";
      $scope.element_cek  = "hidden";
      $window.localStorage.setItem("statusCustomer","NEW");
  }else{
    var customerRO = customerID.substring(0,6);

    if(customerRO == "APPBFI"){
      $scope.ceked        = "false";
      $scope.element_cek  = "hidden";
      $window.localStorage.setItem("statusCustomer","NEW");
    } else {
      var socmedLogin = localStorage.getItem("socmed_login");
      $scope.ceked = "true";

      if (socmedLogin == "yes") {
        $scope.submit.cekSendiri = false;
      } else {
        $scope.submit.cekSendiri = true;
      }

      $scope.submit.fullname    = $window.localStorage.getItem("fullname");
      $scope.submit.handphone   = $window.localStorage.getItem("handphone");
      $scope.submit.email       = $window.localStorage.getItem("email");
      $scope.element_cek        = "show";
      localStorage.setItem("referralID", "0");
    }
  }

  $scope.doBlurDesk = function (deskAssets) {

  }

  function seacrEmail(email) {
    var customerLogin = $window.localStorage.getItem("CUSTOMER");
    $http({
        method: 'GET',
        url: kvlUrlFinance + 'MobileCustomerAction?action=cekEmail&email=' + email,
        headers : localStorageTokenBearer()
    })
    .success(function (result) {
      console.log(result)
      if (result.rows.length > 0) {
        localStorage.setItem("idEmail", "1");
        console.log("Email Sudah Terdaftar");
        $scope.class_password = "hidden";
      } else {
        localStorage.setItem("idEmail", "0");
        console.log("Email Belum Terdaftar");
        if (customerLogin == null) {
          $scope.class_password = "show";
          $scope.textPassword   = true;
        } else {
          $scope.class_password = "hidden";
        }
      }
    });
  }

  function searchHandphone(handphone) {
    var handphoneLogin = $window.localStorage.getItem("handphone");
    var customerLogin = $window.localStorage.getItem("CUSTOMER");

    if (customerLogin == null) {
      localStorage.setItem("referralID", "0");
    } else {
      if (handphone !== handphoneLogin) {
        localStorage.setItem("referralID", customerLogin);
      } else {
        localStorage.setItem("referralID", "0");
      }
    }
  }

  $scope.doLoadHandphone = function (handphone) {
    var ihandphone = handphone.substring(0, 1);
    var bhandphone = handphone.substring(1, 13);
    if (ihandphone == "0") {
      $scope.submit.handphone = "62" + bhandphone;
    } else {
      $scope.submit.handphone = handphone;
    }
    searchHandphone($scope.submit.handphone);
  }

  $scope.doLoadEmail = function (email) {
    seacrEmail(email);
  }

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
    localStorage.removeItem("idRatePinjaman");
    localStorage.removeItem("idJenisAjuan");
    localStorage.removeItem("hargaPerkiraan");
    localStorage.removeItem("idTenor");
    localStorage.removeItem("jenisAjuan");

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
  }

  var nilaiAjuan    = $window.localStorage.getItem("nilaiAjuan");
  var angsuranAjuan = $window.localStorage.getItem("angsuranAjuan");
  var agunanAjuan   = $window.localStorage.getItem("agunanAjuan");
  var waktuAjuan    = $window.localStorage.getItem("tenorAjuan");
  var tahunAjuan    = $window.localStorage.getItem("tahunAjuan");
  var jenisAjuan    = $window.localStorage.getItem("jenisAjuan");
  var kondisiAjuan  = $window.localStorage.getItem("kondisiAjuan");
  var dpAjuan       = $window.localStorage.getItem("dpAjuan");
  var parentID      = $window.localStorage.getItem("CUSTOMER");

  if (agunanAjuan == "BPKB-Motor") {
    $scope.placeDeskripsi = "Contoh: Honda Beat"
  } else if (agunanAjuan == "BPKB-Mobil") {
    $scope.placeDeskripsi = "Contoh: Toyota Avanza"
  } else if (agunanAjuan == "Sertifikat Tanah dan Bangunan") {
    $scope.placeDeskripsi = "Contoh: Sertifikat Rumah Hak Milik"
  } else if (agunanAjuan == "Invoice Alat Berat/BPKB Truk" || agunanAjuan == "Invoice Machinery") {
    $scope.placeDeskripsi = "Contoh: Alat Traktor"
  } else if (agunanAjuan == "-") {
    $scope.placeDeskripsi = "Contoh: Toyota Avanza"
  }

  if (parentID == null) {
    parentID = "0";
  }
  if (tahunAjuan == null) {
    tahunAjuan = "0";
  }
  if (jenisAjuan == null) {
    jenisAjuan = "0";
  }
  if (kondisiAjuan == null) {
    kondisiAjuan = "0";
  }
  $scope.input_type = "password";

  $scope.doLoadPassword = function () {
    var password = $scope.submit.inputPassword;
    if (password == null || password == "") {
      $scope.showAlert({
        title: "Information",
        message: "Password Anda masih kosong"
      });
    } else {
      if ($scope.input_type == 'password') {
        $scope.input_type = 'text';
      } else {
        $scope.input_type = 'password';
      }
    }
  }

  $scope.doCekList = function ($event) {
    var fullname  = $window.localStorage.getItem("fullname");
    var handphone = $window.localStorage.getItem("handphone");
    var email     = $window.localStorage.getItem("email");
    var customer  = $window.localStorage.getItem("CUSTOMER");

    if ($scope.submit.cekSendiri) {
      $scope.submit.fullname  = fullname;
      $scope.submit.handphone = handphone;
      $scope.submit.email     = email;
      seacrEmail(email);
      searchHandphone(handphone);
    } else {
      $scope.submit.fullname  = "";
      $scope.submit.handphone = "";
      $scope.submit.email     = "";
      seacrEmail("0");
      searchHandphone(handphone);
    }

  }

  function saveOrder() {
    var customer      = $window.localStorage.getItem("CUSTOMER");
    var customerID    = $window.localStorage.getItem("customerID");
    var idEmail       = $window.localStorage.getItem("idEmail");
    var handphoneVal  = $window.localStorage.getItem("handphone");
    var emailVal      = $window.localStorage.getItem("email");
    var referralID    = $window.localStorage.getItem("referralID");

    if (!$scope.submit.fullname) {
      $scope.showAlert({
        title: "Information",
        message: "Mohon maaf, Masukkan nama lengkap Anda"
      });
    }
		else if (!$scope.submit.handphone) {
      $scope.showAlert({
        title: "Information",
        message: "Mohon maaf, Masukkan nomor handphone Anda"
      });
    }
		else if (!$scope.submit.email && referralID == "0") {
      $scope.showAlert({
        title: "Information",
        message: "Mohon maaf, Masukkan email Anda"
      });
    }
		else if (!$scope.submit.deskAsset) {
      $scope.showAlert({
        title: "Information",
        message: "Mohon maaf, Masukkan Deskripsi Agunan Anda"
      });
    }
	// 	else if (!$scope.submit.inputPassword && idEmail == 0 && customer == null) {
  //    $scope.showAlert({
  //      title: "Information",
  //      message: "Mohon maaf, Silahkan isi Password Anda terlebih dahulu"
  //    });
  //  }
		else {

      $scope.submit.action        = "addProccess";
      $scope.submit.id            = "0";
      $scope.submit.nilaiAjuan    = nilaiAjuan;
      $scope.submit.angsuranAjuan = $window.localStorage.getItem("angsuranAjuan");
      $scope.submit.agunanAjuan   = $window.localStorage.getItem("agunanAjuan");
      $scope.submit.waktuAjuan    = $window.localStorage.getItem("waktuAjuan");
      $scope.submit.parentID      = parentID;
      $scope.submit.hubungiAjuan  = "-";
      $scope.submit.cabangAjuan   = "0";
      $scope.submit.statusAjuan   = "Customer";
      $scope.submit.referralID    = referralID;
      $scope.submit.customerID    = $window.localStorage.getItem("customerID");
      $scope.submit.adminId       = $window.localStorage.getItem("userEmployeeID");

      var statusCustomer          = $window.localStorage.getItem("statusCustomer");

      if(statusCustomer == "NEW"){
        $scope.submit.statusPengajuan   = "NEW";
      }else{
          if($scope.submit.email == emailVal){
              $scope.submit.statusPengajuan   = "RO";
          }else{
              if($scope.submit.handphone == handphoneVal){
                  $scope.submit.statusPengajuan   = "RO";
              }else{
                  $scope.submit.statusPengajuan   = "CGC";
              }
          }
      }

      if (emailVal == null) {
        $scope.submit.emailLogin = "null";
      } else {
        $scope.submit.emailLogin = emailVal;
      }

      if (idEmail == 0 && customer != null) {
        $scope.submit.password = "0";
      //  $scope.submit.password = $scope.submit.inputPassword;
      } else if (idEmail == 0) {
        // console.log("---------------2");
      //  $scope.submit.password = $scope.submit.inputPassword;

        $scope.submit.password = "0";
      } else {
        // console.log("---------------3");
        $scope.submit.password = "0";
      }

      var hpLogin = $window.localStorage.getItem("handphone");
      if (hpLogin == null) {
        $scope.submit.passwordLogin = "0";
      } else {
        if ($scope.submit.handphone !== $scope.submit.hpLogin) {
          $scope.submit.passwordLogin = hpLogin;
        } else {
          $scope.submit.passwordLogin = "0";
        }
      }

      var customer = $window.localStorage.getItem("CUSTOMER");
      if (customer == null) {
        $scope.submit.handphoneLogin = "0";
      } else {
        $scope.submit.handphoneLogin = hpLogin;
      }

      if ($scope.submit.email == null || $scope.submit.email == "" || $scope.submit.email === undefined) {
        $scope.submit.email = "0";
      }

      if ($scope.submit.email == emailVal) {
        $scope.submit.email = emailVal;
      } else {
        $scope.submit.email = $scope.submit.email;
      }

      if (agunanAjuan == "BPKB-Motor") {
        $scope.submit.typeAjuan = "NDF Motor";
        $scope.submit.tahunAjuan = tahunAjuan;
        $scope.submit.jenisAjuan = $scope.submit.deskAsset;
        $scope.submit.dpAjuan = "0";
        $scope.submit.kondisiAjuan = "0";
      }
      else if (agunanAjuan == "BPKB-Mobil") {
        $scope.submit.typeAjuan = "NDF Car";
        $scope.submit.tahunAjuan = tahunAjuan;
        $scope.submit.jenisAjuan = $scope.submit.deskAsset;
        $scope.submit.dpAjuan = "0";
        $scope.submit.kondisiAjuan = "0";
      }
      else if (agunanAjuan == "Sertifikat Tanah dan Bangunan") {
        $scope.submit.typeAjuan = "NDF Property";
        $scope.submit.tahunAjuan = "0";
        $scope.submit.jenisAjuan = "0";
        $scope.submit.dpAjuan = "0";
        $scope.submit.kondisiAjuan = "0";
      }
      else if (agunanAjuan == "Invoice Alat Berat/BPKB Truk") {
        $scope.submit.typeAjuan = "NDF HETO";
        $scope.submit.tahunAjuan = tahunAjuan;
        $scope.submit.jenisAjuan = jenisAjuan + " - " + $scope.submit.deskAsset;
        $scope.submit.kondisiAjuan = kondisiAjuan;
        $scope.submit.dpAjuan = dpAjuan;
      }
      else if (agunanAjuan == "Invoice Machinery") {
        $scope.submit.typeAjuan = "NDF MACHINERY";
        $scope.submit.tahunAjuan = tahunAjuan;
        $scope.submit.jenisAjuan = jenisAjuan + " - " + $scope.submit.deskAsset;
        $scope.submit.kondisiAjuan = kondisiAjuan;
        $scope.submit.dpAjuan = dpAjuan;
      }
      else if (agunanAjuan == "-") {
        // console.log(dpAjuan);
        $scope.submit.typeAjuan = "DF Car";
        $scope.submit.tahunAjuan = tahunAjuan;
        $scope.submit.jenisAjuan = $scope.submit.deskAsset;
        $scope.submit.kondisiAjuan = kondisiAjuan;
        $scope.submit.dpAjuan = dpAjuan;
      }

      $scope.submit.IsDigital = "0";

      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      });

      if($scope.submit.password==undefined){
          $scope.submit.password = "-";
      }

      console.log(dataSubmit)
      $http({
        method: 'POST',
        url: PengajuanLink,
        contentType: 'application/json',
        data: JSON.stringify(dataSubmit),
        headers : localStorageTokenBearer()
      }).success(function (result) {
        // console.log(result);
        $ionicLoading.hide();
        if ((result.status) == "1" || (result.status) == 1) {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Berhasil',
            cssClass  : 'alertCustom',
            template: 'Terima kasih sudah mengajukan pembiayaan di BFI. Pengajuan Anda akan segera kami proses',
            okType  : 'button-custom-ok'
          });

          alertPopup.then(function (res) {
						doResetLocalStorage();
							// $ionicHistory.nextViewOptions({
							//   disableBack: true
							// });

						$ionicPlatform.onHardwareBackButton(function() {
							location.href = "#/app/";
						});
						$window.location.reload();
						doResetLocalStorage();

						$scope.submit.fullname = "";
						$scope.submit.handphone = "";
						$scope.submit.email = "";
						$scope.submit.deskAsset = "";

						// $state.go('app.index', { url: '/index' });
						$state.go('app.index', {}, {reload: true});

          });
					$state.go('app.index', {}, {reload: true});
        } else {
          $ionicLoading.hide();
          var Description = result.description;
          if (Description == "Data Masih Dalam Proses"){
              Description = "Data pengajuan Anda sebelumnya, Masih dalam proses";//result.description;
          }else{
              Description = "Silahkan coba lagi";
          }
          $scope.showAlert({
            title: "Information",
            message: "Pengajuan Pembiayaan Gagal. "+result.description
          });
        }
      });
    }
  }

  $scope.doAjuanSubmit = function () {
    console.log("Ajuan Submit");
    var idEmail = $window.localStorage.getItem("idEmail");
    var CUSTOMER = $window.localStorage.getItem("CUSTOMER");
    if (idEmail == "0" || idEmail == 0) {
    //  if (CUSTOMER == null) {
    //    var lengthPassword = $scope.submit.inputPassword.toString();
    //    if (lengthPassword.length < 6) {
    //      $scope.showAlert({
    //        title: "Password Salah",
    //        message: "Password yang Anda masukkan kurang dari 6 Digit"
    //      });
    //    } else {
    //      saveOrder();
    //    }
    //  } else {
    //    saveOrder();
    //  }
      saveOrder();
    } else {
      saveOrder();
    }
  }
})
