import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as db from "../lib/azure-cosmosdb-mongodb";

//This the function responsible for handling DB operations. It has an inbound http trigger in the function.json.
//Operation implementation is in the lib-folder.

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    let response = null;

    // create 1 db connection for all functions
    await db.init();
    context.log("DB API " + process.env["WEBSITE_SITE_NAME"] + " triggered with req: ", req);

    switch (req.method) {
      case "GET":
          //Frontend calls directly this method and updates itself.
          // allows empty query to return all items
          const dbQuery =
            req?.query?.dbQuery || (req?.body && req?.body?.dbQuery);
          response = {
            documentResponse: await db.findItems(dbQuery),
          };
        
        break;
      case "POST":
        //Not currently used.
        if (req?.body?.document) {
          const insertOneResponse = await db.addItem(req?.body?.document);
          response = {
            documentResponse: insertOneResponse,
          };
        } else {
          throw Error("No document found");
        }

        break;
      case "DELETE":
        //Not used, but would be handy!
        if (req?.query?.id || (req?.body && req?.body?.id)) {
          response = {
            documentResponse: await db.deleteItemById(req?.body?.id),
          };
        } else {
          throw Error("No id found");
        }

        break;
      case "PUT":
        //Update database
        context.log("Entering DB PUT with");
        if (req.body.mySbMsg.amount) {
            context.log("Updating with amount:" + req.body.mySbMsg.amount);
            const updateItemSaldo = await db.updateItemSaldo(req.body.mySbMsg);
            response = {
                documentResponse: updateItemSaldo,
              };
        } else if (req.body.mySbMsg.ean) {
          context.log("Updating with ean:" + req.body.mySbMsg.ean);
          response = {
            documentResponse: await db.findItemByEan(req.body.mySbMsg.ean),
          };
        }  else {
              throw Error("No document found");
        }
        break;
      default:
        throw Error(`${req.method} not allowed`)
    }

    context.res = {
      body: response,
    };
  } catch (err) {
    context.log(`*** Error throw: ${JSON.stringify(err)}`);

    context.res = {
      status: 500,
      body: err,
    };
  }
};

export default httpTrigger;