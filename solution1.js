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

async function getCourses() {
  return await Course.find({ isPublished: true, tags: 'backend' })
    .sort('name')
    .select('name author'); // it's the same with: .select({ name: 1, author: 1 });
  // .select('-name -author'); // it works
  // .select('-name'); // it works
  // .select('-name author'); // error: Projection cannot have a mix of inclusion and exclusion.
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
