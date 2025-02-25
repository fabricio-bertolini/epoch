import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Infracao } from './Infracao';
import { Viagem } from './Viagem';

@Entity('viajantes')
export class Viajante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nome: string;

  @Column({ type: 'timestamp' })
  dataNascimento: Date;

  @Column({ type: 'varchar', length: 8, unique: true })
  numeroPassaporte: string;

  @OneToMany(() => Infracao, infracao => infracao.viajante, { nullable: true })
  infracoes: Infracao[];

  @OneToMany(() => Viagem, viagem => viagem.viajante, { nullable: true })
  viagens: Viagem[];
}
