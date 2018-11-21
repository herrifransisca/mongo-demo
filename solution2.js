const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/mongo-exercises')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.err('Failed to connect to MongoDB...', err));

const courseSchema = mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  isPublished: Boolean,
  price: Number
});

const Course = mongoose.model('Course', courseSchema);

// get all the published frontend and backend courses,
// sort them by their price in a descending order,
// pick only their name and author,
// and display them.

async function getCourses() {
  // there are 2 ways:

  // use "in operator"
  return await Course.find({
    isPublished: true,
    tags: { $in: ['frontend', 'backend'] }
  })
    .sort('-price')
    .select('name author price');

  // use "or operator"
  // return await Course.find({ isPublished: true })
  //   .or([{ tags: 'backend' }, { tags: 'frontend' }])
  //   .sort({ price: -1 })
  //   .select({ name: 1, author: 1, price: 1 });
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
