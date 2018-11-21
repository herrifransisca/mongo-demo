const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = mongoose.Schema({
  name: { type: String, required: true },
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    // name: 'Angular Course',
    author: 'Mosh',
    tags: ['node', 'frontend'],
    isPublished: true,
    price: 15
  });

  try {
    // await course.validate();

    // course.validate(err => {
    //   if (err) {
    //   }
    // });

    const result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
  }
}

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({ author: 'Mosh', isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

async function updateCourse(id) {
  const result = await Course.update(
    { _id: id },
    {
      $set: {
        author: 'Mosh',
        isPublished: false
      }
    }
  );
  console.log(result);

  const courseObjectBeforeUpdateOperation = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Herri',
      isPublished: true
    }
  });
  console.log(courseObjectBeforeUpdateOperation);

  const updatedCourseObject = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: 'Jason',
        isPublished: false
      }
    },
    { new: true }
  );
  console.log(updatedCourseObject);
}

async function removeCourse(id) {
  // await Course.deleteOne({ isPublished: false });
  const result = await Course.deleteOne({ _id: id });
  const result = await Course.deleteMany({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}
createCourse();
// getCourses();
// updateCourse('5bf4f9270a56a7033b58bab8');
// removeCourse('5bf4f9270a56a7033b58bab8');
