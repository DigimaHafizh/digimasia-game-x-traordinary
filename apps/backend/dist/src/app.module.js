"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma.module");
const auth_module_1 = require("./auth.module");
const session_module_1 = require("./session.module");
const events_module_1 = require("./events.module");
const events_gateway_1 = require("./events.gateway");
const vote_module_1 = require("./vote.module");
const vote_service_1 = require("./vote.service");
const vote_controller_1 = require("./vote.controller");
const candidate_module_1 = require("./candidate.module");
const candidate_service_1 = require("./candidate.service");
const candidate_controller_1 = require("./candidate.controller");
const trivia_module_1 = require("./trivia.module");
const trivia_service_1 = require("./trivia.service");
const trivia_controller_1 = require("./trivia.controller");
const user_controller_1 = require("./user.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, session_module_1.SessionModule, auth_module_1.AuthModule, events_module_1.EventsModule, vote_module_1.VoteModule, candidate_module_1.CandidateModule, trivia_module_1.TriviaModule],
        controllers: [app_controller_1.AppController, vote_controller_1.VoteController, candidate_controller_1.CandidateController, trivia_controller_1.TriviaController, user_controller_1.UserController],
        providers: [app_service_1.AppService, events_gateway_1.EventsGateway, vote_service_1.VoteService, candidate_service_1.CandidateService, trivia_service_1.TriviaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map