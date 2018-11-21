const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    author: 'Mosh',
    tags: ['node', 'frontend'],
    isPublished: true
  });

  const result = await course.save();
  console.log(result);
}

// createCourse();

async function getCourses() {
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  const courses = await Course
    // .find({ author: 'Mosh', isPublished: true })
    // .find({ price: 10 })
    // .find({ price: { $gt: 10 } })
    // .find({ price: { $gt: 10, $lte: 20 } })
    // .find({ price: { $eq: 10, $eq: 15, $eq: 20 } })  -> my idea, is it the same with $in ?
    .find({ price: { $in: [10, 15, 20] } })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

getCourses();
