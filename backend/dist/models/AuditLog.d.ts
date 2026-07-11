import mongoose, { Document, Types } from 'mongoose';
export interface IAuditLog extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    action: string;
    entity: string;
    entityId?: Types.ObjectId;
    changes?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
}
export declare const AuditLog: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, mongoose.DefaultSchemaOptions> & IAuditLog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAuditLog>;
//# sourceMappingURL=AuditLog.d.ts.map