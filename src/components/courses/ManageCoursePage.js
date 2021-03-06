import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';
import toastr from 'toastr';

class ManageCoursePage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      course: Object.assign({}, this.props.course),
      errors: {},
      loading: false
    };

    this.updateCourseForm = this.updateCourseForm.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.course.id != nextProps.course.id) {
      this.setState({ course: Object.assign({}, nextProps.course) });
    }
  }

  updateCourseForm(event) {
    const field = event.target.name;
    let course = this.state.course;
    course[field] = event.target.value;
    return this.setState({ course });
  }

  saveCourse(event) {
    event.preventDefault();
    this.setState({ loading: true });
    this.props.actions.saveCourse(this.state.course)
      .then(() => this.redirect())
      .catch(err => {
        toastr.error(err);
      });
  }

  redirect() {
    this.setState({ loading: true });
    toastr.success('Course Saved');
    this.context.router.push('/courses');
  }

  render() {
    const { course, errors, loading } = this.state;
    const { authors } = this.props;
    return (
      <div>
        <CourseForm
          allAuthors={authors} 
          course={course}
          errors={errors}
          onSave={this.saveCourse}
          onChange={this.updateCourseForm}
          loading={loading}/>
      </div>
    );
  }
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

ManageCoursePage.contextTypes = {
  router: PropTypes.object.isRequired
};

const getCourseById = (courses, id) => {
  const course = courses.filter(course => course.id === id);
  if (course) return course[0];
  return null;
};

function mapStateToProps(state, ownProps) {
  const courseId = ownProps.params.id;

  let course = { id: '', watchHref: '', title: '', authorId: '', length: '', category: '' };

  if (courseId && state.courses.length > 0) {
    course = getCourseById(state.courses, courseId);
  }

  const formattedAuthorData = state.authors.map(author => {
    return {
      value: author.id,
      text: `${author.firstName} ${author.lastName}`
    };
  });

  return {
    course,
    authors: formattedAuthorData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
