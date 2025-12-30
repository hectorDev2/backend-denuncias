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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DenunciasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DenunciasService = class DenunciasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createDenunciaDto, userId, imageUrl) {
        return this.prisma.complaint.create({
            data: {
                ...createDenunciaDto,
                userId,
                imageUrl,
            },
        });
    }
    async findByUser(userId) {
        return this.prisma.complaint.findMany({ where: { userId } });
    }
    findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.category)
            where.category = filters.category;
        return this.prisma.complaint.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } },
        });
    }
    findOne(id) {
        return this.prisma.complaint.findUnique({
            where: { id },
            include: { user: { select: { name: true, email: true } } },
        });
    }
    updateStatus(id, status) {
        return this.prisma.complaint.update({
            where: { id },
            data: { status },
        });
    }
    remove(id) {
        return this.prisma.complaint.delete({
            where: { id },
        });
    }
    async getStats() {
        const total = await this.prisma.complaint.count();
        const byStatus = await this.prisma.complaint.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        const byCategory = await this.prisma.complaint.groupBy({
            by: ['category'],
            _count: { category: true },
        });
        return {
            total,
            byStatus: byStatus.reduce((acc, curr) => ({ ...acc, [curr.status]: curr._count.status }), {}),
            byCategory: byCategory.reduce((acc, curr) => ({ ...acc, [curr.category]: curr._count.category }), {}),
        };
    }
};
exports.DenunciasService = DenunciasService;
exports.DenunciasService = DenunciasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DenunciasService);
//# sourceMappingURL=denuncias.service.js.map