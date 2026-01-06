import { createCacheHelper } from '../../builder/RedisCacheHelper';
import { User } from '../user/user.model';
const userCache = createCacheHelper('user');
export const updatePlatformInUser = async (userId: string, platform: string, action: 'add' | 'remove') => {
     const updateQuery = action === 'add' ? { $addToSet: { connectedPlatforms: platform.toLowerCase() } } : { $pull: { connectedPlatforms: platform.toLowerCase() } };

     await User.findByIdAndUpdate(userId, updateQuery);
     await userCache.clearAfterUpdate(userId);
};
