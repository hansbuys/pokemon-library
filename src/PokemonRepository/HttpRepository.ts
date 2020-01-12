import {IRestResponse, RestClient} from "typed-rest-client/RestClient";
import {Logging} from "../Logging";

export class HttpRepository {

    private readonly client: RestClient;
    private readonly logger = Logging.createLogger(HttpRepository);

    public constructor(baseUrl: string) {
        this.client = new RestClient("", baseUrl);
    }

    public get<T>(url: string, queryParams?: ((string[] | (string | number | undefined)[])[])): Promise<IRestResponse<T>> {
        if (queryParams) {
            let resource = url + this.queryParamsToString(queryParams);
            this.logger.info(`Requesting ${resource}`);
            return this.client.get(resource);
        }
        this.logger.info(`Requesting ${url}`);
        return this.client.get(url);
    }

    private queryParamsToString(params: ((string[] | (string | number | undefined)[])[])): string {
        return params.filter(([, value]) => {
            return value !== undefined;
        }).map(([key, value], i) => {
            if (i === 0) {
                return `?${key}=${value}`;
            } else {
                return `&${key}=${value}`;
            }
        }).join("");
    }
}