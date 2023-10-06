import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    DefaultScope,
    PrimaryKey,
    HasMany
} from 'sequelize-typescript';

import { Container } from './index.js';

@DefaultScope({
    include: [
        { model: (): typeof Container => Container }
    ]
})
@Table({
    paranoid: true
})
export default class Page extends Model {
    @PrimaryKey
    @Column(DataType.TEXT)
    public slug: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    public toc: boolean;

    @Default(0.5)
    @Column(DataType.NUMBER)
    public priority: number;

    @Default('')
    @Column(DataType.TEXT)
    public description: string;

    @Default('')
    @Column(DataType.TEXT)
    public title: string;

    @HasMany(() => Container)
    public containers: Container[];
}
