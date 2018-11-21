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
  // #2 - Approach: Update first
  // update multiple documents in one go
  // const course = await Course.update({ isPublished: false });

  // update a course with particular id
  // returns / what we get here -> the result of the update operation, not the course object
  const result = await Course.update(
    { _id: id },
    {
      // mongodb update operators
      $set: {
        author: 'Mosh',
        isPublished: false
      }
    }
  );
  console.log(result); // { n: 1, nModified: 1, ok: 1 }

  // get the document that was updated
  // returns / what we get here -> the course object -> ORIGINAL DOCUMENT / the document before the update operation
  //                                                    (the author is still 'Mosh', not 'Herri')
  const courseObjectBeforeUpdateOperation = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Herri',
      isPublished: true
    }
  });
  console.log(courseObjectBeforeUpdateOperation); // { ..., author: 'Mosh', isPublished: false, ... }

  // returns / get the updated document
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
  console.log(updatedCourseObject); // { ..., author: 'Jason', isPublished: false, ... }
}

updateCourse('5bf4f9270a56a7033b58bab8');

async function removeCourse(id) {
  // find the first one and delete that (the first document it found that isPublished = false)
  await Course.deleteOne({ isPublished: false });

  const result = await Course.deleteOne({ _id: id });
  console.log(result); // { n: 1, ok: 1 }

  // delete multiple documents
  // returns the result object that shows us the number of documents that were deleted
  const result = await Course.deleteMany({ _id: id });
  console.log(result); // { n: 1, ok: 1 }

  // get the document that was deleted
  // if we don't have a course with the given id, this method will return "null"
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

removeCourse('5bf4f9270a56a7033b58bab8');
