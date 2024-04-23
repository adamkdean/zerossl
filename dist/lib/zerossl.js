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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ZeroSSL = void 0;
var node_forge_1 = __importDefault(require("node-forge"));
var errors_1 = require("./errors");
var defaultOptions = {
    apiUrl: 'api.zerossl.com'
};
var ZeroSSL = (function () {
    function ZeroSSL(options) {
        this.options = __assign(__assign({}, defaultOptions), options);
    }
    ZeroSSL.prototype.performRequest = function (url, request) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var response, body, error;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (request.method === "POST") {
                            (_a = request.headers) !== null && _a !== void 0 ? _a : (request.headers = { "content-type": "application/x-www-form-urlencoded" });
                        }
                        return [4, fetch("https://" + url, request)];
                    case 1:
                        response = _d.sent();
                        return [4, response.json()];
                    case 2:
                        body = _d.sent();
                        if (!response.ok || body.success === false) {
                            error = (0, errors_1.findZeroSSLError)(((_b = body.error) === null || _b === void 0 ? void 0 : _b.code) || 0);
                            if ((_c = body.error) === null || _c === void 0 ? void 0 : _c.details)
                                error.details = body.error.details;
                            throw new errors_1.ZeroSSLError(response.status, error);
                        }
                        return [2, body];
                }
            });
        });
    };
    ZeroSSL.prototype.createCertificate = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var qs, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qs = new URLSearchParams({ access_key: this.options.accessKey }).toString();
                        url = "".concat(this.options.apiUrl, "/certificates?").concat(qs);
                        return [4, this.performRequest(url, {
                                method: "POST",
                                body: new URLSearchParams({
                                    certificate_domains: options.domains.join(','),
                                    certificate_csr: options.csr,
                                    certificate_validity_days: options.validityDays.toString(10),
                                    strict_domains: options.strictDomains.toString()
                                }).toString()
                            })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    ZeroSSL.prototype.verifyDomains = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var isEmailValidation, missingEmail, qs, url, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isEmailValidation = options.validation_method === 'EMAIL';
                        missingEmail = isEmailValidation && !options.validation_email;
                        if (missingEmail)
                            throw new Error('Missing verification option: validation_email');
                        qs = new URLSearchParams({ access_key: this.options.accessKey }).toString();
                        url = "".concat(this.options.apiUrl, "/certificates/").concat(id, "/challenges?").concat(qs);
                        params = new URLSearchParams({ validation_method: options.validation_method });
                        if (isEmailValidation)
                            params.set('validation_email', options.validation_email);
                        return [4, this.performRequest(url, {
                                method: "POST",
                                body: params.toString()
                            })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    ZeroSSL.prototype.downloadCertificate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var qs, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qs = new URLSearchParams({ access_key: this.options.accessKey }).toString();
                        url = "".concat(this.options.apiUrl, "/certificates/").concat(id, "/download/return?").concat(qs);
                        return [4, this.performRequest(url, {})];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    ZeroSSL.prototype.getCertificate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var qs, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qs = new URLSearchParams({ access_key: this.options.accessKey }).toString();
                        url = "".concat(this.options.apiUrl, "/certificates/").concat(id, "?").concat(qs);
                        return [4, this.performRequest(url, {})];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    ZeroSSL.prototype.listCertificates = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var query, qs, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { access_key: this.options.accessKey };
                        if (options) {
                            if (options.page)
                                query['page'] = options.page.toString();
                            if (options.limit)
                                query['limit'] = options.limit.toString();
                            if (options.search)
                                query['search'] = options.search;
                            if (options.certificate_status)
                                query['certificate_status'] = options.certificate_status;
                        }
                        qs = new URLSearchParams(query).toString();
                        url = "".concat(this.options.apiUrl, "/certificates?").concat(qs);
                        return [4, this.performRequest(url, {})];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    ZeroSSL.prototype.verificationStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var qs, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qs = new URLSearchParams({ access_key: this.options.accessKey }).toString();
                        url = "".concat(this.options.apiUrl, "/certificates/").concat(id, "/status?").concat(qs);
                        return [4, this.performRequest(url, {})];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    ZeroSSL.prototype.resendVerification = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var qs, url, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qs = new URLSearchParams({ access_key: this.options.accessKey }).toString();
                        url = "".concat(this.options.apiUrl, "/certificates/").concat(id, "/challenges/email?").concat(qs);
                        return [4, this.performRequest(url, {
                                method: "POST"
                            })];
                    case 1:
                        result = _a.sent();
                        return [2, result.success === 1];
                }
            });
        });
    };
    ZeroSSL.prototype.cancelCertificate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var qs, url, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qs = new URLSearchParams({ access_key: this.options.accessKey }).toString();
                        url = "".concat(this.options.apiUrl, "/certificates/").concat(id, "/cancel?").concat(qs);
                        return [4, this.performRequest(url, {
                                method: "POST"
                            })];
                    case 1:
                        result = _a.sent();
                        return [2, result.success === 1];
                }
            });
        });
    };
    ZeroSSL.prototype.revokeCertificate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var qs, url, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qs = new URLSearchParams({ access_key: this.options.accessKey }).toString();
                        url = "".concat(this.options.apiUrl, "/certificates/").concat(id, "/revoke?").concat(qs);
                        return [4, this.performRequest(url, {
                                method: "POST"
                            })];
                    case 1:
                        result = _a.sent();
                        return [2, result.success === 1];
                }
            });
        });
    };
    ZeroSSL.prototype.validateCSR = function (csr) {
        return __awaiter(this, void 0, void 0, function () {
            var qs, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qs = new URLSearchParams({ access_key: this.options.accessKey }).toString();
                        url = "".concat(this.options.apiUrl, "/validation/csr?").concat(qs);
                        return [4, this.performRequest(url, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ csr: csr })
                            })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    ZeroSSL.prototype.generateKeyPair = function (bits) {
        if (bits === void 0) { bits = 2048; }
        var keys = node_forge_1["default"].pki.rsa.generateKeyPair(bits);
        return {
            publicKey: node_forge_1["default"].pki.publicKeyToPem(keys.publicKey),
            privateKey: node_forge_1["default"].pki.privateKeyToPem(keys.privateKey)
        };
    };
    ZeroSSL.prototype.generateCSR = function (keypair, options) {
        var country = options.country, state = options.state, locality = options.locality, organization = options.organization, organizationUnit = options.organizationUnit, commonName = options.commonName, email = options.email;
        var csr = node_forge_1["default"].pki.createCertificationRequest();
        csr.publicKey = node_forge_1["default"].pki.publicKeyFromPem(keypair.publicKey);
        csr.setSubject([
            { name: 'countryName', value: country },
            { name: 'stateOrProvinceName', value: state },
            { name: 'localityName', value: locality },
            { name: 'organizationName', value: organization },
            { name: 'organizationalUnitName', value: organizationUnit },
            { name: 'commonName', value: commonName },
            { name: 'emailAddress', value: email }
        ]);
        csr.sign(node_forge_1["default"].pki.privateKeyFromPem(keypair.privateKey));
        return node_forge_1["default"].pki.certificationRequestToPem(csr);
    };
    return ZeroSSL;
}());
exports.ZeroSSL = ZeroSSL;
