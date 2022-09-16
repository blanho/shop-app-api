const Product = require("../models/Product");
const pagination = require("./pagination");

const searchSortFilterProduct = ({ ...rest }) => {
  let { featured, productName, sort, fields, page, limit, numericFilters } =
    rest;
  const paginate = pagination({ page, limit });

  let queryObject = {};
  // search
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (productName) {
    queryObject.productName = { $regex: productName, $options: "i" };
  }
  // filter
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(regEx, (match) => {
      return `-${operatorMap[match]}-`;
    });

    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);

  // sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  }
  // select fields
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  // pagination
  result.skip(paginate.skip).limit(paginate.limit);

  return result;
};

module.exports = searchSortFilterProduct;
