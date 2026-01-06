import QueryBuilder from '../../builder/QueryBuilder';
import { PartnerRelation } from './partner.model';

const getAllPartners = async (query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(PartnerRelation.find({ status: 'trusted' }), query);
     const result = await queryBuilder.fields().filter().paginate().sort().modelQuery.exec();

     const meta = await queryBuilder.countTotal();
     return {
          meta,
          result,
     };
};
const getAllPartnersForPromoter = async (userId: string, query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(PartnerRelation.find({ status: 'trusted', promoterId: userId }), query);
     const result = await queryBuilder.fields().filter().paginate().sort().modelQuery.exec();

     const meta = await queryBuilder.countTotal();
     return {
          meta,
          result,
     };
};
const getAllPartnersForCreator = async (userId: string, query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(PartnerRelation.find({ status: 'trusted', creatorId: userId }), query);
     const result = await queryBuilder.fields().filter().paginate().sort().modelQuery.exec();

     const meta = await queryBuilder.countTotal();
     return {
          meta,
          result,
     };
};
export const PartnerService = {
     getAllPartners,
     getAllPartnersForPromoter,
     getAllPartnersForCreator,
};
