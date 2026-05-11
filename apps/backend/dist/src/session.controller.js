"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const common_1 = require("@nestjs/common");
const session_service_1 = require("./session.service");
const trivia_service_1 = require("./trivia.service");
let SessionController = class SessionController {
    session;
    trivia;
    constructor(session, trivia) {
        this.session = session;
        this.trivia = trivia;
    }
    async updatePhase(body) {
        return this.session.updatePhase(body.phase);
    }
    async startTrivia() {
        return this.trivia.startTrivia();
    }
    async nextQuestion() {
        return this.trivia.nextQuestion();
    }
    async reset() {
        return this.session.reset();
    }
    async getTriviaStats(index) {
        return this.trivia.getStats(parseInt(index));
    }
};
exports.SessionController = SessionController;
__decorate([
    (0, common_1.Post)('phase'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "updatePhase", null);
__decorate([
    (0, common_1.Post)('start-trivia'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "startTrivia", null);
__decorate([
    (0, common_1.Post)('next-question'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "nextQuestion", null);
__decorate([
    (0, common_1.Post)('reset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "reset", null);
__decorate([
    (0, common_1.Get)('trivia-stats'),
    __param(0, (0, common_1.Query)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getTriviaStats", null);
exports.SessionController = SessionController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [session_service_1.SessionService,
        trivia_service_1.TriviaService])
], SessionController);
//# sourceMappingURL=session.controller.js.map