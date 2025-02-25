import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Infracao } from "./Infracao";

@Entity('fiscais')
export class Fiscal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text'})
  nome: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  cpf: string;

  @Column( { type: 'text' , unique: true})
  usuario: string;

  @Column( { type: 'text' })
  senha: string;

  @OneToMany(() => Infracao, infracao => infracao.viajante, { nullable: true })
  infracoes: Infracao[];
}