import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'psreepathi',
    password: 'postgres',
    database: 'psreepathi',
    autoLoadEntities: true,
    synchronize: true
}