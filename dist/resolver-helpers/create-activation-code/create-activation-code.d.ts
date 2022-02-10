import dayjs from 'dayjs';
export declare const CreateActivationCode: (params: {
    codeLength: number;
    codeLimit?: {
        value: number;
        unit: dayjs.OpUnitType;
    };
}) => {
    code: string;
    limit: dayjs.Dayjs;
    verified: boolean;
};
