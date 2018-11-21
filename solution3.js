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

// get all the published courses that are $15 or more,
// or have the word 'by' in their title.

// note:
// /pattern/
// /.*by.*/
// . -> to represent "character"
// * -> to represent "0 or more"

async function getCourses() {
  return await Course.find({ isPublished: true })
    .or([{ price: { $gte: 15 } }, { name: /.*by.*/i }])
    .sort('-price')
    .select('name author price');
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
