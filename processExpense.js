const client = require("./googleClient.js");
const { google } = require("googleapis");
const dayjs = require("dayjs");

const appendDataToSpreadsheet = async (spreadsheetId, range, dataArray) => {
  const gsapi = google.sheets({ version: "v4", auth: client });

  const request = {
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "OVERWRITE",
    resource: { values: dataArray },
  };

  try {
    await gsapi.spreadsheets.values.append(request);    
  } catch (err) {
    console.error(err);
  }
};

const getStoreName = (key) => {
  const stores = {
    ver: "verduleria",
    car: "carniceria",
    super: "supermercado",
    far: "farmacia",
    ropa: "ropa",
    gaso: "gasoil",
  };

  return stores[key.substring(1)];
};

const processExpense = (ctx) => {
  
  const arr = ctx.message.text.split(" "),
        amount = arr[1],
        storeName = getStoreName(arr[0]),
        comment = arr.slice(2).join(" ") || "",
        now = dayjs().format("DD/MM/YYYY");

  if (isNaN(amount)) {
    ctx.reply(`Ingrese un numero válido separando los decimales con un punto`);
    return;
  }


  appendDataToSpreadsheet(process.env.SPREADSHEET_ID, "registro!A2:C", [
    [now, storeName, amount, comment],
  ]);

  ctx.reply(
    `Número ingresado: ${amount} para rubro: ${storeName} en fecha ${now}`
  );
};

module.exports = processExpense;
