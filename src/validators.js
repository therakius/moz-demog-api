import { make_response } from "../utils.js";
import { provincesQuery } from "./controllers/provincesController.js";
import { getUserQuery, validateApiKeyQuery } from "./models/authModel.js";
import { executeSingleRow} from "./controllers/authController.js";
import { comparePasswords } from "../utils.js";

const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
const regexArray = /[!@#$%^&*()\-+={}\:;'<>.?\/|\\]/;
const regexDigits = /\d/;

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

      if (Number(year) < 2017 || Number(year) > 2026) {
        Object.assign(errors, {
          year: "Year range is only between 2017 and 2026.",
        });
        return make_response(false, 400, message, errors, {});
      }
    }
  } catch (error) {
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

  let { field, year, p_name } = req.query;

  const errors = {};

  let message = "invalid input parameters";

  if (field) {
    if (regex.test(field)) {
      return make_response(false, 400, {
        field: "fields must not contain special characters",
      });
    }
    if (!allowedFields.includes(field)) {
      Object.assign(errors, { [field]: `field '${field} is not allowed.` }); // uso de compute property name para as chaves dinamicas em objectos
    }
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
  }

  if (p_name != null) {
    console.log(p_name.toLowerCase());
    p_name = p_name.toLowerCase();
    if (regex.test(p_name)) {
      return make_response(false, 400, {
        p_name: "fields must not contain special characters",
      });
    }

    const pExists = await provincesQuery(p_name);

    if (pExists === 0) {
      Object.assign(errors, { 'p_name': `Unknown province '${p_name}'.` });
    }
  }

  if (Object.keys(errors).length > 0) {
    return make_response(false, 400, message, errors, {});
  }
}

export function validateIndicatorsfields(req) {
  const allowedFields = [
    "p_structure",
    "d_rate",
    "p_thousand",
    "i_mortality",
    "l_expectancy",
  ];

  let { fields, y_start, y_end } = req.query;

  let errors = {};

  let message = "invalid input parameters";

  if (fields != null) {
    
    try {
      if (typeof fields != "object") {
        fields = JSON.parse(fields);
      }

      if (typeof fields == "string" || !Array.isArray(fields)) {
        throw new Error("fields must be an array of strings.");
      }

    } catch (error) {
      return make_response(false, 400, message, {
        fields: "fields must be an array of strings.",
      });
    }

    if (regexArray.test(fields)) {
      return make_response(false, 400, message, {
        fields: "fields must not contain special characters.",
      });
    }

    fields.forEach((f) => {
      if (!allowedFields.includes(f)) {
        Object.assign(errors, { fields: `field '${f}' is not allowed.` });
        console.log(typeof f)
      }

      if (typeof f != "string") {
        Object.assign(errors, { fields: "fields must be an array of strings." });
      }

      if (regex.test(f)) {
        Object.assign(errors, {
          fields: `fields must not contain special characters (${f})`,
        });
      }
    });
  }

  if (y_start != null) {
    errors.y_start ??= [];

    if (y_start.trim() === "") {
      errors.y_start.push("Must not be empty.");
    }

    if (regex.test(y_start)) {
      errors.y_start.push("Must not contain special characters.");
    }

    if (isNaN(y_start)) {
      errors.y_start.push("Must be a numeric value.");
    }

    const year = Number(y_start);
    if (!isNaN(year) && (year < 2017 || year > 2026)) {
      errors.y_start.push("The year range must be 2017 - 2026.");
    }

    if (errors.y_start.length === 0) {
      delete errors.y_start;
    }
  }

  if (y_end != null) {
    errors.y_end ??= [];

    if (y_end.trim() === "") {
      errors.y_end.push("y_end must not be empty.");
    }

    if (regex.test(y_end)) {
      errors.y_end.push("y_start must not contain special characters.");
    }

    if (isNaN(y_end)) {
      errors.y_end.push("y_end must be a numeric value..");
    }

    if (Number(y_end) < 2017 || Number(y_end) > 2026) {
      errors.y_end.push("the year range must be 2017 - 2026.");
    }

    if (errors.y_end.length === 0) {
      delete errors.y_end;
    }
  }

  if (y_start && y_end) {
    if (y_start > y_end) {
      Object.assign(errors, { y_end: "y_start must be greater than y_end" });
    }
  }

  if (Object.keys(errors).length > 0) {
    return make_response(false, 400, message, errors, {});
  }
}

export async function validateprovincesField(req) {
  let errors = {};
  let pExists = null;
  const { p_name } = req.query;
  const message = "Invalid input parameters";

  if (p_name != null) {
    errors.p_name ??= [];

    if (p_name.trim() == "") {
      errors.p_name.push("Must not be empty");
    }

    if (regex.test(p_name)) {
      errors.p_name.push("Must not contain special characters");
    }

    if (regexDigits.test(p_name)) {
      errors.p_name.push("Must not contain digits");
    }

    pExists = await provincesQuery(p_name);

    if (pExists === 0) {
      errors.p_name.push(`Unknown province name ${p_name}`);
    }

    if (errors.p_name.length === 0) {
      delete errors.p_name;
    }
  }

  if (Object.keys(errors).length > 0) {
    return make_response(false, 400, message, errors, {});
  }
}

export function validatePaginationInputs(page, per_page) {
  let errors = {};

  const message = "Invalid input parameters";

  if (page != null) {
    errors.page ??= [];

    if (isNaN(page)) errors.page.push("Must be a numeric value.");

    if (regex.test(page))
      errors.page.push("Must not contain special characters");

    if (Number(page) === 0) errors.page.push("Must be greater than zero");

    if (Number(page) > 50) errors.page.push("Must be less than 50.");

    if (errors.page.length === 0) delete errors.page;
  }

  if (per_page != null) {
    errors.per_page ??= [];

    if (isNaN(per_page)) errors.per_page.push("Must be a numeric value.");

    if (regex.test(per_page))
      errors.per_page.push("Must not contain special characters");

    if (Number(per_page) === 0)
      errors.per_page.push("Must be greater than zero");

    if (Number(per_page) > 50) errors.per_page.push("Must be less than 50.");

    if (errors.per_page.length === 0) delete errors.per_page;
  }

  if (Object.keys(errors).length > 0)
    return make_response(false, 400, message, errors, {});
}


export async function validateUser(email) {
  try {

    const builtQuery = getUserQuery(email)

    const user = await executeSingleRow(builtQuery.query, builtQuery.values)

    if (!user) return false

    // const isValidHash = await comparePasswords(password, user.user_password_hash)

    return {userId: user.user_id}
  
  } catch (error) {
    console.log(error)
  }
}

export async function validateApiKey(apiKey){
  
  const queryValidateKey = validateApiKeyQuery(apiKey)

  const isValidApiKey = await executeSingleRow(queryValidateKey.query, queryValidateKey.values)

  return isValidApiKey
}
