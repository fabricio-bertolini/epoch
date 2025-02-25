import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne} from 'typeorm';
import { Viajante } from './Viajante';
import { Fiscal } from './Fiscal';
import { Viagem } from './Viagem';

@Entity('infracoes')
export class Infracao 
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'timestamp' })
  data: Date;

  @Column({ type: 'text' })
  gravidade: string;

  @ManyToOne(() => Viajante, viajante => viajante.infracoes)
  @JoinColumn({ name: 'viajante_id' })
  viajante: Viajante;
  //Fiscal que multou o viajante
  @ManyToOne(() => Fiscal, fiscal => fiscal.infracoes)
  @JoinColumn({ name: 'fiscal_id' })
  fiscal: Fiscal;
  //Viagem na qual multa foi gerada
  @OneToOne(() => Viagem, viagem => viagem.infracao)
  @JoinColumn({ name: 'viagem_id' })
  viagem: Viagem;
}
