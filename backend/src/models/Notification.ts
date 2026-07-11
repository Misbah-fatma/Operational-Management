import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  message: string;
  type: 'certificate_expiry' | 'vehicle_insurance' | 'vehicle_mvpi' | 'vehicle_service' | 'vehicle_return' | 'system' | 'general';
  relatedEntity?: {
    entityType: 'Certificate' | 'Vehicle' | 'VehicleAssignment' | 'VehicleMaintenance';
    entityId: Types.ObjectId;
  };
  isRead: boolean;
  readAt?: Date;
  metadata?: Record<string, unknown>;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        'certificate_expiry',
        'vehicle_insurance',
        'vehicle_mvpi',
        'vehicle_service',
        'vehicle_return',
        'system',
        'general',
      ],
      default: 'general',
    },
    relatedEntity: {
      entityType: {
        type: String,
        enum: ['Certificate', 'Vehicle', 'VehicleAssignment', 'VehicleMaintenance'],
      },
      entityId: { type: Schema.Types.ObjectId },
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
