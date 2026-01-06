import { Schema, model } from 'mongoose';

export interface IPayoutTransaction {
    _id?: string;
    campaignId: Schema.Types.ObjectId;
    submissionId: Schema.Types.ObjectId;
    influencerId: Schema.Types.ObjectId;
    brandId: Schema.Types.ObjectId; // Campaign creator
    
    // Platform & Content Info
    platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook';
    contentType: 'UGC' | 'Clipping';
    
    // Metrics at time of payout
    metrics: {
        views: number;
        likes: number;
        comments: number;
        shares: number;
        engagementRate: number;
    };
    
    // Payment Details
    payoutAmount: number; // Base payout from view calculation
    bonusAmount: number; // Flat price or other bonuses
    totalPayout: number; // payoutAmount + bonusAmount
    currency: string;
    
    // Calculation Details
    calculationDetails: {
        rewardRate: number;
        perViews: number;
        actualViews: number;
        formula: string; // e.g., "(2500 / 1000) * 10 = 25"
    };
    
    // Transaction Info
    transactionType: 'submission_payout' | 'bonus' | 'refund' | 'adjustment';
    paymentMethod?: string;
    paymentReference?: string;
    
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    paidAt?: Date;
    
    // Metadata
    notes?: string;
    isFirstSubmission: boolean; // For flat price bonus tracking
    
    createdAt?: Date;
    updatedAt?: Date;
}