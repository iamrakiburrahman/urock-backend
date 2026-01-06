import mongoose from 'mongoose';
import { IPartner } from './partner.interface';

const PartnerSchema = new mongoose.Schema<IPartner>({
     creatorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
     },
     promoterId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
     },
     status: {
          type: String,
          enum: ['none', 'trusted'],
          default: 'none',
     },
     trustedAt: {
          type: Date,
     },
});

export const PartnerRelation = mongoose.model<IPartner>('Partner', PartnerSchema);
