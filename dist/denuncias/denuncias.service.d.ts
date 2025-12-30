import { PrismaService } from '../prisma/prisma.service';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';
export declare class DenunciasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDenunciaDto: CreateDenunciaDto, userId: number, imageUrl?: string): import(".prisma/client").Prisma.Prisma__ComplaintClient<{
        id: number;
        title: string;
        description: string;
        category: string;
        status: string;
        lat: number | null;
        lng: number | null;
        address: string | null;
        imageUrl: string | null;
        createdAt: Date;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findByUser(userId: number): Promise<any[]>;
    findAll(filters?: {
        status?: string;
        category?: string;
    }): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            name: string;
            email: string;
        };
    } & {
        id: number;
        title: string;
        description: string;
        category: string;
        status: string;
        lat: number | null;
        lng: number | null;
        address: string | null;
        imageUrl: string | null;
        createdAt: Date;
        userId: number;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__ComplaintClient<({
        user: {
            name: string;
            email: string;
        };
    } & {
        id: number;
        title: string;
        description: string;
        category: string;
        status: string;
        lat: number | null;
        lng: number | null;
        address: string | null;
        imageUrl: string | null;
        createdAt: Date;
        userId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    updateStatus(id: number, status: string): import(".prisma/client").Prisma.Prisma__ComplaintClient<{
        id: number;
        title: string;
        description: string;
        category: string;
        status: string;
        lat: number | null;
        lng: number | null;
        address: string | null;
        imageUrl: string | null;
        createdAt: Date;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__ComplaintClient<{
        id: number;
        title: string;
        description: string;
        category: string;
        status: string;
        lat: number | null;
        lng: number | null;
        address: string | null;
        imageUrl: string | null;
        createdAt: Date;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    getStats(): Promise<{
        total: number;
        byStatus: {};
        byCategory: {};
    }>;
}
