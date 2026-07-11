import mongoose, { Document, Schema, Types } from 'mongoose';
import { PROJECT_PLANNING_TYPES } from '../constants';

export interface IProjectPlanningItem extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  type: (typeof PROJECT_PLANNING_TYPES)[number];
  name: string;
  description?: string;
  plannedDate?: Date;
  actualDate?: Date;
  status: string;
  progressPercent: number;
  parentId?: Types.ObjectId;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const planningItemSchema = new Schema<IProjectPlanningItem>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    type: { type: String, enum: PROJECT_PLANNING_TYPES, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    plannedDate: { type: Date },
    actualDate: { type: Date },
    status: { type: String, default: 'Pending', trim: true },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    parentId: { type: Schema.Types.ObjectId, ref: 'ProjectPlanningItem' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const ProjectPlanningItem = mongoose.model<IProjectPlanningItem>(
  'ProjectPlanningItem',
  planningItemSchema,
);
