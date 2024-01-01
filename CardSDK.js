var CardSDK;
/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = {
    /***/ "./src/constants.ts":
      /*!**************************!*\
      !*** ./src/constants.ts ***!
      \**************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ ACTIONS: () => /* binding */ ACTIONS,
          /* harmony export */ Events: () => /* binding */ Events,
          /* harmony export */ SDK_TYPES: () => /* binding */ SDK_TYPES,
          /* harmony export */ VERSION: () => /* binding */ VERSION,
          /* harmony export */
        });
        var VERSION = "2.3.2";
        var ACTIONS;
        (function (ACTIONS) {
          ACTIONS["HandShake"] = "HAND_SHAKE";
          ACTIONS["HandShakeSuccess"] = "HAND_SHAKE_SUCCESS";
          ACTIONS["GetLastUpdate"] = "GET_LAST_UPDATE";
          ACTIONS["UpdateState"] = "UPDATE_STATE";
          ACTIONS["GetLayoutById"] = "GET_LAYOUT_BY_ID";
          ACTIONS["SetLayoutConfig"] = "SET_LAYOUT_CONFIG";
          ACTIONS["GetCardConfig"] = "GET_CARD_CONFIG";
          ACTIONS["LocalAction"] = "LOCAL_ACTION";
          ACTIONS["SystemAction"] = "SYSTEM_ACTION";
        })(ACTIONS || (ACTIONS = {}));
        var SDK_TYPES;
        (function (SDK_TYPES) {
          SDK_TYPES["Parent"] = "PARENT";
          SDK_TYPES["Child"] = "CHILD";
        })(SDK_TYPES || (SDK_TYPES = {}));
        var Events;
        (function (Events) {
          Events["ModelUpdated"] = "MODEL_UPDATE";
          Events["WidgetsParsed"] = "WIDGETS_PARSED";
          Events["LocalActionReceived"] = "LOCAL_ACTION_RECEIVED";
        })(Events || (Events = {}));

        /***/
      },

    /***/ "./src/message.ts":
      /*!************************!*\
      !*** ./src/message.ts ***!
      \************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ CardSDKMessage: () =>
            /* binding */ CardSDKMessage,
          /* harmony export */
        });
        var CardSDKMessage = /** @class */ (function () {
          function CardSDKMessage(action, state, from, to) {
            this.action = action;
            this.state = state;
            this.from = from;
            this.to = to;
          }
          return CardSDKMessage;
        })();

        /***/
      },

    /***/ "./src/sdk.ts":
      /*!********************!*\
      !*** ./src/sdk.ts ***!
      \********************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ CardSDK: () => /* binding */ CardSDK,
          /* harmony export */
        });
        /* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./message */ "./src/message.ts");
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ./constants */ "./src/constants.ts");
        /* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ./state */ "./src/state.ts");
        /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(/*! ./utils */ "./src/utils.ts");
        var __assign =
          (undefined && undefined.__assign) ||
          function () {
            __assign =
              Object.assign ||
              function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                  s = arguments[i];
                  for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
              };
            return __assign.apply(this, arguments);
          };

        var STATE = {};
        var CardSDK = /** @class */ (function () {
          function CardSDK() {
            var _this = this;
            this.VERSION = _constants__WEBPACK_IMPORTED_MODULE_1__.VERSION;
            this.id =
              Date.now().toString(32) +
              Math.floor(Math.random() * 1000).toString(32);
            this.deviceIP = null;
            this.modules = {
              CardSDKMessage:
                _message__WEBPACK_IMPORTED_MODULE_0__.CardSDKMessage,
              ACTIONS: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIONS,
              Events: _constants__WEBPACK_IMPORTED_MODULE_1__.Events,
              SDK_TYPES: _constants__WEBPACK_IMPORTED_MODULE_1__.SDK_TYPES,
              CardSDKState: _state__WEBPACK_IMPORTED_MODULE_2__.CardSDKState,
            };
            this.onStateUpdated = function (state) {
              return null;
            };
            this.updatedBy = null;
            this.updatedAt = null;
            this.startedAt = new Date();
            this.parent = null;
            this.children = [];
            this.listeners = {};
            this.lastConfig = null;
            // legacy
            this.modelUpdateCallback = null;
            this.widgetParserCallback = null;
            /////////////////////////////////////////////////////////
            // Legacy
            /////////////////////////////////////////////////////////
            this.modelUpdateListener = function (callback) {
              if (typeof callback === "function") {
                _this.addEventListener(
                  _constants__WEBPACK_IMPORTED_MODULE_1__.Events.ModelUpdated,
                  callback
                );
                _this.modelUpdateCallback = callback;
              } else {
                throw new Error("Model Update Callback is not a Function");
              }
            };
            // Parse Widget Data
            this.parseWidgets = function () {
              if (!!_this.widgetParserCallback) {
                fetch("./widgets.json")
                  .then(function (res) {
                    return res.json();
                  })
                  .catch(function () {
                    throw new Error("Errors in widgets.json");
                  })
                  .then(function (data) {
                    _this.callListeners(
                      _constants__WEBPACK_IMPORTED_MODULE_1__.Events
                        .WidgetsParsed,
                      data
                    );
                    return data;
                  });
              }
            };
            this.widgetParserListener = function (callback) {
              if (typeof callback === "function") {
                _this.addEventListener(
                  _constants__WEBPACK_IMPORTED_MODULE_1__.Events.WidgetsParsed,
                  callback
                );
                _this.widgetParserCallback = callback;
              } else {
                throw new Error("Widget Parser Callback is not a Function");
              }
            };
            this.$state = {
              state: new _state__WEBPACK_IMPORTED_MODULE_2__.CardSDKState(
                {},
                {}
              ),
              updatedBy: this.id,
            };
            this.listenToSDKsMessages();
          }
          Object.defineProperty(CardSDK.prototype, "stateId", {
            get: function () {
              return ""
                .concat(this.updatedAt.getTime(), "_")
                .concat(this.updatedBy || "");
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(CardSDK.prototype, "$state", {
            set: function (_a) {
              var state = _a.state,
                updatedBy = _a.updatedBy,
                updatedAt = _a.updatedAt;
              this.updatedBy = updatedBy;
              this.updatedAt = updatedAt || new Date();
              STATE[this.stateId] = state;
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(CardSDK.prototype, "state", {
            get: function () {
              return STATE[this.stateId];
            },
            set: function (state) {
              this.$state = { state: state, updatedBy: this.id };
              this.informInstances(
                _constants__WEBPACK_IMPORTED_MODULE_1__.SDK_TYPES.Parent
              );
              this.informInstances(
                _constants__WEBPACK_IMPORTED_MODULE_1__.SDK_TYPES.Child
              );
            },
            enumerable: false,
            configurable: true,
          });
          CardSDK.prototype.listenToSDKsMessages = function () {
            var _this = this;
            window.addEventListener("message", function (event) {
              var data = (event || { data: {} }).data;
              var _a = data || {},
                action = _a.action,
                state = _a.state,
                from = _a.from,
                to = _a.to;
              if (_this.id === from) {
                console.log(
                  "action: ".concat(
                    action,
                    " canceled since it's the same instance"
                  )
                );
                return;
              }
              console.log(
                "[sdk]: Handling Event: ".concat(JSON.stringify(event.data))
              );
              switch (action) {
                case _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIONS.HandShake:
                  _this.children.push(from);
                  _this.handleHandShake(from);
                  break;
                case _this.id === to &&
                  _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIONS
                    .HandShakeSuccess:
                  _this.parent = from;
                  _this.updatedBy = from;
                  _this.$state = { state: state, updatedBy: from };
                  break;
                case from !== _this.id &&
                  _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIONS.UpdateState:
                  _this.updatedBy = from;
                  _this.$state = { state: state, updatedBy: from };
                  _this.informInstances(
                    _this.parent === from
                      ? _constants__WEBPACK_IMPORTED_MODULE_1__.SDK_TYPES.Child
                      : _constants__WEBPACK_IMPORTED_MODULE_1__.SDK_TYPES.Parent
                  );
                  _this.onStateUpdated(_this.state);
                  break;
                case from !== _this.id &&
                  _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIONS.GetCardConfig:
                  _this.updatedBy = from;
                  _this.$state = {
                    state: __assign(__assign({}, _this.state), state),
                    updatedBy: from,
                  };
                  _this.loadCard(_this.state.store.cardId);
                  break;
                case _constants__WEBPACK_IMPORTED_MODULE_1__
                  .ACTIONS.LocalAction:
                  _this.$state = {
                    state: __assign(__assign({}, _this.state), state),
                    updatedBy: from,
                  };
                  _this.callListeners(
                    _constants__WEBPACK_IMPORTED_MODULE_1__.Events
                      .LocalActionReceived,
                    _this.state
                  );
                  break;
                case _constants__WEBPACK_IMPORTED_MODULE_1__
                  .ACTIONS.SystemAction:
                  _this.$state = {
                    state: __assign(__assign({}, _this.state), state),
                    updatedBy: from,
                  };
                  _this.sendActionToSystem(_this.state.store.action);
                  break;
                case undefined:
                  if (event.data && (event.data.config || event.data.token)) {
                    console.warn(
                      "\n              [DEPRECATION WARNING]\n\n              [CARD SDK]: dealing with messages without a action name is deprecated,\n              so please use pre defined message action or use setting state and methods\n              directly to handle import card settings.\n              you can use either "
                        .concat(
                          _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIONS
                            .GetLayoutById,
                          ", and "
                        )
                        .concat(
                          _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIONS
                            .SetLayoutConfig,
                          "\n            "
                        )
                    );
                    console.log(event);
                    _this.handleLegacyMessage(event.data);
                  }
                  break;
                default:
                  console.error("[SDK] Unknown action: ", {
                    action: action,
                    from: from,
                    to: to,
                  });
                  break;
              }
            });
          };
          CardSDK.prototype.informInstances = function (sdkType) {
            var message =
              new _message__WEBPACK_IMPORTED_MODULE_0__.CardSDKMessage(
                _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIONS.UpdateState,
                this.state,
                this.id
              );
            var frames = document.querySelectorAll("iframe");
            if (
              sdkType ===
              _constants__WEBPACK_IMPORTED_MODULE_1__.SDK_TYPES.Child
            ) {
              for (var _i = 0, _a = frames || []; _i < _a.length; _i++) {
                var frame = _a[_i];
                frame.contentWindow.postMessage(message, "*");
              }
            } else if (window.parent !== window) {
              window.parent.postMessage(message, "*");
            }
          };
          CardSDK.prototype.handleHandShake = function (to) {
            var message =
              new _message__WEBPACK_IMPORTED_MODULE_0__.CardSDKMessage(
                _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIONS.HandShakeSuccess,
                this.state,
                this.id,
                to
              );
            var frames = document.querySelectorAll("iframe");
            for (var _i = 0, _a = frames || []; _i < _a.length; _i++) {
              var frame = _a[_i];
              frame.contentWindow.postMessage(message, "*");
            }
          };
          CardSDK.prototype.handShake = function () {
            if (window.parent !== window) {
              window.parent.postMessage(
                new _message__WEBPACK_IMPORTED_MODULE_0__.CardSDKMessage(
                  _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIONS.HandShake,
                  null,
                  this.id
                ),
                "*"
              );
            }
          };
          CardSDK.prototype.load = function (mediaId) {
            var _a = this.state.config,
              baseUrl = _a.baseUrl,
              organizationId = _a.organizationId,
              token = _a.token;
            fetch(
              ""
                .concat(baseUrl, "/api/media/")
                .concat(organizationId, "/")
                .concat(mediaId, "?token=")
                .concat(token)
            );
          };
          CardSDK.prototype.loadCardInFrame = function (cardId, iframeWindow) {
            var message =
              new _message__WEBPACK_IMPORTED_MODULE_0__.CardSDKMessage(
                _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIONS.GetCardConfig,
                { store: { cardId: cardId } },
                this.id
              );
            iframeWindow.postMessage(message, "*");
          };
          CardSDK.prototype.loadCard = function (cardId) {
            var _this = this;
            var _a = this.state.config,
              baseUrl = _a.baseUrl,
              token = _a.token;
            // console.log({ cardId, frame, baseUrl, state: this.state});
            fetch(
              ""
                .concat(baseUrl, "/cards/")
                .concat(cardId, "?token=")
                .concat(token)
            )
              .then(function (res) {
                return res.json();
              })
              .then(function (res) {
                return res.card;
              })
              .then(function (_a) {
                var config = _a.config;
                (0, _utils__WEBPACK_IMPORTED_MODULE_3__.validateAttachments)(
                  config.inputs,
                  config.attachments,
                  _this.state
                ).then(function (attachments) {
                  var data = __assign(__assign({}, config), {
                    attachments: attachments,
                  });
                  _this.lastConfig = data;
                  _this.callListeners(
                    _constants__WEBPACK_IMPORTED_MODULE_1__.Events.ModelUpdated,
                    data
                  );
                  return _this.lastConfig;
                });
              })
              .catch(console.error);
          };
          CardSDK.prototype.loadModel = function () {
            var _this = this;
            return fetch("/model.json")
              .then(function (res) {
                return res.json();
              })
              .then(function (config) {
                // console.log(config, typeof config);
                (0, _utils__WEBPACK_IMPORTED_MODULE_3__.validateAttachments)(
                  config.inputs,
                  config.attachments,
                  _this.state
                ).then(function (attachments) {
                  var data = __assign(__assign({}, config), {
                    attachments: attachments,
                  });
                  _this.lastConfig = data;
                  _this.callListeners(
                    _constants__WEBPACK_IMPORTED_MODULE_1__.Events.ModelUpdated,
                    data
                  );
                  return _this.lastConfig;
                });
              });
          };
          /////////////////////////////////////////////////////////
          CardSDK.prototype.addEventListener = function (topic, listener) {
            var _this = this;
            var listenerId =
              Date.now().toString(32) +
              Math.floor(Math.random() * 1000).toString(32);
            this.listeners[topic] = this.listeners[topic] || {};
            this.listeners[topic][listenerId] = listener;
            this.listenerCallbacks = Object.keys(this.listeners).reduce(
              function (callbacks, key) {
                var group = _this.listeners[key] || {};
                callbacks[key] = Object.values(group);
                return callbacks;
              },
              {}
            );
            return listenerId;
          };
          CardSDK.prototype.callListeners = function (topic, data) {
            var listeners = this.listenerCallbacks || {};
            var callbacks = listeners[topic] || [];
            callbacks.forEach(function (callback) {
              if (typeof callback === "function") {
                callback(data);
              }
            });
          };
          CardSDK.prototype.handleLegacyMessage = function (data) {
            var _this = this;
            var token = data.token,
              profile = data.profile,
              baseUrl = data.baseUrl,
              organizationId = data.organizationId,
              ipAddress = data.ipAddress,
              _a = data.customData,
              customData = _a === void 0 ? {} : _a;
            var config =
              data === null || data === void 0 ? void 0 : data.config;
            var state = new _state__WEBPACK_IMPORTED_MODULE_2__.CardSDKState(
              __assign({}, this.state.store),
              {
                token: token,
                baseUrl: baseUrl,
                ipAddress: ipAddress,
                organizationId:
                  (profile === null || profile === void 0
                    ? void 0
                    : profile.organizationId) || organizationId,
              }
            );
            this.updatedBy = this.id;
            this.$state = { state: state, updatedBy: this.id };
            this.informInstances(
              _constants__WEBPACK_IMPORTED_MODULE_1__.SDK_TYPES.Child
            );
            if (config) {
              (0, _utils__WEBPACK_IMPORTED_MODULE_3__.validateAttachments)(
                config.inputs,
                config.attachments,
                this.state
              ).then(function (attachments) {
                var data = __assign(__assign({}, config), {
                  attachments: attachments,
                });
                _this.lastConfig = data;
                _this.callListeners(
                  _constants__WEBPACK_IMPORTED_MODULE_1__.Events.ModelUpdated,
                  data
                );
              });
            }
          };
          CardSDK.prototype.sendActionToSystem = function (action) {
            var _this = this;
            var IPAddress = action.target
              ? Promise.resolve(action.target)
              : this.getDeviceIP();
            IPAddress.then(function (deviceIP) {
              return fetch(
                ""
                  .concat(_this.state.config.baseUrl, "/action?token=")
                  .concat(_this.state.config.token),
                {
                  method: "POST",
                  headers: { "Content-Type": "application/JSON" },
                  body: JSON.stringify({ action: action, deviceIP: deviceIP }),
                }
              );
            });
          };
          CardSDK.prototype.getDeviceIP = function () {
            var _this = this;
            var _a, _b;
            var deviceIP =
              ((_b =
                (_a = this.state) === null || _a === void 0
                  ? void 0
                  : _a.config) === null || _b === void 0
                ? void 0
                : _b.ipAddress) || this.deviceIP;
            return deviceIP
              ? Promise.resolve(deviceIP)
              : fetch("https://api.ipify.org?format=json&callback=?")
                  .then(function (res) {
                    return res.json();
                  })
                  .then(function (res) {
                    _this.deviceIP = res && res.ip;
                    return res && res.ip;
                  });
          };
          return CardSDK;
        })();

        /***/
      },

    /***/ "./src/state.ts":
      /*!**********************!*\
      !*** ./src/state.ts ***!
      \**********************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ CardSDKState: () => /* binding */ CardSDKState,
          /* harmony export */
        });
        var CardSDKState = /** @class */ (function () {
          function CardSDKState(store, config) {
            this.store = store;
            this.config = config;
          }
          return CardSDKState;
        })();

        /***/
      },

    /***/ "./src/utils.ts":
      /*!**********************!*\
      !*** ./src/utils.ts ***!
      \**********************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ getSrcUrlFromMedia: () =>
            /* binding */ getSrcUrlFromMedia,
          /* harmony export */ validateAttachments: () =>
            /* binding */ validateAttachments,
          /* harmony export */
        });
        var __assign =
          (undefined && undefined.__assign) ||
          function () {
            __assign =
              Object.assign ||
              function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                  s = arguments[i];
                  for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
              };
            return __assign.apply(this, arguments);
          };
        var __awaiter =
          (undefined && undefined.__awaiter) ||
          function (thisArg, _arguments, P, generator) {
            function adopt(value) {
              return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                  });
            }
            return new (P || (P = Promise))(function (resolve, reject) {
              function fulfilled(value) {
                try {
                  step(generator.next(value));
                } catch (e) {
                  reject(e);
                }
              }
              function rejected(value) {
                try {
                  step(generator["throw"](value));
                } catch (e) {
                  reject(e);
                }
              }
              function step(result) {
                result.done
                  ? resolve(result.value)
                  : adopt(result.value).then(fulfilled, rejected);
              }
              step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
              );
            });
          };
        var __generator =
          (undefined && undefined.__generator) ||
          function (thisArg, body) {
            var _ = {
                label: 0,
                sent: function () {
                  if (t[0] & 1) throw t[1];
                  return t[1];
                },
                trys: [],
                ops: [],
              },
              f,
              y,
              t,
              g;
            return (
              (g = { next: verb(0), throw: verb(1), return: verb(2) }),
              typeof Symbol === "function" &&
                (g[Symbol.iterator] = function () {
                  return this;
                }),
              g
            );
            function verb(n) {
              return function (v) {
                return step([n, v]);
              };
            }
            function step(op) {
              if (f) throw new TypeError("Generator is already executing.");
              while (_)
                try {
                  if (
                    ((f = 1),
                    y &&
                      (t =
                        op[0] & 2
                          ? y["return"]
                          : op[0]
                          ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                          : y.next) &&
                      !(t = t.call(y, op[1])).done)
                  )
                    return t;
                  if (((y = 0), t)) op = [op[0] & 2, t.value];
                  switch (op[0]) {
                    case 0:
                    case 1:
                      t = op;
                      break;
                    case 4:
                      _.label++;
                      return { value: op[1], done: false };
                    case 5:
                      _.label++;
                      y = op[1];
                      op = [0];
                      continue;
                    case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                    default:
                      if (
                        !((t = _.trys),
                        (t = t.length > 0 && t[t.length - 1])) &&
                        (op[0] === 6 || op[0] === 2)
                      ) {
                        _ = 0;
                        continue;
                      }
                      if (
                        op[0] === 3 &&
                        (!t || (op[1] > t[0] && op[1] < t[3]))
                      ) {
                        _.label = op[1];
                        break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                      }
                      if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
                  }
                  op = body.call(thisArg, _);
                } catch (e) {
                  op = [6, e];
                  y = 0;
                } finally {
                  f = t = 0;
                }
              if (op[0] & 5) throw op[1];
              return { value: op[0] ? op[1] : void 0, done: true };
            }
          };
        function getSrcUrlFromMedia(attachment, state) {
          var _a = state.config,
            token = _a.token,
            organizationId = _a.organizationId,
            baseUrl = _a.baseUrl;
          var src = ""
            .concat(baseUrl, "/media/download/")
            .concat(attachment.id, "?token=")
            .concat(token);
          var iframeSrc = ""
            .concat(baseUrl, "/media/preview/")
            .concat(organizationId, "/")
            .concat(
              attachment === null || attachment === void 0
                ? void 0
                : attachment.id,
              "/"
            );
          var tempSrc = ""
            .concat(baseUrl, "/media/preview/")
            .concat(organizationId, "/template")
            .concat(
              attachment === null || attachment === void 0
                ? void 0
                : attachment.id,
              "/"
            );
          if (!attachment.mimetype) {
            return tempSrc;
          } else if (attachment.mimetype.startsWith("application/")) {
            return iframeSrc;
          } else {
            return src;
          }
        }
        function validateAttachments(inputs, attachments, state) {
          var _this = this;
          var _a = state.config,
            token = _a.token,
            baseUrl = _a.baseUrl;
          return new Promise(function (resolve) {
            return __awaiter(_this, void 0, void 0, function () {
              var validatedAttachments,
                attachmentsFields,
                _loop_1,
                _i,
                attachmentsFields_1,
                attachmentField;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    validatedAttachments = {};
                    attachmentsFields = Object.keys(attachments);
                    _loop_1 = function (attachmentField) {
                      var field,
                        attachmentIds,
                        i,
                        mediaId,
                        duration,
                        attachmentWithSrc,
                        attachmentRes,
                        err_1,
                        attachmentJson,
                        attachmentWithSrc;
                      return __generator(this, function (_b) {
                        switch (_b.label) {
                          case 0:
                            field = inputs.find(function (x) {
                              return x && x.name === attachmentField;
                            });
                            attachmentIds = (field && field.value) || [];
                            validatedAttachments[attachmentField] = [];
                            i = 0;
                            _b.label = 1;
                          case 1:
                            if (!(i < attachmentIds.length))
                              return [3 /*break*/, 10];
                            mediaId =
                              typeof attachmentIds[i] === "object"
                                ? attachmentIds[i].mediaId
                                : attachmentIds[i];
                            duration =
                              typeof attachmentIds[i] === "object"
                                ? attachmentIds[i].duration
                                : "";
                            if (
                              !(
                                Array.isArray(attachments[attachmentField]) &&
                                attachments[attachmentField][i] &&
                                attachments[attachmentField][i].id === mediaId
                              )
                            )
                              return [3 /*break*/, 2];
                            attachmentWithSrc = __assign(
                              __assign({}, attachments[attachmentField][i]),
                              {
                                duration: duration,
                                srcURL: getSrcUrlFromMedia(
                                  attachments[attachmentField][i],
                                  state
                                ),
                              }
                            );
                            validatedAttachments[attachmentField].push(
                              attachmentWithSrc
                            );
                            return [3 /*break*/, 9];
                          case 2:
                            if (!!!attachmentIds[i]) return [3 /*break*/, 8];
                            attachmentRes = void 0;
                            _b.label = 3;
                          case 3:
                            _b.trys.push([3, 5, , 6]);
                            return [
                              4 /*yield*/,
                              fetch(
                                ""
                                  .concat(baseUrl, "/media/")
                                  .concat(mediaId, "?token=")
                                  .concat(token)
                              ),
                            ];
                          case 4:
                            attachmentRes = _b.sent();
                            return [3 /*break*/, 6];
                          case 5:
                            err_1 = _b.sent();
                            validatedAttachments[attachmentField].push({});
                            return [3 /*break*/, 9];
                          case 6:
                            return [4 /*yield*/, attachmentRes.json()];
                          case 7:
                            attachmentJson = _b.sent();
                            attachmentWithSrc = __assign(
                              __assign({}, attachmentJson.media),
                              {
                                duration: duration,
                                srcURL: getSrcUrlFromMedia(
                                  attachmentJson.media,
                                  state
                                ),
                              }
                            );
                            validatedAttachments[attachmentField].push(
                              attachmentWithSrc
                            );
                            return [3 /*break*/, 9];
                          case 8:
                            validatedAttachments[attachmentField].push({});
                            _b.label = 9;
                          case 9:
                            i++;
                            return [3 /*break*/, 1];
                          case 10:
                            return [2 /*return*/];
                        }
                      });
                    };
                    (_i = 0), (attachmentsFields_1 = attachmentsFields);
                    _a.label = 1;
                  case 1:
                    if (!(_i < attachmentsFields_1.length))
                      return [3 /*break*/, 4];
                    attachmentField = attachmentsFields_1[_i];
                    return [5 /*yield**/, _loop_1(attachmentField)];
                  case 2:
                    _a.sent();
                    _a.label = 3;
                  case 3:
                    _i++;
                    return [3 /*break*/, 1];
                  case 4:
                    resolve(validatedAttachments);
                    return [2 /*return*/];
                }
              });
            });
          });
        }

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/define property getters */
  /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    /*!**********************!*\
      !*** ./src/index.ts ***!
      \**********************/
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
      /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
      /* harmony export */
    });
    /* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ =
      __webpack_require__(/*! ./sdk */ "./src/sdk.ts");
    /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ =
      __webpack_require__(/*! ./utils */ "./src/utils.ts");

    var $SDK = new _sdk__WEBPACK_IMPORTED_MODULE_0__.CardSDK();
    $SDK.handShake();
    window.$SDK = $SDK;
    Object.defineProperty(window, "$cardSDK", {
      get: function () {
        return $SDK;
      },
    });
    window.validateAttachments =
      _utils__WEBPACK_IMPORTED_MODULE_1__.validateAttachments;
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ =
      _sdk__WEBPACK_IMPORTED_MODULE_0__.CardSDK;
  })();

  CardSDK = __webpack_exports__;
  /******/
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNELDZCQUE2Qix1REFBbUI7QUFDaEQsaUVBQWUseUNBQU8sRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0NhcmRTREsvLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovL0NhcmRTREsvLi9zcmMvbWVzc2FnZS50cyIsIndlYnBhY2s6Ly9DYXJkU0RLLy4vc3JjL3Nkay50cyIsIndlYnBhY2s6Ly9DYXJkU0RLLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovL0NhcmRTREsvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vQ2FyZFNESy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9DYXJkU0RLL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9DYXJkU0RLL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQ2FyZFNESy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0NhcmRTREsvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHZhciBWRVJTSU9OID0gJzIuMy4yJztcclxuZXhwb3J0IHZhciBBQ1RJT05TO1xyXG4oZnVuY3Rpb24gKEFDVElPTlMpIHtcclxuICAgIEFDVElPTlNbXCJIYW5kU2hha2VcIl0gPSBcIkhBTkRfU0hBS0VcIjtcclxuICAgIEFDVElPTlNbXCJIYW5kU2hha2VTdWNjZXNzXCJdID0gXCJIQU5EX1NIQUtFX1NVQ0NFU1NcIjtcclxuICAgIEFDVElPTlNbXCJHZXRMYXN0VXBkYXRlXCJdID0gXCJHRVRfTEFTVF9VUERBVEVcIjtcclxuICAgIEFDVElPTlNbXCJVcGRhdGVTdGF0ZVwiXSA9IFwiVVBEQVRFX1NUQVRFXCI7XHJcbiAgICBBQ1RJT05TW1wiR2V0TGF5b3V0QnlJZFwiXSA9IFwiR0VUX0xBWU9VVF9CWV9JRFwiO1xyXG4gICAgQUNUSU9OU1tcIlNldExheW91dENvbmZpZ1wiXSA9IFwiU0VUX0xBWU9VVF9DT05GSUdcIjtcclxuICAgIEFDVElPTlNbXCJHZXRDYXJkQ29uZmlnXCJdID0gXCJHRVRfQ0FSRF9DT05GSUdcIjtcclxuICAgIEFDVElPTlNbXCJMb2NhbEFjdGlvblwiXSA9IFwiTE9DQUxfQUNUSU9OXCI7XHJcbiAgICBBQ1RJT05TW1wiU3lzdGVtQWN0aW9uXCJdID0gXCJTWVNURU1fQUNUSU9OXCI7XHJcbn0pKEFDVElPTlMgfHwgKEFDVElPTlMgPSB7fSkpO1xyXG5leHBvcnQgdmFyIFNES19UWVBFUztcclxuKGZ1bmN0aW9uIChTREtfVFlQRVMpIHtcclxuICAgIFNES19UWVBFU1tcIlBhcmVudFwiXSA9IFwiUEFSRU5UXCI7XHJcbiAgICBTREtfVFlQRVNbXCJDaGlsZFwiXSA9IFwiQ0hJTERcIjtcclxufSkoU0RLX1RZUEVTIHx8IChTREtfVFlQRVMgPSB7fSkpO1xyXG5leHBvcnQgdmFyIEV2ZW50cztcclxuKGZ1bmN0aW9uIChFdmVudHMpIHtcclxuICAgIEV2ZW50c1tcIk1vZGVsVXBkYXRlZFwiXSA9IFwiTU9ERUxfVVBEQVRFXCI7XHJcbiAgICBFdmVudHNbXCJXaWRnZXRzUGFyc2VkXCJdID0gXCJXSURHRVRTX1BBUlNFRFwiO1xyXG4gICAgRXZlbnRzW1wiTG9jYWxBY3Rpb25SZWNlaXZlZFwiXSA9IFwiTE9DQUxfQUNUSU9OX1JFQ0VJVkVEXCI7XHJcbn0pKEV2ZW50cyB8fCAoRXZlbnRzID0ge30pKTtcclxuIiwidmFyIENhcmRTREtNZXNzYWdlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQ2FyZFNES01lc3NhZ2UoYWN0aW9uLCBzdGF0ZSwgZnJvbSwgdG8pIHtcclxuICAgICAgICB0aGlzLmFjdGlvbiA9IGFjdGlvbjtcclxuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgdGhpcy5mcm9tID0gZnJvbTtcclxuICAgICAgICB0aGlzLnRvID0gdG87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQ2FyZFNES01lc3NhZ2U7XHJcbn0oKSk7XHJcbmV4cG9ydCB7IENhcmRTREtNZXNzYWdlIH07XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcclxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuaW1wb3J0IHsgQ2FyZFNES01lc3NhZ2UgfSBmcm9tICcuL21lc3NhZ2UnO1xyXG5pbXBvcnQgeyBBQ1RJT05TLCBFdmVudHMsIFNES19UWVBFUywgVkVSU0lPTiB9IGZyb20gJy4vY29uc3RhbnRzJztcclxuaW1wb3J0IHsgQ2FyZFNES1N0YXRlIH0gZnJvbSAnLi9zdGF0ZSc7XHJcbmltcG9ydCB7IHZhbGlkYXRlQXR0YWNobWVudHMgfSBmcm9tICcuL3V0aWxzJztcclxudmFyIFNUQVRFID0ge307XHJcbnZhciBDYXJkU0RLID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQ2FyZFNESygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuVkVSU0lPTiA9IFZFUlNJT047XHJcbiAgICAgICAgdGhpcy5pZCA9IERhdGUubm93KCkudG9TdHJpbmcoMzIpICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCkudG9TdHJpbmcoMzIpO1xyXG4gICAgICAgIHRoaXMuZGV2aWNlSVAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubW9kdWxlcyA9IHtcclxuICAgICAgICAgICAgQ2FyZFNES01lc3NhZ2U6IENhcmRTREtNZXNzYWdlLFxyXG4gICAgICAgICAgICBBQ1RJT05TOiBBQ1RJT05TLFxyXG4gICAgICAgICAgICBFdmVudHM6IEV2ZW50cyxcclxuICAgICAgICAgICAgU0RLX1RZUEVTOiBTREtfVFlQRVMsXHJcbiAgICAgICAgICAgIENhcmRTREtTdGF0ZTogQ2FyZFNES1N0YXRlLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vblN0YXRlVXBkYXRlZCA9IGZ1bmN0aW9uIChzdGF0ZSkgeyByZXR1cm4gbnVsbDsgfTtcclxuICAgICAgICB0aGlzLnVwZGF0ZWRCeSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy51cGRhdGVkQXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RhcnRlZEF0ID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0ge307XHJcbiAgICAgICAgdGhpcy5sYXN0Q29uZmlnID0gbnVsbDtcclxuICAgICAgICAvLyBsZWdhY3lcclxuICAgICAgICB0aGlzLm1vZGVsVXBkYXRlQ2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgIHRoaXMud2lkZ2V0UGFyc2VyQ2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIExlZ2FjeVxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIHRoaXMubW9kZWxVcGRhdGVMaXN0ZW5lciA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5hZGRFdmVudExpc3RlbmVyKEV2ZW50cy5Nb2RlbFVwZGF0ZWQsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLm1vZGVsVXBkYXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTW9kZWwgVXBkYXRlIENhbGxiYWNrIGlzIG5vdCBhIEZ1bmN0aW9uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIFBhcnNlIFdpZGdldCBEYXRhXHJcbiAgICAgICAgdGhpcy5wYXJzZVdpZGdldHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghIV90aGlzLndpZGdldFBhcnNlckNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBmZXRjaCgnLi93aWRnZXRzLmpzb24nKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHsgcmV0dXJuIHJlcy5qc29uKCk7IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9ycyBpbiB3aWRnZXRzLmpzb24nKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jYWxsTGlzdGVuZXJzKEV2ZW50cy5XaWRnZXRzUGFyc2VkLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLndpZGdldFBhcnNlckxpc3RlbmVyID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnRzLldpZGdldHNQYXJzZWQsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLndpZGdldFBhcnNlckNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dpZGdldCBQYXJzZXIgQ2FsbGJhY2sgaXMgbm90IGEgRnVuY3Rpb24nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy4kc3RhdGUgPSB7IHN0YXRlOiBuZXcgQ2FyZFNES1N0YXRlKHt9LCB7fSksIHVwZGF0ZWRCeTogdGhpcy5pZCB9O1xyXG4gICAgICAgIHRoaXMubGlzdGVuVG9TREtzTWVzc2FnZXMoKTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDYXJkU0RLLnByb3RvdHlwZSwgXCJzdGF0ZUlkXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCIuY29uY2F0KHRoaXMudXBkYXRlZEF0LmdldFRpbWUoKSwgXCJfXCIpLmNvbmNhdCh0aGlzLnVwZGF0ZWRCeSB8fCAnJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENhcmRTREsucHJvdG90eXBlLCBcIiRzdGF0ZVwiLCB7XHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gX2Euc3RhdGUsIHVwZGF0ZWRCeSA9IF9hLnVwZGF0ZWRCeSwgdXBkYXRlZEF0ID0gX2EudXBkYXRlZEF0O1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZWRCeSA9IHVwZGF0ZWRCeTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVkQXQgPSB1cGRhdGVkQXQgfHwgbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgU1RBVEVbdGhpcy5zdGF0ZUlkXSA9IHN0YXRlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDYXJkU0RLLnByb3RvdHlwZSwgXCJzdGF0ZVwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBTVEFURVt0aGlzLnN0YXRlSWRdO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy4kc3RhdGUgPSB7IHN0YXRlOiBzdGF0ZSwgdXBkYXRlZEJ5OiB0aGlzLmlkIH07XHJcbiAgICAgICAgICAgIHRoaXMuaW5mb3JtSW5zdGFuY2VzKFNES19UWVBFUy5QYXJlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmluZm9ybUluc3RhbmNlcyhTREtfVFlQRVMuQ2hpbGQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIENhcmRTREsucHJvdG90eXBlLmxpc3RlblRvU0RLc01lc3NhZ2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSAoZXZlbnQgfHwgeyBkYXRhOiB7fSB9KS5kYXRhO1xyXG4gICAgICAgICAgICB2YXIgX2EgPSBkYXRhIHx8IHt9LCBhY3Rpb24gPSBfYS5hY3Rpb24sIHN0YXRlID0gX2Euc3RhdGUsIGZyb20gPSBfYS5mcm9tLCB0byA9IF9hLnRvO1xyXG4gICAgICAgICAgICBpZiAoX3RoaXMuaWQgPT09IGZyb20pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWN0aW9uOiBcIi5jb25jYXQoYWN0aW9uLCBcIiBjYW5jZWxlZCBzaW5jZSBpdCdzIHRoZSBzYW1lIGluc3RhbmNlXCIpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltzZGtdOiBIYW5kbGluZyBFdmVudDogXCIuY29uY2F0KEpTT04uc3RyaW5naWZ5KGV2ZW50LmRhdGEpKSk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEFDVElPTlMuSGFuZFNoYWtlOlxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNoaWxkcmVuLnB1c2goZnJvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaGFuZGxlSGFuZFNoYWtlKGZyb20pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBfdGhpcy5pZCA9PT0gdG8gJiYgQUNUSU9OUy5IYW5kU2hha2VTdWNjZXNzOlxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnBhcmVudCA9IGZyb207XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlZEJ5ID0gZnJvbTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3RhdGUgPSB7IHN0YXRlOiBzdGF0ZSwgdXBkYXRlZEJ5OiBmcm9tIH07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIGZyb20gIT09IF90aGlzLmlkICYmIEFDVElPTlMuVXBkYXRlU3RhdGU6XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlZEJ5ID0gZnJvbTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3RhdGUgPSB7IHN0YXRlOiBzdGF0ZSwgdXBkYXRlZEJ5OiBmcm9tIH07XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW5mb3JtSW5zdGFuY2VzKF90aGlzLnBhcmVudCA9PT0gZnJvbSA/IFNES19UWVBFUy5DaGlsZCA6IFNES19UWVBFUy5QYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm9uU3RhdGVVcGRhdGVkKF90aGlzLnN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgZnJvbSAhPT0gX3RoaXMuaWQgJiYgQUNUSU9OUy5HZXRDYXJkQ29uZmlnOlxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZWRCeSA9IGZyb207XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN0YXRlID0geyBzdGF0ZTogX19hc3NpZ24oX19hc3NpZ24oe30sIF90aGlzLnN0YXRlKSwgc3RhdGUpLCB1cGRhdGVkQnk6IGZyb20gfTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5sb2FkQ2FyZChfdGhpcy5zdGF0ZS5zdG9yZS5jYXJkSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBBQ1RJT05TLkxvY2FsQWN0aW9uOlxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRzdGF0ZSA9IHsgc3RhdGU6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBfdGhpcy5zdGF0ZSksIHN0YXRlKSwgdXBkYXRlZEJ5OiBmcm9tIH07XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2FsbExpc3RlbmVycyhFdmVudHMuTG9jYWxBY3Rpb25SZWNlaXZlZCwgX3RoaXMuc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBBQ1RJT05TLlN5c3RlbUFjdGlvbjpcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3RhdGUgPSB7IHN0YXRlOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgX3RoaXMuc3RhdGUpLCBzdGF0ZSksIHVwZGF0ZWRCeTogZnJvbSB9O1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNlbmRBY3Rpb25Ub1N5c3RlbShfdGhpcy5zdGF0ZS5zdG9yZS5hY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSB1bmRlZmluZWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmRhdGEgJiYgKGV2ZW50LmRhdGEuY29uZmlnIHx8IGV2ZW50LmRhdGEudG9rZW4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlxcbiAgICAgICAgICAgICAgW0RFUFJFQ0FUSU9OIFdBUk5JTkddXFxuXFxuICAgICAgICAgICAgICBbQ0FSRCBTREtdOiBkZWFsaW5nIHdpdGggbWVzc2FnZXMgd2l0aG91dCBhIGFjdGlvbiBuYW1lIGlzIGRlcHJlY2F0ZWQsXFxuICAgICAgICAgICAgICBzbyBwbGVhc2UgdXNlIHByZSBkZWZpbmVkIG1lc3NhZ2UgYWN0aW9uIG9yIHVzZSBzZXR0aW5nIHN0YXRlIGFuZCBtZXRob2RzXFxuICAgICAgICAgICAgICBkaXJlY3RseSB0byBoYW5kbGUgaW1wb3J0IGNhcmQgc2V0dGluZ3MuXFxuICAgICAgICAgICAgICB5b3UgY2FuIHVzZSBlaXRoZXIgXCIuY29uY2F0KEFDVElPTlMuR2V0TGF5b3V0QnlJZCwgXCIsIGFuZCBcIikuY29uY2F0KEFDVElPTlMuU2V0TGF5b3V0Q29uZmlnLCBcIlxcbiAgICAgICAgICAgIFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaGFuZGxlTGVnYWN5TWVzc2FnZShldmVudC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tTREtdIFVua25vd24gYWN0aW9uOiAnLCB7IGFjdGlvbjogYWN0aW9uLCBmcm9tOiBmcm9tLCB0bzogdG8gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBDYXJkU0RLLnByb3RvdHlwZS5pbmZvcm1JbnN0YW5jZXMgPSBmdW5jdGlvbiAoc2RrVHlwZSkge1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gbmV3IENhcmRTREtNZXNzYWdlKEFDVElPTlMuVXBkYXRlU3RhdGUsIHRoaXMuc3RhdGUsIHRoaXMuaWQpO1xyXG4gICAgICAgIHZhciBmcmFtZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpZnJhbWUnKTtcclxuICAgICAgICBpZiAoc2RrVHlwZSA9PT0gU0RLX1RZUEVTLkNoaWxkKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSAoZnJhbWVzIHx8IFtdKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBmcmFtZSA9IF9hW19pXTtcclxuICAgICAgICAgICAgICAgIGZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UobWVzc2FnZSwgJyonKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh3aW5kb3cucGFyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShtZXNzYWdlLCAnKicpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBDYXJkU0RLLnByb3RvdHlwZS5oYW5kbGVIYW5kU2hha2UgPSBmdW5jdGlvbiAodG8pIHtcclxuICAgICAgICB2YXIgbWVzc2FnZSA9IG5ldyBDYXJkU0RLTWVzc2FnZShBQ1RJT05TLkhhbmRTaGFrZVN1Y2Nlc3MsIHRoaXMuc3RhdGUsIHRoaXMuaWQsIHRvKTtcclxuICAgICAgICB2YXIgZnJhbWVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaWZyYW1lJyk7XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IChmcmFtZXMgfHwgW10pOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICB2YXIgZnJhbWUgPSBfYVtfaV07XHJcbiAgICAgICAgICAgIGZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UobWVzc2FnZSwgJyonKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgQ2FyZFNESy5wcm90b3R5cGUuaGFuZFNoYWtlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cucGFyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShuZXcgQ2FyZFNES01lc3NhZ2UoQUNUSU9OUy5IYW5kU2hha2UsIG51bGwsIHRoaXMuaWQpLCAnKicpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBDYXJkU0RLLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKG1lZGlhSWQpIHtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLnN0YXRlLmNvbmZpZywgYmFzZVVybCA9IF9hLmJhc2VVcmwsIG9yZ2FuaXphdGlvbklkID0gX2Eub3JnYW5pemF0aW9uSWQsIHRva2VuID0gX2EudG9rZW47XHJcbiAgICAgICAgZmV0Y2goXCJcIi5jb25jYXQoYmFzZVVybCwgXCIvYXBpL21lZGlhL1wiKS5jb25jYXQob3JnYW5pemF0aW9uSWQsIFwiL1wiKS5jb25jYXQobWVkaWFJZCwgXCI/dG9rZW49XCIpLmNvbmNhdCh0b2tlbikpO1xyXG4gICAgfTtcclxuICAgIENhcmRTREsucHJvdG90eXBlLmxvYWRDYXJkSW5GcmFtZSA9IGZ1bmN0aW9uIChjYXJkSWQsIGlmcmFtZVdpbmRvdykge1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gbmV3IENhcmRTREtNZXNzYWdlKEFDVElPTlMuR2V0Q2FyZENvbmZpZywgeyBzdG9yZTogeyBjYXJkSWQ6IGNhcmRJZCB9IH0sIHRoaXMuaWQpO1xyXG4gICAgICAgIGlmcmFtZVdpbmRvdy5wb3N0TWVzc2FnZShtZXNzYWdlLCAnKicpO1xyXG4gICAgfTtcclxuICAgIENhcmRTREsucHJvdG90eXBlLmxvYWRDYXJkID0gZnVuY3Rpb24gKGNhcmRJZCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIF9hID0gdGhpcy5zdGF0ZS5jb25maWcsIGJhc2VVcmwgPSBfYS5iYXNlVXJsLCB0b2tlbiA9IF9hLnRva2VuO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHsgY2FyZElkLCBmcmFtZSwgYmFzZVVybCwgc3RhdGU6IHRoaXMuc3RhdGV9KTtcclxuICAgICAgICBmZXRjaChcIlwiLmNvbmNhdChiYXNlVXJsLCBcIi9jYXJkcy9cIikuY29uY2F0KGNhcmRJZCwgXCI/dG9rZW49XCIpLmNvbmNhdCh0b2tlbikpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHsgcmV0dXJuIHJlcy5qc29uKCk7IH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHsgcmV0dXJuIHJlcy5jYXJkOyB9KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IF9hLmNvbmZpZztcclxuICAgICAgICAgICAgdmFsaWRhdGVBdHRhY2htZW50cyhjb25maWcuaW5wdXRzLCBjb25maWcuYXR0YWNobWVudHMsIF90aGlzLnN0YXRlKS50aGVuKGZ1bmN0aW9uIChhdHRhY2htZW50cykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY29uZmlnKSwgeyBhdHRhY2htZW50czogYXR0YWNobWVudHMgfSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5sYXN0Q29uZmlnID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmNhbGxMaXN0ZW5lcnMoRXZlbnRzLk1vZGVsVXBkYXRlZCwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMubGFzdENvbmZpZztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xyXG4gICAgfTtcclxuICAgIENhcmRTREsucHJvdG90eXBlLmxvYWRNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCgnLi9tb2RlbC5qc29uJylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykgeyByZXR1cm4gcmVzLmpzb24oKTsgfSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjb25maWcsIHR5cGVvZiBjb25maWcpO1xyXG4gICAgICAgICAgICB2YWxpZGF0ZUF0dGFjaG1lbnRzKGNvbmZpZy5pbnB1dHMsIGNvbmZpZy5hdHRhY2htZW50cywgX3RoaXMuc3RhdGUpLnRoZW4oZnVuY3Rpb24gKGF0dGFjaG1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBjb25maWcpLCB7IGF0dGFjaG1lbnRzOiBhdHRhY2htZW50cyB9KTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmxhc3RDb25maWcgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuY2FsbExpc3RlbmVycyhFdmVudHMuTW9kZWxVcGRhdGVkLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5sYXN0Q29uZmlnO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIENhcmRTREsucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAodG9waWMsIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgbGlzdGVuZXJJZCA9IERhdGUubm93KCkudG9TdHJpbmcoMzIpICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCkudG9TdHJpbmcoMzIpO1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3RvcGljXSA9IHRoaXMubGlzdGVuZXJzW3RvcGljXSB8fCB7fTtcclxuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0b3BpY11bbGlzdGVuZXJJZF0gPSBsaXN0ZW5lcjtcclxuICAgICAgICB0aGlzLmxpc3RlbmVyQ2FsbGJhY2tzID0gT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpLnJlZHVjZShmdW5jdGlvbiAoY2FsbGJhY2tzLCBrZXkpIHtcclxuICAgICAgICAgICAgdmFyIGdyb3VwID0gX3RoaXMubGlzdGVuZXJzW2tleV0gfHwge307XHJcbiAgICAgICAgICAgIGNhbGxiYWNrc1trZXldID0gT2JqZWN0LnZhbHVlcyhncm91cCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFja3M7XHJcbiAgICAgICAgfSwge30pO1xyXG4gICAgICAgIHJldHVybiBsaXN0ZW5lcklkO1xyXG4gICAgfTtcclxuICAgIENhcmRTREsucHJvdG90eXBlLmNhbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbiAodG9waWMsIGRhdGEpIHtcclxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lckNhbGxiYWNrcyB8fCB7fTtcclxuICAgICAgICB2YXIgY2FsbGJhY2tzID0gbGlzdGVuZXJzW3RvcGljXSB8fCBbXTtcclxuICAgICAgICBjYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBDYXJkU0RLLnByb3RvdHlwZS5oYW5kbGVMZWdhY3lNZXNzYWdlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciB0b2tlbiA9IGRhdGEudG9rZW4sIHByb2ZpbGUgPSBkYXRhLnByb2ZpbGUsIGJhc2VVcmwgPSBkYXRhLmJhc2VVcmwsIG9yZ2FuaXphdGlvbklkID0gZGF0YS5vcmdhbml6YXRpb25JZCwgaXBBZGRyZXNzID0gZGF0YS5pcEFkZHJlc3MsIF9hID0gZGF0YS5jdXN0b21EYXRhLCBjdXN0b21EYXRhID0gX2EgPT09IHZvaWQgMCA/IHt9IDogX2E7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IGRhdGEgPT09IG51bGwgfHwgZGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGF0YS5jb25maWc7XHJcbiAgICAgICAgdmFyIHN0YXRlID0gbmV3IENhcmRTREtTdGF0ZShfX2Fzc2lnbih7fSwgdGhpcy5zdGF0ZS5zdG9yZSksIHtcclxuICAgICAgICAgICAgdG9rZW46IHRva2VuLFxyXG4gICAgICAgICAgICBiYXNlVXJsOiBiYXNlVXJsLFxyXG4gICAgICAgICAgICBpcEFkZHJlc3M6IGlwQWRkcmVzcyxcclxuICAgICAgICAgICAgb3JnYW5pemF0aW9uSWQ6IChwcm9maWxlID09PSBudWxsIHx8IHByb2ZpbGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByb2ZpbGUub3JnYW5pemF0aW9uSWQpIHx8IG9yZ2FuaXphdGlvbklkLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlZEJ5ID0gdGhpcy5pZDtcclxuICAgICAgICB0aGlzLiRzdGF0ZSA9IHsgc3RhdGU6IHN0YXRlLCB1cGRhdGVkQnk6IHRoaXMuaWQgfTtcclxuICAgICAgICB0aGlzLmluZm9ybUluc3RhbmNlcyhTREtfVFlQRVMuQ2hpbGQpO1xyXG4gICAgICAgIGlmIChjb25maWcpIHtcclxuICAgICAgICAgICAgdmFsaWRhdGVBdHRhY2htZW50cyhjb25maWcuaW5wdXRzLCBjb25maWcuYXR0YWNobWVudHMsIHRoaXMuc3RhdGUpLnRoZW4oZnVuY3Rpb24gKGF0dGFjaG1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBjb25maWcpLCB7IGF0dGFjaG1lbnRzOiBhdHRhY2htZW50cyB9KTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmxhc3RDb25maWcgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuY2FsbExpc3RlbmVycyhFdmVudHMuTW9kZWxVcGRhdGVkLCBkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIENhcmRTREsucHJvdG90eXBlLnNlbmRBY3Rpb25Ub1N5c3RlbSA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBJUEFkZHJlc3MgPSBhY3Rpb24udGFyZ2V0ID8gUHJvbWlzZS5yZXNvbHZlKGFjdGlvbi50YXJnZXQpIDogdGhpcy5nZXREZXZpY2VJUCgpO1xyXG4gICAgICAgIElQQWRkcmVzcy50aGVuKGZ1bmN0aW9uIChkZXZpY2VJUCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmV0Y2goXCJcIi5jb25jYXQoX3RoaXMuc3RhdGUuY29uZmlnLmJhc2VVcmwsIFwiL2FjdGlvbj90b2tlbj1cIikuY29uY2F0KF90aGlzLnN0YXRlLmNvbmZpZy50b2tlbiksIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL0pTT04nIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGFjdGlvbjogYWN0aW9uLCBkZXZpY2VJUDogZGV2aWNlSVAgfSksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIENhcmRTREsucHJvdG90eXBlLmdldERldmljZUlQID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIF9hLCBfYjtcclxuICAgICAgICB2YXIgZGV2aWNlSVAgPSAoKF9iID0gKF9hID0gdGhpcy5zdGF0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNvbmZpZykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmlwQWRkcmVzcykgfHwgdGhpcy5kZXZpY2VJUDtcclxuICAgICAgICByZXR1cm4gZGV2aWNlSVBcclxuICAgICAgICAgICAgPyBQcm9taXNlLnJlc29sdmUoZGV2aWNlSVApXHJcbiAgICAgICAgICAgIDogZmV0Y2goJ2h0dHBzOi8vYXBpLmlwaWZ5Lm9yZz9mb3JtYXQ9anNvbiZjYWxsYmFjaz0/JylcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHsgcmV0dXJuIHJlcy5qc29uKCk7IH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5kZXZpY2VJUCA9IHJlcyAmJiByZXMuaXA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzICYmIHJlcy5pcDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIENhcmRTREs7XHJcbn0oKSk7XHJcbmV4cG9ydCB7IENhcmRTREsgfTtcclxuIiwidmFyIENhcmRTREtTdGF0ZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENhcmRTREtTdGF0ZShzdG9yZSwgY29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIENhcmRTREtTdGF0ZTtcclxufSgpKTtcclxuZXhwb3J0IHsgQ2FyZFNES1N0YXRlIH07XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcclxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTcmNVcmxGcm9tTWVkaWEoYXR0YWNobWVudCwgc3RhdGUpIHtcclxuICAgIHZhciBfYSA9IHN0YXRlLmNvbmZpZywgdG9rZW4gPSBfYS50b2tlbiwgb3JnYW5pemF0aW9uSWQgPSBfYS5vcmdhbml6YXRpb25JZCwgYmFzZVVybCA9IF9hLmJhc2VVcmw7XHJcbiAgICB2YXIgc3JjID0gXCJcIi5jb25jYXQoYmFzZVVybCwgXCIvbWVkaWEvZG93bmxvYWQvXCIpLmNvbmNhdChhdHRhY2htZW50LmlkLCBcIj90b2tlbj1cIikuY29uY2F0KHRva2VuKTtcclxuICAgIHZhciBpZnJhbWVTcmMgPSBcIlwiLmNvbmNhdChiYXNlVXJsLCBcIi9tZWRpYS9wcmV2aWV3L1wiKS5jb25jYXQob3JnYW5pemF0aW9uSWQsIFwiL1wiKS5jb25jYXQoYXR0YWNobWVudCA9PT0gbnVsbCB8fCBhdHRhY2htZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhdHRhY2htZW50LmlkLCBcIi9cIik7XHJcbiAgICB2YXIgdGVtcFNyYyA9IFwiXCIuY29uY2F0KGJhc2VVcmwsIFwiL21lZGlhL3ByZXZpZXcvXCIpLmNvbmNhdChvcmdhbml6YXRpb25JZCwgXCIvdGVtcGxhdGVcIikuY29uY2F0KGF0dGFjaG1lbnQgPT09IG51bGwgfHwgYXR0YWNobWVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogYXR0YWNobWVudC5pZCwgXCIvXCIpO1xyXG4gICAgaWYgKCFhdHRhY2htZW50Lm1pbWV0eXBlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRlbXBTcmM7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhdHRhY2htZW50Lm1pbWV0eXBlLnN0YXJ0c1dpdGgoJ2FwcGxpY2F0aW9uLycpKSB7XHJcbiAgICAgICAgcmV0dXJuIGlmcmFtZVNyYztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzcmM7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQXR0YWNobWVudHMoaW5wdXRzLCBhdHRhY2htZW50cywgc3RhdGUpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICB2YXIgX2EgPSBzdGF0ZS5jb25maWcsIHRva2VuID0gX2EudG9rZW4sIGJhc2VVcmwgPSBfYS5iYXNlVXJsO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZhbGlkYXRlZEF0dGFjaG1lbnRzLCBhdHRhY2htZW50c0ZpZWxkcywgX2xvb3BfMSwgX2ksIGF0dGFjaG1lbnRzRmllbGRzXzEsIGF0dGFjaG1lbnRGaWVsZDtcclxuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZWRBdHRhY2htZW50cyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRzRmllbGRzID0gT2JqZWN0LmtleXMoYXR0YWNobWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIF9sb29wXzEgPSBmdW5jdGlvbiAoYXR0YWNobWVudEZpZWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCwgYXR0YWNobWVudElkcywgaSwgbWVkaWFJZCwgZHVyYXRpb24sIGF0dGFjaG1lbnRXaXRoU3JjLCBhdHRhY2htZW50UmVzLCBlcnJfMSwgYXR0YWNobWVudEpzb24sIGF0dGFjaG1lbnRXaXRoU3JjO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZCA9IGlucHV0cy5maW5kKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4ICYmIHgubmFtZSA9PT0gYXR0YWNobWVudEZpZWxkOyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNobWVudElkcyA9IChmaWVsZCAmJiBmaWVsZC52YWx1ZSkgfHwgW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlZEF0dGFjaG1lbnRzW2F0dGFjaG1lbnRGaWVsZF0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKGkgPCBhdHRhY2htZW50SWRzLmxlbmd0aCkpIHJldHVybiBbMyAvKmJyZWFrKi8sIDEwXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVkaWFJZCA9IHR5cGVvZiBhdHRhY2htZW50SWRzW2ldID09PSAnb2JqZWN0JyA/IGF0dGFjaG1lbnRJZHNbaV0ubWVkaWFJZCA6IGF0dGFjaG1lbnRJZHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gdHlwZW9mIGF0dGFjaG1lbnRJZHNbaV0gPT09ICdvYmplY3QnID8gYXR0YWNobWVudElkc1tpXS5kdXJhdGlvbiA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShBcnJheS5pc0FycmF5KGF0dGFjaG1lbnRzW2F0dGFjaG1lbnRGaWVsZF0pICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2htZW50c1thdHRhY2htZW50RmllbGRdW2ldICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2htZW50c1thdHRhY2htZW50RmllbGRdW2ldLmlkID09PSBtZWRpYUlkKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRXaXRoU3JjID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGF0dGFjaG1lbnRzW2F0dGFjaG1lbnRGaWVsZF1baV0pLCB7IGR1cmF0aW9uOiBkdXJhdGlvbiwgc3JjVVJMOiBnZXRTcmNVcmxGcm9tTWVkaWEoYXR0YWNobWVudHNbYXR0YWNobWVudEZpZWxkXVtpXSwgc3RhdGUpIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZWRBdHRhY2htZW50c1thdHRhY2htZW50RmllbGRdLnB1c2goYXR0YWNobWVudFdpdGhTcmMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghISFhdHRhY2htZW50SWRzW2ldKSByZXR1cm4gWzMgLypicmVhayovLCA4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNobWVudFJlcyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSAzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2IudHJ5cy5wdXNoKFszLCA1LCAsIDZdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZmV0Y2goXCJcIi5jb25jYXQoYmFzZVVybCwgXCIvbWVkaWEvXCIpLmNvbmNhdChtZWRpYUlkLCBcIj90b2tlbj1cIikuY29uY2F0KHRva2VuKSldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNobWVudFJlcyA9IF9iLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJfMSA9IF9iLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVkQXR0YWNobWVudHNbYXR0YWNobWVudEZpZWxkXS5wdXNoKHt9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgOV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4gWzQgLyp5aWVsZCovLCBhdHRhY2htZW50UmVzLmpzb24oKV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2htZW50SnNvbiA9IF9iLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNobWVudFdpdGhTcmMgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYXR0YWNobWVudEpzb24ubWVkaWEpLCB7IGR1cmF0aW9uOiBkdXJhdGlvbiwgc3JjVVJMOiBnZXRTcmNVcmxGcm9tTWVkaWEoYXR0YWNobWVudEpzb24ubWVkaWEsIHN0YXRlKSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVkQXR0YWNobWVudHNbYXR0YWNobWVudEZpZWxkXS5wdXNoKGF0dGFjaG1lbnRXaXRoU3JjKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgOV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZWRBdHRhY2htZW50c1thdHRhY2htZW50RmllbGRdLnB1c2goe30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTA6IHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBfaSA9IDAsIGF0dGFjaG1lbnRzRmllbGRzXzEgPSBhdHRhY2htZW50c0ZpZWxkcztcclxuICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDE7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoX2kgPCBhdHRhY2htZW50c0ZpZWxkc18xLmxlbmd0aCkpIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRGaWVsZCA9IGF0dGFjaG1lbnRzRmllbGRzXzFbX2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNSAvKnlpZWxkKiovLCBfbG9vcF8xKGF0dGFjaG1lbnRGaWVsZCldO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDM7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgX2krKztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAxXTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHZhbGlkYXRlZEF0dGFjaG1lbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pOyB9KTtcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IENhcmRTREsgfSBmcm9tICcuL3Nkayc7XHJcbmltcG9ydCB7IHZhbGlkYXRlQXR0YWNobWVudHMgfSBmcm9tIFwiLi91dGlsc1wiO1xyXG52YXIgJFNESyA9IG5ldyBDYXJkU0RLKCk7XHJcbiRTREsuaGFuZFNoYWtlKCk7XHJcbndpbmRvdy4kU0RLID0gJFNESztcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJyRjYXJkU0RLJywge1xyXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICRTREs7XHJcbiAgICB9LFxyXG59KTtcclxud2luZG93LnZhbGlkYXRlQXR0YWNobWVudHMgPSB2YWxpZGF0ZUF0dGFjaG1lbnRzO1xyXG5leHBvcnQgZGVmYXVsdCBDYXJkU0RLO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
