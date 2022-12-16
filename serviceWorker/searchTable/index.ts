import { AzureFunction, Context } from "@azure/functions"
import { TableClient } from '@azure/data-tables';

const tableSearch: AzureFunction = async function (context: Context, data: any): Promise<void> {
    context.log(typeof data);
    context.log(data);

    const tableClient = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, "state");
    
    let result = await tableClient.getEntity("state", data)
      .catch((error) => {
        console.log("error", error);
      });
      console.log("found", result)

    if (!result) {
      return console.log("yes")
    }
    return console.log("no")
};

export default tableSearch;
