angular.module('cssBoxModel', ['ngAnimate', 'ngSanitize', 'ui.router','ui.slider'])

.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
    $stateProvider.state('home', {
            url: '',
      			controller: 'MainCtrl',
      			views: {
              'diagram': {
            		templateUrl: 'main.html',
                controller: 'MainCtrl'
              }
            }
            
        });
}])

.directive('labelPositionV', function() {
    return {
        restrict: 'AE',
        scope: {},
        link: function(scope, element, attrs, ctrl) {
            var id = attrs.id;
            attrs.$observe('labelPositionTop', function(value) {
                var styleTop = "<style> #" + id + "::before{top:" + ((value / 2.8) - 12) + "px;}</style>";
                angular.element(document).find('head').append(styleTop);
            });
            attrs.$observe('labelPositionBottom', function(value) {
                var styleBottom = "<style> #" + id + "::after{bottom:" + ((value / 3) - 13) + "px;}</style>";
                angular.element(document).find('head').append(styleBottom);
            });
        }
    };
})

.directive('labelPositionH', function() {
    return {
        restrict: 'AE',
        scope: {},
        link: function(scope, element, attrs, ctrl) {
            var id = attrs.id;
            attrs.$observe('labelPositionRight', function(value) {
                var styleRight = "<style> #" + id + "::after{right:" + (1*((value / 2.8) - 12)) + "px;}</style>";
                angular.element(document).find('head').append(styleRight);
            });
            attrs.$observe('labelPositionLeft', function(value) {
                var styleLeft = "<style> #" + id + "::before{left:" + (1*((value / 3)-12)) + "px;}</style>";
                angular.element(document).find('head').append(styleLeft);
            });

        }
    };
});

// Controller
// **********************************************************************

var app = angular.module('cssBoxModel');

app.controller('MainCtrl', function ($scope) {

    //models: default adjustable values
    $scope.padding = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        v: function () {
            return this.top + this.bottom;
        },
        h: function () {
            return this.right + this.left;
        }
    };

    $scope.border = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
        v: function () {
            return this.top + this.bottom;
        },
        h: function () {
            return this.right + this.left;
        }
    };

    $scope.margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        v: function () {
            return this.top + this.bottom;
        },
        h: function () {
            return this.right + this.left;
        }
    };

    $scope.box = {
        sizing: 'content-box'
    };

    if ($(window).width() > 960) {
        $scope.dimensions = {
            width: 650,
            height: 500
        };
    } else {
        $scope.dimensions = {
            width: 350,
            height: 280
        };
    }

    $scope.innerContent = {
        width: getInnerWidth(),
        height: getInnerHeight()
    };

    $scope.generatedIncludeMargin = false;

    $scope.generatedBoxDimensions = {
        width: getGeneratedBoxDimensionsWidth(),
        height: getGeneratedBoxDimensionsHeight()
    };

    $scope.checkIncludeMargin = function() {
        let automode = document.getElementById("automode");
        if (automode.innerHTML === "OFF") automode.innerHTML = "ON";
        else  automode.innerHTML = "OFF";
    };

    if ($(window).width() > 960) {
        $("#handle1").roundSlider({
            sliderType: "min-range",
            editableTooltip: false,
            radius: 100,
            width: 20,
            value: 0,
            handleSize: 0,
            handleShape: "square",
            circleShape: "pie",
            startAngle: 315
        });


        $("#handle2").roundSlider({
            sliderType: "min-range",
            editableTooltip: false,
            radius: 100,
            width: 20,
            value: 0,
            handleSize: 0,
            handleShape: "square",
            circleShape: "pie",
            startAngle: 315
        });

    } else {
        $("#handle1").roundSlider({
            sliderType: "min-range",
            editableTooltip: false,
            radius: 75,
            width: 20,
            value: 0,
            handleSize: 0,
            handleShape: "square",
            circleShape: "pie",
            startAngle: 315
        });


        $("#handle2").roundSlider({
            sliderType: "min-range",
            editableTooltip: false,
            radius: 75,
            width: 20,
            value: 0,
            handleSize: 0,
            handleShape: "square",
            circleShape: "pie",
            startAngle: 315
        });
    }

    //actual applied style values
    $scope.boxPosition = {
        left: 50,
        top: 56
    };

    $scope.styleMargin = {
        width: 300,
        height: 300,
        top: -50,
        left: -50
    };

    $scope.styleBorder = {
        width: 260,
        height: 260,
        top: -30,
        left: -30
    };

    $scope.stylePadding = {
        width: 242,
        height: 242,
        top: -20,
        left: -20
    };

    //watch for changes applied to sliders and calculate rendered styles
    $scope.$watch(function () {
        $scope.boxPosition.top = calcBoxPositionTop() + 6;
        $scope.boxPosition.left = calcBoxPositionLeft();

        //Margin Styles
        $scope.styleMargin.width = $scope.margin.h() + $scope.styleBorder.width;
        $scope.styleMargin.height = $scope.margin.v() + $scope.styleBorder.height;
        $scope.styleMargin.top = -calcBoxPositionTop();
        $scope.styleMargin.left = -calcBoxPositionLeft();

        //Border Styles
        $scope.styleBorder.width = $scope.border.h() + $scope.stylePadding.width;
        $scope.styleBorder.height = $scope.border.v() + $scope.stylePadding.height;
        $scope.styleBorder.top = -($scope.border.top + $scope.padding.top);
        $scope.styleBorder.left = -($scope.border.left + $scope.padding.left);

        //Padding Styles
        $scope.stylePadding.width = $scope.padding.h() + getInnerWidth() + 2;
        $scope.stylePadding.height = $scope.padding.v() + getInnerHeight() + 2;
        $scope.stylePadding.top = -$scope.padding.top;
        $scope.stylePadding.left = -$scope.padding.left;

        //Inner Content Styles- based on box-sizing
        $scope.innerContent.width = getInnerWidth();
        $scope.innerContent.height = getInnerHeight();

        //Generated Dimensions- based on box-sizing
        $scope.generatedBoxDimensions.width = getGeneratedBoxDimensionsWidth();
        $scope.generatedBoxDimensions.height = getGeneratedBoxDimensionsHeight();
    });

    function getInnerWidth() {
        var width =  $scope.dimensions.width - $scope.border.h() - $scope.padding.h();
        return (width > 0) ? width : 0;
    }

    function getInnerHeight() {
        var height = $scope.dimensions.height - $scope.border.v() - $scope.padding.v();
        return (height > 0) ? height : 0;
    }

    function getGeneratedBoxDimensionsWidth() {
        return $scope.dimensions.width + calcPaddingBorderWidth();
    }

    function getGeneratedBoxDimensionsHeight() {
        return $scope.dimensions.height + calcPaddingBorderHeight();
    }

    /*
     * Private: Helpers
     */
    function calcBoxPositionTop() {
        return $scope.margin.top + $scope.border.top + $scope.padding.top;
    }

    function calcBoxPositionLeft() {
        return $scope.margin.left + $scope.border.left + $scope.padding.left;
    }

    function calcPaddingBorderWidth() {
        return $scope.padding.h() + $scope.border.h();
    }

    function calcPaddingBorderHeight() {
        return $scope.padding.v() + $scope.border.v();
    }

});