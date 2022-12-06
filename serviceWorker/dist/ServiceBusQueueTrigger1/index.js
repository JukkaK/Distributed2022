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
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const serviceBusQueueTrigger = function (context, mySbMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('ServiceBus queue trigger function processed message', mySbMsg);
        context.log("WEBSITE_SITE_NAME: " + process.env["WEBSITE_SITE_NAME"]);
        yield (0, axios_1.default)({
            method: 'PUT',
            url: 'https://func-distributed-dbapi-we-001.azurewebsites.net/api/db',
            data: { mySbMsg }
        }).then(function (response) {
            context.log("DB PUT succeeded:" + response);
            return response;
        });
        context.log("DB PUT failed in: " + process.env["WEBSITE_SITE_NAME"]);
        return "nope";
    });
};
exports.default = serviceBusQueueTrigger;
//# sourceMappingURL=index.js.map