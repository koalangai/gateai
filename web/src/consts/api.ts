import {Configuration, DefaultApi} from "../generated-api";

export default new DefaultApi(new Configuration({
    basePath: "http://127.0.0.1:8000"
}));