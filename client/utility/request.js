// @flow

type Resolve = (data : any) => void;

type Reject = (arg : { error : string }) => void;

export const withPromiseCallback = (resolve : Resolve, reject : Reject) =>
(error : Error, response : Response) => {
  if (error) {
    const StatusUnauthorized = 401;

    if (error.status === StatusUnauthorized) {
      document.location.href = "/";
    } else {
      reject({ error: error.message });
    }
  } else {
    resolve(response.body);
  }
};
