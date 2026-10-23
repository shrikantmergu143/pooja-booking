import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pooja } from './entities/pooja.entity';
import { PoojasController } from './poojas.controller';
import { PoojasService } from './poojas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pooja])],
  controllers: [PoojasController],
  providers: [PoojasService],
  exports: [PoojasService],
})
export class PoojasModule {}
