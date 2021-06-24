import { Observable, Observer } from "rxjs";
import { constants } from "../../constants";
import { loaderObservable, logoutSubscriber } from "../subscriber";
const requestMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
}

const fetchCall = (
  url,
  method,
  data = {},
  header,
  isFormData = false,
  isLocalCall = false
) => {
  let options = {
    method: method,
    mode: "cors",
    headers: {},
  };
 
  return Observable.create((observer) => {
    try {
      loaderObservable.next(true);
      const finalUrl = isLocalCall ? url : url;
      fetch(finalUrl, options)
          .then((res) => {
          return res.json();
          
        })
        .then((body) => {
          observer.next(body);
              observer.complete();
        })
        .catch((err) => {
          observer.error(err);
          loaderObservable.next(false);
        });
    } catch (error) {
      loaderObservable.error(false);
      observer.error(error);
    }
  });
};

export { fetchCall, requestMethod };
