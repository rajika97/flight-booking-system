import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user";
import { Flight } from "./flight";

@Entity()
export class FlightUser extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  flightId: string;

  @Column({ type: "varchar" })
  userId: string;

  @ManyToOne(() => Flight, (flight) => flight.flightUsers)
  flight: Flight;

  @ManyToOne(() => User, (user) => user.flightUsers)
  user: User;

  @Column({ type: "int" })
  numberOfSeats: number;

  @Column({ type: "int", nullable: true })
  cost: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
