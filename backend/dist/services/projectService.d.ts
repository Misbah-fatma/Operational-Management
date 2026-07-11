import { IProject, IMilestone, IProjectPlanningItem, IProjectProgress, IProjectAssignment, IProjectDocument, IProjectFinancial, IProjectTeam } from '../models';
import { PaginationOptions, PaginatedResult } from '../utils/pagination';
export interface ProjectFilters {
    search?: string;
    status?: string;
    client?: string;
    projectManager?: string;
    startDateFrom?: string;
    startDateTo?: string;
    isArchived?: boolean;
}
export interface CreateProjectInput {
    name: string;
    code?: string;
    client?: string;
    contractNumber?: string;
    contractValue?: number;
    description?: string;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    sla?: string;
    status?: IProject['status'];
    projectManager?: string;
    remarks?: string;
    createdBy: string;
}
export declare class ProjectService {
    private projectPopulate;
    private buildFilter;
    getAll(filters: ProjectFilters, pagination: PaginationOptions): Promise<PaginatedResult<IProject>>;
    getById(id: string): Promise<IProject>;
    getDetail(id: string): Promise<{
        project: IProject;
        team: (import("mongoose").Document<unknown, {}, IProjectTeam, {}, import("mongoose").DefaultSchemaOptions> & IProjectTeam & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        milestones: (import("mongoose").Document<unknown, {}, IMilestone, {}, import("mongoose").DefaultSchemaOptions> & IMilestone & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        planning: (import("mongoose").Document<unknown, {}, IProjectPlanningItem, {}, import("mongoose").DefaultSchemaOptions> & IProjectPlanningItem & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        assignments: (import("mongoose").Document<unknown, {}, IProjectAssignment, {}, import("mongoose").DefaultSchemaOptions> & IProjectAssignment & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        progress: (import("mongoose").Document<unknown, {}, IProjectProgress, {}, import("mongoose").DefaultSchemaOptions> & IProjectProgress & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        documents: (import("mongoose").Document<unknown, {}, IProjectDocument, {}, import("mongoose").DefaultSchemaOptions> & IProjectDocument & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        financial: (import("mongoose").Document<unknown, {}, IProjectFinancial, {}, import("mongoose").DefaultSchemaOptions> & IProjectFinancial & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    create(input: CreateProjectInput): Promise<IProject>;
    update(id: string, input: Partial<CreateProjectInput>, updatedBy: string): Promise<IProject>;
    softDelete(id: string, deletedBy: string): Promise<void>;
    archive(id: string, updatedBy: string): Promise<IProject>;
    duplicate(id: string, createdBy: string): Promise<IProject>;
    bulkAction(ids: string[], action: 'delete' | 'archive', userId: string): Promise<number>;
    recalculateProgress(projectId: string): Promise<void>;
    createMilestone(projectId: string, data: Partial<IMilestone>, userId: string): Promise<import("mongoose").Document<unknown, {}, IMilestone, {}, import("mongoose").DefaultSchemaOptions> & IMilestone & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateMilestone(projectId: string, milestoneId: string, data: Partial<IMilestone>, userId: string): Promise<import("mongoose").Document<unknown, {}, IMilestone, {}, import("mongoose").DefaultSchemaOptions> & IMilestone & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteMilestone(projectId: string, milestoneId: string, userId: string): Promise<void>;
    createPlanningItem(projectId: string, data: Partial<IProjectPlanningItem>, userId: string): Promise<import("mongoose").Document<unknown, {}, IProjectPlanningItem, {}, import("mongoose").DefaultSchemaOptions> & IProjectPlanningItem & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updatePlanningItem(projectId: string, itemId: string, data: Partial<IProjectPlanningItem>, userId: string): Promise<import("mongoose").Document<unknown, {}, IProjectPlanningItem, {}, import("mongoose").DefaultSchemaOptions> & IProjectPlanningItem & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deletePlanningItem(projectId: string, itemId: string, userId: string): Promise<void>;
    checkResourceConflict(resourceType: string, resourceId: string, excludeAssignmentId?: string): Promise<(import("mongoose").Document<unknown, {}, IProjectAssignment, {}, import("mongoose").DefaultSchemaOptions> & IProjectAssignment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    createAssignment(projectId: string, data: Partial<IProjectAssignment>, userId: string): Promise<import("mongoose").PopulateDocumentResult<import("mongoose").Document<unknown, {}, IProjectAssignment, {}, import("mongoose").DefaultSchemaOptions> & IProjectAssignment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, IProjectAssignment, IProjectAssignment>>;
    releaseAssignment(projectId: string, assignmentId: string, userId: string, releaseDate?: Date): Promise<import("mongoose").Document<unknown, {}, IProjectAssignment, {}, import("mongoose").DefaultSchemaOptions> & IProjectAssignment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getResourceAllocations(filters: ProjectFilters, pagination: PaginationOptions): Promise<{
        data: (import("mongoose").Document<unknown, {}, IProjectAssignment, {}, import("mongoose").DefaultSchemaOptions> & IProjectAssignment & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    createProgress(projectId: string, data: Partial<IProjectProgress>, userId: string, files?: Express.Multer.File[]): Promise<import("mongoose").PopulateDocumentResult<import("mongoose").Document<unknown, {}, IProjectProgress, {}, import("mongoose").DefaultSchemaOptions> & IProjectProgress & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, IProjectProgress, IProjectProgress>>;
    createDocument(projectId: string, data: {
        category: IProjectDocument['category'];
        fileName: string;
        version?: string;
        notes?: string;
    }, file: Express.Multer.File, userId: string): Promise<import("mongoose").Document<unknown, {}, IProjectDocument, {}, import("mongoose").DefaultSchemaOptions> & IProjectDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    replaceDocument(projectId: string, docId: string, file: Express.Multer.File, version: string, userId: string): Promise<import("mongoose").Document<unknown, {}, IProjectDocument, {}, import("mongoose").DefaultSchemaOptions> & IProjectDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteDocument(projectId: string, docId: string, userId: string): Promise<void>;
    updateFinancials(projectId: string, data: Partial<IProjectFinancial>, userId: string): Promise<import("mongoose").Document<unknown, {}, IProjectFinancial, {}, import("mongoose").DefaultSchemaOptions> & IProjectFinancial & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getFinancialSummary(financial: IProjectFinancial | null, project: IProject): {
        budget: number;
        actualCost: number;
        budgetUsedPercent: number;
        remainingBudget: number;
        costVariance: number;
        outstandingPayments: number;
        invoices: import("../models/ProjectFinancial").IInvoiceItem[];
    };
    addTeamMember(projectId: string, data: Partial<IProjectTeam>, userId: string): Promise<import("mongoose").PopulateDocumentResult<import("mongoose").Document<unknown, {}, IProjectTeam, {}, import("mongoose").DefaultSchemaOptions> & IProjectTeam & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, IProjectTeam, IProjectTeam>>;
    removeTeamMember(projectId: string, teamId: string, userId: string): Promise<void>;
    getDashboardStats(): Promise<{
        total: number;
        active: number;
        proposalStage: number;
        planningStage: number;
        pendingExecution: number;
        completed: number;
        delayed: number;
        overallProgress: number;
        byStatus: {
            status: any;
            count: any;
        }[];
        resourceAllocation: {
            resourceType: any;
            count: any;
        }[];
        manpowerUtilization: number;
        vehicleAllocation: number;
        monthlyProgress: {
            month: any;
            avgProgress: number;
            count: any;
        }[];
        timeline: (import("mongoose").Document<unknown, {}, IProject, {}, import("mongoose").DefaultSchemaOptions> & IProject & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        totals: {
            employees: number;
            vehicles: number;
            equipment: number;
        };
        activeAssignments: number;
    }>;
    getExportData(filters: ProjectFilters): Promise<(import("mongoose").Document<unknown, {}, IProject, {}, import("mongoose").DefaultSchemaOptions> & IProject & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
export declare const projectService: ProjectService;
//# sourceMappingURL=projectService.d.ts.map