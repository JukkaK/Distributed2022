import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as db from "../lib/azure-cosmosdb-mongodb";

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
          // allows empty query to return all items
          const dbQuery =
            req?.query?.dbQuery || (req?.body && req?.body?.dbQuery);
          response = {
            documentResponse: await db.findItems(dbQuery),
          };
        
        break;
      case "POST":
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
        if (req?.query?.id || (req?.body && req?.body?.id)) {
          response = {
            documentResponse: await db.deleteItemById(req?.body?.id),
          };
        } else {
          throw Error("No id found");
        }

        break;
      case "PUT":
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