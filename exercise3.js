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

// my mistake, compared to mosh solution:
// @line-26, salah tangkap:
//    mosh means: ("published") and ( "price >= $15" or "name = *by*" )
//    herri tangkapnya: ("published" and "price >= $15") or ("name = *by*")

async function getCourses() {
  return await Course.find()
    .or([{ isPublished: true, price: { $gte: 15 } }, { name: /.*by.*/i }])
    .sort('-price')
    .select('name author price');
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
