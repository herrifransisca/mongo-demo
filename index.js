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
  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course.find({ author: 'Mosh', isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

getCourses();

async function updateCourse(id) {
  /*
   2 approaches:
  
    #1 - Approach: Query first
         findById()
         modify its properties
         save()
    
    #2 - Approach: Update first
         update directly
         optionally: get the updated document
  */

  // #1 - Approach: Query first
  const course = await Course.findById(id);
  if (!course) return;

  // two approaches and both of it is the same.
  // #A
  course.isPublished = true;
  course.author = 'Another Author';

  // #B
  // course.set({
  //   isPublished: true,
  //   author: 'Another Author'
  // });

  const result = await course.save();
  console.log(result);
}

updateCourse('5bf4f9270a56a7033b58bab8');
