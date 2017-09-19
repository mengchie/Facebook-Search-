window.fbAsyncInit = function() {
    FB.init({
        appId: '1433758233336021',
        xfbml: true,
        version: 'v2.8'
    });
    FB.AppEvents.logPageView();
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var app = angular.module("myApp", ['ngAnimate']);

app.controller("SearchController", function($scope, FbFactory) {
    $scope.navMode = "user";
    $scope.showContent = false;
    $scope.processingBar = false;
    $scope.arrObj = [];
    $scope.shownext = true;
    $scope.showpre = false;
    $scope.next = null;
    $scope.previous = null;
    $scope.offset = 0;
    $scope.useroffset = 0;
    $scope.pageoffset = 0;
    $scope.eventoffset = 0;
    $scope.placeoffset = 0;
    $scope.groupoffset = 0;
    $scope.center = null;
    $scope.lat = null;
    $scope.lon = null;
    $scope.showDetail = false;
    $scope.arrDetail = null;
    $scope.albumProBar = false;
    $scope.postProBar = false;
    $scope.noAlbum = null;
    $scope.noPost = null;
    $scope.favoData = null;
    $scope.showFavorite = false;
    $scope.detailStarOff = true;
    $scope.showAlbum = false;
    $scope.showPost = false;
    $scope.trueMode = null;
    $scope.localArr = loadStorage();
    $scope.fromDT = false;
    $scope.used = false;


    console.log(loadStorage());
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.$apply(function() {
                $scope.lat = position.coords.latitude;
                $scope.lon = position.coords.longitude;
            });
        });
    }
    $scope.detail = function(d_id) {
        var id = d_id;
        $scope.trueMode = $scope.navMode;
        console.log(id);
        $scope.showContent = false;
        $scope.noAlbum = false;
        $scope.noPost = false;
        $scope.showFavorite = false;
        $scope.showAlbum = false;
        $scope.showPost = false;
        $scope.albumProBar = true;
        $scope.postProBar = true;
        $scope.showDetail = true;
        $scope.fromDT = true;

        if (id == "") return;
        console.log($scope.navMode);
        if ($scope.navMode == 'favorite') {
            $scope.localArr = loadStorage();
            $scope.localArr.forEach(function(m, i) {
                if (m.id == id) {
                    $scope.trueMode = m.type;
                }
            });
        }
        console.log($scope.trueMode);
        FbFactory.getDetail(id, $scope.trueMode).then(function(data) {
            console.log(data);
            $scope.arrDetail = data;
            if (!$scope.arrDetail.albums) {
                $scope.noAlbum = true;
            }
            if (!$scope.arrDetail.posts) {
                $scope.noPost = true;
            }
            console.log('album:' + " " + $scope.noAlbum);
            console.log('post:' + " " + $scope.noPost);
            $scope.showContent = false;
            $scope.showDetail = true;
            $scope.albumProBar = false;
            $scope.postProBar = false;
            $scope.showAlbum = true;
            $scope.showPost = true;
            $scope.checkDetailStar(id);
        });



    }
    $scope.search = function(mode, fromSearch) {




        var key = $('#keyword').val();

        if (key == "") {
            $('#keyword').tooltip('show');
        }

        if (key == "") {
            return;
        }

        if ($scope.showDetail == true) {
            $scope.fromDT = false;
        }
        $scope.used = true;
        $scope.showFavorite = false;
        $scope.showDetail = false;
        $scope.showContent = false;
        $scope.showAlbum = false;
        $scope.showPost = false;
        $scope.noAlbum = false;
        $scope.noPost = false;
        //$scope.fromDT = false;
        $scope.processingBar = true;
        if (mode == 'favorite') {
            $scope.showFavorite = true;
            $scope.processingBar = false;
            return;
        }

        if (fromSearch == true) {
            $scope.useroffset = 0;
            $scope.pageoffset = 0;
            $scope.eventoffset = 0;
            $scope.placeoffset = 0;
            $scope.groupoffset = 0;
        }
        if (mode == 'user') {
            $scope.offset = $scope.useroffset;
            $scope.center = null;
        } else if (mode == 'page') {
            $scope.offset = $scope.pageoffset;
            $scope.center = null;
        } else if (mode == 'event') {
            $scope.offset = $scope.eventoffset;
            $scope.center = null;
        } else if (mode == 'place') {
            $scope.offset = $scope.placeoffset;
            console.log($scope.lat);
            if ($scope.lat == null || $scope.lon == null)
                $scope.center = null;
            else
                $scope.center = ($scope.lat + ',' + $scope.lon);
            console.log($scope.center);
        } else if (mode == 'group') {
            $scope.offset = $scope.groupoffset;
            $scope.center = null;
        }


        FbFactory.getResult(key, mode, $scope.offset, $scope.center).then(function(data) {
            //console.log(data);
            $scope.arrObj = data;
            $scope.localArr = loadStorage();
            $scope.arrObj.data.forEach(function(m, i) {
                $scope.localArr.forEach(function(f, j) {
                    if (m.id == f.id) m.isFavorite = true;

                });
            });
            $scope.processingBar = false;
            $scope.showDetail = false;
            $scope.noAlbum = false;
            $scope.noPost = false;
            $scope.showContent = true;
            if (!$scope.arrObj.paging) {
                $scope.shownext = false;
                $scope.showpre = false;
            } else {
                $scope.next = $scope.arrObj.paging.next;
                $scope.previous = $scope.arrObj.paging.previous;
                if ($scope.next == null) {
                    $scope.shownext = false;
                } else {
                    $scope.shownext = true;
                }
                if ($scope.previous == null) {
                    $scope.showpre = false;
                } else {
                    $scope.showpre = true;
                }
            }


        });
    }
    $scope.po = function() {
        FB.ui({
            app_id: '1433758233336021',
            method: 'feed',
            link: window.location.href,
            picture: $scope.arrDetail.picture.url,
            name: $scope.arrDetail.name,
            caption: 'FB SEARCH FROM USC CSCI571',
        }, function(response) {
            if (response && !response.error_message) {
                window.alert('Posted Successfully');
            } else {
                window.alert('Not Posted');
            }

        });
    }
    $scope.clear = function() {
        console.log('in clear');
        $scope.showFavorite = false;
        $scope.showDetail = false;
        $scope.showContent = false;
        $scope.showAlbum = false;
        $scope.showPost = false;
        $scope.showContent = false;
        $scope.useroffset = 0;
        $scope.pageoffset = 0;
        $scope.eventoffset = 0;
        $scope.placeoffset = 0;
        $scope.groupoffset = 0;
        document.getElementById("keyword").value = "";
        console.log('clear DOWN');
    }
    $scope.timeZone = function(time) {
        return moment.utc(time).local().format("YYYY-MM-DD HH:mm:ss");
    }
    $scope.nextpage = function(mode) {
        if (mode == 'user') {
            $scope.useroffset += 25;
        } else if (mode == 'page') {
            $scope.pageoffset += 25;
        } else if (mode == 'event') {
            $scope.eventoffset += 25;
        } else if (mode == 'place') {
            $scope.placeoffset += 25;
        } else if (mode == 'group') {
            $scope.groupoffset += 25;
        }
        $scope.search(mode, false);
    }
    $scope.prepage = function(mode) {
        if (mode == 'user') {
            $scope.useroffset -= 25;
        } else if (mode == 'page') {
            $scope.pageoffset -= 25;
        } else if (mode == 'event') {
            $scope.eventoffset -= 25;
        } else if (mode == 'place') {
            $scope.placeoffset -= 25;
        } else if (mode == 'group') {
            $scope.groupoffset -= 25;
        }
        $scope.search(mode, false);
    }
    $scope.switchMode = function(mode) {
        $scope.navMode = mode;
        if (mode != "favorite") {
            // if($scope.showDetail == true){
            // 	$scope.fromDT = true;
            // }
            if ($scope.used == true) {
                $scope.showFavorite = false;
                $scope.search(mode, false);
            } else {
                $scope.showFavorite = false;
                $scope.showDetail = false;
                // $scope.search(mode, false);
                $scope.fromDT = false;
            }
            console.log('inothers');

        } else {
            if ($scope.showDetail == true) {
                $scope.fromDT = false;
            }
            // $scope.fromDT = false;
            $scope.showDetail = false;
            $scope.showContent = false;
            //$scope.fromDT = false;
            $scope.showFavorite = true;
            console.log('inFavorite');
            $scope.localArr = loadStorage();
        }
    }
    $scope.checkDetailStar = function(id) {
        console.log('inininn');
        console.log(id);
        var flag = true;
        $scope.localArr = loadStorage();
        $scope.localArr.forEach(function(m, i) {
            if (m.id == id) {
                $scope.detailStarOff = false;
                flag = false;
            }
        });
        if (flag == true) $scope.detailStarOff = true;
        console.log($scope.detailStarOff);

    }
    $scope.storeFavorite = function(item, fromDetail) {
        console.log('hahahhaha');
        console.log(item);
        item.isFavorite = true;
        if (typeof(Storage) !== "undefined") {
            console.log('hahahhaha');

            // if (!localStorageDatas) localStorageDatas = [];
            // console.log(localStorageDatas);
            if (fromDetail == false) {
                var favoData = {
                    "photoUrl": item.picture.data.url,
                    "name": item.name,
                    "type": $scope.navMode,
                    "favorite": true,
                    "id": item.id
                }
            } else {

                var favoData = {
                    "photoUrl": item.picture.url,
                    "name": item.name,
                    "type": $scope.trueMode,
                    "favorite": true,
                    "id": item.id
                }
            }
            $scope.detailStarOff = false;
            // localStorageDatas.push(favoData);
            $scope.localArr.push(favoData);
            if ($scope.navMode != 'favorite') {
                $scope.arrObj.data.forEach(function(m, i) {
                    if (m.id == item.id) m.isFavorite = true;
                });
            }

            // saveStorage(localStorageDatas);
            saveStorage($scope.localArr);
        } else {
            window.alert("Sorry, your browser does not support Web Storage...");
        }

    }
    $scope.removeFavorite = function(item) {
        var index = $scope.localArr.indexOf(item);
        $scope.localArr.splice(index, 1);
        //console.log($scope.arrObj);
        if ($scope.navMode != 'favorite') {
            console.log('uuuuuuu');
            $scope.arrObj.data.forEach(function(m, i) {


                if (m.id == item.id) m.isFavorite = false;

            });
        }
        $scope.detailStarOff = true;
        saveStorage($scope.localArr);
    }
    $scope.removeFavForDetail = function(item) {
        console.log('inside');
        $scope.detailStarOff = true;
        $scope.localArr = loadStorage();
        $scope.localArr.forEach(function(m, i) {
            if (m.id == item.id) {
                console.log('matchID');
                $scope.localArr.splice(i, 1);
            }

        });
        saveStorage($scope.localArr);
    }

    function loadStorage() {
        var data = [];
        if (typeof(Storage) !== "undefined") {
            if (localStorage.length == 0) {
                localStorage.setItem("MJhw8", JSON.stringify(data));
            } else {
                data = localStorage.getItem("MJhw8");
            }

        } else {
            window.alert("Sorry, your browser does not support Web Storage...");
        }

        return $.parseJSON(data);
    }
    // saveStorage([]);


    function saveStorage(data) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("MJhw8", JSON.stringify(data));

        } else {
            window.alert("Sorry, your browser does not support Web Storage...");
        }

    }

    //     <!-- <script type="text/javascript">
    // $(document).ready(function() {
    //     $("#submit").click(function() {
    //         var key = $('#keyword').val();
    //         var buttonString = 'search=' + key;
    //         $.ajax({
    //             type: "GET",
    //             url: "hw8.php",
    //             data: buttonString,
    //             success: function(result) {
    //                 var dataArray = JSON.parse(result);
    //                 $("#resultarea").append(result);
    //             },
    //             error: function(result) {
    //                 alert('error');
    //             }
    //         });
    //         return false;
    //     });
    // });
    // </script> -->
});




app.factory('FbFactory', function($q, $http) {

    var _factory = {};
    _factory.getResult = function(key, mode, offset, center) { //factory function name
        var defer = $q.defer(); //q async tool
        console.log("hw8.php?search=" + key + "&mode=" + mode + "&offset=" + offset + "&center=" + center);
        $http.get("hw8.php?search=" + key + "&mode=" + mode + "&offset=" + offset + "&center=" + center)
            .then(function(response) { // sucess
                console.log(response);
                _factory.data = response.data; //問問問問問問問問問問問問問問
                defer.resolve(_factory.data);
            }, function(response) { // false
                alert('error');
                defer.reject(_factory.data);
            });
        return defer.promise;
        // return $http.get("hw8.php?search=" + key + "&mode=" + mode);
    };

    _factory.getDetail = function(id, tag) { //factory function name
        var defer = $q.defer(); //q async tool
        $http.get("hw8.php?detail=" + id + "&tag=" + tag)
            .then(function(response) { // sucess
                _factory.data = response.data; //問問問問問問問問問問問問問問
                defer.resolve(_factory.data);
            }, function(response) { // false
                alert('error');
                defer.reject(_factory.data);
            });
        return defer.promise;
        // return $http.get("hw8.php?search=" + key + "&mode=" + mode);
    };
    // _factory.postComent = function(article) {
    //     var defer = $q.defer();
    //     $http.post("", { article: article })
    //         .then(function(response) {
    //             _factory.data = response.data;
    //             defer.resolve(_factory.data);
    //         }, function(response) {
    //             alert('error');
    //             defer.reject(_factory.data);
    //         });
    //     return defer.promise;
    // };

    return _factory;
});

$(document).ready(function() {

    $('#keyword').tooltip({
        title: 'Please type a keyword',
        trigger: 'manual',
        placement: 'bottom'
    });


    $('#keyword').on('input', function() {

        $('#keyword').tooltip('hide');
    });


});
