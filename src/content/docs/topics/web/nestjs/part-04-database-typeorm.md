---
title: "Part 4, Database with TypeORM"
description: "Integrate TypeORM into NestJS: install @nestjs/typeorm, define entities, use the Repository pattern, wire up OneToMany and ManyToOne relations, run migrations, and handle transactions."
parent: nestjs
tags: [nestjs, typescript, nodejs, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Install

```bash
npm install @nestjs/typeorm typeorm pg
# pg is the PostgreSQL driver; swap for mysql2 or better-sqlite3 as needed
```

## Connect TypeORM to NestJS

Register `TypeOrmModule.forRoot()` in the root module. Pass a `DataSource` options object:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: +(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASS ?? 'postgres',
      database: process.env.DB_NAME ?? 'mydb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,    // never true in production; use migrations
    }),
  ],
})
export class AppModule {}
```

**`synchronize: true` drops and recreates columns** to match your entities. Safe for prototyping locally; disastrous in production. Use migrations instead.

## Entities

An entity is a TypeScript class decorated with `@Entity()`. Each property maps to a database column.

```typescript
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

Common column options:

```typescript
@Column({ type: 'varchar', length: 100, nullable: true })
name: string | null;

@Column({ type: 'decimal', precision: 10, scale: 2 })
price: number;

@Column({ type: 'enum', enum: ['draft', 'published', 'archived'], default: 'draft' })
status: string;

@Column({ select: false })   // exclude from SELECT by default (e.g., passwords)
password: string;
```

## Register entities in a feature module

Each feature module calls `TypeOrmModule.forFeature()` to register the entities it needs:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

## The Repository pattern

`TypeOrmModule.forFeature([User])` makes `Repository<User>` injectable via `@InjectRepository`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(dto);   // create instance (doesn't hit DB)
    return this.usersRepo.save(user);           // INSERT or UPDATE
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, attrs);
    return this.usersRepo.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }
}
```

Key repository methods:

| Method | What it does |
| --- | --- |
| `find(options?)` | SELECT with optional where/order/take/skip |
| `findOne(options)` | SELECT ... LIMIT 1; returns null if not found |
| `findOneOrFail(options)` | Same but throws EntityNotFoundError |
| `create(partial)` | Creates a new instance (no DB call) |
| `save(entity)` | INSERT if new, UPDATE if existing (checks for primary key) |
| `update(criteria, partial)` | UPDATE without loading the entity first |
| `delete(criteria)` | DELETE without loading the entity first |
| `remove(entity)` | DELETE after loading the entity |
| `count(options?)` | COUNT(*) |
| `findAndCount(options?)` | find + count in one query (for pagination) |

## Relations

### ManyToOne / OneToMany

A `Post` belongs to one `User`; a `User` has many `Post`s.

```typescript
// post.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;
}

// user.entity.ts
import { OneToMany } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity('users')
export class User {
  // ... other columns

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
```

### ManyToMany

```typescript
// article.entity.ts
import { ManyToMany, JoinTable } from 'typeorm';
import { Tag } from '../tags/tag.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable()   // the owner side declares the join table
  tags: Tag[];
}

// tag.entity.ts
@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];
}
```

### Loading relations

Relations are lazy by default (not fetched unless requested). Use `relations` in find options or a QueryBuilder to load them:

```typescript
// Eager load with find
const posts = await this.postsRepo.find({
  where: { author: { id: userId } },
  relations: { author: true },
});

// QueryBuilder for complex joins
const posts = await this.postsRepo
  .createQueryBuilder('post')
  .leftJoinAndSelect('post.author', 'author')
  .leftJoinAndSelect('post.tags', 'tags')
  .where('author.id = :userId', { userId })
  .orderBy('post.createdAt', 'DESC')
  .take(20)
  .getMany();
```

## Migrations

Migrations are the production-safe way to evolve your schema. Never use `synchronize: true` in production.

Set up a `DataSource` config file for the migration CLI:

```typescript
// data-source.ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: +(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
```

Add npm scripts:

```json
{
  "scripts": {
    "migration:generate": "typeorm-ts-node-commonjs migration:generate -d src/data-source.ts",
    "migration:run": "typeorm-ts-node-commonjs migration:run -d src/data-source.ts",
    "migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/data-source.ts"
  }
}
```

Generate a migration after changing entities:

```bash
npm run migration:generate -- src/migrations/AddPostsTable
npm run migration:run
```

TypeORM diffing is good but not perfect. Always inspect the generated SQL before running.

## Transactions

For operations that must succeed or fail together, use a transaction:

```typescript
import { DataSource } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    @InjectRepository(Inventory) private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async placeOrder(dto: CreateOrderDto): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      // all operations use the transactional manager
      const order = manager.create(Order, dto);
      await manager.save(order);

      await manager.decrement(
        Inventory,
        { productId: dto.productId },
        'quantity',
        dto.quantity,
      );

      return order;
    });
  }
}
```

The callback receives an `EntityManager` scoped to the transaction. If any operation throws, the entire transaction rolls back.

## Soft deletes

TypeORM supports soft deletes via a `deletedAt` column:

```typescript
import { DeleteDateColumn } from 'typeorm';

@Entity('posts')
export class Post {
  // ...

  @DeleteDateColumn()
  deletedAt: Date | null;
}
```

```typescript
await this.postsRepo.softDelete(id);   // sets deletedAt, record stays in DB
await this.postsRepo.restore(id);      // clears deletedAt
await this.postsRepo.findOne({         // withDeleted: true to include soft-deleted
  where: { id },
  withDeleted: true,
});
```

## Gotchas at this stage

- **`save()` runs a SELECT before INSERT**, TypeORM checks if the entity exists by primary key before deciding INSERT vs UPDATE. On high-volume inserts, use `insert()` instead.
- **Lazy relations break serialization**, TypeORM's "lazy" relations return a Promise. `JSON.stringify` on a Promise gives `{}`. Load relations explicitly.
- **N+1 queries in loops**, calling `findOne` inside a loop is the classic N+1. Use `leftJoinAndSelect` or `findByIds` to batch the load.
- **`synchronize` drops columns**, if you rename a column in an entity without a migration, `synchronize: true` drops the old column and creates a new one. Data gone.
- **Transaction isolation**, `dataSource.transaction()` uses the database's default isolation level. For financial operations, set it explicitly: `dataSource.transaction('SERIALIZABLE', async (em) => ...)`.

## What's next

Part 5 adds authentication and authorization: Passport JWT strategy, `AuthGuard`, custom guards, and role-based access control with custom decorators.

## References

- [NestJS, Database](https://docs.nestjs.com/techniques/database)
- [TypeORM documentation](https://typeorm.io/)
- [TypeORM, Migrations](https://typeorm.io/migrations)
- [TypeORM, Relations](https://typeorm.io/relations)
