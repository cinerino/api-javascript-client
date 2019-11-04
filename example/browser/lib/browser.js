(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var cinerino = window.cinerino = require('./lib/index.js');
},{"./lib/index.js":11}],2:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Abstract API Client
 */
__export(require("@cinerino/api-abstract-client"));

},{"@cinerino/api-abstract-client":79}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * authorize error
 */
var AuthorizeError = /** @class */ (function (_super) {
    __extends(AuthorizeError, _super);
    function AuthorizeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AuthorizeError;
}(Error));
exports.AuthorizeError = AuthorizeError;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createDebug = require("debug");
var debug = createDebug('cinerino-api:auth:iframeHandler');
/**
 * IframeHandler
 */
var IframeHandler = /** @class */ (function () {
    function IframeHandler(options) {
        this.url = options.url;
        this.callback = options.callback;
        // tslint:disable-next-line:no-magic-numbers
        this.timeout = (options.timeout !== undefined) ? options.timeout : 60 * 1000;
        this.timeoutCallback = (options.timeoutCallback !== undefined) ? options.timeoutCallback : null;
        this.eventListenerType = (options.eventListenerType !== undefined) ? options.eventListenerType : 'message';
        this.iframe = null;
        this.timeoutHandle = null;
        this.destroyTimeout = null;
        this.proxyEventListener = null;
        // If no event identifier specified, set default
        this.eventValidator = (options.eventValidator !== undefined) ? options.eventValidator : {
            isValid: function () {
                return true;
            }
        };
        if (typeof this.callback !== 'function') {
            throw new Error('options.callback must be a function');
        }
    }
    IframeHandler.prototype.init = function () {
        var _this = this;
        debug('opening iframe...', this.eventListenerType);
        this.iframe = window.document.createElement('iframe');
        this.iframe.style.display = 'none';
        this.iframe.src = this.url;
        // Workaround to avoid using bind that does not work in IE8
        this.proxyEventListener = function (e) {
            _this.eventListener(e);
        };
        switch (this.eventListenerType) {
            case 'message':
                this.eventSourceObject = window;
                break;
            case 'load':
                this.eventSourceObject = this.iframe;
                break;
            default:
                throw new Error("Unsupported event listener type: " + this.eventListenerType);
        }
        this.eventSourceObject.addEventListener(this.eventListenerType, this.proxyEventListener, false);
        window.document.body.appendChild(this.iframe);
        this.timeoutHandle = setTimeout(function () {
            _this.timeoutHandler();
        }, this.timeout);
    };
    IframeHandler.prototype.eventListener = function (event) {
        var eventData = { event: event, sourceObject: this.eventSourceObject };
        this.destroy();
        this.callback(eventData);
    };
    IframeHandler.prototype.timeoutHandler = function () {
        this.destroy();
        if (this.timeoutCallback) {
            this.timeoutCallback();
        }
    };
    IframeHandler.prototype.destroy = function () {
        var _this = this;
        clearTimeout(this.timeoutHandle);
        this.destroyTimeout = setTimeout(function () {
            _this.eventSourceObject.removeEventListener(_this.eventListenerType, _this.proxyEventListener, false);
            window.document.body.removeChild(_this.iframe);
        }, 0);
    };
    return IframeHandler;
}());
exports.default = IframeHandler;

},{"debug":244}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var createDebug = require("debug");
var qs = require("qs");
var ErrorFactory = require("./error");
var popupAuthenticationHandler_1 = require("./popupAuthenticationHandler");
var silentAuthenticationHandler_1 = require("./silentAuthenticationHandler");
var silentLogoutHandler_1 = require("./silentLogoutHandler");
// tslint:disable-next-line:no-require-imports no-var-requires
var idTokenVerifier = require('idtoken-verifier');
var oAuth2client_1 = require("./oAuth2client");
var debug = createDebug('cinerino-api:auth:implicitGrantClient');
/**
 * OAuth2 client using grant type 'implicit grant'
 */
var ImplicitGrantClient = /** @class */ (function (_super) {
    __extends(ImplicitGrantClient, _super);
    function ImplicitGrantClient(options) {
        // assert.check(
        //     options,
        //     { type: 'object', message: 'options parameter is not valid' },
        //     {
        //         domain: { type: 'string', message: 'domain option is required' },
        //         clientId: { type: 'string', message: 'clientId option is required' },
        //         responseType: { optional: true, type: 'string', message: 'responseType is not valid' },
        //         responseMode: { optional: true, type: 'string', message: 'responseMode is not valid' },
        //         redirectUri: { optional: true, type: 'string', message: 'redirectUri is not valid' },
        //         scope: { optional: true, type: 'string', message: 'scope is not valid' },
        //         audience: { optional: true, type: 'string', message: 'audience is not valid' }
        //     }
        // );
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.options.responseMode = 'fragment';
        _this.options.responseType = 'token';
        // amazon cognitoの認可サーバーはnonce未実装
        _this.options.nonce = null;
        debug('options:', _this.options);
        _this.credentials = {};
        return _this;
    }
    ImplicitGrantClient.BUILD_PASRSE_HASH_RESPONS = function (qsParams, __, idTokenPayload) {
        return {
            accessToken: qsParams.access_token,
            idToken: qsParams.id_token,
            idTokenPayload: idTokenPayload,
            refreshToken: qsParams.refresh_token,
            state: qsParams.state,
            // tslint:disable-next-line:no-magic-numbers
            expiresIn: qsParams.expires_in ? parseInt(qsParams.expires_in, 10) : undefined,
            tokenType: qsParams.token_type
        };
    };
    ImplicitGrantClient.prototype.isSignedIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.refreshToken()
                        .then(function (result) { return result; })
                        .catch(function () { return null; })];
            });
        });
    };
    ImplicitGrantClient.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.credentials.accessToken === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refreshAccessToken()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.credentials.accessToken];
                }
            });
        });
    };
    ImplicitGrantClient.prototype.refreshAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.credentials.refreshToken === undefined) {
                    throw new Error('not authorized yet');
                }
                return [2 /*return*/, this.refreshToken()];
            });
        });
    };
    /**
     * Executes a silent authentication transaction under the hood in order to fetch a new tokens for the current session.
     */
    ImplicitGrantClient.prototype.refreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usePostMessage, params, handler, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usePostMessage = false;
                        params = {
                            clientId: this.options.clientId,
                            responseType: this.options.responseType,
                            responseMode: this.options.responseMode,
                            prompt: 'none',
                            redirectUri: this.options.redirectUri,
                            scope: this.options.scope,
                            state: this.options.state,
                            nonce: this.options.nonce
                        };
                        handler = silentAuthenticationHandler_1.default.CREATE({
                            authenticationUrl: this.buildAuthorizeUrl(params)
                        });
                        return [4 /*yield*/, handler.login(usePostMessage)];
                    case 1:
                        hash = _a.sent();
                        return [2 /*return*/, this.onLogin(hash)];
                }
            });
        });
    };
    /**
     * Redirects to the hosted login page (`/authorize`) in order to start a new authN/authZ transaction.
     */
    ImplicitGrantClient.prototype.signIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usePostMessage, params, handler, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usePostMessage = true;
                        params = {
                            clientId: this.options.clientId,
                            responseType: this.options.responseType,
                            responseMode: this.options.responseMode,
                            prompt: '',
                            redirectUri: this.options.redirectUri,
                            scope: this.options.scope,
                            state: this.options.state,
                            nonce: this.options.nonce
                        };
                        handler = popupAuthenticationHandler_1.default.CREATE({
                            authenticationUrl: this.buildAuthorizeUrl(params)
                        });
                        return [4 /*yield*/, handler.login(usePostMessage)];
                    case 1:
                        hash = _a.sent();
                        return [2 /*return*/, this.onLogin(hash)];
                }
            });
        });
    };
    /**
     * Redirects to the auth0 logout endpoint
     */
    ImplicitGrantClient.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usePostMessage, handler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usePostMessage = false;
                        handler = silentLogoutHandler_1.default.CREATE({
                            logoutUrl: this.buildLogoutUrl({
                                clientId: this.options.clientId,
                                logoutUri: this.options.logoutUri
                            })
                        });
                        return [4 /*yield*/, handler.logout(usePostMessage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ImplicitGrantClient.prototype.onLogin = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        debug('onLogin');
                        // hash was already parsed, so we just return it.
                        _a = this;
                        if (!(typeof hash === 'object')) return [3 /*break*/, 1];
                        _b = hash;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.parseHash(hash)];
                    case 2:
                        _b = _c.sent();
                        _c.label = 3;
                    case 3:
                        // hash was already parsed, so we just return it.
                        _a.credentials = _b;
                        debug('credentials:', this.credentials);
                        return [2 /*return*/, this.credentials];
                }
            });
        });
    };
    ImplicitGrantClient.prototype.parseHash = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var hashStr, parsedQs, err, payload, verifier, decodedToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hashStr = hash === undefined ? window.location.hash : hash;
                        hashStr = hashStr.replace(/^#?\/?/, '');
                        parsedQs = qs.parse(hashStr);
                        // if authorization falied
                        if (parsedQs.hasOwnProperty('error')) {
                            err = new ErrorFactory.AuthorizeError(parsedQs.error_description);
                            err.error = parsedQs.error;
                            err.errorDescription = parsedQs.error_description;
                            err.state = parsedQs.state;
                            throw err;
                        }
                        if (!parsedQs.hasOwnProperty('access_token') &&
                            !parsedQs.hasOwnProperty('id_token') &&
                            !parsedQs.hasOwnProperty('refresh_token')) {
                            throw new Error('invalid hash');
                        }
                        if (!parsedQs.id_token) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateToken(parsedQs.id_token, this.options.nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, ImplicitGrantClient.BUILD_PASRSE_HASH_RESPONS(parsedQs, '', payload)];
                    case 2:
                        if (parsedQs.id_token) {
                            verifier = new idTokenVerifier({
                                issuer: this.options.tokenIssuer,
                                audience: this.options.clientId
                            });
                            decodedToken = verifier.decode(parsedQs.id_token);
                            return [2 /*return*/, ImplicitGrantClient.BUILD_PASRSE_HASH_RESPONS(parsedQs, '', decodedToken.payload)];
                        }
                        else {
                            return [2 /*return*/, ImplicitGrantClient.BUILD_PASRSE_HASH_RESPONS(parsedQs, '', null)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Decodes the a JWT and verifies its nonce value
     */
    ImplicitGrantClient.prototype.validateToken = function (token, nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                debug('validating id_token...');
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var verifier = new idTokenVerifier({
                            issuer: _this.options.tokenIssuer,
                            audience: _this.options.clientId
                        });
                        verifier.verify(token, nonce, function (err, payload) {
                            debug('id_token verified', err, payload);
                            if (err !== null) {
                                reject(err);
                                return;
                            }
                            resolve(payload);
                        });
                    })];
            });
        });
    };
    ImplicitGrantClient.prototype.buildAuthorizeUrl = function (options) {
        var qString = qs.stringify({
            client_id: options.clientId,
            response_type: options.responseType,
            redirect_uri: options.redirectUri,
            response_mode: options.responseMode,
            scope: options.scope,
            state: options.state,
            nonce: options.nonce,
            prompt: options.prompt
        });
        return "https://" + this.options.domain + ImplicitGrantClient.AUTHORIZE_URL + "?" + qString;
    };
    /**
     * Builds and returns the Logout url in order to initialize a new authN/authZ transaction
     * If you want to navigate the user to a specific URL after the logout,
     * set that URL at the returnTo parameter. The URL should be included in any the appropriate Allowed Logout URLs list:
     */
    ImplicitGrantClient.prototype.buildLogoutUrl = function (options) {
        var qString = qs.stringify({
            client_id: options.clientId,
            logout_uri: options.logoutUri
        });
        return "https://" + this.options.domain + ImplicitGrantClient.LOGOUT_URL + "?" + qString;
    };
    ImplicitGrantClient.AUTHORIZE_URL = '/authorize';
    ImplicitGrantClient.LOGOUT_URL = '/logout';
    return ImplicitGrantClient;
}(oAuth2client_1.default));
exports.ImplicitGrantClient = ImplicitGrantClient;

},{"./error":3,"./oAuth2client":6,"./popupAuthenticationHandler":7,"./silentAuthenticationHandler":9,"./silentLogoutHandler":10,"debug":244,"idtoken-verifier":247,"qs":252}],6:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var createDebug = require("debug");
var httpStatus = require("http-status");
var fetch = require("isomorphic-fetch");
var abstract_1 = require("../abstract");
var debug = createDebug('cinerino-api:auth:oAuth2client');
/**
 * OAuth2 client
 */
var OAuth2client = /** @class */ (function () {
    function OAuth2client(options) {
        this.options = options;
        this.credentials = {};
    }
    /**
     * OAuthクライアントに認証情報をセットします。
     */
    OAuth2client.prototype.setCredentials = function (credentials) {
        this.credentials = credentials;
    };
    OAuth2client.prototype.refreshAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.credentials.refreshToken === undefined) {
                    throw new Error('No refresh token is set.');
                }
                return [2 /*return*/, this.refreshToken(this.credentials.refreshToken)
                        .then(function (tokens) {
                        debug('setting credentials...', tokens);
                        _this.credentials = tokens;
                        return _this.credentials;
                    })];
            });
        });
    };
    /**
     * 期限の切れていないアクセストークンを取得します。
     * 必要であれば更新してから取得します。
     */
    OAuth2client.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var expiryDate, isTokenExpired, shouldRefresh, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expiryDate = this.credentials.expiryDate;
                        isTokenExpired = (expiryDate !== undefined) ? (expiryDate <= (new Date()).getTime()) : false;
                        if (this.credentials.accessToken === undefined && this.credentials.refreshToken === undefined) {
                            throw new Error('No access or refresh token is set.');
                        }
                        shouldRefresh = (this.credentials.accessToken === undefined) || isTokenExpired;
                        if (!(shouldRefresh && this.credentials.refreshToken !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refreshAccessToken()];
                    case 1:
                        tokens = _a.sent();
                        return [2 /*return*/, tokens.accessToken];
                    case 2: return [2 /*return*/, this.credentials.accessToken];
                }
            });
        });
    };
    /**
     * Provides a request implementation with OAuth 2.0 flow.
     * If credentials have a refresh_token, in cases of HTTP
     * 401 and 403 responses, it automatically asks for a new
     * access token and replays the unsuccessful request.
     * @param options Request options.
     */
    OAuth2client.prototype.fetch = function (url, options, expectedStatusCodes) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        accessToken = _a.sent();
                        options.headers = (options.headers === undefined || options.headers === null) ? {} : options.headers;
                        options.headers.Authorization = "Bearer " + accessToken;
                        return [2 /*return*/, this.makeRequest(url, options, expectedStatusCodes)];
                }
            });
        });
    };
    /**
     * Refreshes the access token.
     */
    OAuth2client.prototype.refreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, options;
            var _this = this;
            return __generator(this, function (_a) {
                // request for new token
                debug('refreshing access token...');
                formData = new FormData();
                formData.set('refresh_token', refreshToken);
                formData.set('client_id', this.options.clientId);
                formData.set('client_secret', this.options.clientSecret);
                formData.set('grant_type', 'refresh_token');
                options = {
                    method: 'POST',
                    body: formData
                };
                return [2 /*return*/, fetch("https://" + this.options.domain + "/token", options)
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var body, err, tokens;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(response.status !== httpStatus.OK)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, response.json()];
                                case 1:
                                    body = _a.sent();
                                    if (typeof body === 'object' && body.errors !== undefined) {
                                        err = new abstract_1.transporters.RequestError(body.errors.map(function (error) { return error.title + ":" + error.detail; }).join('\n'));
                                        err.code = response.status;
                                        err.errors = body.errors;
                                    }
                                    throw new Error('An unexpected error occurred');
                                case 2: return [4 /*yield*/, response.json()];
                                case 3:
                                    tokens = _a.sent();
                                    if (tokens && tokens.expires_in) {
                                        // tslint:disable-next-line:no-magic-numbers
                                        tokens.expiry_date = ((new Date()).getTime() + (tokens.expires_in * 1000));
                                        delete tokens.expires_in;
                                    }
                                    return [2 /*return*/, tokens];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Makes a request without paying attention to refreshing or anything
     * Assumes that all credentials are set correctly.
     * @param opts Options for request
     * @param callback callback function
     * @return The request object created
     */
    // tslint:disable-next-line:prefer-function-over-method
    OAuth2client.prototype.makeRequest = function (url, options, expectedStatusCodes) {
        return __awaiter(this, void 0, void 0, function () {
            var transporter;
            return __generator(this, function (_a) {
                transporter = new abstract_1.transporters.DefaultTransporter(expectedStatusCodes);
                return [2 /*return*/, transporter.fetch(url, options)];
            });
        });
    };
    return OAuth2client;
}());
exports.default = OAuth2client;

},{"../abstract":2,"debug":244,"http-status":246,"isomorphic-fetch":248}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorFactory = require("./error");
var popupHandler_1 = require("./popupHandler");
/**
 * PopupAuthenticationHandler
 */
var PopupAuthenticationHandler = /** @class */ (function () {
    function PopupAuthenticationHandler(options) {
        this.authenticationUrl = options.authenticationUrl;
        // tslint:disable-next-line:no-magic-numbers
        this.timeout = (options.timeout !== undefined) ? options.timeout : 60 * 1000;
        this.handler = null;
    }
    PopupAuthenticationHandler.GET_EVENT_VALIDATOR = function () {
        return {};
    };
    PopupAuthenticationHandler.GET_CALLBACK_HANDLER = function (cb, usePostMessage) {
        return function (eventData) {
            var callbackValue;
            try {
                if (!usePostMessage) {
                    // loadイベントの場合は、ポップアップのフラグメントをコールバックへ渡す
                    callbackValue = eventData.sourceObject.location.hash;
                }
                else if (typeof eventData.event.data === 'object' && eventData.event.data.hash) {
                    callbackValue = eventData.event.data.hash;
                }
                else {
                    callbackValue = eventData.event.data;
                }
            }
            catch (error) {
                // tslint:disable-next-line:no-console
                console.error('PopupAuthenticationHandler.GET_CALLBACK_HANDLER:', error);
            }
            cb(callbackValue);
        };
    };
    PopupAuthenticationHandler.CREATE = function (options) {
        return new PopupAuthenticationHandler(options);
    };
    PopupAuthenticationHandler.prototype.login = function (usePostMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.handler = new popupHandler_1.default({
                            url: _this.authenticationUrl,
                            eventListenerType: usePostMessage ? 'message' : 'load',
                            callback: PopupAuthenticationHandler.GET_CALLBACK_HANDLER(resolve, usePostMessage),
                            timeout: _this.timeout,
                            eventValidator: PopupAuthenticationHandler.GET_EVENT_VALIDATOR(),
                            timeoutCallback: function () {
                                var err = new ErrorFactory.AuthorizeError('Timeout during authentication');
                                err.error = 'timeout';
                                err.errorDescription = 'Timeout during authentication';
                                reject(err);
                            },
                            usePostMessage: false
                        });
                        _this.handler.init();
                    })];
            });
        });
    };
    return PopupAuthenticationHandler;
}());
exports.default = PopupAuthenticationHandler;

},{"./error":3,"./popupHandler":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createDebug = require("debug");
var debug = createDebug('cinerino-api:auth:popupHandler');
/**
 * PopupHandler
 */
var PopupHandler = /** @class */ (function () {
    function PopupHandler(options) {
        this.url = options.url;
        this.callback = options.callback;
        // tslint:disable-next-line:no-magic-numbers
        this.timeout = (options.timeout !== undefined) ? options.timeout : 60 * 1000;
        this.timeoutCallback = (options.timeoutCallback !== undefined) ? options.timeoutCallback : null;
        this.eventListenerType = (options.eventListenerType !== undefined) ? options.eventListenerType : 'message';
        this.popupWindow = null;
        this.timeoutHandle = null;
        this.destroyTimeout = null;
        this.proxyEventListener = null;
        // If no event identifier specified, set default
        this.eventValidator = (options.eventValidator !== undefined) ? options.eventValidator : {
            isValid: function () {
                return true;
            }
        };
        if (typeof this.callback !== 'function') {
            throw new Error('options.callback must be a function');
        }
    }
    PopupHandler.prototype.init = function () {
        var _this = this;
        debug('opening popup...', this.eventListenerType);
        this.popupWindow = window.open(this.url, 'authorizeWindow');
        // Workaround to avoid using bind that does not work in IE8
        this.proxyEventListener = function (e) {
            _this.eventListener(e);
        };
        switch (this.eventListenerType) {
            case 'message':
                this.eventSourceObject = window;
                break;
            case 'load':
                this.eventSourceObject = this.popupWindow;
                break;
            default:
                throw new Error("Unsupported event listener type: " + this.eventListenerType);
        }
        debug('this.eventSourceObject:', this.eventSourceObject);
        this.eventSourceObject.addEventListener(this.eventListenerType, this.proxyEventListener, false);
        this.timeoutHandle = setTimeout(function () {
            _this.timeoutHandler();
        }, this.timeout);
    };
    PopupHandler.prototype.eventListener = function (event) {
        debug('PopupHandler.eventListener...event:', event);
        var eventData = { event: event, sourceObject: this.eventSourceObject };
        this.destroy();
        // 呼び出し元へコールバック
        this.callback(eventData);
    };
    PopupHandler.prototype.timeoutHandler = function () {
        if (this.timeoutCallback) {
            this.timeoutCallback();
        }
    };
    PopupHandler.prototype.destroy = function () {
        var _this = this;
        clearTimeout(this.timeoutHandle);
        this.destroyTimeout = setTimeout(function () {
            _this.eventSourceObject.removeEventListener(_this.eventListenerType, _this.proxyEventListener, false);
            // ポップアップを閉じる
            _this.popupWindow.close();
        }, 0);
    };
    return PopupHandler;
}());
exports.default = PopupHandler;

},{"debug":244}],9:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorFactory = require("./error");
var iframeHandler_1 = require("./iframeHandler");
/**
 * SilentAuthenticationHandler
 */
var SilentAuthenticationHandler = /** @class */ (function () {
    function SilentAuthenticationHandler(options) {
        this.authenticationUrl = options.authenticationUrl;
        // tslint:disable-next-line:no-magic-numbers
        this.timeout = (options.timeout !== undefined) ? options.timeout : 60 * 1000;
        this.handler = null;
    }
    SilentAuthenticationHandler.GET_EVENT_VALIDATOR = function () {
        return {};
    };
    SilentAuthenticationHandler.GET_CALLBACK_HANDLER = function (cb, usePostMessage) {
        return function (eventData) {
            var callbackValue;
            try {
                if (!usePostMessage) {
                    // loadイベントの場合は、iframeウィンドウのフラグメントをコールバックへ渡す
                    callbackValue = eventData.sourceObject.contentWindow.location.hash;
                }
                else if (typeof eventData.event.data === 'object' && eventData.event.data.hash) {
                    callbackValue = eventData.event.data.hash;
                }
                else {
                    callbackValue = eventData.event.data;
                }
            }
            catch (error) {
                // tslint:disable-next-line:no-console
                console.error('SilentAuthenticationHandler.GET_CALLBACK_HANDLER:', error);
            }
            cb(callbackValue);
        };
    };
    SilentAuthenticationHandler.CREATE = function (options) {
        return new SilentAuthenticationHandler(options);
    };
    SilentAuthenticationHandler.prototype.login = function (usePostMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.handler = new iframeHandler_1.default({
                            url: _this.authenticationUrl,
                            eventListenerType: usePostMessage ? 'message' : 'load',
                            callback: SilentAuthenticationHandler.GET_CALLBACK_HANDLER(resolve, usePostMessage),
                            timeout: _this.timeout,
                            eventValidator: SilentAuthenticationHandler.GET_EVENT_VALIDATOR(),
                            timeoutCallback: function () {
                                var err = new ErrorFactory.AuthorizeError('Timeout during authentication renew');
                                err.error = 'timeout';
                                err.errorDescription = 'Timeout during authentication renew';
                                reject(err);
                            },
                            usePostMessage: usePostMessage || false
                        });
                        _this.handler.init();
                    })];
            });
        });
    };
    return SilentAuthenticationHandler;
}());
exports.default = SilentAuthenticationHandler;

},{"./error":3,"./iframeHandler":4}],10:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorFactory = require("./error");
var iframeHandler_1 = require("./iframeHandler");
/**
 * SilentLogoutHandler
 */
var SilentLogoutHandler = /** @class */ (function () {
    function SilentLogoutHandler(options) {
        this.logoutUrl = options.logoutUrl;
        // tslint:disable-next-line:no-magic-numbers
        this.timeout = (options.timeout !== undefined) ? options.timeout : 60 * 1000;
        this.handler = null;
    }
    SilentLogoutHandler.GET_CALLBACK_HANDLER = function (cb, usePostMessage) {
        return function (eventData) {
            var callbackValue;
            try {
                if (!usePostMessage) {
                    // loadイベントの場合は、iframeウィンドウのフラグメントをコールバックへ渡す
                    callbackValue = eventData.sourceObject.contentWindow.location.hash;
                }
                else if (typeof eventData.event.data === 'object' && eventData.event.data.hash) {
                    callbackValue = eventData.event.data.hash;
                }
                else {
                    callbackValue = eventData.event.data;
                }
            }
            catch (error) {
                // tslint:disable-next-line:no-console
                console.error('SilentLogoutHandler.GET_CALLBACK_HANDLER:', error);
            }
            cb(callbackValue);
        };
    };
    SilentLogoutHandler.CREATE = function (options) {
        return new SilentLogoutHandler(options);
    };
    SilentLogoutHandler.GET_EVENT_VALIDATOR = function () {
        return {};
    };
    SilentLogoutHandler.prototype.logout = function (usePostMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.handler = new iframeHandler_1.default({
                            url: _this.logoutUrl,
                            eventListenerType: usePostMessage ? 'message' : 'load',
                            callback: SilentLogoutHandler.GET_CALLBACK_HANDLER(resolve, usePostMessage),
                            timeout: _this.timeout,
                            eventValidator: SilentLogoutHandler.GET_EVENT_VALIDATOR(),
                            timeoutCallback: function () {
                                var err = new ErrorFactory.AuthorizeError('Timeout during logout');
                                err.error = 'timeout';
                                err.errorDescription = 'Timeout during logout';
                                reject(err);
                            },
                            usePostMessage: usePostMessage || false
                        });
                        _this.handler.init();
                    })];
            });
        });
    };
    return SilentLogoutHandler;
}());
exports.default = SilentLogoutHandler;

},{"./error":3,"./iframeHandler":4}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * API client for javascript
 */
var abstract_1 = require("./abstract");
var implicitGrantClient_1 = require("./auth/implicitGrantClient");
/**
 * factory
 * All object interfaces are here.
 * 全てのオブジェクトのインターフェースはここに含まれます。
 */
exports.factory = abstract_1.factory;
exports.service = abstract_1.service;
exports.transporters = abstract_1.transporters;
/**
 * create OAuth2 client instance using implicit grant
 * @param options implicit grant configurations
 */
function createAuthInstance(options) {
    return new implicitGrantClient_1.ImplicitGrantClient(options);
}
exports.createAuthInstance = createAuthInstance;

},{"./abstract":2,"./auth/implicitGrantClient":5}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * アクションステータス
 */
var ActionStatusType;
(function (ActionStatusType) {
    ActionStatusType["ActiveActionStatus"] = "ActiveActionStatus";
    ActionStatusType["CompletedActionStatus"] = "CompletedActionStatus";
    ActionStatusType["FailedActionStatus"] = "FailedActionStatus";
    ActionStatusType["PotentialActionStatus"] = "PotentialActionStatus";
    ActionStatusType["CanceledActionStatus"] = "CanceledActionStatus";
})(ActionStatusType || (ActionStatusType = {}));
exports.default = ActionStatusType;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * アクションタイプ
 */
var ActionType;
(function (ActionType) {
    ActionType["AuthorizeAction"] = "AuthorizeAction";
    ActionType["CancelAction"] = "CancelAction";
    ActionType["InformAction"] = "InformAction";
    ActionType["ReserveAction"] = "ReserveAction";
    ActionType["ReturnAction"] = "ReturnAction";
    ActionType["SendAction"] = "SendAction";
    ActionType["UseAction"] = "UseAction";
})(ActionType || (ActionType = {}));
exports.default = ActionType;

},{}],15:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],16:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],17:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],18:[function(require,module,exports){
"use strict";
/**
 * アプリケーションクライアントユーザーファクトリー
 * クライアントサイドでapiを利用するユーザー
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],19:[function(require,module,exports){
"use strict";
/**
 * 作品タイプ
 */
Object.defineProperty(exports, "__esModule", { value: true });
var CreativeWorkType;
(function (CreativeWorkType) {
    CreativeWorkType["EmailMessage"] = "EmailMessage";
    CreativeWorkType["Movie"] = "Movie";
})(CreativeWorkType || (CreativeWorkType = {}));
exports.default = CreativeWorkType;

},{}],20:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],21:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],22:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],23:[function(require,module,exports){
"use strict";
/**
 * エラーコード
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["AlreadyInUse"] = "AlreadyInUse";
    ErrorCode["Argument"] = "Argument";
    ErrorCode["ArgumentNull"] = "ArgumentNull";
    ErrorCode["Forbidden"] = "Forbidden";
    ErrorCode["NotFound"] = "NotFound";
    ErrorCode["NotImplemented"] = "NotImplemented";
    ErrorCode["RateLimitExceeded"] = "RateLimitExceeded";
    ErrorCode["ServiceUnavailable"] = "ServiceUnavailable";
    ErrorCode["Unauthorized"] = "Unauthorized";
})(ErrorCode || (ErrorCode = {}));
exports.default = ErrorCode;

},{}],24:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * AlreadyInUseError
 */
var AlreadyInUseError = /** @class */ (function (_super) {
    __extends(AlreadyInUseError, _super);
    function AlreadyInUseError(entityName, fieldNames, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "The specified '" + entityName + "' value is already in use for: " + fieldNames.join(', ') + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.AlreadyInUse, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        _this.fieldNames = fieldNames;
        setPrototypeOf(_this, AlreadyInUseError.prototype);
        return _this;
    }
    return AlreadyInUseError;
}(chevre_1.ChevreError));
exports.default = AlreadyInUseError;

},{"../errorCode":23,"./chevre":27,"setprototypeof":256}],25:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * ArgumentError
 */
var ArgumentError = /** @class */ (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Invalid or missing argument supplied: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Argument, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentError.prototype);
        return _this;
    }
    return ArgumentError;
}(chevre_1.ChevreError));
exports.default = ArgumentError;

},{"../errorCode":23,"./chevre":27,"setprototypeof":256}],26:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * ArgumentNullError
 */
var ArgumentNullError = /** @class */ (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Missing argument: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ArgumentNull, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentNullError.prototype);
        return _this;
    }
    return ArgumentNullError;
}(chevre_1.ChevreError));
exports.default = ArgumentNullError;

},{"../errorCode":23,"./chevre":27,"setprototypeof":256}],27:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ChevreError
 */
var ChevreError = /** @class */ (function (_super) {
    __extends(ChevreError, _super);
    function ChevreError(code, message) {
        var _this = 
        // tslint:disable-next-line:no-single-line-block-comment
        _super.call(this, message) /* istanbul ignore next */ || this;
        _this.name = 'ChevreError';
        _this.reason = code;
        return _this;
    }
    return ChevreError;
}(Error));
exports.ChevreError = ChevreError;

},{}],28:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * ForbiddenError
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Forbidden.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Forbidden, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ForbiddenError.prototype);
        return _this;
    }
    return ForbiddenError;
}(chevre_1.ChevreError));
exports.default = ForbiddenError;

},{"../errorCode":23,"./chevre":27,"setprototypeof":256}],29:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * NotFoundError
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(entityName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Not Found: " + entityName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotFound, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        setPrototypeOf(_this, NotFoundError.prototype);
        return _this;
    }
    return NotFoundError;
}(chevre_1.ChevreError));
exports.default = NotFoundError;

},{"../errorCode":23,"./chevre":27,"setprototypeof":256}],30:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * NotImplementedError
 */
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Method is not yet implemented.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotImplemented, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, NotImplementedError.prototype);
        return _this;
    }
    return NotImplementedError;
}(chevre_1.ChevreError));
exports.default = NotImplementedError;

},{"../errorCode":23,"./chevre":27,"setprototypeof":256}],31:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * RateLimitExceededError
 */
var RateLimitExceededError = /** @class */ (function (_super) {
    __extends(RateLimitExceededError, _super);
    function RateLimitExceededError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Rate limit exceeded.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.RateLimitExceeded, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, RateLimitExceededError.prototype);
        return _this;
    }
    return RateLimitExceededError;
}(chevre_1.ChevreError));
exports.default = RateLimitExceededError;

},{"../errorCode":23,"./chevre":27,"setprototypeof":256}],32:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * ServiceUnavailableError
 */
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Service unavailable temporarily.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ServiceUnavailable, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ServiceUnavailableError.prototype);
        return _this;
    }
    return ServiceUnavailableError;
}(chevre_1.ChevreError));
exports.default = ServiceUnavailableError;

},{"../errorCode":23,"./chevre":27,"setprototypeof":256}],33:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * UnauthorizedError
 */
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Unauthorized.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Unauthorized, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, UnauthorizedError.prototype);
        return _this;
    }
    return UnauthorizedError;
}(chevre_1.ChevreError));
exports.default = UnauthorizedError;

},{"../errorCode":23,"./chevre":27,"setprototypeof":256}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * errors
 */
var alreadyInUse_1 = require("./error/alreadyInUse");
exports.AlreadyInUse = alreadyInUse_1.default;
var argument_1 = require("./error/argument");
exports.Argument = argument_1.default;
var argumentNull_1 = require("./error/argumentNull");
exports.ArgumentNull = argumentNull_1.default;
var chevre_1 = require("./error/chevre");
exports.Chevre = chevre_1.ChevreError;
var forbidden_1 = require("./error/forbidden");
exports.Forbidden = forbidden_1.default;
var notFound_1 = require("./error/notFound");
exports.NotFound = notFound_1.default;
var notImplemented_1 = require("./error/notImplemented");
exports.NotImplemented = notImplemented_1.default;
var rateLimitExceeded_1 = require("./error/rateLimitExceeded");
exports.RateLimitExceeded = rateLimitExceeded_1.default;
var serviceUnavailable_1 = require("./error/serviceUnavailable");
exports.ServiceUnavailable = serviceUnavailable_1.default;
var unauthorized_1 = require("./error/unauthorized");
exports.Unauthorized = unauthorized_1.default;

},{"./error/alreadyInUse":24,"./error/argument":25,"./error/argumentNull":26,"./error/chevre":27,"./error/forbidden":28,"./error/notFound":29,"./error/notImplemented":30,"./error/rateLimitExceeded":31,"./error/serviceUnavailable":32,"./error/unauthorized":33}],35:[function(require,module,exports){
"use strict";
/**
 * イベントステータス
 */
Object.defineProperty(exports, "__esModule", { value: true });
var EventStatusType;
(function (EventStatusType) {
    EventStatusType["EventCancelled"] = "EventCancelled";
    EventStatusType["EventPostponed"] = "EventPostponed";
    EventStatusType["EventRescheduled"] = "EventRescheduled";
    EventStatusType["EventScheduled"] = "EventScheduled";
})(EventStatusType || (EventStatusType = {}));
exports.default = EventStatusType;

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * イベントタイプ
 */
var EventType;
(function (EventType) {
    EventType["ScreeningEvent"] = "ScreeningEvent";
    EventType["ScreeningEventSeries"] = "ScreeningEventSeries";
})(EventType || (EventType = {}));
exports.default = EventType;

},{}],37:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],38:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],39:[function(require,module,exports){
"use strict";
/**
 * 商品在庫状況
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ItemAvailability;
(function (ItemAvailability) {
    ItemAvailability["Discontinued"] = "Discontinued";
    ItemAvailability["InStock"] = "InStock";
    ItemAvailability["InStoreOnly"] = "InStoreOnly";
    ItemAvailability["LimitedAvailability"] = "LimitedAvailability";
    ItemAvailability["OnlineOnly"] = "OnlineOnly";
    ItemAvailability["OutOfStock"] = "OutOfStock";
    ItemAvailability["PreOrder"] = "PreOrder";
    ItemAvailability["PreSale"] = "PreSale";
    ItemAvailability["SoldOut"] = "SoldOut";
})(ItemAvailability || (ItemAvailability = {}));
exports.default = ItemAvailability;

},{}],40:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],41:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],42:[function(require,module,exports){
"use strict";
/**
 * 組織タイプ
 */
Object.defineProperty(exports, "__esModule", { value: true });
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["Corporation"] = "Corporation";
    OrganizationType["MovieTheater"] = "MovieTheater";
})(OrganizationType || (OrganizationType = {}));
exports.default = OrganizationType;

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 決済方法タイプ
 */
var PaymentMethodType;
(function (PaymentMethodType) {
    /**
     * 現金
     */
    PaymentMethodType["Cash"] = "Cash";
    /**
     * 内部口座決済
     */
    PaymentMethodType["Account"] = "Account";
    /**
     * 電子マネー
     */
    PaymentMethodType["EMoney"] = "EMoney";
    /**
     * クレジットカード決済
     */
    PaymentMethodType["CreditCard"] = "CreditCard";
    /**
     * ムビチケ
     */
    PaymentMethodType["MovieTicket"] = "MovieTicket";
    /**
     * その他
     */
    PaymentMethodType["Others"] = "Others";
})(PaymentMethodType = exports.PaymentMethodType || (exports.PaymentMethodType = {}));

},{}],44:[function(require,module,exports){
"use strict";
/**
 * 場所タイプ
 */
Object.defineProperty(exports, "__esModule", { value: true });
var PlaceType;
(function (PlaceType) {
    PlaceType["MovieTheater"] = "MovieTheater";
    PlaceType["ScreeningRoom"] = "ScreeningRoom";
    PlaceType["ScreeningRoomSection"] = "ScreeningRoomSection";
    PlaceType["Seat"] = "Seat";
})(PlaceType || (PlaceType = {}));
exports.default = PlaceType;

},{}],45:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * price currency
 * The currency (in 3-letter ISO 4217 format) of the price or a price component,
 * when attached to PriceSpecification and its subtypes.
 */
var PriceCurrency;
(function (PriceCurrency) {
    PriceCurrency["JPY"] = "JPY";
})(PriceCurrency || (PriceCurrency = {}));
exports.default = PriceCurrency;

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 価格仕様タイプ
 */
var PriceSpecificationType;
(function (PriceSpecificationType) {
    /**
     * 基本価格仕様
     */
    PriceSpecificationType["PriceSpecification"] = "PriceSpecification";
    /**
     * 複合価格仕様
     */
    PriceSpecificationType["CompoundPriceSpecification"] = "CompoundPriceSpecification";
    /**
     * ムビチケ券種区分チャージ仕様
     */
    PriceSpecificationType["MovieTicketTypeChargeSpecification"] = "MovieTicketTypeChargeSpecification";
    /**
     * 音響方式チャージ仕様
     */
    PriceSpecificationType["SoundFormatChargeSpecification"] = "SoundFormatChargeSpecification";
    /**
     * 単価仕様
     */
    PriceSpecificationType["UnitPriceSpecification"] = "UnitPriceSpecification";
    /**
     * 上映方式チャージ仕様
     */
    PriceSpecificationType["VideoFormatChargeSpecification"] = "VideoFormatChargeSpecification";
})(PriceSpecificationType || (PriceSpecificationType = {}));
exports.default = PriceSpecificationType;

},{}],48:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],49:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],50:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],51:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Enumerated status values for Reservation.
 */
var ReservationStatusType;
(function (ReservationStatusType) {
    /**
     * The status for a previously confirmed reservation that is now cancelled.
     */
    ReservationStatusType["ReservationCancelled"] = "ReservationCancelled";
    /**
     * The status of a confirmed reservation.
     */
    ReservationStatusType["ReservationConfirmed"] = "ReservationConfirmed";
    /**
     * The status of a reservation on hold pending an update like credit card number or flight changes.
     */
    ReservationStatusType["ReservationHold"] = "ReservationHold";
    /**
     * The status of a reservation when a request has been sent, but not confirmed.
     */
    ReservationStatusType["ReservationPending"] = "ReservationPending";
})(ReservationStatusType || (ReservationStatusType = {}));
exports.default = ReservationStatusType;

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 予約タイプ
 */
var ReservationType;
(function (ReservationType) {
    ReservationType["EventReservation"] = "EventReservation";
    ReservationType["ReservationPackage"] = "ReservationPackage";
})(ReservationType || (ReservationType = {}));
exports.default = ReservationType;

},{}],54:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ソートタイプ
 */
var SortType;
(function (SortType) {
    SortType[SortType["Ascending"] = 1] = "Ascending";
    SortType[SortType["Descending"] = -1] = "Descending";
})(SortType || (SortType = {}));
exports.default = SortType;

},{}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 音響方式
 */
var SoundFormatType;
(function (SoundFormatType) {
    SoundFormatType["DIGITAL"] = "DIGITAL";
    SoundFormatType["DOLBY_ATMOS"] = "DOLBY_ATMOS";
})(SoundFormatType || (SoundFormatType = {}));
exports.default = SoundFormatType;

},{}],57:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],58:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * タスク名
 */
var TaskName;
(function (TaskName) {
    TaskName["Reserve"] = "reserve";
    TaskName["CancelReservation"] = "cancelReservation";
    TaskName["CancelPendingReservation"] = "cancelPendingReservation";
    TaskName["AggregateScreeningEvent"] = "aggregateScreeningEvent";
    TaskName["ImportEventsFromCOA"] = "importEventsFromCOA";
    TaskName["ImportOffersFromCOA"] = "importOffersFromCOA";
    /**
     * ウェブフックをたたく
     */
    TaskName["TriggerWebhook"] = "triggerWebhook";
})(TaskName || (TaskName = {}));
exports.default = TaskName;

},{}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * タスクステータス
 */
var TaskStatus;
(function (TaskStatus) {
    /**
     * 準備OK
     */
    TaskStatus["Ready"] = "Ready";
    /**
     * 実行中
     */
    TaskStatus["Running"] = "Running";
    /**
     * 実行済
     */
    TaskStatus["Executed"] = "Executed";
    /**
     * 実行中止
     */
    TaskStatus["Aborted"] = "Aborted";
})(TaskStatus || (TaskStatus = {}));
exports.default = TaskStatus;

},{}],61:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],62:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],63:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],64:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],65:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],66:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],67:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],68:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],69:[function(require,module,exports){
"use strict";
/**
 * 取引ステータス
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionStatusType;
(function (TransactionStatusType) {
    TransactionStatusType["InProgress"] = "InProgress";
    TransactionStatusType["Canceled"] = "Canceled";
    TransactionStatusType["Confirmed"] = "Confirmed";
    TransactionStatusType["Expired"] = "Expired";
})(TransactionStatusType || (TransactionStatusType = {}));
exports.default = TransactionStatusType;

},{}],70:[function(require,module,exports){
"use strict";
/**
 * 取引タスクエクスポートステータス
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionTasksExportationStatus;
(function (TransactionTasksExportationStatus) {
    /**
     * 未エクスポート
     */
    TransactionTasksExportationStatus["Unexported"] = "Unexported";
    /**
     * エクスポート中
     */
    TransactionTasksExportationStatus["Exporting"] = "Exporting";
    /**
     * エクスポート済
     */
    TransactionTasksExportationStatus["Exported"] = "Exported";
})(TransactionTasksExportationStatus || (TransactionTasksExportationStatus = {}));
exports.default = TransactionTasksExportationStatus;

},{}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 取引タイプ
 */
var TransactionType;
(function (TransactionType) {
    /**
     * 座席予約
     */
    TransactionType["Reserve"] = "Reserve";
    /**
     * 座席予約キャンセル
     */
    TransactionType["CancelReservation"] = "CancelReservation";
})(TransactionType || (TransactionType = {}));
exports.default = TransactionType;

},{}],72:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],73:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 単位符号
 */
var UnitCode;
(function (UnitCode) {
    /**
     * no unit
     */
    UnitCode["C62"] = "C62";
    /**
     * 日
     */
    UnitCode["Day"] = "DAY";
    /**
     * 秒
     */
    UnitCode["Sec"] = "SEC";
})(UnitCode = exports.UnitCode || (exports.UnitCode = {}));

},{}],75:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 上映方式
 */
var VideoFormatType;
(function (VideoFormatType) {
    VideoFormatType["2D"] = "2D";
    VideoFormatType["3D"] = "3D";
    VideoFormatType["IMAX"] = "IMAX";
    VideoFormatType["4DX"] = "4DX";
    VideoFormatType["TCX"] = "TCX";
    VideoFormatType["MX4D"] = "MX4D";
})(VideoFormatType || (VideoFormatType = {}));
exports.default = VideoFormatType;

},{}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CancelReservationActionFactory = require("./factory/action/cancel/reservation");
var InformActionFactory = require("./factory/action/interact/inform");
var ReserveActionFactory = require("./factory/action/reserve");
var actionStatusType_1 = require("./factory/actionStatusType");
var actionType_1 = require("./factory/actionType");
var AccountTitleFactory = require("./factory/accountTitle");
var ClientUserFactory = require("./factory/clientUser");
var EmailMessageFactory = require("./factory/creativeWork/message/email");
var MovieCreativeWorkFactory = require("./factory/creativeWork/movie");
var creativeWorkType_1 = require("./factory/creativeWorkType");
var ScreeningEventFactory = require("./factory/event/screeningEvent");
var ScreeningEventSeriesFactory = require("./factory/event/screeningEventSeries");
var eventStatusType_1 = require("./factory/eventStatusType");
var eventType_1 = require("./factory/eventType");
var itemAvailability_1 = require("./factory/itemAvailability");
var LanguageFactory = require("./factory/language");
var ProductOfferFactory = require("./factory/offer/product");
var organizationType_1 = require("./factory/organizationType");
var paymentMethodType_1 = require("./factory/paymentMethodType");
var MovieTheaterPlaceFactory = require("./factory/place/movieTheater");
var placeType_1 = require("./factory/placeType");
var priceCurrency_1 = require("./factory/priceCurrency");
var priceSpecificationType_1 = require("./factory/priceSpecificationType");
var project = require("./factory/project");
var PropertyValueFactory = require("./factory/propertyValue");
var SeatingTypeFactory = require("./factory/qualitativeValue/seatingType");
var QuantitativeValueFactory = require("./factory/quantitativeValue");
var reservationStatusType_1 = require("./factory/reservationStatusType");
var reservationType_1 = require("./factory/reservationType");
var ServiceTypeFactory = require("./factory/serviceType");
var sortType_1 = require("./factory/sortType");
var soundFormatType_1 = require("./factory/soundFormatType");
var TicketTypeFactory = require("./factory/ticketType");
var unitCode_1 = require("./factory/unitCode");
var videoFormatType_1 = require("./factory/videoFormatType");
var AggregateScreeningEventTaskFactory = require("./factory/task/aggregateScreeningEvent");
var CancelPendingReservationTaskFactory = require("./factory/task/cancelPendingReservation");
var CancelReservationTaskFactory = require("./factory/task/cancelReservation");
var ImportEventsFromCOATaskFactory = require("./factory/task/importEventsFromCOA");
var ImportOffersFromCOATaskFactory = require("./factory/task/importOffersFromCOA");
var ReserveTaskFactory = require("./factory/task/reserve");
var TriggerWebhookTaskFactory = require("./factory/task/triggerWebhook");
var TaskExecutionResultFactory = require("./factory/taskExecutionResult");
var taskName_1 = require("./factory/taskName");
var taskStatus_1 = require("./factory/taskStatus");
var CancelReservationTransactionFactory = require("./factory/transaction/cancelReservation");
var ReserveTransactionFactory = require("./factory/transaction/reserve");
var transactionStatusType_1 = require("./factory/transactionStatusType");
var transactionTasksExportationStatus_1 = require("./factory/transactionTasksExportationStatus");
var transactionType_1 = require("./factory/transactionType");
var errorCode_1 = require("./factory/errorCode");
var errors = require("./factory/errors");
exports.errors = errors;
exports.errorCode = errorCode_1.default;
exports.actionStatusType = actionStatusType_1.default;
exports.actionType = actionType_1.default;
var action;
(function (action) {
    var authorize;
    (function (authorize) {
    })(authorize = action.authorize || (action.authorize = {}));
    var cancel;
    (function (cancel) {
        // tslint:disable-next-line:no-shadowed-variable
        cancel.reservation = CancelReservationActionFactory;
    })(cancel = action.cancel || (action.cancel = {}));
    var interact;
    (function (interact) {
        interact.inform = InformActionFactory;
    })(interact = action.interact || (action.interact = {}));
    action.reserve = ReserveActionFactory;
})(action = exports.action || (exports.action = {}));
exports.accountTitle = AccountTitleFactory;
exports.clientUser = ClientUserFactory;
var creativeWork;
(function (creativeWork) {
    var message;
    (function (message) {
        message.email = EmailMessageFactory;
    })(message = creativeWork.message || (creativeWork.message = {}));
    creativeWork.movie = MovieCreativeWorkFactory;
})(creativeWork = exports.creativeWork || (exports.creativeWork = {}));
exports.creativeWorkType = creativeWorkType_1.default;
var event;
(function (event) {
    event.screeningEvent = ScreeningEventFactory;
    event.screeningEventSeries = ScreeningEventSeriesFactory;
})(event = exports.event || (exports.event = {}));
exports.eventStatusType = eventStatusType_1.default;
exports.eventType = eventType_1.default;
exports.itemAvailability = itemAvailability_1.default;
exports.language = LanguageFactory;
var offer;
(function (offer) {
    offer.product = ProductOfferFactory;
})(offer = exports.offer || (exports.offer = {}));
exports.organizationType = organizationType_1.default;
exports.paymentMethodType = paymentMethodType_1.PaymentMethodType;
exports.priceCurrency = priceCurrency_1.default;
var place;
(function (place) {
    place.movieTheater = MovieTheaterPlaceFactory;
})(place = exports.place || (exports.place = {}));
exports.placeType = placeType_1.default;
exports.priceSpecificationType = priceSpecificationType_1.default;
exports.project = project;
exports.propertyValue = PropertyValueFactory;
var qualitativeValue;
(function (qualitativeValue) {
    qualitativeValue.seatingType = SeatingTypeFactory;
})(qualitativeValue = exports.qualitativeValue || (exports.qualitativeValue = {}));
exports.quantitativeValue = QuantitativeValueFactory;
exports.reservationStatusType = reservationStatusType_1.default;
exports.reservationType = reservationType_1.default;
var task;
(function (task) {
    task.aggregateScreeningEvent = AggregateScreeningEventTaskFactory;
    task.cancelPendingReservation = CancelPendingReservationTaskFactory;
    task.cancelReservation = CancelReservationTaskFactory;
    task.importEventsFromCOA = ImportEventsFromCOATaskFactory;
    task.importOffersFromCOA = ImportOffersFromCOATaskFactory;
    task.reserve = ReserveTaskFactory;
    task.triggerWebhook = TriggerWebhookTaskFactory;
})(task = exports.task || (exports.task = {}));
exports.serviceType = ServiceTypeFactory;
exports.sortType = sortType_1.default;
exports.soundFormatType = soundFormatType_1.default;
exports.taskExecutionResult = TaskExecutionResultFactory;
exports.taskName = taskName_1.default;
exports.taskStatus = taskStatus_1.default;
var transaction;
(function (transaction) {
    transaction.cancelReservation = CancelReservationTransactionFactory;
    transaction.reserve = ReserveTransactionFactory;
})(transaction = exports.transaction || (exports.transaction = {}));
exports.ticketType = TicketTypeFactory;
exports.transactionStatusType = transactionStatusType_1.default;
exports.transactionTasksExportationStatus = transactionTasksExportationStatus_1.default;
exports.transactionType = transactionType_1.default;
exports.unitCode = unitCode_1.UnitCode;
exports.videoFormatType = videoFormatType_1.default;
var DistributorFactory = require("./factory/distributor");
var SubjectFactory = require("./factory/subject");
/**
 * @deprecated 東映ローカライズなのでそのうち廃止
 */
exports.distributor = DistributorFactory;
/**
 * @deprecated 東映ローカライズなのでそのうち廃止
 */
exports.subject = SubjectFactory;

},{"./factory/accountTitle":12,"./factory/action/cancel/reservation":15,"./factory/action/interact/inform":16,"./factory/action/reserve":17,"./factory/actionStatusType":13,"./factory/actionType":14,"./factory/clientUser":18,"./factory/creativeWork/message/email":20,"./factory/creativeWork/movie":21,"./factory/creativeWorkType":19,"./factory/distributor":22,"./factory/errorCode":23,"./factory/errors":34,"./factory/event/screeningEvent":37,"./factory/event/screeningEventSeries":38,"./factory/eventStatusType":35,"./factory/eventType":36,"./factory/itemAvailability":39,"./factory/language":40,"./factory/offer/product":41,"./factory/organizationType":42,"./factory/paymentMethodType":43,"./factory/place/movieTheater":45,"./factory/placeType":44,"./factory/priceCurrency":46,"./factory/priceSpecificationType":47,"./factory/project":48,"./factory/propertyValue":49,"./factory/qualitativeValue/seatingType":50,"./factory/quantitativeValue":51,"./factory/reservationStatusType":52,"./factory/reservationType":53,"./factory/serviceType":54,"./factory/sortType":55,"./factory/soundFormatType":56,"./factory/subject":57,"./factory/task/aggregateScreeningEvent":61,"./factory/task/cancelPendingReservation":62,"./factory/task/cancelReservation":63,"./factory/task/importEventsFromCOA":64,"./factory/task/importOffersFromCOA":65,"./factory/task/reserve":66,"./factory/task/triggerWebhook":67,"./factory/taskExecutionResult":58,"./factory/taskName":59,"./factory/taskStatus":60,"./factory/ticketType":68,"./factory/transaction/cancelReservation":72,"./factory/transaction/reserve":73,"./factory/transactionStatusType":69,"./factory/transactionTasksExportationStatus":70,"./factory/transactionType":71,"./factory/unitCode":74,"./factory/videoFormatType":75}],77:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var transporters_1 = require("../transporters");
/**
 * 抽象認証クライアント
 */
var AuthClient = /** @class */ (function () {
    function AuthClient() {
    }
    return AuthClient;
}());
exports.AuthClient = AuthClient;
/**
 * テスト認証クライアント
 */
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore next */
var StubAuthClient = /** @class */ (function () {
    function StubAuthClient() {
    }
    // tslint:disable-next-line:prefer-function-over-method
    StubAuthClient.prototype.fetch = function (url, options, expectedStatusCodes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (new transporters_1.DefaultTransporter(expectedStatusCodes)).fetch(url, options)];
            });
        });
    };
    // tslint:disable-next-line:prefer-function-over-method
    StubAuthClient.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, 'access_token'];
            });
        });
    };
    return StubAuthClient;
}());
exports.StubAuthClient = StubAuthClient;

},{"../transporters":107}],78:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * factory
 */
__export(require("@cinerino/factory"));

},{"@cinerino/factory":195}],79:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-classes-per-file
/**
 * API Service Library for Javascript
 */
var factory = require("./factory");
var ServiceFactory = require("./service");
var authClient_1 = require("./auth/authClient");
var account_1 = require("./service/account");
var action_1 = require("./service/action");
var authorization_1 = require("./service/authorization");
var creativeWork_1 = require("./service/creativeWork");
var delivery_1 = require("./service/delivery");
var event_1 = require("./service/event");
var iam_1 = require("./service/iam");
var invoice_1 = require("./service/invoice");
var order_1 = require("./service/order");
var ownershipInfo_1 = require("./service/ownershipInfo");
var payment_1 = require("./service/payment");
var paymentMethod_1 = require("./service/paymentMethod");
var person_1 = require("./service/person");
var ownershipInfo_2 = require("./service/person/ownershipInfo");
var programMembership_1 = require("./service/programMembership");
var project_1 = require("./service/project");
var reservation_1 = require("./service/reservation");
var seller_1 = require("./service/seller");
var task_1 = require("./service/task");
var moneyTransfer_1 = require("./service/transaction/moneyTransfer");
var placeOrder_1 = require("./service/transaction/placeOrder");
var placeOrder4sskts_1 = require("./service/transaction/placeOrder4sskts");
var placeOrder4ttts_1 = require("./service/transaction/placeOrder4ttts");
var returnOrder_1 = require("./service/transaction/returnOrder");
var returnOrder4ttts_1 = require("./service/transaction/returnOrder4ttts");
var userPool_1 = require("./service/userPool");
var transporters = require("./transporters");
exports.factory = factory;
exports.transporters = transporters;
/**
 * 認証クライアント抽象クラス
 */
var Auth = /** @class */ (function (_super) {
    __extends(Auth, _super);
    function Auth() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Auth;
}(authClient_1.AuthClient));
exports.Auth = Auth;
var auth;
(function (auth) {
    /**
     * 抽象認証クライアント
     */
    // tslint:disable-next-line:no-shadowed-variable
    var Auth = /** @class */ (function (_super) {
        __extends(Auth, _super);
        function Auth() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Auth;
    }(authClient_1.AuthClient));
    auth.Auth = Auth;
    /**
     * スタブ認証クライアント
     */
    var StubAuth = /** @class */ (function (_super) {
        __extends(StubAuth, _super);
        function StubAuth() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return StubAuth;
    }(authClient_1.StubAuthClient));
    auth.StubAuth = StubAuth;
})(auth = exports.auth || (exports.auth = {}));
/**
 * サービスモジュール
 */
var service;
(function (service) {
    /**
     * Baseサービス
     */
    var Service = /** @class */ (function (_super) {
        __extends(Service, _super);
        function Service() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Service;
    }(ServiceFactory.Service));
    service.Service = Service;
    /**
     * 口座サービス
     */
    var Account = /** @class */ (function (_super) {
        __extends(Account, _super);
        function Account() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Account;
    }(account_1.AccountService));
    service.Account = Account;
    /**
     * アクションサービス
     */
    var Action = /** @class */ (function (_super) {
        __extends(Action, _super);
        function Action() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Action;
    }(action_1.ActionService));
    service.Action = Action;
    /**
     * 認可サービス
     */
    var Authorization = /** @class */ (function (_super) {
        __extends(Authorization, _super);
        function Authorization() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Authorization;
    }(authorization_1.AuthorizationService));
    service.Authorization = Authorization;
    /**
     * 作品サービス
     */
    var CreativeWork = /** @class */ (function (_super) {
        __extends(CreativeWork, _super);
        function CreativeWork() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CreativeWork;
    }(creativeWork_1.CreativeWorkService));
    service.CreativeWork = CreativeWork;
    /**
     * 配送サービス
     */
    var Delivery = /** @class */ (function (_super) {
        __extends(Delivery, _super);
        function Delivery() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Delivery;
    }(delivery_1.DeliveryService));
    service.Delivery = Delivery;
    /**
     * イベントサービス
     */
    var Event = /** @class */ (function (_super) {
        __extends(Event, _super);
        function Event() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Event;
    }(event_1.EventService));
    service.Event = Event;
    /**
     * IAMサービス
     */
    var IAM = /** @class */ (function (_super) {
        __extends(IAM, _super);
        function IAM() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return IAM;
    }(iam_1.IAMService));
    service.IAM = IAM;
    /**
     * インボイスサービス
     */
    var Invoice = /** @class */ (function (_super) {
        __extends(Invoice, _super);
        function Invoice() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Invoice;
    }(invoice_1.InvoiceService));
    service.Invoice = Invoice;
    /**
     * 注文サービス
     */
    var Order = /** @class */ (function (_super) {
        __extends(Order, _super);
        function Order() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Order;
    }(order_1.OrderService));
    service.Order = Order;
    /**
     * 所有権サービス
     */
    var OwnershipInfo = /** @class */ (function (_super) {
        __extends(OwnershipInfo, _super);
        function OwnershipInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return OwnershipInfo;
    }(ownershipInfo_1.OwnershipInfoService));
    service.OwnershipInfo = OwnershipInfo;
    /**
     * 決済サービス
     */
    var Payment = /** @class */ (function (_super) {
        __extends(Payment, _super);
        function Payment() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Payment;
    }(payment_1.PaymentService));
    service.Payment = Payment;
    /**
     * 決済方法サービス
     */
    var PaymentMethod = /** @class */ (function (_super) {
        __extends(PaymentMethod, _super);
        function PaymentMethod() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return PaymentMethod;
    }(paymentMethod_1.PaymentMethodService));
    service.PaymentMethod = PaymentMethod;
    /**
     * ユーザーサービス
     */
    var Person = /** @class */ (function (_super) {
        __extends(Person, _super);
        function Person() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Person;
    }(person_1.PersonService));
    service.Person = Person;
    var person;
    (function (person) {
        /**
         * ユーザー所有権サービス
         */
        // tslint:disable-next-line:no-shadowed-variable
        var OwnershipInfo = /** @class */ (function (_super) {
            __extends(OwnershipInfo, _super);
            function OwnershipInfo() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return OwnershipInfo;
        }(ownershipInfo_2.PersonOwnershipInfoService));
        person.OwnershipInfo = OwnershipInfo;
    })(person = service.person || (service.person = {}));
    /**
     * 会員プログラムサービス
     */
    var ProgramMembership = /** @class */ (function (_super) {
        __extends(ProgramMembership, _super);
        function ProgramMembership() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ProgramMembership;
    }(programMembership_1.ProgramMembershipService));
    service.ProgramMembership = ProgramMembership;
    /**
     * プロジェクトサービス
     */
    var Project = /** @class */ (function (_super) {
        __extends(Project, _super);
        function Project() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Project;
    }(project_1.ProjectService));
    service.Project = Project;
    /**
     * 予約サービス
     */
    var Reservation = /** @class */ (function (_super) {
        __extends(Reservation, _super);
        function Reservation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Reservation;
    }(reservation_1.ReservationService));
    service.Reservation = Reservation;
    /**
     * 販売者サービス
     */
    var Seller = /** @class */ (function (_super) {
        __extends(Seller, _super);
        function Seller() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Seller;
    }(seller_1.SellerService));
    service.Seller = Seller;
    /**
     * タスクサービス
     */
    var Task = /** @class */ (function (_super) {
        __extends(Task, _super);
        function Task() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Task;
    }(task_1.TaskService));
    service.Task = Task;
    /**
     * 取引サービス
     */
    var transaction;
    (function (transaction) {
        /**
         * 通貨転送取引サービス
         */
        var MoneyTransfer = /** @class */ (function (_super) {
            __extends(MoneyTransfer, _super);
            function MoneyTransfer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return MoneyTransfer;
        }(moneyTransfer_1.MoneyTransferTransactionService));
        transaction.MoneyTransfer = MoneyTransfer;
        /**
         * 注文取引サービス
         */
        var PlaceOrder = /** @class */ (function (_super) {
            __extends(PlaceOrder, _super);
            function PlaceOrder() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return PlaceOrder;
        }(placeOrder_1.PlaceOrderTransactionService));
        transaction.PlaceOrder = PlaceOrder;
        /**
         * sskts専用注文取引サービス
         */
        var PlaceOrder4sskts = /** @class */ (function (_super) {
            __extends(PlaceOrder4sskts, _super);
            function PlaceOrder4sskts() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return PlaceOrder4sskts;
        }(placeOrder4sskts_1.PlaceOrderTransaction4ssktsService));
        transaction.PlaceOrder4sskts = PlaceOrder4sskts;
        /**
         * ttts専用注文取引サービス
         */
        var PlaceOrder4ttts = /** @class */ (function (_super) {
            __extends(PlaceOrder4ttts, _super);
            function PlaceOrder4ttts() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return PlaceOrder4ttts;
        }(placeOrder4ttts_1.PlaceOrderTransaction4tttsService));
        transaction.PlaceOrder4ttts = PlaceOrder4ttts;
        /**
         * 注文返品取引サービス
         */
        var ReturnOrder = /** @class */ (function (_super) {
            __extends(ReturnOrder, _super);
            function ReturnOrder() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ReturnOrder;
        }(returnOrder_1.ReturnOrderTransactionService));
        transaction.ReturnOrder = ReturnOrder;
        /**
         * ttts注文返品取引サービス
         */
        var ReturnOrder4ttts = /** @class */ (function (_super) {
            __extends(ReturnOrder4ttts, _super);
            function ReturnOrder4ttts() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ReturnOrder4ttts;
        }(returnOrder4ttts_1.ReturnOrderTransaction4tttsService));
        transaction.ReturnOrder4ttts = ReturnOrder4ttts;
    })(transaction = service.transaction || (service.transaction = {}));
    /**
     * 取引サービス
     * @alias service.transaction
     */
    service.txn = transaction;
    /**
     * Cognitoユーザープールサービス
     */
    var UserPool = /** @class */ (function (_super) {
        __extends(UserPool, _super);
        function UserPool() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UserPool;
    }(userPool_1.UserPoolService));
    service.UserPool = UserPool;
})(service = exports.service || (exports.service = {}));

},{"./auth/authClient":77,"./factory":78,"./service":80,"./service/account":81,"./service/action":82,"./service/authorization":83,"./service/creativeWork":84,"./service/delivery":85,"./service/event":86,"./service/iam":87,"./service/invoice":88,"./service/order":89,"./service/ownershipInfo":90,"./service/payment":91,"./service/paymentMethod":92,"./service/person":93,"./service/person/ownershipInfo":94,"./service/programMembership":95,"./service/project":96,"./service/reservation":97,"./service/seller":98,"./service/task":99,"./service/transaction/moneyTransfer":100,"./service/transaction/placeOrder":101,"./service/transaction/placeOrder4sskts":102,"./service/transaction/placeOrder4ttts":103,"./service/transaction/returnOrder":104,"./service/transaction/returnOrder4ttts":105,"./service/userPool":106,"./transporters":107}],80:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var qs = require("qs");
var transporters_1 = require("./transporters");
/**
 * base service class
 */
var Service = /** @class */ (function () {
    function Service(options) {
        this.options = options;
    }
    /**
     * Create and send request to API
     */
    Service.prototype.fetch = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultOptions, baseUrl, url, querystrings, headers, fetchOptions, transporter;
            return __generator(this, function (_a) {
                defaultOptions = {
                    headers: {},
                    method: 'GET'
                };
                // tslint:disable-next-line:no-parameter-reassignment
                options = __assign(__assign({}, defaultOptions), options);
                baseUrl = this.options.endpoint;
                url = "" + baseUrl + options.uri;
                querystrings = qs.stringify(options.qs);
                url += (querystrings.length > 0) ? "?" + querystrings : '';
                headers = __assign({
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, options.headers);
                fetchOptions = {
                    method: options.method,
                    headers: headers,
                    body: JSON.stringify(options.body)
                };
                // create request (using authClient or otherwise and return request obj)
                if (this.options.auth !== undefined) {
                    return [2 /*return*/, this.options.auth.fetch(url, fetchOptions, options.expectedStatusCodes)];
                }
                else {
                    transporter = (this.options.transporter !== undefined) ? this.options.transporter : new transporters_1.DefaultTransporter(options.expectedStatusCodes);
                    return [2 /*return*/, transporter.fetch(url, fetchOptions)];
                }
                return [2 /*return*/];
            });
        });
    };
    return Service;
}());
exports.Service = Service;

},{"./transporters":107,"qs":109}],81:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 口座サービス
 */
var AccountService = /** @class */ (function (_super) {
    __extends(AccountService, _super);
    function AccountService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 管理者として口座を開設する
     */
    AccountService.prototype.open = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/accounts',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 管理者として口座を解約する
     */
    AccountService.prototype.close = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/accounts/" + params.accountType + "/" + params.accountNumber + "/close",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポイントを入金する(sskts専用)
     */
    AccountService.prototype.deposit4sskts = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: '/accounts/transactions/deposit',
                            method: 'POST',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AccountService;
}(service_1.Service));
exports.AccountService = AccountService;

},{"../service":80,"http-status":246}],82:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * アクションサービス
 */
var ActionService = /** @class */ (function (_super) {
    __extends(ActionService, _super);
    function ActionService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * アクション検索
     */
    ActionService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/actions',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * チケット印刷(sskts専用)
     */
    ActionService.prototype.printTicket = function (
    /**
     * チケットオブジェクト
     */
    params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/actions/print/ticket',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * チケット印刷アクション検索
     */
    ActionService.prototype.searchPrintTicket = function (
    /**
     * 検索条件(sskts専用)
     */
    params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/actions/print/ticket',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return ActionService;
}(service_1.Service));
exports.ActionService = ActionService;

},{"../service":80,"http-status":246}],83:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 認可サービス
 */
var AuthorizationService = /** @class */ (function (_super) {
    __extends(AuthorizationService, _super);
    function AuthorizationService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 認可検索
     */
    AuthorizationService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/authorizations',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return AuthorizationService;
}(service_1.Service));
exports.AuthorizationService = AuthorizationService;

},{"../service":80,"http-status":246}],84:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 作品サービス
 */
var CreativeWorkService = /** @class */ (function (_super) {
    __extends(CreativeWorkService, _super);
    function CreativeWorkService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 映画作品検索
     */
    CreativeWorkService.prototype.searchMovies = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/creativeWorks/movie',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return CreativeWorkService;
}(service_1.Service));
exports.CreativeWorkService = CreativeWorkService;

},{"../service":80,"http-status":246}],85:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 配送サービス
 */
var DeliveryService = /** @class */ (function (_super) {
    __extends(DeliveryService, _super);
    function DeliveryService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 注文を配送する
     * 作成された注文データに対して、同期的に注文を配送します(所有権が作成されます)
     * すでに配送済の場合、何もしません。
     */
    DeliveryService.prototype.sendOrder = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/orders/" + params.orderNumber + "/deliver",
                            method: 'POST',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DeliveryService;
}(service_1.Service));
exports.DeliveryService = DeliveryService;

},{"../service":80,"http-status":246}],86:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * イベントサービス
 */
var EventService = /** @class */ (function (_super) {
    __extends(EventService, _super);
    function EventService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * イベント検索
     */
    EventService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/events',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * イベント取得
     */
    EventService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/events/" + params.id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * イベントに対する座席オファー検索
     */
    EventService.prototype.searchOffers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/events/" + params.event.id + "/offers",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * イベントに対する券種オファー検索
     */
    EventService.prototype.searchTicketOffers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/events/" + params.event.id + "/offers/ticket",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK],
                        qs: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return EventService;
}(service_1.Service));
exports.EventService = EventService;

},{"../service":80,"http-status":246}],87:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * IAMサービス
 */
var IAMService = /** @class */ (function (_super) {
    __extends(IAMService, _super);
    function IAMService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * ユーザー検索
     */
    IAMService.prototype.searchUsers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/iam/users',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * ユーザー取得
     */
    IAMService.prototype.findUserById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/iam/users/" + params.id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return IAMService;
}(service_1.Service));
exports.IAMService = IAMService;

},{"../service":80,"http-status":246}],88:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * インボイスサービス
 */
var InvoiceService = /** @class */ (function (_super) {
    __extends(InvoiceService, _super);
    function InvoiceService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * インボイスを検索する
     */
    InvoiceService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/invoices',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return InvoiceService;
}(service_1.Service));
exports.InvoiceService = InvoiceService;

},{"../service":80,"http-status":246}],89:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 注文サービス
 */
var OrderService = /** @class */ (function (_super) {
    __extends(OrderService, _super);
    function OrderService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 注文を作成する
     * 確定した注文取引に対して、同期的に注文データを作成します。
     * すでに注文が作成済の場合、何もしません。
     */
    OrderService.prototype.placeOrder = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/orders',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 確認番号で検索
     * 確認番号と購入者情報より、最新の注文を検索します
     */
    OrderService.prototype.findByConfirmationNumber = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/orders/findByConfirmationNumber',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 注文照会(ttts専用)
     * @deprecated
     */
    OrderService.prototype.findByOrderInquiryKey4ttts = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/ttts/orders/findByOrderInquiryKey',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 予約番号と電話番号で注文情報を取得する(sskts専用)
     */
    OrderService.prototype.findByOrderInquiryKey4sskts = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/orders/findByOrderInquiryKey',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 所有権コードを発行する
     */
    OrderService.prototype.authorizeOwnershipInfos = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/orders/" + params.orderNumber + "/ownershipInfos/authorize",
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 注文に対するアクションを検索する
     */
    OrderService.prototype.searchActionsByOrderNumber = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/orders/" + params.orderNumber + "/actions",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 注文を検索する
     */
    OrderService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/orders',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * ストリーミングダウンロード
     */
    OrderService.prototype.download = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/orders/download",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.body];
                    }); }); })];
            });
        });
    };
    return OrderService;
}(service_1.Service));
exports.OrderService = OrderService;

},{"../service":80,"http-status":246}],90:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 所有権サービス
 */
var OwnershipInfoService = /** @class */ (function (_super) {
    __extends(OwnershipInfoService, _super);
    function OwnershipInfoService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 所有権検索
     */
    OwnershipInfoService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/ownershipInfos',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 所有権トークンを取得する
     * 所有権コードを、jsonwebtokenに変換します
     * 変換されたトークンを使用して、認証、決済等を実行することができます
     * jsonwebtokenはローカル環境で検証することも可能です
     * @see https://jwt.io/
     */
    OwnershipInfoService.prototype.getToken = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/ownershipInfos/tokens',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 所有権検証アクションを検索する
     * 所有権に対して発行されたトークンを認証しようとしたアクションを検索します
     */
    OwnershipInfoService.prototype.searchCheckTokenActions = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/ownershipInfos/" + params.id + "/actions/checkToken",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 登録日と劇場で会員数をカウント(sskts専用)
     */
    OwnershipInfoService.prototype.countByRegisterDateAndTheater = function (
    /**
     * 検索条件
     * fromDateとtoDateの時間を注意して
     */
    params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/ownershipInfos/countByRegisterDateAndTheater',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return OwnershipInfoService;
}(service_1.Service));
exports.OwnershipInfoService = OwnershipInfoService;

},{"../service":80,"http-status":246}],91:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var factory = require("../factory");
var service_1 = require("../service");
/**
 * 決済サービス
 */
var PaymentService = /** @class */ (function (_super) {
    __extends(PaymentService, _super);
    function PaymentService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 口座決済承認
     */
    PaymentService.prototype.authorizeAccount = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/payment/" + factory.paymentMethodType.Account + "/authorize",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 汎用決済承認
     */
    PaymentService.prototype.authorizeAnyPayment = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/payment/any/authorize",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * クレジットカードのオーソリを取得する
     */
    PaymentService.prototype.authorizeCreditCard = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/payment/" + factory.paymentMethodType.CreditCard + "/authorize",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ムビチケ承認
     */
    PaymentService.prototype.authorizeMovieTicket = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/payment/" + factory.paymentMethodType.MovieTicket + "/authorize",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ムビチケ購入番号確認
     */
    PaymentService.prototype.checkMovieTicket = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/payment/" + factory.paymentMethodType.MovieTicket + "/actions/check",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 汎用決済承認取消
     */
    PaymentService.prototype.voidAnyPayment = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/payment/any/authorize/" + params.id + "/void",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 決済承認取消
     */
    PaymentService.prototype.voidTransaction = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/payment/" + params.object.typeOf + "/authorize/" + params.id + "/void",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT],
                            body: params
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PaymentService;
}(service_1.Service));
exports.PaymentService = PaymentService;

},{"../factory":78,"../service":80,"http-status":246}],92:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 決済方法サービス
 */
var PaymentMethodService = /** @class */ (function (_super) {
    __extends(PaymentMethodService, _super);
    function PaymentMethodService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * ムビチケを検索する
     */
    PaymentMethodService.prototype.searchMovieTickets = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/paymentMethods/movieTicket',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return PaymentMethodService;
}(service_1.Service));
exports.PaymentMethodService = PaymentMethodService;

},{"../service":80,"http-status":246}],93:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * ユーザーサービス
 */
var PersonService = /** @class */ (function (_super) {
    __extends(PersonService, _super);
    function PersonService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * プロフィール検索
     */
    PersonService.prototype.getProfile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/profile",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * プロフィール更新
     */
    PersonService.prototype.updateProfile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (typeof params.id === 'string') ? params.id : 'me';
                        return [4 /*yield*/, this.fetch({
                                uri: "/people/" + id + "/profile",
                                method: 'PATCH',
                                body: params,
                                expectedStatusCodes: [http_status_1.NO_CONTENT]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 注文を検索する
     */
    PersonService.prototype.searchOrders = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/orders",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 会員検索
     */
    PersonService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/people',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * ユーザー取得
     */
    PersonService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ユーザー削除
     */
    PersonService.prototype.deletById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (typeof params.id === 'string') ? params.id : 'me';
                        return [4 /*yield*/, this.fetch({
                                uri: "/people/" + id,
                                method: 'DELETE',
                                body: params,
                                expectedStatusCodes: [http_status_1.NO_CONTENT]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 会員プログラムに登録する(sskts専用)
     */
    PersonService.prototype.registerProgramMembership = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/programMembership/register",
                        method: 'PUT',
                        body: {
                            programMembershipId: params.programMembershipId,
                            offerIdentifier: params.offerIdentifier,
                            sellerType: params.sellerType,
                            sellerId: params.sellerId
                        },
                        expectedStatusCodes: [http_status_1.ACCEPTED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 会員プログラム登録解除(sskts専用)
     */
    PersonService.prototype.unRegisterProgramMembership = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/programMembership/" + params.ownershipInfoIdentifier + "/unRegister",
                        method: 'PUT',
                        body: {},
                        expectedStatusCodes: [http_status_1.ACCEPTED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return PersonService;
}(service_1.Service));
exports.PersonService = PersonService;

},{"../service":80,"http-status":246}],94:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../../service");
/**
 * ユーザー所有権サービス
 */
var PersonOwnershipInfoService = /** @class */ (function (_super) {
    __extends(PersonOwnershipInfoService, _super);
    function PersonOwnershipInfoService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * クレジットカード追加
     */
    PersonOwnershipInfoService.prototype.addCreditCard = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/creditCards",
                        method: 'POST',
                        body: params.creditCard,
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * クレジットカード検索
     */
    PersonOwnershipInfoService.prototype.searchCreditCards = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/creditCards",
                        method: 'GET',
                        qs: {},
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * クレジットカード削除
     */
    PersonOwnershipInfoService.prototype.deleteCreditCard = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (typeof params.id === 'string') ? params.id : 'me';
                        return [4 /*yield*/, this.fetch({
                                uri: "/people/" + id + "/ownershipInfos/creditCards/" + params.cardSeq,
                                method: 'DELETE',
                                expectedStatusCodes: [http_status_1.NO_CONTENT]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 口座開設
     */
    PersonOwnershipInfoService.prototype.openAccount = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/accounts/" + params.accountType,
                        method: 'POST',
                        body: {
                            name: params.name
                        },
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 口座解約
     * 口座の状態を変更するだけで、ユーザーの所有する口座リストから削除はされません。
     * 解約された口座で取引を進行しようとすると400エラーとなります。
     */
    PersonOwnershipInfoService.prototype.closeAccount = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (typeof params.id === 'string') ? params.id : 'me';
                        return [4 /*yield*/, this.fetch({
                                uri: "/people/" + id + "/ownershipInfos/accounts/" + params.accountType + "/" + params.accountNumber + "/close",
                                method: 'PUT',
                                expectedStatusCodes: [http_status_1.NO_CONTENT]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 口座取引履歴検索
     */
    PersonOwnershipInfoService.prototype.searchAccountMoneyTransferActions = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/accounts/actions/moneyTransfer",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 所有権検索
     */
    PersonOwnershipInfoService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 所有権に対して認可コードを発行する
     */
    PersonOwnershipInfoService.prototype.authorize = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/" + params.ownershipInfoId + "/authorize",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.OK],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return PersonOwnershipInfoService;
}(service_1.Service));
exports.PersonOwnershipInfoService = PersonOwnershipInfoService;

},{"../../service":80,"http-status":246}],95:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 会員プログラムサービス
 */
var ProgramMembershipService = /** @class */ (function (_super) {
    __extends(ProgramMembershipService, _super);
    function ProgramMembershipService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 検索
     */
    ProgramMembershipService.prototype.search = function (
    /**
     * 検索条件
     */
    params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/programMemberships',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return ProgramMembershipService;
}(service_1.Service));
exports.ProgramMembershipService = ProgramMembershipService;

},{"../service":80,"http-status":246}],96:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * プロジェクトサービス
 */
var ProjectService = /** @class */ (function (_super) {
    __extends(ProjectService, _super);
    function ProjectService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * プロジェクト検索
     */
    ProjectService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/projects',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * プロジェクト取得
     */
    ProjectService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/projects/" + params.id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return ProjectService;
}(service_1.Service));
exports.ProjectService = ProjectService;

},{"../service":80,"http-status":246}],97:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 予約サービス
 */
var ReservationService = /** @class */ (function (_super) {
    __extends(ReservationService, _super);
    function ReservationService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 予約検索
     */
    ReservationService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/reservations',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * トークンで予約照会
     */
    ReservationService.prototype.findScreeningEventReservationByToken = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/reservations/eventReservation/screeningEvent/findByToken",
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return ReservationService;
}(service_1.Service));
exports.ReservationService = ReservationService;

},{"../service":80,"http-status":246}],98:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 販売者サービス
 */
var SellerService = /** @class */ (function (_super) {
    __extends(SellerService, _super);
    function SellerService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 販売者作成
     */
    SellerService.prototype.create = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/sellers',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 販売者取得
     */
    SellerService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/sellers/" + params.id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 販売者検索
     */
    SellerService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/sellers',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 販売者編集
     */
    SellerService.prototype.update = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/sellers/" + params.id,
                            method: 'PUT',
                            body: params.attributes,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 販売者削除
     */
    SellerService.prototype.deleteById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/sellers/" + params.id,
                            method: 'DELETE',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SellerService;
}(service_1.Service));
exports.SellerService = SellerService;

},{"../service":80,"http-status":246}],99:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * タスクサービス
 */
var TaskService = /** @class */ (function (_super) {
    __extends(TaskService, _super);
    function TaskService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * タスク作成
     */
    TaskService.prototype.create = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/tasks/" + params.name,
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * タスク取得
     */
    TaskService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/tasks/" + params.name + "/" + params.id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * タスク検索
     */
    TaskService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/tasks',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return TaskService;
}(service_1.Service));
exports.TaskService = TaskService;

},{"../service":80,"http-status":246}],100:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var factory = require("../../factory");
var service_1 = require("../../service");
/**
 * 通貨転送取引サービス
 */
var MoneyTransferTransactionService = /** @class */ (function (_super) {
    __extends(MoneyTransferTransactionService, _super);
    function MoneyTransferTransactionService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeOf = factory.transactionType.MoneyTransfer;
        return _this;
    }
    /**
     * 取引を開始する
     */
    MoneyTransferTransactionService.prototype.start = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/start",
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 取引確定
     */
    MoneyTransferTransactionService.prototype.confirm = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.id + "/confirm",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 明示的に取引を中止する
     * 既に確定済、あるいは、期限切れの取引に対して実行するとArgumentエラーが返されます。
     */
    MoneyTransferTransactionService.prototype.cancel = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.id + "/cancel",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引検索
     */
    MoneyTransferTransactionService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf,
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 取引に対するアクションを検索する
     */
    MoneyTransferTransactionService.prototype.searchActionsByTransactionId = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.id + "/actions",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return MoneyTransferTransactionService;
}(service_1.Service));
exports.MoneyTransferTransactionService = MoneyTransferTransactionService;

},{"../../factory":78,"../../service":80,"http-status":246}],101:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var factory = require("../../factory");
var service_1 = require("../../service");
/**
 * 注文取引サービス
 */
var PlaceOrderTransactionService = /** @class */ (function (_super) {
    __extends(PlaceOrderTransactionService, _super);
    function PlaceOrderTransactionService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeOf = factory.transactionType.PlaceOrder;
        return _this;
    }
    /**
     * 取引を開始する
     */
    PlaceOrderTransactionService.prototype.start = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/start",
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 座席予約承認
     */
    PlaceOrderTransactionService.prototype.authorizeSeatReservation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/offer/seatReservation",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params.object
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 座席予約承認取消
     */
    PlaceOrderTransactionService.prototype.voidSeatReservation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/offer/seatReservation/" + params.id + "/cancel",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポイントインセンティブ承認
     */
    PlaceOrderTransactionService.prototype.authorizePointAward = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/award/accounts/point",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params.object
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ポイントインセンティブ承認取消
     */
    PlaceOrderTransactionService.prototype.voidPointAward = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/award/accounts/point/" + params.id + "/cancel",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 購入者プロフィール変更
     */
    PlaceOrderTransactionService.prototype.setCustomerContact = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.id + "/customerContact",
                        method: 'PUT',
                        expectedStatusCodes: [http_status_1.OK],
                        body: params.object.customerContact
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 取引確定
     */
    PlaceOrderTransactionService.prototype.confirm = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.id + "/confirm",
                        method: 'PUT',
                        expectedStatusCodes: [http_status_1.OK],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 明示的に取引を中止する
     * 既に確定済、あるいは、期限切れの取引に対して実行するとArgumentエラーが返されます。
     */
    PlaceOrderTransactionService.prototype.cancel = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.id + "/cancel",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引検索
     */
    PlaceOrderTransactionService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf,
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 取引に対するアクションを検索する
     */
    PlaceOrderTransactionService.prototype.searchActionsByTransactionId = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.id + "/actions",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ストリーミングダウンロード
     */
    PlaceOrderTransactionService.prototype.stream = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/report",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.body];
                    }); }); })];
            });
        });
    };
    return PlaceOrderTransactionService;
}(service_1.Service));
exports.PlaceOrderTransactionService = PlaceOrderTransactionService;

},{"../../factory":78,"../../service":80,"http-status":246}],102:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var placeOrder_1 = require("./placeOrder");
/**
 * 注文取引サービス(sskts専用)
 */
var PlaceOrderTransaction4ssktsService = /** @class */ (function (_super) {
    __extends(PlaceOrderTransaction4ssktsService, _super);
    function PlaceOrderTransaction4ssktsService(options) {
        return _super.call(this, options) || this; /* istanbul ignore next */
    }
    /**
     * 座席予約オファー承認
     */
    PlaceOrderTransaction4ssktsService.prototype.createSeatReservationAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/seatReservation",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: {
                            eventIdentifier: params.object.event.id,
                            offers: params.object.acceptedOffer
                        }
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 座席予約オファー承認取消
     */
    PlaceOrderTransaction4ssktsService.prototype.cancelSeatReservationAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/seatReservation/" + params.id,
                            method: 'DELETE',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 座席予約承認アクションの供給情報を変更する
     * 完了ステータスの座席仮予約に対して券種変更する際に使用
     */
    PlaceOrderTransaction4ssktsService.prototype.changeSeatReservationOffers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/seatReservation/" + params.id,
                        method: 'PATCH',
                        expectedStatusCodes: [http_status_1.OK],
                        body: {
                            eventIdentifier: params.object.event.id,
                            offers: params.object.acceptedOffer
                        }
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ムビチケ決済承認
     */
    PlaceOrderTransaction4ssktsService.prototype.createMvtkAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/mvtk",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params.object
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ムビチケ決済承認取消
     */
    PlaceOrderTransaction4ssktsService.prototype.cancelMvtkAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/mvtk/" + params.id,
                            method: 'DELETE',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポイントインセンティブ承認
     */
    PlaceOrderTransaction4ssktsService.prototype.createPecorinoAwardAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/award/pecorino",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: {
                            amount: params.object.amount,
                            toAccountNumber: params.object.toAccountNumber,
                            notes: params.object.notes
                        }
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ポイントインセンティブ承認取消
     */
    PlaceOrderTransaction4ssktsService.prototype.cancelPecorinoAwardAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/award/pecorino/" + params.id,
                            method: 'DELETE',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引確定
     */
    PlaceOrderTransaction4ssktsService.prototype.confirm = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.id + "/confirm",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return PlaceOrderTransaction4ssktsService;
}(placeOrder_1.PlaceOrderTransactionService));
exports.PlaceOrderTransaction4ssktsService = PlaceOrderTransaction4ssktsService;

},{"./placeOrder":101,"http-status":246}],103:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var placeOrder_1 = require("./placeOrder");
/**
 * 注文取引サービス(ttts専用)
 */
var PlaceOrderTransaction4tttsService = /** @class */ (function (_super) {
    __extends(PlaceOrderTransaction4tttsService, _super);
    function PlaceOrderTransaction4tttsService(options) {
        return _super.call(this, options) || this; /* istanbul ignore next */
    }
    /**
     * 取引に座席予約を追加する
     */
    PlaceOrderTransaction4tttsService.prototype.createSeatReservationAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/ttts/transactions/" + this.typeOf + "/" + params.transactionId + "/actions/authorize/seatReservation",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: {
                            performance_id: params.performanceId,
                            offers: params.offers
                        }
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 座席予約取消
     */
    PlaceOrderTransaction4tttsService.prototype.cancelSeatReservationAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/ttts/transactions/" + this.typeOf + "/" + params.transactionId + "/actions/authorize/seatReservation/" + params.actionId,
                            method: 'DELETE',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引確定
     */
    PlaceOrderTransaction4tttsService.prototype.confirm = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/ttts/transactions/" + this.typeOf + "/" + params.id + "/confirm",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: __assign(__assign({}, params), { payment_method: params.paymentMethod })
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 確定した取引に関して、購入者にメール通知を送信する
     */
    PlaceOrderTransaction4tttsService.prototype.sendEmailNotification = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/ttts/transactions/" + this.typeOf + "/" + params.transactionId + "/tasks/sendEmailNotification",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params.emailMessageAttributes
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return PlaceOrderTransaction4tttsService;
}(placeOrder_1.PlaceOrderTransactionService));
exports.PlaceOrderTransaction4tttsService = PlaceOrderTransaction4tttsService;

},{"./placeOrder":101,"http-status":246}],104:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var factory = require("../../factory");
var service_1 = require("../../service");
/**
 * 注文返品取引サービス
 */
var ReturnOrderTransactionService = /** @class */ (function (_super) {
    __extends(ReturnOrderTransactionService, _super);
    function ReturnOrderTransactionService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeOf = factory.transactionType.ReturnOrder;
        return _this;
    }
    /**
     * 取引を開始する
     */
    ReturnOrderTransactionService.prototype.start = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/start",
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 取引確定
     */
    ReturnOrderTransactionService.prototype.confirm = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.id + "/confirm",
                            method: 'PUT',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引検索
     */
    ReturnOrderTransactionService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/transactions/returnOrder',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return ReturnOrderTransactionService;
}(service_1.Service));
exports.ReturnOrderTransactionService = ReturnOrderTransactionService;

},{"../../factory":78,"../../service":80,"http-status":246}],105:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var factory = require("@cinerino/factory");
var http_status_1 = require("http-status");
var service_1 = require("../../service");
/**
 * 返品取引サービス
 */
var ReturnOrderTransaction4tttsService = /** @class */ (function (_super) {
    __extends(ReturnOrderTransaction4tttsService, _super);
    function ReturnOrderTransaction4tttsService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 取引確定
     */
    ReturnOrderTransaction4tttsService.prototype.confirm = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/ttts/transactions/" + factory.transactionType.ReturnOrder + "/confirm",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: __assign(__assign({}, params), { performance_day: params.performanceDay, payment_no: params.paymentNo })
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 確定した取引に関して、購入者にメール通知を送信する
     */
    ReturnOrderTransaction4tttsService.prototype.sendEmailNotification = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/ttts/transactions/" + factory.transactionType.ReturnOrder + "/" + params.transactionId + "/tasks/sendEmailNotification",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params.emailMessageAttributes
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return ReturnOrderTransaction4tttsService;
}(service_1.Service));
exports.ReturnOrderTransaction4tttsService = ReturnOrderTransaction4tttsService;

},{"../../service":80,"@cinerino/factory":195,"http-status":246}],106:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * Cognitoユーザープールサービス
 */
var UserPoolService = /** @class */ (function (_super) {
    __extends(UserPoolService, _super);
    function UserPoolService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * ユーザープール取得
     */
    UserPoolService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/userPools/" + params.userPoolId,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * クライアント検索
     */
    UserPoolService.prototype.searchClients = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/userPools/" + params.userPoolId + "/clients",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: Number(response.headers.get('X-Total-Count'))
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * クライアント取得
     */
    UserPoolService.prototype.findClientById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/userPools/" + params.userPoolId + "/clients/" + params.clientId,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return UserPoolService;
}(service_1.Service));
exports.UserPoolService = UserPoolService;

},{"../service":80,"http-status":246}],107:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-classes-per-file
/**
 * transporters
 */
var createDebug = require("debug");
var fetch = require("isomorphic-fetch");
var debug = createDebug('cinerino-api-abstract-client:transporters');
// tslint:disable-next-line
// const pkg = require('../package.json');
/**
 * トランスポーター抽象クラス
 */
var Transporter = /** @class */ (function () {
    function Transporter() {
    }
    return Transporter;
}());
exports.Transporter = Transporter;
/**
 * RequestError
 */
var RequestError = /** @class */ (function (_super) {
    __extends(RequestError, _super);
    function RequestError(message) {
        var _this = 
        // tslint:disable-next-line:no-single-line-block-comment
        _super.call(this, message) /* istanbul ignore next */ || this;
        _this.name = 'CinerinoRequestError';
        return _this;
    }
    return RequestError;
}(Error));
exports.RequestError = RequestError;
/**
 * DefaultTransporter
 */
var DefaultTransporter = /** @class */ (function () {
    function DefaultTransporter(expectedStatusCodes) {
        this.expectedStatusCodes = expectedStatusCodes;
    }
    /**
     * Configures request options before making a request.
     */
    DefaultTransporter.CONFIGURE = function (options) {
        // set transporter user agent
        // options.headers = (options.headers !== undefined) ? options.headers : {};
        // tslint:disable-next-line:no-single-line-block-comment
        /* istanbul ignore else */
        // if (!(<any>options.headers)['User-Agent']) {
        //     (<any>options.headers)['User-Agent'] = DefaultTransporter.USER_AGENT;
        // } else if ((<any>options.headers)['User-Agent'].indexOf(DefaultTransporter.USER_AGENT) === -1) {
        //     (<any>options.headers)['User-Agent'] = `${(<any>options.headers)['User-Agent']} ${DefaultTransporter.USER_AGENT}`;
        // }
        return options;
    };
    /**
     * Makes a request with given options and invokes callback.
     */
    DefaultTransporter.prototype.fetch = function (url, options) {
        return __awaiter(this, void 0, void 0, function () {
            var fetchOptions;
            var _this = this;
            return __generator(this, function (_a) {
                fetchOptions = DefaultTransporter.CONFIGURE(options);
                debug('fetching...', url, fetchOptions);
                return [2 /*return*/, fetch(url, fetchOptions)
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, this.wrapCallback(response)];
                    }); }); })];
            });
        });
    };
    /**
     * Wraps the response callback.
     */
    DefaultTransporter.prototype.wrapCallback = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var err, body, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        err = new RequestError('An unexpected error occurred');
                        debug('request processed', response.status);
                        if (!(this.expectedStatusCodes.indexOf(response.status) < 0)) return [3 /*break*/, 6];
                        body = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, response.clone()
                                .json()];
                    case 2:
                        // Only and only application/json responses should
                        // be decoded back to JSON, but there are cases API back-ends
                        // responds without proper content-type.
                        body = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        return [4 /*yield*/, response.clone()
                                .text()];
                    case 4:
                        body = _a.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        if (typeof body === 'object' && body.error !== undefined) {
                            err = new RequestError(body.error.message);
                            err.code = response.status;
                            err.errors = body.error.errors;
                        }
                        else {
                            err = new RequestError(body);
                            err.code = response.status;
                            err.errors = [];
                        }
                        return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, response];
                    case 7: throw err;
                }
            });
        });
    };
    return DefaultTransporter;
}());
exports.DefaultTransporter = DefaultTransporter;
/**
 * スタブトランポーター
 */
var StubTransporter = /** @class */ (function () {
    function StubTransporter(body) {
        this.body = body;
    }
    StubTransporter.prototype.fetch = function (_, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Response(this.body, options)];
            });
        });
    };
    return StubTransporter;
}());
exports.StubTransporter = StubTransporter;

},{"debug":244,"isomorphic-fetch":248}],108:[function(require,module,exports){
'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var util = require('./utils');

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = util.assign(
    {
        'default': Format.RFC3986,
        formatters: {
            RFC1738: function (value) {
                return replace.call(value, percentTwenties, '+');
            },
            RFC3986: function (value) {
                return String(value);
            }
        }
    },
    Format
);

},{"./utils":112}],109:[function(require,module,exports){
'use strict';

var stringify = require('./stringify');
var parse = require('./parse');
var formats = require('./formats');

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};

},{"./formats":108,"./parse":110,"./stringify":111}],110:[function(require,module,exports){
'use strict';

var utils = require('./utils');

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = options.decoder(part.slice(pos + 1), defaults.decoder, charset, 'value');
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (val && options.comma && val.indexOf(',') > -1) {
            val = val.split(',');
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new Error('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

},{"./utils":112}],111:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var formats = require('./formats');
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly,
    charset
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = obj.join(',');
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key') : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key');
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value'))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (isArray(obj)) {
            pushToArray(values, stringify(
                obj[key],
                typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix,
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        } else {
            pushToArray(values, stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        }
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.formatter,
            options.encodeValuesOnly,
            options.charset
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

},{"./formats":108,"./utils":112}],112:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    merge: merge
};

},{}],113:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Chevre Factory
 */
__export(require("@chevre/factory"));

},{"@chevre/factory":76}],114:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],115:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 口座タイプ
 * Pecorinoサービスに対して口座タイプを指定します。
 */
var AccountType;
(function (AccountType) {
    /**
     * コイン口座
     */
    AccountType["Coin"] = "Coin";
    /**
     * ポイント口座
     */
    AccountType["Point"] = "Point";
})(AccountType || (AccountType = {}));
exports.default = AccountType;

},{}],116:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],117:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * アクションタイプ
 */
var ActionType;
(function (ActionType) {
    ActionType["AuthorizeAction"] = "AuthorizeAction";
    ActionType["CancelAction"] = "CancelAction";
    ActionType["CheckAction"] = "CheckAction";
    ActionType["ConfirmAction"] = "ConfirmAction";
    ActionType["DeleteAction"] = "DeleteAction";
    ActionType["GiveAction"] = "GiveAction";
    ActionType["InformAction"] = "InformAction";
    ActionType["MoneyTransfer"] = "MoneyTransfer";
    ActionType["OrderAction"] = "OrderAction";
    ActionType["PayAction"] = "PayAction";
    ActionType["PrintAction"] = "PrintAction";
    ActionType["RefundAction"] = "RefundAction";
    ActionType["RegisterAction"] = "RegisterAction";
    ActionType["ReturnAction"] = "ReturnAction";
    ActionType["SendAction"] = "SendAction";
    ActionType["UnRegisterAction"] = "UnRegisterAction";
    ActionType["UpdateAction"] = "UpdateAction";
    ActionType["UseAction"] = "UseAction";
})(ActionType || (ActionType = {}));
exports.default = ActionType;

},{}],118:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectType;
(function (ObjectType) {
    ObjectType["PointAward"] = "PointAward";
})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));

},{}],119:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],120:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],121:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectType;
(function (ObjectType) {
    ObjectType["SeatReservation"] = "SeatReservation";
})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));

},{}],122:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],123:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],124:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],125:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],126:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],127:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],128:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],129:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],130:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],131:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],132:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],133:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],134:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],135:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],136:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var point_1 = require("../../authorize/award/point");
exports.ObjectType = point_1.ObjectType;

},{"../../authorize/award/point":118}],137:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],138:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],139:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],140:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],141:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],142:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],143:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],144:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],145:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],146:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],147:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],148:[function(require,module,exports){
"use strict";
/**
 * Media type typically expressed using a MIME format
 * @see http://www.iana.org/assignments/media-types/media-types.xhtml
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Application;
(function (Application) {
    Application["pdf"] = "application/pdf";
    Application["json"] = "application/json";
})(Application = exports.Application || (exports.Application = {}));
var Audio;
(function (Audio) {
})(Audio = exports.Audio || (exports.Audio = {}));
var Font;
(function (Font) {
})(Font = exports.Font || (exports.Font = {}));
var Example;
(function (Example) {
})(Example = exports.Example || (exports.Example = {}));
var Image;
(function (Image) {
})(Image = exports.Image || (exports.Image = {}));
var Message;
(function (Message) {
})(Message = exports.Message || (exports.Message = {}));
var Model;
(function (Model) {
})(Model = exports.Model || (exports.Model = {}));
var Multipart;
(function (Multipart) {
})(Multipart = exports.Multipart || (exports.Multipart = {}));
var Text;
(function (Text) {
    Text["csv"] = "text/csv";
})(Text = exports.Text || (exports.Text = {}));
var Video;
(function (Video) {
})(Video = exports.Video || (exports.Video = {}));

},{}],149:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],150:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * AlreadyInUseError
 */
var AlreadyInUseError = /** @class */ (function (_super) {
    __extends(AlreadyInUseError, _super);
    function AlreadyInUseError(entityName, fieldNames, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "The specified '" + entityName + "' value is already in use for: " + fieldNames.join(', ') + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.AlreadyInUse, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        _this.fieldNames = fieldNames;
        setPrototypeOf(_this, AlreadyInUseError.prototype);
        return _this;
    }
    return AlreadyInUseError;
}(common_1.CinerinoError));
exports.default = AlreadyInUseError;

},{"../errorCode":149,"./common":153,"setprototypeof":256}],151:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * ArgumentError
 */
var ArgumentError = /** @class */ (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Invalid or missing argument supplied: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Argument, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentError.prototype);
        return _this;
    }
    return ArgumentError;
}(common_1.CinerinoError));
exports.default = ArgumentError;

},{"../errorCode":149,"./common":153,"setprototypeof":256}],152:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * ArgumentNullError
 */
var ArgumentNullError = /** @class */ (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Missing argument: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ArgumentNull, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentNullError.prototype);
        return _this;
    }
    return ArgumentNullError;
}(common_1.CinerinoError));
exports.default = ArgumentNullError;

},{"../errorCode":149,"./common":153,"setprototypeof":256}],153:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * CinerinoError
 */
var CinerinoError = /** @class */ (function (_super) {
    __extends(CinerinoError, _super);
    function CinerinoError(code, message) {
        var _this = 
        // tslint:disable-next-line:no-single-line-block-comment
        _super.call(this, message) /* istanbul ignore next */ || this;
        _this.name = 'CinerinoError';
        _this.reason = code;
        return _this;
    }
    return CinerinoError;
}(Error));
exports.CinerinoError = CinerinoError;

},{}],154:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * ForbiddenError
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Forbidden.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Forbidden, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ForbiddenError.prototype);
        return _this;
    }
    return ForbiddenError;
}(common_1.CinerinoError));
exports.default = ForbiddenError;

},{"../errorCode":149,"./common":153,"setprototypeof":256}],155:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * NotFoundError
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(entityName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Not Found: " + entityName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotFound, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        setPrototypeOf(_this, NotFoundError.prototype);
        return _this;
    }
    return NotFoundError;
}(common_1.CinerinoError));
exports.default = NotFoundError;

},{"../errorCode":149,"./common":153,"setprototypeof":256}],156:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * NotImplementedError
 */
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Method is not yet implemented.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotImplemented, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, NotImplementedError.prototype);
        return _this;
    }
    return NotImplementedError;
}(common_1.CinerinoError));
exports.default = NotImplementedError;

},{"../errorCode":149,"./common":153,"setprototypeof":256}],157:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * RateLimitExceededError
 */
var RateLimitExceededError = /** @class */ (function (_super) {
    __extends(RateLimitExceededError, _super);
    function RateLimitExceededError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Rate limit exceeded.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.RateLimitExceeded, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, RateLimitExceededError.prototype);
        return _this;
    }
    return RateLimitExceededError;
}(common_1.CinerinoError));
exports.default = RateLimitExceededError;

},{"../errorCode":149,"./common":153,"setprototypeof":256}],158:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * ServiceUnavailableError
 */
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Service unavailable temporarily.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ServiceUnavailable, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ServiceUnavailableError.prototype);
        return _this;
    }
    return ServiceUnavailableError;
}(common_1.CinerinoError));
exports.default = ServiceUnavailableError;

},{"../errorCode":149,"./common":153,"setprototypeof":256}],159:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * UnauthorizedError
 */
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Unauthorized.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Unauthorized, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, UnauthorizedError.prototype);
        return _this;
    }
    return UnauthorizedError;
}(common_1.CinerinoError));
exports.default = UnauthorizedError;

},{"../errorCode":149,"./common":153,"setprototypeof":256}],160:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * errors
 */
var alreadyInUse_1 = require("./error/alreadyInUse");
exports.AlreadyInUse = alreadyInUse_1.default;
var argument_1 = require("./error/argument");
exports.Argument = argument_1.default;
var argumentNull_1 = require("./error/argumentNull");
exports.ArgumentNull = argumentNull_1.default;
var common_1 = require("./error/common");
exports.Cinerino = common_1.CinerinoError;
var forbidden_1 = require("./error/forbidden");
exports.Forbidden = forbidden_1.default;
var notFound_1 = require("./error/notFound");
exports.NotFound = notFound_1.default;
var notImplemented_1 = require("./error/notImplemented");
exports.NotImplemented = notImplemented_1.default;
var rateLimitExceeded_1 = require("./error/rateLimitExceeded");
exports.RateLimitExceeded = rateLimitExceeded_1.default;
var serviceUnavailable_1 = require("./error/serviceUnavailable");
exports.ServiceUnavailable = serviceUnavailable_1.default;
var unauthorized_1 = require("./error/unauthorized");
exports.Unauthorized = unauthorized_1.default;

},{"./error/alreadyInUse":150,"./error/argument":151,"./error/argumentNull":152,"./error/common":153,"./error/forbidden":154,"./error/notFound":155,"./error/notImplemented":156,"./error/rateLimitExceeded":157,"./error/serviceUnavailable":158,"./error/unauthorized":159}],161:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],162:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],163:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],164:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],165:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SeatReservationOfferFactory = require("./offer/seatReservation");
exports.seatReservation = SeatReservationOfferFactory;

},{"./offer/seatReservation":166}],166:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],167:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],168:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 注文ステータス
 */
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["OrderCancelled"] = "OrderCancelled";
    OrderStatus["OrderDelivered"] = "OrderDelivered";
    OrderStatus["OrderInTransit"] = "OrderInTransit";
    OrderStatus["OrderPaymentDue"] = "OrderPaymentDue";
    OrderStatus["OrderPickupAvailable"] = "OrderPickupAvailable";
    OrderStatus["OrderProblem"] = "OrderProblem";
    OrderStatus["OrderProcessing"] = "OrderProcessing";
    OrderStatus["OrderReturned"] = "OrderReturned";
})(OrderStatus || (OrderStatus = {}));
exports.default = OrderStatus;

},{}],169:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],170:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 組織タイプ
 */
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["Corporation"] = "Corporation";
    OrganizationType["MovieTheater"] = "MovieTheater";
})(OrganizationType || (OrganizationType = {}));
exports.default = OrganizationType;

},{}],171:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 口座タイプ
 */
var AccountGoodType;
(function (AccountGoodType) {
    /**
     * 口座
     */
    AccountGoodType["Account"] = "Account";
})(AccountGoodType = exports.AccountGoodType || (exports.AccountGoodType = {}));

},{}],172:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chevre_1 = require("../chevre");
/**
 * 決済方法タイプ
 */
exports.default = chevre_1.paymentMethodType;

},{"../chevre":113}],173:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],174:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],175:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 決済ステータス
 */
var PaymentStatusType;
(function (PaymentStatusType) {
    PaymentStatusType["PaymentAutomaticallyApplied"] = "PaymentAutomaticallyApplied";
    PaymentStatusType["PaymentComplete"] = "PaymentComplete";
    PaymentStatusType["PaymentDeclined"] = "PaymentDeclined";
    PaymentStatusType["PaymentDue"] = "PaymentDue";
    PaymentStatusType["PaymentPastDue"] = "PaymentPastDue";
})(PaymentStatusType || (PaymentStatusType = {}));
exports.default = PaymentStatusType;

},{}],176:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],177:[function(require,module,exports){
"use strict";
/**
 * 人物タイプ
 */
Object.defineProperty(exports, "__esModule", { value: true });
var PersonType;
(function (PersonType) {
    PersonType["Person"] = "Person";
})(PersonType || (PersonType = {}));
exports.default = PersonType;

},{}],178:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 場所タイプ
 */
var PlaceType;
(function (PlaceType) {
    PlaceType["Online"] = "Online";
    PlaceType["Store"] = "Store";
})(PlaceType || (PlaceType = {}));
exports.default = PlaceType;

},{}],179:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],180:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export type ProgramMembershipType = 'ProgramMembership';
var ProgramMembershipType;
(function (ProgramMembershipType) {
    ProgramMembershipType["ProgramMembership"] = "ProgramMembership";
})(ProgramMembershipType = exports.ProgramMembershipType || (exports.ProgramMembershipType = {}));

},{}],181:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],182:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],183:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],184:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Identifier;
(function (Identifier) {
    Identifier["COA"] = "COA";
    Identifier["Chevre"] = "Chevre";
})(Identifier = exports.Identifier || (exports.Identifier = {}));

},{}],185:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"dup":55}],186:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * タスク名
 */
var TaskName;
(function (TaskName) {
    /**
     * イベント予約集計
     */
    TaskName["AggregateEventReservations"] = "aggregateEventReservations";
    /**
     * 口座承認アクション取消
     */
    TaskName["CancelAccount"] = "cancelAccount";
    /**
     * クレジットカード承認アクション取消
     */
    TaskName["CancelCreditCard"] = "cancelCreditCard";
    /**
     * ポイントインセンティブ承認アクション取消
     */
    TaskName["CancelPointAward"] = "cancelPointAward";
    /**
     * 予約取消
     */
    TaskName["CancelReservation"] = "cancelReservation";
    /**
     * 座席予約承認アクション取消
     */
    TaskName["CancelSeatReservation"] = "cancelSeatReservation";
    /**
     * 予約確定
     */
    TaskName["ConfirmReservation"] = "confirmReservation";
    /**
     * 会員削除
     */
    TaskName["DeleteMember"] = "deleteMember";
    /**
     * ポイントインセンティブ付与
     */
    TaskName["GivePointAward"] = "givePointAward";
    /**
     * 上映イベント在庫仕入れ
     */
    TaskName["ImportScreeningEvents"] = "importScreeningEvents";
    /**
     * 通貨転送
     */
    TaskName["MoneyTransfer"] = "moneyTransfer";
    /**
     * 会員プログラム注文
     */
    TaskName["OrderProgramMembership"] = "orderProgramMembership";
    /**
     * 口座支払
     */
    TaskName["PayAccount"] = "payAccount";
    /**
     * クレジットカード支払
     */
    TaskName["PayCreditCard"] = "payCreditCard";
    /**
     * ムビチケ支払
     */
    TaskName["PayMovieTicket"] = "payMovieTicket";
    /**
     * 注文受付
     */
    TaskName["PlaceOrder"] = "placeOrder";
    /**
     * クレジットカード返金
     */
    TaskName["RefundCreditCard"] = "refundCreditCard";
    /**
     * ムビチケ着券取消
     */
    TaskName["RefundMovieTicket"] = "refundMovieTicket";
    /**
     * 口座返金
     */
    TaskName["RefundAccount"] = "refundAccount";
    /**
     * 会員プログラム登録
     */
    TaskName["RegisterProgramMembership"] = "registerProgramMembership";
    /**
     * 注文返品
     */
    TaskName["ReturnOrder"] = "returnOrder";
    /**
     * ポイントインセンティブ返却
     */
    TaskName["ReturnPointAward"] = "returnPointAward";
    /**
     *  Eメールメッセージ送信
     */
    TaskName["SendEmailMessage"] = "sendEmailMessage";
    /**
     * 注文配送
     */
    TaskName["SendOrder"] = "sendOrder";
    /**
     * ウェブフックをたたく
     */
    TaskName["TriggerWebhook"] = "triggerWebhook";
    /**
     * 会員プログラム登録解除
     */
    TaskName["UnRegisterProgramMembership"] = "unRegisterProgramMembership";
    /**
     * イベント席数更新
     */
    TaskName["UpdateEventAttendeeCapacity"] = "updateEventAttendeeCapacity";
})(TaskName || (TaskName = {}));
exports.default = TaskName;

},{}],187:[function(require,module,exports){
"use strict";
/**
 * タスクステータス
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TaskStatus;
(function (TaskStatus) {
    /**
     * 準備OK
     */
    TaskStatus["Ready"] = "Ready";
    /**
     * 実行中
     */
    TaskStatus["Running"] = "Running";
    /**
     * 実行済
     */
    TaskStatus["Executed"] = "Executed";
    /**
     * 実行中止
     */
    TaskStatus["Aborted"] = "Aborted";
})(TaskStatus || (TaskStatus = {}));
exports.default = TaskStatus;

},{}],188:[function(require,module,exports){
arguments[4][69][0].apply(exports,arguments)
},{"dup":69}],189:[function(require,module,exports){
arguments[4][70][0].apply(exports,arguments)
},{"dup":70}],190:[function(require,module,exports){
"use strict";
/**
 * 取引タイプ
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionType;
(function (TransactionType) {
    /**
     * 通貨転送
     */
    TransactionType["MoneyTransfer"] = "MoneyTransfer";
    /**
     * 注文取引
     */
    TransactionType["PlaceOrder"] = "PlaceOrder";
    /**
     * 注文返品取引
     */
    TransactionType["ReturnOrder"] = "ReturnOrder";
})(TransactionType || (TransactionType = {}));
exports.default = TransactionType;

},{}],191:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],192:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],193:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 返品理由
 */
var Reason;
(function (Reason) {
    /**
     * 顧客自身の都合での返品
     */
    Reason["Customer"] = "Customer";
    /**
     * 販売者都合での返品
     */
    Reason["Seller"] = "Seller";
})(Reason = exports.Reason || (exports.Reason = {}));

},{}],194:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],195:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * factory
 */
var pecorino = require("@pecorino/factory");
var waiter = require("@waiter/factory");
var chevre = require("./chevre");
var cognito = require("./cognito");
var PointAwardAuthorizeActionFactory = require("./factory/action/authorize/award/point");
var AuthorizeMvtkDiscountActionFactory = require("./factory/action/authorize/discount/mvtk");
var AuthorizeProgramMembershipOfferActionFactory = require("./factory/action/authorize/offer/programMembership");
var AuthorizeSeatReservationOfferActionFactory = require("./factory/action/authorize/offer/seatReservation");
var AuthorizeAccountPaymentActionFactory = require("./factory/action/authorize/paymentMethod/account");
var AuthorizeAnyPaymentActionFactory = require("./factory/action/authorize/paymentMethod/any");
var AuthorizeCreditCardPaymentActionFactory = require("./factory/action/authorize/paymentMethod/creditCard");
var AuthorizeMovieTicketPaymentActionFactory = require("./factory/action/authorize/paymentMethod/movieTicket");
var CheckMovieTicketActionFactory = require("./factory/action/check/paymentMethod/movieTicket");
var CheckTokenActionFactory = require("./factory/action/check/token");
var ConfirmReservationActionFactory = require("./factory/action/interact/confirm/reservation");
var InformActionFactory = require("./factory/action/interact/inform");
var RegisterProgramMembershipActionFactory = require("./factory/action/interact/register/programMembership");
var UnRegisterProgramMembershipActionFactory = require("./factory/action/interact/unRegister/programMembership");
var CancelActionFactory = require("./factory/action/organize/cancel");
var OrderActionFactory = require("./factory/action/trade/order");
var PayActionFactory = require("./factory/action/trade/pay");
var RefundActionFactory = require("./factory/action/trade/refund");
var GivePointAwardActionFactory = require("./factory/action/transfer/give/pointAward");
var MoneyTransferActionFactory = require("./factory/action/transfer/moneyTransfer");
var PrintTicketActionFactory = require("./factory/action/transfer/print/ticket");
var ReturnOrderActionFactory = require("./factory/action/transfer/return/order");
var ReturnPointAwardActionFactory = require("./factory/action/transfer/return/pointAward");
var SendEmailMessageActionFactory = require("./factory/action/transfer/send/message/email");
var SendOrderActionFactory = require("./factory/action/transfer/send/order");
var DeleteMemberActionFactory = require("./factory/action/update/delete/member");
var actionStatusType_1 = require("./factory/actionStatusType");
var actionType_1 = require("./factory/actionType");
var accountType_1 = require("./factory/accountType");
var AuthorizationFactory = require("./factory/authorization");
var ClientUserFactory = require("./factory/clientUser");
var EmailMessageFactory = require("./factory/creativeWork/message/email");
var creativeWorkType_1 = require("./factory/creativeWorkType");
var EncodingFormat = require("./factory/encodingFormat");
var ScreeningEventFactory = require("./factory/event/screeningEvent");
var ScreeningEventSeriesFactory = require("./factory/event/screeningEventSeries");
var InvoiceFactory = require("./factory/invoice");
var MonetaryAmountFactory = require("./factory/monetaryAmount");
var OfferFactory = require("./factory/offer");
var OrderFactory = require("./factory/order");
var orderStatus_1 = require("./factory/orderStatus");
var OrganizationFactory = require("./factory/organization");
var organizationType_1 = require("./factory/organizationType");
var OwnershipInfoFactory = require("./factory/ownershipInfo");
var CreditCardFactory = require("./factory/paymentMethod/paymentCard/creditCard");
var MovieTicketFactory = require("./factory/paymentMethod/paymentCard/movieTicket");
var paymentMethodType_1 = require("./factory/paymentMethodType");
var paymentStatusType_1 = require("./factory/paymentStatusType");
var PersonFactory = require("./factory/person");
var personType_1 = require("./factory/personType");
var placeType_1 = require("./factory/placeType");
var priceCurrency_1 = require("./factory/priceCurrency");
var ProgramMembershipFactory = require("./factory/programMembership");
var project = require("./factory/project");
var PropertyValueFactory = require("./factory/propertyValue");
var QuantitativeValueFactory = require("./factory/quantitativeValue");
var WebAPIServiceFactory = require("./factory/service/webAPI");
var unitCode_1 = require("./factory/unitCode");
var sortType_1 = require("./factory/sortType");
var taskName_1 = require("./factory/taskName");
var taskStatus_1 = require("./factory/taskStatus");
var MoneyTransferTransactionFactory = require("./factory/transaction/moneyTransfer");
var PlaceOrderTransactionFactory = require("./factory/transaction/placeOrder");
var ReturnOrderTransactionFactory = require("./factory/transaction/returnOrder");
var transactionStatusType_1 = require("./factory/transactionStatusType");
var transactionTasksExportationStatus_1 = require("./factory/transactionTasksExportationStatus");
var transactionType_1 = require("./factory/transactionType");
var errorCode_1 = require("./factory/errorCode");
var errors = require("./factory/errors");
exports.cognito = cognito;
exports.chevre = chevre;
exports.pecorino = pecorino;
exports.waiter = waiter;
exports.errors = errors;
exports.errorCode = errorCode_1.default;
exports.actionStatusType = actionStatusType_1.default;
exports.actionType = actionType_1.default;
var action;
(function (action) {
    var authorize;
    (function (authorize) {
        var award;
        (function (award) {
            // tslint:disable-next-line:no-shadowed-variable
            award.point = PointAwardAuthorizeActionFactory;
        })(award = authorize.award || (authorize.award = {}));
        // tslint:disable-next-line:no-shadowed-variable
        var paymentMethod;
        (function (paymentMethod) {
            paymentMethod.account = AuthorizeAccountPaymentActionFactory;
            paymentMethod.any = AuthorizeAnyPaymentActionFactory;
            paymentMethod.creditCard = AuthorizeCreditCardPaymentActionFactory;
            paymentMethod.movieTicket = AuthorizeMovieTicketPaymentActionFactory;
        })(paymentMethod = authorize.paymentMethod || (authorize.paymentMethod = {}));
        var discount;
        (function (discount) {
            discount.mvtk = AuthorizeMvtkDiscountActionFactory;
        })(discount = authorize.discount || (authorize.discount = {}));
        // tslint:disable-next-line:no-shadowed-variable
        var offer;
        (function (offer) {
            // tslint:disable-next-line:no-shadowed-variable
            offer.programMembership = AuthorizeProgramMembershipOfferActionFactory;
            // tslint:disable-next-line:no-shadowed-variable
            offer.seatReservation = AuthorizeSeatReservationOfferActionFactory;
        })(offer = authorize.offer || (authorize.offer = {}));
    })(authorize = action.authorize || (action.authorize = {}));
    var check;
    (function (check) {
        // tslint:disable-next-line:no-shadowed-variable
        var paymentMethod;
        (function (paymentMethod) {
            paymentMethod.movieTicket = CheckMovieTicketActionFactory;
        })(paymentMethod = check.paymentMethod || (check.paymentMethod = {}));
        check.token = CheckTokenActionFactory;
    })(check = action.check || (action.check = {}));
    var interact;
    (function (interact) {
        var confirm;
        (function (confirm) {
            confirm.reservation = ConfirmReservationActionFactory;
        })(confirm = interact.confirm || (interact.confirm = {}));
        interact.inform = InformActionFactory;
        var register;
        (function (register) {
            // tslint:disable-next-line:no-shadowed-variable
            register.programMembership = RegisterProgramMembershipActionFactory;
        })(register = interact.register || (interact.register = {}));
        var unRegister;
        (function (unRegister) {
            // tslint:disable-next-line:no-shadowed-variable
            unRegister.programMembership = UnRegisterProgramMembershipActionFactory;
        })(unRegister = interact.unRegister || (interact.unRegister = {}));
    })(interact = action.interact || (action.interact = {}));
    var organize;
    (function (organize) {
        organize.cancel = CancelActionFactory;
    })(organize = action.organize || (action.organize = {}));
    var trade;
    (function (trade) {
        // tslint:disable-next-line:no-shadowed-variable
        trade.order = OrderActionFactory;
        trade.pay = PayActionFactory;
        trade.refund = RefundActionFactory;
    })(trade = action.trade || (action.trade = {}));
    var transfer;
    (function (transfer) {
        var give;
        (function (give) {
            // tslint:disable-next-line:no-shadowed-variable
            give.pointAward = GivePointAwardActionFactory;
        })(give = transfer.give || (transfer.give = {}));
        transfer.moneyTransfer = MoneyTransferActionFactory;
        var print;
        (function (print) {
            print.ticket = PrintTicketActionFactory;
        })(print = transfer.print || (transfer.print = {}));
        /**
         * 返却アクション
         * returnはネームスペース名に使えないのでreturnAction
         */
        var returnAction;
        (function (returnAction) {
            // tslint:disable-next-line:no-shadowed-variable
            returnAction.order = ReturnOrderActionFactory;
            returnAction.pointAward = ReturnPointAwardActionFactory;
        })(returnAction = transfer.returnAction || (transfer.returnAction = {}));
        var send;
        (function (send) {
            var message;
            (function (message) {
                message.email = SendEmailMessageActionFactory;
            })(message = send.message || (send.message = {}));
            // tslint:disable-next-line:no-shadowed-variable
            send.order = SendOrderActionFactory;
        })(send = transfer.send || (transfer.send = {}));
    })(transfer = action.transfer || (action.transfer = {}));
    var update;
    (function (update) {
        var deleteAction;
        (function (deleteAction) {
            deleteAction.member = DeleteMemberActionFactory;
        })(deleteAction = update.deleteAction || (update.deleteAction = {}));
    })(update = action.update || (action.update = {}));
})(action = exports.action || (exports.action = {}));
exports.accountType = accountType_1.default;
exports.authorization = AuthorizationFactory;
exports.encodingFormat = EncodingFormat;
var paymentMethod;
(function (paymentMethod) {
    var paymentCard;
    (function (paymentCard) {
        paymentCard.creditCard = CreditCardFactory;
        paymentCard.movieTicket = MovieTicketFactory;
    })(paymentCard = paymentMethod.paymentCard || (paymentMethod.paymentCard = {}));
})(paymentMethod = exports.paymentMethod || (exports.paymentMethod = {}));
exports.clientUser = ClientUserFactory;
var creativeWork;
(function (creativeWork) {
    var message;
    (function (message) {
        message.email = EmailMessageFactory;
    })(message = creativeWork.message || (creativeWork.message = {}));
})(creativeWork = exports.creativeWork || (exports.creativeWork = {}));
exports.creativeWorkType = creativeWorkType_1.default;
var event;
(function (event) {
    event.screeningEvent = ScreeningEventFactory;
    event.screeningEventSeries = ScreeningEventSeriesFactory;
})(event = exports.event || (exports.event = {}));
exports.invoice = InvoiceFactory;
exports.monetaryAmount = MonetaryAmountFactory;
exports.offer = OfferFactory;
exports.order = OrderFactory;
exports.orderStatus = orderStatus_1.default;
exports.organizationType = organizationType_1.default;
exports.ownershipInfo = OwnershipInfoFactory;
exports.priceCurrency = priceCurrency_1.default;
exports.paymentMethodType = paymentMethodType_1.default;
exports.paymentStatusType = paymentStatusType_1.default;
exports.person = PersonFactory;
exports.personType = personType_1.default;
exports.placeType = placeType_1.default;
exports.programMembership = ProgramMembershipFactory;
exports.project = project;
exports.propertyValue = PropertyValueFactory;
exports.quantitativeValue = QuantitativeValueFactory;
var service;
(function (service) {
    service.webAPI = WebAPIServiceFactory;
})(service = exports.service || (exports.service = {}));
exports.seller = OrganizationFactory;
exports.sortType = sortType_1.default;
var task;
(function (task) {
})(task = exports.task || (exports.task = {}));
exports.taskName = taskName_1.default;
exports.taskStatus = taskStatus_1.default;
var transaction;
(function (transaction) {
    transaction.moneyTransfer = MoneyTransferTransactionFactory;
    transaction.placeOrder = PlaceOrderTransactionFactory;
    transaction.returnOrder = ReturnOrderTransactionFactory;
})(transaction = exports.transaction || (exports.transaction = {}));
exports.transactionStatusType = transactionStatusType_1.default;
exports.transactionTasksExportationStatus = transactionTasksExportationStatus_1.default;
exports.transactionType = transactionType_1.default;
exports.unitCode = unitCode_1.UnitCode;

},{"./chevre":113,"./cognito":114,"./factory/accountType":115,"./factory/action/authorize/award/point":118,"./factory/action/authorize/discount/mvtk":119,"./factory/action/authorize/offer/programMembership":120,"./factory/action/authorize/offer/seatReservation":121,"./factory/action/authorize/paymentMethod/account":122,"./factory/action/authorize/paymentMethod/any":123,"./factory/action/authorize/paymentMethod/creditCard":124,"./factory/action/authorize/paymentMethod/movieTicket":125,"./factory/action/check/paymentMethod/movieTicket":126,"./factory/action/check/token":127,"./factory/action/interact/confirm/reservation":128,"./factory/action/interact/inform":129,"./factory/action/interact/register/programMembership":130,"./factory/action/interact/unRegister/programMembership":131,"./factory/action/organize/cancel":132,"./factory/action/trade/order":133,"./factory/action/trade/pay":134,"./factory/action/trade/refund":135,"./factory/action/transfer/give/pointAward":136,"./factory/action/transfer/moneyTransfer":137,"./factory/action/transfer/print/ticket":138,"./factory/action/transfer/return/order":139,"./factory/action/transfer/return/pointAward":140,"./factory/action/transfer/send/message/email":141,"./factory/action/transfer/send/order":142,"./factory/action/update/delete/member":143,"./factory/actionStatusType":116,"./factory/actionType":117,"./factory/authorization":144,"./factory/clientUser":145,"./factory/creativeWork/message/email":147,"./factory/creativeWorkType":146,"./factory/encodingFormat":148,"./factory/errorCode":149,"./factory/errors":160,"./factory/event/screeningEvent":161,"./factory/event/screeningEventSeries":162,"./factory/invoice":163,"./factory/monetaryAmount":164,"./factory/offer":165,"./factory/order":167,"./factory/orderStatus":168,"./factory/organization":169,"./factory/organizationType":170,"./factory/ownershipInfo":171,"./factory/paymentMethod/paymentCard/creditCard":173,"./factory/paymentMethod/paymentCard/movieTicket":174,"./factory/paymentMethodType":172,"./factory/paymentStatusType":175,"./factory/person":176,"./factory/personType":177,"./factory/placeType":178,"./factory/priceCurrency":179,"./factory/programMembership":180,"./factory/project":181,"./factory/propertyValue":182,"./factory/quantitativeValue":183,"./factory/service/webAPI":184,"./factory/sortType":185,"./factory/taskName":186,"./factory/taskStatus":187,"./factory/transaction/moneyTransfer":191,"./factory/transaction/placeOrder":192,"./factory/transaction/returnOrder":193,"./factory/transactionStatusType":188,"./factory/transactionTasksExportationStatus":189,"./factory/transactionType":190,"./factory/unitCode":194,"@pecorino/factory":229,"@waiter/factory":243}],196:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 口座タイプ
 */
var TypeOf;
(function (TypeOf) {
    /**
     * 普通口座タイプ
     */
    TypeOf["Account"] = "Account";
})(TypeOf = exports.TypeOf || (exports.TypeOf = {}));

},{}],197:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 口座ステータスタイプ
 */
var AccountStatusType;
(function (AccountStatusType) {
    /**
     * 開設済
     */
    AccountStatusType["Opened"] = "Opened";
    /**
     * 解約済
     */
    AccountStatusType["Closed"] = "Closed";
})(AccountStatusType || (AccountStatusType = {}));
exports.default = AccountStatusType;

},{}],198:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],199:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * アクションタイプ
 */
var ActionType;
(function (ActionType) {
    ActionType["AuthorizeAction"] = "AuthorizeAction";
    ActionType["MoneyTransfer"] = "MoneyTransfer";
    ActionType["OrderAction"] = "OrderAction";
    ActionType["PayAction"] = "PayAction";
    ActionType["PrintAction"] = "PrintAction";
    ActionType["RefundAction"] = "RefundAction";
    ActionType["ReturnAction"] = "ReturnAction";
    ActionType["SendAction"] = "SendAction";
    ActionType["TakeAction"] = "TakeAction";
    ActionType["UseAction"] = "UseAction";
})(ActionType || (ActionType = {}));
exports.default = ActionType;

},{}],200:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],201:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],202:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],203:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 作品タイプ
 */
var CreativeWorkType;
(function (CreativeWorkType) {
    CreativeWorkType["EmailMessage"] = "EmailMessage";
})(CreativeWorkType || (CreativeWorkType = {}));
exports.default = CreativeWorkType;

},{}],204:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],205:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * エラーコード
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["AlreadyInUse"] = "AlreadyInUse";
    ErrorCode["Argument"] = "Argument";
    ErrorCode["ArgumentNull"] = "ArgumentNull";
    ErrorCode["Forbidden"] = "Forbidden";
    ErrorCode["NotFound"] = "NotFound";
    ErrorCode["NotImplemented"] = "NotImplemented";
    ErrorCode["RateLimitExceeded"] = "RateLimitExceeded";
    ErrorCode["ServiceUnavailable"] = "ServiceUnavailable";
    ErrorCode["Unauthorized"] = "Unauthorized";
})(ErrorCode || (ErrorCode = {}));
exports.default = ErrorCode;

},{}],206:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * AlreadyInUseError
 */
var AlreadyInUseError = /** @class */ (function (_super) {
    __extends(AlreadyInUseError, _super);
    function AlreadyInUseError(entityName, fieldNames, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "The specified '" + entityName + "' value is already in use for: " + fieldNames.join(', ') + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.AlreadyInUse, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        _this.fieldNames = fieldNames;
        setPrototypeOf(_this, AlreadyInUseError.prototype);
        return _this;
    }
    return AlreadyInUseError;
}(pecorino_1.PecorinoError));
exports.default = AlreadyInUseError;

},{"../errorCode":205,"./pecorino":212,"setprototypeof":256}],207:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * ArgumentError
 */
var ArgumentError = /** @class */ (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Invalid or missing argument supplied: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Argument, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentError.prototype);
        return _this;
    }
    return ArgumentError;
}(pecorino_1.PecorinoError));
exports.default = ArgumentError;

},{"../errorCode":205,"./pecorino":212,"setprototypeof":256}],208:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * ArgumentNullError
 */
var ArgumentNullError = /** @class */ (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Missing argument: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ArgumentNull, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentNullError.prototype);
        return _this;
    }
    return ArgumentNullError;
}(pecorino_1.PecorinoError));
exports.default = ArgumentNullError;

},{"../errorCode":205,"./pecorino":212,"setprototypeof":256}],209:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * ForbiddenError
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Forbidden.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Forbidden, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ForbiddenError.prototype);
        return _this;
    }
    return ForbiddenError;
}(pecorino_1.PecorinoError));
exports.default = ForbiddenError;

},{"../errorCode":205,"./pecorino":212,"setprototypeof":256}],210:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * NotFoundError
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(entityName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Not Found: " + entityName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotFound, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        setPrototypeOf(_this, NotFoundError.prototype);
        return _this;
    }
    return NotFoundError;
}(pecorino_1.PecorinoError));
exports.default = NotFoundError;

},{"../errorCode":205,"./pecorino":212,"setprototypeof":256}],211:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * NotImplementedError
 */
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Method is not yet implemented.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotImplemented, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, NotImplementedError.prototype);
        return _this;
    }
    return NotImplementedError;
}(pecorino_1.PecorinoError));
exports.default = NotImplementedError;

},{"../errorCode":205,"./pecorino":212,"setprototypeof":256}],212:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * PecorinoError
 * @extends {Error}
 */
var PecorinoError = /** @class */ (function (_super) {
    __extends(PecorinoError, _super);
    function PecorinoError(code, message) {
        var _this = 
        // tslint:disable-next-line:no-single-line-block-comment
        _super.call(this, message) /* istanbul ignore next */ || this;
        _this.name = 'PecorinoError';
        _this.reason = code;
        return _this;
    }
    return PecorinoError;
}(Error));
exports.PecorinoError = PecorinoError;

},{}],213:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * RateLimitExceededError
 */
var RateLimitExceededError = /** @class */ (function (_super) {
    __extends(RateLimitExceededError, _super);
    function RateLimitExceededError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Rate limit exceeded.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.RateLimitExceeded, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, RateLimitExceededError.prototype);
        return _this;
    }
    return RateLimitExceededError;
}(pecorino_1.PecorinoError));
exports.default = RateLimitExceededError;

},{"../errorCode":205,"./pecorino":212,"setprototypeof":256}],214:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * ServiceUnavailableError
 */
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Service unavailable temporarily.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ServiceUnavailable, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ServiceUnavailableError.prototype);
        return _this;
    }
    return ServiceUnavailableError;
}(pecorino_1.PecorinoError));
exports.default = ServiceUnavailableError;

},{"../errorCode":205,"./pecorino":212,"setprototypeof":256}],215:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * UnauthorizedError
 */
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Unauthorized.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Unauthorized, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, UnauthorizedError.prototype);
        return _this;
    }
    return UnauthorizedError;
}(pecorino_1.PecorinoError));
exports.default = UnauthorizedError;

},{"../errorCode":205,"./pecorino":212,"setprototypeof":256}],216:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * errors
 */
var alreadyInUse_1 = require("./error/alreadyInUse");
exports.AlreadyInUse = alreadyInUse_1.default;
var argument_1 = require("./error/argument");
exports.Argument = argument_1.default;
var argumentNull_1 = require("./error/argumentNull");
exports.ArgumentNull = argumentNull_1.default;
var forbidden_1 = require("./error/forbidden");
exports.Forbidden = forbidden_1.default;
var notFound_1 = require("./error/notFound");
exports.NotFound = notFound_1.default;
var notImplemented_1 = require("./error/notImplemented");
exports.NotImplemented = notImplemented_1.default;
var pecorino_1 = require("./error/pecorino");
exports.PECORINO = pecorino_1.PecorinoError;
var rateLimitExceeded_1 = require("./error/rateLimitExceeded");
exports.RateLimitExceeded = rateLimitExceeded_1.default;
var serviceUnavailable_1 = require("./error/serviceUnavailable");
exports.ServiceUnavailable = serviceUnavailable_1.default;
var unauthorized_1 = require("./error/unauthorized");
exports.Unauthorized = unauthorized_1.default;

},{"./error/alreadyInUse":206,"./error/argument":207,"./error/argumentNull":208,"./error/forbidden":209,"./error/notFound":210,"./error/notImplemented":211,"./error/pecorino":212,"./error/rateLimitExceeded":213,"./error/serviceUnavailable":214,"./error/unauthorized":215}],217:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],218:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"dup":55}],219:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * タスク名
 */
var TaskName;
(function (TaskName) {
    /**
     * 現金転送取消
     */
    TaskName["CancelMoneyTransfer"] = "cancelMoneyTransfer";
    /**
     * 現金転送
     */
    TaskName["MoneyTransfer"] = "moneyTransfer";
})(TaskName || (TaskName = {}));
exports.default = TaskName;

},{}],220:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],221:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],222:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],223:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 取引ステータス
 */
var TransactionStatusType;
(function (TransactionStatusType) {
    TransactionStatusType["InProgress"] = "InProgress";
    TransactionStatusType["Canceled"] = "Canceled";
    TransactionStatusType["Confirmed"] = "Confirmed";
    TransactionStatusType["Expired"] = "Expired";
})(TransactionStatusType || (TransactionStatusType = {}));
exports.default = TransactionStatusType;

},{}],224:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 取引タスクエクスポートステータス
 */
var TransactionTasksExportationStatus;
(function (TransactionTasksExportationStatus) {
    /**
     * 未エクスポート
     */
    TransactionTasksExportationStatus["Unexported"] = "Unexported";
    /**
     * エクスポート中
     */
    TransactionTasksExportationStatus["Exporting"] = "Exporting";
    /**
     * エクスポート済
     */
    TransactionTasksExportationStatus["Exported"] = "Exported";
})(TransactionTasksExportationStatus || (TransactionTasksExportationStatus = {}));
exports.default = TransactionTasksExportationStatus;

},{}],225:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 取引タイプ
 */
var TransactionType;
(function (TransactionType) {
    /**
     * 出金取引
     */
    TransactionType["Withdraw"] = "Withdraw";
    /**
     * 入金取引
     */
    TransactionType["Deposit"] = "Deposit";
    /**
     * 転送取引
     */
    TransactionType["Transfer"] = "Transfer";
})(TransactionType || (TransactionType = {}));
exports.default = TransactionType;

},{}],226:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],227:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],228:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],229:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * factory
 */
var AccountFactory = require("./factory/account");
var accountStatusType_1 = require("./factory/accountStatusType");
var MoneyTransferActionFactory = require("./factory/action/transfer/moneyTransfer");
var SendEmailMessageActionFactory = require("./factory/action/transfer/send/message/email");
var actionStatusType_1 = require("./factory/actionStatusType");
var actionType_1 = require("./factory/actionType");
var ClientUserFactory = require("./factory/clientUser");
var EmailMessageFactory = require("./factory/creativeWork/message/email");
var creativeWorkType_1 = require("./factory/creativeWorkType");
var priceCurrency_1 = require("./factory/priceCurrency");
var CancelMoneyTransferTaskFactory = require("./factory/task/cancelMoneyTransfer");
var MoneyTransferTaskFactory = require("./factory/task/moneyTransfer");
var taskName_1 = require("./factory/taskName");
var taskStatus_1 = require("./factory/taskStatus");
var DepositTransactionFactory = require("./factory/transaction/deposit");
var TransferTransactionFactory = require("./factory/transaction/transfer");
var WithdrawTransactionFactory = require("./factory/transaction/withdraw");
var transactionStatusType_1 = require("./factory/transactionStatusType");
var transactionTasksExportationStatus_1 = require("./factory/transactionTasksExportationStatus");
var transactionType_1 = require("./factory/transactionType");
var sortType_1 = require("./factory/sortType");
var errorCode_1 = require("./factory/errorCode");
var errors = require("./factory/errors");
exports.errors = errors;
exports.errorCode = errorCode_1.default;
exports.actionStatusType = actionStatusType_1.default;
exports.actionType = actionType_1.default;
var action;
(function (action) {
    var transfer;
    (function (transfer) {
        transfer.moneyTransfer = MoneyTransferActionFactory;
        var send;
        (function (send) {
            var message;
            (function (message) {
                message.email = SendEmailMessageActionFactory;
            })(message = send.message || (send.message = {}));
        })(send = transfer.send || (transfer.send = {}));
    })(transfer = action.transfer || (action.transfer = {}));
})(action = exports.action || (exports.action = {}));
exports.account = AccountFactory;
exports.accountStatusType = accountStatusType_1.default;
exports.clientUser = ClientUserFactory;
var creativeWork;
(function (creativeWork) {
    var message;
    (function (message) {
        message.email = EmailMessageFactory;
    })(message = creativeWork.message || (creativeWork.message = {}));
})(creativeWork = exports.creativeWork || (exports.creativeWork = {}));
exports.creativeWorkType = creativeWorkType_1.default;
exports.priceCurrency = priceCurrency_1.default;
var task;
(function (task) {
    task.cancelMoneyTransfer = CancelMoneyTransferTaskFactory;
    task.moneyTransfer = MoneyTransferTaskFactory;
})(task = exports.task || (exports.task = {}));
exports.sortType = sortType_1.default;
exports.taskName = taskName_1.default;
exports.taskStatus = taskStatus_1.default;
var transaction;
(function (transaction) {
    transaction.withdraw = WithdrawTransactionFactory;
    transaction.deposit = DepositTransactionFactory;
    transaction.transfer = TransferTransactionFactory;
})(transaction = exports.transaction || (exports.transaction = {}));
exports.transactionStatusType = transactionStatusType_1.default;
exports.transactionTasksExportationStatus = transactionTasksExportationStatus_1.default;
exports.transactionType = transactionType_1.default;

},{"./factory/account":196,"./factory/accountStatusType":197,"./factory/action/transfer/moneyTransfer":200,"./factory/action/transfer/send/message/email":201,"./factory/actionStatusType":198,"./factory/actionType":199,"./factory/clientUser":202,"./factory/creativeWork/message/email":204,"./factory/creativeWorkType":203,"./factory/errorCode":205,"./factory/errors":216,"./factory/priceCurrency":217,"./factory/sortType":218,"./factory/task/cancelMoneyTransfer":221,"./factory/task/moneyTransfer":222,"./factory/taskName":219,"./factory/taskStatus":220,"./factory/transaction/deposit":226,"./factory/transaction/transfer":227,"./factory/transaction/withdraw":228,"./factory/transactionStatusType":223,"./factory/transactionTasksExportationStatus":224,"./factory/transactionType":225}],230:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],231:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * エラーコード
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["AlreadyInUse"] = "AlreadyInUse";
    ErrorCode["Argument"] = "Argument";
    ErrorCode["ArgumentNull"] = "ArgumentNull";
    ErrorCode["Forbidden"] = "Forbidden";
    ErrorCode["NotFound"] = "NotFound";
    ErrorCode["NotImplemented"] = "NotImplemented";
    ErrorCode["ServiceUnavailable"] = "ServiceUnavailable";
    ErrorCode["RateLimitExceeded"] = "RateLimitExceeded";
})(ErrorCode || (ErrorCode = {}));
exports.default = ErrorCode;

},{}],232:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * ArgumentError
 */
var ArgumentError = /** @class */ (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Invalid or missing argument supplied: " + argumentName;
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Argument, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentError.prototype);
        return _this;
    }
    return ArgumentError;
}(waiter_1.WaiterError));
exports.default = ArgumentError;

},{"../errorCode":231,"./waiter":238,"setprototypeof":256}],233:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * ArgumentNullError
 */
var ArgumentNullError = /** @class */ (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Missing argument: " + argumentName;
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Argument, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentNullError.prototype);
        return _this;
    }
    return ArgumentNullError;
}(waiter_1.WaiterError));
exports.default = ArgumentNullError;

},{"../errorCode":231,"./waiter":238,"setprototypeof":256}],234:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * ForbiddenError
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Forbidden';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Forbidden, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ForbiddenError.prototype);
        return _this;
    }
    return ForbiddenError;
}(waiter_1.WaiterError));
exports.default = ForbiddenError;

},{"../errorCode":231,"./waiter":238,"setprototypeof":256}],235:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * NotFoundError
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(entityName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Not Found: " + entityName;
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotFound, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        setPrototypeOf(_this, NotFoundError.prototype);
        return _this;
    }
    return NotFoundError;
}(waiter_1.WaiterError));
exports.default = NotFoundError;

},{"../errorCode":231,"./waiter":238,"setprototypeof":256}],236:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * RateLimitExceededError
 */
var RateLimitExceededError = /** @class */ (function (_super) {
    __extends(RateLimitExceededError, _super);
    function RateLimitExceededError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Rate limit exceeded.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.RateLimitExceeded, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, RateLimitExceededError.prototype);
        return _this;
    }
    return RateLimitExceededError;
}(waiter_1.WaiterError));
exports.default = RateLimitExceededError;

},{"../errorCode":231,"./waiter":238,"setprototypeof":256}],237:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * ServiceUnavailableError
 */
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Service unavailable temporarily.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ServiceUnavailable, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ServiceUnavailableError.prototype);
        return _this;
    }
    return ServiceUnavailableError;
}(waiter_1.WaiterError));
exports.default = ServiceUnavailableError;

},{"../errorCode":231,"./waiter":238,"setprototypeof":256}],238:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * WaiterError
 */
var WaiterError = /** @class */ (function (_super) {
    __extends(WaiterError, _super);
    function WaiterError(code, message) {
        var _this = 
        // tslint:disable-next-line:no-single-line-block-comment
        _super.call(this, message) /* istanbul ignore next */ || this;
        _this.name = 'WaiterError';
        _this.reason = code;
        return _this;
    }
    return WaiterError;
}(Error));
exports.WaiterError = WaiterError;

},{}],239:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * errors
 */
var argument_1 = require("./error/argument");
exports.Argument = argument_1.default;
var argumentNull_1 = require("./error/argumentNull");
exports.ArgumentNull = argumentNull_1.default;
var forbidden_1 = require("./error/forbidden");
exports.Forbidden = forbidden_1.default;
var notFound_1 = require("./error/notFound");
exports.NotFound = notFound_1.default;
var rateLimitExceeded_1 = require("./error/rateLimitExceeded");
exports.RateLimitExceeded = rateLimitExceeded_1.default;
var serviceUnavailable_1 = require("./error/serviceUnavailable");
exports.ServiceUnavailable = serviceUnavailable_1.default;
var waiter_1 = require("./error/waiter");
exports.Waiter = waiter_1.WaiterError;

},{"./error/argument":232,"./error/argumentNull":233,"./error/forbidden":234,"./error/notFound":235,"./error/rateLimitExceeded":236,"./error/serviceUnavailable":237,"./error/waiter":238}],240:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],241:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],242:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],243:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * factory index
 */
var client = require("./factory/client");
var errorCode_1 = require("./factory/errorCode");
var errors = require("./factory/errors");
var passport = require("./factory/passport");
var project = require("./factory/project");
var rule = require("./factory/rule");
exports.client = client;
exports.errorCode = errorCode_1.default;
exports.errors = errors;
exports.passport = passport;
exports.project = project;
exports.rule = rule;

},{"./factory/client":230,"./factory/errorCode":231,"./factory/errors":239,"./factory/passport":240,"./factory/project":241,"./factory/rule":242}],244:[function(require,module,exports){
(function (process){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log() {
  var _console;

  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = require('./common')(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};


}).call(this,require('_process'))
},{"./common":245,"_process":250}],245:[function(require,module,exports){
"use strict";

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = require('ms');
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * Active `debug` instances.
  */

  createDebug.instances = [];
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;

    function debug() {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend; // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;
    // env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);
    return debug;
  }

  function destroy() {
    var index = createDebug.instances.indexOf(this);

    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }

    return false;
  }

  function extend(namespace, delimiter) {
    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < createDebug.instances.length; i++) {
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  /**
  * Disable debug output.
  *
  * @api public
  */


  function disable() {
    createDebug.enable('');
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;


},{"ms":249}],246:[function(require,module,exports){
// Generated by CoffeeScript 2.3.0
// # node-http-status

// **Reference:**  
// http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html  
// http://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.1.1
module.exports = {
  // ## Informational 1xx

  // Request received, continuing process.

  // 100 - The server has received the request headers and the client should proceed to send the request body.
  100: 'Continue',
  '100_NAME': 'CONTINUE',
  '100_MESSAGE': 'The server has received the request headers and the client should proceed to send the request body.',
  CONTINUE: 100,
  // 101 - The requester has asked the server to switch protocols and the server has agreed to do so.
  101: 'Switching Protocols',
  '101_NAME': 'SWITCHING_PROTOCOLS',
  '101_MESSAGE': 'The requester has asked the server to switch protocols and the server has agreed to do so.',
  SWITCHING_PROTOCOLS: 101,
  // 102 Processing (WebDAV; RFC 2518) - A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request. This code indicates that the server has received and is processing the request, but no response is available yet.[7] This prevents the client from timing out and assuming the request was lost.
  102: 'Processing',
  '102_NAME': 'PROCESSING',
  '102_MESSAGE': 'A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request. This code indicates that the server has received and is processing the request, but no response is available yet.[7] This prevents the client from timing out and assuming the request was lost.',
  PROCESSING: 102,
  // 103 Early Hints (RFC 8297) - Used to return some response headers before final HTTP message.
  103: 'Early Hints',
  '103_NAME': 'EARLY_HINTS',
  '103_MESSAGE': 'Used to return some response headers before final HTTP message.',
  EARLY_HINTS: 103,
  // ## Successful 2xx

  // The action was successfully received, understood, and accepted.

  // 200 - Standard response for successful HTTP requests.
  200: 'OK',
  '200_NAME': 'OK',
  '200_MESSAGE': 'Standard response for successful HTTP requests.',
  OK: 200,
  // 201 - The request has been fulfilled, resulting in the creation of a new resource.
  201: 'Created',
  '201_NAME': 'CREATED',
  '201_MESSAGE': 'The request has been fulfilled, resulting in the creation of a new resource.',
  CREATED: 201,
  // 202 - The request has been accepted for processing, but the processing has not been completed.
  202: 'Accepted',
  '202_NAME': 'ACCEPTED',
  '202_MESSAGE': 'The request has been accepted for processing, but the processing has not been completed.',
  ACCEPTED: 202,
  // 203 (since HTTP/1.1) - The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin's response.
  203: 'Non-Authoritative Information',
  '203_NAME': 'NON_AUTHORITATIVE_INFORMATION',
  '203_MESSAGE': 'The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin\'s response.',
  NON_AUTHORITATIVE_INFORMATION: 203,
  // 204 - The server successfully processed the request and is not returning any content.
  204: 'No Content',
  '204_NAME': 'NO_CONTENT',
  '204_MESSAGE': 'The server successfully processed the request and is not returning any content.',
  NO_CONTENT: 204,
  // 205 - The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.
  205: 'Reset Content',
  '205_NAME': 'RESET_CONTENT',
  '205_MESSAGE': 'The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.',
  RESET_CONTENT: 205,
  // 206 (RFC 7233) - The server is delivering only part of the resource (byte serving) due to a range header sent by the client.
  206: 'Partial Content',
  '206_NAME': 'PARTIAL_CONTENT',
  '206_MESSAGE': 'The server is delivering only part of the resource (byte serving) due to a range header sent by the client.',
  PARTIAL_CONTENT: 206,
  // 207 (WebDAV; RFC 4918) - The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.
  207: 'Multi Status',
  '207_NAME': 'MULTI_STATUS',
  '207_MESSAGE': 'The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.',
  MULTI_STATUS: 207,
  // 208 (WebDAV; RFC 5842) - The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.
  208: 'Already Reported',
  '208_NAME': 'ALREADY_REPORTED',
  '208_MESSAGE': 'The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.',
  ALREADY_REPORTED: 208,
  // 226 (RFC 3229) - The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.
  226: 'IM Used',
  '226_NAME': 'IM_USED',
  '226_MESSAGE': 'The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.',
  IM_USED: 226,
  // ## Redirection 3xx

  // Further action must be taken in order to complete the request.

  // 300 - Indicates multiple options for the resource from which the client may choose.
  300: 'Multiple Choices',
  '300_NAME': 'MULTIPLE_CHOICES',
  '300_MESSAGE': 'Indicates multiple options for the resource from which the client may choose.',
  MULTIPLE_CHOICES: 300,
  // 301 - This and all future requests should be directed to the given URI.
  301: 'Moved Permanently',
  '301_NAME': 'MOVED_PERMANENTLY',
  '301_MESSAGE': 'This and all future requests should be directed to the given URI.',
  MOVED_PERMANENTLY: 301,
  // 302 - This is an example of industry practice contradicting the standard. The HTTP/1.0 specification (RFC 1945) required the client to perform a temporary redirect (the original describing phrase was "Moved Temporarily"), but popular browsers implemented 302 with the functionality of a 303 See Other. Therefore, HTTP/1.1 added status codes 303 and 307 to distinguish between the two behaviours.
  302: 'Found',
  '302_NAME': 'FOUND',
  '302_MESSAGE': 'This is an example of industry practice contradicting the standard. The HTTP/1.0 specification (RFC 1945) required the client to perform a temporary redirect (the original describing phrase was "Moved Temporarily"), but popular browsers implemented 302 with the functionality of a 303 See Other. Therefore, HTTP/1.1 added status codes 303 and 307 to distinguish between the two behaviours.',
  FOUND: 302,
  // 303 (since HTTP/1.1) - The response to the request can be found under another URI using the GET method.
  303: 'See Other',
  '303_NAME': 'SEE_OTHER',
  '303_MESSAGE': 'The response to the request can be found under another URI using the GET method.',
  SEE_OTHER: 303,
  // 304 (RFC 7232) - Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.
  304: 'Not Modified',
  '304_NAME': 'NOT_MODIFIED',
  '304_MESSAGE': 'Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.',
  NOT_MODIFIED: 304,
  // 305 (since HTTP/1.1) - The requested resource is available only through a proxy, the address for which is provided in the response.
  305: 'Use Proxy',
  '305_NAME': 'USE_PROXY',
  '305_MESSAGE': 'The requested resource is available only through a proxy, the address for which is provided in the response.',
  USE_PROXY: 305,
  // 306 - No longer used. Originally meant "Subsequent requests should use the specified proxy.
  306: 'Switch Proxy',
  '306_NAME': 'SWITCH_PROXY',
  '306_MESSAGE': 'No longer used. Originally meant "Subsequent requests should use the specified proxy.',
  SWITCH_PROXY: 306,
  // 307 (since HTTP/1.1) - In this case, the request should be repeated with another URI; however, future requests should still use the original URI.
  307: 'Temporary Redirect',
  '307_NAME': 'TEMPORARY_REDIRECT',
  '307_MESSAGE': 'In this case, the request should be repeated with another URI; however, future requests should still use the original URI.',
  TEMPORARY_REDIRECT: 307,
  // 308 (RFC 7538) - The request and all future requests should be repeated using another URI.
  308: 'Permanent Redirect',
  '308_NAME': 'PERMANENT_REDIRECT',
  '308_MESSAGE': 'The request and all future requests should be repeated using another URI.',
  PERMANENT_REDIRECT: 308,
  // ## Client Error 4xx

  // The request contains bad syntax or cannot be fulfilled.

  // 400 - The server cannot or will not process the request due to an apparent client error.
  400: 'Bad Request',
  '400_NAME': 'BAD_REQUEST',
  '400_MESSAGE': 'The server cannot or will not process the request due to an apparent client error.',
  BAD_REQUEST: 400,
  // 401 (RFC 7235) - Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
  401: 'Unauthorized',
  '401_NAME': 'UNAUTHORIZED',
  '401_MESSAGE': 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.',
  UNAUTHORIZED: 401,
  // 402 - Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, as proposed for example by GNU Taler, but that has not yet happened, and this code is not usually used.
  402: 'Payment Required',
  '402_NAME': 'PAYMENT_REQUIRED',
  '402_MESSAGE': 'Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, as proposed for example by GNU Taler, but that has not yet happened, and this code is not usually used.',
  PAYMENT_REQUIRED: 402,
  // 403 - The request was valid, but the server is refusing action.
  403: 'Forbidden',
  '403_NAME': 'FORBIDDEN',
  '403_MESSAGE': 'The request was valid, but the server is refusing action.',
  FORBIDDEN: 403,
  // 404 - The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
  404: 'Not Found',
  '404_NAME': 'NOT_FOUND',
  '404_MESSAGE': 'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.',
  NOT_FOUND: 404,
  // 405 - A request method is not supported for the requested resource.
  405: 'Method Not Allowed',
  '405_NAME': 'METHOD_NOT_ALLOWED',
  '405_MESSAGE': 'A request method is not supported for the requested resource.',
  METHOD_NOT_ALLOWED: 405,
  // 406 - The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
  406: 'Not Acceptable',
  '406_NAME': 'NOT_ACCEPTABLE',
  '406_MESSAGE': 'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.',
  NOT_ACCEPTABLE: 406,
  // 407 (RFC 7235) - The client must first authenticate itself with the proxy.
  407: 'Proxy Authentication Required',
  '407_NAME': 'PROXY_AUTHENTICATION_REQUIRED',
  '407_MESSAGE': 'The client must first authenticate itself with the proxy.',
  PROXY_AUTHENTICATION_REQUIRED: 407,
  // 408 - The server timed out waiting for the request.
  408: 'Request Time-out',
  '408_NAME': 'REQUEST_TIMEOUT',
  '408_MESSAGE': 'The server timed out waiting for the request.',
  REQUEST_TIMEOUT: 408,
  // 409 - Indicates that the request could not be processed because of conflict in the request, such as an edit conflict between multiple simultaneous updates.
  409: 'Conflict',
  '409_NAME': 'CONFLICT',
  '409_MESSAGE': 'Indicates that the request could not be processed because of conflict in the request, such as an edit conflict between multiple simultaneous updates.',
  CONFLICT: 409,
  // 410 - Indicates that the resource requested is no longer available and will not be available again.
  410: 'Gone',
  '410_NAME': 'GONE',
  '410_MESSAGE': 'Indicates that the resource requested is no longer available and will not be available again.',
  GONE: 410,
  // 411 - The request did not specify the length of its content, which is required by the requested resource.
  411: 'Length Required',
  '411_NAME': 'LENGTH_REQUIRED',
  '411_MESSAGE': 'The request did not specify the length of its content, which is required by the requested resource.',
  LENGTH_REQUIRED: 411,
  // 412 (RFC 7232) - The server does not meet one of the preconditions that the requester put on the request.
  412: 'Precondition Failed',
  '412_NAME': 'PRECONDITION_FAILED',
  '412_MESSAGE': 'The server does not meet one of the preconditions that the requester put on the request.',
  PRECONDITION_FAILED: 412,
  // 413 (RFC 7231) - The request is larger than the server is willing or able to process. Previously called "Request Entity Too Large".
  413: 'Request Entity Too Large',
  '413_NAME': 'REQUEST_ENTITY_TOO_LARGE',
  '413_MESSAGE': 'The request is larger than the server is willing or able to process. Previously called "Request Entity Too Large".',
  REQUEST_ENTITY_TOO_LARGE: 413,
  // 414 (RFC 7231) - The URI provided was too long for the server to process.
  414: 'Request-URI Too Large',
  '414_NAME': 'REQUEST_URI_TOO_LONG',
  '414_MESSAGE': 'The URI provided was too long for the server to process.',
  REQUEST_URI_TOO_LONG: 414,
  // 415 - The request entity has a media type which the server or resource does not support.
  415: 'Unsupported Media Type',
  '415_NAME': 'UNSUPPORTED_MEDIA_TYPE',
  '415_MESSAGE': 'The request entity has a media type which the server or resource does not support.',
  UNSUPPORTED_MEDIA_TYPE: 415,
  // 416 (RFC 7233) - The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.
  416: 'Requested Range not Satisfiable',
  '416_NAME': 'REQUESTED_RANGE_NOT_SATISFIABLE',
  '416_MESSAGE': 'The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.',
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  // 417 - The server cannot meet the requirements of the Expect request-header field.
  417: 'Expectation Failed',
  '417_NAME': 'EXPECTATION_FAILED',
  '417_MESSAGE': 'The server cannot meet the requirements of the Expect request-header field.',
  EXPECTATION_FAILED: 417,
  // 418 (RFC 2324, RFC 7168) - Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout. This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers. The RFC specifies this code should be returned by teapots requested to brew coffee. This HTTP status is used as an Easter egg in some websites, including Google.com.
  418: 'I\'m a teapot',
  '418_NAME': 'IM_A_TEAPOT',
  '418_MESSAGE': 'Any attempt to brew coffee with a teapot should result in the error code "418 I\'m a teapot". The resulting entity body MAY be short and stout.',
  IM_A_TEAPOT: 418,
  // 421 (RFC 7540) - The request was directed at a server that is not able to produce a response.
  421: 'Misdirected Request',
  '421_NAME': 'MISDIRECTED_REQUEST',
  '421_MESSAGE': 'The request was directed at a server that is not able to produce a response.',
  MISDIRECTED_REQUEST: 421,
  // 422 (WebDAV; RFC 4918) - The request was well-formed but was unable to be followed due to semantic errors.
  422: 'Unprocessable Entity',
  '422_NAME': 'UNPROCESSABLE_ENTITY',
  '422_MESSAGE': 'The request was well-formed but was unable to be followed due to semantic errors.',
  UNPROCESSABLE_ENTITY: 422,
  // 423 (WebDAV; RFC 4918) - The resource that is being accessed is locked.
  423: 'Locked',
  '423_NAME': 'LOCKED',
  '423_MESSAGE': 'The resource that is being accessed is locked.',
  LOCKED: 423,
  // 424 (WebDAV; RFC 4918) - The request failed because it depended on another request and that request failed.
  424: 'Failed Dependency',
  '424_NAME': 'FAILED_DEPENDENCY',
  '424_MESSAGE': 'The request failed because it depended on another request and that request failed.',
  FAILED_DEPENDENCY: 424,
  // 426 - The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.
  426: 'Upgrade Required',
  '426_NAME': 'UPGRADE_REQUIRED',
  '426_MESSAGE': 'The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.',
  UPGRADE_REQUIRED: 426,
  // 428 (RFC 6585) - The origin server requires the request to be conditional.
  428: 'Precondition Required', // RFC 6585
  '428_NAME': 'PRECONDITION_REQUIRED',
  '428_MESSAGE': 'The origin server requires the request to be conditional.',
  PRECONDITION_REQUIRED: 428,
  // 429 (RFC 6585) - The user has sent too many requests in a given amount of time.
  429: 'Too Many Requests',
  '429_NAME': 'TOO_MANY_REQUESTS',
  '429_MESSAGE': 'The user has sent too many requests in a given amount of time.',
  TOO_MANY_REQUESTS: 429,
  // 431 (RFC 6585) - The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.
  431: 'Request Header Fields Too Large', // RFC 6585
  '431_NAME': 'REQUEST_HEADER_FIELDS_TOO_LARGE',
  '431_MESSAGE': 'The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.',
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  // 451 (RFC 7725) - A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.
  451: 'Unavailable For Legal Reasons',
  '451_NAME': 'UNAVAILABLE_FOR_LEGAL_REASONS',
  '451_MESSAGE': 'A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.',
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  // ## Server Error 5xx

  // The server failed to fulfill an apparently valid request.

  // 500 - A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
  500: 'Internal Server Error',
  '500_NAME': 'INTERNAL_SERVER_ERROR',
  '500_MESSAGE': 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.',
  INTERNAL_SERVER_ERROR: 500,
  // 501 - The server either does not recognize the request method, or it lacks the ability to fulfil the request. Usually this implies future availability.
  501: 'Not Implemented',
  '501_NAME': 'NOT_IMPLEMENTED',
  '501_MESSAGE': 'The server either does not recognize the request method, or it lacks the ability to fulfil the request. Usually this implies future availability.',
  NOT_IMPLEMENTED: 501,
  // 502 - The server was acting as a gateway or proxy and received an invalid response from the upstream server.
  502: 'Bad Gateway',
  '502_NAME': 'BAD_GATEWAY',
  '502_MESSAGE': 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
  BAD_GATEWAY: 502,
  // 503 - The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state.
  503: 'Service Unavailable',
  '503_NAME': 'SERVICE_UNAVAILABLE',
  '503_MESSAGE': 'The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state.',
  SERVICE_UNAVAILABLE: 503,
  // 504 - The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
  504: 'Gateway Time-out',
  '504_NAME': 'GATEWAY_TIMEOUT',
  '504_MESSAGE': 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.',
  GATEWAY_TIMEOUT: 504,
  // 505 - The server does not support the HTTP protocol version used in the request.
  505: 'HTTP Version not Supported',
  '505_NAME': 'HTTP_VERSION_NOT_SUPPORTED',
  '505_MESSAGE': 'The server does not support the HTTP protocol version used in the request.',
  HTTP_VERSION_NOT_SUPPORTED: 505,
  // 506 (RFC 2295) - Transparent content negotiation for the request results in a circular reference.
  506: 'Variant Also Negotiates',
  '506_NAME': 'VARIANT_ALSO_NEGOTIATES',
  '506_MESSAGE': 'Transparent content negotiation for the request results in a circular reference.',
  VARIANT_ALSO_NEGOTIATES: 506,
  // 507 (WebDAV; RFC 4918) - The server is unable to store the representation needed to complete the request.
  507: 'Insufficient Storage',
  '507_NAME': 'INSUFFICIENT_STORAGE',
  '507_MESSAGE': 'The server is unable to store the representation needed to complete the request.',
  INSUFFICIENT_STORAGE: 507,
  // 508 (WebDAV; RFC 5842) - The server detected an infinite loop while processing the request.
  508: 'Loop Detected',
  '508_NAME': 'LOOP_DETECTED',
  '508_MESSAGE': 'The server detected an infinite loop while processing the request.',
  LOOP_DETECTED: 508,
  // 510 (RFC 2774) - Further extensions to the request are required for the server to fulfil it.
  510: 'Not Extended',
  '510_NAME': 'NOT_EXTENDED',
  '510_MESSAGE': 'Further extensions to the request are required for the server to fulfil it.',
  NOT_EXTENDED: 510,
  // 511 (RFC 6585) - The client needs to authenticate to gain network access. Intended for use by intercepting proxies used to control access to the network.
  511: 'Network Authentication Required',
  '511_NAME': 'NETWORK_AUTHENTICATION_REQUIRED',
  '511_MESSAGE': 'The client needs to authenticate to gain network access. Intended for use by intercepting proxies used to control access to the network.',
  NETWORK_AUTHENTICATION_REQUIRED: 511,
  // ## Extra code

  // Extra HTTP code implemented by vendors and other specifications.
  extra: {
    // ### Unofficial codes

    // The following codes are not specified by any standard.
    unofficial: {
      // 103 - Used in the resumable requests proposal to resume aborted PUT or POST requests.
      103: 'Checkpoint',
      '103_NAME': 'CHECKPOINT',
      '103_MESSAGE': 'Used in the resumable requests proposal to resume aborted PUT or POST requests.',
      CHECKPOINT: 103,
      // 419 Page Expired (Laravel Framework) - Used by the Laravel Framework when a CSRF Token is missing or expired.
      419: 'Page Expired',
      '419_NAME': 'PAGE_EXPIRED',
      '419_MESSAGE': 'Used by the Laravel Framework when a CSRF Token is missing or expired.',
      PAGE_EXPIRED: 419,
      // 218 This is fine (Apache Web Server) - Used as a catch-all error condition for allowing response bodies to flow through Apache when ProxyErrorOverride is enabled. When ProxyErrorOverride is enabled in Apache, response bodies that contain a status code of 4xx or 5xx are automatically discarded by Apache in favor of a generic response or a custom response specified by the ErrorDocument directive.
      218: 'This is fine',
      '218_NAME': 'THIS_IS_FINE',
      '218_MESSAGE': 'Used as a catch-all error condition for allowing response bodies to flow through Apache when ProxyErrorOverride is enabled. When ProxyErrorOverride is enabled in Apache, response bodies that contain a status code of 4xx or 5xx are automatically discarded by Apache in favor of a generic response or a custom response specified by the ErrorDocument directive.',
      THIS_IS_FINE: 218,
      // 420 Enhance Your Calm (Twitter) - Returned by version 1 of the Twitter Search and Trends API when the client is being rate limited; versions 1.1 and later use the 429 Too Many Requests response code instead.
      420: 'Enhance Your Calm',
      '420_NAME': 'ENHANCE_YOUR_CALM',
      '420_MESSAGE': 'Returned by version 1 of the Twitter Search and Trends API when the client is being rate limited; versions 1.1 and later use the 429 Too Many Requests response code instead.',
      ENHANCE_YOUR_CALM: 420,
      // 450 Blocked by Windows Parental (Microsoft) - The Microsoft extension code indicated when Windows Parental Controls are turned on and are blocking access to the requested webpage.
      450: 'Blocked by Windows Parental Controls',
      '450_NAME': 'BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS',
      '450_MESSAGE': 'The Microsoft extension code indicated when Windows Parental Controls are turned on and are blocking access to the requested webpage.',
      BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS: 450,
      // 498 Invalid Token (Esri) - Returned by ArcGIS for Server. Code 498 indicates an expired or otherwise invalid token.
      498: 'Invalid Token',
      '498_NAME': 'INVALID_TOKEN',
      '498_MESSAGE': 'Returned by ArcGIS for Server. Code 498 indicates an expired or otherwise invalid token.',
      INVALID_TOKEN: 498,
      // 499 Token Required (Esri) - Returned by ArcGIS for Server. Code 499 indicates that a token is required but was not submitted.
      499: 'Token Required',
      '499_NAME': 'TOKEN_REQUIRED',
      '499_MESSAGE': 'Returned by ArcGIS for Server. Code 499 indicates that a token is required but was not submitted.',
      TOKEN_REQUIRED: 499,
      // 509 Bandwidth Limit Exceeded (Apache Web Server/cPanel) - The server has exceeded the bandwidth specified by the server administrator.
      509: 'Bandwidth Limit Exceeded',
      '509_NAME': 'BANDWIDTH_LIMIT_EXCEEDED',
      '509_MESSAGE': 'The server has exceeded the bandwidth specified by the server administrator.',
      BANDWIDTH_LIMIT_EXCEEDED: 509,
      // 530 Site is frozen - Used by the Pantheon web platform to indicate a site that has been frozen due to inactivity.
      530: 'Site is frozen',
      '530_NAME': 'SITE_IS_FROZEN',
      '530_MESSAGE': 'Used by the Pantheon web platform to indicate a site that has been frozen due to inactivity.',
      SITE_IS_FROZEN: 530,
      // 598 (Informal convention) Network read timeout error - Used by some HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.
      598: 'Network read timeout error',
      '598_NAME': 'NETWORK_READ_TIMEOUT_ERROR',
      '598_MESSAGE': 'Used by some HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.',
      NETWORK_READ_TIMEOUT_ERROR: 598
    },
    // ### Internet Information Services (IIS)

    // Microsoft's Internet Information Services (IIS) web server expands the 4xx error space to signal errors with the client's request.
    iis: {
      // 440 - The client's session has expired and must log in again.
      440: 'Login Time-out',
      '440_NAME': 'LOGIN_TIME_OUT',
      '440_MESSAGE': 'The client\'s session has expired and must log in again.',
      LOGIN_TIME_OUT: 440,
      // 449 - The server cannot honour the request because the user has not provided the required information.
      449: 'Retry With',
      '449_NAME': 'RETRY_WITH',
      '449_MESSAGE': 'The server cannot honour the request because the user has not provided the required information.',
      RETRY_WITH: 449,
      // 451 - Used in Exchange ActiveSync when either a more efficient server is available or the server cannot access the users' mailbox.
      451: 'Redirect',
      '451_NAME': 'REDIRECT',
      '451_MESSAGE': 'Used in Exchange ActiveSync when either a more efficient server is available or the server cannot access the users\' mailbox.',
      REDIRECT: 451
    },
    // ### NGINX

    // The NGINX web server software expands the 4xx error space to signal issues with the client's request.
    nginx: {
      // 444 - Used internally to instruct the server to return no information to the client and close the connection immediately.
      444: 'No Response',
      '444_NAME': 'NO_RESPONSE',
      '444_MESSAGE': 'Used internally to instruct the server to return no information to the client and close the connection immediately.',
      NO_RESPONSE: 444,
      // 494 - Client sent too large request or too long header line.
      494: 'Request header too large',
      '494_NAME': 'REQUEST_HEADER_TOO_LARGE',
      '494_MESSAGE': 'Client sent too large request or too long header line.',
      REQUEST_HEADER_TOO_LARGE: 494,
      // 495 - An expansion of the 400 Bad Request response code, used when the client has provided an invalid client certificate.
      495: 'SSL Certificate Error',
      '495_NAME': 'SSL_CERTIFICATE_ERROR',
      '495_MESSAGE': 'An expansion of the 400 Bad Request response code, used when the client has provided an invalid client certificate.',
      SSL_CERTIFICATE_ERROR: 495,
      // 496 - An expansion of the 400 Bad Request response code, used when a client certificate is required but not provided.
      496: 'SSL Certificate Required',
      '496_NAME': 'SSL_CERTIFICATE_REQUIRED',
      '496_MESSAGE': 'An expansion of the 400 Bad Request response code, used when a client certificate is required but not provided.',
      SSL_CERTIFICATE_REQUIRED: 496,
      // 497 - An expansion of the 400 Bad Request response code, used when the client has made a HTTP request to a port listening for HTTPS requests.
      497: 'HTTP Request Sent to HTTPS Port',
      '497_NAME': 'HTTP_REQUEST_SENT_TO_HTTPS_PORT',
      '497_MESSAGE': 'An expansion of the 400 Bad Request response code, used when the client has made a HTTP request to a port listening for HTTPS requests.',
      HTTP_REQUEST_SENT_TO_HTTPS_PORT: 497,
      // 499 - Used when the client has closed the request before the server could send a response.
      499: 'Client Closed Request',
      '499_NAME': 'CLIENT_CLOSED_REQUEST',
      '499_MESSAGE': 'Used when the client has closed the request before the server could send a response.',
      CLIENT_CLOSED_REQUEST: 499
    },
    // ### Cloudflare

    // Cloudflare's reverse proxy service expands the 5xx series of errors space to signal issues with the origin server.
    cloudflare: {
      // 520 - The 520 error is used as a "catch-all response for when the origin server returns something unexpected", listing connection resets, large headers, and empty or invalid responses as common triggers.
      520: 'Unknown Error',
      '520_NAME': 'UNKNOWN_ERROR',
      '520_MESSAGE': 'The 520 error is used as a "catch-all response for when the origin server returns something unexpected", listing connection resets, large headers, and empty or invalid responses as common triggers.',
      UNKNOWN_ERROR: 520,
      // 521 - The origin server has refused the connection from Cloudflare.
      521: 'Web Server Is Down',
      '521_NAME': 'WEB_SERVER_IS_DOWN',
      '521_MESSAGE': 'The origin server has refused the connection from Cloudflare.',
      WEB_SERVER_IS_DOWN: 521,
      // 522 - Cloudflare could not negotiate a TCP handshake with the origin server.
      522: 'Connection Timed Out',
      '522_NAME': 'CONNECTION_TIMED_OUT',
      '522_MESSAGE': 'Cloudflare could not negotiate a TCP handshake with the origin server.',
      CONNECTION_TIMED_OUT: 522,
      // 523 - Cloudflare could not reach the origin server.
      523: 'Origin Is Unreachable',
      '523_NAME': 'ORIGIN_IS_UNREACHABLE',
      '523_MESSAGE': 'Cloudflare could not reach the origin server.',
      ORIGIN_IS_UNREACHABLE: 523,
      // 524 - Cloudflare was able to complete a TCP connection to the origin server, but did not receive a timely HTTP response.
      524: 'A Timeout Occurred',
      '524_NAME': 'A_TIMEOUT_OCCURRED',
      '524_MESSAGE': 'Cloudflare was able to complete a TCP connection to the origin server, but did not receive a timely HTTP response.',
      A_TIMEOUT_OCCURRED: 524,
      // 525 - Cloudflare could not negotiate a SSL/TLS handshake with the origin server.
      525: 'SSL Handshake Failed',
      '525_NAME': 'SSL_HANDSHAKE_FAILED',
      '525_MESSAGE': 'Cloudflare could not negotiate a SSL/TLS handshake with the origin server.',
      SSL_HANDSHAKE_FAILED: 525,
      // 526 - Cloudflare could not validate the SSL/TLS certificate that the origin server presented.
      526: 'Invalid SSL Certificate',
      '526_NAME': 'INVALID_SSL_CERTIFICATE',
      '526_MESSAGE': 'Cloudflare could not validate the SSL/TLS certificate that the origin server presented.',
      INVALID_SSL_CERTIFICATE: 526,
      // 527 - Error 527 indicates that the request timed out or failed after the WAN connection had been established.
      527: 'Railgun Error',
      '527_NAME': 'RAILGUN_ERROR',
      '527_MESSAGE': 'Error 527 indicates that the request timed out or failed after the WAN connection had been established.',
      RAILGUN_ERROR: 527
    }
  }
};

},{}],247:[function(require,module,exports){
(function (global,setImmediate){
var t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function r(t,r){return t(r={exports:{}},r.exports),r.exports}var e=r(function(t,r){var e;t.exports=(e=e||function(t,r){var e=Object.create||function(){function t(){}return function(r){var e;return t.prototype=r,e=new t,t.prototype=null,e}}(),i={},n=i.lib={},o=n.Base={extend:function(t){var r=e(this);return t&&r.mixIn(t),r.hasOwnProperty("init")&&this.init!==r.init||(r.init=function(){r.$super.init.apply(this,arguments)}),r.init.prototype=r,r.$super=this,r},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var r in t)t.hasOwnProperty(r)&&(this[r]=t[r]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}},s=n.WordArray=o.extend({init:function(t,r){t=this.words=t||[],this.sigBytes=null!=r?r:4*t.length},toString:function(t){return(t||a).stringify(this)},concat:function(t){var r=this.words,e=t.words,i=this.sigBytes,n=t.sigBytes;if(this.clamp(),i%4)for(var o=0;o<n;o++){var s=e[o>>>2]>>>24-o%4*8&255;r[i+o>>>2]|=s<<24-(i+o)%4*8}else for(var o=0;o<n;o+=4)r[i+o>>>2]=e[o>>>2];return this.sigBytes+=n,this},clamp:function(){var r=this.words,e=this.sigBytes;r[e>>>2]&=4294967295<<32-e%4*8,r.length=t.ceil(e/4)},clone:function(){var t=o.clone.call(this);return t.words=this.words.slice(0),t},random:function(r){for(var e,i=[],n=function(r){var r=r,e=987654321,i=4294967295;return function(){var n=((e=36969*(65535&e)+(e>>16)&i)<<16)+(r=18e3*(65535&r)+(r>>16)&i)&i;return n/=4294967296,(n+=.5)*(t.random()>.5?1:-1)}},o=0;o<r;o+=4){var h=n(4294967296*(e||t.random()));e=987654071*h(),i.push(4294967296*h()|0)}return new s.init(i,r)}}),h=i.enc={},a=h.Hex={stringify:function(t){for(var r=t.words,e=t.sigBytes,i=[],n=0;n<e;n++){var o=r[n>>>2]>>>24-n%4*8&255;i.push((o>>>4).toString(16)),i.push((15&o).toString(16))}return i.join("")},parse:function(t){for(var r=t.length,e=[],i=0;i<r;i+=2)e[i>>>3]|=parseInt(t.substr(i,2),16)<<24-i%8*4;return new s.init(e,r/2)}},u=h.Latin1={stringify:function(t){for(var r=t.words,e=t.sigBytes,i=[],n=0;n<e;n++){var o=r[n>>>2]>>>24-n%4*8&255;i.push(String.fromCharCode(o))}return i.join("")},parse:function(t){for(var r=t.length,e=[],i=0;i<r;i++)e[i>>>2]|=(255&t.charCodeAt(i))<<24-i%4*8;return new s.init(e,r)}},f=h.Utf8={stringify:function(t){try{return decodeURIComponent(escape(u.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return u.parse(unescape(encodeURIComponent(t)))}},c=n.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=f.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(r){var e=this._data,i=e.words,n=e.sigBytes,o=this.blockSize,h=4*o,a=n/h,u=(a=r?t.ceil(a):t.max((0|a)-this._minBufferSize,0))*o,f=t.min(4*u,n);if(u){for(var c=0;c<u;c+=o)this._doProcessBlock(i,c);var p=i.splice(0,u);e.sigBytes-=f}return new s.init(p,f)},clone:function(){var t=o.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),p=(n.Hasher=c.extend({cfg:o.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){c.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){t&&this._append(t);var r=this._doFinalize();return r},blockSize:16,_createHelper:function(t){return function(r,e){return new t.init(e).finalize(r)}},_createHmacHelper:function(t){return function(r,e){return new p.HMAC.init(t,e).finalize(r)}}}),i.algo={});return i}(Math),e)}),i=r(function(t,r){var i;t.exports=(i=e,function(t){var r=i,e=r.lib,n=e.WordArray,o=e.Hasher,s=r.algo,h=[],a=[];!function(){function r(r){for(var e=t.sqrt(r),i=2;i<=e;i++)if(!(r%i))return!1;return!0}function e(t){return 4294967296*(t-(0|t))|0}for(var i=2,n=0;n<64;)r(i)&&(n<8&&(h[n]=e(t.pow(i,.5))),a[n]=e(t.pow(i,1/3)),n++),i++}();var u=[],f=s.SHA256=o.extend({_doReset:function(){this._hash=new n.init(h.slice(0))},_doProcessBlock:function(t,r){for(var e=this._hash.words,i=e[0],n=e[1],o=e[2],s=e[3],h=e[4],f=e[5],c=e[6],p=e[7],l=0;l<64;l++){if(l<16)u[l]=0|t[r+l];else{var d=u[l-15],v=u[l-2];u[l]=((d<<25|d>>>7)^(d<<14|d>>>18)^d>>>3)+u[l-7]+((v<<15|v>>>17)^(v<<13|v>>>19)^v>>>10)+u[l-16]}var y=i&n^i&o^n&o,m=p+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&f^~h&c)+a[l]+u[l];p=c,c=f,f=h,h=s+m|0,s=o,o=n,n=i,i=m+(((i<<30|i>>>2)^(i<<19|i>>>13)^(i<<10|i>>>22))+y)|0}e[0]=e[0]+i|0,e[1]=e[1]+n|0,e[2]=e[2]+o|0,e[3]=e[3]+s|0,e[4]=e[4]+h|0,e[5]=e[5]+f|0,e[6]=e[6]+c|0,e[7]=e[7]+p|0},_doFinalize:function(){var r=this._data,e=r.words,i=8*this._nDataBytes,n=8*r.sigBytes;return e[n>>>5]|=128<<24-n%32,e[14+(n+64>>>9<<4)]=t.floor(i/4294967296),e[15+(n+64>>>9<<4)]=i,r.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=o.clone.call(this);return t._hash=this._hash.clone(),t}});r.SHA256=o._createHelper(f),r.HmacSHA256=o._createHmacHelper(f)}(Math),i.SHA256)}),n=r(function(t,r){var i,n;t.exports=(n=(i=e).lib.WordArray,i.enc.Base64={stringify:function(t){var r=t.words,e=t.sigBytes,i=this._map;t.clamp();for(var n=[],o=0;o<e;o+=3)for(var s=(r[o>>>2]>>>24-o%4*8&255)<<16|(r[o+1>>>2]>>>24-(o+1)%4*8&255)<<8|r[o+2>>>2]>>>24-(o+2)%4*8&255,h=0;h<4&&o+.75*h<e;h++)n.push(i.charAt(s>>>6*(3-h)&63));var a=i.charAt(64);if(a)for(;n.length%4;)n.push(a);return n.join("")},parse:function(t){var r=t.length,e=this._map,i=this._reverseMap;if(!i){i=this._reverseMap=[];for(var o=0;o<e.length;o++)i[e.charCodeAt(o)]=o}var s=e.charAt(64);if(s){var h=t.indexOf(s);-1!==h&&(r=h)}return function(t,r,e){for(var i=[],o=0,s=0;s<r;s++)if(s%4){var h=e[t.charCodeAt(s-1)]<<s%4*2,a=e[t.charCodeAt(s)]>>>6-s%4*2;i[o>>>2]|=(h|a)<<24-o%4*8,o++}return n.create(i,o)}(t,r,i)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="},i.enc.Base64)}),o=r(function(t,r){t.exports=e.enc.Hex}),s=r(function(r,e){(function(){var t;function e(t,r,e){null!=t&&("number"==typeof t?this.fromNumber(t,r,e):this.fromString(t,null==r&&"string"!=typeof t?256:r))}function i(){return new e(null)}var n="undefined"!=typeof navigator;n&&"Microsoft Internet Explorer"==navigator.appName?(e.prototype.am=function(t,r,e,i,n,o){for(var s=32767&r,h=r>>15;--o>=0;){var a=32767&this[t],u=this[t++]>>15,f=h*a+u*s;n=((a=s*a+((32767&f)<<15)+e[i]+(1073741823&n))>>>30)+(f>>>15)+h*u+(n>>>30),e[i++]=1073741823&a}return n},t=30):n&&"Netscape"!=navigator.appName?(e.prototype.am=function(t,r,e,i,n,o){for(;--o>=0;){var s=r*this[t++]+e[i]+n;n=Math.floor(s/67108864),e[i++]=67108863&s}return n},t=26):(e.prototype.am=function(t,r,e,i,n,o){for(var s=16383&r,h=r>>14;--o>=0;){var a=16383&this[t],u=this[t++]>>14,f=h*a+u*s;n=((a=s*a+((16383&f)<<14)+e[i]+n)>>28)+(f>>14)+h*u,e[i++]=268435455&a}return n},t=28),e.prototype.DB=t,e.prototype.DM=(1<<t)-1,e.prototype.DV=1<<t;e.prototype.FV=Math.pow(2,52),e.prototype.F1=52-t,e.prototype.F2=2*t-52;var o,s,h="0123456789abcdefghijklmnopqrstuvwxyz",a=new Array;for(o="0".charCodeAt(0),s=0;s<=9;++s)a[o++]=s;for(o="a".charCodeAt(0),s=10;s<36;++s)a[o++]=s;for(o="A".charCodeAt(0),s=10;s<36;++s)a[o++]=s;function u(t){return h.charAt(t)}function f(t,r){var e=a[t.charCodeAt(r)];return null==e?-1:e}function c(t){var r=i();return r.fromInt(t),r}function p(t){var r,e=1;return 0!=(r=t>>>16)&&(t=r,e+=16),0!=(r=t>>8)&&(t=r,e+=8),0!=(r=t>>4)&&(t=r,e+=4),0!=(r=t>>2)&&(t=r,e+=2),0!=(r=t>>1)&&(t=r,e+=1),e}function l(t){this.m=t}function d(t){this.m=t,this.mp=t.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<t.DB-15)-1,this.mt2=2*t.t}function v(t,r){return t&r}function y(t,r){return t|r}function m(t,r){return t^r}function g(t,r){return t&~r}function w(t){if(0==t)return-1;var r=0;return 0==(65535&t)&&(t>>=16,r+=16),0==(255&t)&&(t>>=8,r+=8),0==(15&t)&&(t>>=4,r+=4),0==(3&t)&&(t>>=2,r+=2),0==(1&t)&&++r,r}function T(t){for(var r=0;0!=t;)t&=t-1,++r;return r}function b(){}function S(t){return t}function B(t){this.r2=i(),this.q3=i(),e.ONE.dlShiftTo(2*t.t,this.r2),this.mu=this.r2.divide(t),this.m=t}l.prototype.convert=function(t){return t.s<0||t.compareTo(this.m)>=0?t.mod(this.m):t},l.prototype.revert=function(t){return t},l.prototype.reduce=function(t){t.divRemTo(this.m,null,t)},l.prototype.mulTo=function(t,r,e){t.multiplyTo(r,e),this.reduce(e)},l.prototype.sqrTo=function(t,r){t.squareTo(r),this.reduce(r)},d.prototype.convert=function(t){var r=i();return t.abs().dlShiftTo(this.m.t,r),r.divRemTo(this.m,null,r),t.s<0&&r.compareTo(e.ZERO)>0&&this.m.subTo(r,r),r},d.prototype.revert=function(t){var r=i();return t.copyTo(r),this.reduce(r),r},d.prototype.reduce=function(t){for(;t.t<=this.mt2;)t[t.t++]=0;for(var r=0;r<this.m.t;++r){var e=32767&t[r],i=e*this.mpl+((e*this.mph+(t[r]>>15)*this.mpl&this.um)<<15)&t.DM;for(t[e=r+this.m.t]+=this.m.am(0,i,t,r,0,this.m.t);t[e]>=t.DV;)t[e]-=t.DV,t[++e]++}t.clamp(),t.drShiftTo(this.m.t,t),t.compareTo(this.m)>=0&&t.subTo(this.m,t)},d.prototype.mulTo=function(t,r,e){t.multiplyTo(r,e),this.reduce(e)},d.prototype.sqrTo=function(t,r){t.squareTo(r),this.reduce(r)},e.prototype.copyTo=function(t){for(var r=this.t-1;r>=0;--r)t[r]=this[r];t.t=this.t,t.s=this.s},e.prototype.fromInt=function(t){this.t=1,this.s=t<0?-1:0,t>0?this[0]=t:t<-1?this[0]=t+this.DV:this.t=0},e.prototype.fromString=function(t,r){var i;if(16==r)i=4;else if(8==r)i=3;else if(256==r)i=8;else if(2==r)i=1;else if(32==r)i=5;else{if(4!=r)return void this.fromRadix(t,r);i=2}this.t=0,this.s=0;for(var n=t.length,o=!1,s=0;--n>=0;){var h=8==i?255&t[n]:f(t,n);h<0?"-"==t.charAt(n)&&(o=!0):(o=!1,0==s?this[this.t++]=h:s+i>this.DB?(this[this.t-1]|=(h&(1<<this.DB-s)-1)<<s,this[this.t++]=h>>this.DB-s):this[this.t-1]|=h<<s,(s+=i)>=this.DB&&(s-=this.DB))}8==i&&0!=(128&t[0])&&(this.s=-1,s>0&&(this[this.t-1]|=(1<<this.DB-s)-1<<s)),this.clamp(),o&&e.ZERO.subTo(this,this)},e.prototype.clamp=function(){for(var t=this.s&this.DM;this.t>0&&this[this.t-1]==t;)--this.t},e.prototype.dlShiftTo=function(t,r){var e;for(e=this.t-1;e>=0;--e)r[e+t]=this[e];for(e=t-1;e>=0;--e)r[e]=0;r.t=this.t+t,r.s=this.s},e.prototype.drShiftTo=function(t,r){for(var e=t;e<this.t;++e)r[e-t]=this[e];r.t=Math.max(this.t-t,0),r.s=this.s},e.prototype.lShiftTo=function(t,r){var e,i=t%this.DB,n=this.DB-i,o=(1<<n)-1,s=Math.floor(t/this.DB),h=this.s<<i&this.DM;for(e=this.t-1;e>=0;--e)r[e+s+1]=this[e]>>n|h,h=(this[e]&o)<<i;for(e=s-1;e>=0;--e)r[e]=0;r[s]=h,r.t=this.t+s+1,r.s=this.s,r.clamp()},e.prototype.rShiftTo=function(t,r){r.s=this.s;var e=Math.floor(t/this.DB);if(e>=this.t)r.t=0;else{var i=t%this.DB,n=this.DB-i,o=(1<<i)-1;r[0]=this[e]>>i;for(var s=e+1;s<this.t;++s)r[s-e-1]|=(this[s]&o)<<n,r[s-e]=this[s]>>i;i>0&&(r[this.t-e-1]|=(this.s&o)<<n),r.t=this.t-e,r.clamp()}},e.prototype.subTo=function(t,r){for(var e=0,i=0,n=Math.min(t.t,this.t);e<n;)i+=this[e]-t[e],r[e++]=i&this.DM,i>>=this.DB;if(t.t<this.t){for(i-=t.s;e<this.t;)i+=this[e],r[e++]=i&this.DM,i>>=this.DB;i+=this.s}else{for(i+=this.s;e<t.t;)i-=t[e],r[e++]=i&this.DM,i>>=this.DB;i-=t.s}r.s=i<0?-1:0,i<-1?r[e++]=this.DV+i:i>0&&(r[e++]=i),r.t=e,r.clamp()},e.prototype.multiplyTo=function(t,r){var i=this.abs(),n=t.abs(),o=i.t;for(r.t=o+n.t;--o>=0;)r[o]=0;for(o=0;o<n.t;++o)r[o+i.t]=i.am(0,n[o],r,o,0,i.t);r.s=0,r.clamp(),this.s!=t.s&&e.ZERO.subTo(r,r)},e.prototype.squareTo=function(t){for(var r=this.abs(),e=t.t=2*r.t;--e>=0;)t[e]=0;for(e=0;e<r.t-1;++e){var i=r.am(e,r[e],t,2*e,0,1);(t[e+r.t]+=r.am(e+1,2*r[e],t,2*e+1,i,r.t-e-1))>=r.DV&&(t[e+r.t]-=r.DV,t[e+r.t+1]=1)}t.t>0&&(t[t.t-1]+=r.am(e,r[e],t,2*e,0,1)),t.s=0,t.clamp()},e.prototype.divRemTo=function(t,r,n){var o=t.abs();if(!(o.t<=0)){var s=this.abs();if(s.t<o.t)return null!=r&&r.fromInt(0),void(null!=n&&this.copyTo(n));null==n&&(n=i());var h=i(),a=this.s,u=t.s,f=this.DB-p(o[o.t-1]);f>0?(o.lShiftTo(f,h),s.lShiftTo(f,n)):(o.copyTo(h),s.copyTo(n));var c=h.t,l=h[c-1];if(0!=l){var d=l*(1<<this.F1)+(c>1?h[c-2]>>this.F2:0),v=this.FV/d,y=(1<<this.F1)/d,m=1<<this.F2,g=n.t,w=g-c,T=null==r?i():r;for(h.dlShiftTo(w,T),n.compareTo(T)>=0&&(n[n.t++]=1,n.subTo(T,n)),e.ONE.dlShiftTo(c,T),T.subTo(h,h);h.t<c;)h[h.t++]=0;for(;--w>=0;){var b=n[--g]==l?this.DM:Math.floor(n[g]*v+(n[g-1]+m)*y);if((n[g]+=h.am(0,b,n,w,0,c))<b)for(h.dlShiftTo(w,T),n.subTo(T,n);n[g]<--b;)n.subTo(T,n)}null!=r&&(n.drShiftTo(c,r),a!=u&&e.ZERO.subTo(r,r)),n.t=c,n.clamp(),f>0&&n.rShiftTo(f,n),a<0&&e.ZERO.subTo(n,n)}}},e.prototype.invDigit=function(){if(this.t<1)return 0;var t=this[0];if(0==(1&t))return 0;var r=3&t;return(r=(r=(r=(r=r*(2-(15&t)*r)&15)*(2-(255&t)*r)&255)*(2-((65535&t)*r&65535))&65535)*(2-t*r%this.DV)%this.DV)>0?this.DV-r:-r},e.prototype.isEven=function(){return 0==(this.t>0?1&this[0]:this.s)},e.prototype.exp=function(t,r){if(t>4294967295||t<1)return e.ONE;var n=i(),o=i(),s=r.convert(this),h=p(t)-1;for(s.copyTo(n);--h>=0;)if(r.sqrTo(n,o),(t&1<<h)>0)r.mulTo(o,s,n);else{var a=n;n=o,o=a}return r.revert(n)},e.prototype.toString=function(t){if(this.s<0)return"-"+this.negate().toString(t);var r;if(16==t)r=4;else if(8==t)r=3;else if(2==t)r=1;else if(32==t)r=5;else{if(4!=t)return this.toRadix(t);r=2}var e,i=(1<<r)-1,n=!1,o="",s=this.t,h=this.DB-s*this.DB%r;if(s-- >0)for(h<this.DB&&(e=this[s]>>h)>0&&(n=!0,o=u(e));s>=0;)h<r?(e=(this[s]&(1<<h)-1)<<r-h,e|=this[--s]>>(h+=this.DB-r)):(e=this[s]>>(h-=r)&i,h<=0&&(h+=this.DB,--s)),e>0&&(n=!0),n&&(o+=u(e));return n?o:"0"},e.prototype.negate=function(){var t=i();return e.ZERO.subTo(this,t),t},e.prototype.abs=function(){return this.s<0?this.negate():this},e.prototype.compareTo=function(t){var r=this.s-t.s;if(0!=r)return r;var e=this.t;if(0!=(r=e-t.t))return this.s<0?-r:r;for(;--e>=0;)if(0!=(r=this[e]-t[e]))return r;return 0},e.prototype.bitLength=function(){return this.t<=0?0:this.DB*(this.t-1)+p(this[this.t-1]^this.s&this.DM)},e.prototype.mod=function(t){var r=i();return this.abs().divRemTo(t,null,r),this.s<0&&r.compareTo(e.ZERO)>0&&t.subTo(r,r),r},e.prototype.modPowInt=function(t,r){var e;return e=t<256||r.isEven()?new l(r):new d(r),this.exp(t,e)},e.ZERO=c(0),e.ONE=c(1),b.prototype.convert=S,b.prototype.revert=S,b.prototype.mulTo=function(t,r,e){t.multiplyTo(r,e)},b.prototype.sqrTo=function(t,r){t.squareTo(r)},B.prototype.convert=function(t){if(t.s<0||t.t>2*this.m.t)return t.mod(this.m);if(t.compareTo(this.m)<0)return t;var r=i();return t.copyTo(r),this.reduce(r),r},B.prototype.revert=function(t){return t},B.prototype.reduce=function(t){for(t.drShiftTo(this.m.t-1,this.r2),t.t>this.m.t+1&&(t.t=this.m.t+1,t.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);t.compareTo(this.r2)<0;)t.dAddOffset(1,this.m.t+1);for(t.subTo(this.r2,t);t.compareTo(this.m)>=0;)t.subTo(this.m,t)},B.prototype.mulTo=function(t,r,e){t.multiplyTo(r,e),this.reduce(e)},B.prototype.sqrTo=function(t,r){t.squareTo(r),this.reduce(r)};var D,A,_,x=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],E=(1<<26)/x[x.length-1];function R(){var t;t=(new Date).getTime(),A[_++]^=255&t,A[_++]^=t>>8&255,A[_++]^=t>>16&255,A[_++]^=t>>24&255,_>=N&&(_-=N)}if(e.prototype.chunkSize=function(t){return Math.floor(Math.LN2*this.DB/Math.log(t))},e.prototype.toRadix=function(t){if(null==t&&(t=10),0==this.signum()||t<2||t>36)return"0";var r=this.chunkSize(t),e=Math.pow(t,r),n=c(e),o=i(),s=i(),h="";for(this.divRemTo(n,o,s);o.signum()>0;)h=(e+s.intValue()).toString(t).substr(1)+h,o.divRemTo(n,o,s);return s.intValue().toString(t)+h},e.prototype.fromRadix=function(t,r){this.fromInt(0),null==r&&(r=10);for(var i=this.chunkSize(r),n=Math.pow(r,i),o=!1,s=0,h=0,a=0;a<t.length;++a){var u=f(t,a);u<0?"-"==t.charAt(a)&&0==this.signum()&&(o=!0):(h=r*h+u,++s>=i&&(this.dMultiply(n),this.dAddOffset(h,0),s=0,h=0))}s>0&&(this.dMultiply(Math.pow(r,s)),this.dAddOffset(h,0)),o&&e.ZERO.subTo(this,this)},e.prototype.fromNumber=function(t,r,i){if("number"==typeof r)if(t<2)this.fromInt(1);else for(this.fromNumber(t,i),this.testBit(t-1)||this.bitwiseTo(e.ONE.shiftLeft(t-1),y,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(r);)this.dAddOffset(2,0),this.bitLength()>t&&this.subTo(e.ONE.shiftLeft(t-1),this);else{var n=new Array,o=7&t;n.length=1+(t>>3),r.nextBytes(n),o>0?n[0]&=(1<<o)-1:n[0]=0,this.fromString(n,256)}},e.prototype.bitwiseTo=function(t,r,e){var i,n,o=Math.min(t.t,this.t);for(i=0;i<o;++i)e[i]=r(this[i],t[i]);if(t.t<this.t){for(n=t.s&this.DM,i=o;i<this.t;++i)e[i]=r(this[i],n);e.t=this.t}else{for(n=this.s&this.DM,i=o;i<t.t;++i)e[i]=r(n,t[i]);e.t=t.t}e.s=r(this.s,t.s),e.clamp()},e.prototype.changeBit=function(t,r){var i=e.ONE.shiftLeft(t);return this.bitwiseTo(i,r,i),i},e.prototype.addTo=function(t,r){for(var e=0,i=0,n=Math.min(t.t,this.t);e<n;)i+=this[e]+t[e],r[e++]=i&this.DM,i>>=this.DB;if(t.t<this.t){for(i+=t.s;e<this.t;)i+=this[e],r[e++]=i&this.DM,i>>=this.DB;i+=this.s}else{for(i+=this.s;e<t.t;)i+=t[e],r[e++]=i&this.DM,i>>=this.DB;i+=t.s}r.s=i<0?-1:0,i>0?r[e++]=i:i<-1&&(r[e++]=this.DV+i),r.t=e,r.clamp()},e.prototype.dMultiply=function(t){this[this.t]=this.am(0,t-1,this,0,0,this.t),++this.t,this.clamp()},e.prototype.dAddOffset=function(t,r){if(0!=t){for(;this.t<=r;)this[this.t++]=0;for(this[r]+=t;this[r]>=this.DV;)this[r]-=this.DV,++r>=this.t&&(this[this.t++]=0),++this[r]}},e.prototype.multiplyLowerTo=function(t,r,e){var i,n=Math.min(this.t+t.t,r);for(e.s=0,e.t=n;n>0;)e[--n]=0;for(i=e.t-this.t;n<i;++n)e[n+this.t]=this.am(0,t[n],e,n,0,this.t);for(i=Math.min(t.t,r);n<i;++n)this.am(0,t[n],e,n,0,r-n);e.clamp()},e.prototype.multiplyUpperTo=function(t,r,e){var i=e.t=this.t+t.t- --r;for(e.s=0;--i>=0;)e[i]=0;for(i=Math.max(r-this.t,0);i<t.t;++i)e[this.t+i-r]=this.am(r-i,t[i],e,0,0,this.t+i-r);e.clamp(),e.drShiftTo(1,e)},e.prototype.modInt=function(t){if(t<=0)return 0;var r=this.DV%t,e=this.s<0?t-1:0;if(this.t>0)if(0==r)e=this[0]%t;else for(var i=this.t-1;i>=0;--i)e=(r*e+this[i])%t;return e},e.prototype.millerRabin=function(t){var r=this.subtract(e.ONE),n=r.getLowestSetBit();if(n<=0)return!1;var o=r.shiftRight(n);(t=t+1>>1)>x.length&&(t=x.length);for(var s=i(),h=0;h<t;++h){s.fromInt(x[Math.floor(Math.random()*x.length)]);var a=s.modPow(o,this);if(0!=a.compareTo(e.ONE)&&0!=a.compareTo(r)){for(var u=1;u++<n&&0!=a.compareTo(r);)if(0==(a=a.modPowInt(2,this)).compareTo(e.ONE))return!1;if(0!=a.compareTo(r))return!1}}return!0},e.prototype.clone=function(){var t=i();return this.copyTo(t),t},e.prototype.intValue=function(){if(this.s<0){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]},e.prototype.byteValue=function(){return 0==this.t?this.s:this[0]<<24>>24},e.prototype.shortValue=function(){return 0==this.t?this.s:this[0]<<16>>16},e.prototype.signum=function(){return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1},e.prototype.toByteArray=function(){var t=this.t,r=new Array;r[0]=this.s;var e,i=this.DB-t*this.DB%8,n=0;if(t-- >0)for(i<this.DB&&(e=this[t]>>i)!=(this.s&this.DM)>>i&&(r[n++]=e|this.s<<this.DB-i);t>=0;)i<8?(e=(this[t]&(1<<i)-1)<<8-i,e|=this[--t]>>(i+=this.DB-8)):(e=this[t]>>(i-=8)&255,i<=0&&(i+=this.DB,--t)),0!=(128&e)&&(e|=-256),0==n&&(128&this.s)!=(128&e)&&++n,(n>0||e!=this.s)&&(r[n++]=e);return r},e.prototype.equals=function(t){return 0==this.compareTo(t)},e.prototype.min=function(t){return this.compareTo(t)<0?this:t},e.prototype.max=function(t){return this.compareTo(t)>0?this:t},e.prototype.and=function(t){var r=i();return this.bitwiseTo(t,v,r),r},e.prototype.or=function(t){var r=i();return this.bitwiseTo(t,y,r),r},e.prototype.xor=function(t){var r=i();return this.bitwiseTo(t,m,r),r},e.prototype.andNot=function(t){var r=i();return this.bitwiseTo(t,g,r),r},e.prototype.not=function(){for(var t=i(),r=0;r<this.t;++r)t[r]=this.DM&~this[r];return t.t=this.t,t.s=~this.s,t},e.prototype.shiftLeft=function(t){var r=i();return t<0?this.rShiftTo(-t,r):this.lShiftTo(t,r),r},e.prototype.shiftRight=function(t){var r=i();return t<0?this.lShiftTo(-t,r):this.rShiftTo(t,r),r},e.prototype.getLowestSetBit=function(){for(var t=0;t<this.t;++t)if(0!=this[t])return t*this.DB+w(this[t]);return this.s<0?this.t*this.DB:-1},e.prototype.bitCount=function(){for(var t=0,r=this.s&this.DM,e=0;e<this.t;++e)t+=T(this[e]^r);return t},e.prototype.testBit=function(t){var r=Math.floor(t/this.DB);return r>=this.t?0!=this.s:0!=(this[r]&1<<t%this.DB)},e.prototype.setBit=function(t){return this.changeBit(t,y)},e.prototype.clearBit=function(t){return this.changeBit(t,g)},e.prototype.flipBit=function(t){return this.changeBit(t,m)},e.prototype.add=function(t){var r=i();return this.addTo(t,r),r},e.prototype.subtract=function(t){var r=i();return this.subTo(t,r),r},e.prototype.multiply=function(t){var r=i();return this.multiplyTo(t,r),r},e.prototype.divide=function(t){var r=i();return this.divRemTo(t,r,null),r},e.prototype.remainder=function(t){var r=i();return this.divRemTo(t,null,r),r},e.prototype.divideAndRemainder=function(t){var r=i(),e=i();return this.divRemTo(t,r,e),new Array(r,e)},e.prototype.modPow=function(t,r){var e,n,o=t.bitLength(),s=c(1);if(o<=0)return s;e=o<18?1:o<48?3:o<144?4:o<768?5:6,n=o<8?new l(r):r.isEven()?new B(r):new d(r);var h=new Array,a=3,u=e-1,f=(1<<e)-1;if(h[1]=n.convert(this),e>1){var v=i();for(n.sqrTo(h[1],v);a<=f;)h[a]=i(),n.mulTo(v,h[a-2],h[a]),a+=2}var y,m,g=t.t-1,w=!0,T=i();for(o=p(t[g])-1;g>=0;){for(o>=u?y=t[g]>>o-u&f:(y=(t[g]&(1<<o+1)-1)<<u-o,g>0&&(y|=t[g-1]>>this.DB+o-u)),a=e;0==(1&y);)y>>=1,--a;if((o-=a)<0&&(o+=this.DB,--g),w)h[y].copyTo(s),w=!1;else{for(;a>1;)n.sqrTo(s,T),n.sqrTo(T,s),a-=2;a>0?n.sqrTo(s,T):(m=s,s=T,T=m),n.mulTo(T,h[y],s)}for(;g>=0&&0==(t[g]&1<<o);)n.sqrTo(s,T),m=s,s=T,T=m,--o<0&&(o=this.DB-1,--g)}return n.revert(s)},e.prototype.modInverse=function(t){var r=t.isEven();if(this.isEven()&&r||0==t.signum())return e.ZERO;for(var i=t.clone(),n=this.clone(),o=c(1),s=c(0),h=c(0),a=c(1);0!=i.signum();){for(;i.isEven();)i.rShiftTo(1,i),r?(o.isEven()&&s.isEven()||(o.addTo(this,o),s.subTo(t,s)),o.rShiftTo(1,o)):s.isEven()||s.subTo(t,s),s.rShiftTo(1,s);for(;n.isEven();)n.rShiftTo(1,n),r?(h.isEven()&&a.isEven()||(h.addTo(this,h),a.subTo(t,a)),h.rShiftTo(1,h)):a.isEven()||a.subTo(t,a),a.rShiftTo(1,a);i.compareTo(n)>=0?(i.subTo(n,i),r&&o.subTo(h,o),s.subTo(a,s)):(n.subTo(i,n),r&&h.subTo(o,h),a.subTo(s,a))}return 0!=n.compareTo(e.ONE)?e.ZERO:a.compareTo(t)>=0?a.subtract(t):a.signum()<0?(a.addTo(t,a),a.signum()<0?a.add(t):a):a},e.prototype.pow=function(t){return this.exp(t,new b)},e.prototype.gcd=function(t){var r=this.s<0?this.negate():this.clone(),e=t.s<0?t.negate():t.clone();if(r.compareTo(e)<0){var i=r;r=e,e=i}var n=r.getLowestSetBit(),o=e.getLowestSetBit();if(o<0)return r;for(n<o&&(o=n),o>0&&(r.rShiftTo(o,r),e.rShiftTo(o,e));r.signum()>0;)(n=r.getLowestSetBit())>0&&r.rShiftTo(n,r),(n=e.getLowestSetBit())>0&&e.rShiftTo(n,e),r.compareTo(e)>=0?(r.subTo(e,r),r.rShiftTo(1,r)):(e.subTo(r,e),e.rShiftTo(1,e));return o>0&&e.lShiftTo(o,e),e},e.prototype.isProbablePrime=function(t){var r,e=this.abs();if(1==e.t&&e[0]<=x[x.length-1]){for(r=0;r<x.length;++r)if(e[0]==x[r])return!0;return!1}if(e.isEven())return!1;for(r=1;r<x.length;){for(var i=x[r],n=r+1;n<x.length&&i<E;)i*=x[n++];for(i=e.modInt(i);r<n;)if(i%x[r++]==0)return!1}return e.millerRabin(t)},e.prototype.square=function(){var t=i();return this.squareTo(t),t},e.prototype.Barrett=B,null==A){var M;if(A=new Array,_=0,"undefined"!=typeof window&&window.crypto)if(window.crypto.getRandomValues){var C=new Uint8Array(32);for(window.crypto.getRandomValues(C),M=0;M<32;++M)A[_++]=C[M]}else if("Netscape"==navigator.appName&&navigator.appVersion<"5"){var k=window.crypto.random(32);for(M=0;M<k.length;++M)A[_++]=255&k.charCodeAt(M)}for(;_<N;)M=Math.floor(65536*Math.random()),A[_++]=M>>>8,A[_++]=255&M;_=0,R()}function j(){if(null==D){for(R(),(D=new I).init(A),_=0;_<A.length;++_)A[_]=0;_=0}return D.next()}function O(){}function I(){this.i=0,this.j=0,this.S=new Array}O.prototype.nextBytes=function(t){var r;for(r=0;r<t.length;++r)t[r]=j()},I.prototype.init=function(t){var r,e,i;for(r=0;r<256;++r)this.S[r]=r;for(e=0,r=0;r<256;++r)i=this.S[r],this.S[r]=this.S[e=e+this.S[r]+t[r%t.length]&255],this.S[e]=i;this.i=0,this.j=0},I.prototype.next=function(){var t;return this.i=this.i+1&255,this.j=this.j+this.S[this.i]&255,t=this.S[this.i],this.S[this.i]=this.S[this.j],this.S[this.j]=t,this.S[t+this.S[this.i]&255]};var N=256;e.SecureRandom=O,e.BigInteger=e,r.exports=e}).call(t)}),h={sha1:"3021300906052b0e03021a05000414",sha224:"302d300d06096086480165030402040500041c",sha256:"3031300d060960864801650304020105000420",sha384:"3041300d060960864801650304020205000430",sha512:"3051300d060960864801650304020305000440",md2:"3020300c06082a864886f70d020205000410",md5:"3020300c06082a864886f70d020505000410",ripemd160:"3021300906052b2403020105000414"},a={sha256:i};function u(t,r){if(this.n=null,this.e=0,!(null!=t&&null!=r&&t.length>0&&r.length>0))throw new Error("Invalid key data");this.n=new s(t,16),this.e=parseInt(r,16)}u.prototype.verify=function(t,r){r=r.replace(/[^0-9a-f]|[\s\n]]/gi,"");var e=new s(r,16);if(e.bitLength()>this.n.bitLength())throw new Error("Signature does not match with the key modulus.");var i=function(t){for(var r in h){var e=h[r],i=e.length;if(t.substring(0,i)===e)return{alg:r,hash:t.substring(i)}}return[]}(e.modPowInt(this.e,this.n).toString(16).replace(/^1f+00/,""));if(0===i.length)return!1;if(!a.hasOwnProperty(i.alg))throw new Error("Hashing algorithm is not supported.");var n=a[i.alg](t).toString();return i.hash===n};for(var f=function(t){return 3*t.length/4-w(t)},c=function(t){var r,e,i,n,o,s,h=t.length;o=w(t),s=new v(3*h/4-o),i=o>0?h-4:h;var a=0;for(r=0,e=0;r<i;r+=4,e+=3)n=d[t.charCodeAt(r)]<<18|d[t.charCodeAt(r+1)]<<12|d[t.charCodeAt(r+2)]<<6|d[t.charCodeAt(r+3)],s[a++]=n>>16&255,s[a++]=n>>8&255,s[a++]=255&n;2===o?(n=d[t.charCodeAt(r)]<<2|d[t.charCodeAt(r+1)]>>4,s[a++]=255&n):1===o&&(n=d[t.charCodeAt(r)]<<10|d[t.charCodeAt(r+1)]<<4|d[t.charCodeAt(r+2)]>>2,s[a++]=n>>8&255,s[a++]=255&n);return s},p=function(t){for(var r,e=t.length,i=e%3,n="",o=[],s=0,h=e-i;s<h;s+=16383)o.push(T(t,s,s+16383>h?h:s+16383));1===i?(n+=l[(r=t[e-1])>>2],n+=l[r<<4&63],n+="=="):2===i&&(n+=l[(r=(t[e-2]<<8)+t[e-1])>>10],n+=l[r>>4&63],n+=l[r<<2&63],n+="=");return o.push(n),o.join("")},l=[],d=[],v="undefined"!=typeof Uint8Array?Uint8Array:Array,y="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",m=0,g=y.length;m<g;++m)l[m]=y[m],d[y.charCodeAt(m)]=m;function w(t){var r=t.length;if(r%4>0)throw new Error("Invalid string. Length must be a multiple of 4");return"="===t[r-2]?2:"="===t[r-1]?1:0}function T(t,r,e){for(var i,n=[],o=r;o<e;o+=3)n.push(l[(i=(t[o]<<16)+(t[o+1]<<8)+t[o+2])>>18&63]+l[i>>12&63]+l[i>>6&63]+l[63&i]);return n.join("")}d["-".charCodeAt(0)]=62,d["_".charCodeAt(0)]=63;var b={byteLength:f,toByteArray:c,fromByteArray:p};function S(t){var r=t.length%4;return 0===r?t:t+new Array(1+(4-r)).join("=")}function B(t){return t=S(t).replace(/\-/g,"+").replace(/_/g,"/"),decodeURIComponent(function(t){for(var r="",e=0;e<t.length;e++)r+=String.fromCharCode(t[e]);return r}(b.toByteArray(t)).split("").map(function(t){return"%"+("00"+t.charCodeAt(0).toString(16)).slice(-2)}).join(""))}function D(t){return function(t){for(var r="",e=0;e<t.length;e++){var i=t[e].toString(16);r+=2===i.length?i:"0"+i}return r}(b.toByteArray(S(t)))}var A=r(function(r){var e,i;e=t,i=function(){return function(){var t=arguments;"object"==typeof arguments[0]&&(t=arguments[0]);var r=[].slice.call(t,0).join("/");return r.replace(/:\//g,"://").replace(/([^:\s])\/+/g,"$1/").replace(/\/(\?|&|#[^!])/g,"$1").replace(/(\?.+)\?/g,"$1&")}},r.exports?r.exports=i():e.urljoin=i()});function _(t,r){return r=r||{},new Promise(function(e,i){var n=new XMLHttpRequest,o=[],s=[],h={},a=function(){return{ok:2==(n.status/100|0),statusText:n.statusText,status:n.status,url:n.responseURL,text:function(){return Promise.resolve(n.responseText)},json:function(){return Promise.resolve(JSON.parse(n.responseText))},blob:function(){return Promise.resolve(new Blob([n.response]))},clone:a,headers:{keys:function(){return o},entries:function(){return s},get:function(t){return h[t.toLowerCase()]},has:function(t){return t.toLowerCase()in h}}}};for(var u in n.open(r.method||"get",t,!0),n.onload=function(){n.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,function(t,r,e){o.push(r=r.toLowerCase()),s.push([r,e]),h[r]=h[r]?h[r]+","+e:e}),e(a())},n.onerror=i,n.withCredentials="include"==r.credentials,r.headers)n.setRequestHeader(u,r.headers[u]);n.send(r.body||null)})}var x=setTimeout;function E(t){return Boolean(t&&void 0!==t.length)}function R(){}function M(t){if(!(this instanceof M))throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],N(t,this)}function C(t,r){for(;3===t._state;)t=t._value;0!==t._state?(t._handled=!0,M._immediateFn(function(){var e=1===t._state?r.onFulfilled:r.onRejected;if(null!==e){var i;try{i=e(t._value)}catch(t){return void j(r.promise,t)}k(r.promise,i)}else(1===t._state?k:j)(r.promise,t._value)})):t._deferreds.push(r)}function k(t,r){try{if(r===t)throw new TypeError("A promise cannot be resolved with itself.");if(r&&("object"==typeof r||"function"==typeof r)){var e=r.then;if(r instanceof M)return t._state=3,t._value=r,void O(t);if("function"==typeof e)return void N((i=e,n=r,function(){i.apply(n,arguments)}),t)}t._state=1,t._value=r,O(t)}catch(r){j(t,r)}var i,n}function j(t,r){t._state=2,t._value=r,O(t)}function O(t){2===t._state&&0===t._deferreds.length&&M._immediateFn(function(){t._handled||M._unhandledRejectionFn(t._value)});for(var r=0,e=t._deferreds.length;r<e;r++)C(t,t._deferreds[r]);t._deferreds=null}function I(t,r,e){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof r?r:null,this.promise=e}function N(t,r){var e=!1;try{t(function(t){e||(e=!0,k(r,t))},function(t){e||(e=!0,j(r,t))})}catch(t){if(e)return;e=!0,j(r,t)}}function V(t){if(t.ok)return t.json();var r=new Error(t.statusText);return r.response=t,M.reject(r)}function L(t,r){return("undefined"==typeof fetch?_:fetch)(t.jwksURI||A(t.iss,".well-known","jwks.json")).then(V).then(function(e){var i,n,o,s=null;for(i=0;i<e.keys.length&&null===s;i++)(n=e.keys[i]).kid===t.kid&&(s=n);return r(null,{modulus:D((o=s).n),exp:D(o.e)})}).catch(function(t){r(t)})}function P(t){this.name="ConfigurationError",this.message=t||""}function q(t){this.name="TokenValidationError",this.message=t||""}M.prototype.catch=function(t){return this.then(null,t)},M.prototype.then=function(t,r){var e=new this.constructor(R);return C(this,new I(t,r,e)),e},M.prototype.finally=function(t){var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){return r.reject(e)})})},M.all=function(t){return new M(function(r,e){if(!E(t))return e(new TypeError("Promise.all accepts an array"));var i=Array.prototype.slice.call(t);if(0===i.length)return r([]);var n=i.length;function o(t,s){try{if(s&&("object"==typeof s||"function"==typeof s)){var h=s.then;if("function"==typeof h)return void h.call(s,function(r){o(t,r)},e)}i[t]=s,0==--n&&r(i)}catch(t){e(t)}}for(var s=0;s<i.length;s++)o(s,i[s])})},M.resolve=function(t){return t&&"object"==typeof t&&t.constructor===M?t:new M(function(r){r(t)})},M.reject=function(t){return new M(function(r,e){e(t)})},M.race=function(t){return new M(function(r,e){if(!E(t))return e(new TypeError("Promise.race accepts an array"));for(var i=0,n=t.length;i<n;i++)M.resolve(t[i]).then(r,e)})},M._immediateFn="function"==typeof setImmediate&&function(t){setImmediate(t)}||function(t){x(t,0)},M._unhandledRejectionFn=function(t){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",t)},P.prototype=Error.prototype,q.prototype=Error.prototype;var U=function(){};U.prototype.get=function(){return null},U.prototype.has=function(){return null},U.prototype.set=function(){return null};var H=["RS256"];function F(t){var r=t||{};if(this.jwksCache=r.jwksCache||new U,this.expectedAlg=r.expectedAlg||"RS256",this.issuer=r.issuer,this.audience=r.audience,this.leeway=r.leeway||0,this.__disableExpirationCheck=r.__disableExpirationCheck||!1,this.jwksURI=r.jwksURI,this.leeway<0||this.leeway>300)throw new P("The leeway should be positive and lower than five minutes.");if(-1===H.indexOf(this.expectedAlg))throw new P("Algorithm "+this.expectedAlg+" is not supported. (Expected algs: ["+H.join(",")+"])")}F.prototype.verify=function(t,r,e){var i=this.decode(t);if(i instanceof Error)return e(i,!1);var n=i.encoded.header+"."+i.encoded.payload,o=D(i.encoded.signature),s=i.header.alg,h=i.header.kid,a=i.payload.aud,u=i.payload.iss,f=i.payload.exp,c=i.payload.nbf,p=i.payload.nonce||null,l=this;if(l.expectedAlg!==s)return e(new q("Algorithm "+s+" is not supported. (Expected algs: ["+H.join(",")+"])"),!1);this.getRsaVerifier(u,h,function(t,s){if(t)return e(t);if(s.verify(n,o)){if(l.issuer!==u)return e(new q("Issuer "+u+" is not valid."),!1);if(l.audience!==a)return e(new q("Audience "+a+" is not valid."),!1);if(p!==r)return e(new q("Nonce does not match."),!1);var h=l.verifyExpAndNbf(f,c);return h?e(h,!1):e(null,i.payload)}return e(new q("Invalid signature."))})},F.prototype.verifyExpAndNbf=function(t,r){var e=new Date,i=new Date(0),n=new Date(0);return this.__disableExpirationCheck?null:(i.setUTCSeconds(t+this.leeway),e>i?new q("Expired token."):void 0===r?null:(n.setUTCSeconds(r-this.leeway),e<n?new q("The token is not valid until later in the future. Please check your computed clock."):null))},F.prototype.verifyExpAndIat=function(t,r){var e=new Date,i=new Date(0),n=new Date(0);return this.__disableExpirationCheck?null:(i.setUTCSeconds(t+this.leeway),e>i?new q("Expired token."):(n.setUTCSeconds(r-this.leeway),e<n?new q("The token was issued in the future. Please check your computed clock."):null))},F.prototype.getRsaVerifier=function(t,r,e){var i=this,n=t+r;if(this.jwksCache.has(n)){var o=this.jwksCache.get(n);e(null,new u(o.modulus,o.exp))}else L({jwksURI:this.jwksURI,iss:t,kid:r},function(t,r){return t?e(t):(i.jwksCache.set(n,r),e(null,new u(r.modulus,r.exp)))})},F.prototype.decode=function(t){var r,e,i=t.split(".");if(3!==i.length)return new q("Cannot decode a malformed JWT");try{r=JSON.parse(B(i[0])),e=JSON.parse(B(i[1]))}catch(t){return new q("Token header or payload is not valid JSON")}return{header:r,payload:e,encoded:{header:i[0],payload:i[1],signature:i[2]}}},F.prototype.validateAccessToken=function(t,r,e,s){if(this.expectedAlg!==r)return s(new q("Algorithm "+r+" is not supported. (Expected alg: "+this.expectedAlg+")"));var h,a=i(t),u=o.stringify(a),f=u.substring(0,u.length/2),c=o.parse(f),p=n.stringify(c);return s((h={"+":"-","/":"_","=":""},p.replace(/[+\/=]/g,function(t){return h[t]}))!==e?new q("Invalid access_token"):null)},module.exports=F;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"timers":257}],248:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":258}],249:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],250:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],251:[function(require,module,exports){
'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

},{}],252:[function(require,module,exports){
arguments[4][109][0].apply(exports,arguments)
},{"./formats":251,"./parse":253,"./stringify":254,"dup":109}],253:[function(require,module,exports){
'use strict';

var utils = require('./utils');

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset);
            val = options.decoder(part.slice(pos + 1), defaults.decoder, charset);
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (val && options.comma && val.indexOf(',') > -1) {
            val = val.split(',');
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new Error('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        depth: typeof opts.depth === 'number' ? opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

},{"./utils":255}],254:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var formats = require('./formats');
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    formatter: formats.formatters[formats['default']],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly,
    charset
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = obj.join(',');
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (isArray(obj)) {
            pushToArray(values, stringify(
                obj[key],
                typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix,
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        } else {
            pushToArray(values, stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        }
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.formatter,
            options.encodeValuesOnly,
            options.charset
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

},{"./formats":251,"./utils":255}],255:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    merge: merge
};

},{}],256:[function(require,module,exports){
'use strict'
/* eslint no-proto: 0 */
module.exports = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties)

function setProtoOf (obj, proto) {
  obj.__proto__ = proto
  return obj
}

function mixinProperties (obj, proto) {
  for (var prop in proto) {
    if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
      obj[prop] = proto[prop]
    }
  }
  return obj
}

},{}],257:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":250,"timers":257}],258:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.WHATWGFetch = {})));
}(this, (function (exports) { 'use strict';

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}]},{},[1]);
