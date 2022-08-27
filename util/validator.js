import xss from "xss";

export default function validator(req, args, isParams = false) {
    let reqData;
    if (!isParams)
        reqData = req.body;
    else
        reqData = req.params;

    const argsLength = args.length;
    if (argsLength % 2 !== 0)
        return "Invalid Arguments, Developer's responsibility";

    for (let i = 0; i < argsLength; i++) {
        if (i % 2 === 0) {
            const data = reqData[`${args[i]}`];
            if ((data === undefined || null) || data.trim() === "") {
                return `Invalid Data: Empty Entry [${args[i]}].`;
            }
            if (!(data.match(args[i + 1]))) {
                return `Invalid Data: Invalid Entry [${args[i]}].`;
            }
            reqData[`${args[i]}`] = xss(data);
        }
    }

    return true;
}