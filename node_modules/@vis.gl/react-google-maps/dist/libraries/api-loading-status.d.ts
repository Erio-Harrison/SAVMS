export declare const APILoadingStatus: {
    NOT_LOADED: string;
    LOADING: string;
    LOADED: string;
    FAILED: string;
    AUTH_FAILURE: string;
};
export type APILoadingStatus = (typeof APILoadingStatus)[keyof typeof APILoadingStatus];
