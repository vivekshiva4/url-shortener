import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class ShortUrl {
  @PrimaryColumn()
  slug!: string;

  @Column()
  originalUrl!: string;

  @Column({ default: 0 })
  visits: number = 0;

  @ManyToOne(() => User, user => user.urls, { nullable: true })
  user?: User;
}
