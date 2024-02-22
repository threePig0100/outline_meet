import auth from "@server/middlewares/authentication";
import pagination from "@server/routes/api/middlewares/pagination";
import {rateLimiter} from "@server/middlewares/rateLimiter";
import {RateLimiterStrategy} from "@server/utils/RateLimiter";
import validate from "@server/middlewares/validate";
import * as T from "@server/routes/api/documents/schema";
import {APIContext} from "@server/types";
import {getTeamFromContext} from "@server/utils/passport";
import documentLoader from "@server/commands/documentLoader";
import {AuthenticationError, InvalidRequestError} from "@server/errors";
import invariant from "invariant";
import SearchHelper from "@server/models/helpers/SearchHelper";
import {Collection, SearchQuery} from "@server/models";
import {authorize} from "@server/policies";
import {presentDocument, presentPolicies} from "@server/presenters";
import router from "@server/routes/api/documents";

router.post(
    "rooms.create",
    auth({ optional: true }),
    pagination(),
    rateLimiter(RateLimiterStrategy.OneHundredPerMinute),
    validate(T.DocumentsSearchSchema),
    async () => {
        console.log('rooms.create')
    }
);