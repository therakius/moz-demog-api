import { make_response } from "../utils.js";
import { provincesQuery } from "./controllers/provincesController.js";

const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

export function validateCountryFields(req) {
  let errors = {};

  let year = req.query.year;
  let message = "invalid input parameters";
  try {
    if (year) {
      if (isNaN(year)) {
        Object.assign(errors, { year: "'year' must be a numeric value." });
        return make_response(false, 400, message, errors, {});
      }

      console.log(Number(year));

      if (Number(year) < 2017 || Number(year) > 2026) {
        Object.assign(errors, {
          year: "Year range is only between 2017 and 2026.",
        });
        return make_response(false, 400, message, errors, {});
      }
    }
  } catch (error) {
    console.log(`error: ${error.message}`);
    return make_response(
      false,
      500,
      "An error ocurred while processing your inputs",
      [],
      {}
    );
  }
}

export async function validatePopulationFields(req) {
  const allowedFields = ["p_thousand", "p_structure"];

  const { field, year, p_name } = req.query;

  const errors = {};

  let message = "invalid input parameters";

  if (field) {
    if (regex.test(field)) {
      return make_response(false, 400, {
        field: "fields must not contain special characters",
      });
    }
    if (!allowedFields.includes(field))
      Object.assign(errors, { [field]: `field ${field} is not allowed` }); // uso de compute property name para as chaves dinamicas em objectos
  }

  if (year) {
    if (isNaN(year)) {
      Object.assign(errors, { year: "'year' must be a numeric value." });
    }

    if (Number(year) && Number(year) != 2023) {
      Object.assign(errors, {
        year: `Only data from 2023 is available for this request`,
      });
    }

    if (p_name) {
      console.log("BEFORE SEARCH: " + p_name);

      if (regex.test(p_name)) {
        return make_response(false, 400, {
          p_name: "fields must not contain special characters",
        });
      }
      
      const pExists = await provincesQuery(p_name);
      console.log("pExists: " + pExists);
      if (pExists === 0) {
        console.log("ITS ZEERO");
        Object.assign(errors, { [p_name]: `Unknown province -- ${p_name}.` });
      }
    }

    console.log(Object.keys(errors).length);
    if (Object.keys(errors).length > 0) {
      console.log(make_response(false, 400, message, errors, {}));
      return make_response(false, 400, message, errors, {});
    }
  }
}
