"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriviaModule = void 0;
const common_1 = require("@nestjs/common");
const trivia_service_1 = require("./trivia.service");
const trivia_controller_1 = require("./trivia.controller");
const session_module_1 = require("./session.module");
let TriviaModule = class TriviaModule {
};
exports.TriviaModule = TriviaModule;
exports.TriviaModule = TriviaModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => session_module_1.SessionModule)],
        controllers: [trivia_controller_1.TriviaController],
        providers: [trivia_service_1.TriviaService],
        exports: [trivia_service_1.TriviaService],
    })
], TriviaModule);
//# sourceMappingURL=trivia.module.js.map