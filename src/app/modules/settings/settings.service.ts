import path from 'path';
import { ISettings } from './settings.interface';
import Settings from './settings.model';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { CACHE_TTL, createCacheHelper } from '../../builder/RedisCacheHelper';
const settingsCache = createCacheHelper('settings');
const upsertSettings = async (data: Partial<ISettings>): Promise<ISettings> => {
     const existingSettings = await Settings.findOne({});
     if (existingSettings) {
          const updatedSettings = await Settings.findOneAndUpdate({}, data, {
               new: true,
          });
          await settingsCache.clearAll();
          return updatedSettings!;
     } else {
          const newSettings = await Settings.create({
               aboutUs: data.aboutUs || '',
               termsOfService: data.termsOfService || '',
               support: data.support || '',
               privacyPolicy: data.privacyPolicy || '',
          });
          if (!newSettings) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to add settings');
          }
          await settingsCache.clearAll();
          return newSettings;
     }
};
const getSettings = async (key: string) => {
     return await settingsCache.wrapSingle(
          key,
          async () => {
               const settings: any = await Settings.findOne();
               if (!settings) {
                    await Settings.create({
                         termsOfService: '',
                         privacyPolicy: '',
                         support: '',
                         aboutUs: ''
                    });
               }
               if (key) {
                    if (settings[key] !== undefined) {
                         return settings[key];
                    }
                    return '';
               }
               return settings || {};
          },
          CACHE_TTL.VERY_LONG,
     );
};
const getTermsOfService = async () => {
     const settings: any = await Settings.findOne();
     if (!settings) {
          return '';
     }
     return settings.termsOfService;
};
const getSupport = async () => {
     const settings: any = await Settings.findOne();

     if (!settings) {
          return '';
     }
     return settings.support;
};
const getPrivacyPolicy = async () => {
     const settings: any = await Settings.findOne();

     if (!settings) {
          return '';
     }
     return settings.privacyPolicy;
};
const getAboutUs = async () => {
     const settings: any = await Settings.findOne();

     if (!settings) {
          return '';
     }
     return settings.aboutUs;
};

// const getPrivacyPolicy = async () => {
//   return path.join(__dirname, '..', 'htmlResponse', 'privacyPolicy.html');
// };

const getAccountDelete = async () => {
     return path.join(__dirname, '..', 'htmlResponse', 'accountDelete.html');
};

// const getSupport = async () => {
//   return path.join(__dirname, '..', 'htmlResponse', 'support.html');
// };
export const settingsService = {
     upsertSettings,
     getSettings,
     getPrivacyPolicy,
     getAccountDelete,
     getSupport,
     getTermsOfService,
     getAboutUs,
};
