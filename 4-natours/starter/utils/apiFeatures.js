module.exports = class APIFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    const filterStr = JSON.stringify(this.queryObject).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    const filterObj = JSON.parse(filterStr);

    const excludedFields = ['sort', 'fields', 'page', 'limit'];
    excludedFields.forEach(e => delete filterObj[e]);

    this.query = this.query.find(filterObj);

    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.replace(/,/g, ' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt _id');
    }

    return this;
  }

  limitFields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.replace(/,/g, ' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = +this.queryObject.page || 1;
    const limit = +this.queryObject.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
};
