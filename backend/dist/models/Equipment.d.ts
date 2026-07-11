import mongoose, { Document, Types } from 'mongoose';
export interface IEquipment extends Omit<Document, 'model'> {
    _id: Types.ObjectId;
    name: string;
    equipmentId: string;
    category?: string;
    serialNumber?: string;
    manufacturer?: string;
    model?: string;
    location?: string;
    isActive: boolean;
    isDeleted: boolean;
}
export declare const Equipment: mongoose.Model<IEquipment, {}, {}, {}, mongoose.Document<unknown, {}, IEquipment, {}, mongoose.DefaultSchemaOptions> & IEquipment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEquipment>;
//# sourceMappingURL=Equipment.d.ts.map