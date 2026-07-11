export declare class ExecutiveDashboardService {
    getStats(): Promise<{
        projects: {
            total: number;
            active: number;
            completed: number;
            delayed: number;
            proposal: number;
            planning: number;
            pendingExecution: number;
            byStatus: {
                status: any;
                count: any;
            }[];
            overallProgress: number;
        };
        employees: {
            total: number;
        };
        vehicles: {
            total: number;
            assigned: number;
            available: number;
            utilization: number;
        };
        certificates: {
            total: number;
            expiringSoon: number;
            expired: number;
            byStatus: {
                status: any;
                count: any;
            }[];
        };
        openRFIs: number;
        openNCRs: number;
        pendingApprovals: number;
        outstandingPayments: any;
        charts: {
            projectStatusDistribution: {
                status: any;
                count: any;
            }[];
            monthlyProjectProgress: {
                month: any;
                progress: number;
            }[];
            manpowerAllocation: {
                role: any;
                count: any;
            }[];
            vehicleUtilization: {
                status: any;
                count: any;
            }[];
            certificateExpiry: {
                label: string;
                count: number;
            }[];
            projectHealth: {
                status: any;
                count: any;
                avgProgress: number;
            }[];
            costVsBudget: {
                name: any;
                code: any;
                budget: any;
                actualCost: any;
                variance: any;
            }[];
            resourceAllocation: {
                resourceType: any;
                count: any;
            }[];
        };
    }>;
}
export declare const executiveDashboardService: ExecutiveDashboardService;
//# sourceMappingURL=executiveDashboardService.d.ts.map