const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
    // match: /pattern/
  },
  author: String,
  category: {
    type: String,
    required: true,
    enum: ['web development', 'mobile', 'network'],
    lowercase: true
    // uppercase: true
    // trim: true
  },
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(v, callback) {
        setTimeout(() => {
          // do some async work
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: 'A course should have at least one tag.'
    }
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function() {
      return this.isPublished; // cannot use arrow function here, "this" will refer to something else (the caller)
    },
    min: 10,
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    category: 'Web Development',
    author: 'Mosh',
    tags: ['frontend'],
    isPublished: true,
    price: 15.8
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
    for (field in ex.errors) {
      // console.log(ex.errors[field]);
      console.log(ex.errors[field].message);
    }
  }
}

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({ _id: '5bf5f001e2c6bd1e10226f69' })
    // .skip((pageNumber - 1) * pageSize)
    // .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1, price: 1 });
  console.log(courses[0].price); // returns 16 -> even though, in database the value = 15.8 (because of getter)
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
// createCourse();
getCourses();
// updateCourse('5bf4f9270a56a7033b58bab8');
// removeCourse('5bf4f9270a56a7033b58bab8');
