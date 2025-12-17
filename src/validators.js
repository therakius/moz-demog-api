import { make_response } from "../utils.js";
import { provincesQuery } from "./controllers/provincesController.js";

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
    if (!allowedFields.includes(field)) console.log(field);
    Object.assign(errors, { [field]: `field '${field} is not allowed.` }); // uso de compute property name para as chaves dinamicas em objectos
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
      if (regex.test(p_name)) {
        return make_response(false, 400, {
          p_name: "fields must not contain special characters",
        });
      }

      const pExists = await provincesQuery(p_name);

      if (pExists === 0) {
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

export function validateIndicatorsfields(req) {
  const allowedFields = ["p_structure", "d_rate", "p_thousand", "i_mortality"];

  let { fields, y_start, y_end } = req.query;

  let errors = {};

  let message = "invalid input parameters";

  if (fields != null) {
    if (fields.trim() === "") {
      return make_response(false, 400, message, {
        fields: "fields must not be empty.",
      });
    }

    if (regexArray.test(fields)) {
      return make_response(false, 400, message, {
        fields: "fields must not contain special characters.",
      });
    }

    try {
      fields = JSON.parse(fields);

      if (typeof fields != "object") {
        return make_response(false, 400, message, {
          fields: "fields must be an array of strings.",
        });
      }
    } catch (error) {
      return make_response(false, 400, message, {
        fields: "fields must be an array of strings.",
      });
    }

    if (fields.length === 0) {
      return make_response(false, 400, message, {
        fields: "please fill the array with the desired filters.",
      });
    }

    fields.forEach((f) => {
      if (!allowedFields.includes(f)) {
        Object.assign(errors, { fields: `field '${f}' is not allowed.` });
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
