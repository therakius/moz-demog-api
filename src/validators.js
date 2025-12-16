import { make_response } from "../utils.js";

export function validateCountryFields(req) {
  let errors = {};

  let year = req.query.year;
 let message = "invalid input parameters"
  try {
    if (year) {
      if (isNaN(year)) {
        Object.assign(errors, { year: "'year' must be a numeric value." })
        return make_response(
          false,
          400,
          message,
          errors,
          {}
        );
      }

      console.log(Number(year))

      if (Number(year) < 2017 || Number(year) > 2026) {
        Object.assign(errors, {
            "year": "Year range is only between 2017 and 2026."
        })
        return make_response(false, 400, message, errors, {})
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
