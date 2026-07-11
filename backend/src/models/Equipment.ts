import mongoose, { Document, Schema, Types } from 'mongoose';

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

const equipmentSchema = new Schema<IEquipment>(
  {
    name: { type: String, required: true, trim: true },
    equipmentId: { type: String, required: true, unique: true, trim: true },
    category: { type: String, trim: true },
    serialNumber: { type: String, trim: true },
    manufacturer: { type: String, trim: true },
    model: { type: String, trim: true },
    location: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Equipment = mongoose.model<IEquipment>('Equipment', equipmentSchema);
