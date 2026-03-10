import * as admin from "firebase-admin";

admin.initializeApp();

export { generateJob, optimizeField, scoreJob, detectBias } from "./ai/index";
