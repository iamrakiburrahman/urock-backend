export type ICreateAccount = {
     name: string;
     email: string;
     otp: number;
};

export type IResetPassword = {
     email: string;
     otp: number;
};
export interface IResetPasswordByEmail {
     email: string;
     resetUrl: string;
}
export interface IHelpContact {
     name: string;
     email: string;
     phone?: string;
     read?: boolean;
     message: string;
}
export type IContact = {
     name: string;
     email: string;
     subject: string;
     message: string;
};
export interface IHelpReplay {
     name: string;
     email: string;
     message: string;
}
export type IBlockAccount = {
     name: string;
     email: string;
};
export type ICampaignPaymentSuccess = {
     email: string;
     name: string;
     campaignName: string;
     amount: number;
     transactionId: string;
     paymentDate: Date;
};
export type ICheckoutExpired = {
     email: string;
     name: string;
     campaignName: string;
     expiredDate: string;
};
export type ICampaignPaymentFailed = {
     email: string;
     name: string;
     campaignName: string;
     failedDate: Date;
     reason?: string;
};
