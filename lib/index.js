'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAUL_TIME = 10000;
var DEFAUL_PORT = 3000;

function getTime() {
  return new Date().getTime();
}

var PortFinder = function () {
  function PortFinder() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PortFinder);

    (0, _objectAssign2.default)(this, {
      candidates: config.candidates || [DEFAUL_PORT],
      time: config.time || DEFAUL_TIME
    });
  }

  _createClass(PortFinder, [{
    key: 'timer',
    value: function timer() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.time;

      return (0, _objectAssign2.default)(this, { time: time });
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.index = null;
      this.start = null;
      this.init = null;
    }
  }, {
    key: 'get',
    value: function get() {
      var _this = this;

      for (var _len = arguments.length, candidates = Array(_len), _key = 0; _key < _len; _key++) {
        candidates[_key] = arguments[_key];
      }

      this.candidates = candidates.length ? candidates.map(function (port) {
        return parseInt(port);
      }).sort() : this.candidates;
      if (this.init) return this.search(this.init.resolve, this.init.reject);
      return new _bluebird2.default(function (resolve, reject) {
        _this.init = { resolve: resolve, reject: reject };
        _this.search(_this.init.resolve, _this.init.reject);
      });
    }
  }, {
    key: 'search',
    value: function search(resolve, reject) {
      var _this2 = this;

      this.start = this.start || getTime();
      if (getTime() - this.start > this.time) return reject('timer end');
      this.index = this.index || 0;
      this.port = this.index < this.candidates.length ? this.candidates[this.index] : this.port + 1;
      PortFinder.check(this.port).then(function (port) {
        console.log('port ' + port + ' found in ' + (getTime() - _this2.start) + 'ms');
        resolve(port);
        _this2.reset();
      }, function () {
        _this2.index += 1;
        _this2.get();
      });
    }
  }], [{
    key: 'get',
    value: function get() {
      var _ref;

      return (_ref = new PortFinder()).get.apply(_ref, arguments);
    }
  }, {
    key: 'timer',
    value: function timer(time) {
      return new PortFinder().timer(time);
    }
  }, {
    key: 'check',
    value: function check(port) {
      return new _bluebird2.default(function (resolve, reject) {
        var server = _net2.default.createServer();
        console.log('trying port ' + port);
        server.listen(port, function (err) {
          server.once('close', function () {
            return resolve(port);
          });
          server.close();
        });
        server.on('error', reject);
      });
    }
  }]);

  return PortFinder;
}();

exports.default = PortFinder;