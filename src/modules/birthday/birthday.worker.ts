import { workerData, parentPort } from 'worker_threads';
import { User } from 'src/models/user.model';
import {
  IBirthdayWorkerParam,
  IHookbinPayload,
  IHookbinResponse,
} from './interfaces';
import * as stringFormat from 'string-format';
import Axios from 'axios';

(async () => {
  const { baseUrl, data, messageFormat } = workerData as IBirthdayWorkerParam;

  const userSentIds = await Promise.all(
    data.map(async (user: User) => {
      const hookbinPayload: IHookbinPayload = {
        message: stringFormat(messageFormat, user),
      };
      const { success } = (await Axios.post(baseUrl, { data: hookbinPayload }))
        ?.data as IHookbinResponse;
      return success ? user.id : null;
    }),
  );

  parentPort.postMessage({ data: userSentIds });
})();
