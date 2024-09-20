'use strict';
var __awaiter =
  (this && this.__awaiter) ||
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
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
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
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
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
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
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
Object.defineProperty(exports, '__esModule', { value: true });
var fs = require('fs');
var csv_parser_1 = require('csv-parser');
var lodash_1 = require('lodash');
var client_js_1 = require('../client.ts');
var schema_js_1 = require('../../drizzle/schema.js');
var geoMapping;
var db = (0, client_js_1.getDb)().db;
function parseCsv(filePath, options) {
  if (options === void 0) {
    options = { separator: ';' };
  }
  return new Promise(function (resolve, reject) {
    var results = [];
    fs.createReadStream(filePath)
      .pipe((0, csv_parser_1.default)(options))
      .on('data', function (data) {
        results.push(data);
      })
      .on('end', function () {
        return resolve(results);
      })
      .on('error', function (err) {
        return reject(err);
      });
  });
}
function fromRow(row, pc4) {
  var result = {
    Plaats: row.Plaats,
    PC4: pc4,
    Gemeente: row.Gemeente,
    Provincie: row.Provincie,
    GeoPoint: geoMapping[pc4]
  };
  return result;
}
function insertPlaatsen(rows) {
  return __awaiter(this, void 0, void 0, function () {
    var _i, rows_1, row, pc4Range, start, end, pc4, values, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          (_i = 0), (rows_1 = rows);
          _a.label = 1;
        case 1:
          if (!(_i < rows_1.length)) return [3 /*break*/, 11];
          row = rows_1[_i];
          pc4Range = row.PC4.split('–');
          if (!(pc4Range.length === 2)) return [3 /*break*/, 8];
          start = parseInt(pc4Range[0], 10);
          end = parseInt(pc4Range[1], 10);
          pc4 = start;
          _a.label = 2;
        case 2:
          if (!(pc4 <= end)) return [3 /*break*/, 7];
          _a.label = 3;
        case 3:
          _a.trys.push([3, 5, , 6]);
          values = fromRow(row, pc4);
          return [4 /*yield*/, db.insert(schema_js_1.plaatsen).values(values)];
        case 4:
          _a.sent();
          console.log('Inserted '.concat(row.Plaats, ' ').concat(pc4));
          return [3 /*break*/, 6];
        case 5:
          err_1 = _a.sent();
          console.log('Could not insert '.concat(row.Plaats, ' ').concat(pc4), err_1.toString());
          return [3 /*break*/, 6];
        case 6:
          pc4++;
          return [3 /*break*/, 2];
        case 7:
          return [3 /*break*/, 10];
        case 8:
          return [
            4 /*yield*/,
            db.insert(schema_js_1.plaatsen).values(fromRow(row, parseInt(row.PC4, 10)))
          ];
        case 9:
          _a.sent();
          _a.label = 10;
        case 10:
          _i++;
          return [3 /*break*/, 1];
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
function run(plaatsCsv, geoCsv) {
  return __awaiter(this, void 0, void 0, function () {
    var plaatsnamen, geopoints;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            parseCsv(plaatsCsv, {
              separator: ','
            })
          ];
        case 1:
          plaatsnamen = _a.sent();
          return [4 /*yield*/, parseCsv(geoCsv)];
        case 2:
          geopoints = _a.sent();
          geoMapping = lodash_1.default.chain(geopoints).keyBy('PC4').mapValues('GeoPoint').value();
          return [4 /*yield*/, insertPlaatsen(plaatsnamen)];
        case 3:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
run('./location_data/woonplaatsen_pc4.csv', './location_data/georef-netherlands-postcode-pc4.csv')
  .then(function () {
    console.log('Database population completed.');
  })
  .catch(function (err) {
    console.error(err);
  });
