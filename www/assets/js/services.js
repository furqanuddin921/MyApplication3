window.Console = {
	success: "background: white; color: green; font-size: 15px;",
	error: "background: white; color: red; font-size: 15px;"
};

angular.module("starter.services", [])
.factory('$exceptionHandler', function($window) {
    return function(exception, cause) {
        var proccess = "exceptionHandler";
        exception.message += ' (caused "' + cause + '")';
        console.warn(exception.message);

        // crashlytic exception --
        // var crashlytics = $window.Crashlytics.initialise();
        // crashlytics.logException(exception.message);

        return proccess;
        // throw exception;
    };
})
.filter('orderObjectBy', function(){
    return function(input, attribute) {
       if (!angular.isObject(input)) return input;

       var array = [];
       for(var objectKey in input) {
         // console.log(input[objectKey]);
           array.push(input[objectKey]);
       }

       array.sort(function(a, b){
           a = parseInt(a[attribute]);
           b = parseInt(b[attribute]);
           return a - b;
       });
       return array;
    }
})
.filter('orderObjectByList', function(){
    return function(input, attribute) {
       if (!angular.isObject(input)) return input;

       var array = [];
       for(var objectKey in input) {
         // console.log(input[objectKey]);
           array.push(input[objectKey]);
       }

       array.sort(function(a, b){
           a = parseInt(a[attribute]);
           b = parseInt(b[attribute]);
           return b - a;
       });
       return array;
    }
})
.filter('sanitizer', ['$sce', function($sce) {
    return function(url) {
        return $sce.trustAsHtml(url);
    };
}])
.factory("toastCtrl", function() {
	return {
		showShortTop: function(msg, callback) {
			this.showDefault(msg, "short", "top");
		},
		showShortBottom: function(msg, callback) {
			this.showDefault(msg, "short", "bottom");
		},
		showDefault: function(msg, duration, position, callback) {
			try {
				if (typeof callback != "function") callback = function() {};
				duration = typeof duration != "string" ? "long" : duration;
				position = typeof position != "string" ? "bottom" : position;
				window.plugins.toast.show(msg, duration, position, function(a) {
					console.log("toast success: %c" + a, Console.success);
					setTimeout(callback, 0);
				}, function(b) {
					alert("toast error: " + b);
				});
			} catch (err) {
				console.log("Try to show toast message: %c" + msg, Console.error);
			}
		}
	};
})
.factory("Api", function($PopupUnauthorized, $rootScope, $http, $q, $httpParamSerializerJQLike, $configApp) {
    return {
    httpGet: function(url){
        return {
            url : url,
            method : 'GET',
            headers : localStorageTokenBearer()
         };
    },
    login: function (username, password) {
        var q = $q.defer(), formData = {
            action: "do-login-credential",
            username: $configApp.encrypt(username),
            password: $configApp.encrypt(password),
            // username: username,
            // password: password,
        };
        $http({
            method      : 'POST',
            url         : kvlUrlAPI,
            contentType : 'application/json',
            data        : JSON.stringify(formData),
            headers     : localStorageTokenBearer()
        }).success(function(res) {
            q.resolve(res);
        }).error(function(res) {
            q.reject(res);
            $PopupUnauthorized.getTokenApiGee();
        });
        return q.promise;
    },
    getHelpPageDataList: function () {
        var q = $q.defer(),
        action = 'getHelpPageDataList',
        dataTemp = localStorage.getItem("getHelpPageDataList");

        if(dataTemp != null && dataTemp !== ''){
            q.resolve(JSON.parse(dataTemp));
        }else{
            $http({
                url : kvlUrlPage + '?action=' + action,
                method : 'GET',
                headers : localStorageTokenBearer()
            }).success(function(res) {
                console.log(">>>>");
                console.log(res);
                localStorage.setItem("getHelpPageDataList", JSON.stringify(res));
                q.resolve(res);
            }).error(function(res) {
                $PopupUnauthorized.show();
                q.reject(res);
            });
        }
        return q.promise;
    },
    getHelpPageByPageID: function (pageId) {
        var q = $q.defer(),
            action = 'getHelpPageByPageID';
        $http({
            url : kvlUrlPage + '?action=' + action + '&page=' + pageId,
            method : 'GET',
            headers : localStorageTokenBearer()
        }).success(function(res) {
            q.resolve(res);
        }).error(function(res) {
            $PopupUnauthorized.show();
            q.reject(res);
        });
        return q.promise;
    },
    getHelpPageContentByPageID: function (pageId) {
        var q = $q.defer(),
            action = 'getHelpPageContentByPageID';
        $http({
            url : kvlUrlPage + '?action=' + action + '&page=' + pageId,
            method : 'GET',
            headers : localStorageTokenBearer()
        }).success(function(res) {
            q.resolve(res);
        }).error(function(res) {
            $PopupUnauthorized.show();
            q.reject(res);
        });
        return q.promise;
    },
    getAgreementData: function (agreementNo) {
        var q = $q.defer(), formData = {
        "action"    : "do-get-agreement",
        "contractNo": agreementNo
        }
        $http({
            method      : 'POST',
            url         : kvlUrlAPI,
            contentType : 'application/json',
            data        : JSON.stringify(formData),
            headers     : localStorageTokenBearer()
        }).success(function(res) {
            q.resolve(res);
        }).error(function(res) {
            $PopupUnauthorized.show();
            q.reject(res);
        });
        return q.promise;
    },
    getTujuan: function () {
        var q = $q.defer(), formData = {
        "action"    : "do-get-ddl-info",
        "type"      : "Tujuan",
        "tujuanID"  : "1",
        "kategoriID": "1"
        }
        $http({
            method      : 'POST',
            url         : kvlUrlAPI,
            contentType : 'application/json',
            data        : JSON.stringify(formData),
            headers     : localStorageTokenBearer()
        }).success(function(res) {
            q.resolve(res);
        }).error(function(res) {
            $PopupUnauthorized.show();
            q.reject(res);
        });
        return q.promise;
    },
    getKategori: function (tujuan) {
        var q = $q.defer(), formData = {
        "action"    : "do-get-ddl-info",
        "type"      : "Kategori",
        "tujuanID"  : tujuan,
        "kategoriID": "1"
        }
        $http({
            method      : 'POST',
            url         : kvlUrlAPI,
            contentType : 'application/json',
            data        : JSON.stringify(formData),
            headers     : localStorageTokenBearer()
        }).success(function(res) {
            q.resolve(res);
        }).error(function(res) {
            $PopupUnauthorized.show();
            q.reject(res);
        });
        return q.promise;
    },
    getPenjelasan: function (tujuan, kategori) {
        var q = $q.defer(), formData = {
        "action"    : "do-get-ddl-info",
        "type"      : "Penjelasan",
        "tujuanID"  : tujuan,
        "kategoriID": kategori
        }
        $http({
            method      : 'POST',
            url         : kvlUrlAPI,
            contentType : 'application/json',
            data        : JSON.stringify(formData),
            headers     : localStorageTokenBearer()
        }).success(function(res) {
            q.resolve(res);
        }).error(function(res) {
            $PopupUnauthorized.show();
            q.reject(res);
        });
        return q.promise;
    },
    merchantList: function (tujuan, kategori) {
        var q = $q.defer();

        $http({
          method: 'GET',
          url: kvlUrl + 'MobileSRSAction?action=list-merchant',
          headers : localStorageTokenBearer()
        }).success(function(res) {
            q.resolve(res);
        }).error(function(res) {
            $PopupUnauthorized.show();
            q.reject(res);
        });
        return q.promise;
    },
    merchantListLocation: function (latt, longg) {
        var q = $q.defer();

        $http({
          method: 'GET',
          timeout: 20000,
          url: kvlUrl + 'MobileSRSAction?action=list-merchant-location&latitude=' + latt + '&longitude=' + longg,
          headers : localStorageTokenBearer()
        }).success(function(res) {
            q.resolve(res);
        }).error(function(res) {
            $PopupUnauthorized.show();
            q.reject(res);
        });
        return q.promise;
    },
    slider: function () {
        var q = $q.defer();

        var dataSlider = localStorage.getItem("listfrontslider");

        // if(dataSlider != null && dataSlider !== ''){
        //     q.resolve(JSON.parse(dataSlider));
        // }else{
            $http({
              method: 'GET',
              url: kvlUrlFinance + 'FrontSliderAction?action=list-front-slider',
              headers : localStorageTokenBearer(),
              timeout   : 20000,
            })
            .success(function (res) {
                localStorage.setItem("listfrontslider", JSON.stringify(res));
                q.resolve(res);
            }).error(function(err) {
                console.log(err)
                $PopupUnauthorized.show();
                q.reject(err);
            });
        // }
        return q.promise;
    },
    sliderDetail: function (idSlider) {

        var q = $q.defer();

        $http({
          method: 'GET',
          url: kvlUrlFinance + 'FrontSliderAction?action=list-front-sliderid&idSlider=' + idSlider,
          headers : localStorageTokenBearer(),
          timeout   : 20000,
        })
        .success(function (result) {
            q.resolve(result);
        }).error(function(res) {
            $PopupUnauthorized.show();
            q.reject(res);
        });
        return q.promise;
    },
    promoList: function () {
        var q = $q.defer();

        $http({
            method    : 'GET',
            url       : kvlUrlFinance+'FrontPromoAction?action=list-front-promo',
            timeout   : 20000,
            headers : localStorageTokenBearer()
        })
        .success(function(result) {
            q.resolve(result);
        }).error(function(res) {
            q.reject(res);
        });
        return q.promise;
    },
    promoDetail: function (idPromo) {
        var q = $q.defer();

        $http({
            method    : 'GET',
            url       : kvlUrlFinance+'FrontPromoAction?action=list-front-promobyid&idPromo='+idPromo,
            timeout   : 20000,
            headers : localStorageTokenBearer()
        })
        .success(function(result) {
            q.resolve(result);
        }).error(function(res) {
            q.reject(res);
        });
        return q.promise;
    },
    redeem: function () {
      var q = $q.defer();

      $http({
        method: 'GET',
        url: kvlUrlFinance + 'FrontRedeemAction?action=list-front-kupon',
        headers : localStorageTokenBearer()
      })
      .success(function (result) {
          q.resolve(result);
      }).error(function(res) {
          q.reject(res);
      });
      return q.promise;
    },
    secSubmit: function(submitdata) {
      var q       = $q.defer();
      // var urlPOST = bfiCore+"RestNet/api/SRS/v1/PostSEC/Ekreasi/EKreasiSRS2018/SRS";

      submitdata = {action:"PostSEC", data:submitdata}
      $http(httpPostOptionBfiSrs(MobileSRSCoreAction, submitdata))
      .success(function(result) {
          q.resolve(result);
      }).error(function(res) {
          q.reject(res);
      });
      return q.promise;
    }

  }
})
.factory("Common", function($rootScope, $http, $q, $ionicLoading, $ionicPopup) {
    return {
      timeout: function (processname , title, message, timeoutduration) {
        var q = $q.defer();

        // $ionicLoading.show({
        //     template: '<p>Sign In...</p><ion-spinner icon="android"></ion-spinner>'
        // });

        var timeOutProgress = setTimeout(function(){
          console.warn("request timeout :: "+processname);
          $ionicLoading.hide();
          $ionicPopup.alert({
            title     : title,
            cssClass  : 'alertCustom',
            template  : message,
            okType    : 'button-custom-ok'
          });
        }, 30000);
        q.resolve(timeOutProgress);
        return q.promise;
      },
    }
})
.factory("$PopupUnauthorized", function($state, $ionicPopup, $ionicLoading, $http) {
    var self    = this;
    return{
        show: function(){
          var valueTitle = (navigator.onLine) ? 'Token Expired, Silahkan Refresh Token': 'Koneksi internet anda terputus';
          var myPopup = $ionicPopup._popupStack;
          var isPopUpExist = false;
          for (var i = 0; i < myPopup.length; i++) {
            if(myPopup [i].scope.title==valueTitle){
              isPopUpExist = true;
              break;
            }
          }
          if(!isPopUpExist){
            $ionicPopup.alert({
              title     : valueTitle,
              okType    : 'button-custom-ok'
            }).then(function(res) {
              $state.go('app.index');
            });
          }

          /*$ionicLoading.show({
            template: '<p>Get Token...</p><ion-spinner icon="android"></ion-spinner>'
          }).then(function (){
              $http({
                url : kvlUrl + 'MobileSRSTokenAction',
                method : 'GET',
                headers : localStorageTokenBasic()
              }).success(function(res) {
                console.log("MobileSRSTokenAction", res);
                localStorage.setItem("tokenApiGee", res.tokenApiGee);
                $ionicLoading.hide();
                // location.reload();

              }).error(function(res) {
                $ionicLoading.hide();
              });

          })*/
        },
        getTokenApiGee: function(){
          $ionicLoading.show({
            template: '<p>loading...</p><ion-spinner icon="android"></ion-spinner>'
          }).then(function (){
            $http({
              url : kvlUrl + 'MobileSRSTokenAction',
              method : 'GET',
              headers : localStorageTokenBearer()
            }).success(function(res) {
              console.log("MobileSRSTokenAction", res);
              if(res!=null && res.tokenApiGee!=null && res.tokenApiGee!=""){
                localStorage.setItem("tokenApiGee", res.tokenApiGee);
              }
              $ionicLoading.hide();
              // location.reload();
            }).error(function(res) {
              $ionicLoading.hide();
            });

          })
        }
    }

})
.factory("$PopupUnauthorizedJwt", function($ionicPopup, $state) {
    return{
        show: function(err,status, headers, config){
            var valueTitle = 'Token Expired, Silahkan Refresh Token';
            var myPopup = $ionicPopup._popupStack;
            var isPopUpExist = false;
            for (var i = 0; i < myPopup.length; i++) {
                if(myPopup [i].scope.title==valueTitle){
                    isPopUpExist = true;
                    break;
                }
            }
            if(!isPopUpExist){
                $ionicPopup.alert({
                    title     : valueTitle,
                    okType    : 'button-custom-ok'
                }).then(function(res) {
                    $state.go('app.login');
                });
            }
        }
    }

})
.factory("Interaction", function($rootScope, $http, $q, $ionicLoading, $ionicPopup) {
    return {
        alert: function (title, message) {
            $ionicPopup.alert({
              title   : title,
              template: message,
              cssClass: 'alertCustom',
              okText  : 'Ok',
              okType  : 'button-custom-ok'
            });
        }
    }
}).factory("$configApp", function() {
    return {
        encrypt: function(plaintText){
            var key = CryptoJS.enc.Utf8.parse('7061737323313233');
            var iv = CryptoJS.enc.Utf8.parse('7061737323313233');
            var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plaintText), key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        },
        decrypt: function(plaintText){
            var key = CryptoJS.enc.Utf8.parse('7061737323313233');
            var iv = CryptoJS.enc.Utf8.parse('7061737323313233');
            var decrypted = CryptoJS.AES.decrypt(plaintText, key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return decrypted.toString(CryptoJS.enc.Utf8);
        },
    }
})
.factory('BFIFINANCE', function($cordovaSQLite, $window, $ionicPlatform, $q, $ionicLoading) {

});
