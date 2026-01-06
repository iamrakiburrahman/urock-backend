import mongoose from "mongoose";

export interface IPartner {
     creatorId: mongoose.Schema.Types.ObjectId;
     promoterId: mongoose.Schema.Types.ObjectId;
     status: 'trusted' | 'none';
     trustedAt?: Date;
}
