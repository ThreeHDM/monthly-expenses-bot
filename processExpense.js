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
    otro: "otros",
    auto: "gastos auto",
    sal: "salidas",
    viat: "viaticos",
    mant: "mantenimiento",
  };

  return stores[key.substring(1)];
};

const getCurrentMonthTotal = async (spreadsheetId, range) => {
  const gsapi = google.sheets({ version: "v4", auth: client });

  const monthRowArray = {
    january: "B",
    february: "C",
    march: "D",
    april: "E",
    may: "F",
    june: "G",
    july: "H",
    august: "I",
    september: "J",
    october: "K",
    november: "L",
    december: "M",
  }

  const month = dayjs().format("MMMM").toLowerCase();
  const row = monthRowArray[month];

  const request = {
    spreadsheetId,
    range: `gastosMensuales!${row}14`
  };

  try {
    const response = await gsapi.spreadsheets.values.get(request);
    const values = response.data.values;
    const total = values.reduce((acc, curr) => {
      return acc + parseFloat(curr[2]);
    }, 0);

    return total;
  } catch (err) {
    console.error(err);
  }
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

  const total = getCurrentMonthTotal(process.env.SPREADSHEET_ID, "gastosMensuales!B14");

  ctx.reply(
    `Número ingresado: ${amount} para rubro: ${storeName} en fecha ${now}. Total del mes: ${total}`
  );
};

module.exports = processExpense;
