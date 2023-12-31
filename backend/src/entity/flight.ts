import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { FlightUser } from "./flightUser";

@Entity()
export class Flight extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  flightName: string;

  @Column({ type: "varchar", length: 255 })
  departure: string;

  @Column({ type: "varchar", length: 255 })
  destination: string;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "time" })
  time: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FlightUser, (flightUser) => flightUser.flight)
  flightUsers: FlightUser[];
}
