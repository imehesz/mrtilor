var webApp = angular.module("webApp",[]);

webApp.controller("MainController", function($scope, $sce){
  $scope.appName = "Mr. Tilor";
  
  $scope.tileSettings = {
    tilesFile: "http://mehesz.net/cicus/images/tiles.png",
    tileSize: 32,
    tileCnt: 0,
    defaultTile: 0,
    tiles: []
  };
  
  var tileFile = null;
  var tileFileWidth = 0;
  
  var init = function() {
    updateTilesImage();
  }
  
  var getTilesImageWidth = function(cb) {
    if(!tileFile) {
      tileFile = new Image();
      tileFile.onload = function() {
        $img = $(tileFile);
        $("body").append($img);
        tileFileWidth = $img.width();
        $img.remove();
        tileFile = null;
        cb();
      }
      
      tileFile.src = $scope.tileSettings.tilesFile;
    }
  };
  
  var updateTilesImage = function() {
    getTilesImageWidth(function(){
      console.log("hereee");
      $scope.tileSettings.tileCnt = tileFileWidth/$scope.tileSettings.tileSize;
      
      var styleStr = "<style>";
      
      styleStr += ".tile-wrapper .tile {width:"+$scope.tileSettings.tileSize+"px; height:" + $scope.tileSettings.tileSize + "px;}";
      
      for(var i=0; i<$scope.tileSettings.tileCnt;i++) {
        $scope.tileSettings.tiles.push(i);
      }
      
      styleStr += "</style>";
      
      $scope.tileSettings.styleStr = $sce.trustAsHtml(styleStr);
      $scope.$apply();
    });
  }
  
  $scope.$watch("tileSettings.tilesFile", function(n,o) {
    if (n!==o) {
      console.log("tilesFile", n);
    }
  });
  
  $scope.setDefaultTile = function(idx) {
    console.log("setting default tile!", idx);
    $scope.tileSettings.defaultTile = idx;
  };
  
  init();
});