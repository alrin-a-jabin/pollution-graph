import { BehaviorSubject } from "rxjs";
const loaderObservable = new BehaviorSubject(false);
const logoutSubscriber = new BehaviorSubject(false);

export { loaderObservable, logoutSubscriber };
