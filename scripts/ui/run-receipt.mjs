import fs from 'node:fs';
import path from 'node:path';

// A failed browser bootstrap may leave an older detailed report on disk.
export function writeInvocationReceipt({repo,mode,space,baseUrl,startedAt,result}) {
    const receipt={scope:'CLI invocation only; detailed test report must start at or after startedAt',mode,space,baseUrl,startedAt,finishedAt:new Date().toISOString(),processExitCode:result.status??1,signal:result.signal??null,error:result.error?.message??null};
    const out=path.join(repo,'docs/ui-system/runs/latest');
    fs.mkdirSync(out,{recursive:true});
    fs.writeFileSync(path.join(out,`${mode}-invocation.json`),JSON.stringify(receipt,null,2)+'\n');
    return receipt;
}
