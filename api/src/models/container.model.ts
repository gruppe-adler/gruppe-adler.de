import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    BelongsTo,
    ForeignKey
} from 'sequelize-typescript';

import { Page } from '.';

@Table({
    paranoid: true
})
export default class Container extends Model<Container> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    public id: number;

    @Default('')
    @Column(DataType.TEXT)
    public heading: string;

    @Default('')
    @Column(DataType.TEXT)
    public footer: string;

    @Default('')
    @Column(DataType.TEXT)
    public content: string;

    @Default(null)
    @AllowNull
    @Column(DataType.TEXT)
    public headerColor: string|null;

    @Default(null)
    @AllowNull
    @Column(DataType.TEXT)
    public headerImage: string|null;

    @Default(null)
    @AllowNull
    @Column(DataType.TEXT)
    public pinnedImage: string|null;

    @Default(0)
    @Column(DataType.INTEGER)
    public index: number;

    @ForeignKey(() => Page)
    @Column(DataType.TEXT)
    public pageSlug: string;

    @BelongsTo(() => Page)
    public page: Page[];
}
