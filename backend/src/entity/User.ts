import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ShortUrl } from "./ShortUrl";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @OneToMany(() => ShortUrl, url => url.user)
  urls!: ShortUrl[]; 
}
