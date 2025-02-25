import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Viajante } from './Viajante';
import { Infracao } from './Infracao';

@Entity('viagens')
export class Viagem
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  descricao: string;
  
  //para qual data destino a viagem foi feita
  @Column({ type: 'timestamp' })
  dataDestino: Date;

  //data em que o registro da viagem foi feito
  @Column({ type: 'timestamp' })
  dataDaViagem: Date;

  @ManyToOne(() => Viajante, viajante => viajante.infracoes)
  @JoinColumn({ name: 'viajante_id' })
  viajante: Viajante;

  @OneToOne(() => Infracao, infracao => infracao.viagem, { nullable: true })
  @JoinColumn({ name: 'infracao_id' })
  infracao: Infracao;

}