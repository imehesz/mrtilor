var webApp = angular.module("webApp",[]);

webApp.controller("MainController", function($scope, $sce){
  $scope.appName = "Mr. Tilor";
  
  $scope.tileSettings = {
    tilesFile: "https://692ce8af1eca91e4dbe0dbf589c10ab67a3e1418.googledrive.com/host/0B55OYxnBow_9REZFVFRRM3E5REE/girls-n-cowboys-tiles.png",
    tileSize: 32,
    tileCnt: 0,
    defaultTile: 0,
    tiles: []
  };
  
  $scope.sceneSettings = {
    cols: 1,
    rows: 1,
    tiles: [],
    getRows: function() {
      var retArr = [];
      
      for(var i=0; i<$scope.sceneSettings.rows; i++) {
        retArr.push(i);
      }
      
      return retArr;
    },
    
    getCols: function() {
      var retArr = [];
      
      for(var i=0; i<$scope.sceneSettings.cols; i++) {
        retArr.push(i);
      }
      
      return retArr;
    },
    
    setTileToDefault: function(x,y) {
      $scope.sceneSettings.tiles.push({coords: {x:x, y:y}, tileIdx:$scope.tileSettings.defaultTile});
      $("#scene-tile-" + x + "-" + y).
        attr("class", "tile tile-" + $scope.tileSettings.defaultTile);
      
      console.log($scope.sceneSettings.tiles);
    },
    
    reloadTiles: function() {
      if ($scope.sceneSettings.tiles.length) {
        $scope.sceneSettings.tiles.forEach(function(tile){
          for(var x=0; x<$scope.sceneSettings.cols;x++) {
            for(var y=0; y<$scope.sceneSettings.rows;y++) {
              if(x==tile.coords.x && y==tile.coords.y) {
                $("#scene-tile-" + x + "-" + y).
                  attr("class", "tile tile-" + tile.tileIdx);
              }
            }
          }
        });
      }
    }
  }
  
  var tileFile = null;
  var tileFileWidth = 0;
  
  var init = function() {
    updateTilesImage();
  }
  
  var getTilesImageWidth = function(cb) {
    if(!tileFile) {
      tileFile = new Image();
      tileFile.onload = function() {
        var $img = $(tileFile);
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
      
      var TILE_WRAPPER_CLASS = ".tile-wrapper";
      var TILE_CLASS = ".tile";
      
      $scope.tileSettings.tileCnt = tileFileWidth/$scope.tileSettings.tileSize;
      
      var styleStr = "<style>";
      
      styleStr += TILE_WRAPPER_CLASS + " " + TILE_CLASS + " {width:"+$scope.tileSettings.tileSize+"px; height:" + $scope.tileSettings.tileSize + "px;}\n";
      
      for(var i=0; i<$scope.tileSettings.tileCnt;i++) {
        $scope.tileSettings.tiles.push(i);
        styleStr += TILE_WRAPPER_CLASS + " " + TILE_CLASS + TILE_CLASS + "-" + i + " {background-image: url(" + $scope.tileSettings.tilesFile + ");background-position: " + (tileFileWidth-(i*$scope.tileSettings.tileSize)-1) + "px 0;}\n";
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
  
  $scope.$watch("sceneSettings.cols", function(n,o) {
    if (n!==o) {
      if (n && $.isNumeric(n)) {
        $(".scene-tile-wrapper").width((n*($scope.tileSettings.tileSize)));        
      }
      
      setTimeout($scope.sceneSettings.reloadTiles, 0);
    }
  });
  
  $scope.$watch("sceneSettings.rows", function(n,o) {
    if (n!==o) {
      setTimeout($scope.sceneSettings.reloadTiles, 0);
    }
  });
  
  $scope.setDefaultTile = function(idx) {
    console.log("setting default tile!", idx);
    $scope.tileSettings.defaultTile = idx;
  };
  
  init();
});