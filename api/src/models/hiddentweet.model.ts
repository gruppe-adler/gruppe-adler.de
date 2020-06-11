import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey
} from 'sequelize-typescript';

@Table
export default class HiddenTweet extends Model<HiddenTweet> {
    @PrimaryKey
    @Column(DataType.NUMBER)
    public id: number;
}
