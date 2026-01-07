import express from 'express';
import { UserRouter } from '../app/modules/user/user.route';
import { AuthRouter } from '../app/modules/auth/auth.route';
import SettingsRouter from '../app/modules/settings/settings.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { ChatRoutes } from '../app/modules/chat/chat.route';
import { MessageRoutes } from '../app/modules/message/message.route';
import { SliderRouter } from '../app/modules/slider/slider.route';
import { ContactRoutes } from '../app/modules/contact/contact.route';
import { WalletRouter } from '../app/modules/wallet/wallet.route';
import { StripeOnboardingRoutes } from '../app/modules/stripe/stripe.routes';
import { WithdrawalRouter } from '../app/modules/withdrawal/withdrawal.route';
import { ReportRoutes } from '../app/modules/report/report.routes';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { ReviewRoutes } from '../app/modules/review/review.routes';
import { UserManagementsRouter } from '../app/modules/userManagements/userManagements.router';
import { GenreRoutes } from '../app/modules/genre/genre.route';

const router = express.Router();
const routes = [
     {
          path: '/auth',
          route: AuthRouter,
     },
     {
          path: '/users',
          route: UserRouter,
     },
     {
          path: '/settings',
          route: SettingsRouter,
     },

     {
          path: '/categories',
          route: CategoryRoutes,
     },
     {
          path: '/chats',
          route: ChatRoutes,
     },
     {
          path: '/messages',
          route: MessageRoutes,
     },
     {
          path: '/sliders',
          route: SliderRouter,
     },
     {
          path: '/contacts',
          route: ContactRoutes,
     },
     {
          path: '/wallets',
          route: WalletRouter,
     },
     {
          path: '/stripe-onboarding',
          route: StripeOnboardingRoutes,
     },
     {
          path: '/withdrawal',
          route: WithdrawalRouter,
     },
     {
          path: '/reports',
          route: ReportRoutes,
     },
     {
          path: '/faqs',
          route: FaqRoutes,
     },
     {
          path: '/reviews',
          route: ReviewRoutes,
     },
     {
          path: '/user-managements',
          route: UserManagementsRouter,
     },
     {
          path: '/genres',
          route: GenreRoutes,
     }
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
