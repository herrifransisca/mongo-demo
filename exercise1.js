// load the mongoose module
// connect to the new mongodb database
// create a schema to define the shape of documents in courses collection
// write a query

// my mistakes: (compare to mosh solution1)
// 1. @line-16, not using 'new operator' ( but it works, have no idea )
// 2. @line-14, not using: () => console.log() ( but it works, have no idea )
// 3. @line-19, not ordered like mosh. prefer mosh's, because easy to read
// 4. @line-36, it's not the job of the function, to console.log the result


const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/mongo-exercises')
  .then((console.log('Connected to MongoDB...'))
  .catch(err => console.error('Cannot connect to MongoDB...', err));

const courseSchema = mongoose.Schema({
  tags: [String],
  date: { type: Date, default: Date.now },
  name: String,
  author: String,
  isPublished: Boolean,
  price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
  const courses = await Course.find({ tags: 'backend', isPublished: true })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });

  console.log(courses);
}

getCourses();
