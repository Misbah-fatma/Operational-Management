import mongoose, { Document, Types } from 'mongoose';
export interface IInvoiceItem {
    invoiceNumber: string;
    amount: number;
    date: Date;
    status: 'Paid' | 'Pending' | 'Overdue';
    notes?: string;
}
export interface IProjectFinancial extends Document {
    _id: Types.ObjectId;
    project: Types.ObjectId;
    budget: number;
    actualCost: number;
    invoices: IInvoiceItem[];
    outstandingPayments: number;
    remarks?: string;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProjectFinancial: mongoose.Model<IProjectFinancial, {}, {}, {}, mongoose.Document<unknown, {}, IProjectFinancial, {}, mongoose.DefaultSchemaOptions> & IProjectFinancial & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProjectFinancial>;
//# sourceMappingURL=ProjectFinancial.d.ts.map