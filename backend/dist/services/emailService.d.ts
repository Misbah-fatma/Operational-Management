export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}
export declare const sendEmail: (options: EmailOptions) => Promise<boolean>;
export declare const sendCertificateExpiryEmail: (to: string, certificateName: string, expiryDate: Date, daysRemaining: number) => Promise<boolean>;
export declare const sendVehicleAlertEmail: (to: string, vehicleName: string, alertType: string, dueDate?: Date) => Promise<boolean>;
//# sourceMappingURL=emailService.d.ts.map