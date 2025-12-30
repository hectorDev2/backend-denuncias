import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';

@Injectable()
export class DenunciasService {
  constructor(private prisma: PrismaService) { }

  create(
    createDenunciaDto: CreateDenunciaDto,
    userId: number,
    imageUrl?: string,
  ) {
    return this.prisma.complaint.create({
      data: {
        ...createDenunciaDto,
        userId,
        imageUrl,
      },
    });
  }
  async findByUser(userId: number): Promise<any[]> {
    return this.prisma.complaint.findMany({ where: { userId } });
  }

  findAll(filters?: { status?: string; category?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.category) where.category = filters.category;

    return this.prisma.complaint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });
  }

  findOne(id: number) {
    return this.prisma.complaint.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });
  }

  async updateStatus(id: number, status: string) {
    const complaint = await this.prisma.complaint.findUnique({ where: { id } });
    
    if (!complaint) {
       throw new Error('Complaint not found'); // Best to use NotFoundException but service layer throwing generic error is okay if controller handles it, but let's stick to simple logic here
    }

    const currentStatus = complaint.status;
    
    // Validate Flow
    const isValid = 
      (currentStatus === 'pending' && status === 'in_progress') ||
      (currentStatus === 'in_progress' && status === 'resolved');
      
    if (!isValid) {
      // Throwing error that controller can catch or filter
       throw new Error(`Invalid status transition from ${currentStatus} to ${status}`);
    }

    // Update
    const updatedComplaint = await this.prisma.complaint.update({
      where: { id },
      data: { status },
    });

    // Notify
    await this.prisma.notification.create({
      data: {
        type: 'status_change',
        message: `El estado de tu denuncia "${complaint.title}" ha cambiado a "${status}".`,
        userId: complaint.userId,
      }
    });

    return updatedComplaint;
  }

  remove(id: number) {
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
      byStatus: byStatus.reduce(
        (acc, curr) => ({ ...acc, [curr.status]: curr._count.status }),
        {},
      ),
      byCategory: byCategory.reduce(
        (acc, curr) => ({ ...acc, [curr.category]: curr._count.category }),
        {},
      ),
    };
  }
}
