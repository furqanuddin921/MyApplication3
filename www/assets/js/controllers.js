var app = angular.module('starter.controllers', [])
app.controller('AppCtrl', function($rootScope, $scope, $state, $ionicModal, $timeout, $ionicPopup, $ionicHistory, $ionicLoading) {
  $rootScope.bodyClass = '';

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    // Simulate a login delay. Remove this and replace with your login - code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $rootScope.showAlert = function (msg) {
    $ionicPopup.alert({
      title   : msg.title,
      template: msg.message,
      cssClass: 'alertCustom',
      okText  : 'Ok',
      okType  : 'button-custom-ok'
    });
  };

  $rootScope.doLogout = function () {
    if(!localStorage.getItem('fullName')){
      $state.go('app.login');
    }else{
      var confirmPopup = $ionicPopup.confirm({
      title     : 'Keluar Aplikasi',
      cssClass  : 'alertCustom',
      template  : 'Anda yakin untuk logout dari BFI SRS?',
      buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
        text: 'Cancel',
        type: 'button-custom-cancel',
        onTap: function(e) {
          confirmPopup.close();
        }
      }, {
        text: 'OK',
        type: 'button-custom-ok',
        onTap: function(e) {
          return true;
        }
      }]
    });
    confirmPopup.then(function (res) {
      if (res) {
        $rootScope.belumLogin = "show";
        $rootScope.sudahLogin = "hidden";
        $rootScope.isLoggedIn = false;
        localStorage.clear();
        $ionicLoading.show({ template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>' });

        setTimeout(function(){
          $ionicLoading.hide();
          $ionicPopup.alert({
            title   : "Logout",
            template: "Anda berhasil keluar akun",
            cssClass: 'alertCustom',
            okText  : 'Ok',
            okType  : 'button-custom-ok'
          });
          $state.go('app.index', {}, {reload: true});
        }, 500);
        // $scope.setvideo();

        // toastCtrl.showShortBottom("Berhasil logout");
      } else {
        //$state.go('app.home', { url: '/home' });
      }
    });
    }


  }

  $rootScope.isLoggedIn = false;
  $rootScope.userId = localStorage.getItem("userId");
  if( $rootScope.userId != '' && $rootScope.userId != null ) {
    $rootScope.isLoggedIn = true;
  }

  $rootScope.doBack = function () {
    $ionicHistory.goBack();
  }

  $rootScope.setVideo = function(){
    var panduanVideoid = localStorage.getItem("panduanVideoId" , $stateParams.idPanduan);
    if(panduanVideoid != undefined || panduanVideoid != null){
      Api.getHelpPageContentByPageID($stateParams.idPanduan).then(function(res){
        $ionicLoading.hide();
        if(res.rows.length > 0 ) {
          $scope.title  = res.rows[0].title;
          $scope.type = $stateParams.type;
          if( res.rows[0].content.includes('<video') ) {
            $scope.type   = 'video';
          }
          $scope.data = res.rows[0];
          var videoName = (res.rows[0].title).replace(/\s/g, "");

          if ($scope.data.content.indexOf('<video') >= 0){
            var datahtml = $scope.data.content.replace('<source','<source id="idSrckasir" ');
            var datahtml2 = datahtml.replace('<video','<video id="idvideokasir" ');
            $scope.data.content = datahtml2;
            $timeout(function() {
              var urlDownload = document.getElementById("idSrckasir").src;
              $scope.PosterVideo = document.getElementById("idvideokasir").poster;
              if(localStorage.getItem(videoName)==undefined||localStorage.getItem(videoName)==null){
                $ionicLoading.show({template: '<p>Loading...</p><ion-spinner></ion-spinner>'});
                var targetPath  = ionic.Platform.isIPad() || ionic.Platform.isIOS() ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;
                targetPath+= videoName +".mp4";
                $scope.DwonloadVideo(targetPath,urlDownload,videoName);
              }else{
                var urlLocal = localStorage.getItem(videoName+"_url");
                if(urlDownload==urlLocal){
                  $('video').replaceWith('<video id="idvideolocal" poster='+$scope.PosterVideo+' controls="controls" width="1280" height="700"><source id="idSrckasir" src='+localStorage.getItem(videoName)+' type="video/mp4"></video>');
                }else{
                  localStorage.removeItem(videoName+"_url");
                  localStorage.removeItem(videoName);
                  $scope.beforeEnterPanduan();
                  console.log("content beda dari server")
                }
              }
            }, 500);

          }else{
            $scope.data = res.rows[0];
            $scope.data.content = $scope.data.content.replace('src\u003d\"saved/','src\u003d\"'+kvlUrl+'/saved/');
          }
        }
      },function(err){
        $ionicLoading.hide();
      });
    }

  }
  $scope.DwonloadVideo = function (targetPath,url,videoName) {
    $cordovaFileTransfer.download(url, targetPath, {}, true).then(function(result){
      console.log(result)
      if(result.isFile==true){
        localStorage.setItem(videoName+"_url", url);
        localStorage.setItem(videoName, result.nativeURL);
        $scope.beforeEnterPanduan();
      }
    }, function (err){
      console.log(err)
      $ionicLoading.hide();
    }, function (e) {
      var persentase = e.loaded/e.total*100;
      console.log(e.loaded, e.total)
      $scope.progressval = persentase.toString().split(".")[0];
      if(persentase >= 97) $scope.progressval = "100"; else $scope.progressval = $scope.progressval
      $ionicLoading.show({
        template: 'Download '+$scope.progressval+'% <br> <progress id="progressbar" max="100" value="{{ progressval }}"></progress>',
        scope: $scope
      });
    });
  }
})

.controller('MenuCtrl', function ($rootScope, $scope, $filter, $http, $state, $ionicPopup, $window, $ionicLoading, $q, $timeout, $ionicSideMenuDelegate, Api, Common) {
  window.$$$ionicPopup = $ionicPopup;
  window.$$$ionicLoading = $ionicLoading;
  $scope.versioningapps = kvlAppVer;
  console.log(">> MENU >>");
  var token       = localStorage.getItem("token");
  var userId      = localStorage.getItem("userId");
  var idCustomer  = localStorage.getItem("userId");
  var fullname    = localStorage.getItem("fullname");

  $scope.loadMenu = true;
  if (userId == null) {
    $scope.menuBeforeLogin    = "show";
    $scope.menuAfterLogin     = "hidden";

    $scope.menuAfterLoginMenu = false;
    $scope.menuBeforeLoginMenu= true;

    $scope.element_dashboard  = "hidden";
    $scope.element_inbox      = "hidden";
    $scope.fullnameLogin      = "Welcome";
  } else {
    $scope.menuAfterLogin     = "show";
    $scope.menuBeforeLogin    = "hidden";

    $scope.menuAfterLoginMenu = true;
    $scope.menuBeforeLoginMenu= false;

    $scope.element_dashboard  = "show";
    $scope.element_inbox      = "show";
    $scope.fullnameLogin      = "Welcome, " + fullname;
  }

  $rootScope.changeMenu = function(){

    // if( $rootScope.groups == '' || $rootScope.groups == null ) {
    //   $ionicLoading.show({
    //     template: '<p>Loading Data...</p><ion-spinner icon="android"></ion-spinner>'
    //   });
    // }

    console.log("changeMenu ")

    getMenuList().then(function (menuList){
      $scope.loadMenu = false;
      $rootScope.groups = menuList;
      localStorage.setItem("menulist",JSON.stringify(menuList));
    }, function(error) {
      console.log(error);
    }, function(update) {

    });

  }

  function getMenuList(){
    //==
    var q = $q.defer();
    Api.getHelpPageDataList().then(function(res){
      console.log("getHelpPageDataList");
      console.log(res);
      if(res == null){

      }else{
        if( res.rows.length > 0 ) {
          $http.get('assets/jsondata/menu_list.json').success(function(response){
            // STATIC MENU --
            var mainMenu = response;
            var subMenu = [
              { "icon": "assets/img/ico-profil.png", "department": "Akun Saya", "firstName": "Profil", "link": "#/app/profil" },
              { "icon": "assets/img/ico-pesan.png", "department": "Akun Saya", "firstName": "Pesan", "link": "#/app/pesan" },
              { "icon": "assets/img/new-uber-milyaran-side.svg", "department": "Terbaru", "firstName": "Uber Milyaran", "link": "#/app/reward" },
              { "icon": "assets/img/icon-berita.png", "department": "Terbaru", "firstName": "Berita dan Promo", "link": "#/app/promo" },
              { "icon": "assets/img/ico-merchant.png", "department": "Terbaru", "firstName": "Merchant", "link": "#/app/merchant" },
            ];
            var thirdSubMenu = [];

            // DYNAMIC MENU -------------
            var dataDynamic = res.rows;
            var dataTemp = [];
            for( var i in dataDynamic ) {
              var dataLoop = {};
              if(dataDynamic[i].parentId != 'none' && dataDynamic[i].pageType != 'content'){
                console.log(">>> "+dataDynamic[i].title);
                dataLoop["icon"]        = dataDynamic[i].imageFile;
                dataLoop["department"]  = dataDynamic[i].parentTitle;
                dataLoop["firstName"]   = dataDynamic[i].title;
                dataLoop["link"]        = "#/app/panduan-list/" + dataDynamic[i].id;
                dataLoop["id"]          = dataDynamic[i].id;
                dataLoop["pageType"]    = dataDynamic[i].pageType;

                dataTemp.push(dataLoop);
              }else if(dataDynamic[i].parentId != 'none' && dataDynamic[i].pageType == 'content'){
                dataLoop["icon"]        = dataDynamic[i].imageFile;
                dataLoop["department"]  = dataDynamic[i].parentTitle;
                dataLoop["firstName"]   = dataDynamic[i].title;
                dataLoop["link"]        = "#/app/panduan-content/service/" + dataDynamic[i].id;
                dataLoop["id"]          = dataDynamic[i].id;
                dataLoop["pageType"]    = dataDynamic[i].pageType;

                dataTemp.push(dataLoop);
              }else{

              }
            }
            var subMenu = subMenu.concat(dataTemp);

            // START GENERATE MENU ----------
            var groupslist = [];
            var totalmainMenu = mainMenu.length;
            var totalsubMenu  = subMenu.length;

            for (var i = 0; i < totalmainMenu; i++) {
              groupslist[i] = {
                name      : mainMenu[i].name,
                icon      : mainMenu[i].icon.replace("LIVE", ""),
                linkk     : mainMenu[i].link,
                imgtambah : mainMenu[i].imgtambah,
                addClass  : mainMenu[i].addClass,
                type      : mainMenu[i].type,
                items     : [],
                link      : []
              };
              var itemData = -1;

              for (var j = 0; j < totalsubMenu; j++) {
                if (subMenu[j].department === mainMenu[i].name) {
                  groupslist[i].items.push({
                    'submenu'   : subMenu[j].firstName,
                    'link'      : subMenu[j].link,
                    'icon'      : subMenu[j].icon.replace("LIVE", ""),
                    'imgtambah' : subMenu[j].imgtambah,
                    'type'      : mainMenu[i].type,
                    'pagetype'  : subMenu[j].pageType,
                    'id'        : subMenu[j].id,
                    'subItem'   : []
                  });
                  itemData++;

                  for( var k in thirdSubMenu ){
                    if( thirdSubMenu[k].employee === subMenu[j].firstName ){
                      groupslist[i].items[itemData].subItem.push({
                        'submenu': thirdSubMenu[k].firstName,
                        'link': thirdSubMenu[k].link,
                        'icon': thirdSubMenu[k].icon.replace("LIVE", "")
                      });
                    }
                  }
                }
              }
            }
            // console.log("groupslist");
            console.log(groupslist);
            q.resolve(groupslist);
          });
        }
      }

    }, function(err){
      console.log("aaa", err)
    });
    return q.promise;
  }

  // TRIGGER CHANGE MENU

  $rootScope.changeMenu();

  $scope.toggleGroup = function (group) {
    if (group.name == "Keluar") {
      $rootScope.doLogout();
    }
    if (group.items.length > 0) {
      console.log(">> "+group.items.length);
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
      $scope.shownItem = null;
    } else {
      var a = $ionicSideMenuDelegate.toggleLeft(false);
    }

  };

  $scope.toggleItem = function (item) {

    if (item.subItem.length > 0) {
      if ($scope.isItemShown(item)) {
        $scope.shownItem = null;
      } else {
        $scope.shownItem = item;
      }
    } else {
      var a = $ionicSideMenuDelegate.toggleLeft(false);
    }
  };

  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };

  $scope.isItemShown = function (item) {
    return $scope.shownItem === item;
  };

  // END MENU

})

.controller('SlideHome', function ($scope, $ionicPopup, $http, $ionicSlideBoxDelegate, $window, $ionicLoading, Api, Common) {

  $scope.showSlider = false;
  function doConfirmAcessContact(){

    localStorage.setItem("getPhoneContact","true");
    localStorage.setItem("getConfirmationContact","true");
  }

  if(localStorage.getItem("firstApps")=="true"){
      doConfirmAcessContact();
  }

  var hasilResult;
  function getSlider() {
    Api.slider().then(function (result){
      if (result.rows.length > 0) {

        $scope.showSlider = true;
        hasilResult = result.rows;
        $scope.event = {
          prizes: hasilResult
        }
        $ionicSlideBoxDelegate.update();
        $ionicSlideBoxDelegate.loop(true);
        $scope.urlSliderDetail = "app.slider-detail({idSlider: sliders.id})";
      } else {
        console.log("Slidernye kosong bro");
      }
      clearTimeout(res);
      $ionicLoading.hide();
    }, function(error) {
      console.log(error);
      clearTimeout(res);
      $ionicLoading.hide();
    }, function(update) {
      clearTimeout(res);
      $ionicLoading.hide();
    });

  }
  getSlider();

  function showBanner(index) {
    var oldElm  = document.querySelector('.slider ion-slide.slider-slide.current');
    var q       = '.slider ion-slide.slider-slide[data-index="' + index + '"]';
    var elm     = document.querySelector(q);
    // Remove class "current"
    if (null !== oldElm) {
      oldElm.classList.remove("current");
    }
    // Add class "current" to current slide
    if (null !== elm) {
      elm.classList.add("current");
    }
  }
  $scope.options = {
    loop: true
  };

  //get slider from database
  // $scope.activeSlide = 0;
  setTimeout(function () {
    // showBanner($scope.activeSlide);
    $ionicSlideBoxDelegate.$getByHandle('sliderBan').update();
  }, 100);

  // $scope.slideChanged = showBanner;
  $scope.slideHasChanged = function (index) {
    // showBanner();
    $scope.slideIndex = index;
    if (($ionicSlideBoxDelegate.$getByHandle('sliderBan').count() - 1) == index) {
      $timeout(function () {
        $ionicSlideBoxDelegate.$getByHandle('sliderBan').slide(0);
      }, $scope.interval);
    }
  }
})

.controller('SliderDetailCtrl', function (Api, Common, $scope, $http, $state, $ionicLoading, $ionicSlideBoxDelegate, $cordovaSocialSharing, $stateParams, $window) {
  //detail promo by id -------
  // $ionicLoading.show({ template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>' });

  var idSlider = $stateParams.idSlider;

  window.$$$scope = $scope;

  Api.sliderDetail(idSlider).then(function(result){
    $scope.disabledButton = false;
    console.log(result)
    if (result.rows.length > 0) {
      console.log("zzzzzzzzzzzzzz")
      var hasilSocial     = [];
      var sharingMessage  = result.rows[0].name;
      $scope.imageSlider  = result.rows[0].imageName;
      $scope.nameSlider   = result.rows[0].name;
      $scope.dateSlider   = result.rows[0].tanggalUpdate;
      $scope.descSlider   = result.rows[0].descriptionDetail;
      console.log(result.rows[0].imageName)

      hasilSocial.push({
        sharingMessage  : sharingMessage,
        sharingLink     : "https://www.bfi.co.id/",
        sharingImage    : result.rows[0].imageName
      })

      $scope.social = {
        listSocial: hasilSocial
      }
      clearTimeout(timeoutvar);
      $ionicLoading.hide();
    } else {
      console.log("else")
      clearTimeout(timeoutvar);
      $ionicLoading.hide();

      Interaction.alert("Information","Username/Password Anda salah.");

      $scope.login.password="";
    }
  },function(err){
    console.log(err)
  });

  var shareFacebook = '';
  var shareTwitter  = '';

  if($window.cordova){
    appAvailability.check(
      'com.facebook.katana',
      function () {           // Success callback
        shareFacebook = 'FacebookAvailable';
      },
      function () {           // Error callback
        shareFacebook = 'FacebookNotAvailable';
      }
    );
    appAvailability.check(
      'com.twitter.android',
      function () {           // Success callback
        shareTwitter = 'TwitterAvailable';
      },
      function () {           // Error callback
        shareTwitter = 'TwitterNotAvailable';
      }
    );
  }

  $scope.sharingFacebook = function (sharingMessage, sharingLink) {
    console.log('shareFacebook: ' + shareFacebook);
    if (shareFacebook == "FacebookAvailable") {
      $cordovaSocialSharing.shareViaFacebook(sharingMessage, "", sharingLink)
        .then(function (result) {
          // Success!
        }, function (err) {
          console.error(err);
        });
    } else {
      // $window.open("https://play.google.com/store/apps/details?id=com.facebook.katana","_system");
      $window.open('http://www.facebook.com/sharer.php?u=' + sharingLink, '_system');
    }
  }

  $scope.sharingTwitter = function (sharingMessage, sharingImage, sharingLink) {
    console.log('twitterr: ' + shareTwitter);
    if (shareTwitter == "TwitterAvailable") {
      $cordovaSocialSharing
        .shareViaTwitter(sharingMessage, sharingImage, sharingLink)
        .then(function (result) {
          // Success!
        }, function (err) {
          console.error(err);
        });
    } else {
      // $window.open("https://play.google.com/store/apps/details?id=com.twitter.android","_system");
      $window.open('https://twitter.com/share?url=' + sharingLink, '_system');
    }
  }
})

.controller('SignalMeter', function ($rootScope, $scope, $http, $state, $ionicPopup, $window, $ionicLoading, $q, $timeout) {
  /*IDIKATOR SIGNAL*/
  $scope.indikator_red    = "hidden";
  $scope.indikator_green  = "show";
  $scope.indikator_orange = "hidden";
  /*alert("AAAAAAA");*/
  if(window.cordova){
    function signal(){
      window.SignalStrength.dbm(function(db){
        var networkState  = navigator.network.connection.type;
        var states        = {};

        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';

        if(db >= -90 && states[networkState] == states[Connection.CELL_4G] || db >= -90 && states[networkState] == states[Connection.CELL_3G] || db >= -90 && states[networkState] == states[Connection.WIFI]){
          $scope.indikator_green  = "show";
          $scope.indikator_orange = "hidden";
          $scope.indikator_red    = "hidden";
          /*alert("GREEN :::"+db);*/
        } else if(db <= -91 && states[networkState] == states[Connection.CELL_4G] || db <= -91 && states[networkState] == states[Connection.CELL_3G] || db <= -91 && states[networkState] == states[Connection.WIFI] || db <= -91 && states[networkState] == states[Connection.CELL_2G]) {
          $scope.indikator_green  = "hidden";
          $scope.indikator_orange = "show";
          $scope.indikator_red    = "hidden";
          /*alert("ORANGE :::"+db);*/
        } else if(db >= -110 && states[networkState] == states[Connection.NONE]){
          $scope.indikator_green  = "hidden";
          $scope.indikator_orange = "hidden";
          $scope.indikator_red    = "show";
          /*alert("RED :::"+db);*/
        }
      });
    }
    // setInterval(function(){
    //   signal();
    // },2000);
  }else{
      // console.log("WINDOWS");
  }

  //check connection internet
  function checkConnectionLIist(){
    $window.addEventListener('load', function() {
      function updateOnlineStatus(event) {
        var condition    = navigator.onLine ? "online" : "offline";
        status.className = condition;
        status.innerHTML = condition.toUpperCase();

        if(condition=="offline"){
          // action if offline
        }else{
          $ionicLoading.hide();
          $scope.koneksiInternet  = true;
          $scope.indikator_green  = "hidden";
          $scope.indikator_orange = "hidden";
          $scope.indikator_red    = "show";
        }
      }
      $window.addEventListener('online',  updateOnlineStatus);
      $window.addEventListener('offline', updateOnlineStatus);
    });
  }
  checkConnectionLIist();

  $scope.tryAgain = function(){
    $scope.koneksiInternet = false;
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });
    $timeout(function () {
      $ionicLoading.hide();
      window.location.reload();
      checkConnectionLIist();
    }, 1000);
  }

})

.controller('MeterSignalCtrl', function ($rootScope, $scope, $filter, $http, $state, $ionicPopup, $window, $ionicLoading, $q, $timeout) {
  var condition = navigator.onLine ? "online" : "offline";
  status.className = condition;
  status.innerHTML = condition.toUpperCase();

  if(condition=="offline"){
    console.log("OFFLINE");
    $scope.koneksiInternet  = true;
    $scope.showkoneksi      = "show";
    $scope.indikator_green  = "hidden";
    $scope.indikator_orange = "hidden";
    $scope.indikator_red    = "show";
  }else{
    console.log("ONLINE");
    $scope.koneksiInternet  = false;
    $scope.showkoneksi      = "show";
    $scope.indikator_green  = "show";
    $scope.indikator_orange = "hidden";
    $scope.indikator_red    = "hidden";
  }
  console.log($scope.indikator_red);
  // addEventListener('online',  updateOnlineStatus);
  // addEventListener('offline', updateOnlineStatus);
  $scope.tryAgain = function(){
    $scope.koneksiInternet = false;
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });
    $timeout(function () {
      $ionicLoading.hide();
      window.location.reload();
    }, 1000);
  }
})

.controller('footerCtrl', function ($rootScope, $scope, $http, $window, $state, $ionicPopup, $cordovaSocialSharing, $ionicActionSheet) {
  var storage = $rootScope.userId;
  if (storage != null) {
    $rootScope.belumLogin = "hidden";
    $rootScope.sudahLogin = "show";
  } else {
    $rootScope.belumLogin = "show";
    $rootScope.sudahLogin = "hidden";
  }

  $scope.doShare = function () {
    $ionicActionSheet.show({
      titleText: 'Bagikan Aplikasi',
      buttons: [
        { text: '<i class="icon ion-social-facebook"></i> Facebook' },
        { text: '<i class="icon ion-social-twitter"></i> Twitter' },
      ],
      cancelText: 'Cancel',
      cancel: function () {
        console.log('CANCELLED');
      },
      buttonClicked: function (index) {
        doShare(index);
        return true;
      },
      destructiveButtonClicked: function () {
        console.log('DESTRUCT');
        return true;
      }
    });
  }

  function doShare(index) {
    if (index == 0) {
      appAvailability.check(
        'com.facebook.katana',
        function () {           // Success callback
          $cordovaSocialSharing.shareViaFacebook("sharingMessage", "", "https://play.google.com/store/apps/details?id=com.bfifinance.bfiku")
            .then(function (result) {
              // Success!
            }, function (err) {
              // An error occurred. Show a message to the user
            });
        },
        function () {           // Error callback
          $window.open('http://www.facebook.com/sharer.php?u=https://play.google.com/store/apps/details?id=com.bfifinance.bfiku', '_system');
        }
      );
    } else {
      appAvailability.check(
        'com.twitter.android',
        function () {           // Success callback
          $cordovaSocialSharing.shareViaTwitter("sharingMessage", kvlUrl + "saved/2017-05-25_03-52-40.jpg", "https://play.google.com/store/apps/details?id=com.bfifinance.bfiku")
            .then(function (result) {
              // Success!
            }, function (err) {
              // An error occurred. Show a message to the user
            });
        },
        function () {           // Error callback
          // $window.open("https://play.google.com/store/apps/details?id=com.twitter.android","_system");
          $window.open('https://twitter.com/share?url=https://play.google.com/store/apps/details?id=com.bfifinance.bfiku', '_system');
        }
      );
    }
  }
})
// SRS
.controller('LoginCtrl', function($PopupUnauthorized, $rootScope, $scope, $state, $stateParams, $ionicLoading, $ionicPopup, $window, Api, Common, Interaction) {

  // window.firebase.analytics.logEvent("login_page");
  // window.FirebaseAnalytics;
  // $window['FirebasePlugin'].setCurrentScreen('Bookmarks');

  if (window.cordova) {
    // cordova.firebase.analytics.setCurrentScreen('login_page');
    console.error("firebase analytic setCurrentScreen login_page");
  }

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.login = {};
    $scope.disabledButton = false;
    $PopupUnauthorized.getTokenApiGee();
  });

  $scope.doForgotPassword = function(){
    $state.go('app.forgot-password', { url: '/forgot-password' });
    console.log('lupa  password');
  }


  console.log("scope loginn")

  $scope.doLoginUsers = function() {

    $ionicLoading.show({
        template: '<p>Sign In...</p><ion-spinner icon="android"></ion-spinner>'
    });

    if (!$scope.login.email){
      $ionicLoading.hide();
      $rootScope.showAlert({
          title  : "Information",
          message: "Mohon maaf, Email Anda masih kosong"
      });
    } else if (!$scope.login.password){
      $ionicLoading.hide();
      $rootScope.showAlert({
          title  : "Information",
          message: "Mohon maaf, Password Anda masih kosong"
      });
    }else{
      // $scope.disabledButton = true;
      Common.timeout('login user','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){


        Api.login($scope.login.email, $scope.login.password).then(function(res){
          $scope.disabledButton = false;
          if( res !== "" && res.total > 0 ){
            // toastCtrl.showShortBottom("Berhasil login");
            Interaction.alert("Login","Selamat Datang");

            localStorage.setItem('userId'           , $scope.login.email);
            localStorage.setItem('userEmail'        , res.rows[0].Email);
            localStorage.setItem('fullName'         , res.rows[0].EmployeeName);
            localStorage.setItem('userBranch'       , res.rows[0].BranchName);
            localStorage.setItem('userEmployeeID'   , res.rows[0].EmployeeID);
            localStorage.setItem('userPassword'     , res.rows[0].Password);
            localStorage.setItem('userEmployeePhone', res.rows[0].EmployeePhone);

            $rootScope.userId       = $scope.login.email;
            $rootScope.fullName     = res.rows[0].id;
            $rootScope.belumLogin   = "hidden";
            $rootScope.sudahLogin   = "show";
            $rootScope.isLoggedIn   = true;

            clearTimeout(timeoutvar);
            $ionicLoading.hide();

            $state.go('app.index');
          } else {
            clearTimeout(timeoutvar);
            $ionicLoading.hide();

            Interaction.alert("Information"," Username/Password Anda salah. ["+res.source+"]");

            $scope.login.password="";
          }
        }, function(err){
          clearTimeout(timeoutvar);
          $ionicLoading.hide();
          Interaction.alert("Information",  (navigator.onLine) ? "Unauthorized" : "Koneksi internet anda terputus");
        });
      });

    }
  }
  $scope.input_type = 'password';
  $scope.doLoadPassword = function () {
    var password = $scope.login.password;
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
})

.controller('ForgotPasswordCtrl', function($rootScope, $scope, $stateParams) {
  console.log("ForgotPasswordCtrl");
})

.controller('HomeCtrl', function($rootScope, $scope, $stateParams, $ionicSlideBoxDelegate, $window ) {

  // window.FirebasePlugin.logEvent("select_content", {content_type: "page_view", item_id: "home"});
  // window.FirebasePlugin.setScreenName("Home");

  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }

  $scope.doProdukLayanan = function(){
    $state.go('app.productknowledge', { url: '/productknowledge' });
  }

  $scope.doPromo = function(){
    $state.go('app.promo', { url: '/promo' });
  }

  $scope.doUber = function(){
    $state.go('app.reward', { url: '/reward' });
  }

  var userid = $window.localStorage.getItem("userId");
  // $scope.showDashboardIcon = false;
  if(userid == null || userid == undefined){
    console.log("NGGAK ADA");
    $scope.showDashboardIcon = false;
  }else{
    console.log("ADA");
    $scope.showDashboardIcon = true;
  }

})

.controller('PanduanCtrl', function ($rootScope, $scope, $http, $state, $stateParams, $ionicPopup) {

  // cordova.firebase.analytics.setCurrentScreen("panduan_page");
  var idPanduan = $stateParams.idPanduan;

  $scope.nama = idPanduan;
  console.log("$rootScope.groups");
  console.log($rootScope.groups);
  for( var i in $rootScope.groups ){
    var dataTemp = $rootScope.groups[i];
    if( dataTemp.name == idPanduan ) {
      $scope.items = dataTemp.items;
    }
  }

  $scope.openPanduanList = function(id){
    $state.go("app.panduanList", {idPanduan: id});
  }

  $scope.openPanduanContent = function(type,id){
    $state.go("app.panduanContent", {type : type ,idPanduan: id});
  }

})

.controller('PanduanListCtrl', function ($rootScope, $scope, $http, $state, $stateParams,$ionicLoading, $ionicPopup, $ionicHistory, Api, Common) {

  // cordova.firebase.analytics.setCurrentScreen("panduan_list_page");
  $scope.$on("$ionicView.beforeEnter", function (event, data) {

    $scope.dataPanduan = [];
    for( var i in $rootScope.groups ){
      var dataTemp = $rootScope.groups[i].items;

      for( var x in dataTemp ){
        if( dataTemp[x].id == $stateParams.idPanduan ){
          $scope.title  = dataTemp[x].submenu;
          $scope.type   = dataTemp[x].type;
        }
      }
    }

    Common.timeout('get panduan list','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      Api.getHelpPageByPageID($stateParams.idPanduan).then(function(res){
        $scope.loadingStatus = true;
        if(res.rows.length > 0 ) {
          $scope.dataPanduan = res.rows;
        }else{
          $rootScope.showAlert({
              title  : "Information",
              message: "Terjadi kesalahan saat ambil data ["+res.source+"]"
          });
        }
        clearTimeout(timeoutvar);

      }, function(err){
        clearTimeout(timeoutvar);
      });

    });

  });
  $scope.openPanduanList = function(id){
    $state.go("app.panduanList", {idPanduan: id});
  }
  $scope.openPanduanContent = function(id,type){
    $state.go("app.panduanContent", {idPanduan: id, type: type});
  }

})

.controller('PanduanContentCtrl', function ($rootScope,$scope, $cordovaFileTransfer, $ionicLoading, $http, $timeout, $state, $stateParams, $ionicPopup, $ionicHistory, Api, Common) {
  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    window.$$$scope = scopee = $scope;
    window.$$$state = $state;
    window.$$$rootScope = $rootScope;
    window.$$$stateParams = $stateParams;
    if(window.cordova){//furqan
      $scope.beforeEnterPanduan();
    }else{//fathur
      $scope.dataPanduan = [];

      Common.timeout('get panduan content','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){
        Api.getHelpPageContentByPageID($stateParams.idPanduan).then(function(res){
          console.log("resresres ", res)
            if(res.rows.length > 0 ) {
              console.log(res.rows);
              $scope.title  = res.rows[0].title;
              $scope.type = $stateParams.type;
              if( res.rows[0].content.includes('<video') ) {
                  $scope.type   = 'video';
              }
              $scope.data = res.rows[0];
              $scope.data.content = $scope.data.content.replace('src\u003d\"saved/','src\u003d\"'+kvlUrl+'/saved/');
            }
            clearTimeout(timeoutvar);
        }, function(err){
          clearTimeout(timeoutvar);
        });
      });

    }

  });

  $scope.beforeEnterPanduan = function(){
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
    $scope.dataPanduan = [];
    localStorage.setItem("panduanVideoId" , $stateParams.idPanduan);

    Common.timeout('get panduan content','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      Api.getHelpPageContentByPageID($stateParams.idPanduan).then(function(res){
        if(res.rows.length > 0 ) {
          $scope.title  = res.rows[0].title;
          $scope.type = $stateParams.type;
          if( res.rows[0].content.includes('<video') ) {
            $scope.type   = 'video';
          }
          $scope.data = res.rows[0];
          var videoName = (res.rows[0].title).replace(/\s/g, "");

          if ($scope.data.content.indexOf('<video') >= 0){
            var datahtml = $scope.data.content.replace('<source','<source id="idSrckasir" ');
            var datahtml2 = datahtml.replace('<video','<video id="idvideokasir" ');
            $scope.data.content = datahtml2;
            $timeout(function() {
              var urlDownload = document.getElementById("idSrckasir").src;
              $scope.PosterVideo = document.getElementById("idvideokasir").poster;
              if(localStorage.getItem(videoName)==undefined||localStorage.getItem(videoName)==null){
                $ionicLoading.show({template: '<p>Loading...</p><ion-spinner></ion-spinner>'});
                var targetPath  = ionic.Platform.isIPad() || ionic.Platform.isIOS() ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;
                targetPath+= videoName +".mp4";
                $scope.DwonloadVideo(targetPath,urlDownload,videoName);
              }else{
                var urlLocal = localStorage.getItem(videoName+"_url");
                if(urlDownload==urlLocal){
                  $('video').replaceWith('<video id="idvideolocal" poster='+$scope.PosterVideo+' controls="controls" width="1280" height="700"><source id="idSrckasir" src='+localStorage.getItem(videoName)+' type="video/mp4"></video>');
                }else{
                  localStorage.removeItem(videoName+"_url");
                  localStorage.removeItem(videoName);
                  $scope.beforeEnterPanduan();
                  console.log("content beda dari server")
                }
              }
            }, 500);

          }else{
            $scope.data = res.rows[0];
            $scope.data.content = $scope.data.content.replace('src\u003d\"saved/','src\u003d\"'+kvlUrl+'/saved/');
          }
        }
        clearTimeout(timeoutvar);
        $ionicLoading.hide();
      },
      function(err){
        clearTimeout(timeoutvar);
        $ionicLoading.hide();
        $scope.errorDownload();
      });

    });

  }

  $scope.DwonloadVideo = function (targetPath,url,videoName) {
    $cordovaFileTransfer.download(url, targetPath, {}, true).then(function(result){
      console.log(result)
      if(result.isFile==true){
        localStorage.setItem(videoName+"_url", url);
        localStorage.setItem(videoName, result.nativeURL);
        $scope.beforeEnterPanduan();
      }
    }, function (err){
      console.log(err)
      $ionicLoading.hide();
      $scope.errorDownload();
    }, function (e) {
      var persentase = e.loaded/e.total*100;
      console.log(e.loaded, e.total)
      $scope.progressval = persentase.toString().split(".")[0];
      if(persentase >= 97) $scope.progressval = "100"; else $scope.progressval = $scope.progressval
      $ionicLoading.show({
        template: 'Download '+$scope.progressval+'% <br> <progress id="progressbar" max="100" value="{{ progressval }}"></progress>',
        scope: $scope
      });
    });
  }

  $scope.errorDownload = function(){
    $ionicPopup.alert({
      title   : 'Oops',
      template: 'Terjadi kesalahan koneksi',
      cssClass: 'alertCustom',
      okText  : 'Coba Lagi',
      okType  : 'button-custom-ok'
    }).then(function(res){
      if(res){
        $ionicLoading.show({
          template: '<p>Loading...</p><ion-spinner></ion-spinner>'
        });
        $timeout(function() {
          $scope.beforeEnterPanduan();
        }, 500);
      }
    });
  }

})

.controller('TentangBFICtrl', function ($rootScope, $scope, $http, $state, $stateParams, $ionicPopup, $ionicHistory) {
  // cordova.firebase.analytics.setCurrentScreen("tentang_page");

})

.controller('ProfilCtrl', function ($rootScope, $scope, $http, $state,$window, $stateParams, $ionicPopup, $ionicHistory) {
  $scope.imageNameProfil = "assets/img/user.svg";
  $scope.profileName = localStorage.getItem('fullName');

  $scope.form = {};
  $scope.form.employeeID  = $window.localStorage.getItem("userEmployeeID");
  $scope.form.cabang      = $window.localStorage.getItem("userBranch");
  $scope.form.fullname    = $window.localStorage.getItem("fullName");
  $scope.form.handphone   = $window.localStorage.getItem("userEmployeePhone");
  $scope.form.email       = $window.localStorage.getItem("userEmail");
})

.controller('PromoCtrl', function(Common, Api, $rootScope, $scope, $http, $state, $timeout, $ionicPopup, $ionicSlideBoxDelegate, $window, $ionicLoading, Api, Common, Interaction) {
  // console.log("Tampilkan dari Backend");
  $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
  });

  var hasilResult;
  function promoList(){

    Common.timeout('get promo list','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      Api.promoList().then(function(result){
        if (result.rows.length > 0) {
          // console.log("Promo");
          // console.log(result.rows);
          $ionicLoading.hide();

          hasilResult     = result.rows;
          $scope.event    = {
              listpromo : hasilResult
          }
          $ionicSlideBoxDelegate.update();
          $scope.urlPromoDetail   = "app.promo-detail({idPromo: promolist.id})";
        }
        else {
          Interaction.alert("Perhatian","Terdapat masalah saat mengambil data ["+result.source+"]");
          // console.log("Belum ada handphone");
        }
        clearTimeout(timeoutvar);
        $ionicLoading.hide();
      })
      .error(function(err){
        clearTimeout(timeoutvar);
        $ionicLoading.hide();
        $scope.koneksiInternet = true;
        $scope.indikator_green  = "hidden";
        $scope.indikator_orange = "hidden";
        $scope.indikator_red    = "show";
      });

    });

  }
  promoList();

  $scope.tryAgainPromo = function(){
      $scope.koneksiInternet = false;
      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      });

      $timeout(function () {
        $ionicLoading.hide();
        //  promoList();

        $window.location.reload;
      }, 1000);
  }

})

.controller('PromoDetailCtrl', function($scope, $http,  $timeout, $state, $ionicPopup, $window, $ionicLoading, $ionicSlideBoxDelegate, $stateParams, $cordovaSocialSharing, Api, Common, Interaction) {

  //set product

  //detail promo by id
  var idPromo         = $stateParams.idPromo;
  var sharingMessage  = "";
  var sharingLink     = "";
  var sharingImage    = "";

  $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
  });

  function promoDetail(){
    Common.timeout('get promo detail','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      Api.promoDetail(idPromo).then(function(result){
        if (result.rows.length > 0) {
          var hasilSocial = [];

          var urlSharing  = "";
          // console.log(result.rows[0].name);
          if (result.rows[0].name == "Promo Pembayaran Angsuran BFI - Maret 2017"){
              urlSharing  = "https://www.bfi.co.id/products-services/promo/read/promo-pembayaran-angsuran-bfi-maret-2017";
          }else if (result.rows[0].name == "Daftar Merchant"){
              console.log("Daftar Merchant ini");
              urlSharing  = "https://www.bfi.co.id/products-services/promo/read/daftar-merchant";
          }else if (result.rows[0].name == "UBER Milyaran 2017"){
              urlSharing  = "https://www.bfi.co.id/products-services/promo/read/uber-milyaran-2017";
          }

          var sharingMessage  = result.rows[0].name;
          $scope.namePromo    = result.rows[0].name;
          $scope.datePromo    = result.rows[0].tanggalUpdate;
          $scope.descPromo    = result.rows[0].description;
          $scope.imagePromo   = result.rows[0].imageName;

          hasilSocial.push({
              sharingMessage  : sharingMessage,
              sharingLink     : urlSharing,
              sharingImage    : result.rows[0].imageName
          })

          $scope.social = {
              listSocial      : hasilSocial
          }

          $scope.event = {
              listPromo       : result.rows
          }

          clearTimeout(timeoutvar);
          $ionicLoading.hide();

        } else {
          Interaction.alert("Perhatian","Terdapat masalah saat mengambil data ["+result.source+"]");
          clearTimeout(timeoutvar);
          $ionicLoading.hide();
            // console.log("Belum ada handphone");
        }

      })
      .error(function(err){
        clearTimeout(timeoutvar);
        $ionicLoading.hide();
        $scope.koneksiInternet = true;
        $scope.indikator_green  = "hidden";
        $scope.indikator_orange = "hidden";
        $scope.indikator_red    = "show";
      });
    });

  }
  // $scope.koneksiInternet = true;
  promoDetail();

   $scope.tryAgainPromoDetail = function(){
      $scope.koneksiInternet = false;
      $ionicLoading.show({
          template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      });

      $timeout(function () {
          $ionicLoading.hide();
          promoDetail();
      }, 1000);
  }

  $scope.sharingFacebook = function(sharingMessage, sharingLink){
      console.log(sharingMessage);
      console.log(sharingLink);
      appAvailability.check(
          'com.facebook.katana',
          function() {          // Success callback
              $cordovaSocialSharing.shareViaFacebook(sharingMessage, "", sharingLink).then(function(result) {
                  console.log("sharing success");
                  // Success!
              }, function(err) {
                  console.log(err);
                  // An error occurred. Show a message to the user
              });
          },
          function() {           // Error callback
              $window.open('http://www.facebook.com/sharer.php?u=https://play.google.com/store/apps/details?id=com.bfifinance.bfiku', '_system');
          }
      );
  }

  $scope.sharingTwitter = function(sharingMessage, sharingImage, sharingLink){
      appAvailability.check(
          'com.twitter.android',
          function() {           // Success callback
              $cordovaSocialSharing.shareViaTwitter(sharingMessage, sharingImage, sharingLink).then(function(result) {
                  console.log("sharing success");
              }, function(err) {
                  console.log(err);
              });
          },
          function() {           // Error callback
              // $window.open("https://play.google.com/store/apps/details?id=com.twitter.android","_system");
              $window.open('https://twitter.com/share?url=https://play.google.com/store/apps/details?id=com.bfifinance.bfiku', '_system');
          }
      );
  }

})

.controller('MerchantCtrl', function ($rootScope, $scope, $http, $state, $q , $ionicPopup, $window, $cordovaGeolocation, $ionicLoading, $ionicScrollDelegate, Api, Common, Interaction) {
    window.$$$scope = $scope;
    if (window.cordova) {
      cordova.plugins.diagnostic.isGpsLocationEnabled(
        function (e) {
          if (e) {
            //alert("location on")
          }
          else {
            alert("GPS Anda belum diaktifkan. Silakan aktifkan GPS Anda");
            console.log("Location Not Turned ON");
            cordova.plugins.diagnostic.switchToLocationSettings();
          }
        },
        function (e) {
          alert('Error ' + e);
        }
      );
    };

    $scope.lokasi = {};
    var cities    = [];
    var latMe     = null;
    var longMe    = null;

    function MapsError() {
      var latLong;
      $http({
        method: 'GET',
        url: 'http://ipinfo.io'
      })
      .success(function (ipinfo) {
        latLong = ipinfo.loc.split(",");
        var latLng = new google.maps.LatLng(latLong[0], latLong[1]);

        var myLoc = {
          nameLocation: "My Location",
          latitude: latLong[0],
          longitude: latLong[1]
        }
        cities.push(myLoc);
        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        loadLokasiParent(latLong[0], latLong[1]);

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        loadMarkers(cities);
      });
    }

    function doLoadMarker() {
      var latLng = new google.maps.LatLng(2.747614, 114.113923);
      var mapOptionsNew = {
        center: latLng,
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptionsNew);

      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        console.log(position);
        var latLng    = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        latMe         = position.coords.latitude;
        longMe        = position.coords.longitude;
        loadLokasiParent(latMe, longMe);

        var myLoc = {
          nameLocation  : "My Location",
          latitude      : position.coords.latitude,
          longitude     : position.coords.longitude
        }
        cities.push(myLoc);
        var mapOptions = {
          center    : latLng,
          zoom      : 12,
          mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        $scope.map  = new google.maps.Map(document.getElementById('map'), mapOptions);
        loadMarkers(cities);

      }, function (error) {
        MapsError();
        $ionicLoading.hide();
      });
    }
    doLoadMarker();

    function loadLokasiParentDetail() {

      var listList = [];

      Common.timeout('get location merchant','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

        Api.merchantList().then(function(result){
          console.log("result ", result)
          if (result.rows.length > 0) {
            listList.push({
              id: '00000',
              kodeLokasi: '00000',
              nameLocation: 'Sekitar Saya'
            })
            for (var i = 0; i <= result.rows.length - 1; i++) {
              var idList = {
                id: result.rows[i].id,
                kodeLokasi: result.rows[i].kodeLokasi,
                nameLocation: result.rows[i].nameLocation,
              };
              listList.push(idList);
            }
            $scope.locationList         = listList;
            $scope.lokasi.nameLocation  = listList[0];
            $scope.urlLokasiDetail      = "app.merchant-detail({idLokasi: location.id})";
          } else {
            Interaction.alert("Perhatian","Terdapat masalah saat mengambil data ["+result.source+"]");
            MapsError();
          }
          clearTimeout(timeoutvar);
          $ionicLoading.hide();
        }, function(err){
          console.log(err);
          clearTimeout(timeoutvar);
        });
      });

    }
    loadLokasiParentDetail();

    function loadLokasiParent(latMe, longMe) {

      citiesVal = [];
      cityVal   = [];

      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      });

      // Common.timeout('get location merchant','Notice','Server Tidak Merespon tes [Timeout]',20000).then(function(timeoutvar){
        Api.merchantListLocation(latMe,longMe).then(function(result){
          if (result.rows.length > 0) {
            for (var i = 0; i <= result.rows.length - 1; i++) {
              var iconMap = null;
              if (result.rows[i].typeLocation == "Cabang") {
                iconMap = 'assets/img/new-lokasi-gedung.svg' //assets/img/new-pin-pointer.png
              } else if (result.rows[i].typeLocation == "Gerai") {
                iconMap = 'assets/img/new-lokasi-rumah.svg' //assets/img/new-pin-build.png
              }
              getDistance( latMe , longMe , result.rows[i].latitude , result.rows[i].longitude, result.rows[i] ).then(function (distance){
                results = distance.results;
                var cityValList = {
                  id              : results.id,
                  typeLocation    : results.typeLocation,
                  addressLocation : results.addressLocation,
                  nameLocation    : results.nameLocation,
                  latitude        : results.latitude,
                  longitude       : results.longitude,
                  distance        : distance.data,
                  status          : results.status,
                  iconMap         : iconMap
                }
                var citiesValList = {
                  id              : results.id,
                  typeLocation    : results.typeLocation,
                  addressLocation : results.addressLocation,
                  nameLocation    : results.nameLocation,
                  latitude        : results.latitude,
                  longitude       : results.longitude,
                  distance        : distance.data,
                  status          : results.status,
                  iconMap         : iconMap
                }
                cityVal.push(cityValList);
                cities.push(citiesValList);

              });
            }
            loadMarkers(cities);
            $scope.event = {
              locationList: cityVal
            };
            $scope.urlLokasiDetail = "app.merchant-detail({idLokasi: location.id})";
            $ionicLoading.hide();

          } else {
            $scope.event = {
              locationList: {}
            };
            $rootScope.showAlert({
              title   : "Informasi",
              message : "Tidak ada Merchant di Lokasi ini"
            });
            $ionicLoading.hide();
          }

        }, function (err) {
          console.warn(err);
          $ionicLoading.hide();
          if ($window.cordova) {
            Interaction.alert('Oops','Terjadi kesalahan koneksi');
          }
        });
      // });

    }

    $scope.doLoadLocation = function (idLocation) {
      console.log(idLocation);
      cities    = [];
      citiesVal = [];

      // doLoadMarker
      var idLocation = idLocation.id;
      if (idLocation == "00000") {
        doLoadMarker();
      } else {
        $ionicLoading.show({
          template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
        });

        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
          console.log(position);
          var latLng  = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          latMe       = position.coords.latitude;
          longMe      = position.coords.longitude;

          $http({
            method    : 'GET',
            url       : kvlUrl + 'MobileSRSAction?action=list-merchant-location&merchant='+idLocation,
            headers : localStorageTokenBearer()
          })
          .success(function (result) {
            console.log(result);
            if (result.rows.length > 0) {

              for (var i = 0; i <= result.rows.length - 1; i++) {

                var iconMap = null;
                if (result.rows[i].typeLocation == "Cabang") {
                  iconMap = 'assets/img/new-lokasi-gedung.svg' //assets/img/new-pin-pointer.png
                } else if (result.rows[i].typeLocation == "Gerai") {
                  iconMap = 'assets/img/new-lokasi-rumah.svg' //assets/img/new-pin-build.png
                }

                getDistance( latMe , longMe , result.rows[i].latitude , result.rows[i].longitude, result.rows[i] ).then(function (distance){
                  results   = distance.results;
                  var citiesValList = {
                    id              : results.id,
                    typeLocation    : results.typeLocation,
                    addressLocation : results.addressLocation,
                    nameLocation    : results.nameLocation,
                    latitude        : results.latitude,
                    longitude       : results.longitude,
                    distance        : distance.data,
                    status          : results.status,
                    iconMap         : iconMap
                  }
                  var citiesList = {
                    id              : results.id,
                    typeLocation    : results.typeLocation,
                    addressLocation : results.addressLocation,
                    nameLocation    : results.nameLocation,
                    latitude        : results.latitude,
                    longitude       : results.longitude,
                    distance        : distance.data,
                    status          : results.status,
                    iconMap         : iconMap
                  }
                  citiesVal.push(citiesValList);
                  cities.push(citiesList);
                });
                var latLngMarker = new google.maps.LatLng(result.rows[0].latitude, result.rows[0].longitude);
                var mapOptions = {
                  center    : latLngMarker,
                  zoom      : 15,
                  mapTypeId : google.maps.MapTypeId.ROADMAP
                };
                $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
              }

              loadMarkers(cities);
              $scope.event = {
                locationList: citiesVal
              }

              $scope.urlLokasiDetail = "app.merchant-detail({idLokasi: location.id})";
              $ionicLoading.hide();

            } else {
              $scope.event = {
                locationList: {}
              };
              $rootScope.showAlert({
                title   : "Informasi",
                message : "Tidak ada Merchant di Lokasi ini"
              });
              // console.log("Belum ada lokasi");
              $ionicLoading.hide();
            }
          }).error(function (err) {
            $ionicLoading.hide();
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
          });
        }, function (error) {
          console.log("error : ");
          console.log(error);
          MapsError();
          $ionicLoading.hide();
        });
      }
    }

    function getDistance(latme,longme,latdest,longdes,results){
        var q = $q.defer();
        $http({
          method    : 'GET',
          url       : 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+latme+','+longme+'&destinations='+latdest+','+longdes+'&key=AIzaSyBcmwBNb2-lnYUWarVOcPqt8-9KCqHLbho'
        })
        .success(function (res) {
          var distanceVlues = {};
          distanceVlues.data = res.rows[0].elements[0].distance.text;
          distanceVlues.results = results;
          console.log(distanceVlues);
          q.resolve(distanceVlues);
        });
        return q.promise;
    }

    $scope.doLocationDetail = function (idLokasi,lati,longi,nameLocation,addressLocation) {
      localStorage.setItem("idDistanceLocation", idLokasi);
      $state.go('app.merchant-detail', { 'lat' : lati , 'long' : longi , 'name' : nameLocation , 'address' : addressLocation});
    }
    var options = {
      timeout: 50000,
      enableHighAccuracy: true
    };

    function bindInfoWindow(marker, map, infowindow, html) {
      marker.addListener('click', function () {
        infowindow.setContent(html);
        infowindow.open(map, this);
      });
    }

    function loadMarkers(citiesLength) {
      for (i = 0; i <= citiesLength.length - 1; i++) {
        var nameLocation    = citiesLength[i].nameLocation;
        var addressLocation = citiesLength[i].addressLocation;
        var statusLocation  = citiesLength[i].status;
        var statusCabang    = citiesLength[i].typeLocation;

        var iconMap = null;
        if (statusLocation == "undefined" || statusLocation == null || statusLocation == undefined) {
          iconMap = 'assets/img/marker_position.png'
        } else {
          if (statusCabang == "Cabang") {
            iconMap = 'assets/img/new-pin-pointer.png'
          } else if (statusCabang == "Gerai") {
            iconMap = 'assets/img/new-pin-build.png'
          }
        }

        var marker = new google.maps.Marker({
          map     : $scope.map,
          position: new google.maps.LatLng(citiesLength[i].latitude, citiesLength[i].longitude),
          title   : citiesLength[i].nameLocation,
          icon    : iconMap
        });

        var infowindow = new google.maps.InfoWindow({
          maxWidth: 500
        });
        bindInfoWindow(marker, map, infowindow, nameLocation);

        $scope.doDetailLocation = function (detailLatitude, detailLongitude) {
          $ionicScrollDelegate.scrollTop();
          var options   = { timeout: 20000, enableHighAccuracy: true };
          $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            var latLng  = new google.maps.LatLng(detailLatitude, detailLongitude);
            var mapOptions = {
              center    : latLng,
              zoom      : 15,
              mapTypeId : google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            google.maps.event.addListenerOnce($scope.map, 'idle', function () {
              loadMarkers(cities);
            });
          }, function (error) {
            console.log("Could not get location");
          });
        };
      }
    }
})

.controller('MerchantDetailCtrl', function ($stateParams, $scope, $http, $state, $ionicPopup, $window, $cordovaGeolocation, $ionicLoading, $ionicScrollDelegate) {
    $scope.lati    = $stateParams.lat;
    $scope.longi   = $stateParams.long;
    $scope.name    = $stateParams.name;
    $scope.address = $stateParams.address;

    console.log("latitude : "+$scope.lati+" longitude : "+$scope.longi);
    var idLokasiDistance  = $window.localStorage.getItem("idDistanceLocation");
    var idDetail          = idLokasiDistance.split(",")[0];
    var distanceDetail    = idLokasiDistance.split(",")[1];

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      var idLokasiDistance  = $window.localStorage.getItem("idDistanceLocation");
      var idDetail          = idLokasiDistance.split(",")[0];
      var distanceDetail    = idLokasiDistance.split(",")[1];
      $scope.distanceDetail = distanceDetail;
    })

    $scope.distanceDetail = distanceDetail;
    $scope.lokasi = {};
    var cities    = [];
    var latMe     = null;
    var map       = null;
    var longMe    = null;

    $scope.iconMapDetail  = 'assets/img/new-lokasi-gedung.png' ;

    $scope.doShowMapDirection = function (detailLatitude, detailLongitude) {
      // action here
    };

    $scope.openToMap = function (lats,longs) {
      console.log(lats,longs)
      // console.log("HELLOOO");
      window.open('http://maps.google.com/maps?q=' + lats + ',' + longs, '_system');
      // var geocoords = lats + ',' + longs;
      // console.log(geocoords);
      // window.open('geo:0,0?q=' + geocoords , '_system');
    }

    function MapsError() {
      var latLong;
      $http({
        method: 'GET',
        url: 'http://ipinfo.io'
      })
      .success(function (ipinfo) {
        latLong     = ipinfo.loc.split(",");
        var latLng  = new google.maps.LatLng(latLong[0], latLong[1]);
        var myLoc   = {
          nameLocation  : "My Location",
          latitude      : latLong[0],
          longitude     : latLong[1]
        }
        cities.push(myLoc);
        var mapOptions = {
          center    : latLng,
          zoom      : 15,
          mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        $scope.mapDetail = new google.maps.Map(document.getElementById('mapDetail'), mapOptions);
      });
    }

    doLoadMarker();
    function doLoadMarker() {
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var latLng  = new google.maps.LatLng($scope.lati, $scope.longi);
        latMe       = position.coords.latitude;
        longMe      = position.coords.longitude;

        var myLoc = {
          nameLocation: "My Location",
          latitude    : position.coords.latitude,
          longitude   : position.coords.longitude
        }
        cities.push(myLoc);
        var mapOptions = {
          center    : latLng,
          zoom      : 15,
          mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        $scope.mapDetail = new google.maps.Map(document.getElementById('mapDetail'), mapOptions);

        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: $scope.name
        });
        marker.setMap($scope.mapDetail);

        locationDirectionMap();
      }, function (error) {
        MapsError();
        $ionicLoading.hide();
      });
    }

    var options = {
      timeout           : 50000,
      enableHighAccuracy: true
    };
    function bindInfoWindow(marker, map, infowindow, html) {
      marker.addListener('click', function () {
        infowindow.setContent(html);
        infowindow.open(map, this);
      });
    }

    function locationDirectionMap() {
      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      });
      $http({
        method  : 'GET',
        url     : kvlUrlFinance + 'FrontLokasiAction?action=form-detail-location&idLokasi=' + idDetail,
        headers : localStorageTokenBearer()
      })
      .success(function (result) {
        console.log("result detail lokasi;;;;")
        console.log(result);
        if (result.rows.length > 0) {
          $scope.nameLocation     = result.rows[0].nameLocation;
          $scope.typeLocation     = result.rows[0].typeLocation;
          $scope.addressLocation  = result.rows[0].addressLocation;
          var iconMap             = null;
          // if (result.rows[0].typeLocation == "Cabang") {
          //   iconMap = 'assets/img/new-lokasi-gedung.png'
          // } else if (result.rows[0].typeLocation == "Gerai") {
          //   iconMap = 'assets/img/new-lokasi-rumah.png'
          // }

          if (result.rows[i].typeLocation == "Cabang") {
            iconMap = 'assets/img/new-lokasi-gedung.svg' //assets/img/new-pin-pointer.png
          } else if (result.rows[i].typeLocation == "Gerai") {
            iconMap = 'assets/img/new-lokasi-rumah.svg' //assets/img/new-pin-build.png
          }

          // $scope.iconMapDetail  = iconMap;
          var telphoneSplit     = result.rows[0].telp
          // $scope.iconMapDetail  = iconMap;
          var nohp              = result.rows[0].telp.split(', ')[0];
          var nohpFinal         = "";

          var isNoHp = nohp.search("/");
          if (isNoHp > 0) {
            $scope.telpLocation = nohp.split('/')[0];
            console.log("in no hp");
          } else {
            $scope.telpLocation = nohp;
            console.log("out no hp");
          }

          var status            = 'OK';
          var latLng            = new google.maps.LatLng(latMe, longMe);
          var latLngTujuan      = new google.maps.LatLng(result.rows[0].latitude, result.rows[0].longitude);
          var directionsService = new google.maps.DirectionsService;
          var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
          var geocoder          = new google.maps.Geocoder();
          var addressMyLocation = '';
          var addressToLocation = '';
          var iconEnd           = null;

          var iconEnd = null;
          if (result.rows[0].typeLocation == "Cabang") {
            iconEnd = "assets/img/new-pin-pointer.png";
          } else {
            iconEnd = "assets/img/new-pin-build.png";
          }
          var icons = {
            start: new google.maps.MarkerImage('assets/img/marker_position.png'),
            end: new google.maps.MarkerImage(iconEnd)
          };

          // START ADDRESS
          geocoder.geocode({
            'latLng': latLng
          }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              $scope.$apply(function () {
                addressMyLocation = results[0].formatted_address;
              });
            }
          });

          // END ADDRESS
          geocoder.geocode({
            'latLng': latLngTujuan
          }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              $scope.$apply(function () {
                addressToLocation = results[0].formatted_address;
              });
            }
          });
          // END GEO CODER
          directionsDisplay.setMap($scope.mapDetail);
          directionsService.route({
            origin      : latLng,
            destination : latLngTujuan,
            travelMode  : 'DRIVING'
          },
          function (response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
              var leg   = response.routes[0].legs[0];

              makeMarker(leg.start_location, icons.start, addressMyLocation);
              makeMarker(leg.end_location, icons.end, addressToLocation);
            } else {
              $scope.showLog(response);
            }
          });

          function makeMarker(position, icon, title) {
            var marker = new google.maps.Marker({
              map       : $scope.mapDetail,
              position  : position,
              title     : title,
              icon      : icon
            });

            var infowindow = new google.maps.InfoWindow({
              maxWidth: 500
            });
            bindInfoWindow(marker, map, infowindow, title);
          }
          $ionicLoading.hide();
        } else {
          $ionicLoading.hide();
        }
      });
    };
})

.controller('RewardCtrl', function ($rootScope, $scope, $http, $state, $ionicPopup, $window, $ionicHistory, $ionicLoading, Api , Common) {

  var dataReward = $scope.form = {};
  var ServLinkCore = kvlUrlFinance + "MobileCoreAction";
  var userId = $window.localStorage.getItem("userId");

  function getDetailKupon() { //FROM BACKEND

    Common.timeout('get detail coupon','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){
      Api.redeem().then(function(result){
        if (result.rows.length > 0) {

          $scope.periodeKe          = result.rows[0].periodeKe;
          $scope.periodeBerlaku     = result.rows[0].periodeBerlaku;
          $scope.pemenangPeriode    = result.rows[0].pemenangPeriode;
          $scope.periodeSelanjutnya = result.rows[0].periodeSelanjutnya;

        } else {
          $ionicLoading.hide();
        }
        clearTimeout(timeoutvar);
        $ionicLoading.hide();
      });
    });

  }

  //GET FROM CORE
  // $scope.form.UserName       = "Ekreasi";
  // $scope.form.Password       = "EKreasiCustomer08032017";
  $scope.form.userId = userId; //2016124040013648
  $scope.form.action = "GetUberCoupon";

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
  });

  var hasilResult;
  $http({
    method      : 'POST',
    url         : ServLinkCore,
    contentType : 'application/json',
    data        : JSON.stringify(dataReward),
    headers : localStorageTokenBearer()
  })
  .success(function (result) {
    getDetailKupon();

    if (result.total > 0) {
      hasilResult   = result.rows;
      $scope.event  = {
        listKontrakKupon: hasilResult
      }

      var allKupon  = 0;
      for (var i = 0; i <= result.total - 1; i++) {
        allKupon += result.rows[i].TotalKupon;
      }
      $scope.totalKuponAll = allKupon;
      $ionicLoading.hide();

    } else {
      $ionicLoading.hide();
      $scope.totalKuponAll = "0";
    }
  });
})

.controller('KontrakCtrl', function ($rootScope, $scope, $http, $state, $ionicPopup, $window, $ionicHistory, $ionicLoading, $filter, Common) {

  var dataKontrak     = $scope.form = {};
  var ServLinkCore    = kvlUrl + "MobileCoreAction";
  var userId          = $window.localStorage.getItem("userId");

  $scope.kontrakHide  = "hidden";
  // $scope.form.UserName       = "Ekreasi";
  // $scope.form.Password       = "EKreasiCustomer08032017";
  $scope.form.userId  = userId; //2016124040013648
  $scope.form.action      = "GetContract";

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
  });


  Common.timeout('get contract','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

    $http({
      method      : 'POST',
      url         : ServLinkCore,
      contentType : 'application/json',
      data        : JSON.stringify(dataKontrak),
      headers : localStorageTokenBearer()
    })
    .success(function (result) {
      var kontrakLow = [];
      if (result.rows.length > 0) {
        kontrakLow.push({
          AgreementNo: "-- Pilih No. Kontrak",
          LicensePlate: "No. Polisi --"
        });
        for (var i = 0; i <= result.rows.length - 1; i++) {
          var listKontrak = {
            AgreementNo   : result.rows[i].AgreementNo,
            LicensePlate  : result.rows[i].LicensePlate
          }
          kontrakLow.push(listKontrak);
        }
        $scope.listKontrakCust  = kontrakLow;
        $scope.form.AgreementNo = kontrakLow[0];
      } else {
        kontrakLow.push({
          AgreementNo   : "-- Pilih No. Kontrak",
          LicensePlate  : "No. Polisi --"
        });
        $scope.listKontrakCust  = kontrakLow;
        $scope.form.AgreementNo = kontrakLow[0];
      }

      clearTimeout(timeoutvar);
      $ionicLoading.hide();
    });

  });



  $scope.doLoadAgreement = function (NoKontrak) {
    var AgreementNo     = NoKontrak.AgreementNo;

    if (AgreementNo != "-- Pilih No. Kontrak") {
      var detailKontrak         = $scope.detail = {};
      $scope.detail.action      = "GetDetailContract";
      $scope.detail.AgreementNo = AgreementNo;

      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      });


      Common.timeout('get contract','Notice','Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

        $http({
          method      : 'POST',
          url         : ServLinkCore,
          contentType : 'application/json',
          data        : JSON.stringify(detailKontrak),
          headers : localStorageTokenBearer()
        })
        .success(function (result) {
          if (result.rows.length > 0) {
            $scope.detail_jatuhtempo        = result.rows[0].TanggalJatuhTempo;
            $scope.detail_angsuranPerbulan  = accounting.formatMoney(result.rows[0].AngsuranPerBulan, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
            $scope.detail_jumlahTagihan     = accounting.formatMoney(result.rows[0].JumlahTagihan, { precision: 0, thousand: '.', symbol: '', format: '%v %s' });
            $scope.detail_vanNumber         = result.rows[0].VanNumber;
            $scope.detail_LicensePlate      = result.rows[0].LicensePlate;
            $scope.detail_AgreementNo       = AgreementNo;
            $scope.detail_jumlahSisaAngsuran= result.rows[0].JumlahSisaAngsuran;

            $scope.kontrakHide = "show";
          } else {
            $scope.kontrakHide = "hidden";
          }

          clearTimeout(timeoutvar);
          $ionicLoading.hide();
        });

      });

    } else {

    }
  }
})

.controller('SRSCtrl', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicHistory) {
  $scope.startSRS = function () {
    $state.go("app.srs-1");
  }
})

.controller('SRSStep1Ctrl', function ($PopupUnauthorized, $scope, $http, $state, $stateParams, $ionicPopup, $ionicHistory) {
  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    console.log("SRSStep1Ctrl")
    $PopupUnauthorized.getTokenApiGee();
  });

  $scope.startSRS = function (type) {
    localStorage.setItem("tempSRS", "");
    $state.go("app.srs-2", {type: type});
  }
})

.controller('SRSStep2Ctrl', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicLoading, $ionicHistory, $timeout, Api, Common) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.type = $stateParams.type;
    localStorage.setItem("SRSType", $scope.type);

    $scope.getContract = false;

    $scope.loadingCategory    = false;
    $scope.formData 					= {};
    $scope.formData.Status 		= "-- Pilih Salah Satu --";
    $scope.formData.Tujuan 		= "-- Pilih Salah Satu --";
    $scope.formData.Kategori 	= "";
    $scope.formData.type 			= $scope.type;

    $scope.disabledSelect 		= true;
    // $scope.updateDataTujuan();

    var tempSRS = localStorage.getItem("tempSRS");
    if( tempSRS != '' ){
      $scope.formData 				= JSON.parse(tempSRS);
      $scope.disabledSelect 	= false;
    }

		$scope.doLoadHandphone = function (handphones) {
			var handphone  = String(handphones);
			var ihandphone = handphone.substring(0, 2);
			var bhandphone = handphone.substring(2, 13);
			if (ihandphone != "62") {
				var newNumber = "62" + handphone;
				$scope.formData.MobileNo = parseInt(newNumber);
			} else {
				var newNumber = handphones;
				$scope.formData.MobileNo = parseInt(newNumber);
			}
		}

    // Api.getTujuan().then(function(res){
    //   $scope.dataTujuan = res.rows;
    //   console.log(res.rows);
    //     // $scope.updateDataTujuan();
    //     // $scope.updateDataKategori();
    // });

    $scope.dataStatus   = ["-- Pilih Salah Satu --","-", "New", "LIV", "EXP"];
    $scope.dataKategori = [];
    $scope.dataTujuan   = [];

    if($scope.type == "noncustomer"){
      $scope.formData.Status = "New";
      $scope.loadingTujuan    = true;

      Common.timeout('get tujuan','Notice','Mengambil data tujuan :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){
        Api.getTujuan().then(function(res){
          console.log(res.rows);
          $scope.dataTujuan     = res.rows;
          $scope.loadingTujuan  = false;

          clearTimeout(timeoutvar);
        }, function(err){
          clearTimeout(timeoutvar);
        });
      });

    }

    $scope.updateDataTujuan = function(){
      $scope.loadingTujuan    = true;
      Api.getTujuan().then(function(res){
        console.log(res.rows);
        $scope.dataTujuan = res.rows;
        $scope.loadingTujuan = false;
      });

      Common.timeout('get tujuan','Notice','Mengambil data tujuan :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){
        Api.getTujuan().then(function(res){
          console.log(res.rows);
          $scope.dataTujuan = res.rows;
          $scope.loadingTujuan = false;

          clearTimeout(timeoutvar);
        }, function(err){
          clearTimeout(timeoutvar);
        });
      });

    }
    $scope.getContractLink = function(){
      console.log("ng change");
      $scope.getContract = true;
      if($scope.formData.AgreementNo == null || $scope.formData.AgreementNo == undefined || $scope.formData.AgreementNo == ""){
        $scope.getContract = false;
      }else{
        $scope.getContract = true;
      }
    }
    $scope.updateKontrak = function(){

      $scope.getContract = false;
      $ionicLoading.show({
          template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      });

      Common.timeout('get tujuan','Notice','Mengambil data tujuan :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

        Api.getAgreementData($scope.formData.AgreementNo).then(function(res){
          // var dataTemp = res.data[0];
          // $scope.formData = dataTemp;
          $scope.formData.Status    = "-- Pilih Salah Satu --";
          $scope.formData.Tujuan    = "-- Pilih Salah Satu --";
          $scope.formData.Kategori  = "-- Pilih Salah Satu --";
          $scope.disabledSelect     = false;

          console.log(res);
          if(res.status == "1"){
            $scope.formData.CustomerName  = res.rows[0].customerName;
            $scope.formData.MobileNo      = res.rows[0].mobileNo;
            $scope.formData.Email         = res.rows[0].email;
            $scope.formData.Status        = res.rows[0].status;

            localStorage.setItem("CustomerID"   , res.rows[0].CustomerID );
            localStorage.setItem("BranchID"     , res.rows[0].BranchID );
            localStorage.setItem("LoginID"      , res.rows[0].customerName );

          }else{
            $ionicLoading.hide();
            $scope.showAlert({
              title: "Information",
              message: "Mohon maaf, Kontrak tidak ditemukan"
            });
          }
          $scope.updateDataTujuan();

          clearTimeout(timeoutvar);
          $ionicLoading.hide();
        },
        function(err){
          clearTimeout(timeoutvar);
          $ionicLoading.hide();
          console.log(err);
          $scope.showAlert({
              title: "Information",
              message: "Mohon maaf, Terjadi kesalahan saat mengambil data"
            });
        });

      });

    }

    $scope.updateDataKategori = function(id){
      console.log($scope.formData.Tujuan);

      $scope.loadingCategory      = true;
      $scope.dataPenjelasan       = [];
      $scope.formData.Penjelasan  = "";

      Common.timeout('get kategori','Notice','Mengambil data kategori :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){
        Api.getKategori($scope.formData.Tujuan.ID).then(function(res){
          console.log($scope.formData.Tujuan.ID);
          console.log(res.rows);
          $scope.dataKategori         = res.rows;
          $scope.loadingCategory      = false;

          clearTimeout(timeoutvar);
        }, function(err){
          clearTimeout(timeoutvar);
        });
        //add by yacobus
        $timeout( function(){
          if ($scope.formData.Kategori=='-- Pilih Salah Satu --'){
            // alert ('Mohon untuk memilih kategori');
          }
        }, 50000 );
      });



      //
    }

    $scope.updateDataPenjelasan = function(id){
      console.log("Tujuan   :: "+$scope.formData.Tujuan.ID);
      console.log("Kategori :: "+$scope.formData.Kategori.ID);
      $scope.loadingPenjelasan    = true;


      Common.timeout('get penjelasan','Notice','Mengambil data penjelasan :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

        Api.getPenjelasan($scope.formData.Tujuan.ID,$scope.formData.Kategori.ID).then(function(res){
          $scope.dataPenjelasan = res.rows;
          $scope.loadingPenjelasan = false;

          clearTimeout(timeoutvar);
        }, function(err){
          clearTimeout(timeoutvar);
        });
      });
    }

    $scope.startSRS = function () {
      console.log("LANJUT");
      console.log($scope.formData.Tujuan);

      if($scope.type == 'customer'){
        if(!$scope.formData.AgreementNo){
          $scope.showAlert({
            title: "Saran",
            message: "<center>Untuk mendapatkan field Selanjutnya, masukkan terlebih dahulu nomor kontrak</center>"
          });
        }
      }

      if (!$scope.formData.CustomerName) {
          console.log("CustomerName");
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, Nama Anda masih kosong"
          });
      } else if (!$scope.formData.MobileNo) {
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, No.Handphone Anda masih kosong"
          });
      }
      // else if (!$scope.formData.Email) {
      //     $scope.showAlert({
      //       title: "Information",
      //       message: "Mohon maaf, Email Anda masih kosong atau format email salah"
      //     });
      // }
      else if (!$scope.formData.Tujuan || $scope.formData.Tujuan == '-- Pilih Salah Satu --') {
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, Tujuan Anda masih kosong"
          });
      } else if (!$scope.formData.Kategori || $scope.formData.Kategori == '-- Pilih Salah Satu --') {
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, Kategori Anda masih kosong"
          });
      } else if (!$scope.formData.Penjelasan) {
        $scope.showAlert({
          title: "Information",
          message: "Mohon maaf, Penjelasan Anda masih kosong"
        });
      }
      else {

        if($scope.type == "noncustomer"){
        //  $scope.formData.Status = {
        //    "Text"  : "-",
        //    "ID"    : "-"
        //  };
        //  $scope.formData.Tujuan = {
        //    "Text"  : "-",
        //    "ID"    : "-"
        //  };
        //  $scope.formData.Kategori = {
        //    "Text"  : "-",
        //    "ID"    : "-"
        //  };
        //  $scope.formData.Penjelasan = {
        //    "Text"  : "-",
        //    "ID"    : "-"
        //  };
          if (!$scope.formData.Unit) {
              $scope.showAlert({
                title: "Information",
                message: "Mohon maaf, Unit masih kosong"
              });
          } else if (!$scope.formData.Alamat) {
              $scope.showAlert({
                title: "Information",
                message: "Mohon maaf, Alamat Anda masih kosong"
              });
          } else {
              localStorage.setItem("tempSRS", JSON.stringify($scope.formData));
              $state.go("app.srs-3");
          }
        }else{
          if (!$scope.formData.AgreementNo) {
              $scope.showAlert({
                title: "Information",
                message: "Mohon maaf, Nomor kontrak Anda masih kosong"
              });
          } else if (!$scope.formData.Status || $scope.formData.Status == '-- Pilih Salah Satu --') {
              $scope.showAlert({
                title: "Information",
                message: "Mohon maaf, Status Anda masih kosong"
              });
          } else {
              $scope.formData.ExplanationID = $scope.formData.Penjelasan;
              localStorage.setItem("tempSRS", JSON.stringify($scope.formData));
              $state.go("app.srs-3");
          }
        }

      }
    }

  })
})

.controller('SRSStep3Ctrl', function ($scope, $http, $state, $stateParams, $window, $ionicPopup, $ionicHistory) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.defaultImage();

    var tempSRS = localStorage.getItem("tempSRS");
    if( tempSRS != '' ){
      $scope.formData = JSON.parse(tempSRS);

      $scope.activeRating( $scope.formData.rating );
    } else {
      $state.go('app.srs-1');
    }
  });
  $scope.activeRating = function(rating){
    $scope.defaultImage();
    switch(rating){
      case 'puas':
        $scope.formData.rating = "1";
        $scope.image.puas = 'assets/img/srs/icon-1-active.png';
        break;
      case 'biasa':
        $scope.formData.rating = "2";
        $scope.image.biasa = 'assets/img/srs/icon-2-active.png';
        break;
      case 'tidak':
        $scope.formData.rating = "3";
        $scope.image.tidak = 'assets/img/srs/icon-3-active.png';
        break;
    }
    // $scope.formData.rating = rating;
  }

  $scope.defaultImage = function(){
    $scope.image = {
      puas: 'assets/img/srs/icon-1.png',
      biasa: 'assets/img/srs/icon-2.png',
      tidak: 'assets/img/srs/icon-3.png',
    }
  }

  $scope.startSRS = function () {
    if($scope.formData.rating == null || $scope.formData.rating == undefined || $scope.formData.rating == ""){
      $scope.showAlert({
        title: "Information",
        message: "Mohon maaf, Anda belum memilih apapun"
      });
    }else{
      localStorage.setItem("tempSRS", JSON.stringify($scope.formData));
      $state.go("app.srs-4");
    }
  }
})

.controller('SRSStep4Ctrl', function ($PopupUnauthorizedJwt, $scope, $http, $state, $stateParams, $ionicPopup, $ionicHistory, $ionicPlatform, $ionicLoading, Api, Common) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.hideField = true;
    var tempSRS = localStorage.getItem("tempSRS");
    if( tempSRS != '' ){
      $scope.formData = JSON.parse(tempSRS);
      if( $scope.formData.recommendPhone != '' ) {
        $scope.formData.recommendPhone = [];
      }else{
        $scope.formData.recommendPhone = [];
			}
    } else {
      $state.go('app.srs-1');
    }
    $scope.referenceValue = "";
  });

  $scope.recommnedChange = function(value){
    console.log(value);
    if(value == 1 || value == "1"){
      $scope.hideField = false;
    }else{
      $scope.hideField = true;
    }
  }

  $scope.startSRS = function () {

    if($scope.formData.isRecommend == null || $scope.formData.isRecommend == undefined || $scope.formData.isRecommend == ""){
      $scope.showAlert({
        title: "Information",
        message: "Mohon maaf, Anda belum memilih apakah anda merekomendasi bfi pada teman anda"
      });
    }else{
      if($scope.formData.isRecommend == "1"){
        if($scope.formData.recommendName == null || $scope.formData.recommendName == undefined || $scope.formData.recommendName == ""){
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, Anda belum mengisi nama teman rekomendasi"
          });
        }else if($scope.formData.recommendPhone == null || $scope.formData.recommendPhone == undefined || $scope.formData.recommendPhone == ""){
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, Anda belum mengisi nomor handphone teman rekomendasi"
          });
        }else{
          if($scope.formData.Notes == null || $scope.formData.Notes == undefined || $scope.formData.Notes == ""){
            $scope.showAlert({
              title: "Information",
              message: "Mohon maaf, Anda belum mengisi catatan yang perlu kami tingkatkan atau perbaiki"
            });
          }else{
            localStorage.setItem("tempSRS", JSON.stringify($scope.formData));
            uploadDataSRS();
          }
        }
      }else{
        $scope.formData.recommendName    = "";
        $scope.formData.recommendPhone   = "";
        if($scope.formData.Notes == null || $scope.formData.Notes == undefined || $scope.formData.Notes == ""){
          $scope.showAlert({
            title: "Information",
            message: "Mohon maaf, Anda belum mengisi catatan yang perlu kami tingkatkan atau perbaiki"
          });
        }else{
          localStorage.setItem("tempSRS", JSON.stringify($scope.formData));
          uploadDataSRS();
        }
      }

    }
  }

  function uploadDataSRS(){

      $ionicLoading.show({
        template: '<p>Mengirim Data Anda...</p><ion-spinner icon="android"></ion-spinner>'
      });

      console.log("submitSRS");
      var srsDataSubmit  = JSON.parse(localStorage.getItem("tempSRS"));
      var dataPhone = "";
      if( srsDataSubmit.recommendPhone.length > 0 ) {
        for( var i in srsDataSubmit.recommendPhone ) {
          // dataPhone = srsDataSubmit.recommendPhone[i] + ',';
          console.log("ÄAA : "+srsDataSubmit.recommendPhone[i]);
        }
        dataPhone = (srsDataSubmit.recommendPhone).join(" | ");
        console.log("dataPhone : "+dataPhone);
        // dataPhone = dataPhone.slice(0, -1) + ' | ';
      }

      submitAnswer  = [
        {
          "PurposeID"     : srsDataSubmit.Tujuan.ID,
          "CategoryID"    : srsDataSubmit.Kategori.ID,
          "ExplanationID" : srsDataSubmit.Penjelasan.ID,
          "Notes"         : srsDataSubmit.Notes,
        }
      ]
      console.log(submitAnswer);
      // isRecommend = 1 => YA
      // isRecommend = 2 => TIDAK
      var srsType = localStorage.getItem("SRSType");
      console.log(srsType);

      if(srsDataSubmit.Email == null || srsDataSubmit.Email == undefined){
        srsDataSubmit.Email = "-";
        console.log("[null] srsDataSubmit.Email ::: "+srsDataSubmit.Email);
      }else{
        console.log("srsDataSubmit.Email ::: "+srsDataSubmit.Email);
      }
      var usernameLogin  = localStorage.getItem("userEmployeeID");
      if(srsType == "noncustomer"){
        if(srsDataSubmit.isRecommend == 2 || srsDataSubmit.isRecommend == undefined || srsDataSubmit.isRecommend == "2"){
          submitdata = {
            // "action"      : "do-submit-srs-answer",
            "APIID"         : "Ekreasi",
            "APIPassword"   : "EKreasiSRS2018",
            "APIName"       : "SRS",
            "LoginID"       : usernameLogin,
            "BranchID"      : "-",
            "CustomerID"    : "-",
            "USRUPD"        : usernameLogin,
            "rating"        : srsDataSubmit.rating,
            "isRecommend"   : srsDataSubmit.isRecommend,
            "recommendName" : "-",
            "recommendPhone": "-",
            "source"        : "SRS",
            "Nama"			    : srsDataSubmit.CustomerName,
            "HP"			      : (srsDataSubmit.MobileNo).toString(),
            "Email"			    : srsDataSubmit.Email,
            "Unit"			    : srsDataSubmit.Unit,
            "Alamat"		    : srsDataSubmit.Alamat,
            "data"          : submitAnswer
          }
        } else {
          submitdata = {
            "APIID"         : "Ekreasi",
            "APIPassword"   : "EKreasiSRS2018",
            "APIName"       : "SRS",
            "LoginID"       : usernameLogin,
            "BranchID"      : "-",
            "CustomerID"    : "-",
            "USRUPD"        : usernameLogin,
            "rating"        : srsDataSubmit.rating,
            "isRecommend"   : srsDataSubmit.isRecommend,
            "recommendName" : srsDataSubmit.recommendName,
            "recommendPhone": dataPhone,
            "source"        : "SRS",
						"Nama"					: srsDataSubmit.CustomerName,
						"HP"						: (srsDataSubmit.MobileNo).toString(),
						"Email"					: srsDataSubmit.Email,
						"Unit"					: srsDataSubmit.Unit,
						"Alamat"				: srsDataSubmit.Alamat,
            "data"          : submitAnswer
          }
        }
        submitSRS(submitdata);
      }
      else if(srsType == "customer"){
        if(srsDataSubmit.isRecommend == 2 || srsDataSubmit.isRecommend == undefined || srsDataSubmit.isRecommend == "2"){
          submitdata = {
            // "action"      : "do-submit-srs-answer",
            "APIID"         : "Ekreasi",
            "APIPassword"   : "EKreasiSRS2018",
            "APIName"       : "SRS",
            "LoginID"       : usernameLogin,
            "BranchID"      : localStorage.getItem("BranchID"),
            "CustomerID"    : localStorage.getItem("CustomerID"),
            "USRUPD"        : usernameLogin,
            "rating"        : srsDataSubmit.rating,
            "isRecommend"   : srsDataSubmit.isRecommend,
            "recommendName" : "-",
            "recommendPhone": "-",
            "source"        : "SRS",
						"Nama"					: srsDataSubmit.CustomerName,
						"HP"						: (srsDataSubmit.MobileNo).toString(),
						"Email"					: srsDataSubmit.Email,
						"Unit"					: "-",
						"Alamat"				: "-",
            "data"          : submitAnswer
          }
        }else{
          submitdata = {
            "APIID"         : "Ekreasi",
            "APIPassword"   : "EKreasiSRS2018",
            "APIName"       : "SRS",
            "LoginID"       : usernameLogin,
            "BranchID"      : localStorage.getItem("BranchID"),
            "CustomerID"    : localStorage.getItem("CustomerID"),
            "USRUPD"        : usernameLogin,
            "rating"        : srsDataSubmit.rating,
            "isRecommend"   : srsDataSubmit.isRecommend,
            "recommendName" : srsDataSubmit.recommendName,
            "recommendPhone": dataPhone,
            "source"        : "SRS",
						"Nama"					: srsDataSubmit.CustomerName,
						"HP"						: (srsDataSubmit.MobileNo).toString(),
						"Email"					: srsDataSubmit.Email,
						"Unit"					: "-",
						"Alamat"				: "-",
            "data"          : submitAnswer
          }
        }
        submitSRS(submitdata);
      }
      else{
        console.log("error");
      }
  }

  function submitSRS(submitdata){

    Common.timeout('get tujuan','Notice','Mengambil data tujuan :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      console.log("submitdata values ::")
      console.log(submitdata);
      // $http.post( bfiCore+'RestNet/api/SRS/v1/PostSRS//Ekreasi/EKreasiSRS2018/SRS' , submitdata, {
      submitdata = {action:"postSRS", data:submitdata}
      $http(httpPostOptionBfiSrs(MobileSRSCoreAction, submitdata))
        .success(function(res) {
          console.log(res);
          clearTimeout(timeoutvar);
          $ionicLoading.hide();
          // $ionicHistory.nextViewOptions({
          //     disableBack: true
          // });
          if(res.Status==200){
            $ionicPlatform.onHardwareBackButton(function() {
              $state.go('app.index', { url: '/index' });
            });
            $state.go("app.srs-5");
          }else{
            $ionicPopup.alert({
              title: 'Notice',
              cssClass  : 'alertCustom',
              template: res!="" && res!=null ? res.Data.header.errors[0].message:"Terdapat kesalahan, tidak dapat mengirim data ke server [2]",
              okType  : 'button-custom-ok'
            });
          }
      }).error(function(err,status, headers, config) {
          console.log("error : ");
          console.log(err);
          console.log(status);
          console.log(headers);
          console.log(config);

          clearTimeout(timeoutvar);
          $ionicLoading.hide();

          /*$ionicPopup.alert({
            title: 'Notice',
            cssClass  : 'alertCustom',
            template: 'Terdapat kesalahan, tidak dapat mengirim data ke server [2]',
            okType  : 'button-custom-ok'
          });
          $ionicPlatform.onHardwareBackButton(function() {
            $state.go('app.index', { url: '/index' });
          });*/
          $PopupUnauthorizedJwt.show(err,status, headers, config);
      });

    });

  }

  $scope.referenceValue = '';
  $scope.addTel = function(referenceValue){

    console.log(referenceValue);
		var handphone  = String(referenceValue);
		var ihandphone = handphone.substring(0, 2);
		var bhandphone = handphone.substring(2, 13);
		if (ihandphone != "62") {
			var newNumber = "62" + handphone;
			referenceValue = parseInt(newNumber);
		} else {
			var newNumber = referenceValue;
			referenceValue = parseInt(newNumber);
		}

    if(referenceValue == null || referenceValue == undefined || referenceValue == ""){
      $scope.showAlert({
        title: "Information",
        message: "Mohon maaf, Anda belum memasukkan nomor untuk ditambah"
      });
    }else{
      var a = isInArrayNgForeach(referenceValue.toString(), $scope.formData.recommendPhone);
      if(a == true){
        $scope.showAlert({
          title: "Information",
          message: "Mohon maaf, Nomor yang anda masukkan sudah di tambahkan"
        });
      }else{
        var confirmPopup = $ionicPopup.confirm({
          title     : "Konfirmasi",
          cssClass  : 'alertCustom',
          template  : 'Apakah anda akan menambahkan nomor telepon ini : '+referenceValue.toString(),
          buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
            text: 'Cancel',
            type: 'button-custom-cancel',
            onTap: function(e) {
              confirmPopup.close();
            }
          }, {
            text: 'OK',
            type: 'button-custom-ok',
            onTap: function(e) {
              return true;
            }
          }]
        });
        confirmPopup.then(function (res) {
          if (res) {
            $scope.formData.recommendPhone.push(referenceValue.toString());
            $scope.referenceValue = '';
            document.getElementsByName('referenceValue')[0].value = '';
          } else {
            //$state.go('app.home', { url: '/home' });
          }
        });
      }
    }
  }

  //add by yacobus
  $scope.rmTel = function(index){
    var confirmDeletePopup = $ionicPopup.confirm({
      title     : "Konfirmasi",
      cssClass  : 'alertCustom',
      template  : 'Apakah anda akan menghapus nomor telepon ini? ',
      buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
        text: 'Cancel',
        type: 'button-custom-cancel',
        onTap: function(e) {
          confirmDeletePopup.close();
        }
      }, {
        text: 'OK',
        type: 'button-custom-ok',
        onTap: function(e) {
          return true;
        }
      }]
    });
    confirmDeletePopup.then(function (res) {
      if (res) {
        $scope.formData.recommendPhone.splice(index, 1);
      } else {
        //$state.go('app.home', { url: '/home' });
      }
    });

  }
  //

  function isInArrayNgForeach(field, arr) {
      var result  = false;
      angular.forEach(arr, function(value, key) {
          if(field == value)
              result = true;
      });
      return result;
  }
})

.controller('SRSStep5Ctrl', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicPlatform , $ionicHistory) {

  $scope.endSRS = function () {

    // $ionicHistory.nextViewOptions({
    //     disableBack: true
    // });

  $ionicPlatform.onHardwareBackButton(function() {
	location.href = "#/app/";
  });
    $state.go('app.index');
  }

})

.controller('SECCtrl', function ($PopupUnauthorized, $scope, $http, $state, $stateParams, $ionicPopup, $ionicLoading, $ionicHistory, Api, Common) {

  $scope.formData = {}; $scope.$on("$ionicView.beforeEnter", function (event, data) {
    console.log("SECCtrl")
    $PopupUnauthorized.getTokenApiGee();
  });

  var objectAnswer = localStorage.removeItem("SECQ");
  $scope.doNext = function () {

    var noKontrak   = $scope.formData.AgreementNo;
    // $ionicLoading.show({
    //     template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    // });

    console.log($scope.formData.AgreementNo);
    if(noKontrak == undefined || noKontrak == ""){
      showAlert('<center>Masukkan nomor kontrak terlebih dahulu</center>');
    }else{
      $ionicLoading.show({
          template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      });

      Common.timeout('get agreement','Perhatian','Mengambil data kontrak :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

        Api.getAgreementData($scope.formData.AgreementNo).then(function(res){
          // var dataTemp = res.data[0];
          // $scope.formData = dataTemp;
          $scope.disabledSelect     = false;
          $ionicLoading.hide();
          console.log(res);
          if(res.status == "1"){
            localStorage.setItem("tempSEC"      , JSON.stringify(res.rows[0]));
            localStorage.setItem("CustomerID"   , res.rows[0].CustomerID );
            localStorage.setItem("BranchID"     , res.rows[0].BranchID );
            localStorage.setItem("CustomerName" , res.rows[0].customerName );
            localStorage.setItem("MobileNo"     , res.rows[0].mobileNo );
            localStorage.setItem("Email"        , res.rows[0].email );
            localStorage.setItem("Status"       , res.rows[0].status );
            localStorage.setItem("ContractNo"   , $scope.formData.AgreementNo );
            localStorage.setItem("mobileNo"     , res.rows[0].mobileNo );

            location.href = "#/app/sec-1";
          }else{
            showAlert('<center>Nomor Kontrak yang Anda masukkan tidak ditemukan</center>');
          }

          clearTimeout(timeoutvar);
          $ionicLoading.hide();
        },
        function(err){
          showAlert('<center>Terjadi kesalahan dalam koneksi ke server</center>');
          clearTimeout(timeoutvar);
          $ionicLoading.hide();
        });

      });
    }
  };
  function showAlert(message){
    $ionicPopup.alert({
      title   : 'Gagal',
      cssClass  : 'alertCustom',
      template: message,
      okType  : 'button-custom-ok'
    });
    $ionicLoading.hide();
  }

})

.controller('SEC1Ctrl', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicHistory, $ionicModal, $ionicPopup) {

  var CustomerID    = localStorage.getItem("CustomerID");
  var BranchID      = localStorage.getItem("BranchID");
  var CustomerName  = localStorage.getItem("CustomerName");
  var MobileNo      = localStorage.getItem("MobileNo");
  var Email         = localStorage.getItem("Email");
  var Status        = localStorage.getItem("Status");
  var ContractNo    = localStorage.getItem("ContractNo");

  var tempSEC       = JSON.parse(localStorage.getItem('tempSEC'));

  $scope.formData   = {};
  $scope.formData = tempSEC;

  console.log($scope.formData);
  // $scope.formData.CustomerName    = CustomerName;
  // $scope.formData.ContractNo      = ContractNo;
  // $scope.formData.mobileNo        = MobileNo;
  // $scope.formData.Email           = Email;

  $scope.doNext = function () {
    location.href = "#/app/sec-2";
  }

  // $scope.EndSEC1 = function () {
  //   location.href = "#/app/index";
  // }

  // When button is clicked, the popup will be shown...
   $scope.showPopup = function() {
      $scope.data = {}

      // Custom popup
		  var confirmPopup = $ionicPopup.confirm({
			  title: 'Anda yakin customer tidak ingin disurvey?',
				cssClass  : 'alertCustom',
				// template  : 'Anda yakin?',
				buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
					text: 'Tidak',
					type: 'button-custom-cancel',
					onTap: function(e) {
						confirmPopup.close();
					}
				}, {
					text: 'Ya',
					type: 'button-custom-ok',
					onTap: function(e) {
						 location.href = "#/app/index";
					}
				}]
			});

      myPopup.then(function(res) {
         console.log('Tapped!', res);
      });
   };

  // $ionicModal.fromTemplateUrl('modal.html', {
  //     scope: $scope,
  //     animation: 'slide-in-up'
  //   }).then(function(modal) { $scope.modal = modal; });

  $scope.modal2 = $ionicModal.fromTemplate(
    '<div class="modal">' +
    '<header class="bar bar-header bar-positive">' +
    '<h1 class="title">I\'m A Modal</h1>' +
    '<div class="button button-clear" ng-click="modal2.hide()">'+
    '<span class="icon ion-close"></span>'+
    '</div>'+
    '</header>'+
    '<content has-header="true" padding="true"><p>This is a modal</p></content>'+
    '</div>',
    {
    scope: $scope,
    animation: 'slide-left-right'
    });

})

.controller('SEC2Ctrl', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicHistory, $ionicModal, Api) {

  $scope.message    = {};
  var ContractNo    = localStorage.getItem("ContractNo");
  var CustomerID    = localStorage.getItem("CustomerID");
  var BranchID      = localStorage.getItem("BranchID");
  var CustomerName  = localStorage.getItem("CustomerName");
  var MobileNo      = localStorage.getItem("MobileNo");
  var Email         = localStorage.getItem("Email");
  var Status        = localStorage.getItem("Status");
  var ContractNo    = localStorage.getItem("ContractNo");
  var picID         = localStorage.getItem("userEmployeeID");
  console.log("ContractNo ========== "+ContractNo);

  $scope.message.AgreementNo        = ContractNo;
  $scope.message.fullnamePelanggan  = CustomerName;
  $scope.message.MobileNo           = MobileNo;
  $scope.message.Email              = Email;
  $scope.message.Status             = Status;
  $scope.message.picSEC             = picID;

  var tempSEC       = JSON.parse(localStorage.getItem('tempSEC'));

  $scope.updateKontrak = function(){
    // $ionicLoading.show({
    //     template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    // });
    console.log($scope.message.AgreementNo);
    // for get contract number ===============
    // Api.getAgreementData($scope.message.AgreementNo).then(function(res){
    //   $scope.message.Tujuan    = "-- Pilih Salah Satu --";
    //   $scope.message.Kategori  = "-- Pilih Salah Satu --";
    //   $scope.disabledSelect     = false;
    //   console.log(res);
    //   if(res.status == "1"){
    //     $scope.message.fullnamePelanggan  = res.rows[0].customerName;
    //     $scope.message.MobileNo           = res.rows[0].mobileNo;
    //     $scope.message.Email              = res.rows[0].email;
    //     $scope.message.Status             = res.rows[0].status;
    //     $scope.message.picSEC             = res.rows[0].picSEC;

    //     localStorage.setItem("CustomerID"   , res.rows[0].CustomerID );
    //     localStorage.setItem("BranchID"     , res.rows[0].BranchID );
    //     localStorage.setItem("LoginID"      , res.rows[0].customerName );

    //   }
    // });
  }

  $scope.doNext = function () {
    location.href = "#/app/sec-3";
  }

})

.controller('SEC3Ctrl', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicHistory, $ionicModal, $ionicPlatform, $ionicLoading, Api, Common) {

  /* ====== DATA STATUS DIAMBIL DARI SEC,RO, Status ======= */
  $scope.doFillStatus = function(values){
    console.log(values.Text);
    if(values.Text == "Keluarga Konsumen"){
      $scope.pengambil = true;
    }else{
      $scope.pengambil = false;
    }
  }
  $scope.formData   = {};
  $scope.doNext = function () {
    if($scope.formData.Status == null || $scope.formData.Status == undefined || $scope.formData.Status == ""){
      $scope.showAlert({
        title: "Information",
        message: "Mohon maaf, Anda belum mengisi kolom 'status'"
      });
    }else {
      localStorage.removeItem("questionSub5_1_16_1");
      localStorage.removeItem("questionSub5_1_17_6_1");

      console.log($scope.formData.Status);
      localStorage.setItem( "Status" , $scope.formData.Status );
      if($scope.formData.Status == "SEC"){
				localStorage.removeItem("SECQ");
        $state.go('app.sec-4', { 'status': $scope.formData.Status });
      }
      else if($scope.formData.Status == "RO"){
				localStorage.removeItem("SECQ");
        submitSEC();
        // $state.go('app.index', { url: '/index' });
      }
      else if($scope.formData.Status == "Other"){
				localStorage.removeItem("SECQ");
        $state.go('app.sec-4', { 'status': $scope.formData.Status });
      }else{

      }
    }
  }

  function submitSEC(){
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });
    console.log("submitSEC");
    var CustomerID  = localStorage.getItem("CustomerID");
    var BranchID    = localStorage.getItem("BranchID");
    var AgreementNo = localStorage.getItem("ContractNo");
    var NoTelp      = localStorage.getItem("mobileNo");
    var Email       = localStorage.getItem("Email");
    var PIC         = localStorage.getItem("userEmployeeID");
    var BranchID    = localStorage.getItem("BranchID");
    var submitAnswer= [];

    var NoTelp      = NoTelp;
    var submitdata  = {
    //  "action"      : "do-submit-sec-answer",
      "CustomerID"  : CustomerID,
      "BranchID"    : BranchID,
      "AgreementNo" : AgreementNo,
      "NoTelp"      : NoTelp,
      "Email"       : Email,
      "PIC"         : PIC,
      "data"        : submitAnswer
    }

    Common.timeout('submit SEC Question','Notice','mengirim SEC Question :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      Api.secSubmit(submitdata).then(function(res){

        var objectAnswer = localStorage.removeItem("SECQ");
        console.log("....................>>>>>>>>>>>>>>");
        console.log(res);
        clearTimeout(timeoutvar);
        $ionicLoading.hide()

        if(res.Status==200){
          $ionicPlatform.onHardwareBackButton(function() {
            $state.go('app.index', { url: '/index' });
          });
          location.href = "#/app/sec-7";
        }else{
          $ionicPopup.alert({
            title: 'Notice',
            cssClass  : 'alertCustom',
            template: res!="" && res!=null ? res.Data.header.errors[0].message:"Terdapat kesalahan, tidak dapat mengirim data ke server [2]",
            okType  : 'button-custom-ok'
          });
        }
      },
      function(error){
        var objectAnswer = localStorage.removeItem("SECQ");
        clearTimeout(timeoutvar);
        $ionicLoading.hide();

        console.log("error : ");
        console.log(error);
        if(error != null){
          console.log(error.header.errors[0].code);
          if(error.header.errors[0].code == "409"){
            $ionicPopup.alert({
              title   : 'Perhatian',
              cssClass  : 'alertCustom',
              template: "Kontrak ini sudah pernah disurvey",
              okType  : 'button-custom-ok'
            });
            $state.go('app.sec', { url: '/sec' });
          }else{
            // $state.go('app.sec', { url: '/sec' });
            $ionicPopup.alert({
              title: 'Notice',
              cssClass  : 'alertCustom',
              // template: 'Server Tidak Merespon [Timeout] permintaan aplikasi, Pesan Error : '+err.header.errors[0].cause,
              template: 'Terdapat kesalahan, tidak dapat mengirim data ke server :: '+error.header.errors[0].code,
              okType  : 'button-custom-ok'
            });
          }
        }else{
          $ionicPopup.alert({
            title: 'Notice',
            cssClass  : 'alertCustom',
            template: 'Terdapat kesalahan, tidak dapat mengirim data ke server',
            okType  : 'button-custom-ok'
          });
        }

      });

    });
  }
})

.controller('SEC4Ctrl', function ($PopupUnauthorizedJwt, $scope, $http, $state, $stateParams, $timeout , $ionicLoading ,$ionicPlatform, $ionicPopup, $ionicHistory, $ionicModal, $filter, Api, Common) {

  if(ionic.Platform.isAndroid()){
    // $http.get('assets/jsondata/sec_question.json').success(function(response){
    //   console.log(response);
    // });
  }
  $scope.OtherQues  = false;
  $scope.SECQues    = false;
  if($stateParams.status == "SEC"){
    getQuestion();
  }else{
    getQuestionOther();
  }

  function getQuestionOther(){
    $scope.loadingImage = true;
    Common.timeout('get SEC Question for get BPKB self','Notice','get SEC Question for get BPKB self :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      // $http.get( bfiCore+'RestNet/api/SRS/v1/getSECForm/Ekreasi/EKreasiSRS2018/SRS').success(function(response){
      $http(httpGetOptionBfiSrs(MobileSRSCoreAction+'?action=getSECForm')).success(function(response){
        console.log(response)
        $scope.questionList     = [];
        // $scope.questionList     = response.data;
        // var responseData  = response.data.slice(0,5);
        var responseData  = response.data;
        for (var i = 0; i < responseData.length; i++) {
          var questNum    = (responseData[i].ID).substr(0,2);
          // var questNum2    = (responseData[i].ID).substr(0,4);

          var idQuest     = "question"+parseInt(questNum);

          if(parseInt(questNum) >= 10){
            var questNum2    = (responseData[i].ID).substr(0,5);
          }else{
            var questNum2    = (responseData[i].ID).substr(0,4);
          }

          if(parseInt((responseData[i].ID).substr(0,2)) < 2){
          // if(parseInt((responseData[i].ID).substr(0,2)) < 11){
            console.log((responseData[i].ID).substr(0,1));
            if(responseData[i].ID != '1.1'){

              if((responseData[i].ID).substr(1,2) == "" || (responseData[i].ID).substr(1,2) == "0"){
                $scope.questionList.push({
                  "questionnumber"      : idQuest,
                  "subquestionnumber"   : "",
                  "subquestionnumbercom": "",
                  "ID"                  : responseData[i].ID,
                  "Text"                : responseData[i].Text,
                  "TypeAnswer"          : responseData[i].TypeAnswer
                });
              }else{
                questNum2 = questNum2.replace(".", "_");
                $scope.questionList.push({
                  "questionnumber"      : idQuest,
                  "subquestionnumber"   : questNum2,
                  "subquestionnumbercom": questNum2,
                  "ID"                  : responseData[i].ID,
                  "Text"                : responseData[i].Text,
                  "TypeAnswer"          : responseData[i].TypeAnswer
                });
                var nm = 'questionSub'+questNum2;
                $scope[nm] = {
                  'display': 'none'
                }
              }
            }
          }
        }
        $scope.loadingImage = false;
        console.log(">> questionList >>");
        console.log($scope.questionList);

        clearTimeout(timeoutvar);
      }).error(function(err,status, headers, config) {
          $ionicLoading.hide();
          clearTimeout(timeoutvar);
          $PopupUnauthorizedJwt.show(err,status, headers, config);
      });

    });


    Common.timeout('get SEC SubQuestion for get BPKB self','Notice','get SEC SubQuestion for get BPKB self :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      // $http.get( bfiCore+'RestNet/api/SRS/v1/getSECFormSubQuestion//Ekreasi/EKreasiSRS2018/SRS').success(function(response){
      $http(httpGetOptionBfiSrs(MobileSRSCoreAction+'?action=getSECFormSubQuestion')).success(function(response){
        console.log("SUBQUESTION");
        question2ListArr     = [];
        var responseData  = response.data;
        for (var i = 0; i < responseData.length; i++) {

          var questNum    = (responseData[i].ID).substr(0,2);
          var questNum2   = (responseData[i].ID).substr(0,5);

          var idQuest     = "question"+parseInt(questNum);
          var idValue     = parseInt((responseData[i].ID).substr(0,2));
          questNum2       = questNum2.replace(/\./g, "_");
          var quesID      = parseInt((responseData[i].ID).substr(0,2));
          var ansID       = "";
          var subAnsID    = "";
          var subSubAnsID = "";

          question2ListArr.push({
            "questionnumber"      : idQuest,
            "subquestionnumber"   : questNum2,
            "subquestionnumbercom": questNum2,
            "quesID"              : quesID+ansID+subAnsID,
            "ansID"               : ansID,
            "subAnsID"            : subAnsID,
            "subSubAnsID"         : subSubAnsID,
            "ID"                  : responseData[i].ID,
            "Text"                : responseData[i].Text,
            "TypeAnswer"          : responseData[i].TypeAnswer
          });
          var quest   = responseData[i].ID.replace(/\./g, "_");
          var nm      = 'questionSub'+quest;
          $scope[nm]  = {
            'display': 'none'
          }

        }
        var sortByID  = question2ListArr.sort(function(a,b){ return a.quesID-b.quesID});
        $scope.question2List = sortByID;

        console.log(">> question2List >>");
        console.log($scope.question2List);

        clearTimeout(timeoutvar);
        $ionicLoading.hide();
      }).error(function(err,status, headers, config) {
          $ionicLoading.hide();
          clearTimeout(timeoutvar);
          $PopupUnauthorizedJwt.show(err,status, headers, config);
      });

    });


    getSubQuestion();
  }

  function getQuestion(){

    $scope.loadingImage = true;
    Common.timeout('get SEC Question','Perhatian','Mengambil Pertanyaan SEC :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      // $http.get( bfiCore+'RestNet/api/SRS/v1/getSECForm/Ekreasi/EKreasiSRS2018/SRS').success(function(response){
      $http(httpGetOptionBfiSrs(MobileSRSCoreAction+'?action=getSECForm')).success(function(response){
        $scope.questionList     = [];
        // $scope.questionList     = response.data;
        // var responseData  = response.data.slice(0,5);
        var responseData  = response.data;
        for (var i = 0; i < responseData.length; i++) {
          var questNum    = (responseData[i].ID).substr(0,2);
          // var questNum2    = (responseData[i].ID).substr(0,4);

          var idQuest     = "question"+parseInt(questNum);

          if(parseInt(questNum) >= 10){
            var questNum2    = (responseData[i].ID).substr(0,5);
          }else{
            var questNum2    = (responseData[i].ID).substr(0,4);
          }

          if(parseInt((responseData[i].ID).substr(0,2)) < 6){
          // if(parseInt((responseData[i].ID).substr(0,2)) < 11){

            if(responseData[i].ID != '1.2' && responseData[i].ID != '1.3'){
              if((responseData[i].ID).substr(1,2) == "" || (responseData[i].ID).substr(1,2) == "0"){
                $scope.questionList.push({
                  "questionnumber"      : idQuest,
                  "subquestionnumber"   : "",
                  "subquestionnumbercom": "",
                  "ID"                  : responseData[i].ID,
                  "Text"                : responseData[i].Text,
                  "TypeAnswer"          : responseData[i].TypeAnswer
                });
              }else{
                questNum2 = questNum2.replace(".", "_");
                $scope.questionList.push({
                  "questionnumber"      : idQuest,
                  "subquestionnumber"   : questNum2,
                  "subquestionnumbercom": questNum2,
                  "ID"                  : responseData[i].ID,
                  "Text"                : responseData[i].Text,
                  "TypeAnswer"          : responseData[i].TypeAnswer
                });
                var nm = 'questionSub'+questNum2;
                $scope[nm] = {
                  'display': 'none'
                }
              }
            }

          }
        }
        $scope.loadingImage = false;
        console.log(">> questionList >>");
        console.log($scope.questionList);

        clearTimeout(timeoutvar);
      }).error(function(err,status, headers, config) {
          $ionicLoading.hide();
          clearTimeout(timeoutvar);
          $PopupUnauthorizedJwt.show(err,status, headers, config);
      });

    });

    getSubQuestion();

  }

  function getSubQuestion(){

    Common.timeout('get SEC SubQuestion','Perhatian','Mengambil Sub Pertanyaan SEC :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      // $http.get( bfiCore+'RestNet/api/SRS/v1/getSECFormSubQuestion//Ekreasi/EKreasiSRS2018/SRS').success(function(response){
      $http(httpGetOptionBfiSrs(MobileSRSCoreAction+'?action=getSECFormSubQuestion')).success(function(response){
      // $http.get('assets/jsondata/subquestion_dummy.json').success(function(response){
        console.log("SUBQUESTION");
        question2ListArr        = [];
        $scope.question2ListArrSub  = [];
        $scope.question2ListArrSubSub  = [];

        var responseData  = response.data;
        for (var i = 0; i < responseData.length; i++) {

          var questNum    = (responseData[i].ID).substr(0,2);

          if(parseInt(questNum) >= 10){
            var questNum2    = (responseData[i].ID).substr(0,7);
          }else{
            var questNum2    = (responseData[i].ID).substr(0,6);
          }

          var idQuest     = "question"+parseInt(questNum);
          var idValue     = parseInt((responseData[i].ID).substr(0,2));
          questNum2       = questNum2.replace(/\./g, "_");
          var quesID      = parseInt((responseData[i].ID).substr(0,2));
          var ansID       = "";
          var subAnsID    = "";
          var subSubAnsID = "";

          if(!isNaN(quesID) && angular.isNumber(quesID)){
            if(quesID >= 10){
              ansID     = parseInt((responseData[i].ID).substr(3,2));
            }else{
              ansID     = parseInt((responseData[i].ID).substr(2,2));
            }
          }else{
            ansID = 0;
          }

          if(!isNaN(ansID) && angular.isNumber(ansID)){
            if(ansID >= 10){
              subAnsID  = parseInt((responseData[i].ID).substr(5,2));

              if(!isNaN(subAnsID) && angular.isNumber(subAnsID)){
                subAnsID  = subAnsID;
              }else{
                subAnsID  = 0;
              }
            }else{
              subAnsID  = parseInt((responseData[i].ID).substr(4,2));
              if(!isNaN(subAnsID) && angular.isNumber(subAnsID)){
                subAnsID  = subAnsID;
              }else{
                subAnsID  = 0;
              }
            }
          }else{
            ansID = 0;
            subAnsID = 0;
          }

          if(subAnsID >= 10){

            if((responseData[i].ID).substr(9,1) == ""){

              var questChange = (responseData[i].ID).substr(0,9);
              questNum2       = questChange.replace(/\./g, "_");
              subSubAnsID  = parseInt((responseData[i].ID).substr(7,2));

              if(!isNaN(subSubAnsID) && angular.isNumber(subSubAnsID)){
                subSubAnsID     = subSubAnsID;
                // console.log("A >>>>>>>>>>>>>> ");
                // console.log(responseData[i].ID);
                $scope.question2ListArrSubSub.push({
                  "questionnumber"      : idQuest,
                  "subquestionnumber"   : questNum2,
                  "subquestionnumbercom": questNum2,
                  "quesID"              : quesID+ansID+subAnsID,
                  "ansID"               : ansID,
                  "subAnsID"            : subAnsID,
                  "subSubAnsID"         : subSubAnsID,
                  "ID"                  : responseData[i].ID,
                  "Text"                : responseData[i].Text,
                  "TypeAnswer"          : responseData[i].TypeAnswer
                });
                var nm = 'questionSub'+questNum2;
                $scope[nm] = {
                  'display': 'none'
                }
                // console.log("NM none = "+nm);
              }else{
                subSubAnsID   = 0;
               // console.log("B >>>>>>>>>>>>>> ");
               // console.log(responseData[i].ID);
                $scope.question2ListArrSub.push({
                  "questionnumber"      : idQuest,
                  "subquestionnumber"   : questNum2,
                  "subquestionnumbercom": questNum2,
                  "quesID"              : quesID+ansID+subAnsID,
                  "ansID"               : ansID,
                  "subAnsID"            : subAnsID,
                  "subSubAnsID"         : subSubAnsID,
                  "ID"                  : responseData[i].ID,
                  "Text"                : responseData[i].Text,
                  "TypeAnswer"          : responseData[i].TypeAnswer
                });
                var nm = 'questionSub'+questNum2;
                $scope[nm] = {
                  'display': 'none'
                }
              }

            }else{
              var questChange = (responseData[i].ID).substr(0,10);
              questNum2       = questChange.replace(/\./g, "_");
              console.warn(">>>>> "+responseData[i].ID);
              console.warn(">>>>> "+questNum2);
              $scope.question2ListArrSubSub.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "quesID"              : quesID+ansID+subAnsID,
                "ansID"               : ansID,
                "subAnsID"            : subAnsID,
                "subSubAnsID"         : subSubAnsID,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
            }

          }else{
            subSubAnsID  = parseInt((responseData[i].ID).substr(6,2));
            if(!isNaN(subSubAnsID) && angular.isNumber(subSubAnsID)){
              subSubAnsID   = subSubAnsID;
              $scope.question2ListArrSubSub.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "quesID"              : quesID+ansID+subAnsID,
                "ansID"               : ansID,
                "subAnsID"            : subAnsID,
                "subSubAnsID"         : subSubAnsID,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
            }else{
              // var newquestnum = (responseData[i].ID).substr(0,2);
              // if(parseInt(newquestnum) >= 10){
              //   var questNum22    = (responseData[i].ID).substr(0,7);
              // }else{
              //   var questNum22    = (responseData[i].ID).substr(0,6);
              // }
              // console.log(";;;;; "+questNum22);
              subSubAnsID   = 0;
              $scope.question2ListArrSub.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "quesID"              : quesID+ansID+subAnsID,
                "ansID"               : ansID,
                "subAnsID"            : subAnsID,
                "subSubAnsID"         : subSubAnsID,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              // var abc = questNum2.replace(/\./g, "_");
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
              console.log("NM none = "+nm);
            }
          }

          console.log("================================================");
          // console.log("ID =========== "+responseData[i].ID);
          // console.log("quesID ======= "+quesID);
          // console.log("ansID ======== "+ansID);
          // console.log("subAnsID ===== "+subAnsID);
          // console.log("subSubAnsID == "+subSubAnsID);

          question2ListArr.push({
            "questionnumber"      : idQuest,
            "subquestionnumber"   : questNum2,
            "subquestionnumbercom": questNum2,
            "quesID"              : quesID+ansID+subAnsID,
            "ansID"               : ansID,
            "subAnsID"            : subAnsID,
            "subSubAnsID"         : subSubAnsID,
            "ID"                  : responseData[i].ID,
            "Text"                : responseData[i].Text,
            "TypeAnswer"          : responseData[i].TypeAnswer
          });
          var quest   = responseData[i].ID.replace(/\./g, "_");
          var nm      = 'questionSub'+quest;
          $scope[nm]  = {
            'display': 'none'
          }

        }

        for (var i = 0; i < $scope.question2ListArrSubSub.length; i++) {
          var questChange = ($scope.question2ListArrSubSub[i].ID).substr(0,9);
          questNum2       = questChange.replace(/\./g, "_");

          var nm = 'questionSub'+questNum2;
          $scope[nm] = {
            'display': 'none'
          }
          // console.log("NM none = "+nm);
        }

        var sortByID          = question2ListArr.sort(function(a,b){ return a.quesID-b.quesID});
        $scope.question2List  = sortByID;

        console.log(">> question2List >>");
        console.log($scope.question2ListArrSub);
        console.log($scope.question2ListArrSubSub);

        clearTimeout(timeoutvar);
      }).error(function(err,status, headers, config) {
          $ionicLoading.hide();
          clearTimeout(timeoutvar);
          $PopupUnauthorizedJwt.show(err,status, headers, config);
      });

    });

  }

  $scope.loads = function(question,answer,type,quesnumber,subquesnum,arrques,subAnsID,subSubAnsID){

    console.log("----------------------------------------");
    console.log("question 	: "+question);
    console.log("answer 		: "+answer);
    console.log("type 			: "+type);
    console.log("quesnumber : "+quesnumber);
    console.log("subquesnum : "+subquesnum);
    // console.log("arrques : "+arrques);
    console.log("-----------------------------");

		//===================================================================================
    // localStorage.setItem("SECQ_"+question,answer);
		var questionLength 	= question.length - 2;
    var res1 						= question.substr(question.length - 1);
    var res2 						= question.substr(question.length - 2);

		if(isNaN(parseInt(res2))){
			var satuanBelakang= question.substr(0 , (question.length - 2));
		}else{
			var satuanBelakang= question.substr(0 , (question.length - 3));
		}

		var getDataStore 		= localStorage.getItem("SECQ");
		var dataSoreObject 	= JSON.parse(getDataStore);

		console.log("dataSoreObject AnswerID");
		console.log(dataSoreObject);
		console.log("satuanBelakang ==== "+satuanBelakang);

		var SECQ_Object = {
			"QuestionID"  : satuanBelakang,
			"AnswerID"    : question,
			"DetailAnswer": answer
		}

		if(dataSoreObject == undefined || dataSoreObject == null){
			var questionStore 	= [];
			questionStore.push(SECQ_Object);
    	localStorage.setItem( "SECQ" , JSON.stringify(questionStore) );
		}
		else{
			console.log("dataSoreObject DEFINED");
			if(dataSoreObject.length == 0){
				dataSoreObject.push(SECQ_Object);
    		localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );

			}else{
				var filterSatuanBlkg = $filter('filter')(dataSoreObject, { QuestionID: satuanBelakang }, true)[0];
				if(type == "CB" || type == "QCB"){
					var filterSatuanQuest = $filter('filter')(dataSoreObject, { AnswerID: question }, true)[0];
					console.log("subquesnum ========== "+subquesnum);
					if(filterSatuanBlkg != undefined || filterSatuanBlkg != null){
						console.log("value CB udah ada");

						if(filterSatuanQuest != undefined || filterSatuanQuest != null){

							console.log("value CB filterSatuanQuest ada");
							if(subquesnum == true){
								console.log("value CB filterSatuanQuest ada && TRUE");

								// var efg 			= $filter('filter')(dataSoreObject, { AnswerID: question }, true)[0];

								var index 		= dataSoreObject.indexOf(filterSatuanQuest);
								dataSoreObject.splice(index, 1, SECQ_Object);
							}else{
								console.log("value CB filterSatuanQuest ada && FALSE");
                var index2 		= dataSoreObject.indexOf(filterSatuanQuest);
                dataSoreObject.splice(index2, 1);
                console.log(filterSatuanQuest);
							}
						}else{
							console.log("value CB filterSatuanQuest tidak ada");

							if(subquesnum == true){
								dataSoreObject.push(SECQ_Object);
							}else{

							}
						}

					}else{
						console.log("value filterSatuanQuest nggak ada");
						var index 		= dataSoreObject.indexOf(filterSatuanBlkg);
						// dataSoreObject.splice(index, 1);
						dataSoreObject.push(SECQ_Object);
					}

				}else{
					if(filterSatuanBlkg != undefined || filterSatuanBlkg != null){

            var removeQuestID = filterSatuanBlkg.AnswerID;
						var index 		= dataSoreObject.indexOf(filterSatuanBlkg);
            dataSoreObject.splice(index, 1, SECQ_Object);
            console.log("removeQuestID :: "+removeQuestID);

            var removeValueIndex = [];
            for(var i = 0;i<dataSoreObject.length;i++){
              if(removeQuestID == dataSoreObject[i].QuestionID){
                // console.log("REMOVE THIS :: ");
                var getIndex 	= dataSoreObject.indexOf(dataSoreObject[i]);
                removeValueIndex.push(getIndex);
                // dataSoreObject.splice(getIndex, 1);
              }
            }

            console.log(removeValueIndex);
            for(var i = 0;i<removeValueIndex.length;i++){
              console.log(removeValueIndex[i]);
              console.log(dataSoreObject);
              // dataSoreObject.splice( removeValueIndex[i] , 1);
              _.pullAt(dataSoreObject,removeValueIndex);
            }

					}else{

						console.log("filterSatuanBlkg NULL");
						dataSoreObject.push(SECQ_Object);

            var filterBawah0 = $filter('filter')(dataSoreObject, { QuestionID: "1.3" }, true)[0];
            console.log("filterBawah :: "+filterBawah0)
            if(filterBawah0 != undefined || filterBawah0 != null){
              var indexz       = dataSoreObject.indexOf(filterBawah0);
              dataSoreObject.splice( indexz, 1);
            }

            var filterBawah1 = $filter('filter')(dataSoreObject, { AnswerID: "5.1.16.1" }, true)[0];
            console.log("filterBawah :: "+filterBawah1)
            if(filterBawah1 != undefined || filterBawah1 != null){
              var indexz       = dataSoreObject.indexOf(filterBawah1);
              dataSoreObject.splice( indexz, 1);
            }
            var filterBawah2 = $filter('filter')(dataSoreObject, { AnswerID: "5.1.17.6.1" }, true)[0];
            console.log("filterBawah :: "+filterBawah2)
            if(filterBawah2 != undefined || filterBawah2 != null){
              var indexz       = dataSoreObject.indexOf(filterBawah2);
              dataSoreObject.splice( indexz, 1);
            }

					}
				}
				localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );
			}
		}

		// console.log(arr);

		// localStorage.setItem( "SECQ_"+parseInt(question.substr(0,2)) , JSON.stringify(SECQ_Object) );
		// =================================================================================

    for (var i = 0; i < arrques.length; i++) {
      var idq   = arrques[i].ID;
      //add by yacobus
      if (idq.substr(0,1)==question.substr(0,1) && idq.substr(0,3)!=question && question.length==3){
					console.log("part 1");
        if (arrques[i].TypeAnswer=='CB'){
          var className = idq.replace(/\./g, "_");
         // document.getElementById("cb_" + className).checked =false;

        }
      }
      //

			// console.log("===========================");
			// console.log(arrques[i].ID);
      if(question.substr(0,1) == idq.substr(0,1)){
				// console.log("part 2");

        if(question == idq){
          var className = idq.replace(/\./g, "_");
          var nm = 'questionSub'+className;
          $scope[nm] = {
            'display': 'block',
          }
        }
        else{
					// console.log("part 3");
          var className = idq.replace(/\./g, "_");
          var nm = 'questionSub'+className;
          if(question.substr(4,1) != ""){
							// console.log("part 4");
            if(question.substr(0,3) == idq.substr(0,3)){
								// console.log("INIH == "+nm+" ANDDDD questionSub"+className);
							$scope[nm] = {
								'display': 'block'
							}

							var classStyleName 	= question.replace(/\./g, "_");
							var questStyle 			= "questionSub"+classStyleName;

							// console.log(className.substr(7,1));
							if(className.substr(7,1) != ""){

								// console.log("part 4");
								if(nm != questStyle){
									console.log("part 5");
									console.log("show == "+questStyle);

									// console.log("show attr == "+nm);
									$scope[questStyle] = {
										'display': 'block'
									}

									if(type == 'QCB' || type == 'QRB' ){
										console.log("part 5.1 ---- WITH QRB/QCB");
										// console.log(type);
										// console.log(idq.substr(0,6)+" == "+question);
										if(idq.substr(0,6) == question){
											console.log("part 5.1.1");
											$scope[nm] = {
												'display': 'block'
											}

											if(subquesnum == true){
												localStorage.setItem(nm , "true");
												$scope[nm] = {
													'display': 'block'
												}
											}else{
												localStorage.setItem(nm , "false");
												$scope[nm] = {
													'display': 'none'
												}
											}
										}else{
											console.log("part 5.1.2");
											if(arrques[i].ID.substr(9,1) != ''){
												// console.log("part 5.1.2.1");
												console.log(":::::::: "+nm);
												console.log(idq.substr(0,8)+" == "+question);
												if(idq.substr(0,8) == question){
													// console.log("part 5.1.2.1.1");
													if(subquesnum == true){
														// console.log("part 5.1.2.1.1.1");
														localStorage.setItem(nm , "true");
														$scope[nm] = {
															'display': 'block'
														}
													}else{
														// console.log("part 5.1.2.1.1.2");
														localStorage.setItem(nm , "false");
														$scope[nm] = {
															'display': 'none'
														}
													}
												}else{
													// console.log("part 5.1.2.1.2");
													var getLocalSEC1 = localStorage.getItem(nm);
													console.log(":::::::::::::::::::::::::::: "+getLocalSEC1);
													if(getLocalSEC1 == "true" || getLocalSEC1 == true){
														// console.log("part 5.1.2.1.2.1");
														localStorage.setItem(nm , "true");
														$scope[nm] = {
															'display': 'block'
														}
													}else{
														// console.log("part 5.1.2.1.2.2");
														localStorage.setItem(nm , "false");
														$scope[nm] = {
															'display': 'none'
														}
													}
												}

											}else{
												// console.log("part 5.1.2.2");
												// console.log(":::::::::: "+arrques[i].ID);
												// console.log(":::::::::: "+arrques[i].TypeAnswer);

												if(idq.substr(0,8) == question){
													// console.log("part 5.1.2.2.1");
													// console.log("xxxxxxxxxxx "+subquesnum);
													if(subquesnum == true){
														localStorage.setItem(nm , "true");
														$scope[nm] = {
															'display': 'block'
														}
													}else{
														localStorage.setItem(nm , "false");
														$scope[nm] = {
															'display': 'none'
														}
													}
												}else{
													// console.log("part 5.1.2.2.2");
													// console.log(":::::::::: "+arrques[i].TypeAnswer);
													// console.log("___ "+idq.substr(0,6)+" == "+question.substr(0,6));
													if(idq.substr(0,6) != question.substr(0,6)){
														// console.log("ppart 5.1.2.2.2.1");
														// console.log(",,,,,,,,,,,,,,,,,,, "+nm);
														var getLocalSEC1 = localStorage.getItem(nm);
														// console.log(":::::::::::::::::::::::::::: "+getLocalSEC1);
														if(arrques[i].TypeAnswer == "QCB" || arrques[i].TypeAnswer == "QRB"){
															// console.log("ITS QRB / QCB === ");
															var getLocalSEC1 = localStorage.getItem(nm);
															// console.log(":::::::::::::::::::::::::::: "+getLocalSEC1);
															if(getLocalSEC1 == "true" || getLocalSEC1 == true){
																$scope[nm] = {
																	'display': 'block'
																}
															}
															else if(getLocalSEC1 == "false" || getLocalSEC1 == false){
																$scope[nm] = {
																	'display': 'none'
																}
															}
															else{

																$scope[nm] = {
																	'display': 'block'
																}
															}
														}else{
															// console.log("ITS NOT QRB / QCB === ");
															if(getLocalSEC1 == "true" || getLocalSEC1 == true){
																$scope[nm] = {
																	'display': 'block'
																}
															}
															else if(getLocalSEC1 == "false" || getLocalSEC1 == false){
																$scope[nm] = {
																	'display': 'none'
																}
															}
														}
													}
												}

											}
										}
									}else{
										// console.log("part 5.2 ---- NON QRB/QCB");
										// console.log(arrques[i].ID);
										if(idq.substr(0,6) == question){

											console.log("part 5.2.1");
											$scope[nm] = {
												'display': 'block'
											}
											if(arrques[i].ID == "5.1.16.1"){

												var getLocalSEC1 = localStorage.getItem(nm);
												// console.log(":::::::::::::::::::::::::::: "+getLocalSEC1);
												if(getLocalSEC1 == "true" || getLocalSEC1 == true){
													$scope[nm] = {
														'display': 'block'
													}
												}else{
													$scope[nm] = {
														'display': 'none'
													}
												}
											}
											if(arrques[i].ID == "5.1.17.6.1"){

												var getLocalSEC1 = localStorage.getItem(nm);
												// console.log(":::::::::::::::::::::::::::: "+getLocalSEC1);
												if(getLocalSEC1 == "true" || getLocalSEC1 == true){
													$scope[nm] = {
														'display': 'block'
													}
												}else{
													$scope[nm] = {
														'display': 'none'
													}
												}
											}

										}else{
											console.log("part 5.2.2");
											// console.log(idq.substr(0,6)+" TIDAK SAMA "+question);
											console.log("ID "+arrques[i].ID);

											$scope[nm] = {
												'display': 'block'
											}
											if(arrques[i].ID == "5.1.16.1"){

												var getLocalSEC1 = localStorage.getItem(nm);
												// console.log(":::::::::::::::::::::::::::: "+getLocalSEC1);
												if(getLocalSEC1 == "true" || getLocalSEC1 == true){
													$scope[nm] = {
														'display': 'block'
													}
												}else{
													$scope[nm] = {
														'display': 'none'
													}
												}
											}
											if(arrques[i].ID == "5.1.17.6.1"){

												var getLocalSEC1 = localStorage.getItem(nm);
												// console.log(":::::::::::::::::::::::::::: "+getLocalSEC1);
												if(getLocalSEC1 == "true" || getLocalSEC1 == true){
													$scope[nm] = {
														'display': 'block'
													}
												}else{
													$scope[nm] = {
														'display': 'none'
													}
												}
											}

										}
									}
								}else{
									// console.log("show == "+questStyle);
									// console.log("part 6");
									$scope[questStyle] = {
										'display': 'none'
									}
								}

							}else{
								// console.log("hide == "+questStyle);
								$scope[questStyle] = {
									'display': 'block'
								}
							}

            }else{
            //  console.log("ONOH == "+question.substr(4,1));
              $scope[nm] = {
                'display': 'none'
              }
            }
          }else{
							// console.log("part 5");
            if(question.substr(0,3) == idq.substr(0,3)){
						// 	console.log("part 6");
            //  console.log("show class == "+nm);
              if(question.substr(0,4) == idq.substr(0,4)){

							// console.log("part 7");
                $scope[nm] = {
                  'display': 'block'
                }
              }else{
								// console.log("part 8");
                var zzz = question.replace(/\./g, "_");
                idq     = idq.replace(/\./g, "_");
                zzz     = zzz.substr(0,4);
                if(idq == zzz){
                  $scope[nm] = {
                    'display': 'none'
                  }
                }else{
                  $scope[nm] = {
                    'display': 'block'
                  }
                }

								// console.log(">>>>>>>>>>>>>"+arrques[i].ID+">>>>>>>>>> "+nm+" >>>> "+className.substr(5,7));
								// console.log("/////////////// '"+(arrques[i].ID).substr(0,6)+"'");
								if((arrques[i].ID).substr(6,1) == "" ){
									//+++++++
									if(arrques[i].TypeAnswer == "QCB" || arrques[i].TypeAnswer == "QRB"){
									// console.log(">>>>>>>>>>>>>"+arrques[i].ID+" <<<<<<<<<<<<<< ");

										var answerType = arrques[i].ID;

									}
								}

								if(className.substr(7,1) != ""){
									// console.log("part 8.1");
									// console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA "+nm);

									//+++++++
									if(answerType == (arrques[i].ID).substr(0,6)){

										// console.log("_____________ "+nm);
										$scope[nm] = {
											'display': 'none'
										}
									}else{
										if(arrques[i].ID == "5.1.17.6.1"){
											// console.log("------------ "+nm);
											$scope[nm] = {
												'display': 'none'
											}
										}
									}

								}
								else{
									// console.log("part 8.2");
									$scope[questStyle] = {
										'display': 'block'
									}

									//----------
								}
              }
            }else{

						// 	console.log("part 9");
            //  console.log("hide class == "+nm);
              $scope[nm] = {
                'display': 'none'
              }
            }
          }

        }
      }
    }
  }

	$scope.loadsTextbox = function(question,answer,type,quesnumber,subquesnum,arrques,subAnsID,subSubAnsID){
    console.log("----------------------------------------");
    console.log("question 	: "+question);
    console.log("answer 		: "+answer);
    console.log("type 			: "+type);
    console.log("quesnumber : "+quesnumber);
    console.log("subquesnum : "+subquesnum);
    // console.log("arrques : "+arrques);
    console.log("-----------------------------");

		//===================================================================================
    // localStorage.setItem("SECQ_"+question,answer);

		var questionLength 	= question.length - 2;
    var res1 						= question.substr(question.length - 1);
    var res2 						= question.substr(question.length - 2);

		if(isNaN(parseInt(res2))){
			var satuanBelakang= question.substr(0 , (question.length - 2));
		}else{
			var satuanBelakang= question.substr(0 , (question.length - 3));
		}

		var getDataStore 		= localStorage.getItem("SECQ");
		var dataSoreObject 	= JSON.parse(getDataStore);

		console.log("dataSoreObject AnswerID");
		console.log(dataSoreObject);
		console.log("satuanBelakang =========== "+satuanBelakang);
		var detailAnswer = $scope[subquesnum];
		console.log("----------------- detailAnswer --------------");
		console.log(subquesnum);

		var SECQ_Object = {
			"QuestionID"  : satuanBelakang.substr(0,3),
			"AnswerID"    : satuanBelakang,
			"DetailAnswer": subquesnum
		}

		if(dataSoreObject == undefined || dataSoreObject == null){
			var questionStore 	= [];
			questionStore.push(SECQ_Object);
    	localStorage.setItem( "SECQ" , JSON.stringify(questionStore) );
		}
		else{
			// console.log("dataSoreObject DEFINED");
			// if(dataSoreObject.length == 0){
			// 	dataSoreObject.push(SECQ_Object);
   		// localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );

			// }else{
			// 	var abc = $filter('filter')(dataSoreObject, { QuestionID: satuanBelakang }, true)[0];
			// 	if(abc != undefined || abc != null){

			// 		console.log("ABC TIDAK NULL");
			// 		console.log(abc);
			// 		var index 		= dataSoreObject.indexOf(abc);
			// 		dataSoreObject.splice(index, 1, SECQ_Object);
			// 	}else{
			// 		console.log("ABC NULL");
			// 		dataSoreObject.push(SECQ_Object);
			// 	}
			// 	localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );
			// }
      // ======================
			var abc = $filter('filter')(dataSoreObject, { QuestionID: satuanBelakang }, true)[0];
			// if(type == "CB"){
			console.log("subquesnum ========== "+subquesnum);
			console.log(satuanBelakang);
			if(abc != undefined || abc != null){
				var cde = $filter('filter')(dataSoreObject, { AnswerID: question }, true)[0];
				console.log(question);
				console.log("nn1");

				if(cde != undefined || cde != null){
					console.log("nn2");

					if(subquesnum == true){
						console.log("nn3");
						var index 		= dataSoreObject.indexOf(cde);
						dataSoreObject.splice(index, 1, SECQ_Object);
					}else{
            console.log("nn4");
            console.log(satuanBelakang);
            console.log(question);
						var SECQ_Object = {
							"QuestionID"  : satuanBelakang,
							"AnswerID"    : question,
							"DetailAnswer": subquesnum
						}
            console.log(cde);
						var index 		= dataSoreObject.indexOf(abc);
						dataSoreObject.splice(index, 1, SECQ_Object);
					}
				}else{
					console.log("nn5");
					var SECQ_Object = {
						"QuestionID"  : satuanBelakang,
						"AnswerID"    : question,
						"DetailAnswer": subquesnum
					}
					if(subquesnum == true){
						console.log("nn6");
						dataSoreObject.push(SECQ_Object);
					}else{
						console.log("nn7");
						console.log(abc);
						dataSoreObject.push(SECQ_Object);
					}
				}

			}else{
				var SECQ_Object = {
						"QuestionID"  : satuanBelakang,
						"AnswerID"    : question,
						"DetailAnswer": subquesnum
					}
				console.log("value CB nggak ada");
				var index 		= dataSoreObject.indexOf(abc);
				dataSoreObject.splice(index, 1);
				dataSoreObject.push(SECQ_Object);
			}

			localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );
		}
	}

  $scope.doNext = function () {

    if($stateParams.status == "SEC"){

			var SECQ_1 = getDataStatus(1);
			var SECQ_2 = getDataStatus(2);
			var SECQ_3 = getDataStatus(3);
			var SECQ_4 = getDataStatus(4);
			var SECQ_5 = getDataStatus(5);

			console.log("SECQ");
			console.log(SECQ_1);
			console.log(SECQ_2);
			console.log(SECQ_3);
			console.log(SECQ_4);
			console.log(SECQ_5);

      if(SECQ_1 == undefined){
        showAlert("1");
      }else if(SECQ_2 == undefined){
        showAlert("2");
      }else if(SECQ_3 == undefined){
        showAlert("3");
      }else if(SECQ_4 == undefined){
        showAlert("4");
      }else if(SECQ_5 == undefined){
        showAlert("5");
      }else{
				localStorage.removeItem("questionSub5_1_16_1");
				localStorage.removeItem("questionSub5_1_17_6_1");
        location.href = "#/app/sec-5";
      }
    }else{

        var SECQ_1 = getDataStatus(1);
        if(SECQ_1 == undefined){
          showAlert("1");
        }else{
          var SECQ_Val = JSON.parse(localStorage.getItem("SECQ"));
          submitSEC(SECQ_Val);
          // location.href = "#/app/sec-7";
        }
    }

  }

	function getDataStatus(value){
			var result;
      var SECQ = JSON.parse(localStorage.getItem("SECQ"));
			if(SECQ != null){

				for (var i = 0; i < SECQ.length; i++) {
					var idQuestion = SECQ[i].QuestionID;
				 	// console.log(idQuestion.substr(0,1)+" COMPARE "+value);
					if(idQuestion.substr(0,1) ==	 value){
							console.log(idQuestion.substr(0,1)+" SAMA "+value);

							result = true;
							break;
					}
				}
			}
			return result;

	}

  function submitSEC(submitAnswer){

    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });

    console.log("submitSEC");
    console.log(submitAnswer);
    var CustomerID  = localStorage.getItem("CustomerID");
    var BranchID    = localStorage.getItem("BranchID");
    var AgreementNo = localStorage.getItem("ContractNo");
    var NoTelp      = localStorage.getItem("mobileNo");
    var Email       = localStorage.getItem("Email");
    var PIC         = localStorage.getItem("userEmployeeID");
    var BranchID    = localStorage.getItem("BranchID");

    var NoTelp      = NoTelp;
    submitdata = {
    //  "action"      : "do-submit-sec-answer",
      "CustomerID"  : CustomerID,
      "BranchID"    : BranchID,
      "AgreementNo" : AgreementNo,
      "NoTelp"      : NoTelp,
      "Email"       : Email,
      "PIC"         : PIC,
      "data"        : submitAnswer
    }
    // var urlPOST = bfiCore+"RestNet/api/SRS/v1/PostSEC/Ekreasi/EKreasiSRS2018/SRS"


    Common.timeout('submit SEC','Perhatian','Menyimpan data SEC :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      submitdata = {action:"PostSEC", data:submitdata}
      $http(httpPostOptionBfiSrs(MobileSRSCoreAction, submitdata))
      .success(function(res) {

        clearTimeout(timeoutvar);
        $ionicLoading.hide();
        if(res.Status==200){
          $ionicPlatform.onHardwareBackButton(function() {
            // $state.go('app.index', { url: '/index' });
          });
          location.href = "#/app/sec-7";
          localStorage.removeItem("SECQ");
        }else{
          $ionicPopup.alert({
            title: 'Notice',
            cssClass  : 'alertCustom',
            template: res!="" && res!=null ? res.Data.header.errors[0].message:"Terdapat kesalahan, tidak dapat mengirim data ke server [2]",
            okType  : 'button-custom-ok'
          });
        }
      })
      .error(function(err,status, headers, config) {
          console.log("error : ");

          clearTimeout(timeoutvar);
          $ionicLoading.hide();

          if(error != null){
            console.log(error.header.errors[0].code);
            if(error.header.errors[0].code == "409"){
              $ionicPopup.alert({
                title   : 'Perhatian',
                cssClass  : 'alertCustom',
                template: res.header.errors[0].message,
                okType  : 'button-custom-ok'
              });

              $state.go('app.sec', { url: '/sec' });
              var objectAnswer = localStorage.removeItem("SECQ");
            }else{
              // $state.go('app.sec', { url: '/sec' });
              // $ionicPopup.alert({
              //   title: 'Notice',
              //   cssClass  : 'alertCustom',
              //   // template: 'Server Tidak Merespon [Timeout] permintaan aplikasi, Pesan Error : '+err.header.errors[0].cause,
              //   template: 'Terdapat kesalahan, tidak dapat mengirim data ke server [2] :: '+error.header.errors[0].code,
              //   okType  : 'button-custom-ok'
              // });
              $PopupUnauthorizedJwt.show(err,status, headers, config);
            }
          }else{
            // $ionicPopup.alert({
            //   title: 'Notice',
            //   cssClass  : 'alertCustom',
            //   template: 'Terdapat kesalahan, tidak dapat mengirim data ke server [2]',
            //   okType  : 'button-custom-ok'
            // });
            $PopupUnauthorizedJwt.show(err,status, headers, config);
          }

      });

    });


  }

  function showAlert(questNum){
    $ionicPopup.alert({
      title   : 'Perhatian',
      cssClass  : 'alertCustom',
      template: "anda belum mengisi pertanyaan nomor "+questNum,
      okType  : 'button-custom-ok'
    });
  }

})

.controller('SEC5Ctrl', function ($PopupUnauthorizedJwt, $scope, $http, $q , $state, $stateParams, $timeout , $ionicPopup, $ionicHistory, $ionicPlatform, $ionicLoading , $ionicModal , $filter, Api, Common) {
  $scope.$on("$ionicView.beforeEnter", function(event, data){
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });
  });
  getQuestion();
  function getQuestion(){
    $scope.loadingImage = true;

    Common.timeout('get SEC Question','Perhatian','Mengambil Pertanyaan SEC :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      // $http.get( bfiCore+'RestNet/api/SRS/v1/getSECForm/Ekreasi/EKreasiSRS2018/SRS').success(function(response){
      $http(httpGetOptionBfiSrs(MobileSRSCoreAction+'?action=getSECForm')).success(function(response){
        $scope.questionList     = [];
        var responseData        = response.data;

        for (var i = 0; i < responseData.length; i++) {
          var questNum    = (responseData[i].ID).substr(0,2);
          var idQuest     = "question"+parseInt(questNum);

          if(parseInt(questNum) >= 10){
            var questNum2    = (responseData[i].ID).substr(0,5);
          }else{
            var questNum2    = (responseData[i].ID).substr(0,4);
          }

          if(parseInt(questNum) > 5 && parseInt(questNum) < 9){
            if((responseData[i].ID).substr(1,2) == "" || (responseData[i].ID).substr(1,2) == "0"){
              $scope.questionList.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : "",
                "subquestionnumbercom": "",
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
            }else{
              questNum2 = questNum2.replace(".", "_");
              $scope.questionList.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
            }
          }
        }
        $scope.loadingImage = false;
        // console.log($scope.questionList);
        console.log("$scope.questionList ===========");
        console.log($scope.questionList);
        clearTimeout(timeoutvar);
      }).error(function(err,status, headers, config) {
            $ionicLoading.hide();
            clearTimeout(timeoutvar);
            $PopupUnauthorizedJwt.show(err,status, headers, config);
      });

    });

    Common.timeout('get SEC SubQuestion','Perhatian','Mengambil Sub Pertanyaan SEC :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      // $http.get( bfiCore+'RestNet/api/SRS/v1/getSECFormSubQuestion//Ekreasi/EKreasiSRS2018/SRS').success(function(response){
      $http(httpGetOptionBfiSrs(MobileSRSCoreAction+'?action=getSECFormSubQuestion')).success(function(response){
        console.log("SUBQUESTION");
        question2ListArr        = [];
        $scope.question2ListArrSub  = [];
        $scope.question2ListArrSubSub  = [];

        var responseData  = response.data;
        for (var i = 0; i < responseData.length; i++) {

          var questNum    = (responseData[i].ID).substr(0,2);

          if(parseInt(questNum) >= 10){
            var questNum2    = (responseData[i].ID).substr(0,7);
          }else{
            var questNum2    = (responseData[i].ID).substr(0,6);
          }

          var idQuest     = "question"+parseInt(questNum);
          var idValue     = parseInt((responseData[i].ID).substr(0,2));
          questNum2       = questNum2.replace(/\./g, "_");
          var quesID      = parseInt((responseData[i].ID).substr(0,2));
          var ansID       = "";
          var subAnsID    = "";
          var subSubAnsID = "";

          if(!isNaN(quesID) && angular.isNumber(quesID)){
            if(quesID >= 10){
              ansID     = parseInt((responseData[i].ID).substr(3,2));
            }else{
              ansID     = parseInt((responseData[i].ID).substr(2,2));
            }
          }else{
            ansID = 0;
          }

          if(!isNaN(ansID) && angular.isNumber(ansID)){
            if(ansID >= 10){
              subAnsID  = parseInt((responseData[i].ID).substr(5,2));

              if(!isNaN(subAnsID) && angular.isNumber(subAnsID)){
                subAnsID  = subAnsID;
              }else{
                subAnsID  = 0;
              }
            }else{
              subAnsID  = parseInt((responseData[i].ID).substr(4,2));
              if(!isNaN(subAnsID) && angular.isNumber(subAnsID)){
                subAnsID  = subAnsID;
              }else{
                subAnsID  = 0;
              }
            }
          }else{
            ansID = 0;
            subAnsID = 0;
          }

          if(subAnsID >= 10){

            var questChange = (responseData[i].ID).substr(0,9);
            questNum2       = questChange.replace(/\./g, "_");
            subSubAnsID  = parseInt((responseData[i].ID).substr(7,2));

            if(!isNaN(subSubAnsID) && angular.isNumber(subSubAnsID)){
              subSubAnsID     = subSubAnsID;
              // console.log("A >>>>>>>>>>>>>> ");
              // console.log(responseData[i].ID);
              $scope.question2ListArrSubSub.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "quesID"              : quesID+ansID+subAnsID,
                "ansID"               : ansID,
                "subAnsID"            : subAnsID,
                "subSubAnsID"         : subSubAnsID,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
              // console.log("NM none = "+nm);
            }else{
              subSubAnsID   = 0;
             // console.log("B >>>>>>>>>>>>>> ");
             // console.log(responseData[i].ID);
              $scope.question2ListArrSub.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "quesID"              : quesID+ansID+subAnsID,
                "ansID"               : ansID,
                "subAnsID"            : subAnsID,
                "subSubAnsID"         : subSubAnsID,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
            }

          }else{
            subSubAnsID  = parseInt((responseData[i].ID).substr(6,2));
            if(!isNaN(subSubAnsID) && angular.isNumber(subSubAnsID)){
              subSubAnsID   = subSubAnsID;
              $scope.question2ListArrSubSub.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "quesID"              : quesID+ansID+subAnsID,
                "ansID"               : ansID,
                "subAnsID"            : subAnsID,
                "subSubAnsID"         : subSubAnsID,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
            }else{
              // var newquestnum = (responseData[i].ID).substr(0,2);
              // if(parseInt(newquestnum) >= 10){
              //   var questNum22    = (responseData[i].ID).substr(0,7);
              // }else{
              //   var questNum22    = (responseData[i].ID).substr(0,6);
              // }
              // console.log(";;;;; "+questNum22);
              subSubAnsID   = 0;
              $scope.question2ListArrSub.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "quesID"              : quesID+ansID+subAnsID,
                "ansID"               : ansID,
                "subAnsID"            : subAnsID,
                "subSubAnsID"         : subSubAnsID,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              // var abc = questNum2.replace(/\./g, "_");
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
              console.log("NM none = "+nm);
            }
          }

          console.log("================================================");
          // console.log("ID =========== "+responseData[i].ID);
          // console.log("quesID ======= "+quesID);
          // console.log("ansID ======== "+ansID);
          // console.log("subAnsID ===== "+subAnsID);
          // console.log("subSubAnsID == "+subSubAnsID);

          question2ListArr.push({
            "questionnumber"      : idQuest,
            "subquestionnumber"   : questNum2,
            "subquestionnumbercom": questNum2,
            "quesID"              : quesID+ansID+subAnsID,
            "ansID"               : ansID,
            "subAnsID"            : subAnsID,
            "subSubAnsID"         : subSubAnsID,
            "ID"                  : responseData[i].ID,
            "Text"                : responseData[i].Text,
            "TypeAnswer"          : responseData[i].TypeAnswer
          });
          var quest   = responseData[i].ID.replace(/\./g, "_");
          var nm      = 'questionSub'+quest;
          $scope[nm]  = {
            'display': 'none'
          }

        }

        for (var i = 0; i < $scope.question2ListArrSubSub.length; i++) {
          var questChange = ($scope.question2ListArrSubSub[i].ID).substr(0,9);
          questNum2       = questChange.replace(/\./g, "_");

          var nm = 'questionSub'+questNum2;
          $scope[nm] = {
            'display': 'none'
          }
          // console.log("NM none = "+nm);
        }

        var sortByID  = question2ListArr.sort(function(a,b){ return a.quesID-b.quesID});
        $scope.question2List = sortByID;

        console.log("$scope.question2List ===========");
        // console.log($scope.question2List);
        console.log($scope.question2ListArrSub);
        console.log($scope.question2ListArrSubSub);
        clearTimeout(timeoutvar);
      }).error(function(err,status, headers, config) {
            $ionicLoading.hide();
            clearTimeout(timeoutvar);
            $PopupUnauthorizedJwt.show(err,status, headers, config);
      });

    });


  }

  $scope.loads = function(question,answer,type,quesnumber,subquesnum,arrques2,arrques1,subAnsID,subSubAnsID){
    // set answer =====================
    //===================================================================================
    // localStorage.setItem("SECQ_"+question,answer);
		var questionLength  = question.length - 2;
    var res1            = question.substr(question.length - 1);
    var res2            = question.substr(question.length - 2);

    if(isNaN(parseInt(res2))){
      var satuanBelakang= question.substr(0 , (question.length - 2));
    }else{
      var satuanBelakang= question.substr(0 , (question.length - 3));
    }

    var getDataStore    = localStorage.getItem("SECQ");
    var dataSoreObject  = JSON.parse(getDataStore);

    console.log("dataSoreObject AnswerID");
    console.log(dataSoreObject);
    console.log("satuanBelakang ==== "+satuanBelakang);

    var SECQ_Object = {
      "QuestionID"  : satuanBelakang,
      "AnswerID"    : question,
      "DetailAnswer": answer
    }

    if(dataSoreObject == undefined || dataSoreObject == null){
      var questionStore   = [];
      questionStore.push(SECQ_Object);
      localStorage.setItem( "SECQ" , JSON.stringify(questionStore) );
    }
    else{
      console.log("dataSoreObject DEFINED");
      if(dataSoreObject.length == 0){
        dataSoreObject.push(SECQ_Object);
        localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );

      }else{
        var filterSatuanBlkg = $filter('filter')(dataSoreObject, { QuestionID: satuanBelakang }, true)[0];
        if(type == "CB" || type == "QCB"){
          var filterSatuanQuest = $filter('filter')(dataSoreObject, { AnswerID: question }, true)[0];
          console.log("subquesnum ========== "+subquesnum);
          if(filterSatuanBlkg != undefined || filterSatuanBlkg != null){
            console.log("value CB udah ada");

            if(filterSatuanQuest != undefined || filterSatuanQuest != null){

              console.log("value CB filterSatuanQuest ada");
              if(subquesnum == true){
                console.log("value CB filterSatuanQuest ada && TRUE");

                // var efg      = $filter('filter')(dataSoreObject, { AnswerID: question }, true)[0];

                var index     = dataSoreObject.indexOf(filterSatuanQuest);
                dataSoreObject.splice(index, 1, SECQ_Object);
              }else{
                console.log("value CB filterSatuanQuest ada && FALSE");
                var index2    = dataSoreObject.indexOf(filterSatuanQuest);
                dataSoreObject.splice(index2, 1);
                console.log(filterSatuanQuest);
              }
            }else{
              console.log("value CB filterSatuanQuest tidak ada");

              if(subquesnum == true){
                dataSoreObject.push(SECQ_Object);
              }else{

              }
            }

          }else{
            console.log("value filterSatuanQuest nggak ada");
            var index     = dataSoreObject.indexOf(filterSatuanBlkg);
            // dataSoreObject.splice(index, 1);
            dataSoreObject.push(SECQ_Object);
          }

        }else{
          if(filterSatuanBlkg != undefined || filterSatuanBlkg != null){

            var removeQuestID = filterSatuanBlkg.AnswerID;
            var index     = dataSoreObject.indexOf(filterSatuanBlkg);
            dataSoreObject.splice(index, 1, SECQ_Object);
            console.log("removeQuestID :: "+removeQuestID);

            var removeValueIndex = [];
            for(var i = 0;i<dataSoreObject.length;i++){
              if(removeQuestID == dataSoreObject[i].QuestionID){
                // console.log("REMOVE THIS :: ");
                var getIndex  = dataSoreObject.indexOf(dataSoreObject[i]);
                removeValueIndex.push(getIndex);
                // dataSoreObject.splice(getIndex, 1);
              }
            }

            console.log(removeValueIndex);
            for(var i = 0;i<removeValueIndex.length;i++){
              console.log(removeValueIndex[i]);
              console.log(dataSoreObject);
              // dataSoreObject.splice( removeValueIndex[i] , 1);
              _.pullAt(dataSoreObject,removeValueIndex);
            }

          }else{
            console.log("filterSatuanBlkg NULL");
            dataSoreObject.push(SECQ_Object);

            if(satuanBelakang == "7"){
              var filterBawah = $filter('filter')(dataSoreObject, { AnswerID: "7.1.1" }, true)[0];
              console.log("filterBawah :: ")
              console.log(filterBawah)
              if(filterBawah != undefined || filterBawah != null){
                var indexz       = dataSoreObject.indexOf(filterBawah);
                dataSoreObject.splice( indexz, 1);
              }
            }

          }
        }
        localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );
      }
    }
    //=============

    for (var i = 0; i < arrques2.length; i++) {
      var idq   = arrques2[i].ID;
      //add by yacobus
      if (idq.substr(0,1)==question.substr(0,1) && idq.substr(0,3)!=question && question.length==3){
        if (arrques2[i].TypeAnswer=='CB'){
          var className = idq.replace(/\./g, "_");
         // document.getElementById("cb_" + className).checked =false;

        }
      }
      //
      if(question.substr(0,1) == idq.substr(0,1)){

        if(question == idq){
          var className = idq.replace(/\./g, "_");
          var nm = 'questionSub'+className;
          $scope[nm] = {
            'display': 'block',
          }
        }
        else{
          var className = idq.replace(/\./g, "_");
          var nm = 'questionSub'+className;
          if(question.substr(4,1) != ""){
            if(question.substr(0,3) == idq.substr(0,3)){
              // console.log("INIH == "+nm+" ANDDDD questionSub"+className);
              $scope[nm] = {
                'display': 'block'
              }

                var classStyleName = question.replace(/\./g, "_");
                var questStyle = "questionSub"+classStyleName;

                console.log(className.substr(7,1));
                if(className.substr(7,1) != ""){

                  if(nm != questStyle){
                    console.log("ini pas");
                    console.log(questStyle);
                    $scope[questStyle] = {
                      'display': 'block'
                    }
                  }else{
                    // console.log("ini nggak pas");
                    $scope[questStyle] = {
                      'display': 'none'
                    }
                  }

                }else{
                  console.log("hide == "+questStyle);
                  $scope[questStyle] = {
                    'display': 'block'
                  }
                }

            }else{
              console.log("ONOH == "+question.substr(4,1));
              $scope[nm] = {
                'display': 'none'
              }
            }
          }else{
            if(question.substr(0,3) == idq.substr(0,3)){
              console.log("show class == "+nm);
              if(question.substr(0,4) == idq.substr(0,4)){
                $scope[nm] = {
                  'display': 'block'
                }
              }else{
                var zzz = question.replace(/\./g, "_");
                idq     = idq.replace(/\./g, "_");
                zzz     = zzz.substr(0,4);
                  console.log("zzzzzzz    == "+zzz);
                  console.log("idq == "+idq);
                if(idq == zzz){
                  $scope[nm] = {
                    'display': 'none'
                  }
                }else{
                  $scope[nm] = {
                    'display': 'block'
                  }
                }
              }
            }else{
              console.log("hide class == "+nm);
              $scope[nm] = {
                'display': 'none'
              }
            }
          }
        }
      }
    }
  }

	$scope.loadsTextbox = function(question,answer,type,quesnumber,subquesnum,arrques,subAnsID,subSubAnsID){
    console.log("----------------------------------------");
    console.log("question   : "+question);
    console.log("answer     : "+answer);
    console.log("type       : "+type);
    console.log("quesnumber : "+quesnumber);
    console.log("subquesnum : "+subquesnum);
    // console.log("arrques : "+arrques);
    console.log("-----------------------------");

    //===================================================================================
    // localStorage.setItem("SECQ_"+question,answer);

    var questionLength  = question.length - 2;
    var res1            = question.substr(question.length - 1);
    var res2            = question.substr(question.length - 2);

    if(isNaN(parseInt(res2))){
      var satuanBelakang= question.substr(0 , (question.length - 2));
    }else{
      var satuanBelakang= question.substr(0 , (question.length - 3));
    }

    var getDataStore    = localStorage.getItem("SECQ");
    var dataSoreObject  = JSON.parse(getDataStore);

    console.log("dataSoreObject AnswerID");
    console.log(dataSoreObject);
    console.log("satuanBelakang =========== "+satuanBelakang);
    var detailAnswer = $scope[subquesnum];
    console.log("----------------- detailAnswer --------------");
    console.log(subquesnum);

    var SECQ_Object = {
      "QuestionID"  : satuanBelakang.substr(0,3),
      "AnswerID"    : satuanBelakang,
      "DetailAnswer": subquesnum
    }

    if(dataSoreObject == undefined || dataSoreObject == null){
      var questionStore   = [];
      questionStore.push(SECQ_Object);
      localStorage.setItem( "SECQ" , JSON.stringify(questionStore) );
    }
    else{
      // console.log("dataSoreObject DEFINED");
      // if(dataSoreObject.length == 0){
      //  dataSoreObject.push(SECQ_Object);
      // localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );

      // }else{
      //  var abc = $filter('filter')(dataSoreObject, { QuestionID: satuanBelakang }, true)[0];
      //  if(abc != undefined || abc != null){

      //    console.log("ABC TIDAK NULL");
      //    console.log(abc);
      //    var index     = dataSoreObject.indexOf(abc);
      //    dataSoreObject.splice(index, 1, SECQ_Object);
      //  }else{
      //    console.log("ABC NULL");
      //    dataSoreObject.push(SECQ_Object);
      //  }
      //  localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );
      // }
      // ======================
      var abc = $filter('filter')(dataSoreObject, { QuestionID: satuanBelakang }, true)[0];
      // if(type == "CB"){
      console.log("subquesnum ========== "+subquesnum);
      console.log(satuanBelakang);
      if(abc != undefined || abc != null){
        var cde = $filter('filter')(dataSoreObject, { AnswerID: question }, true)[0];
        console.log(question);
        console.log("nn1");

        if(cde != undefined || cde != null){
          console.log("nn2");

          if(subquesnum == true){
            console.log("nn3");
            var index     = dataSoreObject.indexOf(cde);
            dataSoreObject.splice(index, 1, SECQ_Object);
          }else{
            console.log("nn4");
            console.log(satuanBelakang);
            console.log(question);
            var SECQ_Object = {
              "QuestionID"  : satuanBelakang,
              "AnswerID"    : question,
              "DetailAnswer": subquesnum
            }
            console.log(cde);
            var index     = dataSoreObject.indexOf(abc);
            dataSoreObject.splice(index, 1, SECQ_Object);
          }
        }else{
          console.log("nn5");
          var SECQ_Object = {
            "QuestionID"  : satuanBelakang,
            "AnswerID"    : question,
            "DetailAnswer": subquesnum
          }
          if(subquesnum == true){
            console.log("nn6");
            dataSoreObject.push(SECQ_Object);
          }else{
            console.log("nn7");
            console.log(abc);
            dataSoreObject.push(SECQ_Object);
          }
        }

      }else{
        var SECQ_Object = {
            "QuestionID"  : satuanBelakang,
            "AnswerID"    : question,
            "DetailAnswer": subquesnum
          }
        console.log("value CB nggak ada");
        var index     = dataSoreObject.indexOf(abc);
        dataSoreObject.splice(index, 1);
        dataSoreObject.push(SECQ_Object);
      }

      localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );
    }
  }

	$scope.doNext = function () {

    var SECQ_6 = getDataStatus(6);
		var SECQ_7 = getDataStatus(7);
		var SECQ_8 = getDataStatus(8);

		console.log("SECQ");
		console.log(SECQ_6);
		console.log(SECQ_7);
		console.log(SECQ_8);

		if(SECQ_6 == undefined){
			showAlert("6");
		}else if(SECQ_7 == undefined){
			showAlert("7");
		}else if(SECQ_8 == undefined){
			showAlert("8");
		}else{
			location.href = "#/app/sec-6";
		}

  }

	function getDataStatus(value){
			var result;
      var SECQ = JSON.parse(localStorage.getItem("SECQ"));
			if(SECQ != null){

				for (var i = 0; i < SECQ.length; i++) {
					var idQuestion = SECQ[i].QuestionID;
				 	// console.log(idQuestion.substr(0,1)+" COMPARE "+value);
					if(idQuestion.substr(0,1) ==	 value){
							console.log(idQuestion.substr(0,1)+" SAMA "+value);

							result = true;
							break;
					}
				}
			}
			return result;

	}

  function showAlert(questNum){
    $ionicPopup.alert({
      title   : 'Perhatian',
      cssClass  : 'alertCustom',
      template: "anda belum mengisi pertanyaan nomor "+questNum,
      okType  : 'button-custom-ok'
    });
  }
  setDefaultValues();
  function setDefaultValues(){

    $timeout(function () {

    }, 5000);

  };

})

.controller('SEC6Ctrl', function ($PopupUnauthorizedJwt, $scope, $q, $http, $state, $stateParams, $ionicPopup, $ionicHistory, $ionicPlatform, $ionicLoading , $filter , $ionicModal, Api, Common) {

  $scope.$on("$ionicView.beforeEnter", function(event, data){
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });
  });
  getQuestion();
  function getQuestion(){
    $scope.loadingImage = true;


    Common.timeout('get SEC Question','Perhatian','Mengambil Pertanyaan SEC :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      // $http.get( bfiCore+'RestNet/api/SRS/v1/getSECForm/Ekreasi/EKreasiSRS2018/SRS').success(function(response){
      $http(httpGetOptionBfiSrs(MobileSRSCoreAction+'?action=getSECForm')).success(function(response){
        // console.log(response.data);
        $scope.questionList     = [];
        // $scope.questionList     = response.data;
        // var responseData  = response.data.slice(0,5);
        var responseData  = response.data;

        // console.log(responseData);
        for (var i = 0; i < responseData.length; i++) {
          var questNum    = (responseData[i].ID).substr(0,2);
          // var questNum2    = (responseData[i].ID).substr(0,4);

          var idQuest     = "question"+parseInt(questNum);

          if(parseInt(questNum) >= 10){
            var questNum2    = (responseData[i].ID).substr(0,5);
          }else{
            var questNum2    = (responseData[i].ID).substr(0,4);
          }

          var idValue     = parseInt((responseData[i].ID).substr(0,2)) ;

          if(idValue > 8){
            if((responseData[i].ID).substr(1,2) == "" || (responseData[i].ID).substr(1,2) == "0"){
              $scope.questionList.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : "",
                "subquestionnumbercom": "",
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
            }else{
              questNum2 = questNum2.replace(".", "_");
              $scope.questionList.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
            }
          }
        }
        $scope.loadingImage = false;
        // console.log($scope.questionList);
        console.log("$scope.questionList ===========");
        console.log($scope.questionList);
        clearTimeout(timeoutvar);
      }).error(function(err,status, headers, config) {
          $ionicLoading.hide();
          clearTimeout(timeoutvar);
          $PopupUnauthorizedJwt.show(err,status, headers, config);
      });

    });

    Common.timeout('get SEC SubQuestion','Perhatian','Mengambil Sub Pertanyaan SEC :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      // $http.get( bfiCore+'RestNet/api/SRS/v1/getSECFormSubQuestion/Ekreasi/EKreasiSRS2018/SRS').success(function(response){
      $http(httpGetOptionBfiSrs(MobileSRSCoreAction+'?action=getSECFormSubQuestion')).success(function(response){
        console.log("SUBQUESTION");
        question2ListArr        = [];
        $scope.question2ListArrSub  = [];
        $scope.question2ListArrSubSub  = [];

        var responseData  = response.data;
        for (var i = 0; i < responseData.length; i++) {

          var questNum    = (responseData[i].ID).substr(0,2);

          if(parseInt(questNum) >= 10){
            var questNum2    = (responseData[i].ID).substr(0,7);
          }else{
            var questNum2    = (responseData[i].ID).substr(0,6);
          }

          var idQuest     = "question"+parseInt(questNum);
          var idValue     = parseInt((responseData[i].ID).substr(0,2));
          questNum2       = questNum2.replace(/\./g, "_");
          var quesID      = parseInt((responseData[i].ID).substr(0,2));
          var ansID       = "";
          var subAnsID    = "";
          var subSubAnsID = "";

          if(!isNaN(quesID) && angular.isNumber(quesID)){
            if(quesID >= 10){
              ansID     = parseInt((responseData[i].ID).substr(3,2));
            }else{
              ansID     = parseInt((responseData[i].ID).substr(2,2));
            }
          }else{
            ansID = 0;
          }

          if(!isNaN(ansID) && angular.isNumber(ansID)){
            if(ansID >= 10){
              subAnsID  = parseInt((responseData[i].ID).substr(5,2));

              if(!isNaN(subAnsID) && angular.isNumber(subAnsID)){
                subAnsID  = subAnsID;
              }else{
                subAnsID  = 0;
              }
            }else{
              subAnsID  = parseInt((responseData[i].ID).substr(4,2));
              if(!isNaN(subAnsID) && angular.isNumber(subAnsID)){
                subAnsID  = subAnsID;
              }else{
                subAnsID  = 0;
              }
            }
          }else{
            ansID = 0;
            subAnsID = 0;
          }

          if(subAnsID >= 10){

            var questChange = (responseData[i].ID).substr(0,9);
            questNum2       = questChange.replace(/\./g, "_");
            subSubAnsID  = parseInt((responseData[i].ID).substr(7,2));

            if(!isNaN(subSubAnsID) && angular.isNumber(subSubAnsID)){
              subSubAnsID     = subSubAnsID;
              // console.log("A >>>>>>>>>>>>>> ");
              // console.log(responseData[i].ID);
              $scope.question2ListArrSubSub.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "quesID"              : quesID+ansID+subAnsID,
                "ansID"               : ansID,
                "subAnsID"            : subAnsID,
                "subSubAnsID"         : subSubAnsID,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
              // console.log("NM none = "+nm);
            }else{
              subSubAnsID   = 0;
             // console.log("B >>>>>>>>>>>>>> ");
             // console.log(responseData[i].ID);
              $scope.question2ListArrSub.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "quesID"              : quesID+ansID+subAnsID,
                "ansID"               : ansID,
                "subAnsID"            : subAnsID,
                "subSubAnsID"         : subSubAnsID,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
            }

          }else{
            subSubAnsID  = parseInt((responseData[i].ID).substr(6,2));
            if(!isNaN(subSubAnsID) && angular.isNumber(subSubAnsID)){
              subSubAnsID   = subSubAnsID;
              $scope.question2ListArrSubSub.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "quesID"              : quesID+ansID+subAnsID,
                "ansID"               : ansID,
                "subAnsID"            : subAnsID,
                "subSubAnsID"         : subSubAnsID,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
            }else{
              // var newquestnum = (responseData[i].ID).substr(0,2);
              // if(parseInt(newquestnum) >= 10){
              //   var questNum22    = (responseData[i].ID).substr(0,7);
              // }else{
              //   var questNum22    = (responseData[i].ID).substr(0,6);
              // }
              // console.log(";;;;; "+questNum22);
              subSubAnsID   = 0;
              $scope.question2ListArrSub.push({
                "questionnumber"      : idQuest,
                "subquestionnumber"   : questNum2,
                "subquestionnumbercom": questNum2,
                "quesID"              : quesID+ansID+subAnsID,
                "ansID"               : ansID,
                "subAnsID"            : subAnsID,
                "subSubAnsID"         : subSubAnsID,
                "ID"                  : responseData[i].ID,
                "Text"                : responseData[i].Text,
                "TypeAnswer"          : responseData[i].TypeAnswer
              });
              // var abc = questNum2.replace(/\./g, "_");
              var nm = 'questionSub'+questNum2;
              $scope[nm] = {
                'display': 'none'
              }
              console.log("NM none = "+nm);
            }
          }

          console.log("================================================");
          // console.log("ID =========== "+responseData[i].ID);
          // console.log("quesID ======= "+quesID);
          // console.log("ansID ======== "+ansID);
          // console.log("subAnsID ===== "+subAnsID);
          // console.log("subSubAnsID == "+subSubAnsID);

          question2ListArr.push({
            "questionnumber"      : idQuest,
            "subquestionnumber"   : questNum2,
            "subquestionnumbercom": questNum2,
            "quesID"              : quesID+ansID+subAnsID,
            "ansID"               : ansID,
            "subAnsID"            : subAnsID,
            "subSubAnsID"         : subSubAnsID,
            "ID"                  : responseData[i].ID,
            "Text"                : responseData[i].Text,
            "TypeAnswer"          : responseData[i].TypeAnswer
          });
          var quest   = responseData[i].ID.replace(/\./g, "_");
          var nm      = 'questionSub'+quest;
          $scope[nm]  = {
            'display': 'none'
          }

        }

        for (var i = 0; i < $scope.question2ListArrSubSub.length; i++) {
          var questChange = ($scope.question2ListArrSubSub[i].ID).substr(0,9);
          questNum2       = questChange.replace(/\./g, "_");

          var nm = 'questionSub'+questNum2;
          $scope[nm] = {
            'display': 'none'
          }
          // console.log("NM none = "+nm);
        }

        var sortByID  = question2ListArr.sort(function(a,b){ return a.quesID-b.quesID});
        $scope.question2List = sortByID;

        console.log("$scope.question2List ===========");
        // console.log($scope.question2List);
        console.log($scope.question2ListArrSub);
        console.log($scope.question2ListArrSubSub);
        clearTimeout(timeoutvar);
      }).error(function(err,status, headers, config) {
          $ionicLoading.hide();
          clearTimeout(timeoutvar);
          $PopupUnauthorizedJwt.show(err,status, headers, config);
      });

    });

  }

  $scope.loads = function(question,answer,type,quesnumber,subquesnum,arrques,subAnsID,subSubAnsID){
    console.log("----------------------------------------");
    console.log("question : "+question);
    console.log("answer : "+answer);
    console.log("type : "+type);
    console.log("quesnumber : "+quesnumber);
    console.log("subquesnum : "+subquesnum);
    // console.log("arrques : "+arrques);
    console.log("-----------------------------");

    // localStorage.setItem("SECQ_"+question,answer);var questionLength 	= question.length - 2;
    var res1 						= question.substr(question.length - 1);
    var res2 						= question.substr(question.length - 2);

		if(isNaN(parseInt(res2))){
			var satuanBelakang= question.substr(0 , (question.length - 2));
		}else{
			var satuanBelakang= question.substr(0 , (question.length - 3));
		}

		var getDataStore 		= localStorage.getItem("SECQ");
		var dataSoreObject 	= JSON.parse(getDataStore);

		console.log("dataSoreObject AnswerID");
		console.log(dataSoreObject);
		console.log("satuanBelakang =========== "+satuanBelakang);

		var SECQ_Object = {
			"QuestionID"  : satuanBelakang,
			"AnswerID"    : question,
			"DetailAnswer": answer
		}

		if(dataSoreObject == undefined || dataSoreObject == null){
			var questionStore 	= [];
			questionStore.push(SECQ_Object);
    	localStorage.setItem( "SECQ" , JSON.stringify(questionStore) );
		}
		else{
			console.log("dataSoreObject DEFINED");
			if(dataSoreObject.length == 0){
				dataSoreObject.push(SECQ_Object);
    		localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );

			}else{
				var filterSatuanBlkg = $filter('filter')(dataSoreObject, { QuestionID: satuanBelakang }, true)[0];
				if(type == "CB" || type == "QCB"){
					var filterSatuanQuest = $filter('filter')(dataSoreObject, { AnswerID: question }, true)[0];
					console.log("subquesnum ========== "+subquesnum);
					if(filterSatuanBlkg != undefined || filterSatuanBlkg != null){
						console.log("value CB udah ada");

						if(filterSatuanQuest != undefined || filterSatuanQuest != null){

							console.log("value CB filterSatuanQuest ada");
							if(subquesnum == true){
								console.log("value CB filterSatuanQuest ada && TRUE");

								// var efg 			= $filter('filter')(dataSoreObject, { AnswerID: question }, true)[0];

								var index 		= dataSoreObject.indexOf(filterSatuanQuest);
								dataSoreObject.splice(index, 1, SECQ_Object);
							}else{
								console.log("value CB filterSatuanQuest ada && FALSE");
                var index2 		= dataSoreObject.indexOf(filterSatuanQuest);
                dataSoreObject.splice(index2, 1);
                console.log(filterSatuanQuest);
							}
						}else{
							console.log("value CB filterSatuanQuest tidak ada");

							if(subquesnum == true){
								dataSoreObject.push(SECQ_Object);
							}else{

							}
						}

					}else{
						console.log("value filterSatuanQuest nggak ada");
						var index 		= dataSoreObject.indexOf(filterSatuanBlkg);
						// dataSoreObject.splice(index, 1);
						dataSoreObject.push(SECQ_Object);
					}

				}else{
					if(filterSatuanBlkg != undefined || filterSatuanBlkg != null){

            var removeQuestID = filterSatuanBlkg.AnswerID;
            var index     = dataSoreObject.indexOf(filterSatuanBlkg);
            dataSoreObject.splice(index, 1, SECQ_Object);
            console.log("removeQuestID :: "+removeQuestID);

            var removeValueIndex = [];
            for(var i = 0;i<dataSoreObject.length;i++){
              if(removeQuestID == dataSoreObject[i].QuestionID){
                // console.log("REMOVE THIS :: ");
                var getIndex  = dataSoreObject.indexOf(dataSoreObject[i]);
                removeValueIndex.push(getIndex);
                // dataSoreObject.splice(getIndex, 1);
              }
            }

            console.log(removeValueIndex);
            for(var i = 0;i<removeValueIndex.length;i++){
              console.log(removeValueIndex[i]);
              console.log(dataSoreObject);
              // dataSoreObject.splice( removeValueIndex[i] , 1);
              _.pullAt(dataSoreObject,removeValueIndex);
            }

          }else{

            // console.log("filterSatuanBlkg NULL");
            dataSoreObject.push(SECQ_Object);
            console.log(satuanBelakang);

            var filterBawah = $filter('filter')(dataSoreObject, { QuestionID: "10.6" }, true)[0];
            console.log("filterBawah :: "+filterBawah)
            if(filterBawah != undefined || filterBawah != null){
              var indexz       = dataSoreObject.indexOf(filterBawah);
              dataSoreObject.splice( indexz, 1);
            }
          }
				}
				localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );
			}
		}
    //=============

    for (var i = 0; i < arrques.length; i++) {
      var idq   = arrques[i].ID;
      //add by yacobus
      if (idq.substr(0,1)==question.substr(0,1) && idq.substr(0,3)!=question && question.length==3){
        if (arrques[i].TypeAnswer=='CB'){
          var className = idq.replace(/\./g, "_");
         // document.getElementById("cb_" + className).checked =false;

        }
      }
      //
      if(question.substr(0,1) == idq.substr(0,1)){

        if(question == idq){
          var className = idq.replace(/\./g, "_");
          var nm = 'questionSub'+className;
          $scope[nm] = {
            'display': 'block',
          }
        }
        else{
          var className = idq.replace(/\./g, "_");
          var nm = 'questionSub'+className;
          if(question.substr(4,1) != ""){
            if(question.substr(0,3) == idq.substr(0,3)){
              // console.log("INIH == "+nm+" ANDDDD questionSub"+className);
              $scope[nm] = {
                'display': 'block'
              }

                var classStyleName = question.replace(/\./g, "_");
                var questStyle = "questionSub"+classStyleName;

                console.log(className.substr(7,1));
                if(className.substr(7,1) != ""){

                  if(nm != questStyle){
                    console.log("ini pas");
                    console.log(questStyle);
                    $scope[questStyle] = {
                      'display': 'block'
                    }
                  }else{
                    // console.log("ini nggak pas");
                    $scope[questStyle] = {
                      'display': 'none'
                    }
                  }

                }else{
                  console.log("hide == "+questStyle);
                  $scope[questStyle] = {
                    'display': 'block'
                  }
                }

            }else{
              console.log("ONOH == "+question.substr(4,1));
              $scope[nm] = {
                'display': 'none'
              }
            }
          }else{
            if(question.substr(0,3) == idq.substr(0,3)){
              console.log("show class == "+nm);
              if(question.substr(0,4) == idq.substr(0,4)){
                $scope[nm] = {
                  'display': 'block'
                }
              }else{
                var zzz = question.replace(/\./g, "_");
                idq     = idq.replace(/\./g, "_");
                zzz     = zzz.substr(0,4);
                  console.log("zzz == "+zzz);
                  console.log("idq == "+idq);
								if(type != "QRB" || type != "QCB"){
									$scope[nm] = {
                    'display': 'none'
                  }
								}else{

									if(idq == zzz){
										$scope[nm] = {
											'display': 'none'
										}
									}else{
										$scope[nm] = {
											'display': 'block'
										}
									}
								}

                // $scope[nm] = {
                //   'display': 'block'
                // }
              }
            }else{
              console.log("hide class == "+nm);
              $scope[nm] = {
                'display': 'none'
              }
            }
          }
        }
      }
    }
  }

	$scope.loadsTextbox = function(question,answer,type,quesnumber,subquesnum,arrques,subAnsID,subSubAnsID){
    console.log("----------------------------------------");
    console.log("question 	: "+question);
    console.log("answer 		: "+answer);
    console.log("type 			: "+type);
    console.log("quesnumber : "+quesnumber);
    console.log("subquesnum : "+subquesnum);
    // console.log("arrques : "+arrques);
    console.log("-----------------------------");

		//===================================================================================
    // localStorage.setItem("SECQ_"+question,answer);

		var questionLength 	= question.length - 2;
    var res1 						= question.substr(question.length - 1);
    var res2 						= question.substr(question.length - 2);

		if(isNaN(parseInt(res2))){
			var satuanBelakang= question.substr(0 , (question.length - 2));
		}else{
			var satuanBelakang= question.substr(0 , (question.length - 3));
		}

		var getDataStore 		= localStorage.getItem("SECQ");
		var dataSoreObject 	= JSON.parse(getDataStore);

		console.log("dataSoreObject AnswerID");
		console.log(dataSoreObject);
		console.log("satuanBelakang =========== "+satuanBelakang);
		var detailAnswer = $scope[subquesnum];
		console.log("----------------- detailAnswer --------------");
		console.log(subquesnum);

		var SECQ_Object = {
			"QuestionID"  : satuanBelakang.substr(0,3),
			"AnswerID"    : satuanBelakang,
			"DetailAnswer": subquesnum
		}

		if(dataSoreObject == undefined || dataSoreObject == null){
			var questionStore 	= [];
			questionStore.push(SECQ_Object);
    	localStorage.setItem( "SECQ" , JSON.stringify(questionStore) );
		}
		else{
			// console.log("dataSoreObject DEFINED");
			// if(dataSoreObject.length == 0){
			// 	dataSoreObject.push(SECQ_Object);
   		// localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );

			// }else{
			// 	var abc = $filter('filter')(dataSoreObject, { QuestionID: satuanBelakang }, true)[0];
			// 	if(abc != undefined || abc != null){

			// 		console.log("ABC TIDAK NULL");
			// 		console.log(abc);
			// 		var index 		= dataSoreObject.indexOf(abc);
			// 		dataSoreObject.splice(index, 1, SECQ_Object);
			// 	}else{
			// 		console.log("ABC NULL");
			// 		dataSoreObject.push(SECQ_Object);
			// 	}
			// 	localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );
			// }
      // ======================
			var abc = $filter('filter')(dataSoreObject, { QuestionID: satuanBelakang }, true)[0];
			// if(type == "CB"){
			console.log("subquesnum ========== "+subquesnum);
			console.log(satuanBelakang);
			if(abc != undefined || abc != null){
				var cde = $filter('filter')(dataSoreObject, { AnswerID: question }, true)[0];
				console.log(question);
				console.log("nn1");

				if(cde != undefined || cde != null){
					console.log("nn2");

					if(subquesnum == true){
						console.log("nn3");
						var index 		= dataSoreObject.indexOf(cde);
						dataSoreObject.splice(index, 1, SECQ_Object);
					}else{
            console.log("nn4");
            console.log(satuanBelakang);
            console.log(question);
						var SECQ_Object = {
							"QuestionID"  : satuanBelakang,
							"AnswerID"    : question,
							"DetailAnswer": subquesnum
						}
            console.log(cde);
						var index 		= dataSoreObject.indexOf(abc);
						dataSoreObject.splice(index, 1, SECQ_Object);
					}
				}else{
					console.log("nn5");
					var SECQ_Object = {
						"QuestionID"  : satuanBelakang,
						"AnswerID"    : question,
						"DetailAnswer": subquesnum
					}
					if(subquesnum == true){
						console.log("nn6");
						dataSoreObject.push(SECQ_Object);
					}else{
						console.log("nn7");
						console.log(abc);
						dataSoreObject.push(SECQ_Object);
					}
				}

			}else{
				var SECQ_Object = {
						"QuestionID"  : satuanBelakang,
						"AnswerID"    : question,
						"DetailAnswer": subquesnum
					}
				console.log("value CB nggak ada");
				var index 		= dataSoreObject.indexOf(abc);
				dataSoreObject.splice(index, 1);
				dataSoreObject.push(SECQ_Object);
			}

			localStorage.setItem( "SECQ" , JSON.stringify(dataSoreObject) );
		}
	}

  $scope.doNext = function () {

		var SECQ_9 = getDataStatus(9);
		var SECQ_10 = getDataStatus(10);

		console.log("SECQ");
		console.log(SECQ_9);
		console.log(SECQ_10);

		if(SECQ_9 == undefined){
			showAlert("9");
		}else if(SECQ_10 == undefined){
			showAlert("10");
		}else{

    	var submitAnswerArr  = localStorage.getItem("SECQ");
			submitSEC(submitAnswerArr);
	    // $ionicHistory.nextViewOptions({
	    //     disableBack: true
	    // });

    }

  }

	function getDataStatus(value){
			var result;
      var SECQ = JSON.parse(localStorage.getItem("SECQ"));

			if(SECQ != null){
				for (var i = 0; i < SECQ.length; i++) {
					var idQuestion = SECQ[i].QuestionID;
				 	// console.log(idQuestion.substr(0,1)+" COMPARE "+value);
					// console.log(idQuestion+" >>>>>>> "+idQuestion.substr(1,1));
					if(idQuestion.substr(1,1) != '0'){
						if(idQuestion.substr(0,1) ==	 value){
								console.log(idQuestion.substr(0,2)+" SAMA "+value);

								result = true;
								break;
						}
					}else{
						if(idQuestion.substr(0,2) ==	 value){
								console.log(idQuestion.substr(0,1)+" SAMA "+value);

								result = true;
								break;
						}
					}
				}
			}
			return result;
	}

  function uniques(arr) {
    return arr.filter(function (element, index, arr) {
        return arr.indexOf(element) === index;
    }).sort(function (a, b) {
        return a - b;
    });
  }

  function submitSEC(submitAnswer,questCollect){
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });
    console.log("submitSEC");
    var CustomerID  = localStorage.getItem("CustomerID");
    var BranchID    = localStorage.getItem("BranchID");
    var AgreementNo = localStorage.getItem("ContractNo");
		var NoTelp      = localStorage.getItem("mobileNo");
    var Email       = localStorage.getItem("Email");
    var PIC         = localStorage.getItem("userEmployeeID");
    var BranchID    = localStorage.getItem("BranchID");

    var NoTelp      = NoTelp;
    submitdata = {
    //  "action"      : "do-submit-sec-answer",
      "CustomerID"  : CustomerID,
      "BranchID"    : BranchID,
      "AgreementNo" : AgreementNo,
      "NoTelp"      : NoTelp,
      "Email"       : Email,
      "PIC"         : PIC,
      "data"        : JSON.parse(submitAnswer)
    }
    // var urlPOST = bfiCore+"RestNet/api/SRS/v1/PostSEC/Ekreasi/EKreasiSRS2018/SRS"


    Common.timeout('submit sec question','Perhatian','Menyimpan Data SEC :: Server Tidak Merespon [Timeout]',20000).then(function(timeoutvar){

      submitdata = {action:"PostSEC", data:submitdata}
      $http(httpPostOptionBfiSrs(MobileSRSCoreAction, submitdata))
        .success(function(res) {
          var objectAnswer = localStorage.removeItem("SECQ");
          console.log("....................>>>>>>>>>>>>>>");
          console.log(res);
          clearTimeout(timeoutvar);
          $ionicLoading.hide();

          if(res.Status==200){
            $ionicPlatform.onHardwareBackButton(function() {
              $state.go('app.index', { url: '/index' });
            });
            location.href = "#/app/sec-7";
          }else{
            $ionicPopup.alert({
              title: 'Notice',
              cssClass  : 'alertCustom',
              template: res!="" && res!=null ? res.Data.header.errors[0].message:"Terdapat kesalahan, tidak dapat mengirim data ke server [2]",
              okType  : 'button-custom-ok'
            });
          }

      }).error(function(err,status, headers, config) {
          // var objectAnswer = localStorage.removeItem("SECQ");

          console.log("error : ");
          clearTimeout(timeoutvar);
          $ionicLoading.hide();

          if(error != null){
            console.log(error.header.errors[0].code);
            if(error.header.errors[0].code == "409"){
              $ionicPopup.alert({
                title   : 'Perhatian',
                cssClass  : 'alertCustom',
                template: "Kontrak ini sudah pernah disurvey",
                okType  : 'button-custom-ok'
              });
              $state.go('app.sec', { url: '/sec' });
            }else{
              $PopupUnauthorizedJwt.show(err,status, headers, config);
              // $state.go('app.sec', { url: '/sec' });
              // $ionicPopup.alert({
              //   title: 'Notice',
              //   cssClass  : 'alertCustom',
              //   // template: 'Server Tidak Merespon [Timeout] permintaan aplikasi, Pesan Error : '+err.header.errors[0].cause,
              //   template: 'Terdapat kesalahan, tidak dapat mengirim data ke server :: '+error.header.errors[0].code,
              //   okType  : 'button-custom-ok'
              // });
            }
          }else{
            $PopupUnauthorizedJwt.show(err,status, headers, config);
            // $ionicPopup.alert({
            //   title: 'Notice',
            //   cssClass  : 'alertCustom',
            //   template: 'Terdapat kesalahan, tidak dapat mengirim data ke server',
            //   okType  : 'button-custom-ok'
            // });
          }
      });

    });

  }

  function showAlert(questNum){
    $ionicPopup.alert({
      title   : 'Perhatian',
      cssClass  : 'alertCustom',
      template: "anda belum mengisi pertanyaan nomor "+questNum,
      okType  : 'button-custom-ok'
    });
  }

})

.controller('SEC7Ctrl', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicHistory, $ionicPlatform, $ionicLoading, $ionicModal, Api, Common) {
  // $ionicLoading.show({
  //     template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
  // });
  $scope.endSRS = function () {

    // $ionicLoading.show({
    //     template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    // });

    $ionicHistory.nextViewOptions({
        disableBack: true
    });

   //  $ionicPlatform.onHardwareBackButton(function() {
   //  	location.href = "#/app/";
	  // });
    location.href = "#/app/";
  }

})

.controller('SimulasiKredit1Ctrl', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicHistory, $ionicModal, Api, Common) {

  $scope.doNext = function () {
    location.href = "#/app/simulasikredit2";
  }

  $scope.doSelanjutnya = function () {
    location.href = "#/app/";
  }

})

.controller('PesanCtrl', function($q, $rootScope, $timeout, $scope, $http, $state, $window, $stateParams, $ionicPopup, $ionicHistory, $ionicLoading, $interval, $ionicActionSheet, Api, Common) {
  $scope.$on("$ionicView.beforeEnter", function(event, data){

    $scope.userInit = $window.localStorage.getItem("userEmployeeID");
    var hasilResult;
    $scope.inbox    = {};
    var userId  = $window.localStorage.getItem("userId");
    var CUSTOMER    = $window.localStorage.getItem("CUSTOMER");
    var EmailID     = $window.localStorage.getItem("email");

    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function() {
      $rootScope.$apply(function() {
          $rootScope.online   = false;
      });
      $scope.koneksiInternet  = true;
      $scope.showkoneksi      = "show";
      $scope.indikator_green  = "hidden";
      $scope.indikator_orange = "hidden";
      $scope.indikator_red    = "show";
    }, false);

    $window.addEventListener("online", function() {
      $rootScope.$apply(function() {
          $rootScope.online   = true;
      });
      $scope.koneksiInternet  = false;
      $scope.showkoneksi      = "show";
      $scope.indikator_green  = "show";
      $scope.indikator_orange = "hidden";
      $scope.indikator_red    = "hidden";
    }, false);
    //get default message -------------------------------------------------
    var EmailID         = $window.localStorage.getItem("email");
    $http({
      method    : 'GET',
      url       : kvlUrl+'MobileSRSMessageAction?action=AllInbox&email='+EmailID+'&from=From You'
    })
    .success(function(result) {
      $scope.inboxList = result.rows;
    });
    //list inbox choose ---------------------------------------------------
    var statusInbox = [
      { "value" : "0"             , "inboxMessage" : "-- Pilih Status Inbox --" },
      { "value" : "AllInbox"      , "inboxMessage" : "Semua" }
      // { "value" : "AllReadInbox"  , "inboxMessage" : "Dibaca" },
      // { "value" : "AllUnreadInbox", "inboxMessage" : "Belum dibaca" },
    ];

    $scope.inboxMessageList     = statusInbox;
    $scope.inbox.statusInbox    = statusInbox[1];

    $scope.doGetListInbox = function(detailInbox){
      var EmailID         = $window.localStorage.getItem("email");
      var messageListNew  = [];
      $scope.inboxList = [];
      if (detailInbox.value != "0"){
        $http({
          method    : 'GET',
          url       : kvlUrl+'MobileSRSMessageAction?action='+detailInbox.value+'&email='+EmailID+'&from=From You'
        })
        .success(function(result) {
          $scope.inboxList = result.rows;
        });
      }else{
        $http({
          method    : 'GET',
          url       : kvlUrl+'MobileSRSMessageAction?action=AllInbox&email='+EmailID+'&from=From You'
        })
        .success(function(result) {
          $scope.inboxList = result.rows;
        });
      }
    }

    $scope.doDeleteMessageByIdMessage = function(idMessage){
      var detailInbox           = $scope.detailInbox = {};
      var ServLink              = kvlUrl+"MobileInboxAction";
      $scope.detailInbox.action = "delete-idmessage";
      $scope.detailInbox.id     = idMessage;

      $http({
        method      : 'POST',
        url         : ServLink,
        contentType : 'application/json',
        data        : JSON.stringify(detailInbox),
        headers     : localStorageTokenBearer()

      })
      .success(function(result) {
        if ((result.status) == "1" || (result.status) == 1) {
            listInboxByCustomerID();
            getTotalInbox();
        } else {

        }
      });
    }

    $scope.doDeleteMessageById = function(id){
      var detailInbox = $scope.detailInbox = {};
      var ServLink    = kvlUrl+"MobileInboxAction";

      $scope.detailInbox.action = "delete-id";
      $scope.detailInbox.id     = id;

      $http({
        method    : 'POST',
        url       : ServLink,
        contentType: 'application/json',
        data      : JSON.stringify(detailInbox),
      })
      .success(function(result) {
        if ((result.status) == "1" || (result.status) == 1) {
          listInboxByCustomerID();
          getTotalInbox();

          var alertPopup = $ionicPopup.alert({
            title: 'Berhasil',
            template: 'Pesan terhapus',
            okType  : 'button-custom-ok'
          });

          alertPopup.then(function(res) {
            $state.go('app.inbox', { url: '/inbox' });
            $window.location.reload();
          });
        } else {

        }
      });
    }

    $scope.doMarkMessage = function(idMessage){
      $http({
          method    : 'GET',
          url       : kvlUrl+'MobileInboxAction?action=getReadInbox&idInbox='+idMessage
      })
      .success(function(result) {
          if (result.status == "1" || result.status == 1) {
              listInboxByCustomerID();
              getTotalInbox();
          } else {

          }
      });
    }
  })

  $scope.doReplyMessage = function(){
    var idMessage    = $stateParams.idMessage;
    location.href    = "#/app/inbox-reply/"+idMessage;
  }

  $scope.doReadMessage = function(id){
    location.href   = "#/app/pesan-detail/"+id;
  }

})

.controller('PesanDetailCtrl', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicHistory, $ionicModal, Api, Common) {

  var id        = $stateParams.id;
  $http({
      method    : 'GET',
      url       : kvlUrl+'MobileSRSMessageAction?action=getDetailMessage&id='+id
  })
  .success(function(result) {
      console.log(result);
      if (result.total > 0) {
        $scope.title      = result.rows[0].title;
        $scope.blastDate  = result.rows[0].blastDate;
        $scope.message    = result.rows[0].message;
      } else {

      }
  });

  $scope.doBack = function(id){
    location.href   = "#/app/pesan";
  }

})

.controller('HeaderIconCtrl' , function($scope,$state,$window){
  var userid = $window.localStorage.getItem("userId");
  $scope.showMessageIcon = false;
  if(userid == null || userid == undefined){
    $scope.showMessageIcon = false;
  }else{
    $scope.showMessageIcon = true;
  }
  $scope.doProfil = function(){
    $state.go('app.profil');
  }
  $scope.doMessage = function(){
    $state.go('app.pesan');
  }
})

.controller('EndCtrl', function($scope) {
});
