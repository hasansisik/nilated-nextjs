// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import blogReducer from "./reducers/blogReducer";
import serviceReducer from "./reducers/serviceReducer";
import hizmetReducer from "./reducers/hizmetReducer";
import headerReducer from "./reducers/headerReducer";
import footerReducer from "./reducers/footerReducer";
import heroReducer from "./reducers/heroReducer";
import featuresReducer from "./reducers/featuresReducer";
import { ctaReducer } from './reducers/ctaReducer';
import faqReducer from './reducers/faqReducer';
import otherReducer from './reducers/otherReducer';
import generalReducer from "./reducers/generalReducer";
import contactFormReducer from "./reducers/contactFormReducer";
import pageReducer from "./reducers/pageReducer";
import kalpReducer from "./reducers/kalpReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    blog: blogReducer,
    service: serviceReducer,
    hizmet: hizmetReducer,
    header: headerReducer,
    footer: footerReducer,
    hero: heroReducer,
    features: featuresReducer,
    cta: ctaReducer,
    faq: faqReducer,
    other: otherReducer,
    general: generalReducer,
    contactForm: contactFormReducer,
    page: pageReducer,
    kalp: kalpReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
