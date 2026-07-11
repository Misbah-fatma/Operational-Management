import mongoose, { Document, Types } from 'mongoose';
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
export declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, mongoose.DefaultSchemaOptions> & INotification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, INotification>;
//# sourceMappingURL=Notification.d.ts.map