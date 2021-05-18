angular
  .module('ohm-delivery', [])
  .controller('tracking', function ($scope, $http) {
    $scope.statuses = [
      'CREATED',
      'PREPARING',
      'READY',
      'IN_DELIVERY',
      'DELIVERED',
      'REFUSED',
    ];
    $scope.errorMessage = '';
    $scope.showFailureReason = false;
    $scope.status = '';
    $scope.reason = '';

    $scope.sendData = function () {
      $http
        .get(`http://localhost:3000/ohms/${this.trackingId}`)
        .then((result) => {
          $scope.errorMessage = '';
          $scope.result = result.data;
        })
        .catch((error) => {
          $scope.errorMessage = error.data.message;
        });
    };

    $scope.changeStatus = function (status) {
      $scope.showFailureReason = status === 'REFUSED';
      $scope.status = status;
    };

    $scope.changeReason = function (val) {
      $scope.reason = val;
    };

    $scope.sendStatus = function () {
      if (
        this.status === 'REFUSED' &&
        (!this.reason || !this.reason.trim().length)
      ) {
        $scope.errorMessage = "Failure reason can't be empty";
        return;
      }

      $http
        .put(`http://localhost:3000/ohms/${this.trackingId}`, {
          status: this.status,
          reason: this.reason || '',
        })
        .then((result) => {
          $scope.errorMessage = '';
          $scope.result = result.data;
        })
        .catch((error) => {
          $scope.errorMessage = error.data.message;
        });
    };

    $scope.reorder = function () {
      $http
        .post(`http://localhost:3000/ohms/${this.trackingId}`)
        .then((result) => {
          $scope.errorMessage = '';
          $scope.result = result.data;
        })
        .catch((error) => {
          $scope.errorMessage = error.data.message;
        });
    };
  });
