import mongoose, { Document, Schema, Types } from 'mongoose';

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

const invoiceSchema = new Schema<IInvoiceItem>(
  {
    invoiceNumber: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    notes: { type: String, trim: true },
  },
  { _id: true },
);

const financialSchema = new Schema<IProjectFinancial>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
    budget: { type: Number, default: 0, min: 0 },
    actualCost: { type: Number, default: 0, min: 0 },
    invoices: [invoiceSchema],
    outstandingPayments: { type: Number, default: 0, min: 0 },
    remarks: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const ProjectFinancial = mongoose.model<IProjectFinancial>(
  'ProjectFinancial',
  financialSchema,
);
