import dayjs from "dayjs";

export const CreateActivationCode = (params: {
  codeLength: number;
  codeLimit?: { value: number; unit: dayjs.OpUnitType };
}) => {
  const { codeLength, codeLimit } = params;
  const start = codeLength <= 1 ? 1 : Math.pow(10, codeLength - 1);
  const activationCode = Math.floor(start + Math.random() * 9 * start);
  const activationLimit = dayjs().add(
    codeLimit?.value ?? 1,
    codeLimit?.unit ?? "h"
  );
  return {
    code: activationCode.toString(),
    limit: activationLimit,
    verified: false,
  };
};
