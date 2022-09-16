const pagination = ({ ...rest }) => {
  let { page, limit } = rest;

  page = Number(page) || 1;
  limit = Number(limit) || 10;
  let skip = (page - 1) * limit;

  return { skip, limit };
};

module.exports = pagination;
