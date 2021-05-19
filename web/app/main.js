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
    $scope.status = '';
    $scope.reason = '';
    $scope.comment = '';

    $scope.getOhm = function () {
      $http
        .get(`/ohms/${this.trackingId}`)
        .then((result) => {
          $scope.errorMessage = '';
          $scope.result = result.data;
        })
        .catch((error) => {
          $scope.errorMessage = error.data.message;
        });
    };

    $scope.update = function () {
      if (
        this.status === 'REFUSED' &&
        (!this.reason || !this.reason.trim().length)
      ) {
        $scope.errorMessage = "Failure reason can't be empty";
        return;
      }

      $http
        .put(`/ohms/${this.trackingId}`, {
          status: this.status,
          reason: this.reason || '',
          comment: this.comment || '',
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
        .post(`/ohms/${this.trackingId}`)
        .then((result) => {
          $scope.errorMessage = '';
          $scope.result = result.data;
        })
        .catch((error) => {
          $scope.errorMessage = error.data.message;
        });
    };

    $scope.changeStatus = function (status) {
      $scope.status = status;
    };

    $scope.changeReason = function (val) {
      $scope.reason = val;
    };

    $scope.changeComment = function (val) {
      $scope.comment = val;
    };
  });
