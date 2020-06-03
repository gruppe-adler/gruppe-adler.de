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

import { Container } from '.';

@DefaultScope({
    include: [
        { model: (): typeof Container => Container }
    ]
})
@Table({
    paranoid: true
})
export default class Page extends Model<Page> {
    @PrimaryKey
    @Column(DataType.TEXT)
    public slug: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    public toc: boolean;

    @HasMany(() => Container)
    public containers: Container[];
}
